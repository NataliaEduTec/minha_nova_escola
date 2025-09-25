import Button from "../../components/Elements/Button";
import React, {useEffect, useMemo, useState} from "react";
import SelectSearchable, {SelectOption} from "../../components/Elements/Select/Searchable";
import {ClipboardPlus} from "lucide-react";
import {
    getAllInstitutions, getClassBySchoolYearAndSeries,
    getDisciplinesBySeries,
    getSeriesByInstitution, getStudentsByClassAndSchoolYear
} from "@/services/ExternalAPI/simples.ts";
import {showToast} from "@/components/General/Notification";
import {
    createNewStudentWithQuestions,
    defaultQuestions,
    handleStatusStudent,
    quantityQuestions,
    schoolYear
} from "@/lib/utils.ts";
import Loading from "@/components/General/Loading";
import useModal from "@/hooks/useModal";
import Modal from "@/components/Modal";
import FormSearchable from "@/components/Indicator/FormSearchable";
import {getIndicatorById, TIndicatorFormValues} from "@/services/indicator.ts";
import {StudentStatus} from "@/types";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {diagnosticSchema, FormData, TDiagnostic, TDiagnosticQuestionnaire} from "@/components/Diagnostic/Form/schema.ts";
import {v4 as uuidv4} from "uuid";
import InputControlled from "@/components/Elements/Input/Controlled";
import {createDiagnostic, getDiagnosticById, updateDiagnostic} from "@/services/diagnostics.ts";
import {Id, toast} from "react-toastify";
import { useSearchParams } from "react-router-dom";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    handleModalRegisterEmployee?: () => void
}

type Student = {
    id: number;
    name: string;
}

export type Question = {
    id: number;
    question: string;
    indicator: TIndicatorFormValues | null;
    color: string;
}

