/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/黄色）
 */
var WarnPopup = new TemplatePage();

WarnPopup.ID = "pop_warnPopup";
WarnPopup.pageType = "Special";
WarnPopup._param = "";
WarnPopup.msgRows = 11;

/**
 * 개별 페이지의 Data정의
 */
WarnPopup._initModel=function()
{
	this._data = {
		buttonList:[
			{id:"btn_WP_close", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_WP_close", offImg:Img.UIPARTS.BTN_SML_OFF, onImg:Img.UIPARTS.BTN_SML_ON, pressImg:Img.UIPARTS.BTN_SML_PRESS, disableImg:Img.UIPARTS.BTN_SML_DIS}}
		],
		imageList:[
		],
		textList:[
			{id:"lbl_WP_close",text:Msg.Page.WarnPopup.btnClose},
			{id:"lbl_WP_title",text:Msg.Page.WarnPopup.title}
		]
	};
};

WarnPopup._onPageChange = function(){
	//SystemEventLib.AddNotify("CstmSvcDispEvent", WarnPopup.CstmSvcDispEventCb);
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
WarnPopup.updateDisplay = function()
{
	BrowserExt.Beep(1);
	KISUtil.debug("warnPopup message",this._param.message);
	var tmp,_msg = this._param.message;
	var _errorCode = this._param.errorCode;
	if(_msg){
		var il=_msg.length;
		for(var i=0; i<(this.msgRows||11); i++){
			Common.setText("txt_WP_msg"+i,_msg[i]||"");
		}
	}
	if(_errorCode){
		Common.setText("lbl_WP_code", _errorCode);
	}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
WarnPopup.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_WP_close":
					BrowserExt.Beep(0);
					if(this._param){
						if(this._param.type==="logout"){
							//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
							if(this._param.detail == "refund"){
								WidgetLib.setWidgetStatus("btn_WP_close", {enable:false});//2017.02.02 FXKIS 카피 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
								Common.doCopyRefundReq();
								return;
							}

							SSMILib.LogoutDev();
							BrowserExt.SetScreenChange("allservice");
							return;
						}
						else if(this._param.targetPage)	//직전페이지로 돌려보내기
						{
							//PageManager.changePage(PageManager.prevPage, PageManager.type.NORMAL);
							PageManager.changePage(PageManager.prevPage, PageManager.type.CANCEL);
						}
						else if(SecureManager){//서비스로 상위에 메뉴가 존재할 경우
							excuteToParent("ServiceManager.removeService", null);
						}
						else{
							BrowserExt.SetScreenChange("allservice");
						}
					}
					else if(SecureManager){//서비스로 상위에 메뉴가 존재할 경우
						excuteToParent("ServiceManager.removeService", null);
					}
					else{
						BrowserExt.SetScreenChange("allservice");
					}
					break;
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		case "onbuttondown":
			MessageManager.clearMessageArea();
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

WarnPopup.CstmSvcDispEventCb = function(e){
	//SystemEventLib.RemoveNotify("CstmSvcDispEvent");
	//BrowserExt.SetScreenChange("allservice");
};