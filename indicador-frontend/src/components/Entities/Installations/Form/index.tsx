import ColorPicker, {defaultColorPicker} from "../../../General/ColorPicker";
import MultiSelect, {Option} from "../../../Elements/Select/Multiple";
import {useEffect, useState} from "react";
import {TCategoriesFormValues} from "../../../../services/categories.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import Loading from "../../../General/Loading";
import {toast} from "react-toastify";
import InstallationApi, {TInstallationFormValues} from "../../../../services/installations.ts";
import InputControlled from "../../../Elements/Input/Controlled";
import TextAreaControlled from "../../../Elements/Textarea/Controlled";
import { TAreasFormValuesPT} from "../../../../services/areas.ts";
import SelectSearchable, {SelectOption} from "../../../Elements/Select/Searchable";

type InstallationsProps = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    installation?: TInstallationFormValues
    idInstalation?: number
    handleCloseModal: () => void
    categories?: TCategoriesFormValues[]
    areas?: TAreasFormValuesPT[]
}

export default function Form ({onClick, reload, loading, installation, idInstalation, handleCloseModal, categories, areas}: InstallationsProps) {

    const [selected, setSelected] = useState<string[]>([]);
    const [cor, setCor] = useState(defaultColorPicker);
    const [options, setOptions] = useState<Option[]>([])
    const [optionsArea, setOptionsArea] = useState<SelectOption[]>([])
    const [selectedArea, setSelectedArea] = useState('');

    const { handleSubmit, formState: { errors }, control, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues,
            cor: defaultColorPicker
        },
        mode: "onChange",
    });

    useEffect(() => {
        setValue("area_id_area", parseInt(selectedArea))
    }, [selectedArea, setValue]);

    useEffect(() => {
        setValue("categorias", selected)
    }, [selected, setValue]);

    useEffect(() => {
        setValue("cor", cor)
    }, [cor, setValue]);

    useEffect(() => {
        if (installation) {
            setValue("nome", installation?.nome || "")
            setValue("descricao", installation?.descricao || "")
            setValue("cor", installation?.cor || "")
            setValue("capacidade_pessoas", installation?.capacidade_pessoas || 0)
            setValue("horas_max_reserva", installation?.horas_max_reserva || 0)

            setCor(installation?.cor || defaultColorPicker)

            const equipamentoCategorias = installation?.instalacao_categorias?.map(category => category.categoria_id_categoria.toString())

            setSelected(equipamentoCategorias ? equipamentoCategorias : [])
        }
    }, [installation, setValue])

    useEffect(() => {
        if (categories) {
            setOptions(categories.map(category => ({
                label: category.nome,
                value: category.id_categoria.toString()
            })))
        }
    }, [categories]);

    useEffect(() => {
        if (areas) {
            setOptionsArea(areas.map(area => ({
                label: area.nome,
                value: area.id_area.toString()
            })))
        }
    }, [areas]);

    const onSubmit: SubmitHandler<TInstallationFormValues> = async (data) => {
        if (idInstalation){
            await update(idInstalation, data)
            return
        }
        await register(data)
    }

    const update = async (id: number, data: TInstallationFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.descricao === "") data.descricao = null

        try {
            const response = await InstallationApi.update(id, data)

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

    const register = async (data: TInstallationFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.descricao === "") data.descricao = null

        try {
            const response = await InstallationApi.create(data)

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

    if(loading)
        return (
            <Loading />
        )

    return (
        <form className={``} onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold mb-4">Registro de instalação</h2>

            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>

                    <InputControlled control={control} name={"nome"} placeholder={`Ex: Lab #3`}/>
                    {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
                </div>

                <div>
                    <label htmlFor="cor" className="block text-sm font-medium text-gray-700">
                        Cor
                    </label>
                    <ColorPicker color={cor} setColor={setCor}/>
                    {errors.cor && <p className="text-red-500">{errors.cor.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Capacidade de pessoas
                    </label>
                    <InputControlled
                        control={control}
                        name={"capacidade_pessoas"}
                        onChange={(e) => setValue("capacidade_pessoas", parseFloat(e.target.value) || 0)}
                    />
                    {errors.capacidade_pessoas &&
                      <p className="text-red-500">{errors.capacidade_pessoas.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Horas máxima de reserva
                    </label>
                    <InputControlled
                        control={control}
                        name={"horas_max_reserva"}
                        onChange={(e) => setValue("horas_max_reserva", parseFloat(e.target.value) || 0)}
                    />
                    {errors.horas_max_reserva &&
                      <p className="text-red-500">{errors.horas_max_reserva.message}</p>}
                </div>

                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Área
                    </label>
                    <SelectSearchable
                        options={optionsArea}
                        value={selectedArea}
                        onChange={setSelectedArea}
                        className="w-full"
                    />
                    {errors.area_id_area && <p className="text-red-500">{errors.area_id_area.message}</p>}
                </div>

                <div>
                    <label htmlFor="select" className="block text-sm font-medium text-gray-700">
                        Categorias
                    </label>
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        placeholder="Categorias..."
                    />
                    {errors.categorias && <p className="text-red-500">{errors.categorias.message}</p>}
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