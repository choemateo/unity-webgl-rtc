'use strict';

var interval;
let rtcCls;
var g_UnityPlayIns;
window.enableAdapter = true;
window.ignoreBeforeUnload = false;
var sturl = "https://ug.local.com:9008/";
//window.playInfo
//========== onbeforeunload event ================
var LogoutFromSpace = function(){
    $.ajax({
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        url: "/delPlayUserInfo",
        type: 'POST',
        data: {'info': JSON.stringify(window.playInfo)},
        async:true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            if(data.msg!=="ok") {
                console.log("del msg =>" + data.msg);
            }

        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            console.log("del error = >" + jqXHR.responseText);
        }
    });
    if(rtcCls!==undefined){
        rtcCls.connection.peers.getAllParticipants().forEach(function(participant) {
            rtcCls.connection.peer.onNegotiationNeeded({
                userLeft: true
            }, participant);

            if (rtcCls.connection.peers[participant] && rtcCls.connection.peers[participant].peer) {
                rtcCls.connection.peers[participant].peer.close();
            }

            delete rtcCls.connection.peers[participant];
        });
    }
}

//============ called by unity ================================
function  CallWebFunction(jsonstr)
{
    let msg = JSON.parse(jsonstr);
    let type = msg.type;
    let abody = msg.body;
    if(type === "u_info" && rtcCls)
    {
        if(rtcCls.userinfo.debug==='y')
           console.log("save DB => ", abody);

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: "/setPlayUserInfo",
            type: 'POST',
            data: {'info':abody},
            async:true,
            dataType: 'json',
            success: function(data, textStatus, jqXHR)
            {
                if(data.msg !== "ok")
                    window.alert("u_info set msg =>" + data.ex);
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                window.alert("u_info set ajax error => " + jqXHR.responseText);
            }
        });

        setTimeout(function () {
            $('.main_lnb').css({display:'flex'});
        },5000);
        //$('#unity-container').css({left:'20%'});

    }
    else if(type === "u_leave" && rtcCls)
    {
        // let body = JSON.parse(msg.body);
        //console.log("delete DB => ", abody);
        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: "/delPlayUserInfo",
            type: 'POST',
            data: {'info':abody},
            async:true,
            dataType: 'json',
            success: function(data, textStatus, jqXHR)
            {
                if(data.msg !== "ok")
                    window.alert("u_leave del msg =>" + data.msg);

            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                window.alert("u_leave ajax error = > "+ jqXHR.responseText);
            }
        });
    }
    else if(type === "TransXY" && rtcCls)
    {
        let body = JSON.parse(msg.body);
        let checkmark_id = rtcCls.connection.userid + rtcCls.connection.token();
        /* if(g_socket) {
             g_socket.emit('TransXY', msg.body);
             console.log("send TransXY to server");
         }*/

        if(body.uid !== rtcCls.userinfo.uid)
          {
            if(rtcCls.userinfo.debug === 'y')
               console.log(msg.body);
          }

        rtcCls.send({
            transMessage:  msg.body,
            sender: rtcCls.connection.userid
        });
    }
    else if(type === "NearEnemys"  && rtcCls)
    {
        if(rtcCls.userinfo.debug === 'y')
           console.log("NearEnemys =>" + abody);

        var tmp = abody.split("}");
        for(let i = 0 ; i < tmp.length; i++)
        {
            let item = tmp[i];
            let ruserid="";
            let rsw="n";
            item = item.replace("{","");
            let aitems = item.split(",");
            for(let j=0;j < aitems.length;j++){
                let aaitem = aitems[j];
                let aaaitem = aaitem.replace(/"/g, "");
                let aaaaitem = aaaitem.split(":");
                let k = $.trim(aaaaitem[0]);
                let v = $.trim(aaaaitem[1]);

                if(rtcCls.userinfo.debug==='y')
                 console.log("k=>" + k + "  v=>" + v);

                if(k==="userid"){
                    ruserid = v;
                }
                else if(k==="sw"){
                    rsw=v;
                }
                else if(k==="spacename"){}
            }

            let isenableuser = false;
            if (rtcCls.connection.peers[ruserid] && rtcCls.connection.peers[ruserid].extra.userFullName) {
                isenableuser = true;
            }

            if(isenableuser == false){
                let d_container = document.querySelector('div[data-uid="'+ruserid+'"]');
                if(d_container)
                    d_container.parentNode.removeChild(d_container);
            }

            //console.log("videos : " + JSON.stringify($("#other-videos").find("video")));
            $("#other-videos").find("video").each(function (index) {
                var vt = $(this);
                let datauid = $(this).attr("data-uid");
                let v_container = document.querySelector('div[data-uid="'+datauid+'"]');
                if(ruserid !== "" && datauid === ruserid)
                {
                    if(rsw === "y")
                      {
                          if(v_container && vt[0]){
                              if(v_container.style.display !== "block")// if(vt[0].style.display !=="block")
                              {
                                  v_container.style.display ="block";//vt[0].style.display ="block";
                                  vt[0].muted = false;
                                  vt[0].volume = 1;
                                  if(vt[0].srcObject !== null && vt[0].srcObject.getAudioTracks().length > 0){
                                      vt[0].srcObject.getAudioTracks()[0].enabled = true;
                                  }
                              }
                          }

                      }
                    else
                      {
                          if(v_container && vt[0])
                          {
                              //v_container.parentNode.removeChild(v_container);
                              if(v_container.style.display !== "none")// if(vt[0].style.display !=="none")
                              {
                                  v_container.style.display ="none";//vt[0].style.display ="none";
                                  vt[0].muted = true;
                                  vt[0].volume = 0;
                                  if(vt[0].srcObject !== null && vt[0].srcObject.getAudioTracks().length > 0){
                                      vt[0].srcObject.getAudioTracks()[0].enabled = false;
                                  }
                              }
                          }
                      }
                }
            });

        }

    }
    else if(type === "gameEvent")
    {
        if(g_UnityPlayIns !== null && abody === "started")
        {
           /* if(interval)
                clearInterval(interval);*/

           let gif_div = document.getElementById('tempdelayimg');
            if(gif_div){
                let div_container = document.getElementById('unity-container');
                div_container.removeChild(gif_div);
            }

          $("#unity-canvas").css("visibility","visible");
          $("#cover-unity-canvas").remove();

            rtcCls = new RTCArea();
            rtcCls.StartRTC();
        }

    }
}

