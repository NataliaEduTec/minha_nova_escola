<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('diagnostic_student', function (Blueprint $table) {
            // 10 é pouco e 30 é demais, então toma mais 10 colunas, totalizando 20, que poderia facilmente ser um JSON rsrsrs
            // tutorial de como fazer um sistema não escalável:
            for ($i = 11; $i <= 20; $i++) {
                $table->tinyInteger("question_{$i}_answer")->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diagnostic_student', function (Blueprint $table) {
            for ($i = 11; $i <= 20; $i++) {
                $table->dropColumn("question_{$i}_answer");
            }
        });
    }
};
