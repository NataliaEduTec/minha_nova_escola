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
            for ($i = 21; $i <= 25; $i++) {
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
            for ($i = 21; $i <= 25; $i++) {
                $table->dropColumn("question_{$i}_answer");
            }
        });
    }
};
