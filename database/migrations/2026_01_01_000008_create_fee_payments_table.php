<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('student_id');
            $table->unsignedInteger('semester_id');
            $table->tinyInteger('installment_number');
            $table->decimal('amount', 10, 2);
            $table->date('valid_from');
            $table->date('valid_to');
            $table->boolean('is_paid')->default(true);
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->date('verified_date');
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');

            $table->unique(['student_id', 'semester_id', 'installment_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_payments');
    }
};