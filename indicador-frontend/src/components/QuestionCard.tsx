import React, { useState } from 'react';
import { TQuestionFormValues as QuestionType } from "@/services/questions.ts";
import TiptapEditor from './TiptapEditor';
import { Eye, Edit3, Trash, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Alternative from "@/components/Alternative";

interface QuestionCardProps {
  question: QuestionType;
  onUpdateQuestion: (updatedQuestion: QuestionType) => void;
  onRemoveQuestion: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onUpdateQuestion,
  onRemoveQuestion
}) => {
  const [isEditing, setIsEditing] = useState(true);

  const handleContentChange = (html: string) => {
    onUpdateQuestion({
      ...question,
      content: html
    });
  };

    const handleTypeChange = (type: 'single' | 'multiple') => {
        onUpdateQuestion({
            ...question,
            type,
            alternatives: question?.alternatives?.map(alt => ({
                ...alt,
                isCorrect: false
            }))
        });
    };

    const handleAddAlternative = () => {
        const newAlternative = {
            id: uuidv4(),
            content: '',
            questions_id: uuidv4(),
            isCorrect: false
        };

        onUpdateQuestion({
            ...question,
            alternatives: [...question?.alternatives || [], newAlternative]
        });
    };

    const handleUpdateAlternative = (questionId: string, alternativeId: string, content: string) => {
        console.log(questionId)
        onUpdateQuestion({
            ...question,
            alternatives: question?.alternatives?.map(alt =>
                alt.id === alternativeId ? { ...alt, content } : alt
            ) || []
        });
    };

    const handleToggleCorrect = (questionId: string, alternativeId: string) => {
        console.log(questionId)
        onUpdateQuestion({
            ...question,
            alternatives: question?.alternatives?.map(alt => {
                if (question.type === 'single') {
                    return {
                        ...alt,
                        isCorrect: alt.id === alternativeId
                    };
                }
                return alt.id === alternativeId ? { ...alt, isCorrect: !alt.isCorrect } : alt;
            }) || []
        });
    };

    const handleRemoveAlternative = (questionId: string, alternativeId: string) => {
        console.log(questionId)
        onUpdateQuestion({
            ...question,
            alternatives: question?.alternatives?.filter(alt => alt.id !== alternativeId) || []
        });
    };

  return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Questão</h3>
              <div className="flex gap-2">
                  <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      title={isEditing ? "Preview" : "Edit"}
                  >
                      {isEditing ? <Eye size={18}/> : <Edit3 size={18}/>}
                  </button>
                  <button
                      onClick={() => onRemoveQuestion(question.id)}
                      className="p-2 rounded-md hover:bg-gray-100 transition text-red-500"
                      title="Remove question"
                  >
                      <Trash size={18}/>
                  </button>
              </div>
          </div>

          <div className="mb-4">
              {isEditing ? (
                  <TiptapEditor
                      content={question.content}
                      onChange={handleContentChange}
                      placeholder="Digite o conteúdo da questão aqui..."
                  />
              ) : (
                  <div
                      className="p-3 border border-gray-200 rounded-md prose max-w-none min-h-[120px]"
                      dangerouslySetInnerHTML={{__html: question.content || '<p>Não há conteúdo</p>'}}
                  />
              )}
          </div>

          {isEditing && (
              <div className="mb-4">
                  <select
                      value={question.type}
                      onChange={(e) => handleTypeChange(e.target.value as 'single' | 'multiple')}
                      className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  >
                      <option value="single">Resposta Única</option>
                      <option value="multiple">Resposta Múltipla</option>
                  </select>
              </div>
          )}

            {question.error && (
                <div className="mb-4">
                    <span className="text-red-500 text-sm">{question.error}</span>
                </div>
            )}

          <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Alternativas</h4>
                  {isEditing && (
                      <button
                          onClick={handleAddAlternative}
                          className="flex items-center gap-1 py-1 px-3 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      >
                          <Plus size={16}/>
                          Adicionar Alternativa
                      </button>
                  )}
              </div>
              <div className="space-y-2">
                  {question?.alternatives && question.alternatives.map(alternative => (
                      <Alternative
                          key={alternative.id}
                          alternative={alternative}
                          questionId={question.id}
                          questionType={question.type}
                          onUpdateAlternative={handleUpdateAlternative}
                          onToggleCorrect={handleToggleCorrect}
                          onRemoveAlternative={handleRemoveAlternative}
                          isEditing={isEditing}
                      />
                  ))}
              </div>
          </div>
      </div>
  );
};

export default QuestionCard;