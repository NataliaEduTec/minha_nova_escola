<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Resources\DiagnosticResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Diagnostic;

class DiagnosticController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $institution_id = $request->query("institution_id");
        $series_id = $request->query("series_id");
        $class_id = $request->query("class_id");
        $discipline_id = $request->query("discipline_id");
        $school_year = $request->query("school_year");
        $name = $request->query("name");

        if (!is_numeric($institution_id) && $institution_id) {
            return response()->json(ResponseHelper::error("O identificador da instituição é inválido."), 422);
        }
        if (!is_numeric($series_id) && $series_id) {
            return response()->json(ResponseHelper::error("O identificador da série é inválido."), 422);
        }
        if (!is_numeric($class_id) && $class_id) {
            return response()->json(ResponseHelper::error("O identificador da turma é inválido."), 422);
        }
        if (!is_numeric($discipline_id) && $discipline_id) {
            return response()->json(ResponseHelper::error("O identificador da disciplina é inválido."), 422);
        }
        if (!is_numeric($school_year) && $school_year) {
            return response()->json(ResponseHelper::error("O ano escolar é inválido."), 422);
        }

        $diagnostics = DiagnosticResource::collection(
            Diagnostic::with(['diagnosticStudents', 'questionnaire', 'user'])
                ->when($institution_id, function ($query) use ($institution_id) {
                    return $query->where('institution_id', $institution_id);
                })
                ->when($series_id, function ($query) use ($series_id) {
                    return $query->where('series_id', $series_id);
                })
                ->when($class_id, function ($query) use ($class_id) {
                    return $query->where('class_id', $class_id);
                })
                ->when($discipline_id, function ($query) use ($discipline_id) {
                    return $query->where('discipline_id', $discipline_id);
                })
                ->when($school_year, function ($query) use ($school_year) {
                    return $query->where('schoolYear', $school_year);
                })
                ->when($name, function ($query) use ($name) {
                    return $query->where('name', 'like', "%{$name}%");
                })
                ->where('active', true)
                ->limit(30)
                ->get()
        );

        return response()->json(ResponseHelper::success("", $diagnostics));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'quantity_questions' => 'required|integer|min:1',
            'diagnostic_student' => 'required|array',
            'diagnostic_student.*.questions' => 'nullable|array',
            'diagnostic_student.*.questions.*.id' => 'string',
            'diagnostic_student.*.questions.*.status' => 'string',
            'diagnostic_student.*.student_id' => 'required|string',
            'diagnostic_student.*.tabulated' => 'required|boolean',
            'diagnostic_student.*.a_e_e' => 'nullable|string',
            'questionnaire.name' => 'required|string',
            'questionnaire.content' => 'required|string',
            'class_id' => 'required|string',
            'discipline_id' => 'required|string',
            'institution_id' => 'required|string',
            'schoolYear' => 'required|string',
            'series_id' => 'required|string',
        ], [
            'name' => 'O nome deve ser preenchido e deve conter menos que 255 caracteres.',
            'quantity_questions' => 'A quantidade de questões deve ser um número inteiro maior que 0.',
            'diagnostic_student' => 'Precisa haver estudantes para tabular.',
            'diagnostic_student.*.questions' => 'A questão é inválida.',
            'diagnostic_student.*.questions.id' => 'O ID da questão é inválido.',
            'diagnostic_student.*.questions.status' => 'O status da questão é inválido.',
            'diagnostic_student.*.student_id' => 'O identificador do aluno é obrigatório.',
            'diagnostic_student.*.tabulated' => 'O campo "tabulado" é obrigatório.',
            'diagnostic_student.*.a_e_e' => 'O campo "A.E.E." é inválida.',
            'questionnaire.name' => 'O nome do questionário é obrigatório.',
            'questionnaire.content' => 'O conteúdo do questionário é obrigatório.',
            'class_id' => 'O ID da turma é obrigatório.',
            'discipline_id' => 'O ID da disciplina é obrigatório.',
            'institution_id' => 'O ID da instituição é obrigatório.',
            'schoolYear' => 'O ano escolar é obrigatório.',
            'series_id' => 'O ID da série é obrigatório.',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $message = $errors->first();
            return response()->json(ResponseHelper::error($message), 422);
        }

        DB::beginTransaction();

        try {
            $validatedData = $validator->validated();
            $diagnostic = Diagnostic::create([
                'institution_id' => $validatedData['institution_id'],
                'series_id' => $validatedData['series_id'],
                'class_id' => $validatedData['class_id'],
                'discipline_id' => $validatedData['discipline_id'],
                'name' => $validatedData['name'],
                'schoolYear' => $validatedData['schoolYear'],
                'quantity_questions' => $validatedData['quantity_questions'],
                'created_by' => auth()->id(),
            ]);

            $diagnostic->questionnaire()->create([
                'name' => $validatedData['questionnaire']['name'],
                'content' => $validatedData['questionnaire']['content'],
                'diagnostic_id' => $diagnostic->id,
                'created_by' => auth()->id(),
            ]);

            foreach ($validatedData['diagnostic_student'] as $studentData) {
                $questions = [];

                if (isset($studentData['questions']) && is_array($studentData['questions'])) {
                    foreach ($studentData['questions'] as $question) {
                        $columnName = "question_{$question['id']}_answer";
                        $status = $question['status'] === "SIM" ? 1 : ($question['status'] === "NÃO" ? 2 : 0);

                        $questions[$columnName] = $status;
                    }
                }

                // DB::rollBack();
                // dd($studentData, $questions);

                $a_e_e = isset($studentData['a_e_e']) && $studentData['a_e_e'] === "SIM" ? 1 : 0;

                $diagnostic->diagnosticStudents()->create([
                    'student_id' => $studentData['student_id'],
                    'tabulated' => $studentData['tabulated'],
                    'a_e_e' => $a_e_e,
                    ...$questions,
                    'created_by' => auth()->id(),
                ]);
            }

            DB::commit();
            return response()->json(
                ResponseHelper::success('Diagnóstico criado com sucesso.', [
                    'id' => $diagnostic->id
                ]),
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(ResponseHelper::error('Ocorreu um erro ao tentar criar o diagnóstico.', [$e->getMessage()]), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $diagnostic = DiagnosticResource::make(
            Diagnostic::with(['diagnosticStudents', 'questionnaire'])
                ->find($id)
        );

        if (!$diagnostic) {
            return response()->json(ResponseHelper::error('Diagnóstico não encontrado.'), 404);
        }

        return response()->json(ResponseHelper::success('', $diagnostic));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'diagnostic_student' => 'required|array',
            'diagnostic_student.*.questions' => 'nullable|array',
            'diagnostic_student.*.questions.*.id' => 'string',
            'diagnostic_student.*.questions.*.status' => 'string',
            'diagnostic_student.*.student_id' => 'required|string',
            'diagnostic_student.*.tabulated' => 'required|boolean',
            'diagnostic_student.*.a_e_e' => 'nullable|string',
            'questionnaire.name' => 'required|string',
            'questionnaire.content' => 'required|string',
            'class_id' => 'required|string',
            'discipline_id' => 'required|string',
            'institution_id' => 'required|string',
            'schoolYear' => 'required|string',
            'series_id' => 'required|string',
        ], [
            'name' => 'O nome deve ser preenchido e deve conter menos que 255 caracteres.',
            'diagnostic_student.*.questions' => 'A questão é inválida.',
            'diagnostic_student.*.questions.id' => 'O ID da questão é inválido.',
            'diagnostic_student.*.questions.status' => 'O status da questão é inválido.',
            'diagnostic_student.*.student_id' => 'O identificador do aluno é obrigatório.',
            'diagnostic_student.*.tabulated' => 'O campo "tabulado" é obrigatório.',
            'diagnostic_student.*.a_e_e' => 'O campo "A.E.E." é inválida.',
            'questionnaire.name' => 'O nome do questionário é obrigatório.',
            'questionnaire.content' => 'O conteúdo do questionário é obrigatório.',
            'class_id' => 'O ID da turma é obrigatório.',
            'discipline_id' => 'O ID da disciplina é obrigatório.',
            'institution_id' => 'O ID da instituição é obrigatório.',
            'schoolYear' => 'O ano escolar é obrigatório.',
            'series_id' => 'O ID da série é obrigatório.',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $message = $errors->first();
            return response()->json(ResponseHelper::error($message), 422);
        }

        DB::beginTransaction();

        try {
            $validatedData = $validator->validated();

            $diagnostic = Diagnostic::find($id);

            if (!$diagnostic) {
                return response()->json(ResponseHelper::error('Diagnóstico não encontrado.'), 404);
            }

            $diagnostic->update([
                'institution_id' => $validatedData['institution_id'],
                'series_id' => $validatedData['series_id'],
                'class_id' => $validatedData['class_id'],
                'discipline_id' => $validatedData['discipline_id'],
                'name' => $validatedData['name'],
                'schoolYear' => $validatedData['schoolYear'],
            ]);

            $diagnostic->diagnosticUpdated()->create([
                'user_id' => auth()->id(),
                'updated_at' => now(),
            ]);

            $questionnaire = $diagnostic->questionnaire()->first();
            if ($questionnaire) {
                $questionnaire->update([
                    'name' => $validatedData['questionnaire']['name'],
                    'content' => $validatedData['questionnaire']['content'],
                ]);
            } else {
                $diagnostic->questionnaire()->create([
                    'name' => $validatedData['questionnaire']['name'],
                    'content' => $validatedData['questionnaire']['content'],
                    'diagnostic_id' => $diagnostic->id,
                    'created_by' => auth()->id(),
                ]);
            }

            // Atualizar os diagnosticStudents
            foreach ($validatedData['diagnostic_student'] as $studentData) {
                $diagnosticStudent = $diagnostic->diagnosticStudents()
                    ->where('student_id', $studentData['student_id'])
                    ->first();

                $questions = [];
                if (isset($studentData['questions']) && is_array($studentData['questions'])) {
                    foreach ($studentData['questions'] as $question) {
                        $columnName = "question_{$question['id']}_answer";
                        $status = $question['status'] === "SIM" ? 1 : ($question['status'] === "NÃO" ? 2 : 0);

                        $questions[$columnName] = $status;
                    }
                }

                $a_e_e = isset($studentData['a_e_e']) && $studentData['a_e_e'] === "SIM" ? 1 : 0;
                if ($diagnosticStudent) {
                    $diagnosticStudent->update([
                        'tabulated' => $studentData['tabulated'],
                        'a_e_e' => $a_e_e,
                        ...$questions,
                    ]);
                } else {
                    $diagnostic->diagnosticStudents()->create([
                        'student_id' => $studentData['student_id'],
                        'tabulated' => $studentData['tabulated'],
                        'a_e_e' => $a_e_e,
                        ...$questions,
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            DB::commit();
            return response()->json(ResponseHelper::success('Diagnóstico atualizado com sucesso.'), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(ResponseHelper::error('Ocorreu um erro ao tentar atualizar o diagnóstico.'), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            $diagnostic = Diagnostic::find($id);
            if (!$diagnostic) {
                return response()->json(ResponseHelper::error('Diagnóstico não encontrado.'), 404);
            }

            $diagnostic->update(['active' => false]);

            return response()->json(ResponseHelper::success('Diagnóstico removido com sucesso.'), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(ResponseHelper::error('Ocorreu um erro ao tentar remover o diagnóstico.'), 500);
        } finally {
            DB::commit();
        }
    }
}
