import { Scheduler, CourseCSVToCronTable } from "./parser";
import GetEnv from "./utils/env_get_or_throw";

export default async function main(): Promise<void> {
  Scheduler(await CourseCSVToCronTable(GetEnv("TIMETABLE_FILENAME")));
}
