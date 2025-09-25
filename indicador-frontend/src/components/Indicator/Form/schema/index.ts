import { z } from "zod";
import {disciplineSchema, seriesSchema} from "@/schema";
import {v4 as uuid} from "uuid";

export const schema = z.object({
    id: z.string().uuid({ message: "ID do indicador inválido" }),
    code: z
        .string({
            required_error: "O código deve ser preenchido",
        })
        .min(
        1, "O código deve ter pelo menos 1 caracter"
        ),
    description: z.string().optional(),
    series: z
        .array(seriesSchema)
        .min(1, { message: "O indicador deve conter pelo menos um curso." }),
    disciplines: z
        .array(disciplineSchema)
        .min(1, { message: "O indicador deve conter pelo menos uma disciplina." }),
    type: z.string({
        required_error: "O tipo de indicador deve ser preenchido",
    }),
});

export const defaultValues = {
    id: uuid(),
    code: "",
    description: "",
    series: [{id: 0, description: ""}],
    disciplines: [{id: 0, description: ""}],
    type: "",
}

export type FormData = z.infer<typeof schema>;