import { Scheduler, CourseCSVToCronTable } from "./parser";

export default async function main() {
  Scheduler(await CourseCSVToCronTable("課表.csv"));
}
