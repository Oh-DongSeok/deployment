/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/黄色）
 */
var ChargeInfoPopup = new TemplatePage();

ChargeInfoPopup.ID = "pop_chargeInfoPopup";

ChargeInfoPopup.timer = CONFIG.ENV.TIMEOUTS.CHARGEINFO;
ChargeInfoPopup.isGetChargeInfo = false;
ChargeInfoPopup.isCardLogIn = false;

/**
 * 개별 페이지의 Data정의
 */
ChargeInfoPopup._initModel=function()
{
	this._data = {
		buttonList:[			
			{id:"btn_DP_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_DP_confirm",offImg: Img.UIPARTS.BTN_NOR_OFF,onImg:Img.UIPARTS.BTN_NOR_ON, pressImg: Img.UIPARTS.BTN_NOR_PRESS, disableImg: Img.UIPARTS.BTN_NOR_DIS}},
			{id:"btn_CP_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_CP_confirm",offImg: Img.UIPARTS.BTN_NOR_OFF,onImg:Img.UIPARTS.BTN_NOR_ON, pressImg: Img.UIPARTS.BTN_NOR_PRESS, disableImg: Img.UIPARTS.BTN_NOR_DIS}},
			{id:"btn_DP_CP_cancel", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_DP_CP_cancel",offImg: Img.UIPARTS.BTN_NOR_OFF,onImg:Img.UIPARTS.BTN_NOR_ON, pressImg: Img.UIPARTS.BTN_NOR_PRESS, disableImg: Img.UIPARTS.BTN_NOR_DIS}}
		],
		imageList:[
		    
		],
		textList:[
			{id:"tit_CP_unitPrice", text:Msg.Page.ChargeInfoPopup.unitPrice},
			{id:"tit_CP_totalPrice", text:Msg.Page.ChargeInfoPopup.totalPrice},
			{id:"lbl_DP_confirm",text:Msg.Page.ChargeInfoPopup.btnDirectConfirm},
			{id:"lbl_CP_confirm",text:Msg.Page.ChargeInfoPopup.btnCyberConfirm},
			{id:"lbl_DP_CP_cancel",text:Msg.Page.ChargeInfoPopup.btnCancel},
		]
	};
};

ChargeInfoPopup.cssChange = function()
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

ChargeInfoPopup._onPageChange = function()
{
	KISUtil.debug("ChargeInfoPopup.sendRequest:", "excute");
	
	var info = this._dataSet.priceInfo;
	var lst = [
		{id:"lbl_CP_unitPrice", text:formatWithRemainders(info.unitPrice)+" "+ Msg.UNIT.WON},
		{id:"lbl_CP_totalPrice", text:formatWithRemainders(info.totalPrice)+" "+ Msg.UNIT.WON}];
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
ChargeInfoPopup.updateDisplay = function()
{
	BrowserExt.Beep(0);
	var p_glbConfig = window.parent["glbConfig"];

	//교통결제 버튼 표시/비표시에 따른 위치지정
	if(p_glbConfig.isCreditPayment&&p_glbConfig.isIMoneyPayment){return;}
	if((!p_glbConfig.isCreditPayment&&!p_glbConfig.isIMoneyPayment)
		||(!p_glbConfig.isCreditPayment&&p_glbConfig.isIMoneyPayment)){//i-Money결제,교통/신용 결제가 둘다 false일 경우, 강제적으로 i-Money결제 버튼을 표시
		Common.changeVisibility('btn_DP_confirm','none');
		Common.setPosition("btn_CP_confirm","left","100px");
		Common.changeVisibility('txt_CP_msg0','none');
		Common.changeVisibility('txt_CP_msg1','none');
	}else if(p_glbConfig.isCreditPayment&&!p_glbConfig.isIMoneyPayment){
		Common.changeVisibility('btn_CP_confirm','none');
		Common.setPosition("btn_DP_confirm","left","100px");
	}

	Common.setPosition("btn_DP_CP_cancel","right","100px");
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
ChargeInfoPopup.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id){
				case "btn_DP_confirm"://직과금 결제 확인
					BrowserExt.Beep(0);
					Common.doCharge(PAYMENT_METHOD.CREDIT);
					PageManager.changePage(PaymentPopup , PageManager.type.CONFIRM);
					break;
				case "btn_CP_confirm"://Cyber 결제 확인
					BrowserExt.Beep(0);
					Common.doCharge(PAYMENT_METHOD.CYBER_MONEY);
					PageManager.changePage(PaymentPopup , PageManager.type.CONFIRM);
					break;
				case "btn_DP_CP_cancel":
					BrowserExt.Beep(0);
					excuteToParent("ServiceManager.refreshService");		//서비스 재시작
					break;
				default:
					BrowserExt.Beep(1);
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