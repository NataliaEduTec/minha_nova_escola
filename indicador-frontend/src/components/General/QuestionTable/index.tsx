import { Question } from "@/pages/Diagnostic";

type Props = {
    questions: Question[];
    className?: string;
}

export default function QuestionTable({ questions, className }: Props  ) {
    return <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Indicador
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descrição
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {questions.map(question => (
                                <tr key={question.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {question.indicator?.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {question.indicator?.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
}