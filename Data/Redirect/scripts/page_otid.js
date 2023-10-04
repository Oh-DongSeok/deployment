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
            //{ id: "btn_OTID_confirm", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_OTID_confirm", offImg: Img.ICN_CF_CONFIRM_OFF, pressImg: Img.ICN_CF_CONFIRM_PRESS, disableImg: Img.ICN_CF_CONFIRM_DIS } },
            //{ id: "btn_OTID_cancel", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_OTID_cancel", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } }
        ],
        imageList: [],
        textList: [
            { id: "lbl_OTID_guide", text: "암호 입력" },
            //{ id: "lbl_OTID_confirm", text: "확인" },
            //{ id: "lbl_OTID_cancel", text: "취소" },
        ]
    };
};

OTIDPopup._onPageChange = function() {
    ContentsLib.setListener(OTIDPopup.EventHandler);
    createSoftKeypadHtml();
    initSoftKeypadData();
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
	objBG.style.height  = glbInfo.screenHeight.toString() + "px";
    objBG.style.width   = glbInfo.screenWidth.toString() + "px";
    WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: true });
    var objInput        = document.getElementById("tbx_OTID");
    var objChg          = document.getElementById("lyr_Chg_wrapper");
    if(glbInfo.screenWidth == 1024){
        objChg.style.left   = "112px";
    }else{
        objChg.style.left   = "0px";
    }

};
/**
 * Soft core keypad용 HTML Tag생성
 */
function createSoftKeypadHtml()
{
    var softKeypad = document.getElementById("soft_core_keypad");
	// 숫자키
	for(var i=0; i<10; i++){
		var numKey = document.createElement("div");
		numKey.setAttribute("id", "btn_num_key" + i);
		numKey.setAttribute("class", "btn");
		_img = document.createElement("img");
		_img.setAttribute("id", "img_num_key" + i);
		_img.setAttribute("class", "img");
		numKey.appendChild(_img);
		softKeypad.appendChild(numKey);
	}

    // * 키(Clear)
	var mulKey = document.createElement("div");
	mulKey.setAttribute("id", "btn_mul_key");
	mulKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_mul_key");
	_img.setAttribute("class", "img");
	mulKey.appendChild(_img);
	softKeypad.appendChild(mulKey); 

	// # 키(Backspace)
	var sharpKey = document.createElement("div");
	sharpKey.setAttribute("id", "btn_sharp_key");
	sharpKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_sharp_key");
	_img.setAttribute("class", "img");
	sharpKey.appendChild(_img);
	softKeypad.appendChild(sharpKey); 

}
function initSoftKeypadData()
{
	var attr = {};
	for(var i=0; i<10; i++){
		attr.targetImgId = "img_num_key" + i;
		attr.offImg = "./image/btn_num_key" + i + "_off.png";
		attr.pressImg = Img.BTN_SCK_NUM_PRESS;
		WidgetLib.registerButtonWidgetById("btn_num_key"+i, WidgetLib.ButtonType.NORMAL, attr);
	}
	
	attr = {targetImgId:"img_mul_key", offImg:Img.BTN_SCK_MUL_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_mul_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_sharp_key", offImg:Img.BTN_SCK_SHARP_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_sharp_key", WidgetLib.ButtonType.NORMAL, attr);

	
}
/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
OTIDPopup.EventHandler = function(event, id) {
    switch (event) {
        case "onbuttonup":
            switch (id) {
                // *10 Key button Event
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
                    ////var fn = new Function("event_ID", "return event_ID.substring(9,10);");
                    var _num = id.substring(11,12);
                    document.getElementById("tbx_OTID").value += _num;
                    break;
                case "btn_mul_key":	// * Clear
                    document.getElementById("tbx_OTID").value = "";
                    break;
                case "btn_sharp_key": // # Backspace
                    var _otid = document.getElementById("tbx_OTID").value;
                    document.getElementById("tbx_OTID").value = _otid.substring(0, _otid.length - 1);
                    break;
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
