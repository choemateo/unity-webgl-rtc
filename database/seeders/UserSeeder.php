<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
       /* if (Schema::hasColumn('users', 'manage')==false) //check the column
        {
            DB::statement( 'ALTER TABLE \'users\' ADD COLUMN \'manage\' INT(2) NOT NULL DEFAULT 0 AFTER \'avatar_path\' ');
            DB::table('users')->insert([
                'name'        => 'admin',
                'email'             => 'admin@gmail.com',
                'password'          => 'admin123',
                'manage'             => 1
            ]);
        }*/

        DB::table('users')->insert([
            'name'        => 'admin',
            'email'             => 'admin@gmail.com',
            'password'          => Hash::make('admin123'),
            'manage'             => 1
        ]);
    }
}
