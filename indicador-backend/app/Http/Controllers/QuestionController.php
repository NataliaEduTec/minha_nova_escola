<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use \App\Http\Resources\QuestionsResource;
use \App\Models\Questions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $indicator = $request->query('indicator');
        $series = $request->query('series');
        $disciplines = $request->query('disciplines');


        $questions = Questions::with('alternatives')
            ->orderBy('created_at', 'desc')
            ->where('active', true)
            ->limit(50)
            ->get()
            ->map(function ($question) {
                return new QuestionsResource($question);
            });
        return response()->json(ResponseHelper::success("", $questions));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // dd($request->all());

        $validator = Validator::make($request->all(), [
            'questions' => 'required|array',
            'questions.*.content' => 'required|string',
            'questions.*.indicator_id' => 'required|exists:indicators,id',
            'questions.*.alternatives' => 'array',
            'questions.*.alternatives.*.content' => 'required|string',
            'questions.*.alternatives.*.isCorrect' => 'required|boolean',
            'questions.*.series_id' => 'required|string',
            'questions.*.discipline_id' => 'required|string',
        ], [
            'questions.required' => 'Preencha pelo menos uma questão.',
            'questions.*.content.required' => 'A descrição da pergunta é obrigatória.',
            'questions.*.indicator_id.required' => 'Indicador inválido.',
            'questions.*.indicator_id.exists' => 'Indicador não encontrado.',
            'questions.*.alternatives.array' => 'As alternativas não estão corretas.',
            'questions.*.alternatives.*.content.required' => 'A descrição da alternativa é obrigatória.',
            'questions.*.alternatives.*.isCorrect.required' => 'Preencha o campo "alternativa correta" corretamente.',
            'questions.*.series_id.required' => 'Série inválida.',
            'questions.*.series_id.string' => 'Série inválida.',
            'questions.*.discipline_id.required' => 'Disciplina inválida.',
            'questions.*.discipline_id.string' => 'Disciplina inválida.',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $message = $errors->first();
            return response()->json(ResponseHelper::error($message), 422);
        }

        DB::beginTransaction();

        try {
            $validated = $validator->validated();
            $createdQuestions = [];

            foreach ($validated['questions'] as $qData) {
                $question = Questions::create([
                    'description' => $qData['content'],
                    'indicator_id' => $qData['indicator_id'],
                    'created_by_user' => auth()->id(),
                    'series_id' => $qData['series_id'],
                    'discipline_id' => $qData['discipline_id'],
                ]);

                if (!empty($qData['alternatives'])) {
                    foreach ($qData['alternatives'] as $alt) {
                        $question->alternatives()->create([
                            ...$alt,
                            'description' => $alt['content'],
                            'is_correct' => $alt['isCorrect'],
                            'created_by_user' => auth()->id(),
                        ]);
                    }
                }

                $createdQuestions[] = $question->load('alternatives');
            }

            DB::commit();

            $createdQuestions = collect($createdQuestions)->map(function ($question) {
                return new QuestionsResource($question);
            });

            return response()->json(ResponseHelper::success("Questões criadas com sucesso!", $createdQuestions), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao salvar questões e alternativas.', [
                'exception' => $e
            ]);
            return response()->json(ResponseHelper::error("Erro ao salvar questões e alternativas.",[
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                ''
            ]), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $question = Questions::findOrFail($id)->with('alternatives');
        return response()->json($question);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $question = Questions::findOrFail($id);

        $validated = $request->validate([
            'description' => 'required',
            'indicator_id' => 'required|exists:indicators,id',
            'alternatives' => 'nullable|array',
            'alternatives.*.id' => 'nullable|uuid',
            'alternatives.*.description' => 'required_with:alternatives|string',
            'alternatives.*.is_correct' => 'required_with:alternatives|boolean',
        ]);

        DB::transaction(function () use ($question, $validated) {
            // Update the question
            $question->update([
                'description' => $validated['description'],
                'indicator_id' => $validated['indicator_id'],
            ]);

            if (isset($validated['alternatives'])) {
                $incomingIds = collect($validated['alternatives'])
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                // Delete alternatives not in incoming list
                $question->alternatives()
                    ->whereNotIn('id', $incomingIds)
                    ->delete();

                foreach ($validated['alternatives'] as $alt) {
                    if (isset($alt['id'])) {
                        // Update existing alternative
                        $alternative = $question->alternatives()->find($alt['id']);
                        if ($alternative) {
                            $alternative->update([
                                'description' => $alt['description'],
                                'is_correct' => $alt['is_correct'],
                            ]);
                        }
                    } else {
                        // Create new alternative
                        $question->alternatives()->create([
                            'description' => $alt['description'],
                            'is_correct' => $alt['is_correct'],
                        ]);
                    }
                }
            }
        });

        return response()->json($question->load('alternatives'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $question = Questions::findOrFail($id);
        $question->update(['active' => false]);

        return response()->json(
            ResponseHelper::success("Questão desativada com sucesso.")
        );
    }
}
