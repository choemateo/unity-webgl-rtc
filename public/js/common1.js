$(function(){
    /************ loading unity ************/
    var curdevice = '{!! $device !!}';
    /*  if(curdevice !== 'D'){
        alert('The current version does not support mobile environment. \n\t Please visit in a computer environment. ');
      }
     else */
    {
        let documenW = $(document).width();
        let documenH = $(document).height();
        let buildUrl = "/unity/Build";
        let loaderUrl = buildUrl + "/Build.loader.js";
        //dev mode
        let config = {
            dataUrl: buildUrl + "/Build.data",
            frameworkUrl: buildUrl + "/Build.framework.js",
            codeUrl: buildUrl + "/Build.wasm",
            streamingAssetsUrl: "StreamingAssets",
            companyName: "jilin",
            productName: "Virtual_Office",
            productVersion: "1.0",
        };

        let container = document.querySelector("#unity-container");
        let canvas = document.querySelector("#unity-canvas");
        let loadingBar = document.querySelector("#unity-loading-bar");
        let progressBarFull = document.querySelector("#unity-progress-bar-full");
        let fullscreenButton = document.querySelector("#unity-fullscreen-button");
        let mobileWarning = document.querySelector("#unity-mobile-warning");

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            container.className = "unity-mobile";
            config.devicePixelRatio = 1;
            mobileWarning.style.display = "block";
            setTimeout(() => {
                mobileWarning.style.display = "none";
            }, 5000);
        }
        else
        {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
        }
        loadingBar.style.display = "none";//block
        let script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            createUnityInstance(canvas, config, (progress) => {
                progressBarFull.style.width = 100 * progress + "%";
            }).then((unityInstance) => {
                loadingBar.style.display = "none";
                g_UnityPlayIns = unityInstance;

            }).catch((message) => {
                alert(message);
            });
        };

        document.body.appendChild(script);
        WaitLoading_Img(documenW, documenH);
    }
    /********** common **********/
    var popupParam ="";
    $("[data-popupopen]").on("click", function(){
        popupParam = $(this).attr("data-popupopen");
        $("[data-popup='" + popupParam + "']").show();
    });

    $("[data-popupclose='true']").on("click", function(){
        $(this).parents("[data-popup]").hide();
    });

    /* play-controll-bar */
    var btnSort = "";
    $('.main_lnb button').click(function (e) {
        e.preventDefault();
        btnSort = $(this).attr("data-sort");
        if(btnSort != 'logout') {
            if (!$(this).hasClass("active")) {
                $(this).addClass("active").siblings(".active").removeClass("active");
                $("[data-uitype]").hide();
                $("[data-uitype='" + btnSort + "']").show();
            } else {
                $(this).removeClass("active");
                $("[data-uitype='" + btnSort + "']").hide();
            }

            $("[data-popup='invite']").hide();
        }
    });

    $("[class^='ui_slide_'] .btn_close").on("click", function(){
        $(this).parents("[class^='ui_slide_']").hide();
        $(".main_lnb button.active").removeClass("active");
    });

    /* list_members_messenger */
    $(document).on("click", ".list_members_messenger .btn_category", function(){
        $(this).siblings(".dep2").toggle();
    });

    /* main_popup */
    var tabIndex = 0;
    $(document).on("click", ".main_popup .tab button", function(){
        if(!$(this).parent().hasClass("active")){
            tabIndex = $(this).parent().index();
            $(this).parent().addClass("active").siblings(".active").removeClass("active");
            $(this).parents(".tab").siblings(".box_tab_each").find(".tab_each").eq(tabIndex).show().siblings().hide();
        }
    });

    $(document).on("click", ".main_popup button.btn_copy.email", function(){
        $("body").append('<input id="copyURL" type="text" value="" />');
        $("#copyURL").val(window.location.href).select();
        document.execCommand("copy");
        $("#copyURL").remove();
    });

    $(document).on("click", ".main_popup button.btn_copy.link", function(){
        $("#btn_copy_txt").val("");
        $("#btn_copy_txt").val(window.location.href).select();
        document.execCommand("copy");
    });



});
