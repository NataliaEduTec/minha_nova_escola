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
        Schema::create('diagnostic_updated', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('diagnostic_id')
                ->constrained('diagnostic')
                ->onDelete('cascade');
            $table->foreignUuid('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnostic_updated');
    }
};
