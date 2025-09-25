import { z } from "zod";
import {TEquipmentFormValues} from "../../../../services/equipment.ts";

export const schema = z.object({
    nome: z
        .string({
            required_error: "Nome deve ser preenchido",
        })
        .min(
        1, "Nome deve ter pelo menos 1 caracter"
        ),
    descricao: z.string().optional().nullable(),
    quantidade_total: z
        .number({
            required_error: "A quantidade total deve ser maior ou igual 0!",
        })
        .min(
            0, "A quantidade total deve ser maior ou igual 0!"
        ),
    quantidade_disponivel_por_dia: z
        .number({
            required_error: "A quantidade disponível por dia deve ser maior ou igual 0!",
        })
        .min(
            0, "A quantidade disponível por dia deve ser maior ou igual 0!"
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

export const defaultValues: TEquipmentFormValues = getDefaultValues<TEquipmentFormValues>();

export type FormData = z.infer<typeof schema>;