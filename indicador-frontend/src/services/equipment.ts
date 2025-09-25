import {fetcherApi, Response} from "./"

type EquipmentCategory = {
    categoria_id_categoria: number
}

export type TEquipmentFormValues = {
    id_equipamento?: number;
    nome: string;
    descricao?: string | null;
    quantidade_total: number;
    quantidade_disponivel_por_dia: number;
    cor?: string;
    categorias?: string[];
    equipamento_categorias?: EquipmentCategory[];
}


const EquipmentApi = {
    create: async <T>(values: TEquipmentFormValues): Promise<Response<T>> => (
        fetcherApi("/equipamentos", {
            method: "POST",
            data: {...values}
        })
    ),
    getAll: async <T>(): Promise<Response<T>> => (
        fetcherApi("/equipamentos", {method: "GET"})
    ),
    deleteById: async <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/equipamentos/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/equipamentos/${id}`, {method: "GET"})
    ),
    update: async (id: number, values: TEquipmentFormValues) => (
        fetcherApi(`/equipamentos/${id}`, {
            method: "PUT",
            data: {...values}
        })
    )
}

export default EquipmentApi