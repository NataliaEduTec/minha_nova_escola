import {TQuestionFormValues} from "@/services/questions.ts";

export interface QuestionBank {
    id: string;
    title: string;
    questions: TQuestionFormValues[];
}

export type EditorMode = 'Editar' | 'Visualizar';

export type StudentStatus = {
    id: number;
    questions: {
        id: number;
        status: string;
    }[];
    totalCorrects: number;
    tabulated?: boolean;
    a_e_e?: string;
}