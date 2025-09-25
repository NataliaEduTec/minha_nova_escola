import { showToast } from "@/components/General/Notification";
import {fetcherApi, Response} from "./"
import {TDiagnostic, TDiagnosticQuestionnaire} from "@/components/Diagnostic/Form/schema.ts";
import { Id, toast } from "react-toastify";


const DiagnosticsApi = {
    getAll: async <T>(params: string): Promise<Response<T>> => (
        fetcherApi(`/diagnostics/filter/${params}`, {method: "GET"})
    ),
    create: async <T>(data: T): Promise<Response<T>> => (
        fetcherApi(`/diagnostics`, {
            method: "POST",
            data
        })
    ),
    getById: async <T>(id: string): Promise<Response<T>> => (
        fetcherApi(`/diagnostics/${id}`, {method: "GET"})
    ),
    update: async <T>(id: string, data: T): Promise<Response<T>> => (
        fetcherApi(`/diagnostics/${id}`, {
            method: "PUT",
            data
        })
    ),
    delete: async <T>(id: string): Promise<Response<T>> => (
        fetcherApi(`/diagnostics/${id}`, {
            method: "DELETE"
        })
    )
}

export const getAllDiagnostics = async (params: string) => {

    try {
        const response = await DiagnosticsApi.getAll<TDiagnostic[]>(params)

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return []
        }

        return response.data
    } catch {
        showToast("Houve um erro interno", "error")
        return []
    }
}

export const createDiagnostic = async (data: TDiagnostic & { questionnaire?: TDiagnosticQuestionnaire; }) => {
    try {
        const response = await DiagnosticsApi.create<TDiagnostic>(data)

        if (response.status !== "success") {
            throw new Error(response.message)
        }

        return {
            data: response.data,
            render: response.message,
            type: response.status,
            autoClose: 3000,
            isLoading: false,
        }

    } catch (e) {
        console.error(e)

        return {
            data: null,
            render: "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export const getDiagnosticById = async (id: string) => {
    try {
        const response = await DiagnosticsApi.getById<TDiagnostic>(id)
        if (response.status !== "success") {
            showToast(response.message, response.status)
            return null
        }
        return response.data
    } catch {
        showToast("Houver um erro interno", "error")
        return null
    }
}

export const updateDiagnostic = async (id: string, data: TDiagnostic): Promise<Response<TDiagnostic | null>> => {
    try {
        const response = await DiagnosticsApi.update<TDiagnostic>(id, data)
        return response
    } catch {
        return {
            status: "error",
            message: "Houver um erro interno",
            data: null,
        }
    }
}

export const deleteDiagnostic = async (id: string, idToast: Id): Promise<boolean> => {
    try {
        const response = await DiagnosticsApi.delete<null>(id)
        showToast(response.message, response.status)

        toast.update(idToast, {
            render: response.message,
            type: response.status,
            isLoading: false,
            autoClose: 3000
        })
        return response.status === "success"
    } catch {
        showToast("Houver um erro interno", "error")
        toast.update(idToast, {
            render: "Houver um erro interno",
            type: "error",
            isLoading: false,
            autoClose: 3000
        })

        return false
    }
}

export default DiagnosticsApi