import {fetcherApi} from "./"
import {TypeOptions} from "react-toastify";
import {TInstallationFormValues} from "./installations.ts";
import {TEmployeeFormValues} from "./employee.ts";

type Equipamento  = {
    id_equipamento: number,
    quantidade: number
}

type ReservaEquipamento  = {
    equipamento_id_equipamento: number,
    quantidade: number
}

export type TReservationsFormValues = {
    id_reserva: number;
    descricao?: string | null,
    id_instalacao: number,
    instalacao_id_instalacao?: number,
    inicio_reserva: string,
    termino_reserva: string,
    equipamentos?: Equipamento[] | null
    reserva_equipamentos?: ReservaEquipamento[] | null
    instalacao?: TInstallationFormValues
    funcionario?: TEmployeeFormValues
}

type Response<T> = {
    status: Exclude<TypeOptions, "default">;
    message: string;
    data: T;
}

const ReservationsApi = {
    create: async <T>(values: TReservationsFormValues): Promise<Response<T>> => (
        fetcherApi("/reservas", {
            method: "POST",
            data: {...values }
        })
    ),
    getAll: async <T>(params?: string): Promise<Response<T>> => (
        fetcherApi(`/reservas${params || ""}`, {method: "GET"})
    ),
    deleteById: async <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/reservas/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/reservas/${id}`, {method: "GET"})
    ),
    update: async (id: number, values: TReservationsFormValues) => (
        fetcherApi(`/reservas/${id}`, {
            method: "PUT",
            data: {...values}
        })
    )
}

export default ReservationsApi