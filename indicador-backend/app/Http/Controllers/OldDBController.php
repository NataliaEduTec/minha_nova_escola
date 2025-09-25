<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\OldDBModel;
use Illuminate\Http\JsonResponse;

class OldDBController
{
    private OldDBModel $oldDBModel;

    public function __construct()
    {
        $this->oldDBModel = new OldDBModel();
    }

    private function validateIntegerId($id): bool
    {
        return is_numeric($id) && $id > 0;
    }

    public function getAllInstitution(): JsonResponse
    {
        $institution = $this->oldDBModel->getAllInstitution();
        return response()->json(ResponseHelper::success("", $institution));
    }

    public function getUniqueInstitution(int $id): JsonResponse
    {

        if (!$this->validateIntegerId($id)) {
            return response()->json(ResponseHelper::error("Instituição invalida"), 400);
        }

        $institution = $this->oldDBModel->getUniqueInstitution($id);

        if (empty($institution)) {
            return response()->json(ResponseHelper::error("Instituição não encontrada"), 404);
        }

        return response()->json(ResponseHelper::success("", $institution));
    }

    public function getInstitutionByName(string $name): JsonResponse
    {
        if (empty($name)) {
            return response()->json(ResponseHelper::error("Nome da instituição não pode ser vazio"), 400);
        }

        $institution = $this->oldDBModel->getInstitutionByName($name);

        if (empty($institution)) {
            return response()->json(ResponseHelper::error("Instituição não encontrada"), 404);
        }

        return response()->json(ResponseHelper::success("", $institution));
    }

    public function getAllSeries(): JsonResponse
    {
        $series = $this->oldDBModel->getAllSeries();

        return response()->json(ResponseHelper::success("", $series));
    }

    public function getSeriesByInstitution(int $institutionId): JsonResponse
    {
        if (!$this->validateIntegerId($institutionId)) {
            return response()->json(ResponseHelper::error("Instituição invalida"), 400);
        }

        $series = $this->oldDBModel->getSeriesByInstitution($institutionId);

        if (empty($series)) {
            return response()->json(ResponseHelper::error("Série não encontrada"), 404);
        }

        return response()->json(ResponseHelper::success("", $series));
    }

    public function getClassBySeries(int $seriesId): JsonResponse
    {
        if (!$this->validateIntegerId($seriesId)) {
            return response()->json(ResponseHelper::error("Curso invalido"), 400);
        }

        $classes = $this->oldDBModel->getClassBySeries($seriesId);

        if (empty($classes)) {
            return response()->json(ResponseHelper::error("Disciplina não encontrada"), 404);
        }

        return response()->json(ResponseHelper::success("", $classes));
    }

    public function getClassByInstitutinAndSchoolYear(int $institutionId, int $schoolYear): JsonResponse
    {
        if (!$this->validateIntegerId($institutionId) || !$this->validateIntegerId($schoolYear)) {
            return response()->json(ResponseHelper::error("Instituição ou ano letivo inválido"), 400);
        }

        $classes = $this->oldDBModel->getClassByInstitutinAndSchoolYear($institutionId, $schoolYear);

        if (empty($classes)) {
            return response()->json(ResponseHelper::error("Turmas não encontradas para a instituição e ano letivo informados"), 404);
        }

        return response()->json(ResponseHelper::success("", $classes));
    }

    public function getAllDisciplines(): JsonResponse
    {
        $disciplines = $this->oldDBModel->getAllDisciplines();

        return response()->json(ResponseHelper::success("", $disciplines));
    }

    public function getDisciplinesBySeries(int $seriesId): JsonResponse
    {
        if (!$this->validateIntegerId($seriesId)) {
            return response()->json(ResponseHelper::error("Série inválida"), 400);
        }

        $disciplines = $this->oldDBModel->getDisciplinesBySeries($seriesId);

        if (empty($disciplines)) {
            return response()->json(ResponseHelper::error("Disciplinas não encontradas para a série informada"), 404);
        }

        return response()->json(ResponseHelper::success("", $disciplines));
    }

    public function getStudentsByClassAndSchoolYear(int $classId, int $schoolYear): JsonResponse
    {
        if (!$this->validateIntegerId($classId) || !$this->validateIntegerId($schoolYear)) {
            return response()->json(ResponseHelper::error("Turma ou ano letivo inválido."), 400);
        }

        $students = $this->oldDBModel->getStudentsByClassAndSchoolYear($classId, $schoolYear);

        if (empty($students)) {
            return response()->json(ResponseHelper::error("Nenhum aluno encontrado para a turma e ano letivo informados"), 404);
        }

        return response()->json(ResponseHelper::success("", $students));
    }

    public function getClassBySchoolYearAndSeries(int $schoolYear, int $seriesId, int $institutionId): JsonResponse
    {
        if (!$this->validateIntegerId($seriesId) || !$this->validateIntegerId($schoolYear)) {
            return response()->json(ResponseHelper::error("Série ou ano letivo inválido"), 400);
        }

        $classes = $this->oldDBModel->getClassBySchoolYearAndSeries($schoolYear, $seriesId, $institutionId);

        if (empty($classes)) {
            return response()->json(ResponseHelper::error("Turmas não encontradas para a série e ano letivo informados"), 404);
        }

        return response()->json(ResponseHelper::success("", $classes));
    }
}
