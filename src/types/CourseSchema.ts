import myzod, { Infer } from "myzod";

export const CourseSchema = myzod.object({
    week: myzod.string().pattern(/^\d+$/),
    chap: myzod.string().pattern(/^\d+$/),
    start: myzod.string().pattern(/^\d+:\d+$/),
    end: myzod.string().pattern(/^\d+:\d+$/),
    course: myzod.string(),
});

export type Course = Infer<typeof CourseSchema>;
