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
		          //{id:"img_card_reader_charge",src:Img.BG.CARD_READER}
		],
		textList:[
				{id:"tit_CP_outputMediumSize", text:Msg.Page.ChargeInfoPopup.oms},
				{id:"tit_CP_colorMode", text:Msg.Page.ChargeInfoPopup.colorMode},
				{id:"tit_CP_pages", text:Msg.Page.ChargeInfoPopup.pages},
				{id:"tit_CP_outplex", text:Msg.Page.ChargeInfoPopup.outplex},
				{id:"tit_CP_unitPrice", text:Msg.Page.ChargeInfoPopup.unitPrice},
				{id:"tit_CP_copiesPrice", text:Msg.Page.ChargeInfoPopup.copiesPrice},
				{id:"tit_CP_copies", text:Msg.Page.ChargeInfoPopup.copies},
				{id:"tit_CP_totalPrice", text:Msg.Page.ChargeInfoPopup.totalPrice},
				{id:"lbl_DP_confirm",text:Msg.Page.ChargeInfoPopup.btnDirectConfirm},
				{id:"lbl_CP_confirm",text:Msg.Page.ChargeInfoPopup.btnCyberConfirm},
				{id:"lbl_DP_CP_cancel",text:Msg.Page.ChargeInfoPopup.btnCancel},
				{id:"txt_CP_msg0",text:Msg.Page.ChargeInfoPopup.msg1},
				{id:"txt_CP_msg1",text:Msg.Page.ChargeInfoPopup.msg2}
		]
		
	};
};

//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
ChargeInfoPopup.cssChange = function()
{
	//2016.05.25 chone 다언어대응 start
	switch(glbInfo.lang){
		case "ja":
			Common.setPosition("tit_CP_outputMediumSize", "left", "100px");
			Common.setPosition("tit_CP_outputMediumSize", "width", "210px");
			Common.setPosition("tit_CP_colorMode", "left", "100px");
			Common.setPosition("lbl_CP_colorMode", "left", "188px");
			Common.setPosition("tit_CP_unitPrice", "left", "100px");
			Common.setPosition("lbl_CP_unitPrice", "left", "235px");
			Common.setPosition("tit_CP_copies", "left", "100px");
			Common.setPosition("lbl_CP_copies", "left", "165px");
			Common.setPosition("tit_CP_pages", "left", "425px");
			Common.setPosition("tit_CP_pages", "width", "210px");
			Common.setPosition("lbl_CP_pages", "left", "585px");
			Common.setPosition("tit_CP_outplex", "left", "425px");
			Common.setPosition("lbl_CP_outplex", "left", "561px");
			Common.setPosition("lbl_CP_outplex", "width", "180px");
			Common.setPosition("tit_CP_copiesPrice", "left", "425px");
			Common.setPosition("tit_CP_copiesPrice", "width", "230px");
			Common.setPosition("lbl_CP_copiesPrice", "left", "655px");
			Common.setPosition("tit_CP_totalPrice", "left", "425px");
			Common.setPosition("tit_CP_totalPrice", "width", "190px");
			Common.setPosition("lbl_CP_totalPrice", "left", "609px");
			Common.setPosition("lbl_DP_confirm", "top", "5px");
			document.getElementById("lbl_DP_confirm").style.lineHeight = '25px';
			break;
		case "ch":
			Common.setPosition("tit_CP_outputMediumSize", "left", "100px");
			Common.setPosition("lbl_CP_outputMediumSize", "left", "263px");
			Common.setPosition("tit_CP_colorMode", "left", "100px");
			Common.setPosition("lbl_CP_colorMode", "left", "213px");
			Common.setPosition("tit_CP_unitPrice", "left", "100px");
			Common.setPosition("lbl_CP_unitPrice", "left", "213px");
			Common.setPosition("tit_CP_copies", "left", "100px");
			Common.setPosition("lbl_CP_copies", "left", "213px");
			Common.setPosition("tit_CP_pages", "left", "425px");
			Common.setPosition("tit_CP_pages", "width", "210px");
			Common.setPosition("lbl_CP_pages", "left", "608px");
			Common.setPosition("tit_CP_outplex", "left", "425px");
			Common.setPosition("lbl_CP_outplex", "left", "540px");
			Common.setPosition("lbl_CP_outplex", "width", "180px");
			Common.setPosition("tit_CP_copiesPrice", "left", "425px");
			Common.setPosition("lbl_CP_copiesPrice", "left", "560px");
			Common.setPosition("tit_CP_totalPrice", "left", "425px");
			Common.setPosition("lbl_CP_totalPrice", "left", "537px");
			break;
		case "en":
			Common.setPosition("tit_CP_outputMediumSize", "left", "40px");
			Common.setPosition("tit_CP_outputMediumSize", "width", "210px");
			Common.setPosition("lbl_CP_outputMediumSize", "left", "255px");
			Common.setPosition("tit_CP_colorMode", "left", "40px");
			Common.setPosition("tit_CP_colorMode", "width", "150px");
			Common.setPosition("lbl_CP_colorMode", "left", "193px");
			Common.setPosition("tit_CP_unitPrice", "left", "40px");
			Common.setPosition("lbl_CP_unitPrice", "left", "170px");
			Common.setPosition("tit_CP_copies", "left", "40px");
			Common.setPosition("tit_CP_copies", "width", "205px");
			Common.setPosition("lbl_CP_copies", "left", "255px");
			Common.setPosition("lbl_CP_copies", "width", "167px");
			document.getElementById("lbl_CP_copies").style.lineHeight = '25px';
			Common.setPosition("tit_CP_pages", "left", "445px");
			Common.setPosition("tit_CP_pages", "width", "210px");
			document.getElementById("tit_CP_pages").style.lineHeight = '25px';
			Common.setPosition("lbl_CP_pages", "left", "665px");
			Common.setPosition("tit_CP_outplex", "left", "445px");
			Common.setPosition("lbl_CP_outplex", "left", "593px");
			Common.setPosition("tit_CP_copiesPrice", "top", "180px");
			document.getElementById("tit_CP_copiesPrice").style.lineHeight = '25px';
			Common.setPosition("tit_CP_copiesPrice", "left", "445px");
			Common.setPosition("lbl_CP_copiesPrice", "left", "557px");
			Common.setPosition("lbl_CP_copiesPrice", "top", "180px");
			Common.setPosition("tit_CP_totalPrice", "left", "445px");
			document.getElementById("tit_CP_totalPrice").style.lineHeight = '25px';
			Common.setPosition("lbl_CP_totalPrice", "left", "557px");
			Common.setPosition("lbl_CP_msg", "top", "257px");
			Common.setPosition("lbl_DP_confirm", "top", "6px");
			document.getElementById("lbl_DP_confirm").style.lineHeight = '25px';
			break;
		default:
			break;
	}
	//2016.05.25 chone 다언어대응 end
};

