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
        ],
        imageList:[

        ],
        imageList:[],
        textList:[
            {id:"tit_NT_title",     text:"알림"},
            {id:"tit_NT_message01",   text:"서버와 연결이 안됩니다."},
            {id:"tit_NT_message02",   text:"관리자에 문의해주세요."},
            {id:"tit_NT_message03",   text:"메뉴페이지로 이동합니다."}
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
    document.getElementById(NoticePopup.ID).style.backgroundColor = "#fff780";
    document.getElementById(NoticePopup.ID).style.height    = glbInfo.screenHeight.toString() + "px";
    document.getElementById(NoticePopup.ID).style.width     = glbInfo.screenWidth.toString() + "px";
    // Message Position
    var msgHeight   = glbInfo.screenHeight - 200;
    var msgWidth    = glbInfo.screenWidth - 200;
    var msgTop      = 50;
    var msgLeft     = 100;

    var msgAttr     = document.getElementById("tit_NT_message");
    var msgAttr01   = document.getElementById("tit_NT_message01");
    var msgAttr02   = document.getElementById("tit_NT_message02");
    var msgAttr03   = document.getElementById("tit_NT_message03");
    msgAttr.style.top       = msgTop.toString() + "px";
    msgAttr.style.left      = msgLeft.toString() + "px";
    msgAttr.style.height    = msgHeight.toString() + "px";
    msgAttr.style.width     = msgWidth.toString() + "px";
    msgAttr.style.backgroundColor = "#bfbfff";
    msgAttr01.style.width   = msgWidth.toString() + "px";
    msgAttr02.style.width   = msgWidth.toString() + "px";
    msgAttr03.style.width   = msgWidth.toString() + "px";

    var prefBtnTop  = glbInfo.screenHeight - 40;
	var prefBtnLeft = glbInfo.screenWidth - 40;
	var topPx       = prefBtnTop.toString() + "px";
	var leftPx      = prefBtnLeft.toString() + "px";
	var prefBtnAttr = document.getElementById("btn_NT_admin");
	prefBtnAttr.style.top = topPx;
	prefBtnAttr.style.left = leftPx;
}

 /**
  * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
  */
NoticePopup.updateDisplay = function()
{

};
