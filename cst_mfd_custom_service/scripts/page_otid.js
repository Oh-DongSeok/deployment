/**
 * @fileoverview OTID(One Time ID) 입력 팝업
 * @version 1.0.0
 */

/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var OTIDPopup = new TemplatePage();

OTIDPopup.ID = "page_otid";
OTIDPopup.key = ""; //메시지 영역 구분자
OTIDPopup.targetService = null;

/**
 * 개별 페이지의 Data정의
 */
OTIDPopup._initModel = function() {
    this._data = {
        buttonList: [
            { id: "btn_OTID_confirm", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_OTID_confirm", offImg: Img.ICN_CF_CONFIRM_OFF, pressImg: Img.ICN_CF_CONFIRM_PRESS, disableImg: Img.ICN_CF_CONFIRM_DIS } },
            { id: "btn_OTID_cancel", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_OTID_cancel", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } }
        ],
        imageList: [],
        textList: [
            { id: "lbl_OTID_guide", text: Msg.OTID.GUIDE_MESSAGE },
            { id: "lbl_OTID_confirm", text: Msg.OTID.BTN_CONFIRM },
            { id: "lbl_OTID_cancel", text: Msg.OTID.BTN_CANCEL },
        ]
    };
};

OTIDPopup._onPageChange = function() {
    this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
OTIDPopup.updateDisplay = function() {
	var obj             = document.getElementById("page_otid");
	obj.style.height    = glbInfo.screenHeight.toString() + "px";
    obj.style.width     = glbInfo.screenWidth.toString() + "px";
	var objBG           = document.getElementById("lyr_OTID_wrapper");
	objBG.style.height  = glbInfo.pageHeight.toString() + "px";
    objBG.style.width   = glbInfo.screenWidth.toString() + "px";
    WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: true });
    var objInput        = document.getElementById("tbx_OTID");
    if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
        objInput.style.width = "724px";
    }
    //objInput.focus();

	var objbtn = document.getElementById("lyr_OTID_btn_wrapper");
	if(glbInfo.screenType == BrowserLib.ScreenType.WVGA_ALL_SCREEN){
		objbtn.style.top        = "280px";
        objbtn.style.left       = "148px";
	}else{
		objbtn.style.top        = "400px";
        if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
            objbtn.style.left   = "262px";
        }else{
            objbtn.style.left   = "148px";
        }
	}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
OTIDPopup.EventHandler = function(event, id) {
    switch (event) {
        case "onbuttonup":
            switch (id) {
                case "btn_OTID_confirm":
                    BrowserExt.Beep(0);
                    var tbxOTID = document.getElementById("tbx_OTID");
                    if (!tbxOTID.value) {
                        BrowserExt.Beep(1);
                        return;
                    }
                    WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: false });
                    glbInfo.userId = tbxOTID.value;
					SSMILib.GetPrintInformation(6000, DATA.SERVER_URL, glbInfo.userId);
                    tbxOTID.value = "";
                    break;
                case "btn_OTID_cancel":
                    BrowserExt.Beep(0);
                    var tbxOTID = document.getElementById("tbx_OTID");
                    tbxOTID.value = "";
                    PageManager.changePage(PageManager.getPrevPage(), PageManager.type.ROLLBACK);
                    break;
            }
            break;
        case "onhardkeydown":
            switch (id) {
                case BrowserExt.keyCode.FX_VK_PAUSE:
                    break;
                case BrowserExt.keyCode.FX_VK_0:
                case BrowserExt.keyCode.FX_VK_1:
                case BrowserExt.keyCode.FX_VK_2:
                case BrowserExt.keyCode.FX_VK_3:
                case BrowserExt.keyCode.FX_VK_4:
                case BrowserExt.keyCode.FX_VK_5:
                case BrowserExt.keyCode.FX_VK_6:
                case BrowserExt.keyCode.FX_VK_7:
                case BrowserExt.keyCode.FX_VK_8:
                case BrowserExt.keyCode.FX_VK_9:
                    if (flg_Dummy_Beep) {
                        return;
                    }
                default:
                    BrowserExt.Beep(1);
                    break;
            }
            break;
        default:
            break;
    }
};
