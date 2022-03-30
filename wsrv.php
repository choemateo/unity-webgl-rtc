#!/usr/bin/env php
<?php
header('content-type: application/octet-stream');
require_once(__DIR__ .'/commons/websockets.php');

class wserver extends WebSocketServer {

	function __construct($addr, $port, $bufferLength) {
		parent::__construct($addr, $port, $bufferLength);
		$this->userClass = 'MyUser';
	}

	//protected $maxBufferSize = 1048576; //1MB... overkill for an echo server, but potentially plausible for other applications.

	protected function process ($user, $message) {
		$MSG = json_decode($message);
		//{"action":"subscribe","room":"ckd__0gne1rbibm74","sender":"ckd","roomid":"20"}
		if($MSG !== null)
		{
			$message = '{"command":"publishOK"}';
			if($MSG->action=="subscribe")
			{
              $room = $MSG->room;
              $sender = $MSG->sender;
              $roomid = $MSG->roomid;
				/*if($streaminfo->streamData)
				{
					$extension = 'webm';
					$path = __DIR__ . '/tmp/';
					if (!file_exists($path))
					{
						@mkdir($path);
						@chmod($path, 0777);
					}

					$extension = 'webm';
					$filename = preg_replace('/\s+/', '_', $streaminfo->streamName . '_0.' . $extension);
					$targetfilePath = "$path" . "$filename";

					if (file_exists($targetfilePath))
						@unlink($targetfilePath);

					if(!move_uploaded_file($streaminfo->streamData, $targetfilePath))
						$message = '{"command":"publishErr"}';
				}*/
			}
		}

		$this->send($user,$message);
	}

	protected function connected ($user) {
		// Do nothing: This is just an echo server, there's no need to track the user.
		// However, if we did care about the users, we would probably have a cookie to
		// parse at this step, would be looking them up in permanent storage, etc.
	}

	protected function closed ($user) {
		// Do nothing: This is where cleanup would go, in case the user had any sort of
		// open files or other objects associated with them.  This runs after the socket
		// has been closed, so there is no need to clean up the socket itself here.
	}
}

$srv = new wserver("127.0.0.1","9009", 8192);

try {
	$srv->run();
}
catch (Exception $e) {
	$srv->stdout($e->getMessage());
}
