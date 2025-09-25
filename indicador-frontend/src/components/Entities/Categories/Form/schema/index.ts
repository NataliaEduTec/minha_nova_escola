import { z } from "zod";

export const schema = z.object({
    id_categoria: z.number(),
    nome: z
        .string({
            required_error: "Nome deve ser preenchido",
        })
        .min(
        1, "Nome deve ter pelo menos 1 caracter"
        ),
});

export type FormData = z.infer<typeof schema>;