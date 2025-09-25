import {fetcherApi, Response} from "./"
import {TDisciplineFormValues, TSeriesFormValues} from "@/schema";
import {showToast} from "@/components/General/Notification";

export type TIndicatorFormValues = {
    id: string;
    code: string;
    description?: string;
    series: TSeriesFormValues[];
    disciplines: TDisciplineFormValues[];
    type: string;
}

const IndicatorsApi = {
    create: async <T>(values: TIndicatorFormValues): Promise<Response<T>> => (
        fetcherApi("/indicators", {
            method: "POST",
            data: {...values}
        })
    ),
    getAll: async <T>(
        name = '', 
        ids: string[] = [], 
        disciplinesMulti: string[] = [], 
        selectedIndicatorType = '',
        seriesMulti: string[] = []
    ): Promise<Response<T>> => {

        const queryParams = `name=${name}&ids=${ids.join(",")}&disciplines=${disciplinesMulti.join(",")}&indicatorType=${selectedIndicatorType}&series=${seriesMulti.join(",")}`

        return fetcherApi(`/indicators?${queryParams}`, {method: "GET"})
    },
    getBySeriesAndDiscipline: async <T>(seriesId: string, disciplineId: string): Promise<Response<T>> => (
        fetcherApi(`/indicators/series/${seriesId}/disciplines/${disciplineId}`, {method: "GET"})
    ),
    deleteById: async <T>(id: string): Promise<Response<T>> => (
        fetcherApi(`/indicators/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: string): Promise<Response<T>> => (
        fetcherApi(`/indicators/${id}`, {method: "GET"})
    ),
    update: async (id: string, values: TIndicatorFormValues) => (
        fetcherApi(`/indicators/${id}`, {
            method: "PUT",
            data: {...values}
        })
    ),
    getBySeriesAndDisciplineAndType: async <T>(seriesId: string, disciplineId: string, type: string): Promise<Response<T>> => (
        fetcherApi(`/indicators/series/${seriesId}/disciplines/${disciplineId}/type/${type}`, {method: "GET"})
    ),
}

export const getAllIndicators = async (name = '', ids: string[] = []): Promise<TIndicatorFormValues[] | undefined> => {
    try {
        const response = await IndicatorsApi.getAll<TIndicatorFormValues[]>(name, ids)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return []
        }

        return response.data
    } catch {
        showToast("Houve um erro ao se conectar, verifique sua internet.", "error")
        return []
    }
}

export const getIndicatorsBySeriesAndDiscipline = async (idSeries: string, idDisciplene: string): Promise<TIndicatorFormValues[] | undefined> => {
    try {
        const response = await IndicatorsApi.getBySeriesAndDiscipline<TIndicatorFormValues[]>(idSeries, idDisciplene)

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return []
        }

        return response.data
    } catch {
        showToast("Houve um erro ao se conectar, verifique sua internet.", "error")
        return []
    }
}

export const getIndicatorsBySeriesAndDisciplineAndType = async (idSeries: string, idDisciplene: string, type: string): Promise<TIndicatorFormValues[] | undefined> => {
    try {
        const response = await IndicatorsApi.getBySeriesAndDisciplineAndType<TIndicatorFormValues[]>(idSeries, idDisciplene, type)

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return []
        }

        return response.data
    } catch {
        showToast("Houve um erro ao se conectar, verifique sua internet.", "error")
        return []
    }
}

export const getIndicatorById = async (id: string): Promise<TIndicatorFormValues | undefined> => {
    try {
        const response = await IndicatorsApi.getUnique<TIndicatorFormValues>(id)

        if (response.status !== "success") {
            showToast(response.message, response.status)
            return undefined
        }

        return response.data
    } catch {
        showToast("Houve um erro ao se conectar, verifique sua internet.", "error")
        return undefined
    }
}

export default IndicatorsApi