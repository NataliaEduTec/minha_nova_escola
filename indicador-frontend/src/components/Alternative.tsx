import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import {TAlternativeFormValues as AlternativeType} from "@/services/questions.ts";
import TiptapEditor from './TiptapEditor';

interface AlternativeProps {
    alternative: AlternativeType;
    questionId: string;
    questionType: 'single' | 'multiple';
    onUpdateAlternative: (questionId: string, alternativeId: string, content: string) => void;
    onToggleCorrect: (questionId: string, alternativeId: string) => void;
    onRemoveAlternative: (questionId: string, alternativeId: string) => void;
    isEditing: boolean;
}

const Alternative: React.FC<AlternativeProps> = ({
                                                     alternative,
                                                     questionId,
                                                     questionType,
                                                     onUpdateAlternative,
                                                     onToggleCorrect,
                                                     onRemoveAlternative,
                                                     isEditing
                                                 }) => {
    return (
        <div className={`flex items-center gap-2 p-2 border rounded-md mb-2 ${alternative.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
            {isEditing ? (
                <>
                    <button
                        onClick={() => onToggleCorrect(questionId, alternative.id)}
                        className={`w-6 h-6 flex items-center justify-center rounded-${questionType === 'single' ? 'full' : 'md'} border ${
                            alternative.isCorrect
                                ? 'bg-green-500 border-green-600 text-white'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                        title={alternative.isCorrect ? "Resposta correta" : "Marcar como correta"}
                    >
                        {alternative.isCorrect && <Check size={16} />}
                    </button>
                    <div className="flex-1">
                        <TiptapEditor
                            content={alternative.content}
                            onChange={(html) => onUpdateAlternative(questionId, alternative.id, html)}
                            placeholder="Conteúdo da alternativa..."
                            className="alternative-editor"
                            isAlternative
                        />
                    </div>
                    <button
                        onClick={() => onRemoveAlternative(questionId, alternative.id)}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        title="Remover alternativa"
                    >
                        <Trash2 size={18} />
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-2 w-full">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-${questionType === 'single' ? 'full' : 'md'} border ${
                        alternative.isCorrect
                            ? 'bg-green-500 border-green-600 text-white'
                            : 'border-gray-300'
                    }`}>
                        {alternative.isCorrect && <Check size={16} />}
                    </div>
                    <div className="flex-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: alternative.content }} />
                </div>
            )}
        </div>
    );
};

export default Alternative;