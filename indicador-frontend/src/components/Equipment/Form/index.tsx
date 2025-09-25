import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import EquipmentApi, {TEquipmentFormValues} from "../../../services/equipment";
import {toast} from "react-toastify";
import Loading from "../../General/Loading";
import InputControlled from "../../Elements/Input/Controlled";
import ColorPicker, {defaultColorPicker} from "../../General/ColorPicker";
import TextAreaControlled from "../../Elements/Textarea/Controlled";
import MultiSelect, {Option} from "../../Elements/Select/Multiple";
import {TCategoriesFormValues} from "../../../services/categories.ts";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    employee?: TEquipmentFormValues
    idEmployee?: number
    handleCloseModal: () => void
    categories?: TCategoriesFormValues[]
}

export default function Form ({onClick, reload, loading, employee, idEmployee, handleCloseModal, categories}: Props) {

    const [selected, setSelected] = useState<string[]>([]);
    const [cor, setCor] = useState(defaultColorPicker);
    const [options, setOptions] = useState<Option[]>([])

    const { handleSubmit, formState: { errors }, control, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues,
            cor: defaultColorPicker
        },
        mode: "onChange",
    });

    useEffect(() => {
        setValue("categorias", selected)
    }, [selected, setValue]);

    useEffect(() => {
        setValue("cor", cor)
    }, [cor, setValue]);

    useEffect(() => {
        if (employee) {
            setValue("descricao", employee?.descricao || "")
            setValue("cor", employee?.cor || "")
            setValue("quantidade_total", employee?.quantidade_total || 0)
            setValue("quantidade_disponivel_por_dia", employee?.quantidade_disponivel_por_dia || 0)

            setCor(employee?.cor || defaultColorPicker)

            const equipamentoCategorias = employee?.equipamento_categorias?.map(category => category.categoria_id_categoria.toString())

            setSelected(equipamentoCategorias ? equipamentoCategorias : [])
        }
    }, [employee, setValue])

    useEffect(() => {
        if (categories) {
            setOptions(categories.map(category => ({
                label: category.nome,
                value: category.id_categoria.toString()
            })))
        }
    }, [categories]);

    const onSubmit: SubmitHandler<TEquipmentFormValues> = async (data) => {
        if (idEmployee){
            await update(idEmployee, data)
            return
        }
        await register(data)
    }

    const update = async (id: number, data: TEquipmentFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.descricao === "") data.descricao = null

        try {
            const response = await EquipmentApi.update(id, data)

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

    const register = async (data: TEquipmentFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.descricao === "") data.descricao = null

        try {
            const response = await EquipmentApi.create(data)

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
            <h2 className="text-lg font-bold mb-4">Registro de Equipamento</h2>

            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className="md:col-span-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>
                    <InputControlled control={control} name={"nome"} placeholder={`Ex: Microfone`}/>
                    {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
                </div>

                <div>
                    <label htmlFor="quantidade_total" className="block text-sm font-medium text-gray-700">
                        Quantidade total
                    </label>
                    <InputControlled
                        control={control}
                        name={"quantidade_total"}
                        onChange={(e) => setValue("quantidade_total", parseFloat(e.target.value) || 0)}
                    />
                    {errors.quantidade_total && <p className="text-red-500">{errors.quantidade_total.message}</p>}
                </div>

                <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                        Quantidade disponivel por dia
                    </label>
                    <InputControlled
                        control={control}
                        name={"quantidade_disponivel_por_dia"}
                        onChange={(e) => setValue("quantidade_disponivel_por_dia", parseFloat(e.target.value) || 0)}
                    />
                    {errors.quantidade_disponivel_por_dia &&
                      <p className="text-red-500">{errors.quantidade_disponivel_por_dia.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Categoria
                    </label>
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        placeholder="Categorias..."
                    />

                    {errors.categorias && <p className="text-red-500">{errors.categorias.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Cor
                    </label>
                    <ColorPicker color={cor} setColor={setCor}/>
                    {errors.cor && <p className="text-red-500">{errors.cor.message}</p>}
                </div>

                <div className="mb-4 md:col-span-2">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <TextAreaControlled control={control} name={"descricao"}/>
                    {errors.descricao && <p className="text-red-500">{errors.descricao.message}</p>}
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