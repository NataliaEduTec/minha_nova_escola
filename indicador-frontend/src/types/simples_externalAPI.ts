export type TExternalInstitution = {
    id_instituicao: number;
    nome_instituicao: string;
}

export type TExternalSeries = {
    id_curso: number;
    sigla_curso: string;
    descricao_curso: string;
}

export type TExternalClasses = {
    id_turma: number;
    descricao_turma: string;
    turno_turma: string;
}

export type TExternalDisciplines = {
    id_disciplina: number;
    descricao_disciplina: string;
}

export type TExternalStudents = {
    matricula_aluno: number;
    nome_aluno: string;
}