ChargeInfoPopup._onPageChange = function(){
	KISUtil.debug("ChargeInfoPopup.sendRequest:","excute");
	//var className = "pattern-background";
	//var pageObj = document.getElementById(ChargeInfoPopup.ID);
	//if(pageObj && pageObj.classList && !pageObj.classList.contains(className)) pageObj.classList.add(className);
	
	if(glbInfo.lang == "en"){//2016.05.26 chone 다언어대응 - 영어 양면의 경우 대응
		Common.addClass("lbl_CP_outplex", "en");
	}

	var info = this._dataSet.priceInfo;
	var lst = [{id:"lbl_CP_outputMediumSize", text:info.oms},
		{id:"lbl_CP_colorMode", text:info.colorMode},
		{id:"lbl_CP_pages", text:info.pages},
		{id:"lbl_CP_outplex", text:info.outplex},
		{id:"lbl_CP_unitPrice", text:formatWithRemainders(info.unitPrice)+" "+Msg.UNIT.WON},
		{id:"lbl_CP_copiesPrice", text:formatWithRemainders(info.copiesPrice)+" "+Msg.UNIT.WON},
		{id:"lbl_CP_copies", text:info.copies},
		{id:"lbl_CP_totalPrice", text:formatWithRemainders(info.totalPrice)+" "+Msg.UNIT.WON}];
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
	//Common.sendRequestCardLogIn(Common.getCardLogIn);
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
			switch(id)
			{
				case "btn_DP_confirm"://직과금 결제 확인
					BrowserExt.Beep(0);
					Common.doCharge(PAYMENT_METHOD.CREDIT);
					PageManager.changePage( PaymentPopup , PageManager.type.CONFIRM);
					break;
				case "btn_CP_confirm"://Cyber 결제 확인
					BrowserExt.Beep(0);
					Common.doCharge(PAYMENT_METHOD.CYBER_MONEY);
					PageManager.changePage( PaymentPopup , PageManager.type.CONFIRM);
					break;
				case "btn_DP_CP_cancel":
					//window.location.reload(true);
					//window.parent.ServiceManager.refreshService();
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
			switch(id)
			{
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