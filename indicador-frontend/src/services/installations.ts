import {fetcherApi, Response} from "./"
import {TAreasFormValuesPT} from "./areas.ts";

type InstallationCategory = {
    categoria_id_categoria: number
}

export type TInstallationFormValues = {
    id_instalacao?: number;
    nome: string;
    descricao?: string | null;
    capacidade_pessoas: number;
    horas_max_reserva: number;
    area_id_area?: number;
    cor?: string;
    categorias?: string[];
    instalacao_categorias?: InstallationCategory[];
    area?: TAreasFormValuesPT
}


const InstallationApi = {
    create: async <T>(values: TInstallationFormValues): Promise<Response<T>> => (
        fetcherApi("/instalacoes", {
            method: "POST",
            data: {...values}
        })
    ),
    getAll: async <T>(): Promise<Response<T>> => (
        fetcherApi("/instalacoes", {method: "GET"})
    ),
    deleteById: async <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/instalacoes/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/instalacoes/${id}`, {method: "GET"})
    ),
    update: async (id: number, values: TInstallationFormValues) => (
        fetcherApi(`/instalacoes/${id}`, {
            method: "PUT",
            data: {...values}
        })
    )
}

export default InstallationApi