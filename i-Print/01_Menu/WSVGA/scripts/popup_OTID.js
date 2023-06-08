/**
 * @fileoverview OTID(One Time ID) 입력 팝업
 * @version 1.0.0
 */

/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var OTIDPopup = new TemplatePage();

OTIDPopup.ID = "pop_otidPopup";
OTIDPopup.pageType = "Special";
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
        imageList: [
            { id: "img_OTID_BG", src: Img.IMG_BG_NOTITLE_BLUE }
        ],
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
    WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: true });
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
OTIDPopup.EventHandler = function(event, id) {
    switch (event) {
        case "onbuttonup":
            MessageManager.clearMessageArea();
            switch (id) {
                case "btn_OTID_confirm":
                    BrowserExt.Beep(0);
                    var tbxOTID = document.getElementById("tbx_OTID");
                    if (!tbxOTID.value) {
                        BrowserExt.Beep(1);
                        return;
                    }
                    if (tbxOTID.value == CONFIG.ENV.ADMIN_INFO.PASSWORD) {
                        PageManager.changePage(AdminSettingPage, PageManager.type.NORMAL); //관리자 설정화면으로 이동
                        tbxOTID.value = "";
                        return;
                    }
                    WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: false });
                    glbInfo.userId = tbxOTID.value;
                    Common.doLogin();
                    tbxOTID.value = "";
                    break;
                case "btn_OTID_cancel":
                case "btn_menu_key":
                case "btn_stop_key":
                    BrowserExt.Beep(0);
                    var tbxOTID = document.getElementById("tbx_OTID");
                    tbxOTID.value = "";
                    PageManager.changePage(PageManager.getPrevPage(), PageManager.type.ROLLBACK);
                    break;
                case "btn_num_key0":
                case "btn_num_key1":
                case "btn_num_key2":
                case "btn_num_key3":
                case "btn_num_key4":
                case "btn_num_key5":
                case "btn_num_key6":
                case "btn_num_key7":
                case "btn_num_key8":
                case "btn_num_key9":
                    var _num = id.substring(11,12);
                    document.getElementById("tbx_OTID").value = document.getElementById("tbx_OTID").value + _num;
                    BrowserExt.Beep(0);
                    break;
                case "btn_comeback_key":
                    document.getElementById("tbx_OTID").value = "";
                    BrowserExt.Beep(0);
                    break;
            }
            break;
        case "onhardkeydown":
            MessageManager.clearMessageArea();
			var inputID = document.getElementById("tbx_OTID").value;
            switch (id) {
                case BrowserExt.keyCode.FX_VK_PAUSE:
                    break;
                case BrowserExt.keyCode.FX_VK_0:
					inputID = inputID + "0";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_1:
					inputID = inputID + "1";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_2:
					inputID = inputID + "2";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_3:
					inputID = inputID + "3";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_4:
					inputID = inputID + "4";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_5:
					inputID = inputID + "5";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_6:
					inputID = inputID + "6";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_7:
					inputID = inputID + "7";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_8:
					inputID = inputID + "8";
					document.getElementById("tbx_OTID").value = inputID;
					break;
                case BrowserExt.keyCode.FX_VK_9:
					inputID = inputID + "9";
					document.getElementById("tbx_OTID").value = inputID;
					break;
				/* 리턴이 들어간 이유 불명(해당 코드 때문에 ID입력시 Error Beep음 난 것으로 판단.)
                    if (flg_Dummy_Beep) {
                        return;
                    }
				*/
					break;
                default:
                    BrowserExt.Beep(1);
                    break;
            }
            break;
        default:
            break;
    }
};
