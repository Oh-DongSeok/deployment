/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/黄色）
 */
var ChargeInfoPopup = new TemplatePage();

ChargeInfoPopup.ID = "pop_chargeInfoPopup";

ChargeInfoPopup.timer = CONFIG.ENV.TIMEOUTS.CHARGEINFO;
ChargeInfoPopup.count = CONFIG.ENV.COUNTER.CHARGEINFO;
ChargeInfoPopup.isGetChargeInfo = false;
ChargeInfoPopup.isCardLogIn = false;

/**
 * 개별 페이지의 Data정의
 */
ChargeInfoPopup._initModel=function()
{
	this._data = {
		buttonList:[			
			{id:"btn_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_confirm",offImg: Img.BTN_NOR_OFF,onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
			{id:"btn_DP_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_DP_confirm",offImg: Img.BTN_NOR_OFF,onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
			{id:"btn_CP_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_CP_confirm",offImg: Img.BTN_NOR_OFF,onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
			{id:"btn_DP_CP_cancel", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_DP_CP_cancel",offImg: Img.BTN_NOR_OFF,onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}}
		],
		imageList:[
		          //{id:"img_card_reader_charge",src:Img.BG.CARD_READER}
		],
		textList:[
				/*{id:"tit_CP_outputMediumSize", text:Msg.Page.ChargeInfoPopup.oms},
				{id:"tit_CP_colorMode", text:Msg.Page.ChargeInfoPopup.colorMode},
				{id:"tit_CP_pages", text:Msg.Page.ChargeInfoPopup.pages},
				{id:"tit_CP_outplex", text:Msg.Page.ChargeInfoPopup.outplex},*/
				{id:"tit_CP_joblist", text:Msg.Page.ChargeInfoPopup.joblist},
				/*{id:"tit_CP_unitPrice", text:Msg.Page.ChargeInfoPopup.unitPrice},*/
				/*{id:"tit_CP_copies", text:Msg.Page.ChargeInfoPopup.copies},*/
				{id:"tit_CP_totalPrice", text:Msg.Page.ChargeInfoPopup.totalPrice},
				{id:"lbl_confirm",text:Msg.Page.ChargeInfoPopup.btnConfirm},
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
	switch(glbInfo.lang){
		case "ja":
			Common.setPosition("lbl_DP_confirm", "top", "5px");//2016.05.25 chone 다언어대응
			document.getElementById("lbl_DP_confirm").style.lineHeight = '25px';//2016.05.25 chone 다언어대응
			Common.setPosition("tit_CP_totalPrice","width","140px");//2016.05.25 chone 다언어대응
			break;
		case "en":
			Common.setPosition("lbl_DP_confirm", "top", "6px");//2016.05.25 chone 다언어대응
			document.getElementById("lbl_DP_confirm").style.lineHeight = '25px';//2016.05.25 chone 다언어대응
			break;
		case "ko":
			Common.setPosition("tit_CP_joblist","width","180px");
			break;
		default:
			break;
	}
}

ChargeInfoPopup._onPageChange = function(){
	KISUtil.debug("ChargeInfoPopup.sendRequest:","excute");
	//var className = "pattern-background";
	//var pageObj = document.getElementById(ChargeInfoPopup.ID);
	//if(pageObj && pageObj.classList && !pageObj.classList.contains(className)) pageObj.classList.add(className);
	var _lst = FileListPage.docListManager.getCheckedItems();
	var info = this._dataSet.priceInfo;
	var lst = [
		/*{id:"lbl_CP_outputMediumSize", text:info.oms},
		{id:"lbl_CP_colorMode", text:info.colorMode},
		{id:"lbl_CP_pages", text:info.pages},
		{id:"lbl_CP_outplex", text:info.outplex},
		{id:"lbl_CP_unitPrice", text:info.unitPrice+" "+Msg.UNIT.WON},
		{id:"lbl_CP_copies", text:info.copies},*/
		{id:"lbl_CP_joblist", text:_lst.length+" "+Msg.UNIT.COUNT},
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
	WidgetLib.setWidgetStatus("btn_FL_Print",{enable:true});		//버튼 활성화
	switch(glbConfig.paymentType.toLowerCase()){
		case PAYMENT_TYPE.BEFORE:
			Common.changeVisibility('btn_confirm','block');
			Common.setPosition("btn_DP_CP_cancel","right","100px");
			Common.changeVisibility('btn_DP_confirm','none');
			Common.changeVisibility('btn_CP_confirm','none');
			Common.changeVisibility('txt_CP_msg0','none');
			Common.changeVisibility('txt_CP_msg1','none');
			break;
		case PAYMENT_TYPE.AFTER:
			Common.changeVisibility('btn_confirm','none');
			var p_glbConfig = window.parent["glbConfig"];
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
			break;
		default:
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_ENV};
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
	}
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
				case "btn_confirm"://선결제 확인버튼
					var _lst = FileListPage.docListManager.getCheckedItems();
					Common.doCharge(PAYMENT_METHOD.PREPAID,_lst);
					PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
					break;
				case "btn_DP_confirm"://직과금 결제 확인
					BrowserExt.Beep(0);
					var _lst = FileListPage.docListManager.getCheckedItems();
					Common.doCharge(PAYMENT_METHOD.CREDIT,_lst);
					PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
					break;
				case "btn_CP_confirm"://Cyber 결제 확인
					BrowserExt.Beep(0);
					var _lst = FileListPage.docListManager.getCheckedItems();
					Common.doCharge(PAYMENT_METHOD.CYBER_MONEY,_lst);
					PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
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