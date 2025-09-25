import { showToast } from "@/components/General/Notification/index.tsx";
import {fetcherApi, Response} from "../index.ts"
import {
    TExternalClasses,
    TExternalDisciplines,
    TExternalInstitution,
    TExternalSeries, TExternalStudents
} from "@/types/simples_externalAPI.ts";

const ExternalAPI = {
    prefix: "/external",
    getAllInstitutions: async function<T>(): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/institutions`, {
            method: "GET",
        })
    },
    getSeriesByInstitution: async function<T>(idInstitution: string): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/series/institution/${idInstitution}`, {
            method: "GET",
        })
    },
    getClassesBySeries: async function<T>(idSeries: string): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/class/series/${idSeries}`, {
            method: "GET",
        })
    },
    getDisciplinesBySeries: async function<T>(idClass: string): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/disciplines/series/${idClass}`, {
            method: "GET",
        })
    },
    getStudentsByClassAndSchoolYear: async function<T>(idClass: string, schoolYear: string): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/students/class/${idClass}/schoolYear/${schoolYear}`, {
            method: "GET",
        })
    },
    getClassByInstitutinAndSchoolYear: async function<T>(institutionId: string, schoolYear: string): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/class/institution/${institutionId}/schoolYear/${schoolYear}`, {
            method: "GET",
        })
    },
    getAllSeries: async function<T>(): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/series`, {
            method: "GET",
        })
    },
    getAllDisciplines: async function<T>(): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/disciplines`, {
            method: "GET",
        })
    },
    getClassBySchoolYearAndSeries: async function<T>(schoolYear: string, idSeries: string, idinstitution: string): Promise<Response<T>> {
        return fetcherApi(`${this.prefix}/class/schoolYear/${schoolYear}/seriesId/${idSeries}/institutionId/${idinstitution}`, {
            method: "GET",
        })
    }
}

export const getAllInstitutions = async () => {

    try {
        const response = await ExternalAPI.getAllInstitutions<TExternalInstitution[]>()

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
            data: [],
            render: "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export const getSeriesByInstitution = async (idInstitution: string) => {

    try {
        const response = await ExternalAPI.getSeriesByInstitution<TExternalSeries[]>(idInstitution)

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
            data: [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render: e.message || "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export const getClassesBySeries = async (idSeries: string) => {

    try {
        const response = await ExternalAPI.getClassesBySeries<TExternalClasses[]>(idSeries)

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
            data: [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render: e.message || "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export const getDisciplinesBySeries = async (idSeries: string) => {

    try {
        const response = await ExternalAPI.getDisciplinesBySeries<TExternalDisciplines[]>(idSeries)

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return []
        }

        return response.data

    } catch {
        showToast("Houve um erro ao se concectar com o servidor, verifique sua internet.", "error")
        return []
    }
}

export const getStudentsByClassAndSchoolYear = async (idClass: string, schoolYear: string) => {

    try {
        const response = await ExternalAPI.getStudentsByClassAndSchoolYear<TExternalStudents[]>(idClass, schoolYear)

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
            data: [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render: e.message || "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export const getClassByInstitutinAndSchoolYear = async (institutionId: string, schoolYear: string) => {

    try {
        const response = await ExternalAPI.getClassByInstitutinAndSchoolYear<TExternalClasses[]>(institutionId, schoolYear)

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
            data: [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render: e.message || "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export const getAllSeries = async () => {
    try {
        const response = await ExternalAPI.getAllSeries<TExternalSeries[]>()

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return []
        }

        return response.data
    } catch {
        showToast("Houve um erro ao se concectar com o servidor, verifique sua internet.", "error")
        return []
    }
}

export const getAllDisciplines = async () => {
    try {
        const response = await ExternalAPI.getAllDisciplines<TExternalDisciplines[]>()

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return []
        }

        return response.data

    } catch {
        showToast("Houve um erro ao se concectar com o servidor, verifique sua internet.", "error")
        return []
    }
}

export const getClassBySchoolYearAndSeries = async (schoolYear: string, idSeries: string, idinstitution: string) => {
    try {
        const response = await ExternalAPI.getClassBySchoolYearAndSeries<TExternalClasses[]>(schoolYear, idSeries, idinstitution)

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
            data: [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render: e.message || "Houver um erro interno",
            type: "error",
            autoClose: 3000,
            isLoading: false,
        }
    }
}

export default ExternalAPI