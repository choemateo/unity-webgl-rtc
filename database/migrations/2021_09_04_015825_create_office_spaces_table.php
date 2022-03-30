<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOfficeSpacesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('office_spaces', function (Blueprint $table) {
            $table->id();
            $table->string('spacename')->index();
            $table->string('username')->nullable()->unique();
            $table->string('buildname')->nullable();
            $table->string('floor')->nullable();
            $table->string('avatar')->nullable();
            $table->string('type')->nullable();
            $table->string('state')->default('off');
            $table->timestamp('create_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('office_spaces');
    }
}
