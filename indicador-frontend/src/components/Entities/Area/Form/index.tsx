import ColorPicker, {defaultColorPicker} from "../../../General/ColorPicker";
import {SubmitHandler, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {FormData, schema} from "./schema";
import InputControlled from "../../../Elements/Input/Controlled";
import TextAreaControlled from "../../../Elements/Textarea/Controlled";
import {useEffect, useState} from "react";
import AreasApi, {TAreasFormValues} from "../../../../services/areas.ts";
import {toast} from "react-toastify";
import Loading from "../../../General/Loading";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    area?: TAreasFormValues
    idArea?: number
}


export default function Form ({onClick, reload, loading, area, idArea}: Props) {
    const [color, setColor] = useState(defaultColorPicker);

    const { handleSubmit, formState: { errors }, control, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: null,
            color: defaultColorPicker
        },
        mode: "onChange",
    });

    useEffect(() => {
        setValue("name", area?.name || "")
        setValue("color", area?.color || "")
        setValue("description", area?.description || "")

        setColor(area?.color || defaultColorPicker)
    }, [area, setValue])

    useEffect(() => {
        setValue("color", color)
    }, [color, setValue]);

    const onSubmit: SubmitHandler<TAreasFormValues> = async (data) => {
        console.log("idArea", idArea)
        if (idArea){
            await update(idArea, data)
            return
        }
        await register(data)
    }

    const update = async (id: number, data: TAreasFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")
        if (data.description === "")
            data.description = null

        try {
            const response = await AreasApi.update(id, data)

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

    const register = async (data: TAreasFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")
        if (data.description === "")
            data.description = null

        try {
            const response = await AreasApi.create(data)

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
            <h2 className="text-lg font-bold mb-4">Registro de Área</h2>

            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className="">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>

                    <InputControlled control={control} name={"name"} placeholder={`Ex: Área 1`} />

                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Cor
                    </label>
                    <ColorPicker color={color} setColor={setColor}/>
                    {errors.color && <p className="text-red-500">{errors.color.message}</p>}
                </div>
                <div className="mb-4 md:col-span-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <TextAreaControlled control={control} name={"description"} />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
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