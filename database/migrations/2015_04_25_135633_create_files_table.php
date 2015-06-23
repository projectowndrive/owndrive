<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('files', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('owner_id')->unsigned()->index();
			$table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
			$table->string('name');
			$table->string('type')->default('file');
			$table->text('path');
			$table->string('mime')->nullable();
			$table->bigInteger('size')->unsigned();
			$table->tinyInteger('starred')->default(0);
			$table->tinyInteger('trashed')->default(0);
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('files');
	}

}
