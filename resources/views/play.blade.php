@extends('layouts.playLayout')

@section('pagestyle')
    <style>
        button:focus {
            outline: none;
        }
    </style>
@endsection
@section('scripts')

@endsection

@section('content')
    <div id="unity-container">
        <canvas id="unity-canvas" style="width:100%;height:100%;" tabindex="1"></canvas>
        <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
                <div id="unity-progress-bar-full"></div>
            </div>
        </div>
        <div id="unity-mobile-warning" style="display:none">
            WebGL builds are not supported on mobile devices.
        </div>
        <div id="unity-footer" style="display:none">
            <div id="unity-webgl-logo"></div>
            <div id="unity-fullscreen-button"></div>
            <div id="unity-build-title">New Unity Project</div>
        </div>
        <div id="other-videos"></div>
        <canvas id="temp-stream-canvas" style="display: none;"></canvas>
    </div>

    <!--   play-controll-bar    -->
    <div class="main_lnb">
        <button type="button" class="btn_logout" id="btn_logout" data-sort="logout"><span class="tooltip" style="width: 100px;">Log Out</span></button>
        <button type="button" class="btn_talk" data-sort="talk"><span class="tooltip" style="width: 100px;">Chatting</span></button>
        <button type="button" class="btn_zoom" data-sort="zoom"><span class="tooltip" style="width: 145px;">Screen shader</span></button>
        <button type="button" class="btn_map" data-sort="map"><span class="tooltip">Map</span></button>
        <button type="button" class="btn_set" data-sort="set"><span class="tooltip">Setting</span></button>
        <button type="button" class="btn_messenger" data-sort="messenger">
            <span class="playcount total">1</span>
            <span class="tooltip" style="width: 120px;">Messenger</span>
        </button>
    </div>
    <!--   ui_slide_chatting    -->
    <section class="ui_slide_talk" data-uitype="talk" style="display: none">
        <h1 class="tit_slide_top">Messenger</h1>
        <!-- talk_con -->
        <div class="talk_con">
            <div class="view" id="conversation-panel" >
               <!-- <div class="talk me">
                    <span class="name">haha</span>
                    <p class="txt">haha</p>
                </div>
                <div class="talk">
                    <span class="name">bobo</span>
                    <p class="txt">haha !</p>
                </div>-->
            </div>
            <div class="btm">
                <input type="text" title="대화 입력" id="chatmsgtxt" placeholder="Type your message here">
                <button type="button" class="btn_plus"><span class="hide">추가</span></button>
                <button type="button" class="btn_enter" id="btn_enter"><span class="hide">보내기</span></button>
            </div>
        </div>
        <!-- // talk_con -->

        <button type="button" class="btn_close"><span class="hide">대화창 닫기</span></button>
    </section>
    <!--   ui_slide_map    -->
    <section class="ui_slide_map" data-uitype="map" style="display: none">
        <h1 class="tit_slide_top">MAP</h1>
        <!-- 작업 범위를 확인하기 어려워 임시로 영역만 잡아두었으니 작업이 필요할 시 명확한 작업 설명과 함께 요청바랍니다. -->
        <div class="view" style="background: url('/img/bg_map.png') no-repeat center;background-size: 100% 100%;">

        </div>
        <button type="button" class="btn_close"><span class="hide">맵 닫기</span></button>
    </section>

    <!-- ui_slide_set -->
    <section class="ui_slide_set main_popup" data-uitype="set">
        <ul class="tab">
            <li class="active"><button type="button">Space</button></li>
            <li><button type="button">User</button></li>
        </ul>
        <div class="box_tab_each">
            <div class="tab_each" style="display: block;">
                <!--
                    insert url object 클릭/btn_back 클릭 에 따라 'url_view'와 'insert_url_form' 태그 none/block 처리 바랍니다.
                    개발처리가 어떻게 될지 몰라 따로 스크립트 작성하지 않았습니다.
                -->
                <div class="url_view" style="display: block;">
                    <!-- 만들어진 오브젝트는 'on' 클래스 추가 (이렇게 가는게 맞는지는 모르겠습니다.) -->
                    <button type="button" class="each on">Insert URL Object</button>
                    <button type="button" class="each">Insert URL Object</button>
                    <button type="button" class="each">Insert URL Object</button>
                    <button type="button" class="each">Insert URL Object</button>
                    <button type="button" class="each">Insert URL Object</button>
                </div>

                <div class="insert_url_form" style="display: none;">
                    <div class="row">
                        <span class="lbl">Input Object Name</span>
                        <input type="text">
                    </div>
                    <div class="row">
                        <span class="lbl">Website (URL)</span>
                        <input type="text" placeholder="https://www.metaspace.life">
                    </div>
                    <div class="box_btn_popup">
                        <button type="button" class="btn_back">Back</button>
                        <button type="button" class="btn_positive">Create</button>
                    </div>
                </div>
            </div>
            <div class="tab_each">
                <p style="color: #fff;">advanced after</p>
            </div>
        </div>
        <button type="button" class="btn_close" data-popupclose="true"><span class="hide">Close popup</span></button>
    </section>
    <!-- // ui_slide_set -->

    <!-- ui_slide_messenger -->
    <section class="ui_slide_messenger" data-uitype="messenger" style="display: none">
        <h1 class="tit_slide_top">Messenger</h1>
        <!--
            대화창 on/off 에 따라 messenger_con 과 talk_con display none/block 을 조절.
        -->
        <!-- messenger_con -->
        <div class="messenger_con" style="display: block;">
            <div class="box_sch">
                <input type="text" title="검색어 입력">
                <button type="button"><span class="hide">검색하기</span></button>
            </div>
            <!-- list_members_messenger -->
            <ul class="list_members_messenger">
                <li>
                    <button type="button" class="btn_category">Online - <span class="num">1</span></button>
                    <ul class="dep2 online">
                        <li>name 1</li>
                        <li class="on">
                            name 2
                            <button type="button" class="btn_talk"><span class="hide">대화하기</span></button>
                        </li>
                    </ul>
                </li>

                <!--
                  <li>
                   <button type="button" class="btn_category">Offline - <span class="num">0</span></button>
                   <ul class="dep2 offline">

                   </ul>
                </li>
                <li>
                   <button type="button" class="btn_category">Guests - <span class="num">10</span></button>
                   <ul class="dep2 guests">
                       <li>name 3</li>
                       <li>name 4</li>
                       <li>name 5</li>
                       <li>name 6</li>
                       <li>name 7</li>
                       <li>name 8</li>
                       <li>name 9</li>
                       <li>name 10</li>
                   </ul>
                </li>-->

            </ul>
            <!-- // list_members_messenger -->

            <button type="button" class="btn_invite" data-popupopen="invite"><span class="hide">초대하기</span></button>
        </div>
        <!-- // messenger_con -->

        <!-- talk_con -->
        <div class="talk_con" style="display: none;">
            <div class="view">
                <div class="talk me">
                    <span class="name">펭수</span>
                    <p class="txt">펭하!</p>
                </div>
                <div class="talk">
                    <span class="name">뽀로로</span>
                    <p class="txt">펭하! 펭하!</p>
                </div>
                <div class="talk">
                    <span class="name">뽀로로</span>
                    <p class="txt">How are you</p>
                </div>
                <div class="talk me">
                    <span class="name">펭수</span>
                    <p class="txt">How are you</p>
                </div>
                <div class="talk me">
                    <span class="name">펭수</span>
                    <p class="txt">I'm a penguin!</p>
                </div>
            </div>
            <div class="btm">
                <input type="text" title="대화 입력" placeholder="Type your message here">
                <button type="button" class="btn_plus"><span class="hide">추가</span></button>
                <button type="button" class="btn_enter" id="btn_enter"><span class="hide">보내기</span></button>
            </div>
        </div>
        <!-- // talk_con -->

        <button type="button" class="btn_close"><span class="hide">메신저창 닫기</span></button>
    </section>

    <!-- main_popup -->
    <div class="main_popup" data-popup="invite">
        <ul class="tab">
            <li class="active"><button type="button">Members</button></li>
            <li><button type="button">Guests</button></li>
        </ul>
        <div class="box_tab_each">
            <div class="tab_each" style="display: block;">
                <h2 class="tit_top">Invite by email</h2>
                <div class="box_input">
                    <input type="text" value="">
                    <!-- 아래 텍스트는 필요시 사용 -->
                    <!-- <p class="txt">옳은 이메일주소 입니다.</p> -->
                </div>
                <div class="box_btn_popup">
