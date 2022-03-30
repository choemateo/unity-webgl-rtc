# A Collection of Laravel Projects
This project is online Chatting using webgl of unity and laravel.<br/>
This repository contains a collection of applications built with Laravel.<br/>
and It was used unity3D 2020.3.18f or hight<br/>

## Project Setup

1. Clone the repository.<br/>
`git clone https://github.com/choemateo/ug`

2. Install dependencies<br/>
`composer install && npm install`

3. Create your env file from the example.<br/>
`cp env.example env`

4. run command `php artisan migrate` and `php artisan make:seeder UserSeeder` in command window.
  
## let Change
1. let change `'path' of socketURL` in config.json.
2. let change `'path' of sslKey` and `'path' of sslCert`  in config.json.   
3. let change `part of DB Setting` in .env. <br/>
   Note:   This project must have two ssl key of website. <br/>
	   one of these is web server and other one is node server.
 
## Running the Application
1. `node server` to start the node server in project root.
2. `php artisan serve` to start the web server in project root.


