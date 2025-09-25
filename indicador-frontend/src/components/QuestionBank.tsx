import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionBank as QuestionBankType, EditorMode } from '../types';
import QuestionCard from './QuestionCard';
import { Plus, Undo2, Download, Upload, Edit3, Eye } from 'lucide-react';
import Button from "@/components/Elements/Button";
import {SubmitHandler} from "react-hook-form";
import {Id, toast} from "react-toastify";
import QuestionsApi, {TQuestionFormValues} from "@/services/questions.ts";
import { useNavigate } from 'react-router-dom';

const defaultQuestion: TQuestionFormValues = {
    id: uuidv4(),
    content: '',
    type: 'single',
    alternatives: [],
    indicator_id: uuidv4(),
    series_id: uuidv4(),
};

const defaultQuestionBank: QuestionBankType = {
    id: uuidv4(),
    title: 'Cadastro de Questões',
    questions: []
};

interface Props {
    indicator?: string;
    discipline?: string;
    series?: string;
    selectedIndicator: {
        label: string;
        value: string;
    }[];
    selectedSeries: {
        label: string;
        value: string;
    }[];
    selectedDisciplines: {
        label: string;
        value: string;
    }[]
}

const QuestionBank: React.FC<Props> = ({indicator, discipline, series, selectedIndicator, selectedSeries, selectedDisciplines}) => {
    const navigate = useNavigate();
    const [questionBank, setQuestionBank] = useState<QuestionBankType>(defaultQuestionBank);
    const [mode, setMode] = useState<EditorMode>('Editar');

    useEffect(() => {
        const handleSplitQuestions = (event: CustomEvent<string[]>) => {
            const newQuestions = event.detail.map(content => ({
                ...defaultQuestion,
                id: uuidv4(),
                content
            }));

            setQuestionBank(prev => ({
                ...prev,
                questions: [...prev.questions, ...newQuestions]
            }));
        };

        window.addEventListener('splitQuestions', handleSplitQuestions as EventListener);
        return () => {
            window.removeEventListener('splitQuestions', handleSplitQuestions as EventListener);
        };
    }, []);

    const handleAddQuestion = () => {
        const newQuestion = {
            ...defaultQuestion,
            id: uuidv4()
        };

        setQuestionBank({
            ...questionBank,
            questions: [...questionBank.questions, newQuestion]
        });
    };

    const handleUpdateQuestion = (updatedQuestion: TQuestionFormValues) => {
        updatedQuestion.error = '';
        const updatedQuestions = questionBank.questions.map(question =>
            question.id === updatedQuestion.id ? updatedQuestion : question
        );

        setQuestionBank({
            ...questionBank,
            questions: updatedQuestions
        });
    };

    const handleRemoveQuestion = (questionId: string) => {
        setQuestionBank({
            ...questionBank,
            questions: questionBank.questions.filter(question => question.id !== questionId)
        });
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(questionBank, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `${questionBank.title.replace(/\s+/g, '_').toLowerCase()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string) as QuestionBankType;
                setQuestionBank(imported);
            } catch (error) {
                console.error('Error importing question bank:', error);
                alert('Failed to import question bank. The file format is invalid.');
            }
        };
        reader.readAsText(file);

        e.target.value = '';
    };

    const toggleMode = () => {
        setMode(mode === 'Editar' ? 'Visualizar' : 'Editar');
    };

    const onSubmit: SubmitHandler<TQuestionFormValues[]> = async (data) => {
        const toastId = toast.loading("Aguarde, por favor...")

        if (data.length === 0) {
            toast.update(toastId, {
                render: "Adicione pelo menos uma questão",
                type: "error",
                autoClose: 3000,
                isLoading: false,
            })
            return
        }

        data.forEach((question) => {
            question.id = uuidv4();

            let error = '';

            if (!question.indicator_id) {
                error = "O indicador é obrigatório";
            }

            if(!question.content) {
                error = "O conteúdo da questão é obrigatório";
            }

            if (!question.series_id) {
                error = "A série é obrigatória";
            }

            if (error) {
                toast.update(toastId, {
                    render: error,
                    type: "error",
                    autoClose: 3000,
                    isLoading: false,
                })

                setQuestionBank((prev) => ({
                    ...prev,
                    questions: prev.questions.map((q) => {
                        if (q.id === question.id) {
                            return { ...q, error: error }
                        }
                        return q
                    })
                }))

                return
            }

            question.alternatives?.forEach((alt) => {
                alt.id = uuidv4();
            });
        })

        return await register(data, toastId)
    }

    const submitAndgenerateQuestionnarie = async (data: TQuestionFormValues[]) => {
        try {
            const response = await onSubmit(data);
            if (!response) {
                return;
            }

            navigate('/indicadores/questionario', {
                state: {
                    data: response,
                    selectedIndicator,
                    selectedSeries,
                    selectedDisciplines
                }
            });
        } catch (e) {
            console.error(e);
        }
    }


    const register = async (data: TQuestionFormValues[], toastId: Id) => {

        try {
            const response = await QuestionsApi.create(data)

            toast.update(toastId, {
                render: response.message,
                type: response.status,
                autoClose: 3000,
                isLoading: false,
            })

            if (response.status === "success") {
                // setQuestionBank(defaultQuestionBank);
                return response.data;
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
    useEffect(() => {
        if (indicator) {
            setQuestionBank(prev => ({
                ...prev,
                questions: prev.questions.map(question => ({
                    ...question,
                    indicator_id: indicator,
                    series_id: series || question.series_id,
                    discipline_id: discipline || question.discipline_id,
                }))
            }));
        }
    }, [discipline, indicator, series]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div className="flex-1 min-w-0 mr-4">
                        {mode === 'Editar' ? (
                            <div
                                className="w-full text-2xl font-bold border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-2"
                            >{questionBank.title}</div>
                        ) : (
                            <h1 className="text-2xl font-bold text-gray-800 pb-2 border-b border-gray-200">
                                {questionBank.title}
                            </h1>
                        )}
                    </div>

                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                            onClick={toggleMode}
                            className="flex items-center gap-1 py-2 px-3 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            title={mode === 'Editar' ? 'Modo de Visualização' : 'Modo de Edição'}
                        >
                            {mode === 'Editar' ? <Eye size={18} /> : <Edit3 size={18} />}
                            {mode === 'Editar' ? 'Previsualizar' : 'Editar'}
                        </button>

                        <button
                            onClick={() => setQuestionBank(defaultQuestionBank)}
                            className="flex items-center gap-1 py-2 px-3 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            title="Reset question bank"
                        >
                            <Undo2 size={18} />
                            Resetar
                        </button>

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-1 py-2 px-3 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                            title="Export question bank"
                        >
                            <Download size={18} />
                            Exportar
                        </button>

                        <label className="flex items-center gap-1 py-2 px-3 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition cursor-pointer">
                            <Upload size={18} />
                            Importar
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Questões ({questionBank.questions.length})
                        </h2>
                        {mode === 'Editar' && (
                            <button
                                onClick={handleAddQuestion}
                                className="flex items-center gap-1 py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                <Plus size={18} />
                                Adicionar Questão
                            </button>
                        )}
                    </div>

                    {questionBank.questions.length > 0 ? (
                        <div className="space-y-6">
                            {questionBank.questions.map(question => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    onUpdateQuestion={handleUpdateQuestion}
                                    onRemoveQuestion={handleRemoveQuestion}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">Nenhuma Questão Adicionada.</p>
                            {mode === 'Editar' && (
                                <button
                                    onClick={handleAddQuestion}
                                    className="flex items-center gap-1 py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition mx-auto"
                                >
                                    <Plus size={18} />
                                   Adicionar Primeira Questão
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(questionBank.questions)
            }}>
                <div className="flex justify-end items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => submitAndgenerateQuestionnarie(questionBank.questions)}
                        className="py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-500 transition"
                    >
                        Salvar e Gerar Questionário
                    </Button>
                    <Button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Salvar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default QuestionBank;