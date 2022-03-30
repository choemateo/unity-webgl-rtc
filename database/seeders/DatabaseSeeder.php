<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Artisan::call('cache:clear');

        $this->call(UserSeeder::class);
        // \App\Models\User::factory(10)->create();
		/* $this->call([
            dashlang::class,
            frontlang::class,
            admin::class,
        ]);
		*/
    }
}
