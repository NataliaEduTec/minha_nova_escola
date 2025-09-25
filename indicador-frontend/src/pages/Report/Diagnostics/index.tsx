import ReportHeader from "../../../components/General/ReportHeader";
import {LayoutReport} from "@/pages/Report/Layout";
import Charts from "@/components/Charts";
import {useEffect, useMemo, useState} from "react";
import Divider from "@/components/Divider";
import {ApexOptions} from "apexcharts";
import FormDiagnostic from "@/components/Diagnostic/Form";
import {TDiagnostic} from "@/components/Diagnostic/Form/schema.ts";
import {getDiagnosticById} from "@/services/diagnostics.ts";
import {TExternalClasses, TExternalDisciplines} from "@/types/simples_externalAPI.ts";
import { Question } from "@/pages/Diagnostic";
import Button from "@/components/Elements/Button";
import { getAllIndicators } from "@/services/indicator";
import QuestionTable from "@/components/General/QuestionTable";

export default function DiagnosticsReportResults() {
    const [selectedDiagnostic, setSelectedDiagnostic] = useState<string>("");
    const [diagnostic, setDiagnostic] = useState<TDiagnostic | null>(null);
    const [diagnostics, setDiagnostics] = useState<TDiagnostic[]>([]);
    useEffect(() => {
        console.log(diagnostic);
    }, [diagnostic]);

    const [disciplineSelected, setDisciplineNameSelected] = useState<TExternalDisciplines | null>(null);
    const [diagnosticsByClass, setDiagnosticsByClass] = useState<Record<number, TDiagnostic[]>>([]);

    const [classes, setClasses] = useState<TExternalClasses[]>([])
    const [selectedClass, setSelectedClass] = useState<TExternalClasses | null>(null);

    const [totalCurrectByQuestionBySeries, setTotalCurrectByQuestionBySeries] = useState<number[]>([]);

    const [seriesName, setSeriesName] = useState<string>("")
    const [diagnosticName, setDiagnosticName] = useState<string>("");

    useEffect(() => {
        console.log(diagnosticName);
    }, [diagnosticName]);

    const [grapicPie, setGrapicPie] = useState<{ series: number[], label: string[] }>({
        series: [],
        label: []
    });

    const [categories, setCategories] = useState<string[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        console.log(questions);
    }, [questions]);

    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [descriptionIndicatorIsVisible, setDescriptionIndicatorIsVisible] = useState<boolean>(false);
    const [descriptionIndicatorIsVisible2, setDescriptionIndicatorIsVisible2] = useState<boolean>(false);

    const [qtdQuestions] = useState<number>(25);

    const seriesByClass = useMemo(() => {
        return Object.entries(diagnosticsByClass).map(([classId, diagnostics]) => {
            const className = classes.find(c => c.id_turma === parseInt(classId, 10))?.descricao_turma || `Classe ${classId}`;

            const data = diagnostics.map((diagnostic) => {
                return diagnostic.diagnostic_student?.map((student) => {
                    return Array.from({length: student?.questions?.length || qtdQuestions}).fill(0).map((_, index) => {
                        const question = student.questions?.[index];
                        return question?.status === "SIM" ? 1 : 0;
                    });
                }).reduce((acc, curr) => {
                    if (acc.length === 0) {
                        return curr;
                    }
                    return acc.map((value, index) => value + (curr[index] || 0));
                }, Array(qtdQuestions).fill(0))
            }).reduce((acc, curr) => {
                if (acc && acc.length === 0) {
                    return curr;
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return acc.map((value, index) => value + (curr[index] || 0));
            }, Array(qtdQuestions).fill(0));

            return {
                name: className,
                data: data || Array(qtdQuestions).fill(0),
            };
        })
    }, [diagnosticsByClass, classes, qtdQuestions]);

    const optionsBarByClass = useMemo(() => {
        return {
            series: seriesByClass || [],
            xaxis: {
                categories: categories.length ? categories : Array(qtdQuestions).fill(''),
            },
            yaxis: {
                title: {
                    text: 'Número de Diagnósticos'
                }
            },
            tooltip: {
                y: {
                    formatter: undefined,
                    title: {
                        formatter: (seriesName: string) => seriesName,
                    }
                }
            }
        }
    }, [categories, qtdQuestions, seriesByClass]);

    const optionsBarBySeries = useMemo(() => ({
        series: [
            {
                name: seriesName,
                data: totalCurrectByQuestionBySeries
            },
        ],
        xaxis: {
            categories: categories.length ? categories : Array(qtdQuestions).fill(''),
        },
        yaxis: {
            title: {
                text: 'Número de Diagnósticos'
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + "%";
                },
                title: {
                    formatter: (seriesName: string) => seriesName,
                },
            },
        }
    }), [categories, qtdQuestions, seriesName, totalCurrectByQuestionBySeries]);

    const optionsPieToTotalStudentBySeries: ApexOptions = useMemo(() => ({
        series: grapicPie.series,
        labels: grapicPie.label,
        colors: ['#00ab72', '#ff113a', '#fbc900'],
        xaxis: {
            categories: ['Tabuldados', 'Não Tabulados', 'A.E.E'],
        },
        yaxis: {
            title: {
                text: 'Número de Diagnósticos'
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " alunos";
                },
                title: {
                    formatter: (seriesName: string) => seriesName,
                }
            }
        },
        chart: {
            type: "pie",
            height: 350,
        }
    }), [grapicPie]);

    useEffect(() => {
        setDiagnosticsByClass({});
        console.log(diagnostics)

        setDiagnosticsByClass(() => {
            const newDiagnosticsByClass: Record<number, TDiagnostic[]> = {};

            for (const classItem of classes) {
                if (selectedClass?.id_turma && classItem.id_turma.toString() !== selectedClass?.id_turma.toString()) continue;
                newDiagnosticsByClass[classItem.id_turma] = [];
            }

            for (const diagnostic of diagnostics) {
                setDiagnosticName(diagnostic.name);
                console.log(diagnostic);
                console.log(selectedClass?.id_turma);

                if (!diagnostic.class_id) continue;
                if (selectedClass?.id_turma && diagnostic.class_id.toString() !== selectedClass?.id_turma.toString()) continue;

                const classId = parseInt(diagnostic.class_id, 10);
                if (!newDiagnosticsByClass[classId]) {
                    newDiagnosticsByClass[classId] = [];
                }

                newDiagnosticsByClass[classId].push(diagnostic);
            }

            return newDiagnosticsByClass;
        })

    }, [classes, diagnostics, selectedClass])

    useEffect(() => {
        if (!selectedDiagnostic) {
            setDiagnostic(null);
            return;
        }

        getDiagnosticById(selectedDiagnostic).then(diagnostic => {
            if (diagnostic) {
                setDiagnostic(diagnostic);
            }
        })
    }, [selectedDiagnostic]);

    useEffect(() => {
        if (seriesByClass.length === 0) {
            setTotalCurrectByQuestionBySeries([]);
            return;
        }
        const totalCurrectByQuestionBySeries = Array.from<number>({length: qtdQuestions}).fill(0);

        seriesByClass.forEach((series) => {
            series.data.forEach((val, index) => {
                totalCurrectByQuestionBySeries[index] = (totalCurrectByQuestionBySeries[index] || 0) + val;
            });
        })

        setTotalCurrectByQuestionBySeries(
            totalStudents ?
                totalCurrectByQuestionBySeries.map((val) => parseFloat((val * 100 / totalStudents).toFixed(2)))
                : Array(qtdQuestions).fill(0)
            );
    }, [diagnostics, qtdQuestions, seriesByClass, totalStudents]);

    useEffect(() => {
        let tabulated = 0;
        let notTabulated = 0;
        setTotalStudents(0);
        let totalStudents = 0;
        let totalAEE = 0;

        diagnostics.forEach(d => {
            d.diagnostic_student?.forEach(student => {
                if (student.tabulated) {
                    tabulated++;
                } else if (student.tabulated === false && student.a_e_e !== "SIM") {
                    notTabulated++;
                }

                if (student.a_e_e === "SIM")
                    totalAEE++;

                totalStudents++;
            });
        });
        setTotalStudents(totalStudents);

        setGrapicPie({
            series: [tabulated, notTabulated, totalAEE],
            label: ['Tabulados', 'Não Tabulados', 'A.E.E']
        })
    }, [diagnostics]);

    useEffect(() => {
        setCategories([]);
        if (!diagnostics.length) return;

        const questionnaire = diagnostics[0].diagnostic_questionnaire?.content;
        if (!questionnaire) return;

        const questions: Question[] = JSON.parse(questionnaire);
        setCategories(questions.map(q => q.indicator?.code || ''));
        setQuestions(questions);
    },[diagnostics]);

    useEffect(() => {
        const indicators = questions.map(q => q.indicator).filter(indicator => indicator ? indicator : false);
        if (!indicators.length) return;
        const ids = indicators.filter((indicator): indicator is NonNullable<typeof indicator> => !!indicator && !!indicator.id).map(indicator => indicator.id);
        getAllIndicators('', ids).then(indicators => {
            if (indicators) {
                console.log(indicators)

                const newQuestions = questions.map(question => {
                        const indicator = indicators.find(ind => ind.id === question.indicator?.id);
                        if (indicator) {
                            return {
                                ...question,
                                indicator: {
                                    ...question.indicator,
                                    id: question.indicator?.id ?? "",
                                    description: indicator.description
                                }
                            } as Question;
                        }
                        return question;
                    });

                if (JSON.stringify(newQuestions) === JSON.stringify(questions)) return;

                setQuestions(newQuestions);
            }
        });
    }, [questions]);

    return (
        <LayoutReport>
            <ReportHeader title={"RELATÓRIO DE ANÁLISES DOS DIAGNÓSTICOS DA REDE MUNICIPAL DE EDUCAÇÃO"} />

            <div className="bg-base-100 rounded-box shadow-md">
                <FormDiagnostic
                    selectedDiagnostic={selectedDiagnostic}
                    setSelectedDiagnostic={setSelectedDiagnostic}
                    setSelectedClass={setSelectedClass}
                    setDiagnostics={setDiagnostics}
                    setClasses={setClasses}
                    setSeriesName={setSeriesName}
                    setDisciplineNameSelected={setDisciplineNameSelected}
                />

                <h2 className="text-2xl font-bold text-center my-4">
                    {diagnosticName ? `${diagnosticName} -` : "Diagnóstico -"} APROVEITAMENTO/TURMA {selectedClass?.descricao_turma ? `- ${selectedClass?.descricao_turma}` : ""}
                </h2>
                <Charts options={optionsBarByClass} className="p-4" />

                <div className="flex flex-col justify-center items-center my-4">
                    <Button className="mb-4 print:hidden" onClick={() => setDescriptionIndicatorIsVisible(!descriptionIndicatorIsVisible)}>
                        Exibir Descrições dos Indicadores
                    </Button>

                    <QuestionTable questions={questions} className={descriptionIndicatorIsVisible ? "" : "hidden"} />
                </div>

                <Divider className="my-4" />

                <h2 className="text-2xl font-bold text-center my-4">
                    RENDIMENTO/QUESTÃO {disciplineSelected?.descricao_disciplina ? `- ${disciplineSelected?.descricao_disciplina}` : ""}
                    {selectedClass?.descricao_turma ? ` - ${selectedClass?.descricao_turma}` : ""}
                </h2>
                <Charts options={optionsBarBySeries} className="p-4" percentage />
                <div className="flex flex-col justify-center items-center my-4">
                    <Button className="mb-4 print:hidden" onClick={() => setDescriptionIndicatorIsVisible2(!descriptionIndicatorIsVisible2)}>
                        Exibir Descrições dos Indicadores
                    </Button>

                    <QuestionTable questions={questions} className={descriptionIndicatorIsVisible2 ? "" : "hidden"} />
                </div>

                <Divider className="my-4" />

                <Charts options={optionsPieToTotalStudentBySeries} className="p-4" />

            </div>

            {/*<div className="text-center py-8 bg-base-100 rounded-box mt-4">*/}
            {/*    <p className="text-gray-500">Nenhum resultado encontrado</p>*/}
            {/*</div>*/}
        </LayoutReport>
    );
}