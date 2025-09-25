<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Indicator;
use Illuminate\Http\Request;
use App\Http\Resources\IndicatorsResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class IndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $name = $request->query('name');
        $ids = $request->query('ids');
        $ids = !empty($ids) ? explode(',', $ids) : false;

        $disciplines = $request->query('disciplines');
        $indicatorType = $request->query('indicatorType');
        $series = $request->query('series');

        $disciplines = !empty($disciplines) ? explode(',', $disciplines) : false;
        $indicatorType = !empty($indicatorType) ? explode(',', $indicatorType) : false;
        $series = !empty($series) ? explode(',', $series) : false;

        $indicators = IndicatorsResource::collection(
            Indicator::where('active', true)
                ->when($name, fn($query) => $query->where('code', 'like', "%{$name}%"))
                ->when($ids, fn($query) => $query->whereIn('id', $ids))
                ->when($indicatorType, fn($query) => $query->whereIn('type', $indicatorType))
                ->when($disciplines, fn($query) => $query->whereHas('disciplineIndicators', function ($q) use ($disciplines) {
                    $q->whereIn('discipline_id', $disciplines);
                }))
                ->when($series, fn($query) => $query->whereHas('seriesIndicators', function ($q) use ($series) {
                    $q->whereIn('series_id', $series);
                }))
                ->get()
            );
        if ($indicators->isEmpty()) {
            return response()->json(ResponseHelper::error("Nenhum indicador encontrado."), 404);
        }

        return response()->json(ResponseHelper::success("", $indicators));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required',
            'description' => 'nullable|string',
            'series' => 'array',
            'series.*.id' => 'required',
            'disciplines' => 'array',
            'disciplines.*.id' => 'required',
            'type' => 'required|in:bncc,saeb',
        ], [
            'code.required' => 'O campo código é obrigatório.',
            'description.string' => 'A descrição deve ser um texto.',
            'series.*.id' => 'A série é obrigatória.',
            'disciplines.*.id' => 'A disciplina é obrigatória.',
            'type.required' => 'O tipo é obrigatório.',
            'type.in' => 'O tipo deve ser um dos seguintes valores: bncc, saeb.',
        ]);


        if ($validator->fails()) {
            $errors = $validator->errors();
            $message = $errors->first();

            throw new HttpResponseException(response()->json([
                'status' => 'error',
                'message' => $message,
            ], 422));
        }

        DB::beginTransaction();

        try {
            $validated = $validator->validated();

            $indicator = Indicator::create([
                ...$validated,
                'user_id' => auth()->id(),
            ]);

            if (!isset($validated['disciplines'])) {
                return response()->json(ResponseHelper::error("Nenhuma disciplina informada.", $validated), 422);
            }

            if (!isset($validated['series'])) {
                return response()->json(ResponseHelper::error("Nenhuma série informada.", $validated), 422);
            }

            foreach ($validated['disciplines'] as $discipline) {
                $indicator->disciplineIndicators()->create([
                    'discipline_id' => $discipline['id'],
                    'created_by_user' => auth()->id(),
                ]);
            }

            foreach ($validated['series'] as $series) {
                $indicator->seriesIndicators()->create([
                    'series_id' => $series['id'],
                    'created_by_user' => auth()->id(),
                ]);
            }

            return response()->json(ResponseHelper::success("Indicador cadastrado com sucesso.", $indicator['id']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(ResponseHelper::error("Erro ao cadastrar indicador."), 500);
        } finally {
            DB::commit();
        }
    }

    public function show($id)
    {
        $indicator = new IndicatorsResource(Indicator::with([
            'disciplineIndicators' => function ($query) {
                $query->where('active', true);
            },
            'seriesIndicators' => function ($query) {
                $query->where('active', true);
            },
        ])->where('active', true)->findOrFail($id));
        return response()->json(ResponseHelper::success("", $indicator));
    }

    public function showBySeriesAndDiscipline($seriesId, $disciplineId)
    {
        try {
            $indicator = IndicatorsResource::collection(
                Indicator::whereHas('seriesIndicators', function ($query) use ($seriesId) {
                    $query->where('series_id', $seriesId);
                })->whereHas('disciplineIndicators', function ($query) use ($disciplineId) {
                    $query->where('discipline_id', $disciplineId);
                })->get()
            );

            if ($indicator->isEmpty()) {
                return response()->json(ResponseHelper::error("Nenhum indicador encontrado para a série e disciplina informadas."), 404);
            }

            return response()->json(ResponseHelper::success("", $indicator));
        } catch (\Exception $e) {
            return response()->json(ResponseHelper::error("Ocorreu um erro ao buscar indicador."), 500);
        }
    }

    public function showBySeriesAndDisciplineAndType($seriesId, $disciplineId, $type)
    {
        try {
            $indicator = IndicatorsResource::collection(
                Indicator::where([
                    'active' => true,
                    'type' => $type,
                ])
                ->whereHas('seriesIndicators', function ($query) use ($seriesId) {
                    $query->where('series_id', $seriesId);
                })->whereHas('disciplineIndicators', function ($query) use ($disciplineId) {
                    $query->where('discipline_id', $disciplineId);
                })->get()
            );

            if ($indicator->isEmpty()) {
                return response()->json(ResponseHelper::error("Nenhum indicador encontrado para a série e disciplina informadas."), 404);
            }

            return response()->json(ResponseHelper::success("", $indicator));
        } catch (\Exception $e) {
            return response()->json(ResponseHelper::error("Ocorreu um erro ao buscar indicador."), 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required',
            'description' => 'nullable|string',
            'series' => 'array',
            'series.*.id' => 'required',
            'disciplines' => 'array',
            'disciplines.*.id' => 'required',
            'type' => 'required|in:bncc,saeb',
        ], [
            'code.required' => 'O campo código é obrigatório.',
            'description.string' => 'A descrição deve ser um texto.',
            'series.*.id' => 'A série é obrigatória.',
            'disciplines.*.id' => 'A disciplina é obrigatória.',
            'type.required' => 'O tipo é obrigatório.',
            'type.in' => 'O tipo deve ser um dos seguintes valores: bncc, saeb.',
        ]);

        if ($validator->fails()) {
            $message = $validator->errors()->first();
            throw new HttpResponseException(response()->json([
                'status' => 'error',
                'message' => $message,
            ], 422));
        }

        DB::beginTransaction();

        try {
            $validated = $validator->validated();

            $indicator = Indicator::findOrFail($id);
            $indicator->update([
                'code' => $validated['code'],
                'description' => $validated['description'] ?? null,
                'type' => $validated['type'],
            ]);

            if (!isset($validated['disciplines']) || !isset($validated['series'])) {
                return response()->json(ResponseHelper::error("Disciplinas ou séries não informadas.", $validated), 422);
            }

            $newDisciplineIds = collect($validated['disciplines'])->pluck('id')->toArray();

            $indicator->disciplineIndicators()
                ->whereNotIn('discipline_id', $newDisciplineIds)
                ->update(['active' => false]);

            foreach ($newDisciplineIds as $disciplineId) {
                $relation = $indicator->disciplineIndicators()
                    ->where('discipline_id', $disciplineId)
                    ->first();

                if ($relation) {
                    $relation->update(['active' => true]);
                } else {
                    $indicator->disciplineIndicators()->create([
                        'discipline_id' => $disciplineId,
                        'created_by_user' => auth()->id(),
                        'active' => true,
                    ]);
                }
            }

            $newSeriesIds = collect($validated['series'])->pluck('id')->toArray();

            $indicator->seriesIndicators()
                ->whereNotIn('series_id', $newSeriesIds)
                ->update(['active' => false]);

            foreach ($newSeriesIds as $seriesId) {
                $relation = $indicator->seriesIndicators()
                    ->where('series_id', $seriesId)
                    ->first();

                if ($relation) {
                    $relation->update(['active' => true]);
                } else {
                    $indicator->seriesIndicators()->create([
                        'series_id' => $seriesId,
                        'created_by_user' => auth()->id(),
                        'active' => true,
                    ]);
                }
            }

            DB::commit();
            return response()->json(ResponseHelper::success("Indicador atualizado com sucesso."));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(ResponseHelper::error("Erro ao atualizar indicador.", $e), 500);
        }
    }


    public function destroy($id)
    {
        $indicator = Indicator::findOrFail($id);

        $indicator->update([
            'active' => false,
        ]);

        return response()->json(ResponseHelper::success("Indicador deletado com sucesso."), 200);
    }
}
