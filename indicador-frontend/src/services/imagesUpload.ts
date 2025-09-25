import {fetcherApi} from "./"
import {TypeOptions} from "react-toastify";

export type TAreasFormValues = {
    id?: number;
    name: string;
    color?: string;
    description?: string | null;
}



type Response<T> = {
    status: Exclude<TypeOptions, "default">;
    message: string;
    data: T;
}

const ImageApi = {
    upload: async <T>(values: FormData): Promise<Response<T>> => (
        fetcherApi("/upload", {
            method: "POST",
            data: values
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

export default ImageApi