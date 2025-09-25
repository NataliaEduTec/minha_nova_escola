import React, {useEffect, useMemo, useState} from "react";
import List from "../../components/Indicator/List";
import Form from "../../components/Indicator/Form";
import Modal from "../../components/Modal";
import Delete from "../../components/Modal/Delete";
import Search from "../../components/General/Search";
import useModal from "../../hooks/useModal";
import {showToast} from "@/components/General/Notification";
import {toast} from "react-toastify";
import {defaultValues} from "@/components/Indicator/Form/schema";
import IndicatorsApi, {TIndicatorFormValues} from "@/services/indicator.ts";
import SelectSearchable, { SelectOption } from "@/components/Elements/Select/Searchable";
import { indicatorTypes } from "@/lib/utils";
import MultiSelect from "@/components/Elements/Select/Multiple";
import { getAllDisciplines, getAllSeries } from "@/services/ExternalAPI/simples";
import Input from "@/components/Elements/Input";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    handleModalRegisterEmployee?: () => void
}

export default function Indicator ({ style }: Props) {
    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();
    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [searchValue, setSearchValue] = useState<string>("")
    const [reload, setReload] = useState<boolean>(true)
    const [id, setId] = useState<string>("")
    const [indicators, setIndicators] = useState<TIndicatorFormValues[]>([])
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [indicator, setIndicator] = useState<TIndicatorFormValues>(defaultValues)
    const [series, setSeries] = useState<SelectOption[]>([])
    const [disciplines, setDisciplines] = useState<SelectOption[]>([]);
    const [selectedIndicatorType, setSelectedIndicatorTypes] = useState<string>("");
    const [seriesOptions, setSeriesOptions] = useState<SelectOption[]>([]);
    const [disciplinesOptions, setDisciplinesOptions] = useState<SelectOption[]>([])

    const [seriesMulti, setMultiSeries] = useState<string[]>([])
    const [disciplinesMulti, setMultiDisciplines] = useState<string[]>([]);

    const indicatorTypesOptions = useMemo(() => indicatorTypes, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (searchValue || disciplinesMulti || selectedIndicatorType || seriesMulti) {
            timeout = setTimeout(() => {
                getAll(searchValue, disciplinesMulti as string[], selectedIndicatorType, seriesMulti).then(i => setIndicators(i ?? []))
            }, 500);
        } else {
            getAll().then(i => setIndicators(i ?? []))
        }

        return () => clearTimeout(timeout);
    }, [searchValue, disciplinesMulti, selectedIndicatorType, seriesMulti]);

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

    const setSeriesAndDisciplinesName = (indicators: TIndicatorFormValues[], series: SelectOption[], disciplines: SelectOption[]) => {
        return indicators.map(indicator => {
            indicator.series = indicator.series.map(s => ({
                ...s,
                description: series.find(seriesItem => seriesItem.value === s.id.toString())?.label || ``
            }));
            indicator.disciplines = indicator.disciplines.map(d => ({
                ...d,
                description: disciplines.find(disciplineItem => disciplineItem.value === d.id.toString())?.label || ``
            }));

            return indicator;
        });
    }

    useEffect(() => {
        getAll().then(i => {
            const updatedIndicators = setSeriesAndDisciplinesName(i ?? [], series, disciplines);
            setIndicators(updatedIndicators);
        })
    }, [disciplines, reload, series]);

    useEffect(() => {
        console.log(indicators);
    }, [indicators]);

    const getAll = async (name = '', disciplinesMulti: string[] = [], selectedIndicatorType = '', seriesMulti: string[] = []): Promise<TIndicatorFormValues[] | undefined> => {
        const response = await IndicatorsApi.getAll<TIndicatorFormValues[]>(name, [], disciplinesMulti, selectedIndicatorType, seriesMulti)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    const deleteById = async (id: string): Promise<void> => {
        const idToast = toast.loading("Aguarde, por favor...")

        if (!id) {
            toast.update(idToast, {
                render: "Não foi possível encontrar o identificador",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        }

        const response = await IndicatorsApi.deleteById(id)

        toast.update(idToast, {
            render: response.message,
            type: response.status,
            isLoading: false,
            autoClose: 3000
        })

        if (response.status === "success"){
            handleCloseModalDelete()
            setReload(!reload)
            setId("")
        }
    }

    const handleEdit = async (id: string) => {
        setIsLoadingForm(true)
        handleOpenModal()
        setId(id)

        const response = await IndicatorsApi.getUnique<TIndicatorFormValues>(id)
        setIsLoadingForm(false)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            handleCloseModal()
            return
        }

        setIndicator(response.data)
    }

    const handleDelete = (id: string) => {
        setId(id)
        handleOpenModalDelete()
    }

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>

            <Modal ref={modalRef} dialogClassName={"max-w-3xl"}>
                <Form
                    onClick={() => {
                        setIsLoadingForm(false)
                        handleCloseModal()
                    }}

                    handleCloseModal={handleCloseModal}

                    identify={id}

                    loading={isLoadingForm}
                    reload={() => setReload(!reload)}
                    indicator={indicator}
                    setExternalSeries={setSeries}
                    setExternalDisciplines={setDisciplines}
                />
            </Modal>

            <Delete ref={modalDeleteRef} onDelete={() => deleteById(id)} onClick={handleCloseModalDelete} />

            <section className={"w-full max-w-screen-xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <section className={`grid md:grid-cols-2 gap-4`}>
                    <div>
                        <label htmlFor="indicator_type" className="block text-sm font-medium text-gray-700">
                            Tipo do Indicador
                        </label>
                        <SelectSearchable options={indicatorTypesOptions} value={selectedIndicatorType} onChange={setSelectedIndicatorTypes} />
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Série
                        </label>
                        <MultiSelect options={seriesOptions} value={seriesMulti} onChange={setMultiSeries}/>
                    </div>
    
                    <div>
                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                Disciplina
                            </label>
                            <MultiSelect options={disciplinesOptions} value={disciplinesMulti} onChange={setMultiDisciplines}/>
                        </div>
                    </div>

                    <div className={`flex flex-col`}>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Código
                        </label>
                        <Input
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                        }}
        
                        placeholder={`Pesquisar`} className={`col-span-2 md:col-span-1`}/>
                    </div>
                </section>

                <div className={`flex justify-center my-10`}>
                    <Search
                        handleOpenModalRegister={() => {
                            setIndicator(defaultValues)
                            setId("")
                            handleOpenModal()
                            setIsLoadingForm(false)
                        }}
                        hiddenCodeInput={true}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <List
                    items={indicators}
                    onEdit={(id) => handleEdit(id as string)}
                    onDelete={(id) => handleDelete(id as string)} />
            </section>
        </main>
    )
}
