import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema, schemaPasswordOptional} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import EmployeeApi, {TEmployeeFormValues} from "../../../services/employee";
import {toast} from "react-toastify";
import Loading from "../../General/Loading";
import InputControlled from "../../Elements/Input/Controlled";
import SelectControlled from "../../Elements/Select/Controlled";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    employee?: TEmployeeFormValues
    idEmployee?: number
    handleCloseModal: () => void
}

export default function Form ({onClick, reload, loading, employee, idEmployee, handleCloseModal}: Props) {

    const { handleSubmit, formState: { errors }, control, setValue, reset } = useForm<FormData>({
        resolver: idEmployee ? zodResolver(schemaPasswordOptional) : zodResolver(schema),
        defaultValues: {
            ...defaultValues
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (employee) {
            setValue("name", employee?.name || "")
            setValue("funcao", employee.funcao)
            setValue("usuario", employee?.usuario || "")
            setValue("max_reservas_mensais", employee?.max_reservas_mensais || 0)
            setValue("max_equipamentos_reserva", employee?.max_equipamentos_reserva || 0)
            setValue("registro", employee?.registro || "")
            setValue("password", "")
        }
    }, [employee, setValue])

    const onSubmit: SubmitHandler<TEmployeeFormValues> = async (data) => {
        if (idEmployee){
            await update(idEmployee, data)
            return
        }
        await register(data)
    }

    const update = async (id: number, data: TEmployeeFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.registro === "")
            data.registro = null

        try {
            const response = await EmployeeApi.update(id, data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                reload()
                handleCloseModal()
            }
        } catch (e) {
            console.error(e)

            toast.update(toastId, {
                render: "Houver um erro interno",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
        }
    }

    const register = async (data: TEmployeeFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.registro === "")
            data.registro = null

        try {
            const response = await EmployeeApi.create(data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                reload()
                reset()
            }
        } catch (e) {
            console.error(e)

            toast.update(toastId, {
                render: "Houver um erro interno",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
        }
    }

    if(loading)
        return (
            <Loading />
        )

    return (
        <form className={``} onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold mb-4">Registro de funcionário</h2>

            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>
                    <InputControlled control={control} name={"name"} placeholder={`Ex: João`} />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div className={`col-span-2`}>
                    <label htmlFor="funcao" className="block text-sm font-medium text-gray-700">
                        Função
                    </label>

                    <SelectControlled control={control} name={"funcao"}>
                        <option disabled selected>Selecione uma função</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"professor"}>Professor</option>
                    </SelectControlled>
                </div>

                <div>
                    <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                        Usuário
                    </label>
                    <InputControlled control={control} name={"usuario"} placeholder={`Ex: joao`} />
                    {errors.usuario && <p className="text-red-500">{errors.usuario.message}</p>}
                </div>

                <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                        Senha
                    </label>
                    <InputControlled type={"password"} control={control} name={"password"} />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
            </section>

            <div className="mt-4 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClick}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                    Enviar
                </button>
            </div>
        </form>
    );
}