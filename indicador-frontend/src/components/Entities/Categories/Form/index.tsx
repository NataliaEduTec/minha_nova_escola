import InputControlled from "../../../Elements/Input/Controlled";
import Loading from "../../../General/Loading";
import {TCategoriesFormValues} from "../../../../services/categories.ts";
import {toast} from "react-toastify";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect} from "react";
import {FormData, schema} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import CategoriesApi from "../../../../services/categories.ts";
import SelectControlled from "../../../Elements/Select/Controlled";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    category?: TCategoriesFormValues
    idCategory?: number
}

export default function Form ({onClick, reload, loading, category, idCategory}: Props) {

    const { handleSubmit, formState: { errors }, control, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id_categoria: 0,
            nome: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        setValue("nome", category?.nome || "")
    }, [category, setValue])

    const onSubmit: SubmitHandler<TCategoriesFormValues> = async (data) => {
        if (idCategory){
            await update(idCategory, data)
            return
        }
        await register(data)
    }

    const update = async (id: number, data: TCategoriesFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            const response = await CategoriesApi.update(id, data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                reload()
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

    const register = async (data: TCategoriesFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            const response = await CategoriesApi.create(data)

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
            <h2 className="text-lg font-bold mb-4">Registro de Questão</h2>

            <section className={`grid grid-cols-2 gap-4`}>
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <InputControlled control={control} name={"nome"} placeholder={`Ex: Questão 1`}/>
                    {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
                </div>

                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nível de dificuldade
                    </label>
                    <SelectControlled control={control} name={"funcao"}>
                        <option disabled selected>Selecione a dificuldade</option>
                        <option value={"Admin"}>Fácil</option>
                        <option value={"Professor"}>Médio</option>
                        <option value={"Professor"}>Difícil</option>
                    </SelectControlled>
                </div>

                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Alternativas
                    </label>
                    <ol>
                        <li>
                            <input type={"radio"}/>
                            A) Alternativa 1
                        </li>
                        <li>
                        <input type={"radio"}/>
                            B) Alternativa 2
                        </li>
                        <li>
                        <input type={"radio"}/>
                            C) Alternativa 3
                        </li>
                        <li>
                        <input type={"radio"}/>
                            D) Alternativa 3
                        </li>
                        <li>
                        <input type={"radio"} />
                            E) Alternativa 3
                        </li>
                        <li>
                            Inserir mais uma alternativa
                        </li>
                    </ol>
                </div>

                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Resposta correta
                    </label>
                    <InputControlled control={control} name={"nome"} placeholder={`Ex: Questão 1`}/>

                </div>

                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Autor da Questão
                    </label>
                    <SelectControlled control={control} name={"funcao"}>
                        <option disabled selected>Selecione um autor</option>
                    </SelectControlled>
                </div>

                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Indicador
                    </label>
                    <SelectControlled control={control} name={"funcao"}>
                        <option disabled selected>Selecione um indicador</option>
                    </SelectControlled>
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