function  videoControllerBtn_org(){

    var tag ='<div id="icons" class="active">';
    tag += '<svg id="mute-audio" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-10 -10 68 68">';
    tag += '<title>title</title>';
    tag += '<circle cx="24" cy="24" r="34">';
    tag += '<title>Mute audio</title>';
    tag += '</circle>';
    tag += '<path class="on" transform="scale(0.6), translate(17,18)"';
    tag += '            d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z"';
    tag += '             fill="white"></path>';
    tag += ' <path class="off" transform="scale(0.6), translate(17,18)"';
    tag += '    d="M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z"';
    tag += '    fill="white"></path>';
    tag += '   </svg>';

    tag += '   <svg id="mute-video" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-10 -10 68 68">';
    tag += '       <circle cx="24" cy="24" r="34">';
    tag += '           <title>Mute video</title>';
    tag += '       </circle>';
    tag += '        <path class="on" transform="scale(0.6), translate(17,16)"';
    tag += '             d="M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z"';
    tag += '              fill="white"></path>';
    tag += '        <path class="off" transform="scale(0.6), translate(17,16)"';
    tag += '             d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z"';
    tag += '             fill="white"></path>';
    tag += '   </svg>';

  /*  tag += '    <svg id="fullscreen" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-10 -10 68 68">';
    tag += '       <circle cx="24" cy="24" r="34">';
    tag += '            <title>Enter fullscreen</title>';
    tag += ' </circle>';
    tag += ' <path class="on" transform="scale(0.8), translate(7,6)"';
    tag += '       d="M10 32h6v6h4V28H10v4zm6-16h-6v4h10V10h-4v6zm12 22h4v-6h6v-4H28v10zm4-22v-6h-4v10h10v-4h-6z" fill="white"></path>';
    tag += ' <path class="off" transform="scale(0.8), translate(7,6)"';
    tag += '       d="M14 28h-4v10h10v-4h-6v-6zm-4-8h4v-6h6v-4H10v10zm24 14h-6v4h10V28h-4v6zm-6-24v4h6v6h4V10H28z" fill="white"></path>';
    tag += ' </svg>';*/

 /*   tag += '<svg id="hangup" class="hidden" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-10 -10 68 68">';
    tag += '<circle cx="24" cy="24" r="34">';
    tag += '    <title>Hangup</title>';
    tag += '</circle>';
    tag += '<path transform="scale(0.7), translate(11,10)"';
    tag += '      d="M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59L.59 26.18c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42C6.68 17.55 14.93 14 24 14s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21C30.3 18.5 27.21 18 24 18z"';
    tag += '      fill="white"></path>';
    tag += ' </svg>';*/

    tag += '</div>';
    return tag;
}

