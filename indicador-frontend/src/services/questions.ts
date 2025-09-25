import {fetcherApi, Response} from "./"

export type TAlternativeFormValues = {
    id: string
    content: string
    isCorrect: boolean
    questions_id: string
}

export type TQuestionFormValues = {
    id: string
    content: string
    type: 'single' | 'multiple'
    alternatives?: TAlternativeFormValues[]
    error?: string
    indicator_id: string
    series_id: string
    discipline_id?: string
}

const QuestionsApi = {
    create: async <T>(values: TQuestionFormValues[]): Promise<Response<T>> => (
        fetcherApi("/questions", {
            method: "POST",
            data: {questions: values}
        })
    ),
    getAll: async <T>(params: string): Promise<Response<T>> => (
        fetcherApi(`/questions?${params}`, {method: "GET"})
    ),
    deleteById: async <T>(id: string): Promise<Response<T>> => (
        fetcherApi(`/questions/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: string): Promise<Response<T>> => (
        fetcherApi(`/questions/${id}`, {method: "GET"})
    ),
    update: async (id: string, values: TQuestionFormValues) => (
        fetcherApi(`/questions/${id}`, {
            method: "PUT",
            data: {...values}
        })
    )
}

export default QuestionsApi