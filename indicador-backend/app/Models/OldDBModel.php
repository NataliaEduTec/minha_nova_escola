<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class OldDBModel
{
    private int $time_to_live = 600;

    public function getAllInstitution(): array
    {
        return Cache::remember('all-institutions', $this->time_to_live, function () {
            return DB::connection('external')
                ->select('SELECT id_instituicao, nome_instituicao FROM instituicao WHERE ativo_instituicao = 1 AND NOT nome_instituicao LIKE "%TESTE%" ORDER BY nome_instituicao');
        });
    }

    public function getUniqueInstitution(int $id): array
    {
        return Cache::remember("institution-{$id}", $this->time_to_live, function () use ($id) {
            return DB::connection('external')
                ->select('SELECT id_instituicao, nome_instituicao FROM instituicao WHERE ativo_instituicao = 1 AND id_instituicao = ?', [$id]);
        });
    }

    public function getInstitutionByName(string $name): array
    {
        return Cache::remember("institution-name-{$name}", $this->time_to_live, function () use ($name) {
            return DB::connection('external')
                ->select('SELECT id_instituicao, nome_instituicao FROM instituicao WHERE ativo_instituicao = 1 AND nome_instituicao LIKE ?', ["%{$name}%"]);
        });
    }

    public function getAllSeries() {
        return Cache::remember("all-series", $this->time_to_live, function () {
            return DB::connection('external')
                ->select(
                    'SELECT
                            id_curso, sigla_curso, descricao_curso
                        FROM curso
                        WHERE ativo_curso = 1
                        GROUP BY id_curso'
                );
        });
    }

    public function getSeriesByInstitution(int $institutionId): array
    {
        return Cache::remember("institution-series-{$institutionId}", $this->time_to_live, function () use ($institutionId) {
            return DB::connection('external')
                ->select(
                    'SELECT
                            id_curso, sigla_curso, descricao_curso
                        FROM curso
                        INNER JOIN instituicao_has_curso ON instituicao_has_curso.curso_id_curso = curso.id_curso
                        WHERE
                            ativo_curso = 1
                            AND instituicao_id_instituicao = ?
                        GROUP BY id_curso',
                    [$institutionId]
                );
        });
    }

    public function getClassBySeries(int $seriesId): array
    {
        return Cache::remember("institution-series-{$seriesId}", $this->time_to_live, function () use ($seriesId) {
            return DB::connection('external')
                ->select(
                    'SELECT
                            id_turma, descricao_turma, turno_turma
                        FROM turma
                        INNER JOIN turma_has_curso ON turma_has_curso.turma_id_turma = turma.id_turma
                        WHERE
                            ativo_turma = 1
                            AND turma_has_curso.curso_id_curso = ?
                        GROUP BY id_turma',
                    [$seriesId]
                );
        });
    }

    public function getAllDisciplines(): array
    {
        return Cache::remember("all-disciplines", $this->time_to_live, function () {
            return DB::connection('external')
                ->select(
                    'SELECT
                            id_disciplina, descricao_disciplina
                        FROM disciplina
                        WHERE ativo_disciplina = 1
                        ORDER BY descricao_disciplina'
                );
        });
    }

    public function getDisciplinesBySeries(int $seriesId): array
    {
        return Cache::remember("series-disciplines-{$seriesId}", $this->time_to_live, function () use ($seriesId) {
            return DB::connection('external')
                ->select(
                    'SELECT
                            disciplina.id_disciplina, disciplina.descricao_disciplina
                        FROM disciplina
                        INNER JOIN carga_horaria_disciplina ON carga_horaria_disciplina.disciplina_id_disciplina = disciplina.id_disciplina
                        WHERE
                            disciplina.ativo_disciplina = 1
                            AND carga_horaria_disciplina.curso_id_curso = ?
                            AND carga_horaria_disciplina.ativo_carga_horaria_disciplina = 1
                        GROUP BY disciplina.id_disciplina
                        ORDER BY disciplina.id_disciplina',
                    [$seriesId]
                );
        });
    }

    public function getStudentsByClassAndSchoolYear(int $classId, int $schoolYear): array
    {
        return Cache::remember("class-{$classId}-students-{$schoolYear}", $this->time_to_live, function () use ($classId, $schoolYear) {
            return DB::connection('external')
                ->select(
                    'SELECT
                        nome_aluno, matricula_aluno
                        FROM aluno, matricula
                        WHERE turma_id_turma = ?
                          AND aluno_matricula_aluno = matricula_aluno
                          AND ativo_aluno = 1 AND cancelado_matricula = 0
                          AND ano_letivo_matricula = ?
                        ORDER BY nome_aluno',
                    [$classId, $schoolYear]
                );
        });
    }

    public function getClassByInstitutinAndSchoolYear(int $institutionId, int $schoolYear): array
    {
        return Cache::remember("class-institution-{$institutionId}-schoolYear-{$schoolYear}", $this->time_to_live, function () use ($institutionId, $schoolYear) {
            return DB::connection('external')
                ->select(
                    'SELECT id_turma, descricao_turma, turno_turma
                            FROM turma
                            WHERE instituicao_id_instituicao = ?
                            AND ativo_turma= 1
                            AND ano_turma = ?
                            ORDER BY descricao_turma',
                    [$institutionId, $schoolYear]
                );
        });
    }

    public function getClassBySchoolYearAndSeries(int $schoolYear, int $seriesId, int $institutionId): array
    {
        return Cache::remember("class-schoolYear-{$schoolYear}-series-{$seriesId}", $this->time_to_live, function () use ($schoolYear, $seriesId, $institutionId) {
            return DB::connection('external')
                ->select(
                    'SELECT id_turma, descricao_turma, turno_turma
                            FROM turma
                            WHERE ativo_turma = 1
                            AND ano_turma = ?
                            AND turma.curso_id_curso = ?
                            AND turma.instituicao_id_instituicao = ?
                            ORDER BY descricao_turma',
                    [$schoolYear, $seriesId, $institutionId]
                );
        });
    }
}
