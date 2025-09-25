import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema, schemaPasswordOptional} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import EmployeeApi, {TEmployeeFormValues} from "../../../services/employee";
import {toast} from "react-toastify";
import Loading from "../../General/Loading";
import InputControlled from "../../Elements/Input/Controlled";
import SelectSearchable from "../../Elements/Select/Searchable";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    employee?: TEmployeeFormValues
    idEmployee?: number
    handleCloseModal: () => void
}

export default function Form ({onClick, reload, loading, idEmployee, handleCloseModal}: Props) {

    const { handleSubmit, formState: { errors }, control, reset } = useForm<FormData>({
        resolver: idEmployee ? zodResolver(schemaPasswordOptional) : zodResolver(schema),
        defaultValues: {
            ...defaultValues
        },
        mode: "onChange",
    });

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
        <form className={`min-h-[20rem] max-h-full`} onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold mb-4 ">Registro de indicador</h2>

            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Código
                    </label>
                    <InputControlled control={control} name={"name"}/>
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="funcao" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>

                    <InputControlled control={control} name={"name"}/>
                </div>

                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Série
                    </label>
                    <SelectSearchable options={[
                        {
                            label: "Selecione a Série",
                            value: "0"
                        },
                        {
                            label: "ANO: 6º ANO M2",
                            value: "1"
                        }
                    ]} value={"1"} onChange={(v) => console.log(v)}/>
                </div>

                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Disciplina
                    </label>
                    <SelectSearchable options={[
                        {
                            label: "Selecione a disciplina",
                            value: "0"
                        },
                        {
                            label: "Geografia",
                            value: "1"
                        }
                    ]} value={"1"} onChange={(v) => console.log(v)}/>
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