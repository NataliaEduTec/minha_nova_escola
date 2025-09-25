import {fetcherApi} from "./"
import {TypeOptions} from "react-toastify";

export type TCategoriesFormValues = {
    id_categoria: number;
    nome: string;
}


type Response<T> = {
    status: Exclude<TypeOptions, "default">;
    message: string;
    data: T;
}

const CategoriesApi = {
    create: async <T>(values: TCategoriesFormValues): Promise<Response<T>> => (
        fetcherApi("/categorias", {
            method: "POST",
            data: {...values}
        })
    ),
    getAll: async <T>(): Promise<Response<T>> => (
        fetcherApi("/categorias", {method: "GET"})
    ),
    deleteById: async <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/categorias/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/categorias/${id}`, {method: "GET"})
    ),
    update: async (id: number, values: TCategoriesFormValues) => (
        fetcherApi(`/categorias/${id}`, {
            method: "PUT",
            data: {...values}
        })
    )
}

export default CategoriesApi