function  videoControllerBtn(){
    var tag ='<div id="icons" class="active">';
    tag += '<svg id="mute-audio" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="-10 -10 68 68">';
    tag += '<title>title</title>';
    tag += '<circle cx="24" cy="24" r="34">';
    tag += '<title>Mute audio</title>';
    tag += '</circle>';
    tag += '<path class="on" transform="scale(0.8), translate(7,8)"';
    tag += '            d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z"';
    tag += '             fill="white"></path>';
    tag += ' <path class="off" transform="scale(0.8), translate(7,8)"';
    tag += '    d="M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z"';
    tag += '    fill="white"></path>';
    tag += '   </svg>';

    tag += '   <svg id="mute-video" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="-10 -10 68 68">';
    tag += '       <circle cx="24" cy="24" r="34">';
    tag += '           <title>Mute video</title>';
    tag += '       </circle>';
    tag += '        <path class="on" transform="scale(0.8), translate(7,6)"';
    tag += '             d="M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z"';
    tag += '              fill="white"></path>';
    tag += '        <path class="off" transform="scale(0.8), translate(7,6)"';
    tag += '             d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z"';
    tag += '             fill="white"></path>';
    tag += '   </svg>';
    tag += '</div>';

    return tag;
}

//==========  wait loading ===================================
function WaitLoading_Img(ww,wh){
    let div_container = document.getElementById('unity-container');
    let gif_div = document.getElementById('tempdelayimg');
    if(gif_div){
        div_container.removeChild(gif_div);
    }
    gif_div = document.createElement("div");
    gif_div.setAttribute("id", "tempdelayimg");
    gif_div.setAttribute("style", "width: 100%;height: 100%; background-color: #ffffff; position: fixed; z-index: 9999; display: block; left: 0%; top: 0;");
    let img = document.createElement("img");
    img.setAttribute("style", "position:absolute; width: 15%; background: none; display: inline-block;vertical-align:middle;border:0 ;left:50%;top:45%; transform: translate(-50%, -50%)");
    img.setAttribute("src", "/img/loading_small.gif");//loading5.png;
    gif_div.appendChild(img);

   let txt_div = document.createElement("div");
    txt_div.setAttribute("id", "sitelogtxt");
    gif_div.appendChild(txt_div);
    txt_div.innerHTML="METABANK LIFE";

    div_container.appendChild(gif_div);
}

