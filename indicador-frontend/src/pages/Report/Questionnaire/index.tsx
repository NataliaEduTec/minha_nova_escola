import ReportHeader from "@/components/General/ReportHeader";
import QuestionnaireHeader from "@/components/General/Questionnaire/Header";
import { useLocation } from 'react-router-dom';
import { TQuestionFormValues } from '@/services/questions';
import { useEffect, useState } from "react";

export default function QuestionnairePrint() {
    const [questions, setQuestions] = useState<TQuestionFormValues[]>([]);

    const location = useLocation();

    const receivedData = location.state;

    useEffect(() => {
        if (receivedData && receivedData.data) {
            setQuestions(receivedData.data);
        }
    }, [receivedData]);

    useEffect(() => {
        console.log(questions);
    }, [questions]);

    return (
        <div className="min-h-screen w-screen z-[10010] bg-white p-8">
            <div className="max-w-7xl mx-auto bg-white">
                <ReportHeader title={"Impressão de Questionário"} className={`no-printable`} />
                <div className={`max-w-5xl mx-auto`}>
                    <QuestionnaireHeader />

                    <div className="rounded-box shadow-md overflow-x-auto">

                    </div>

                    <div className="shadow-md overflow-x-auto border border-gray-200 mt-4">
                        {
                            questions.map((question, index) => (
                                <div key={index} className="p-3  rounded-md prose max-w-none min-h-[120px] redender-questionnaire">
                                    <div dangerouslySetInnerHTML={{__html: question.content}} />
                                    {
                                        question.alternatives?.map((alternative, altIndex) => (
                                            <div key={altIndex} className="flex items-center gap-2 mt-3">
                                                {/* <input
                                                    onChange={() => {}}
                                                    className="form-radio"
                                                    type={question.type === 'single' ? 'radio' : 'checkbox'}
                                                    name={`question-${index}`}
                                                    id={`question-${index}-alt-${altIndex}`}
                                                    checked={alternative.isCorrect || alternative.is_correct}
                                                    value={alternative.id}
                                                /> */}
                                                <label
                                                    htmlFor={`question-${index}-alt-${altIndex}`}
                                                    dangerouslySetInnerHTML={{__html: alternative.content}}
                                                >{}
                                                    </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className={`min-h-32`}></div>
        </div>
    );
}