<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiagnosticResource extends JsonResource
{
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'institution_id' => $this->institution_id,
            'name' => $this->name,
            'series_id' => $this->series_id,
            'class_id' => $this->class_id,
            'discipline_id' => $this->discipline_id,
            'schoolYear' => $this->schoolYear,
            'created_by_user' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'quantity_questions' => $this->quantity_questions,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ] : null,
            'diagnostic_student' => $this->diagnosticStudents->map(function ($student) {
                $questions = [
                    [
                        'id' => 1,
                        'status' => $student->question_1_answer === 1 ? "SIM" : ($student->question_1_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 2,
                        'status' => $student->question_2_answer === 1 ? "SIM" : ($student->question_2_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 3,
                        'status' => $student->question_3_answer === 1 ? "SIM" : ($student->question_3_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 4,
                        'status' => $student->question_4_answer === 1 ? "SIM" : ($student->question_4_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 5,
                        'status' => $student->question_5_answer === 1 ? "SIM" : ($student->question_5_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 6,
                        'status' => $student->question_6_answer === 1 ? "SIM" : ($student->question_6_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 7,
                        'status' => $student->question_7_answer === 1 ? "SIM" : ($student->question_7_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 8,
                        'status' => $student->question_8_answer === 1 ? "SIM" : ($student->question_8_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 9,
                        'status' => $student->question_9_answer === 1 ? "SIM" : ($student->question_9_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 10,
                        'status' => $student->question_10_answer === 1 ? "SIM" : ($student->question_10_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 11,
                        'status' => $student->question_11_answer === 1 ? "SIM" : ($student->question_11_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 12,
                        'status' => $student->question_12_answer === 1 ? "SIM" : ($student->question_12_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 13,
                        'status' => $student->question_13_answer === 1 ? "SIM" : ($student->question_13_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 14,
                        'status' => $student->question_14_answer === 1 ? "SIM" : ($student->question_14_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 15,
                        'status' => $student->question_15_answer === 1 ? "SIM" : ($student->question_15_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 16,
                        'status' => $student->question_16_answer === 1 ? "SIM" : ($student->question_16_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 17,
                        'status' => $student->question_17_answer === 1 ? "SIM" : ($student->question_17_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 18,
                        'status' => $student->question_18_answer === 1 ? "SIM" : ($student->question_18_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 19,
                        'status' => $student->question_19_answer === 1 ? "SIM" : ($student->question_19_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 20,
                        'status' => $student->question_20_answer === 1 ? "SIM" : ($student->question_20_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 21,
                        'status' => $student->question_21_answer === 1 ? "SIM" : ($student->question_22_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 22,
                        'status' => $student->question_22_answer === 1 ? "SIM" : ($student->question_22_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 23,
                        'status' => $student->question_23_answer === 1 ? "SIM" : ($student->question_23_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 24,
                        'status' => $student->question_24_answer === 1 ? "SIM" : ($student->question_24_answer === 2 ? "NÃO" : "S/N"),
                    ],
                    [
                        'id' => 25,
                        'status' => $student->question_25_answer === 1 ? "SIM" : ($student->question_25_answer === 2 ? "NÃO" : "S/N"),
                    ],
                ];

                return [
                    'id' => $student->id,
                    'student_id' => $student->student_id,
                    'diagnostic_id' => $student->diagnostic_id,
                    'created_by_user' => $student->created_by,
                    'created_at' => $student->created_at,
                    'updated_at' => $student->updated_at,
                    'questions' => $questions,
                    'tabulated' => $student->tabulated ? true : false,
                    'a_e_e' => $student->a_e_e ? "SIM" : "NÃO",
                ];
            }),
            'diagnostic_questionnaire' => $this->questionnaire ? $this->questionnaire[0] : null,
        ];
    }
}
