/**
 * 개별 페이지의 표시 및 동작용
 * （각종 Error 및 정보 표시용 페이지）
*/
var NoticePopup = new TemplatePage();

NoticePopup.ID = "pop_noticePopup";

//NoticePopup.isGetChargeInfo = false;
//NoticePopup.isCardLogIn = false;

/**
 * 개별 페이지의 Data정의
 */
NoticePopup._initModel=function()
{
    this._data = {
        buttonList:[
            {id:"btn_NT_confirm",   type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_NT_confirm",  offImg: Img.BTN_NOR_OFF, onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
			{id:"btn_NT_retry",   	type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_NT_retry",    offImg: Img.BTN_NOR_OFF, onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
            {id:"btn_NT_admin",   	type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_NT_admin",    offImg: Img.BTN_NOR_OFF, onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
        ],
        imageList:[
            {id:"img_NT_qrcode",    src: Img.IMG_NO_QR_CODE}

        ],
        imageList:[],
        textList:[
            {id:"tit_NT_title",     text:Msg.NoticePopup.Title_Info},
            {id:"tit_NT_message",   text:Msg.NoticePopup.Msg_Other},
            {id:"lbl_NT_confirm",   text:Msg.NoticePopup.btnConfirm},
		    {id:"lbl_NT_retry",		text:Msg.NoticePopup.btnRetry},
            {id:"lbl_NT_admin",		text:Msg.NoticePopup.btnAdmin}
        ]
    };
};


NoticePopup._onPageChange = function(){
    KISUtil.debug("NoticePopup:","excute");
    this.cssChange();
    this.updateDisplay();
};

//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
NoticePopup.cssChange = function()
{
    /*
        Background 색상
        FAIL    : ff8080
        WARN    : fff780
        INFO    : 80ff80
        DEFAULT : bfbfff
    */
    switch(glbNoticeInfo.type){
        case NOTICE.INFO:
            document.getElementById(NoticePopup.ID).style.backgroundColor = "#80ff80";
            break;
        case NOTICE.WARN:
            document.getElementById(NoticePopup.ID).style.backgroundColor = "#fff780";
            break;
        case NOTICE.FAIL:
            document.getElementById(NoticePopup.ID).style.backgroundColor = "#ff8080";
            break;
        case NOTICE.FAX_INFO:
            document.getElementById(NoticePopup.ID).style.backgroundColor = "#2b2b2b";
            document.getElementById("tit_NT_title").style.color           = "#fff";
            document.getElementById("tit_NT_message").style.color         = "#fff";
            break;
        default:
            document.getElementById(NoticePopup.ID).style.backgroundColor = "#bfbfff";
            break;
    }
    document.getElementById(NoticePopup.ID).style.height    = glbInfo.pageHeight.toString() + "px";
    document.getElementById(NoticePopup.ID).style.width     = glbInfo.screenWidth.toString() + "px";
}

 /**
  * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
  */
NoticePopup.updateDisplay = function()
{
    /*
    BrowserExt.Beep(0);
    WidgetLib.setWidgetStatus("btn_FL_Print",{enable:true});		//버튼 활성화

    Common.changeVisibility('btn_confirm','block');
    Common.setPosition("btn_DP_CP_cancel","right","100px");
    Common.changeVisibility('txt_CP_msg0','block');
    Common.changeVisibility('txt_CP_msg1','block');
    */
    switch(glbNoticeInfo.type){
        case NOTICE.INFO:
            Common.setText('tit_NT_title', Msg.NoticePopup.Title_Info);
            Common.setText('tit_NT_message', glbNoticeInfo.message);
            break;
        case NOTICE.WARN:
            Common.setText('tit_NT_title', Msg.NoticePopup.Title_Warn);
            Common.setText('tit_NT_message', glbNoticeInfo.message);
            break;
        case NOTICE.FAIL:
            Common.setText('tit_NT_title', Msg.NoticePopup.Title_Fail);
            Common.setText('tit_NT_message', glbNoticeInfo.message);
            break;
        case NOTICE.FAX_INFO:
            if(glbJobLogInfo.qrcodeUrl != "NO_IMAGE"){
                Common.setImage("img_NT_qrcode", glbJobLogInfo.qrcodeUrl);
                Common.setText('tit_NT_message', glbNoticeInfo.message);
            }else{
                Common.setText('tit_NT_message', Msg.NoticePopup.Msg_FAX_Send_Search_NO_QR);
            }
            break;
        default:
            Common.setText('tit_NT_title', Msg.NoticePopup.Title_Info);
            break;
    }

	if(glbNoticeInfo.message == Msg.NoticePopup.Msg_NONE_PC  + " (NP)"){
        Common.changeVisibility("btn_NT_confirm",   "none" );
        Common.changeVisibility("btn_NT_retry",     "block");
        Common.changeVisibility("btn_NT_admin",     "none" );
        Common.changeVisibility("img_NT_qrcode",    "none" );
	}else{
        Common.changeVisibility("btn_NT_confirm",   "block");
		Common.changeVisibility("btn_NT_retry",     "none" );
        Common.changeVisibility("btn_NT_admin",     "block");
        Common.changeVisibility("img_NT_qrcode",    "none" );
	}
    if(glbNoticeInfo.type == NOTICE.FAX_INFO){
        Common.changeVisibility("btn_NT_retry",     "none" );
        Common.changeVisibility("btn_NT_admin",     "none" );
        Common.changeVisibility("btn_NT_confirm",   "block");
        Common.changeVisibility("img_NT_qrcode",    "block");
    }

/*
    if(glbNoticeInfo.message == Msg.NoticePopup.Msg_Auth){
        Common.setText('lbl_NT_retry', Msg.NoticePopup.btnSetting);
		Common.changeVisibility("btn_NT_retry","block");
	}else{
		Common.changeVisibility("btn_NT_retry","none");
	}
    */
};
