import { z } from "zod";

export const schema = z.object({
    name: z
        .string({
            required_error: "Nome deve ser preenchido",
        })
        .min(
        3, "Nome deve ter pelo menos 3 caracteres"
        ),
    color: z
        .string({
            required_error: "A cor deve ser preenchida corretamente",
        }),
    description: z .string().optional().nullable()
});

export type FormData = z.infer<typeof schema>;