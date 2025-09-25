import { z } from "zod";
import {TInstallationFormValues} from "../../../../../services/installations.ts";

export const schema = z.object({
    nome: z
        .string({
            required_error: "Nome deve ser preenchido",
        })
        .min(
        1, "Nome deve ter pelo menos 1 caracter"
        ),
    descricao: z.string().optional().nullable(),
    area_id_area: z.number({
        required_error: "Escolha uma área",
    }),
    capacidade_pessoas: z
        .number({
            required_error: "A capacidade de pessoas deve ser um número inteiro maior ou igual a 1!",
        })
        .min(
            0, "A capacidade de pessoas deve ser um número inteiro maior ou igual a 1!"
        ),
    horas_max_reserva: z
        .number({
            required_error: "As horas máximas de reserva devem ser um número inteiro maior ou igual a 1!",
        })
        .min(
            0, "As horas máximas de reserva devem ser um número inteiro maior ou igual a 1!"
        ),
    cor: z
        .string({
            required_error: "Cor deve ser preenchida corretamente",
        })
        .min(
            7, "A cor deve ser HEX (hexadecimal)!"
        ),
    categorias: z.array(z.string(), {
            required_error: "Selecione entre 1 e 4 categorias!",
        })
        .min(1, "Selecione entre 1 e 4 categorias!")
        .max(4, "Selecione entre 1 e 4 categorias!"),
});

export function getDefaultValues<T extends Record<string, any>>(): T {
    return {} as T;
}

export const defaultValues: TInstallationFormValues = getDefaultValues<TInstallationFormValues>();

export type FormData = z.infer<typeof schema>;