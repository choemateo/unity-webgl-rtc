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

## Character select.
![webRTCVideoChat2](https://user-images.githubusercontent.com/102642642/160848273-22f26d4c-9392-4e8a-8bcf-60ac2fe59740.png)

## after login Character
![webRTCVideoChat1](https://user-images.githubusercontent.com/102642642/160848715-5d69f4e3-937f-42f2-bba8-7b7abae2ed9d.png)

## for Chatting
![webRTCVideoChat3](https://user-images.githubusercontent.com/102642642/160848939-5d9b84ea-4174-42d7-bf0b-29c2418db24c.png)

## live players
![webRTCVideoChat](https://user-images.githubusercontent.com/102642642/160849166-b2caaeff-850c-454a-bd9f-a96e5ecfb932.png)