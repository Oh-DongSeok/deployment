/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/黄色）
 */
var ChargeResultPopup = new TemplatePage();

ChargeResultPopup.ID = "pop_chargeResultPopup";

ChargeResultPopup.timer = CONFIG.ENV.TIMEOUTS.CHARGEINFO;
ChargeResultPopup.isGetChargeInfo = false;
ChargeResultPopup.isCardLogIn = false;

/**
 * 개별 페이지의 Data정의
 */
ChargeResultPopup._initModel=function()
{
	this._data = {
		buttonList:[			
			{id:"btn_CRP_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_CRP_confirm",offImg: Img.UIPARTS.BTN_NOR_OFF,onImg:Img.UIPARTS.BTN_NOR_ON, pressImg: Img.UIPARTS.BTN_NOR_PRESS, disableImg: Img.UIPARTS.BTN_NOR_DIS}},
		],
		imageList:[
		    
		],
		textList:[
			{id:"tit_CRP_price", text:Msg.Page.ChargeResultPopup.lblPrice},
			//{id:"tit_CRP_chargeRemains", text:Msg.Page.ChargeResultPopup.lblChargeRemain},
			{id:"lbl_CRP_confirm", text:Msg.Page.CONFIRM.BTN_CONFIRM}
		]
	};
};

ChargeResultPopup.cssChange = function()
{
	switch(glbInfo.lang){
		case "ja":
			break;
		case "ch":
			break;
		case "en":
			break;
		default:
			break;
	}
};

ChargeResultPopup._onPageChange = function()
{
	KISUtil.debug("ChargeResultPopup.sendRequest:", "excute");
	
	var info = this._dataSet.priceResult;
	var lst = [
		{id:"lbl_CRP_price", text:formatWithRemainders(info.price)+" "+ Msg.UNIT.WON}//,
		//{id:"lbl_CRP_chargeRemains", text:formatWithRemainders(info.chargeRemains)+" "+ Msg.UNIT.WON}
	];
	var obj;
	for (var i = 0, il = lst.length; i < il; i++) {
		obj = lst[i];
		Common.setText(obj.id, obj.text);
		if (obj.className) {
			var ele = document.getElementById(obj.id);
			if (ele)
				ele.className = obj.className;
		}
	}

	this.cssChange();
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
ChargeResultPopup.updateDisplay = function()
{
	BrowserExt.Beep(0);
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
ChargeResultPopup.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id){
				case "btn_CRP_confirm":
					BrowserExt.Beep(0);
					BrowserExt.SetScreenChange("allservice");
					break;
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id){
				case BrowserExt.keyCode.FX_VK_PAUSE:
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