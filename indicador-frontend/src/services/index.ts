import axios, {AxiosRequestConfig, isAxiosError} from "axios"
import {TypeOptions} from "react-toastify";
import {showToast} from "@/components/General/Notification";

export const api = axios.create({
    baseURL: (window as any).BACKEND_URL,
    headers: {
        "Content-type": "application/json"
    },
    withCredentials: true,
})

export async function fetcherApi(url: string, config?: AxiosRequestConfig) {
    try {
        const res = await api(url, config)

        if (res.status === 401) {
            showToast("Você não está logado", "error")

            setTimeout(() => {
                window.location.href = "/indicadores/login"
            }, 4000)
        }

        return res.data
    } catch (e) {
        if (isAxiosError(e)) {
            return e?.response?.data
        }
    }
}

export type Response<T> = {
    status: Exclude<TypeOptions, "default">;
    message: string;
    data: T;
    error?: string;
}