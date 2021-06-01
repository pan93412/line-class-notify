import { Scheduler, CourseCSVToCronTable } from "./parser";

export default async function main(): Promise<void> {
  Scheduler(await CourseCSVToCronTable("課表.csv"));
}
