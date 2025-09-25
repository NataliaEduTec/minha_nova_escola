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
        Schema::create('diagnostic_student', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('diagnostic_id')
                ->constrained('diagnostic')
                ->onDelete('cascade');
            $table->integer('student_id')->unsigned();

            // um dos meus feitos mais facinantes 👍
            for ($i = 1; $i <= 10; $i++) {
                $table->tinyInteger("question_{$i}_answer")->default(0);
            }

            $table->boolean('tabulated')->default(true);
            $table->boolean('a_e_e')->default(false);

            $table->foreignUuid('created_by')
                ->constrained('users')
                ->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnostic_student');
    }
};
