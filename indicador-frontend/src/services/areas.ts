import {fetcherApi} from "./"
import {TypeOptions} from "react-toastify";

export type TAreasFormValues = {
    id?: number;
    name: string;
    color?: string;
    description?: string | null;
}

export type TAreasFormValuesPT = {
    id_area: number;
    nome: string;
    cor?: string;
    descricao?: string | null;
}


type Response<T> = {
    status: Exclude<TypeOptions, "default">;
    message: string;
    data: T;
}

const AreasApi = {
    create: async <T>(values: TAreasFormValues): Promise<Response<T>> => (
        fetcherApi("/areas", {
            method: "POST",
            data: {
                nome: values.name,
                descricao: values.description,
                cor: values.color
            }
        })
    ),
    getAll: async <T>(): Promise<Response<T>> => (
        fetcherApi("/areas", {method: "GET"})
    ),
    deleteById: async <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/areas/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/areas/${id}`, {method: "GET"})
    ),
    update: async (id: number, values: TAreasFormValues) => (
        fetcherApi(`/areas/${id}`, {
            method: "PUT",
            data: {
                nome: values.name,
                descricao: values.description,
                cor: values.color
            }
        })
    )
}

export default AreasApi