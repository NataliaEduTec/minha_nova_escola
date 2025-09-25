import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, FormData, schema} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import Loading from "../../General/Loading";
import InputControlled from "../../Elements/Input/Controlled";
import MultiSelect from "@/components/Elements/Select/Multiple";
import IndicatorsApi, {TIndicatorFormValues} from "@/services/indicator.ts";
import TextAreaControlled from "@/components/Elements/Textarea/Controlled";
import SelectSearchable, { SelectOption } from "@/components/Elements/Select/Searchable";
import { getAllDisciplines, getAllSeries } from "@/services/ExternalAPI/simples";
import { indicatorTypes } from "@/lib/utils";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    reload: () => void
    loading?: boolean
    indicator?: TIndicatorFormValues
    identify?: string
    handleCloseModal: () => void
    setExternalSeries?: (series: SelectOption[]) => void
    setExternalDisciplines?: (disciplines: SelectOption[]) => void;
}

export default function Form ({onClick, reload, loading, indicator, identify, handleCloseModal, setExternalSeries, setExternalDisciplines}: Props) {

    const { handleSubmit, formState: { errors }, control, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues
        },
        mode: "onChange",
    });

    const [series, setSeries] = useState<string[]>([])
    const [disciplines, setDisciplines] = useState<string[]>([]);

    const [seriesOptions, setSeriesOptions] = useState<SelectOption[]>([]);
    const [disciplinesOptions, setDisciplinesOptions] = useState<SelectOption[]>([])

    const [selectedIndicatorType, setSelectedIndicatorTypes] = useState<string>("");

    const indicatorTypesOptions = useMemo(() => indicatorTypes, []);

    useEffect(() => {
        setValue("series", series?.map((s) => ({ id: parseInt(s) })) || [])
    }, [series, setValue]);

    useEffect(() => {
        setValue("disciplines", disciplines?.map((s) => ({ id: parseInt(s) })) || [])
    }, [disciplines, setValue]);

    useEffect(() => {
        if (indicator) {
            setValue("code", indicator?.code || "")
            setValue("description", indicator?.description || "")
            setSeries(indicator?.series?.map(s => s.id.toString()) || [])
            setDisciplines(indicator?.disciplines?.map(s => s.id.toString()) || [])
            setSelectedIndicatorTypes(indicator?.type || "")
        }
    }, [indicator, setValue])

    useEffect(() => {
            getAllSeries().then(series => {
                const options = series.map(s => ({
                    label: s.sigla_curso,
                    value: s.id_curso.toString()
                }));
                setSeriesOptions(options);
                if (setExternalSeries) {
                    setExternalSeries(options);
                }
            })
    }, [setSeriesOptions, setExternalSeries]);

    useEffect(() => {
            getAllDisciplines().then(disciplines => {
                const options = disciplines.map(d => ({
                    label: d.descricao_disciplina,
                    value: d.id_disciplina.toString()
                }));
                setDisciplinesOptions(options);

                if (setExternalDisciplines) {
                    setExternalDisciplines(options);
                }
            })
        }, [setDisciplinesOptions, setExternalDisciplines]);

    useEffect(() => {
        setValue("type", selectedIndicatorType);
    }, [selectedIndicatorType, setValue]);

    const onSubmit: SubmitHandler<TIndicatorFormValues> = async (data) => {
        if (identify){
            await update(identify, data)
            return
        }
        await register(data)
    }

    const update = async (id: string, data: TIndicatorFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            const response = await IndicatorsApi.update(id, data)

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

    const register = async (data: TIndicatorFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            const response = await IndicatorsApi.create(data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                reload()
                setSeries([])
                setDisciplines([])
                reset()
                setSelectedIndicatorTypes("")
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
        <form className={`min-h-[30rem] max-h-full relative`} onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold mb-4 ">Registro de indicador</h2>

            <section className={`grid md:grid-cols-2 gap-4`}>
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Código
                    </label>
                    <InputControlled control={control} name={"code"}/>
                    {errors.code && <p className="text-red-500">{errors.code.message}</p>}
                </div>

                <div>
                    <label htmlFor="indicator_type" className="block text-sm font-medium text-gray-700">
                        Tipo do Indicador
                    </label>
                    <SelectSearchable options={indicatorTypesOptions} value={selectedIndicatorType} onChange={setSelectedIndicatorTypes} />
                    {errors.type && <p className="text-red-500">{errors.type?.message || ""}</p>}
                </div>

                <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>

                    <TextAreaControlled control={control} name={"description"}/>
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>
            </section>

            <section className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>

                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Série
                    </label>
                    <MultiSelect options={seriesOptions} value={series} onChange={setSeries}/>
                    {errors.series && <p className="text-red-500">{errors.series[0]?.id?.message || ""}</p>}
                        {errors.series && <p className="text-red-500">{errors.series?.message || ""}</p>}
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Disciplina
                        </label>
                        <MultiSelect options={disciplinesOptions} value={disciplines} onChange={setDisciplines}/>
                        {errors.disciplines && <p className="text-red-500">{errors.disciplines[0]?.id?.message}</p>}
                        {errors.disciplines && <p className="text-red-500">{errors.disciplines?.message}</p>}
                    </div>
                </section>

                <div className="mt-4 flex justify-end space-x-4 absolute bottom-0 right-0">
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