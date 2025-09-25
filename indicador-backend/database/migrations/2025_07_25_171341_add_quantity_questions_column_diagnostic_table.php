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
        Schema::table('diagnostic', function (Blueprint $table) {
            $table->integer('quantity_questions')->default(10)->after('schoolYear')->comment('Quantidade de perguntas no diagnóstico');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diagnostic', function (Blueprint $table) {
            $table->dropColumn('quantity_questions');
        });
    }
};
