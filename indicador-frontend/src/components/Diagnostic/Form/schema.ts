import { z } from "zod";

const diagnosticStudent = z.object({
    id: z.string().uuid(),
    diagnostic_id: z.string().min(1, "Diagnóstico é obrigatório"),
    student_id: z.string().min(1, "Aluno é obrigatório"),
    questions: z.array(z.object({
        id: z.string().min(1, "Questão é obrigatória"),
        status: z.enum(["SIM", "NÃO", "S/N"]).default("S/N"),
    })).optional(),
    tabulated: z.boolean().default(true),
    a_e_e: z.string().optional(),
});

export const diagnosticQuestionnaireSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
    content: z.string().optional(),
    diagnostic_id: z.string().uuid(),
});

export const diagnosticSchema = z.object({
    id: z.string().uuid(),
    institution_id: z.string().min(1, "Instituição é obrigatória"),
    series_id: z.string().min(1, "Série é obrigatória"),
    class_id: z.string().min(1, "Turma é obrigatória"),
    discipline_id: z.string().min(1, "Disciplina é obrigatória"),
    name: z.string().min(1, "Nome é obrigatório").max(255, "Nome deve ter no máximo 255 caracteres"),
    schoolYear: z.string().min(1, "Ano letivo é obrigatório"),
    diagnostic_student: z.array(diagnosticStudent).optional(),
    questionnaire: diagnosticQuestionnaireSchema.optional(),
});

export type TDiagnosticStudentQuestion = {
    id: string;
    status: string;
};

export type TDiagnosticStudent = {
    id?: string;
    diagnostic_id: string;
    student_id: string;
    tabulated: boolean;
    a_e_e?: string;
    questions?: TDiagnosticStudentQuestion[];
};

export type TDiagnosticQuestionnaire = {
    id?: string;
    name: string;
    content: string;
    diagnostic_id: string;
};

export type TDiagnostic = {
    id: string;
    institution_id: string;
    series_id: string;
    class_id?: string;
    discipline_id?: string;
    name: string;
    schoolYear: string;
    diagnostic_student?: TDiagnosticStudent[];
    diagnostic_questionnaire?: TDiagnosticQuestionnaire;
    quantity_questions?: number;
    user?: {
        id: string;
        name: string;
        email: string;
    }
    created_at?: string;
};


export type FormData = z.infer<typeof diagnosticSchema>;