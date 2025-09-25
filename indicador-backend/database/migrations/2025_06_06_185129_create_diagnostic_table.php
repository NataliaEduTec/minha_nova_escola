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
        Schema::create('diagnostic', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('institution_id')->unsigned()->index();
            $table->integer('series_id')->unsigned()->index();
            $table->string('name', 255);
            $table->integer('schoolYear')->unsigned()->index();
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
        Schema::dropIfExists('diagnostic');
    }
};
