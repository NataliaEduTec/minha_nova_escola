import {SubmitHandler, useForm} from "react-hook-form";
import {defaultValues, schema} from "./schema";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import MultiSelect from "@/components/Elements/Select/Multiple";
import IndicatorsApi, {getAllIndicators, getIndicatorsBySeriesAndDisciplineAndType, TIndicatorFormValues} from "@/services/indicator.ts";
import TextAreaControlled from "@/components/Elements/Textarea/Controlled";
import SelectSearchable, {SelectOption} from "@/components/Elements/Select/Searchable";
import {getAllDisciplines, getAllSeries} from "@/services/ExternalAPI/simples.ts";
import {FormData} from "@/components/Indicator/Form/schema";
import { indicatorTypes } from "@/lib/utils";

type Props = React.FormHTMLAttributes<HTMLElement> & {
    loading?: boolean
    indicator?: TIndicatorFormValues
    handleCloseModal: () => void
    setIndicator: (value: TIndicatorFormValues) => void
}

export default function FormSearchable ({onClick, handleCloseModal, setIndicator, indicator}: Props) {

    const { handleSubmit, formState: { errors }, control, setValue, reset, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues
        },
        mode: "onChange",
    });

    const code = watch("code")

    const [series, setSeries] = useState<string[]>([])
    const [disciplines, setDisciplines] = useState<string[]>([]);

    const [indicators, setIndicators] = useState<SelectOption[]>([])
    const [fullIndicators, setFullIndicators] = useState<TIndicatorFormValues[]>([])
    const [selectedIndicator, setSelectedIndicator] = useState<string>("")

    const [noItemSearched, setNoItemSearched] = useState<boolean>(false);

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
            setSeries(indicator.series.map(s => s.id.toString()));
            setDisciplines(indicator.disciplines.map(d => d.id.toString()));
            setSelectedIndicatorTypes(indicator.type);
        }
    }, [indicator]);

    const getAll = () => {
        getAllIndicators().then(i => {
            setIndicators(i?.map(indicator => ({
                label: indicator.code,
                value: indicator.id.toString()
            })) || [])
            setFullIndicators(i || [])
        })
    }

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        if (!series[0] || !disciplines[0] || !selectedIndicatorType) {
            getAll();
            return;
        }
        getIndicatorsBySeriesAndDisciplineAndType(series[0], disciplines[0], selectedIndicatorType)
            .then(i => {
                const options = i?.map(indicator => ({
                    label: indicator.code,
                    value: indicator.id.toString()
                })) || [];

                setFullIndicators(i || [])
                setIndicators(options);
            })
    }, [series, disciplines, indicators.length, selectedIndicatorType]);
    
    useEffect(() => {
        if (selectedIndicator) {
            const indicator = fullIndicators.find(indicator => indicator.id === selectedIndicator)

            setIndicator({
                id: selectedIndicator,
                code: indicator?.code || "",
                description: indicator?.description,
                series: [],
                disciplines: [],
                type: selectedIndicatorType || "",
            });
            setNoItemSearched(false)
            handleCloseModal()
            setSelectedIndicator("")
            setValue("code", "")
            setValue("description", "")

            setSeries([]);
            setDisciplines([]);
            setSelectedIndicatorTypes("");
        }
    }, [selectedIndicator, setIndicator, handleCloseModal, indicators, setValue, reset, selectedIndicatorType, fullIndicators]);

    useEffect(() => {
        getAllSeries().then(series => {
            const options = series.map(s => ({
                label: s.sigla_curso,
                value: s.id_curso.toString()
            }));
            setSeriesOptions(options);
        })
    }, [setSeriesOptions]);

    useEffect(() => {
        getAllDisciplines().then(disciplines => {
            const options = disciplines.map(d => ({
                label: d.descricao_disciplina,
                value: d.id_disciplina.toString()
            }));
            setDisciplinesOptions(options);
        })
    }, [setDisciplinesOptions]);

    const onSubmit: SubmitHandler<TIndicatorFormValues> = async (data) => {
        await register(data)
    }

    const register = async (data: TIndicatorFormValues) => {
        const toastId = toast.loading("Aguarde, por favor...")

        try {
            data.type = selectedIndicatorType
            console.log(data)
            const response = await IndicatorsApi.create<string>(data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                setIndicators(prev => [
                    ...prev,
                    {
                        label: data.code,
                        value: response.data.toString()
                    }
                ])
                setSelectedIndicator(response.data)
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

    return (
        <form className={`max-h-full relative min-h-[30rem]`} onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-bold mb-4 ">{noItemSearched ? 'Registro de indicador' : 'Seleção de indicador'}</h2>

            <section className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6`}>
                <div>
                        <label htmlFor="indicator_type" className="block text-sm font-medium text-gray-700">
                            Tipo do Indicador
                        </label>
                        <SelectSearchable options={indicatorTypesOptions} value={selectedIndicatorType} onChange={setSelectedIndicatorTypes} />
                        {errors.type && <p className="text-red-500">{errors.type?.message || ""}</p>}
                    </div>
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

            <section className={`grid grid-cols-1 gap-4`}>
                <div className={`my-3`}>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Código
                    </label>

                    <SelectSearchable 
                        options={indicators}
                        value={selectedIndicator}
                        onChange={setSelectedIndicator}
                        getText={(text) => setValue("code", text)}
                        placeholder={`${noItemSearched ? code : 'Selecione um indicador'}`}
                        setNoItemSearched={setNoItemSearched}
                    />
                    {noItemSearched && code && (
                        <p className="text-gray-800 text-sm my-3">
                            Não existe indicador com esse código (<strong>{code}</strong>). Você pode registrar um novo indicador.
                        </p>
                    )}
                    {errors.code && <p className="text-red-500">{errors.code.message}</p>}
                </div>
            </section>

            <div className={`${noItemSearched ? '' : 'hidden'}`}>
                <section className={`grid grid-cols-1 gap-4`}>
                    

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Descrição
                        </label>

                        <TextAreaControlled control={control} name={"description"}/>
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>
                </section>

                <div className={`mt-4 flex justify-end space-x-4`}>
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
            </div>
        </form>
    );
}