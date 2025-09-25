import {fetcherApi, Response} from "./"

export type TLoginFormValues = {
    name: string;
    password: string;
}
export type TLoginValuesResponse = {
    nome_funcionario: string;
    id_funcionario: number;
    funcao: string
}


const LoginApi = {
    login: async <T>(values: TLoginFormValues): Promise<Response<T>> => {
        console.log(values)

        const result = await fetcherApi("/auth/login", {
            method: "POST",
            data: {
                email: values.name,
                password: values.password,
            }
        })

        console.log(result)
        return result
    },
    check: async () => (
        fetcherApi(`/auth/check`, {
            method: "GET",
        })
    ),

    logout: async () => (
        fetcherApi(`/auth/logout`, {
            method: "DELETE",
        })
    )
}

export default LoginApi