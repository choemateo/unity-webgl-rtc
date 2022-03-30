<?php

/**
 * Description of server
 *
 * @author Amir <amirsanni@gmail.com>
 * @date 23-Dec-2016
 */

require 'vendor/autoload.php';
/*
 use Amir\Comm;
 use Ratchet\App;

//set an array of origins allowed to connect to this server
$allowed_origins = ['localhost', '127.0.0.1'];

// Run the server application through the WebSocket protocol on port 8080
$app = new App('localhost', 8080, '127.0.0.1');  //App(hostname, port, 'whoCanConnectIP', '')

//create socket routes
//route(uri, classInstance, arrOfAllowedOrigins)
$app->route('/comm', new Comm, $allowed_origins);
//run websocket
$app->run();
*/

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Amir\Community;
$server = IoServer::factory(
    new Community(),
    9009
);
 /*$server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Community()
            )
        ),
        9009
    );*/
$server->run();

/*
use Ratchet\App;
use Amir\Community;
$app = new App('localhost', 9009, '127.0.0.1');
$app->route('/Community', new Community, array('*'));
//$app->route('/echo', new Ratchet\Server\EchoServer, array('*'));
$app->run();
*/
