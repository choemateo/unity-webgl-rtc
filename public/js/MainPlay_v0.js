'use strict';

var interval;
var g_webtime;
let rtcCls;
var g_UnityPlayIns;
window.enableAdapter = true;
window.ignoreBeforeUnload = true;
var sturl = "https://ug.local.com:9008/";

const constraints = window.constraints = {
    audio: false,
    video: true
};

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
            if(data.msg!="ok") {
                LogoutFromSpace();
                console.log("del msg =>" + data.msg);
            }

        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            LogoutFromSpace();
            console.log("del error = >ajax error");
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

function leaveOtherUser(pusername, pspacename){
    $.ajax({
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        url: "/leavePlayUserInfo",
        type: 'POST',
        data: {username: pusername, spacename:pspacename},
        async:true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
        {
            if(data.msg!="ok")
                console.log("del msg =>" + data.msg);

        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            console.log("del error = >ajax error");
        }
    });
}

//============ called by unity ================================
function  CallWebFunction(jsonstr)
{
    let msg = JSON.parse(jsonstr);
    let type = msg.type;
    let abody = msg.body;
    if(type==="u_info" && rtcCls)
    {
        //let body = JSON.parse(msg.body);
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
                if(data.msg!="ok")
                    window.alert("u_info msg =>" + data.msg);

            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                window.alert("u_info error => ajax error");
            }
        });
    }
    else if(type==="u_leave" && rtcCls)
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
                if(data.msg!="ok")
                    window.alert("u_leave msg =>" + data.msg);

            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                window.alert("u_leave error = >ajax error");
            }
        });
    }
    else if(type==="TransXY" && rtcCls)
    {
        let body = JSON.parse(msg.body);
        let checkmark_id = rtcCls.connection.userid + rtcCls.connection.token();
        /* if(g_socket) {
             g_socket.emit('TransXY', msg.body);
             console.log("send TransXY to server");
         }*/
        if(body.uid != rtcCls.userinfo.uid)
            console.log(msg.body);

        rtcCls.send({
            transMessage:  msg.body,
            sender: rtcCls.connection.userid
        });
    }
    else if(type==="NearEnemys"  && rtcCls)
    {
        //console.log("msgbody =>" + abody);
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
                //console.log("k=>" + k + "  v=>" + v);
                if(k==="userid"){
                    ruserid = v;
                }
                else if(k==="sw"){
                    rsw=v;
                }
                else if(k==="spacename"){}
            }

            $("#other-videos").children("video").each(function (index) {
                let datauid = $(this).attr("data-uid");
                if(datauid === ruserid)
                {
                    if(rsw === "y")
                        $(this).attr("style","display:block");
                    else
                        $(this).attr("style","display:none");
                }
            });

        }

    }
    else if(type==="gameEvent")
    {
        if(g_UnityPlayIns!=null && abody==="started")
        {
            if(interval)
                clearInterval(interval);

            $("#unity-canvas").css("visibility","visible");
            $("#cover-unity-canvas").remove();
            rtcCls = new RTCArea();
            rtcCls.StartRTC();
        }

    }
}

