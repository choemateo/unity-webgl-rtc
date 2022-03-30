# A Collection of Laravel Projects

This repository contains a collection of applications built with Laravel.<br/>
and It was used unity3D 2020.3.18f or hight<br/>

## Project Setup

1. Clone the repository.<br/>
`git clone https://github.com/choemateo/ug`

2. Install dependencies<br/>
`composer install && npm install`

3. Create your env file from the example.<br/>
`cp env.example env`

4. Add your db details, pusher API keys and  TURN SERVER credentials.

5. run command 'php artisan migrate' and 'php artisan make:seeder UserSeeder' in command window.
   

## Running the Application
1. 'node server' to start the node server in project root dir.
2. `php artisan serve` to start the web server in project root.
3. Note that the register endpoint has been removed to prevent people from creating <br/> 
   a lot of users when they want to try out the online demo. In your local copy you can enable it in the `routes/web.php` file.


## Available Applications
The following are the available applications and the links to the article I've written about it if available:

1. **Custom WebRTC Applications**
   * **Live stream with WebRTC in your Laravel application**<br/>
     A Live streaming application built with WebRTC using the simple-peer.js package<br/>
     [Medium Link](https://mupati.medium.com/live-stream-with-webrtc-in-your-laravel-application-b6ecc13d8509)<br/>
     [Dev.to Link](https://dev.to/mupati/live-stream-with-webrtc-in-your-laravel-application-2kl3)

   * **Adding Video Chat To Your Laravel App**<br/>
     This is one-on-one video call application with WebRTC using the simple-peer.js package<br/>
     [Medium Link](https://mupati.medium.com/adding-video-chat-to-your-laravel-app-9e333c8a01f3)<br/>
     [Dev.to Link](https://dev.to/mupati/adding-video-chat-to-your-laravel-app-5ak7)

2. **Agora Platform Applications**
   * **Build a Scalable Video Chat App with Agora in Laravel**<br/>
     This is one-on-one video call application with [Agora Platform](https://agora.io)<br/>
     [Medium Link](https://mupati.medium.com/build-a-scalable-video-chat-app-with-agora-in-laravel-29e73c97f9b0)<br/>
     [Dev.to Link](https://dev.to/mupati/using-agora-for-your-laravel-video-chat-app-1mo)

3. **[Wossop](https://wossop.netlify.app/)**<br/>
   This is a messaging and video chat application with the WhatsApp web interface.<br/>
   The APIs are in this repository but the frontend sits elsewhere. I don't plan to blog about it.

## Test Accounts for the Application
1. after run web application using APM.
2. Login with these test accounts and test it <br/>
    email:             name:      password <br/>
    admin@gmail.com:   admin      admin123<br/>


# UI for one-on-one Video Call with WebRTC 
### Incoming Call UI
![Incoming Call](https://dev-to-uploads.s3.amazonaws.com/i/1qk47qwka8iz0m43tmdu.png)

### Video Chat Session
![Video Chat](https://dev-to-uploads.s3.amazonaws.com/i/80q8j4yxg6dp8xgb36ql.png)