function WaitLoading_text(ww,wh){
    var words=['L','Lo','Loa','Load','Loadi','Loadin','Loading','Loading.','Loading..','Loading...'];
    let temp_canvas = document.querySelector("#cover-unity-canvas");
    temp_canvas.width = ww;
    temp_canvas.height = wh;
    var w0x = temp_canvas.width/2 - 40;//start_x();
    var w0y = temp_canvas.height/2 - 40;//start_y();
    var itxt=0;
    if (temp_canvas.getContext)
    {
        var ctx0 = temp_canvas.getContext("2d");
        ctx0.fillStyle = 'black';
        interval = setInterval(function ()
        {
            ctx0.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
            ctx0.font = "bold 40px Georgia";
            ctx0.fillStyle = "#f48b06";
            ctx0.fillText("Metabank.life", w0x-100, w0y-100);
            //===========================================================
            ctx0.beginPath();
            ctx0.font = "bold 80px Georgia";
            var gradient = ctx0.createLinearGradient(0,0,temp_canvas.width,0);
            gradient.addColorStop("0","magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "white");
            ctx0.fillStyle = gradient;
            ctx0.fillText(words[itxt], w0x-70, w0y);
            if(itxt === words.length-1)
                itxt=0;
            else
                itxt++;
        }, 200);

    } else {
        alert("Your's brower is not canvas-unsupported");
    }
}

//===========START RTCCls ================
class RTCArea {
    constructor() {
        this.conversationPanel = document.getElementById('conversation-panel');
        this.jsonUserinfo = JSON.stringify(window.playInfo);
        this.userinfo = JSON.parse(this.jsonUserinfo);
        this.username = this.userinfo.username;
        this.spacename = this.userinfo.spacename;
        this.userid = this.username + '_' + this.userinfo.spaceid;
        this.localVideo = null;
        this.connection = null;
        this.isLocalStream = false;

        this.initConnection();

    }
    initConnection(){
        this.connection = new RTCMultiConnection();
        this.connection.publicRoomIdentifier = "dashboard";
        this.connection.socketURL = sturl;
        this.connection.socketMessageEvent = 'canvas-dashboard-demo';
        this.connection.autoCloseEntireSession = true;
        this.connection.maxParticipantsAllowed = 20;
        this.connection.chunkSize = 16000;
        this.connection.enableFileSharing = false;
		this.connection.enableLogs = false;
        this.connection.session = {
            audio: true,
            video: true,
            data: true
        };

        this.connection.iceServers = [{
                'urls': [
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                    'stun:stun.l.google.com:19302?transport=udp',
                    'stun:stun3.l.google.com:19302',
                    'stun:stun4.l.google.com:19302',

                ]
            }
        ];

        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };
        this.connection.onstream = function(event) {
            if (event.userid !== rtcCls.userid)
            {
               $("#other-videos").find("video").each(function (index)
                {
                    let datauid = $(this).attr("data-uid");
                    if(datauid === event.userid)
                    {
                        let old = document.querySelector('div[data-uid="'+datauid+'"]');
                        if(old)
                            old.parentNode.removeChild(old);
                        //$(this).parent(".videoclscontainer").remove();
                        //$(this).remove();
                        return false;
                    }
                });

                event.mediaElement.controls = false;
                event.mediaElement.setAttribute("data-uid", event.userid);
                //event.mediaElement.setAttribute("style","display:none");
                event.mediaElement.srcObject = event.stream;

                let otherVideos = document.querySelector('#other-videos');
                let uname = event.userid ? event.userid : rtcCls.username;
                if(uname.split("_").length > 1)
                    uname = uname.split("_")[0];

                var style="display:none;width:215px;height:156px;";
                var div = rtcCls.makeVideoElement(style, event.mediaElement, uname, false);
                otherVideos.appendChild(div);

                if(event.mediaElement.srcObject != null && event.mediaElement.srcObject.getAudioTracks().length > 0){
                    event.mediaElement.srcObject.getAudioTracks()[0].enabled = false;
                }

                if($('#other-videos').css('display')!=='flex')
                  $('#other-videos').css({display:"flex"});
            }
            else
            {
                var Rtc_unityContainer = document.getElementById("unity-container");
                if(rtcCls.localVideo)
                {
                    rtcCls.localVideo.srcObject = event.stream;
                    if($(rtcCls.localVideo).parent('.videoclscontainer').css('display')=='none')
                        $(rtcCls.localVideo).parent('.videoclscontainer').css('display', 'block');
                    /* if(rtcCls.localVideo.style.display==='none')
                        rtcCls.localVideo.style.display='block';*/

                    //rtcCls.localVideo.srcObject = null;
                    //$(rtcCls.localVideo).remove();
                }
                else
                {

                    rtcCls.localVideo = document.createElement('video');
                    rtcCls.localVideo.id = 'video';
                    rtcCls.localVideo.className = 'videocls';
                    rtcCls.localVideo.volume = 0;
                    //rtcCls.localVideo.muted = true;
                    //rtcCls.localVideo.controls = true;
                    try {
                        rtcCls.localVideo.setAttributeNode(document.createAttribute('autoplay'));
                        rtcCls.localVideo.setAttributeNode(document.createAttribute('playsinline'));
                    } catch (e) {
                        rtcCls.localVideo.setAttribute('autoplay', true);
                        rtcCls.localVideo.setAttribute('playsinline', true);
                    }
                    rtcCls.localVideo.setAttribute("data-streamid", event.streamid);
                    rtcCls.localVideo.setAttribute("data-uid", event.userid);
                    rtcCls.localVideo.style.display = 'block';

                    var style="position:absolute;right:30px;bottom:30px;width:210px;height:150px;border-radius:25px;display:block";
                    let uname = event.userid ? event.userid : rtcCls.username;
                    if(uname.split("_").length > 1)
                        uname = uname.split("_")[0];

                    var vdiv = rtcCls.makeVideoElement(style, rtcCls.localVideo, uname, true);
                    Rtc_unityContainer.appendChild(vdiv);
                    var ctltag = videoControllerBtn();
                    $(vdiv).append($(ctltag));
                    rtcCls.localVideo.srcObject = event.stream;
                    rtcCls.isLocalStream = true;

                 /*   $(Rtc_unityContainer).append(ctltag);*/

                    $('#mute-audio').click(function () {
                        var css = $('#mute-audio path.on').css('display');
                        //if css is none audio is enable;
                       if(css === 'none')
                       {
                           $('#mute-audio path.on').css('display','block');
                           $('#mute-audio path.off').css('display','none');
                           if(rtcCls.localVideo.srcObject != null && rtcCls.localVideo.srcObject.getAudioTracks().length > 0){
                               rtcCls.localVideo.srcObject.getAudioTracks()[0].enabled = false;
                           }
                       }
                       else{
                           $('#mute-audio path.on').css('display','none');
                           $('#mute-audio path.off').css('display','block');
                           if(rtcCls.localVideo.srcObject != null && rtcCls.localVideo.srcObject.getAudioTracks().length > 0){
                               rtcCls.localVideo.srcObject.getAudioTracks()[0].enabled = true;
                           }
                       }
                    });
                    $('#mute-video').click(function () {
                        var css = $('#mute-video path.on').css('display');
                        //if css is none video is enable;
                        if(css === 'none')
                        {
                            $('#mute-video path.on').css('display','block');
                            $('#mute-video path.off').css('display','none');
                            //let disable video
                            if(rtcCls.localVideo.srcObject != null && rtcCls.localVideo.srcObject.getVideoTracks().length > 0){
                                rtcCls.localVideo.srcObject.getVideoTracks()[0].enabled = false;
                            }
                        }
                        else{
                            $('#mute-video path.on').css('display','none');
                            $('#mute-video path.off').css('display','block');
                            //let enable video
                            if(rtcCls.localVideo.srcObject != null && rtcCls.localVideo.srcObject.getVideoTracks().length > 0){
                                rtcCls.localVideo.srcObject.getVideoTracks()[0].enabled = true;
                            }
                        }
                    });
                   /* setTimeout(function () {
                        rtcCls.localVideo.play();
                    },200);*/
                }

            }

            rtcCls.connection.onUserStatusChanged(event);
        };
        this.connection.onUserStatusChanged = function(event) {
            // let infoBar = document.getElementById('onUserStatusChanged');
              let names = [];
              rtcCls.connection.getAllParticipants().forEach(function(pid) {
                  names.push(rtcCls.getFullName(pid));
              });

              if (!names.length) {
                  names = ['Only You'];
              }
              else
              {
                  names = [rtcCls.connection.extra.userFullName || 'You'].concat(names);
              }
             // infoBar.innerHTML = '<b>Active users:</b> ' + names.join(', ');
            let tag = ""
               for(var i=0; i < names.length ;i++){
                   tag += '<li>'+ names[i] +'</li>';
               }
            $('.list_members_messenger .dep2.online').html(tag);
            $('.playcount.total').text(names.length);
        };

        this.connection.onopen = function(event)//open from other socket
        {
            if(rtcCls.userinfo.debug === 'y')
              console.log(event.extra.userFullName + " is onopen");
            rtcCls.connection.onUserStatusChanged(event);
        };

        this.connection.onclose = this.connection.onerror = this.connection.onleave = function(event) {//close from other socket
            if(event.extra.userFullName === undefined)
                return;

            rtcCls.connection.onUserStatusChanged(event);
            rtcCls.appendMessage(event);
            if(rtcCls.userinfo.debug === "y")
                console.log("onclose user =>"+ event.extra.userFullName);


            if(g_UnityPlayIns && rtcCls.userid !== event.userid){
                var evt ={
                    type:'u_leave',
                    body:event.extra.userFullName+','+event.userid
                };
                g_UnityPlayIns.SendMessage("GameDataObject","SimpleEventFromWeb", JSON.stringify(evt));
            }
            else{
                console.log("error  g_UnityPlayIns is null in onclose");
            }
        };

        this.connection.onstreamended = function(event) {
            if(rtcCls.userinfo.debug === "y")
                console.log("stream user =>"+ event.extra.userFullName);

            var video = document.querySelector('video[data-streamid="' + event.streamid + '"]');
            if (!video) {
                video = document.getElementById(event.streamid);
                if (video)
                {
                    let duid = video.getAttribute("data-uid");
                    if(event.userid !== rtcCls.userid)
                    {
                        let old = document.querySelector('div[data-uid="'+duid+'"]');
                        if(old)
                            old.parentNode.removeChild(old);
                        //$(video).parent('.videoclscontainer').remove();
                        //video.parentNode.removeChild(video);
                    }
                    else
                    {
                        let old = document.querySelector('div[data-uid="'+duid+'"]');
                        if(old)
                            old.parentNode.removeChild(old);
                        //$(video).parent('.videoclscontainer').remove();
                        /*video.srcObject = null;
                        video.style.display = 'none';*/
                    }
                    return;
                }
            }
            if (video) {
                let duid = video.getAttribute("data-uid");
                let old = document.querySelector('div[data-uid="'+duid+'"]');
                if(old)
                    old.parentNode.removeChild(old);
                //$(video).parent('.videoclscontainer').remove();
               /* video.srcObject = null;
                video.style.display = 'none';*/
            }
        };

        this.connection.onmessage = function(event) {
            //console.log("received message =>" + event.data);
            if(event.data.transMessage) {
                if(g_UnityPlayIns){
                    g_UnityPlayIns.SendMessage("GameDataObject","setPlayTransFromWeb", event.data.transMessage);
                }
                else{
                    console.log("error  g_UnityPlayIns is null in onmessage");
                }
            }

            if(event.data.typing === true) {
                $('#key-press').show().find('span').html(event.extra.userFullName + ' is typing');
                return;
            }

            if(event.data.typing === false) {
                $('#key-press').hide().find('span').html('');
                return;
            }

            if (event.data.chatMessage) {
                rtcCls.appendChatMessage(event);
                return;
            }

            if (event.data.checkmark === 'received') {
                var checkmarkElement = document.getElementById(event.data.checkmark_id);
                if (checkmarkElement) {
                    checkmarkElement.style.display = 'inline';
                }
                return;
            }

        };



    }
    send(str){
        rtcCls.connection.send(str);
    }
    makeVideoElement(style, videoobj, uname, local){
        if(local)
        {

            let duid = videoobj.getAttribute("data-uid");
            let videoclscontainer = document.querySelector('div[data-uid="'+duid+'"]');
            if(videoclscontainer)
                videoclscontainer.parentNode.removeChild(videoclscontainer);

            videoclscontainer = document.createElement('div');
            videoclscontainer.appendChild(videoobj);

            let userdiv = document.createElement('div');
            userdiv.setAttribute('class', 'videousername');
            userdiv.innerText = uname;
            videoclscontainer.appendChild(userdiv);

            videoclscontainer.setAttribute('class', 'videoclscontainer');
            videoclscontainer.setAttribute('style', style);
            videoclscontainer.setAttribute('data-uid', duid);
            return videoclscontainer;
        }
        else
        {
            let duid = videoobj.getAttribute("data-uid");
            let videoclscontainer = document.querySelector('div[data-uid="'+duid+'"]');
            if(videoclscontainer)
                videoclscontainer.parentNode.removeChild(videoclscontainer);

            videoclscontainer = document.createElement('div');
            videoclscontainer.appendChild(videoobj);

            let userdiv = document.createElement('div');
            userdiv.setAttribute('class', 'videousername');
            userdiv.innerText = uname;
            videoclscontainer.appendChild(userdiv);

            videoclscontainer.setAttribute('class', 'videoclscontainer');
            videoclscontainer.setAttribute('style', style);
            videoclscontainer.setAttribute('data-uid', duid);
            return videoclscontainer;
        }

    }
    appendMessage(event) {
        var div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = '<b>' + (event.extra.userFullName || event.userid) + ' : </b><br>' + ' <b>Sign Out</b>';
        rtcCls.conversationPanel.appendChild(div);
        rtcCls.conversationPanel.scrollTop = rtcCls.conversationPanel.clientHeight;
        rtcCls.conversationPanel.scrollTop = rtcCls.conversationPanel.scrollHeight - rtcCls.conversationPanel.scrollTop;
        div.style.background = '#f5f5dc';
    }
    appendChatMessage(event, checkmark_id) {
        var div = document.createElement('div');
        if (event.data)
        {
            div.className = 'talk';
            //div.innerHTML = '<b>' + (event.extra.userFullName || event.userid) + ':</b><br>' + event.data.chatMessage;
            div.innerHTML = '<span class="name">'+ event.extra.userFullName +'</span> <p class="txt"> '+ event.data.chatMessage + '</p>';
            if (event.data.checkmark_id) {
                rtcCls.send({
                    checkmark: 'received',
                    checkmark_id: event.data.checkmark_id
                });
            }
            //div.style.background = '#e9e7ac';
        }
        else
        {
            div.className = 'talk me';
            div.innerHTML = '<span class="name">'+ rtcCls.username +'</span> <p class="txt"> '+ event + '</p>';
            //div.style.background = '#cbffcb';
        }

        rtcCls.conversationPanel.appendChild(div);
       // rtcCls.conversationPanel.scrollTop = rtcCls.conversationPanel.clientHeight;
       // rtcCls.conversationPanel.scrollTop = rtcCls.conversationPanel.scrollHeight - rtcCls.conversationPanel.scrollTop;
    }
    getFullName(userid) {
        var _userFullName = userid;
        if (rtcCls.connection.peers[userid] && rtcCls.connection.peers[userid].extra.userFullName) {
            _userFullName = rtcCls.connection.peers[userid].extra.userFullName;
        }
        return _userFullName;
    }
    StartRTC()
    {
        rtcCls.webrtcConnection();
        window.onkeyup = function(e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                $('#btn_enter').click();
            }
        };

        document.getElementById('btn_enter').onclick = function() {
           // var chatMessage = $(".emojionearea-editor").html();
           // $(".emojionearea-editor").html('');
           var chatMessage = $('#chatmsgtxt').val();

            if (!chatMessage || !chatMessage.replace(/ /g, '').length) return;

            var checkmark_id = rtcCls.connection.userid + rtcCls.connection.token();

            rtcCls.appendChatMessage(chatMessage, checkmark_id);

            rtcCls.send({
                chatMessage: chatMessage,
                checkmark_id: checkmark_id
            });

            rtcCls.send({
                typing: false
            });

            $('#chatmsgtxt').val('');
        };

        document.getElementById('btn_logout').onclick = function() {
            if(window.confirm("Are you sure you want to leave the room?")){
                rtcCls.connection.socket.disconnect(true);
                open(window.location.href="/", '_self').close();
            }
        };

    }
    webrtcConnection(){
        rtcCls.connection.extra.userFullName = rtcCls.username;
        rtcCls.connection.userid = rtcCls.userid;
        rtcCls.connection.sessionid = rtcCls.spacename;
        if (rtcCls.userinfo.type === 'owner')
        {
            rtcCls.connection.isInitiator = true;
            rtcCls.connection.extra.roomOwner = true;
            rtcCls.connection.type = 'local';
            rtcCls.connection.open(rtcCls.spacename, function(isRoomOpened, roomid, error) {
                if (error) {
                    if (error === rtcCls.connection.errors.ROOM_NOT_AVAILABLE) {
                        alert('Someone already created this room. Please either join or create a separate room.');
                        return;
                    }
                    alert(error);
                }

                if(g_UnityPlayIns) {
                    g_UnityPlayIns.SendMessage("GameDataObject", "getPlayInfoFromWeb", rtcCls.jsonUserinfo);
                }
                if(isRoomOpened === true && g_UnityPlayIns){
                  //  document.getElementById('btn-chat-message').disabled = false;
                   // document.getElementById('btn-chat-message').focus();

                    if(rtcCls.userinfo.debug === 'y')
                        console.log("Success open in room");
                }

                rtcCls.connection.socket.on('disconnect', function() {
                    console.log("my socket is disconnected by server");
                });

                if(isRoomOpened === false){
                    console.log("no open in room");
                    setTimeout(rtcCls.webrtcConnection,2000);
                }

            });

        }
        else if (rtcCls.userinfo.type === 'invite')
        {
            rtcCls.connection.isInitiator = false;
            rtcCls.connection.type = 'local';
            rtcCls.connection.join(rtcCls.spacename, function(isRoomJoined, roomid, error) {
                if (error)
                {
                    if (error === rtcCls.connection.errors.ROOM_NOT_AVAILABLE) {
                        alert('This room does not exist. Please either create it or wait for moderator to enter in the room.');
                        return;
                    }
                    if (error === rtcCls.connection.errors.ROOM_FULL) {
                        alert('Room is full.');
                        return;
                    }
                    if (error === rtcCls.connection.errors.INVALID_PASSWORD) {
                        rtcCls.connection.password = prompt('Please enter room password.') || '';
                        if(!rtcCls.connection.password.length) {
                            alert('Invalid password.');
                            return;
                        }
                        rtcCls.connection.join(roomid, function(isRoomJoined, roomid, error) {
                            if(error) {
                                alert(error);
                            }
                        });
                        return;
                    }
                    alert(error);
                }

                if(g_UnityPlayIns)
                    g_UnityPlayIns.SendMessage("GameDataObject", "getPlayInfoFromWeb", rtcCls.jsonUserinfo);

                if(isRoomJoined === true && g_UnityPlayIns){
                   // document.getElementById('btn-chat-message').disabled = false;
                   // document.getElementById('btn-chat-message').focus();
                }

                rtcCls.connection.socket.on('disconnect', function() {
                    console.log("my socket is disconnected by server");
                });

                if(isRoomJoined === false){
                    console.log("no join in room");
                    setTimeout(rtcCls.webrtcConnection,2000);
                }

            });

        }

    }

}

//===========END RTCCls ================
