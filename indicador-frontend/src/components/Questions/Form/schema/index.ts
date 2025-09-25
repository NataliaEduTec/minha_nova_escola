import { z } from "zod";

export const schema = z.object({
    name: z
        .string({
            required_error: "Nome deve ser preenchido",
        })
        .min(
        1, "Nome deve ter pelo menos 1 caracter"
        ),

    funcao: z.enum(["Admin", "Professor"], {
        required_error: "Selecione uma opção válida",
    }),
    registro: z.string().optional().nullable(),
    usuario: z
        .string({
            required_error: "Usuário deve ser preenchido",
        })
        .min(
            1, "Usuário deve ter pelo menos 1 caracter"
        )
        .max(
            50, "Usuário deve ter menos de 50 caracteres"
        ),
    password: z
        .string({
            required_error: "Senha deve ser preenchida",
        })
        .min(
            1, "Senha deve ter pelo menos 1 caracter"
        )
        .max(
            50, "Senha deve ter menos de 32 caracteres"
        ),
    max_reservas_mensais: z
        .number({
            required_error: "Máximo de reservas deve ser preenchida",
        })
        .min(
            0, "Reservas mensais deve ser igual a 0 ou maior!"
        ),
    max_equipamentos_reserva: z
        .number({
            required_error: "Máximo de reserva por equipamento deve ser preenchida",
        })
        .min(
            0, "Reservas de equipamentos deve ser igual a 0 ou maior!"
        ),
});

export const schemaPasswordOptional = z.object({
    name: z
        .string({
            required_error: "Nome deve ser preenchido",
        })
        .min(
            1, "Nome deve ter pelo menos 1 caracter"
        ),

    funcao: z.enum(["Admin", "Professor"], {
        required_error: "Selecione uma opção válida",
    }),
    registro: z.string().optional().nullable(),
    usuario: z
        .string({
            required_error: "Usuário deve ser preenchido",
        })
        .min(
            1, "Usuário deve ter pelo menos 1 caracter"
        )
        .max(
            50, "Usuário deve ter menos de 50 caracteres"
        ),
    password: z.string().optional(),
    max_reservas_mensais: z
        .number({
            required_error: "Máximo de reservas deve ser preenchida",
        })
        .min(
            0, "Reservas mensais deve ser igual a 0 ou maior!"
        ),
    max_equipamentos_reserva: z
        .number({
            required_error: "Máximo de reserva por equipamento deve ser preenchida",
        })
        .min(
            0, "Reservas de equipamentos deve ser igual a 0 ou maior!"
        ),
});

export const defaultValues = {
    name: "",
    funcao: ("Professor" as "Admin" | "Professor"),
    registro: null,
    usuario: "",
    password: "",
    max_reservas_mensais: 0,
    max_equipamentos_reserva: 0
}

export type FormData = z.infer<typeof schema>;