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
		imageList:[],
		textList:[]
	};
};

PaymentPopup._onPageChange = function()
{
	KISUtil.debug("PaymentPopup._onPageChange:","excute");
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
PaymentPopup.updateDisplay=function()
{
	if(glbChargeInit && glbChargeInit.paymentMethods == 'typeA'){
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
			switch(id){
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