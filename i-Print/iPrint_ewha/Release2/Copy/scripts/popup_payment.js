/**
 * @fileoverview 결제대기중 팝업
 * @author FXKIS leejw
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 결제대기중 팝업
 */
var PaymentPopup = new TemplatePage();

PaymentPopup.ID = "pop_paymentPopup";

/**
 * 개별 페이지의 Data정의
 */
PaymentPopup._initModel=function()
{
	this._data=
	{
		buttonList:[],
		imageList:[],//{id:"img_progressing_pay",src:Img.BG.PROGRESSING}],
		textList:[]
	};
};

PaymentPopup._onPageChange = function(){
	KISUtil.debug("PaymentPopup._onPageChange:","excute");
	//var className = "pattern-background";
	//var pageObj = document.getElementById(PaymentPopup.ID);
	//if(pageObj && pageObj.classList && !pageObj.classList.contains(className)) pageObj.classList.add(className);
	
	this.updateDisplay();
};
/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
PaymentPopup.updateDisplay=function(){
	//Common.setImage("pop_paymentPopup",Img.BG.PAYMENT);
	if(glbChargeInit && glbChargeInit.paymentMethods == 'typeA'){ //2016.05.12 chone 신용/교통 카드 결제 요청 문구 추가
		Common.setText("lbl_requestCardPayment", Msg.Page.PaymentPopup.lblRequestCardPayment);
	}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
PaymentPopup.EventHandler = function(event, id)
{
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
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

