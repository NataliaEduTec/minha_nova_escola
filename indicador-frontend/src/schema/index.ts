import {z} from "zod";

export const seriesSchema = z.object({
    id: z.number(),
    description: z
        .string()
        .optional(),
})

export const disciplineSchema = z.object({
    id: z.number(),
    description: z
        .string()
        .optional(),
})

export type TSeriesFormValues = {
    id: number;
    description?: string;
}

export type TDisciplineFormValues = {
    id: number;
    description?: string;
}
