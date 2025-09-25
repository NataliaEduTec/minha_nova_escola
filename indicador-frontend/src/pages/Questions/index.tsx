import React, {useEffect, useMemo, useState} from "react";
import Modal from "../../components/Modal";
import Delete from "../../components/Modal/Delete";
import useModal from "../../hooks/useModal";
import {showToast} from "@/components/General/Notification";
import {Id, toast} from "react-toastify";
import {Link} from "react-router-dom";
import QuestionsApi, {TQuestionFormValues} from "@/services/questions.ts";
import List from "@/components/Questions/List";
import Button from "@/components/Elements/Button";
import {useNavigate} from "react-router-dom";
import FormFilter from "./FormFilter";
import { SelectOption } from "@/components/Elements/Select/Searchable";
import { getAllInstitutions, getClassBySchoolYearAndSeries, getDisciplinesBySeries, getSeriesByInstitution } from "@/services/ExternalAPI/simples";
import { getIndicatorsBySeriesAndDiscipline } from "@/services/indicator";
import { schoolYear } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>

export default function Page ({ style }: Props) {
    const navigate = useNavigate();
    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();
    const {modalRef: modalDeleteRef, openModal: handleOpenModalDelete, closeModal: handleCloseModalDelete } = useModal();

    const [reload, setReload] = useState<boolean>(true)
    const [idCategory, setID] = useState<string>("")
    const [questions, setQuestions] = useState<TQuestionFormValues[]>([])
    const [questionsSelected, setQuestionsSelected] = useState<TQuestionFormValues[]>([])

    const [indicator, setIndicator] = useState<string>("");
    const [indicators, setIndicators] = useState<SelectOption[]>([]);

    const [series, setSeries] = useState<SelectOption[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string>("");
    
    const [disciplines, setDisciplines] = useState<SelectOption[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<string>("");

    const [institutions, setInstitutions] = useState<SelectOption[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<string>("");

    const [classes, setClassesOptions] = useState<SelectOption[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string>("");

    const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
        const schoolYears = useMemo(() => {
            return schoolYear().map(year => ({
                label: year.toString(),
                value: year.toString()
            }));
        }, []);

    useEffect(() => {
        const params = `indicator=${indicator}&series=${selectedSeries}&disciplines=${selectedDisciplines}&institution=${selectedInstitution}&classes=${selectedClasses}&schoolYear=${selectedSchoolYear}`;

        getAll(params).then(c => setQuestions(c ?? []))
    }, [indicator, reload, selectedClasses, selectedDisciplines, selectedInstitution, selectedSchoolYear, selectedSeries]);

    const getAll = async (params: string): Promise<TQuestionFormValues[] | undefined> => {
        const response = await QuestionsApi.getAll<TQuestionFormValues[]>(params)

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

        const response = await QuestionsApi.deleteById(id)

        toast.update(idToast, {
            render: response.message,
            type: response.status,
            isLoading: false,
            autoClose: 3000
        })

        if (response.status === "success"){
            handleCloseModalDelete()
            setReload(!reload)
            setID("")
        }
    }

    const handleEdit = async (id: string) => {
        handleOpenModal()
        setID(id)

        const response = await QuestionsApi.getUnique<TQuestionFormValues>(id)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            handleCloseModal()
            return
        }
    }

    const isValidQuestionnaire = (idToast: Id): boolean => {
        if (!questionsSelected.length) {
            toast.update(idToast, {
                render: "Selecione pelo menos uma questão",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }

        if (!indicator) {
            toast.update(idToast, {
                render: "Selecione um indicador",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }

        if (!selectedSeries) {
            toast.update(idToast, {
                render: "Selecione uma série",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }

        if (!selectedDisciplines) {
            toast.update(idToast, {
                render: "Selecione uma disciplina",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }

        if (!selectedInstitution) {
            toast.update(idToast, {
                render: "Selecione uma instituição",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }

        if (!selectedSchoolYear) {
            toast.update(idToast, {
                render: "Selecione um ano letivo",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }
        if (!selectedClasses) {
            toast.update(idToast, {
                render: "Selecione uma turma",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
            return false
        }

        return true
    }

    const generateQuestionnaire = async () => {
        const idToast = toast.loading("Aguarde, por favor...")

        if (!isValidQuestionnaire(idToast))
            return

        toast.update(idToast, {
            render: "Gerando Questionário!",
            type: "success",
            isLoading: false,
            autoClose: 3000
        })

        navigate('/indicadores/questionario', {
            state: {
                data: questionsSelected,
                selectedIndicator: indicator,
                selectedSeries,
                selectedDisciplines
            }
        });
    }

    useEffect(() => {
        setInstitutions([])

        getAllInstitutions().then(response => {
            if (response.data.length) {
                const options = response.data.map(institution => ({
                    label: institution.nome_instituicao,
                    value: institution.id_instituicao.toString(),
                }));
                setInstitutions(options)
            }
        })
    }, []);

    useEffect(() => {
        getSeriesByInstitution(selectedInstitution).then(response => {
            setSeries([])

            if (response.data.length) {
                const options = response.data.map(series => ({
                    label: series.sigla_curso,
                    value: series.id_curso.toString(),
                }))

                setSeries(options)
            }
        })
    }, [selectedInstitution]);

    useEffect(() => {
            setClassesOptions([]);
            setSelectedClasses("")
            if (!selectedSeries || !selectedSchoolYear || !selectedInstitution) {
                return
            }
    
            getClassBySchoolYearAndSeries(selectedSchoolYear, selectedSeries, selectedInstitution).then(response => {
                if (response.type === "success") {
                    const options = response.data.map(data => ({
                        label: data.descricao_turma,
                        value: data.id_turma.toString()
                    }));
                    setClassesOptions(options);
                } else {
                    console.error(response.render);
                    setClassesOptions([])
                    showToast(response.render, "error");
                }
            }).catch(error => {
                console.log(error)
            })
        }, [selectedSeries, selectedSchoolYear, selectedInstitution])

    useEffect(() => {
        setDisciplines([])
        if (!selectedSeries) return;

        getDisciplinesBySeries(selectedSeries).then(disciplines => {
            if (disciplines.length) {
                const options = disciplines.map(discipline => ({
                    label: discipline.descricao_disciplina,
                    value: discipline.id_disciplina.toString()
                }))

                setDisciplines(options)
            }
        })
    }, [selectedSeries])

    useEffect(() => {
        setIndicators([])
        if (!selectedSeries || !selectedDisciplines) return;

        getIndicatorsBySeriesAndDiscipline(selectedSeries, selectedDisciplines).then(indicators => {
            if (indicators?.length) {
                const options = indicators.map(indicator => ({
                    label: indicator.code,
                    value: indicator.id,
                }))

                setIndicators(options)
            }
        })
    }, [selectedSeries, selectedDisciplines])

    const onChangeSelectItem = (id: string, checked: boolean) => {
        setQuestionsSelected(prevQuestions =>
            checked
                ? [...prevQuestions, questions.find(q => q.id === id) as TQuestionFormValues]
                : prevQuestions.filter(q => q.id !== id)
        );
    }

    useEffect(() => {
        console.log("Selected Questions:", questionsSelected);
    }, [questionsSelected]);

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>

            <Modal ref={modalRef} dialogClassName={"max-w-xl"}>
                {/*<Form*/}
                {/*      onClick={() => {*/}
                {/*          setIsLoadingForm(false)*/}
                {/*          handleCloseModal()*/}
                {/*      }}*/}
                {/*      idCategory={idCategory}*/}

                {/*      loading={isLoadingForm}*/}
                {/*      reload={() => setReload(!reload)}*/}
                {/*      category={category}*/}
                {/*/>*/}
            </Modal>

            <Delete ref={modalDeleteRef} onDelete={() => deleteById(idCategory)} onClick={handleCloseModalDelete} />

            <section className={"relative md:w-[98%] w-full max-w-screen-2xl max-h-[98vh] h-[95%] bg-white rounded-xl p-3 overflow-x-auto"}>
                <section className={`flex justify-end mb-4 mx-auto w-4/5`}>
                    <Link
                        to={"./formulario"}
                        className={`
                        p-3 rounded-lg shadow-md focus:outline-none focus:ring-0
                        transition-transform transform active:scale-95 
                        border-opacity-20
                        h-full border border-[--color-green]
                            hover:bg-[--color-green]
                            text-[--color-green] hover:text-white text-center`
                        }>
                        Cadastrar Questões
                    </Link>
                </section>

                <FormFilter 
                    selectedSeries={selectedSeries}
                    selectedDisciplines={selectedDisciplines}
                    indicator={indicator}
                    series={series}
                    disciplines={disciplines}
                    indicators={indicators}
                    institutions={institutions}
                    selectedInstitution={selectedInstitution}
                    selectedSchoolYear={selectedSchoolYear}
                    schoolYears={schoolYears}
                    setIndicator={setIndicator}
                    setSelectedSeries={setSelectedSeries}
                    setSelectedDisciplines={setSelectedDisciplines}
                    setSelectedInstitution={setSelectedInstitution}
                    setSelectedSchoolYear={setSelectedSchoolYear}
                    classes={classes}
                    selectedClasses={selectedClasses}
                    setSelectedClasses={setSelectedClasses}
                />

                <List
                    items={questions}
                    editable={false}
                    onEdit={(id) => handleEdit(id as string)}
                    onChangeSelectItem={(id, checked) => {
                        onChangeSelectItem(id as string, checked)
                    }}
                    onDelete={(id) => {
                        setID(id as string)
                        handleOpenModalDelete()
                    }} />

                <div className="mt-8 flex justify-end items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => generateQuestionnaire()}
                        className="py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-500 transition"
                    >
                        Gerar Questionário
                    </Button>
                </div>
            </section>
        </main>
    )
}