<!--                    <button type="button" class="btn_copy email">Copy link</button>-->
                    <button type="button" class="btn_transmit">Send</button>
                </div>
            </div>
            <div class="tab_each">
                <h2 class="tit_top">Invite by link</h2>
                <div class="box_input">
                    <input type="text" value="" id="btn_copy_txt">
                </div>
                <div class="box_btn_popup">
                    <button type="button" class="btn_copy link">Copy link</button>
                </div>
            </div>
        </div>
        <button type="button" class="btn_close" data-popupclose="true"><span class="hide">팝업 닫기</span></button>
    </div>
    <!-- // main_popup -->

@endsection

@section('page_scripts')
    <script>
        window.playInfo={
            uid:'{!! $userinfo['uid'] !!}',
            spaceid:'{!! $userinfo['spaceid'] !!}',
            spacename:'{!! $userinfo['spacename'] !!}',
            username:'{!! $userinfo['username'] !!}',
            buildname:'{!! $userinfo['buildname'] !!}',
            floor:'{!! $userinfo['floor'] !!}',
            avatar:'{!! $userinfo['avatar'] !!}',
            type:'{!! $userinfo['type'] !!}',
            action:'',
            pos:'',
            rot:'',
            debug:'n',
            disshow: '3.0'
        };
    </script>
    <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
    <script src="/js/adapter.js"></script>
    <script type="text/javascript" src="/node_script/RTCMultiConnection.js"></script>
    <script type="text/javascript" src="/socket.io/socket.io.min.js"></script>
    <!--   <script type="text/javascript" src="/node_script/FileBufferReader.js"></script>
           <script type="text/javascript" src="/node_script/webrtc-handler.js"></script>-->
    <!-- <script type="text/javascript" src="/node_script/emojionearea.min.js"></script>-->
    <!--   <script src="/node_script/getHTMLMediaElement.js"></script>-->
    <script type="text/javascript" src="/js/MainPlay.js"></script>
    <script type="text/javascript" src="/js/common.js"></script>
@endsection
