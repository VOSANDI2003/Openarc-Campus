<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('semester_name', 100);
            $table->string('academic_year', 20);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            
        });
        
    }

    public function down(): void 
    
    { 
        Schema::dropIfExists('semesters'); 
    
    } 
    
};