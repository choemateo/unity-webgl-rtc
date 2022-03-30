<?php
    $params = explode(",", $argv[1]);
    //echo $params[0] ." - " . $params[1];
    $pspacename = $params[0];
    $temp = explode("_",$params[1]);
    $pusername = $temp[0];
    $pspaceid  = $temp[1];

    function RemoveUserInRoom($spacename, $username, $spaceid){
        try{
            $host = "localhost";
            $dbuser = "root";
            $dbpwd = "";
            $dbname = "office3d_chat";
           // Create connection
            $conn = new mysqli($host, $dbuser, $dbpwd, $dbname);
            $conn->set_charset("utf8mb4");
           // Check connection
            if ($conn)
            {
                $usql = "UPDATE office_spaces SET state='off' WHERE id = ".$spaceid;
                $conn->query($usql);

                $ssql = "SELECT id FROM office_spaces WHERE spacename = '".$spacename."' AND state='on'";
                $sresult = $conn->query($ssql);
                $row_cnt = $sresult->num_rows;

                if($row_cnt < 1){
                    $dsql = "DELETE  FROM office_spaces  WHERE spacename = '".$spacename."'";
                    $conn->query($dsql);
                }

                echo "ok,".$username;
            }
            else
                echo("Connection failed : " . mysqli_connect_error());

            $conn->close();
        }
        catch (\Exception $e){
            echo "err : ".$e->getMessage();
        }

    }

RemoveUserInRoom($pspacename, $pusername, $pspaceid);

  exit();

 ?>
