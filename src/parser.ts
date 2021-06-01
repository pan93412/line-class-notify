import csvParser from "csv-parser";
import fs from "fs";
import cron from "node-cron";
import { ValidationError } from "myzod";
import { CourseStatus, PostMessage } from "./postMessage";
import type { Course } from "./types/CourseSchema";
import { CourseSchema } from "./types/CourseSchema";
import GetEnv from "./utils/env_get_or_throw";

const LINE_TOKEN = GetEnv("LINE_TOKEN");

export interface CronTable {
  cron: string;
  action: () => void;
}

/**
 * 解析 CSV 課表
 *
 * CSV 課表的格式必須如下：
 *
 * ```csv
 * week,chap,start,end,course
 * 1,1,08:10,09:00,體育
 * 1,2,09:10,10:00,數學
 * 1,3,10:10,11:00,國文
 * ```
 *
 * 必須有標題列，名稱請固定以便讀取。
 * 必須有五行。
 *
 * CSV 可以用 Excel 做。
 *
 * @param filename CSV 檔案
 */
function CourseCSVParser(filename: string): Promise<Course[]> {
  return new Promise((resolve, reject) => {
    const courseTable: Course[] = [];
    const contentLineNumber = 2;
    fs.createReadStream(filename)
      .pipe(csvParser())
      .on("data", (data: unknown) => {
        const course = CourseSchema.try(data);

        if (course instanceof ValidationError) {
          reject(new Error(`Line ${contentLineNumber}: Malformed!`));
          return;
        }

        courseTable.push(course);
      })
      .on("end", () => resolve(courseTable))
      .on("error", reject);
  });
}

function CourseListToCronTable(courseList: Course[]): CronTable[] {
  const endTable: CronTable[] = [];
  const endAppender =
    ([eh, em]: string[], week: string) =>
    (course: string) =>
      endTable.push({
        cron: `0 ${em} ${eh} * * ${week}`,
        action: () =>
          PostMessage(
            {
              status: CourseStatus.ENDED,
              course,
            },
            LINE_TOKEN
          ),
      });

  let endWork: ((course: string) => void) | null = null;
  const startTable = courseList.map(({ week, start, end, course }) => {
    // Why I do that is because of I need to get the current
    // course with the previous "end" time.  If we have the
    // non-processed previous "end" time, we will process it first.
    // Then, we set endWork to "null" and wait for the next task.
    if (endWork) {
      endWork(course);
      endWork = null;
    }

    const timeHmParser = (time: string) => time.split(":");
    const [sh, sm] = timeHmParser(start);
    endWork = endAppender(timeHmParser(end), week);

    return {
      cron: `0 ${sm} ${sh} * * ${week}`,
      action: () =>
        PostMessage(
          {
            status: CourseStatus.STARTED,
            course,
          },
          LINE_TOKEN
        ),
    };
  });

  return [...startTable, ...endTable];
}

export async function CourseCSVToCronTable(
  filename: string
): Promise<CronTable[]> {
  return CourseListToCronTable(await CourseCSVParser(filename));
}

export function Scheduler(cronTable: CronTable[]): void {
  cronTable.forEach(({ cron: _cron, action }) => {
    // console.debug(`Registered: ${_cron}`);
    cron.schedule(_cron, action);
  });
}