export default function Diagnostic ({ style }: Props) {
    const [searchParams] = useSearchParams()     
    const diagnosticId = searchParams.get("diagnosticId")

    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();

    const [studentsTotalCorrects, setStudentsTotalCorrects] = useState<StudentStatus[]>([]);

    const [institutions, setInstitutionss] = useState<SelectOption[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<string>("");

    const [series, setSeries] = useState<SelectOption[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<string>("");

    const [classes, setClasses] = useState<SelectOption[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string>("");

    const [disciplines, setDisciplines] = useState<SelectOption[]>([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState<string>("");

    const [students, setStudents] = useState<Student[]>([]);

    const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
    const schoolYears = useMemo(() => {
        return schoolYear().map(year => ({
            label: year.toString(),
            value: year.toString()
        }));
    }, []);

    const [isStudentLoading, setIsStudentLoading] = useState<boolean>(false)

    const [selectedQuantityQuestions, setSelectedQuantityQuestions] = useState<string>("10");

    const [questionSelected, setQuestionSelected] = useState<Question | null>(null);
    const [indicatorToQuestionSelected, setIndicatorToQuestionSelected] = useState<TIndicatorFormValues | null>(null);
    const { handleSubmit, formState: { errors }, control, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(diagnosticSchema),
        defaultValues: {
            id: uuidv4(),
            name: "",
            institution_id: "",
            series_id: "",
            schoolYear: "",
            diagnostic_student: [],
            questionnaire: {
                id: uuidv4(),
                name: "",
                content: "",
                diagnostic_id: uuidv4()
            }
        },
        mode: "onChange",
    });

    const name = watch("name")

    useEffect(() => {
        getAllInstitutions().then(response => {
            if (response.type === "success") {
                const options = response.data.map(institution => ({
                    label: institution.nome_instituicao,
                    value: institution.id_instituicao.toString()
                }));
                setInstitutionss(options);
            } else {
                console.error(response.render);

                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        setValue("institution_id", selectedInstitution || "");
        setSeries([]);
        
        if (!diagnosticId) {
            setSelectedSeries("")
            setStudentsTotalCorrects([])
        };
        if (!selectedInstitution) {
            return
        }

        getSeriesByInstitution(selectedInstitution).then(response => {
            if (response.type === "success") {
                const options = response.data.map(data => ({
                    label: data.sigla_curso,
                    value: data.id_curso.toString()
                }));
                setSeries(options);
            } else {
                console.error(response.render);
                setSeries([])
                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [diagnosticId, selectedInstitution, setValue])

    useEffect(() => {
        if (!diagnosticId) {
            setStudentsTotalCorrects([]);
            setSelectedClasses("")
        }
        setValue("series_id", selectedSeries || "");
        setValue("schoolYear", selectedSchoolYear || "");
        setClasses([]);

        if (!selectedSeries || !selectedSchoolYear || !selectedInstitution) {
            return
        }

        getClassBySchoolYearAndSeries(selectedSchoolYear, selectedSeries, selectedInstitution).then(response => {
            if (response.type === "success") {
                const options = response.data.map(data => ({
                    label: data.descricao_turma,
                    value: data.id_turma.toString()
                }));
                setClasses(options);
            } else {
                console.error(response.render);
                setClasses([])
                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        })
    }, [selectedSeries, selectedSchoolYear, selectedInstitution, setValue, diagnosticId])

    useEffect(() => {
        setDisciplines([]);
        if (!diagnosticId)
            setSelectedDisciplines("")
        if (!selectedSeries) {
            return
        }

        getDisciplinesBySeries(selectedSeries).then(disciplines => {
            if (disciplines.length) {
                const options = disciplines.map(data => ({
                    label: data.descricao_disciplina,
                    value: data.id_disciplina.toString()
                }));
                setDisciplines(options);
            }
        }).catch(error => {
            console.log(error)
        })
    }, [diagnosticId, selectedSeries, setDisciplines])

    useEffect(() => {
        if (!diagnosticId) {
            setStudentsTotalCorrects([]);
            setStudents([]);
            setValue("class_id", selectedClasses || "");
        };

        setIsStudentLoading(true)
        if (!selectedClasses || !selectedSchoolYear) {
            setIsStudentLoading(false)
            return
        }

        getStudentsByClassAndSchoolYear(selectedClasses, selectedSchoolYear).then(response => {
            if (response.type === "success") {
                const users = response.data.map(data => ({
                    name: data.nome_aluno,
                    id: data.matricula_aluno
                }));

                setStudents(users);
            } else {
                console.error(response.render);
                setStudents([])
                showToast(response.render, "error");
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => setIsStudentLoading(false))
    }, [diagnosticId, selectedClasses, selectedSchoolYear, setStudents, setValue])

    const [questions, setQuestions] = useState<Question[]>(defaultQuestions);

    useEffect(() => {
        const quantity = parseInt(selectedQuantityQuestions);

        if (isNaN(quantity) || quantity < 10 || quantity > 25 || questions.length === quantity)
            return;

        if (questions.length > quantity) {
            setQuestions(questions.slice(0, quantity));
            return;
        }

        const newQuestions: Question[] = [];

        for (let i = questions.length; i < quantity; i++) {
            newQuestions.push({
                id: i + 1,
                question: `QUESTÃO ${i + 1}`,
                indicator: null,
                color: `bg-[#${Math.floor(Math.random()*16777215).toString(16)}]`
            });
        }

        setQuestions([...questions, ...newQuestions]);
    }, [selectedQuantityQuestions, questions])

    useEffect(() => {
        if (questionSelected && indicatorToQuestionSelected) {
            const updatedQuestions = questions.map((q) => {
                if (q.id === questionSelected.id) {
                    return {
                        ...q,
                        indicator: indicatorToQuestionSelected
                    };
                }
                return q;
            });

            setQuestions(updatedQuestions);
            setIndicatorToQuestionSelected(null);
            setQuestionSelected(null);
            handleCloseModal();
        }
    }, [questionSelected, indicatorToQuestionSelected, questions, handleCloseModal]);

    useEffect(() => setValue('discipline_id', selectedDisciplines || ""), [selectedDisciplines, setValue])

    useEffect(() => setValue('questionnaire.name', name || ""), [name, setValue])
    useEffect(() => setValue('questionnaire.content', JSON.stringify(questions) || ""), [questions, setValue])

    useEffect(() => {
        setValue('class_id', selectedClasses || "");
    }, [selectedClasses, setValue])

    useEffect(() => {
        setValue('institution_id', selectedInstitution || "");
    }, [selectedInstitution, setValue])

    useEffect(() => {
        setValue('series_id', selectedSeries || "");
    }, [selectedSeries, setValue])

    useEffect(() => {
        setValue('schoolYear', selectedSchoolYear || "");
    }, [selectedSchoolYear, setValue])

    useEffect(() => {
        setValue('discipline_id', selectedDisciplines || "");
    }, [selectedDisciplines, setValue])

    useEffect(() => {

        if (diagnosticId) {
            getDiagnosticById(diagnosticId).then(response => {
                if (response) {

                    setValue("id", response.id);
                    setValue("name", response.name);
                    setValue("institution_id", response.institution_id.toString());
                    setValue("schoolYear", response.schoolYear.toString());
                    setValue("discipline_id", response?.discipline_id?.toString() || "");

                    setSelectedInstitution(response.institution_id.toString());
                    setSelectedSeries(response.series_id.toString());
                    setSelectedSchoolYear(response.schoolYear.toString());
                    setSelectedClasses(response?.class_id?.toString() || "");
                    setSelectedDisciplines(response?.discipline_id?.toString() || "");
                    setSelectedQuantityQuestions(response.quantity_questions?.toString() || "10");

                    const questionnaire: TDiagnosticQuestionnaire | undefined = response?.diagnostic_questionnaire;
                    if (questionnaire) {
                        const content = JSON.parse(questionnaire.content || "[]");

                        setSelectedQuantityQuestions(content.length.toString());
                        setQuestions(content?.map((q: {question: string, indicator: string}, index: number) => ({
                            id: index + 1,
                            question: q.question,
                            indicator: q.indicator || null,
                            color: `bg-[#${Math.floor(Math.random()*16777215).toString(16)}]`
                        })));
                    }

                    const diagnosticStudents = response.diagnostic_student || [];
                    const newStudentsTotalCorrects = diagnosticStudents.map(student => ({
                        id: parseInt(student.student_id, 10),
                        questions: student?.questions?.map(q => ({
                            id: parseInt(q.id, 10),
                            status: q.status
                        })) || [],
                        totalCorrects: student?.questions?.filter(q => q.status === "SIM").length || 0,
                        tabulated: student.tabulated || false,
                        a_e_e: student.a_e_e || undefined,
                    }));

                    setStudentsTotalCorrects(newStudentsTotalCorrects);
                }
            })
        }

    }, [diagnosticId, setValue, setStudentsTotalCorrects])

    const handleChangeStatus = (questionId: number, studentId: number) => {
        const student = studentsTotalCorrects.find((student) => student.id === studentId);

        if (student) {
            const newStudents = studentsTotalCorrects.map((student) => handleStatusStudent(student, questionId, studentId));

            return setStudentsTotalCorrects(newStudents);
        }

        setStudentsTotalCorrects(createNewStudentWithQuestions(studentsTotalCorrects, studentId, questionId));
    }

    const handleChangeIndicator = (question: Question) => {

        if (question?.id.toString()) {
            getIndicatorById(question.id.toString()).then(indicator => {
                handleOpenModal();
                question.indicator = indicator || question.indicator;
                console.log(indicator)
            });
        }

        setQuestionSelected(question)
    }

    const handleTabulate = (id: number) => {
        if (studentsTotalCorrects.length === 0) {
            setStudentsTotalCorrects([{
                id,
                questions: [],
                totalCorrects: 0,
                tabulated: false,
            }])
            return;
        }

        const tabulatedStudents = studentsTotalCorrects.map(student => {
            if (student.id === id) {
                return {
                    ...student,
                    questions: [],
                    tabulated: !student?.tabulated,
                    totalCorrects: 0
                };
            }

            return student;
        });

        setStudentsTotalCorrects(tabulatedStudents);
    }

    const handleAEE = (id: number) => {
        const newStudents = studentsTotalCorrects.map((student) => {
            if (student.id === id)
                student.a_e_e = student?.a_e_e === "SIM" ? "NÃO" : "SIM";

            return student
        });

        return setStudentsTotalCorrects(newStudents);
    }

    useEffect(() => {
        if (diagnosticId)
            return;
        if (!students.length)
            return setStudentsTotalCorrects([]);
    }, [students, setStudentsTotalCorrects, diagnosticId]);

    useEffect(() => {
        if (diagnosticId)
            return;
        if (!students.length)
            return;

        const newStudentsTotalCorrects = students.map(student => {
            const existingStudent = studentsTotalCorrects.find(s => s.id === student.id);
            if (existingStudent) {
                return existingStudent;
            }
            return {
                id: student.id,
                questions: [],
                totalCorrects: 0,
                tabulated: false,
            };
        })

        if (JSON.stringify(newStudentsTotalCorrects) === JSON.stringify(studentsTotalCorrects))
            return

        setStudentsTotalCorrects(newStudentsTotalCorrects);
    }, [studentsTotalCorrects, students, diagnosticId]);

    const register = (data: TDiagnostic, toastId: Id) => {
        console.log(data)
        createDiagnostic(data).then(response => {
            toast.update(toastId, {
                render: response.render,
                type: response.type as "info" | "success" | "warning" | "error",
                autoClose: 3000,
                isLoading: false,
            })

            if (response.type !== "success") {
                return
            }

            setStudentsTotalCorrects([])
            setStudents([])
            setValue("name", "")
        })
    }

    const update = (data: TDiagnostic, toastId: Id) => {
        if (!diagnosticId) {
            toast.update(toastId, {
                render: "Nenhum diagnóstico selecionado para atualizar.",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
            return;
        }

        updateDiagnostic(diagnosticId, data).then(response => {

            if (!response) {
                toast.update(toastId, {
                    render: "Erro ao atualizar o diagnóstico.",
                    type: "error",
                    autoClose: 3000,
                    isLoading: false,
                })
                return;
            }

            toast.update(toastId, {
                render: response.message,
                type: response.status as "info" | "success" | "warning" | "error",
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status !== "success") {
                return
            }

            setStudentsTotalCorrects([])
            setStudents([])
            setValue("name", "")
            
            setTimeout(() => {
                window.history.back();
            }, 3000);
        })
    }

    const onSubmit: SubmitHandler<TDiagnostic> = async (data) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (!students.length) {
            toast.update(toastId, {
                render:"Nenhum estudante encontrado para tabular.",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
            return;
        }

        if (studentsTotalCorrects.length === 0) {
            toast.update(toastId, {
                render: "Nenhum estudante tabulado.",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
            return;
        }

        if (!questions.every(q => q.indicator)) {
            toast.update(toastId, {
                render: "Todas as questões precisam ter um indicador associado.",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
            return;
        }

        data.quantity_questions = parseInt(selectedQuantityQuestions);
        data.diagnostic_student = studentsTotalCorrects.map(student => ({
            id: student.id.toString(),
            diagnostic_id: data.id,
            student_id: student.id.toString(),
            tabulated: student.tabulated || false,
            questions: student.questions.map(q => ({
                id: q.id.toString(),
                status: q.status,
            })),
            a_e_e: student.a_e_e || undefined,
        }));

        // console.log(data)
        // return

        if (diagnosticId) {
            update(data, toastId);
            return;
        }

        register(data, toastId);
    }

    return (
        <main style={style} className={"w-full h-full grid gap-2 scroll-smooth"}>

            <Modal ref={modalRef} dialogClassName={"max-w-3xl"} classNameDiv={""}>
                <FormSearchable
                    onClick={() => {
                        handleCloseModal()
                    }}

                    handleCloseModal={handleCloseModal}

                    setIndicator={setIndicatorToQuestionSelected}
                />
            </Modal>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`relative overflow-auto w-full bg-white min-w-60 rounded transition-all h-[43rem]`}>
                <section className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4`}>
                    <div className={"col-span-2"}>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Nome do Diagóstico *
                        </label>
                        <InputControlled control={control} placeholder={"Digite..."} name={"name"} />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Instituição
                        </label>
                        <SelectSearchable options={institutions} value={selectedInstitution}
                                          onChange={setSelectedInstitution}/>
                        { errors.institution_id && <p className="text-red-500">{errors.institution_id.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Ano Letivo
                        </label>
                        <SelectSearchable options={schoolYears} value={selectedSchoolYear}
                                          onChange={setSelectedSchoolYear}/>
                        { errors.schoolYear && <p className="text-red-500">{errors.schoolYear.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Série
                        </label>
                        <SelectSearchable options={series} value={selectedSeries} onChange={setSelectedSeries}/>
                        { errors.series_id && <p className="text-red-500">{errors.series_id.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Turma
                        </label>
                        <SelectSearchable options={classes} value={selectedClasses} onChange={setSelectedClasses}/>
                        { errors.class_id && <p className="text-red-500">{errors.class_id.message}</p>}

                    </div>
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            COMPONENTE/ÁREA
                        </label>
                        <SelectSearchable options={disciplines} value={selectedDisciplines}
                                          onChange={setSelectedDisciplines}/>
                        { errors.discipline_id && <p className="text-red-500">{errors.discipline_id.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                            Quantidade de questões
                        </label>
                        <SelectSearchable options={quantityQuestions} value={selectedQuantityQuestions}
                                          onChange={setSelectedQuantityQuestions}/>
                    </div>

                    <div className={"col-span-2 gap-2 mt-14 flex justify-center"}>
                        <Button
                            type="button"
                            onClick={() => window.scrollTo(0, window.innerHeight)}
                            className="flex gap-1 items-center text-white bg-green-600 hover:bg-green-500">
                            <ClipboardPlus className="text-white w-4 h-4"/>
                            <span>Preencher Diagnóstico</span>
                        </Button>
                        <Button
                            type="submit"
                            className="flex gap-1 items-center text-white bg-[--primary-color] hover:bg-[--primary-color-dark]">
                            <ClipboardPlus className="text-white w-4 h-4"/>
                            <span>Salvar Diagnóstico</span>
                        </Button>
                    </div>
                </section>

                {/*<section*/}
                {/*    className={`w-full flex justify-center cursor-pointer p-2 bg-white hover:bg-sky-50 ${isOpen ? 'absolute bottom-0' : ' sticky bottom-0'}`}*/}
                {/*    title={"Clique para Expandir/Fechar"}*/}
                {/*    onClick={() => setIsOpen(!isOpen)}>*/}
                {/*    <ChevronDown*/}
                {/*        size={20}*/}
                {/*        className={`text-black transition-transform ${isOpen ? 'transform rotate-180' : ''}`}/>*/}
                {/*</section>*/}
            </form>

            <section
                className={"w-full max-w-screen-2xl max-h-[99vh] h-[100%] bg-white overflow-auto grid min-h-screen"}>


                <div className={"overflow-auto"}>
                    <div className={"overflow-none"}>
                        <table className={"min-w-[1000px] w-full overflow-auto table-auto border-collapse"}>
                            <thead className={"sticky top-0 bg-white z-40"}>
                            <tr className={"whitespace-nowrap w-auto"}>
                                <th className={`pl-3 py-2 border-y border-gray-100 whitespace-nowrap w-auto sticky left-0 bg-white`}>Nº</th>
                                <th className={`pl-3 py-2 border-y border-gray-100 sticky left-9 bg-white`}>Nome do
                                    estudante
                                </th>
                                {
                                    questions.map((question, index) => (
                                        <th
                                            key={index}
                                            onClick={() => handleChangeIndicator(question)}
                                            className={`border-y whitespace-nowrap w-auto min-h-40 cursor-pointer hover:bg-sky-50`}>
                                            <div className="group relative inline-block pl-3 py-2 ">
                                                <div>
                                                    <p>{question.question}</p>
                                                    {
                                                        question.indicator ?
                                                            (<p className={`text-xs text-gray-500`}>{question.indicator?.code}</p>) :
                                                            (<p className={`text-xs text-red-400`}>Sem Indicador</p>)
                                                    }
                                                </div>

                                                {
                                                    question.indicator ?
                                                    (
                                                        <div
                                                            className="absolute left-full top-3/4 -translate-y-1/2 ml-2
                                                                min-w-64 bg-base-100 border rounded-lg shadow-xl p-4
                                                                z-[99999] opacity-0 invisible
                                                                group-hover:opacity-100 group-hover:visible
                                                                transition duration-200">
                                                            <h3 className="font-bold mb-3">{question.indicator?.code}</h3>
                                                            <p className="text-sm max-w-96 break-words whitespace-normal">{question.indicator?.description}</p>
                                                        </div>
                                                    ) : null
                                                }
                                            </div>


                                        </th>
                                    ))
                                }
                                <th className={`pl-3 py-2 border-y border-gray-100 bg-cyan-100`}>TOTAL DE
                                    ACERTOS/ALUNO
                                </th>
                                <th className={`pl-3 py-2 border-y border-gray-100 whitespace-nowrap w-auto bg-red-300`}>
                                    NÃO TABULADO
                                </th>
                                <th className={`pl-3 py-2 border-y border-gray-100 whitespace-nowrap w-auto bg-yellow-100`}>A.E.E</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                isStudentLoading ? <tr>
                                        <td className={`pl-3 py-2 border-y border-gray-100 whitespace-nowrap w-auto sticky left-0 z-50 text-center`}
                                            colSpan={questions.length + 3}>
                                            <Loading/>
                                        </td>
                                    </tr> :

                                    students.length ? students.map((user, index) => (
                                        <tr key={index} className={`pl-2 border-b border-gray-300`}>
                                            <td className={`pl-3 py-2 border-y border-gray-100 sticky left-0 ${index % 2 !== 0 ? "bg-[#e0e0e0]" : "bg-white"} z-30`}>{index + 1}</td>
                                            <td
                                                className={`pl-3 py-2 border-y border-gray-100 whitespace-nowrap w-auto sticky left-9 ${index % 2 !== 0 ? "bg-[#e0e0e0]" : "bg-white"} z-30`}>
                                                {user.name}
                                            </td>

                                            {
                                                questions.map((question, index) => (
                                                    <td key={index}
                                                        className={`pl-3 border-y min-w-40 w-40 text-center`}>
                                                        <Button onClick={() => handleChangeStatus(question.id, user.id)}
                                                                className={`w-full py-4 hover:mix-blend-multiply hover:bg-gray-100
                                                            h-full rounded-none border-none hover:text-black shadow-none ${setColorBtn(user, question, studentsTotalCorrects)}`}>
                                                            {studentsTotalCorrects?.find((student) => user.id === student.id)?.questions?.find((q) => question.id === q?.id)?.status || "S/N"}
                                                        </Button>
                                                    </td>
                                                ))
                                            }
                                            <td className={`pl-3 py-2 border-y min-w-40 w-40 text-center`}>
                                                {studentsTotalCorrects.find((student) => user.id === student.id)?.totalCorrects || 0}
                                            </td>
                                            <td
                                                className={`pl-3 py-2 border-y min-w-40 w-40 text-center cursor-pointer`}
                                                onClick={() => handleTabulate(user.id)}
                                            >
                                                {
                                                    studentsTotalCorrects.find((student) => user.id === student.id)?.tabulated === false ?
                                                            <span className={`text-red-500`}>Não Tabulado</span> :
                                                            <span></span>
                                                }

                                            </td>
                                            <td className={`pl-3 py-2 border-y min-w-40 w-40 text-center cursor-pointer`}
                                                onClick={() => handleAEE(user.id)}>
                                                {
                                                    studentsTotalCorrects.find((student) => user.id === student.id)?.a_e_e === 'SIM' ?
                                                            <span className={`text-yellow-500`}>SIM</span> :
                                                            <span></span>
                                                }
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td className={`pl-3 py-2 border-y border-gray-100 whitespace-nowrap w-auto sticky left-0 z-50 text-center`}
                                                colSpan={questions.length + 3}>
                                                Nenhum estudante encontrado.
                                            </td>
                                        </tr>
                                    )
                            }


                            </tbody>

                            <tfoot className={"sticky bottom-0 bg-white z-40"}>
                            <tr>
                                <td colSpan={2}
                                    className={`pl-3 py-2 border-y border-gray-100 bg-white whitespace-nowrap w-auto sticky left-0 z-50`}>
                                    TOTAL DE ACERTOS/TURMA
                                </td>
                                {
                                    questions.map((question, index) => (
                                        <td key={index} className={`pl-3 py-2 border-y min-w-40 w-40 text-center`}>
                                            {studentsTotalCorrects.reduce((acc, student) => acc + (student.questions.find((q) => q.id === question.id)?.status === "SIM" ? 1 : 0), 0)}
                                        </td>
                                    ))
                                }
                            </tr>


                            </tfoot>
                        </table>
                    </div>
                </div>
            </section>
        </main>
)
}

function setColorBtn (user: Student, question: Question, studentsTotalCorrects: StudentStatus[]) {
    const student = studentsTotalCorrects.find((student) => student.id === user.id);

    if (student) {
        const questionStatus = student.questions.find((q) => q.id === question.id);

        if (questionStatus) {
            return questionStatus.status === "SIM" ? "bg-green-200 hover:bg-green-300" : questionStatus.status === "NÃO" ? "bg-red-200 hover:bg-red-300" : "";
        }
    }

    return "";
}