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
        Schema::create('series_indicators', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('series_id')->unsigned();
            $table->foreignUuid('indicator_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by_user')->constrained('users')->onDelete('cascade');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('series_indicators');
    }
};
