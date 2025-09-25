import {fetcherApi, Response} from "./"

export type TEmployeeFormValues = {
    id_funcionario?: number;
    name: string;
    funcao: "Admin" | "Professor";
    registro?: string | null;
    usuario: string;
    password: string;
    max_reservas_mensais?: number;
    max_equipamentos_reserva?: number;
}

export type TEmployeeFormValuesUpdate = {
    id_funcionario?: number;
    nome: string;
    funcao: "Admin" | "Professor";
    registro?: string | null;
    usuario: string;
    max_reservas_mensais?: number;
    max_equipamentos_reserva?: number;
} & {
    password?: string | null;
}

export type TEmployee = {
    id: string;
    email: string;
    name: string
}

const EmployeeApi = {
    create: async <T>(values: TEmployeeFormValues): Promise<Response<T>> => (
        fetcherApi("/users", {
            method: "POST",
            data: {...values, email: values.usuario}
        })
    ),
    getAll: async <T>(): Promise<Response<T>> => {
        const result = await fetcherApi("/users", {method: "GET"})

        return {
            data: result.data.map((u: TEmployee) => ({
                ...u,
                id_funcionario: u.id,
                usuario: u.email,
            })),
            status: result.status,
            message: result.message,
        }
    },
    deleteById: async <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/funcionarios/${id}`, {method: "DELETE"})
    ),
    getUnique: async  <T>(id: number): Promise<Response<T>> => (
        fetcherApi(`/funcionarios/${id}`, {method: "GET"})
    ),
    update: async (id: number, values: TEmployeeFormValues) => (
        fetcherApi(`/user/${id}`, {
            method: "PUT",
            data: {...values, email: values.usuario}
        })
    )
}

export default EmployeeApi