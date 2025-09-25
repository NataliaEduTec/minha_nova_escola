import { z } from "zod";
import {TReservationsFormValues} from "../../../../services/reservations";

export const schema = z.object({
    id_reserva: z.number({
        required_error: "Preencha a reserva corretamente"
    }),
    descricao: z.string().optional().nullable(),
    id_instalacao: z.number({
        required_error: "Escolha uma instalação",
    }),
    inicio_reserva: z.string({
        required_error: "Preencha este campo corretamente"
    }).datetime({
        message: "Preencha este campo corretamente"
    }),
    termino_reserva: z.string({
        required_error: "Preencha este campo corretamente"
    }).datetime({
        message: "Preencha este campo corretamente"
    }),
    equipamentos: z.array(z.object({
        id_equipamento: z.number({
            required_error: "Não foi possível encontrar o identificador do equipamento",
        }),
        quantidade: z.number({
            required_error: "Preencha a quantidade dos equipamentos  corretamente",
        })
    })).optional().nullable()
});

export function getDefaultValues<T extends Record<string, any>>(): T {
    return {} as T;
}

export const defaultValues: TReservationsFormValues = getDefaultValues<TReservationsFormValues>();

export type FormData = z.infer<typeof schema>;