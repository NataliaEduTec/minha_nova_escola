import { z } from "zod";
import { v4 as uuid } from "uuid";

const alternativeSchema = z.object({
    id: z.string().uuid({ message: "ID da alternativa inválido" }),
    content: z
        .string({ required_error: "O conteúdo da alternativa é obrigatório" })
        .min(1, "O conteúdo da alternativa não pode estar vazio"),
    isCorrect: z.boolean(),
})

export const schema = z.object({
    id: z.string().uuid({ message: "ID da questão inválido" }),
    indicator_id: z.string().uuid({ message: "Escolha um indicador para essa questão" }),
    series_id: z.string().uuid({ message: "Escolha uma série para essa questão" }),
    content: z
        .string({ required_error: "Preencha o campo corretamente" })
        .min(1, "O conteúdo da pergunta é obrigatório"),
    type: z.enum(['single', 'multiple'], {
        required_error: "O tipo da questão deve ser 'única' ou 'multipla'",
    }),
    alternatives: z
        .array(alternativeSchema)
        .min(1, { message: "A pergunta deve conter pelo menos uma alternativa" })
        .optional(),
    difficulte_level: z.enum(['easy', 'medium', 'hard'], {
        required_error: "O nível de dificuldade deve ser 'fácil', 'médio' ou 'difícil'",
    }),
})

export const fullSchema = z.object({
    questions: z.array(schema),
})

export const defaultValues = {
    id: uuid(),
    indicator_id: "",
    series_id: "",
    content: "",
    type: "single" as const,
    alternatives: [
        {
            id: uuid(),
            content: "",
            isCorrect: false,
        },
    ],
    difficulte_level: "easy" as const,
}

export type FormData = z.infer<typeof fullSchema>
// export type FormData = z.infer<typeof schema>;
export type FormDataArray = z.infer<typeof schema>[]
export const schemaArray = z.array(schema);