//==========  wait loading ===================================
function WaitLoading(ww,wh){
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
            ctx0.font="bold 80px Georgia";
            var gradient=ctx0.createLinearGradient(0,0,temp_canvas.width,0);
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
        this.userid = this.username +  this.userinfo.spaceid;
        this.localVideo = null;
        this.connection=null;
        this.isLocalStream=false;

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
                'stun:stun.ekiga.net',
                'stun:stun.ideasip.com',
                'stun:stun.rixtelecom.se',
                'stun:stun.schlund.de',
                'stun:stun.stunprotocol.org:3478',
                'stun:stun.voiparound.com',
                'stun:stun.voipbuster.com',
                'stun:stun.voipstunt.com',
                'stun:stun.voxgratia.org',
                'stun:23.21.150.121:3478',
                'stun:iphone-stun.strato-iphone.de:3478',
                'stun:numb.viagenie.ca:3478',
                'stun:s1.taraba.net:3478',
                'stun:s2.taraba.net:3478',
                'stun:stun.12connect.com:3478',
                'stun:stun.12voip.com:3478',
                'stun:stun.1und1.de:3478',
                'stun:stun.2talk.co.nz:3478',
                'stun:stun.2talk.com:3478',
                'stun:stun.3clogic.com:3478',
                'stun:stun.3cx.com:3478',
                'stun:stun.a-mm.tv:3478',
                'stun:stun.aa.net.uk:3478',
                'stun:stun.acrobits.cz:3478',
                'stun:stun.actionvoip.com:3478',
                'stun:stun.advfn.com:3478',
                'stun:stun.aeta-audio.com:3478',
                'stun:stun.aeta.com:3478',
                'stun:stun.alltel.com.au:3478',
                'stun:stun.altar.com.pl:3478',
                'stun:stun.annatel.net:3478',
                'stun:stun.antisip.com:3478',
                'stun:stun.arbuz.ru:3478',
                'stun:stun.avigora.com:3478',
                'stun:stun.avigora.fr:3478',
                'stun:stun.awa-shima.com:3478',
                'stun:stun.awt.be:3478',
                'stun:stun.b2b2c.ca:3478',
                'stun:stun.bahnhof.net:3478',
                'stun:stun.barracuda.com:3478',
                'stun:stun.bluesip.net:3478',
                'stun:stun.bmwgs.cz:3478',
                'stun:stun.botonakis.com:3478',
                'stun:stun.budgetphone.nl:3478',
                'stun:stun.budgetsip.com:3478',
                'stun:stun.cablenet-as.net:3478',
                'stun:stun.callromania.ro:3478',
                'stun:stun.callwithus.com:3478',
                'stun:stun.cbsys.net:3478',
                'stun:stun.chathelp.ru:3478',
                'stun:stun.cheapvoip.com:3478',
                'stun:stun.ciktel.com:3478',
                'stun:stun.cloopen.com:3478',
                'stun:stun.colouredlines.com.au:3478',
                'stun:stun.comfi.com:3478',
                'stun:stun.commpeak.com:3478',
                'stun:stun.comtube.com:3478',
                'stun:stun.comtube.ru:3478',
                'stun:stun.cope.es:3478',
                'stun:stun.counterpath.com:3478',
                'stun:stun.counterpath.net:3478',
                'stun:stun.cryptonit.net:3478',
                'stun:stun.darioflaccovio.it:3478',
                'stun:stun.datamanagement.it:3478',
                'stun:stun.dcalling.de:3478',
                'stun:stun.decanet.fr:3478',
                'stun:stun.demos.ru:3478',
                'stun:stun.develz.org:3478',
                'stun:stun.dingaling.ca:3478',
                'stun:stun.doublerobotics.com:3478',
                'stun:stun.drogon.net:3478',
                'stun:stun.duocom.es:3478',
                'stun:stun.dus.net:3478',
                'stun:stun.e-fon.ch:3478',
                'stun:stun.easybell.de:3478',
                'stun:stun.easycall.pl:3478',
                'stun:stun.easyvoip.com:3478',
                'stun:stun.efficace-factory.com:3478',
                'stun:stun.einsundeins.com:3478',
                'stun:stun.einsundeins.de:3478',
                'stun:stun.ekiga.net:3478',
                'stun:stun.epygi.com:3478',
                'stun:stun.etoilediese.fr:3478',
                'stun:stun.eyeball.com:3478',
                'stun:stun.faktortel.com.au:3478',
                'stun:stun.freecall.com:3478',
                'stun:stun.freeswitch.org:3478',
                'stun:stun.freevoipdeal.com:3478',
                'stun:stun.fuzemeeting.com:3478',
                'stun:stun.gmx.de:3478',
                'stun:stun.gmx.net:3478',
                'stun:stun.gradwell.com:3478',
                'stun:stun.halonet.pl:3478',
                'stun:stun.hellonanu.com:3478',
                'stun:stun.hoiio.com:3478',
                'stun:stun.hosteurope.de:3478',
                'stun:stun.ideasip.com:3478',
                'stun:stun.imesh.com:3478',
                'stun:stun.infra.net:3478',
                'stun:stun.internetcalls.com:3478',
                'stun:stun.intervoip.com:3478',
                'stun:stun.ipcomms.net:3478',
                'stun:stun.ipfire.org:3478',
                'stun:stun.ippi.fr:3478',
                'stun:stun.ipshka.com:3478',
                'stun:stun.iptel.org:3478',
                'stun:stun.irian.at:3478',
                'stun:stun.it1.hr:3478',
                'stun:stun.ivao.aero:3478',
                'stun:stun.jappix.com:3478',
                'stun:stun.jumblo.com:3478',
                'stun:stun.justvoip.com:3478',
                'stun:stun.kanet.ru:3478',
                'stun:stun.kiwilink.co.nz:3478',
                'stun:stun.kundenserver.de:3478',
                'stun:stun.linea7.net:3478',
                'stun:stun.linphone.org:3478',
                'stun:stun.liveo.fr:3478',
                'stun:stun.lowratevoip.com:3478',
                'stun:stun.lugosoft.com:3478',
                'stun:stun.lundimatin.fr:3478',
                'stun:stun.magnet.ie:3478',
                'stun:stun.manle.com:3478',
                'stun:stun.mgn.ru:3478',
                'stun:stun.mit.de:3478',
                'stun:stun.mitake.com.tw:3478',
                'stun:stun.miwifi.com:3478',
                'stun:stun.modulus.gr:3478',
                'stun:stun.mozcom.com:3478',
                'stun:stun.myvoiptraffic.com:3478',
                'stun:stun.mywatson.it:3478',
                'stun:stun.nas.net:3478',
                'stun:stun.neotel.co.za:3478',
                'stun:stun.netappel.com:3478',
                'stun:stun.netappel.fr:3478',
                'stun:stun.netgsm.com.tr:3478',
                'stun:stun.nfon.net:3478',
                'stun:stun.noblogs.org:3478',
                'stun:stun.noc.ams-ix.net:3478',
                'stun:stun.node4.co.uk:3478',
                'stun:stun.nonoh.net:3478',
                'stun:stun.nottingham.ac.uk:3478',
                'stun:stun.nova.is:3478',
                'stun:stun.nventure.com:3478',
                'stun:stun.on.net.mk:3478',
                'stun:stun.ooma.com:3478',
                'stun:stun.ooonet.ru:3478',
                'stun:stun.oriontelekom.rs:3478',
                'stun:stun.outland-net.de:3478',
                'stun:stun.ozekiphone.com:3478',
                'stun:stun.patlive.com:3478',
                'stun:stun.personal-voip.de:3478',
                'stun:stun.petcube.com:3478',
                'stun:stun.phone.com:3478',
                'stun:stun.phoneserve.com:3478',
                'stun:stun.pjsip.org:3478',
                'stun:stun.poivy.com:3478',
                'stun:stun.powerpbx.org:3478',
                'stun:stun.powervoip.com:3478',
                'stun:stun.ppdi.com:3478',
                'stun:stun.prizee.com:3478',
                'stun:stun.qq.com:3478',
                'stun:stun.qvod.com:3478',
                'stun:stun.rackco.com:3478',
                'stun:stun.rapidnet.de:3478',
                'stun:stun.rb-net.com:3478',
                'stun:stun.refint.net:3478',
                'stun:stun.remote-learner.net:3478',
                'stun:stun.rixtelecom.se:3478',
                'stun:stun.rockenstein.de:3478',
                'stun:stun.rolmail.net:3478',
                'stun:stun.rounds.com:3478',
                'stun:stun.rynga.com:3478',
                'stun:stun.samsungsmartcam.com:3478',
                'stun:stun.schlund.de:3478',
                'stun:stun.services.mozilla.com:3478',
                'stun:stun.sigmavoip.com:3478',
                'stun:stun.sip.us:3478',
                'stun:stun.sipdiscount.com:3478',
                'stun:stun.sipgate.net:10000',
                'stun:stun.sipgate.net:3478',
                'stun:stun.siplogin.de:3478',
                'stun:stun.sipnet.net:3478',
                'stun:stun.sipnet.ru:3478',
                'stun:stun.siportal.it:3478',
                'stun:stun.sippeer.dk:3478',
                'stun:stun.siptraffic.com:3478',
                'stun:stun.skylink.ru:3478',
                'stun:stun.sma.de:3478',
                'stun:stun.smartvoip.com:3478',
                'stun:stun.smsdiscount.com:3478',
                'stun:stun.snafu.de:3478',
                'stun:stun.softjoys.com:3478',
                'stun:stun.solcon.nl:3478',
                'stun:stun.solnet.ch:3478',
                'stun:stun.sonetel.com:3478',
                'stun:stun.sonetel.net:3478',
                'stun:stun.sovtest.ru:3478',
                'stun:stun.speedy.com.ar:3478',
                'stun:stun.spokn.com:3478',
                'stun:stun.srce.hr:3478',
                'stun:stun.ssl7.net:3478',
                'stun:stun.stunprotocol.org:3478',
                'stun:stun.symform.com:3478',
                'stun:stun.symplicity.com:3478',
                'stun:stun.sysadminman.net:3478',
                'stun:stun.t-online.de:3478',
                'stun:stun.tagan.ru:3478',
                'stun:stun.tatneft.ru:3478',
                'stun:stun.teachercreated.com:3478',
                'stun:stun.tel.lu:3478',
                'stun:stun.telbo.com:3478',
                'stun:stun.telefacil.com:3478',
                'stun:stun.tis-dialog.ru:3478',
                'stun:stun.tng.de:3478',
                'stun:stun.twt.it:3478',
                'stun:stun.u-blox.com:3478',
                'stun:stun.ucallweconn.net:3478',
                'stun:stun.ucsb.edu:3478',
                'stun:stun.ucw.cz:3478',
                'stun:stun.uls.co.za:3478',
                'stun:stun.unseen.is:3478',
                'stun:stun.usfamily.net:3478',
                'stun:stun.veoh.com:3478',
                'stun:stun.vidyo.com:3478',
                'stun:stun.vipgroup.net:3478',
                'stun:stun.virtual-call.com:3478',
                'stun:stun.viva.gr:3478',
                'stun:stun.vivox.com:3478',
                'stun:stun.vline.com:3478',
                'stun:stun.vo.lu:3478',
                'stun:stun.vodafone.ro:3478',
                'stun:stun.voicetrading.com:3478',
                'stun:stun.voip.aebc.com:3478',
                'stun:stun.voip.blackberry.com:3478',
                'stun:stun.voip.eutelia.it:3478',
                'stun:stun.voiparound.com:3478',
                'stun:stun.voipblast.com:3478',
                'stun:stun.voipbuster.com:3478',
                'stun:stun.voipbusterpro.com:3478',
                'stun:stun.voipcheap.co.uk:3478',
                'stun:stun.voipcheap.com:3478',
                'stun:stun.voipfibre.com:3478',
                'stun:stun.voipgain.com:3478',
                'stun:stun.voipgate.com:3478',
                'stun:stun.voipinfocenter.com:3478',
                'stun:stun.voipplanet.nl:3478',
                'stun:stun.voippro.com:3478',
                'stun:stun.voipraider.com:3478',
                'stun:stun.voipstunt.com:3478',
                'stun:stun.voipwise.com:3478',
                'stun:stun.voipzoom.com:3478',
                'stun:stun.vopium.com:3478',
                'stun:stun.voxgratia.org:3478',
                'stun:stun.voxox.com:3478',
                'stun:stun.voys.nl:3478',
                'stun:stun.voztele.com:3478',
                'stun:stun.vyke.com:3478',
                'stun:stun.webcalldirect.com:3478',
                'stun:stun.whoi.edu:3478',
                'stun:stun.wifirst.net:3478',
                'stun:stun.wwdl.net:3478',
                'stun:stun.xs4all.nl:3478',
                'stun:stun.xtratelecom.es:3478',
                'stun:stun.yesss.at:3478',
                'stun:stun.zadarma.com:3478',
                'stun:stun.zadv.com:3478',
                'stun:stun.zoiper.com:3478',
                'stun:stun1.faktortel.com.au:3478',
                'stun:stun1.voiceeclipse.net:3478',
                'stun:stunserver.org:3478'
            ]
        },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }
        ];

        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };
        this.connection.onstream = function(event) {
            if (event.userid !== rtcCls.userid)
            {
                $("#other-videos").children("video").each(function (index) {
                    let datauid = $(this).attr("data-uid");
                    if(datauid === event.userid)
                    {
                        $(this).remove();
                        return false;
                    }
                });

                event.mediaElement.controls = false;
                let otherVideos = document.querySelector('#other-videos');
                otherVideos.appendChild(event.mediaElement);
                event.mediaElement.setAttribute("data-uid",event.userid);
                event.mediaElement.setAttribute("style","display:none");
                $('#other-videos').css({display:"flex"});
            }
            else
            {
                var unityContainer = document.getElementById("unity-container");
                if(rtcCls.localVideo)
                {
                    //rtcCls.localVideo.srcObject = null;
                    ////rtcCls.localVideo.muted = true;
                   // //rtcCls.localVideo.volume = 0;
                    ////rtcCls.localVideo.setAttribute("data-streamid", event.streamid);
                    ////window.tempStream = event.stream;
                    //$(rtcCls.localVideo).remove();
                    rtcCls.localVideo.srcObject = event.stream;
                }
                else
                {

                    rtcCls.localVideo = document.createElement('video');
                    rtcCls.localVideo.id = 'video';
                    rtcCls.localVideo.className = 'videocls';
                    rtcCls.localVideo.muted = true;
                    rtcCls.localVideo.volume = 0;
                    rtcCls.localVideo.setAttribute('playsinline','');
                    rtcCls.localVideo.setAttribute('autoplay','');
                    rtcCls.localVideo.setAttribute("data-streamid", event.streamid);
                    rtcCls.localVideo.setAttribute("data-uid", event.userid);

                    unityContainer.appendChild(rtcCls.localVideo);

                    rtcCls.localVideo.srcObject = event.stream;
                    rtcCls.isLocalStream = true;
                }
            }
        };
        this.connection.onUserStatusChanged = function(event) {
            /*  let infoBar = document.getElementById('onUserStatusChanged');
              let names = [];
              connection.getAllParticipants().forEach(function(pid) {
                  names.push(getFullName(pid));
              });

              if (!names.length) {
                  names = ['Only You'];
              } else {
                  names = [connection.extra.userFullName || 'You'].concat(names);
              }
              infoBar.innerHTML = '<b>Active users:</b> ' + names.join(', ');*/
        };

        this.connection.onopen = function(event)//open from other socket
        {

            console.log(event.extra.userFullName + " is onopen");
        };

        this.connection.onclose = this.connection.onerror = this.connection.onleave = function(event) {
            if(event.extra.userFullName == undefined)
                return;

            rtcCls.connection.onUserStatusChanged(event);
            if(rtcCls.userinfo.debug=="y")
                console.log("onclose end =>"+ event.extra.userFullName);

            if(g_UnityPlayIns){
                var evt ={
                    type:'u_leave',
                    body:event.extra.userFullName+','+event.userid
                };
                g_UnityPlayIns.SendMessage("GameDataObject","SimpleEventFromWeb", JSON.stringify(evt));

                leaveOtherUser(event.extra.userFullName, rtcCls.spacename);

                $("#other-videos").children("video").each(function (index) {
                    let datauid = $(this).attr("data-uid");
                    if(datauid === event.userid)
                    {
                        $(this).srcObject=null;
                        window.tempStream=null;
                        $(this).remove();
                        return false;
                    }
                });

            }
            else{
                console.log("error  g_UnityPlayIns is null in onclose fun");
            }
        };

        this.connection.onmessage = function(event) {
            //console.log("received message =>" + event.data);
            if(event.data.transMessage) {
                if(g_UnityPlayIns){
                    g_UnityPlayIns.SendMessage("GameDataObject","setPlayTransFromWeb", event.data.transMessage);
                }
                else{
                    console.log("error  g_UnityPlayIns is null in onmessage fun");
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

        this.connection.onstreamended = function(event) {
            console.log("stream end =>"+ event.extra.userFullName);
            let video = document.querySelector('video[data-uid="' + event.userid + '"]');
            if (!video) {
                video = document.getElementById(event.streamid);
                if (video) {
                    video.srcObject = null;
                    video.style.display = 'none';
                    video.parentNode.removeChild(video);
                    return;
                }
            }
            if (video) {
                video.srcObject = null;
                video.style.display = 'none';
                video.parentNode.removeChild(video);
            }
        };

    }
    send(str){
        rtcCls.connection.send(str);
    }
    appendVideoTag(){
        this.localVideo = document.createElement('video');
        this.localVideo.id = 'video';
        this.localVideo.className = 'videocls';
        this.localVideo.setAttribute('playsinline','');
        this.localVideo.setAttribute('autoplay','');
        this.localVideo.setAttribute("data-uid", this.userid);
        var unityContainer = document.getElementById("unity-container");
        unityContainer.appendChild(this.localVideo);
    }
    handleSuccess(stream){
        if(rtcCls.localVideo){
            const videoTracks = stream.getVideoTracks();
            //console.log(`Using video device: ${videoTracks[0].label}`);
            window.tempStream = stream; // make variable available to browser console
            rtcCls.localVideo.srcObject = stream;
            rtcCls.isLocalStream = true;
        }
        else{
            console.log("ERROR local video tag");
        }
    }
    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            console.log(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
        } else if (error.name === 'PermissionDeniedError') {
            console.log('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        console.log(`getUserMedia error: ${error.name}`, error);
    }
    async setLocalStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            rtcCls.handleSuccess(stream);
        } catch (e) {
            rtcCls.handleError(e);
        }
    }
    appendChatMessage(event, checkmark_id) {
        var div = document.createElement('div');
        div.className = 'message';
        if (event.data) {
            div.innerHTML = '<b>' + (event.extra.userFullName || event.userid) + ':</b><br>' + event.data.chatMessage;

            if (event.data.checkmark_id) {
                rtcCls.send({
                    checkmark: 'received',
                    checkmark_id: event.data.checkmark_id
                });
            }
        } else {
            div.innerHTML = '<b>You:</b> <img class="checkmark" id="' + checkmark_id + '" title="Received" src="https://www.webrtc-experiment.com/images/checkmark.png"><br>' + event;
            div.style.background = '#cbffcb';
        }

        rtcCls.conversationPanel.appendChild(div);
        rtcCls.conversationPanel.scrollTop = rtcCls.conversationPanel.clientHeight;
        rtcCls.conversationPanel.scrollTop = rtcCls.conversationPanel.scrollHeight - rtcCls.conversationPanel.scrollTop;
    }
    getFullName(userid) {
        var _userFullName = userid;
        if (rtcCls.connection.peers[userid] && rtcCls.connection.peers[userid].extra.userFullName) {
            _userFullName = rtcCls.connection.peers[userid].extra.userFullName;
        }
        return _userFullName;
    }
    checkLocalVideo(){
        if(rtcCls.isLocalStream === true)
        {
            if(g_webtime)
                clearTimeout(g_webtime);

            rtcCls.webrtcConnection();

            window.onkeyup = function(e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    $('#btn-chat-message').click();
                }
            };

            document.getElementById('btn-chat-message').onclick = function() {
                var chatMessage = $(".emojionearea-editor").html();
                $(".emojionearea-editor").html('');

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
            };
        }
        else
        {
            g_webtime = setTimeout(rtcCls.checkLocalVideo,1000);
        }
    }
    dirConnection(){
        rtcCls.webrtcConnection();
        window.onbeforeunload = LogoutFromSpace;
        window.onkeyup = function(e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                $('#btn-chat-message').click();
            }
        };

        document.getElementById('btn-chat-message').onclick = function() {
            var chatMessage = $(".emojionearea-editor").html();
            $(".emojionearea-editor").html('');

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
        };
    }
    StartRTC()
    {
        // this.appendVideoTag();
        //this.setLocalStream();
        //g_webtime = setTimeout(this.checkLocalVideo,500);
        this.dirConnection();
    }
    webrtcConnection(){
        rtcCls.connection.extra.userFullName = rtcCls.username;
        rtcCls.connection.userid = rtcCls.userid;
        rtcCls.connection.sessionid = rtcCls.spacename;
        if (rtcCls.userinfo.type === 'owner')
        {
            //connection.publicRoomIdentifier = '';
            rtcCls.connection.isInitiator = true;
            rtcCls.connection.extra.roomOwner = true;
            rtcCls.connection.type = 'local';

            /*  if(window.tempStream)
              rtcCls.connection.attachStreams.push(window.tempStream);*/

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
                    document.getElementById('btn-chat-message').disabled = false;
                    document.getElementById('btn-chat-message').focus();

                    if(rtcCls.userinfo.debug == 'y')
                        console.log("Success open in room");
                }

                if(isRoomOpened == false){
                    console.log("no open in room");
                }

                rtcCls.connection.socket.on('disconnect', function() {
                    //location.reload();
                    console.log("close this socket");
                });

            });

        }
        else if (rtcCls.userinfo.type === 'invite')
        {
            rtcCls.connection.isInitiator = false;
            rtcCls.connection.type = 'local';
            /*  if(window.tempStream)
                  rtcCls.connection.attachStreams.push(window.tempStream);*/

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
                    document.getElementById('btn-chat-message').disabled = false;
                    document.getElementById('btn-chat-message').focus();
                }

                if(isRoomJoined == false){
                    console.log("no join in room");
                }

                rtcCls.connection.socket.on('disconnect', function() {
                    LogoutFromSpace();
                    //location.reload();
                    console.log("close this socket");
                });

            });

        }

    }

}

//===========END RTCCls ================
