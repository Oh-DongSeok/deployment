/**
 * @fileoverview : 에러 팝업
 * @author FXKIS son.ch
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/적색）
 */
var ErrorPopup = new TemplatePage();

ErrorPopup.ID = "pop_errorPopup";
ErrorPopup._param = "";
ErrorPopup.msgRows = 11;

/**
 * 개별 페이지의 Data정의
 */
ErrorPopup._initModel=function()
{
	this._data=
	{
		buttonList:[
			{id:"btn_EP_close", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_close",offImg: Img.UIPARTS.BTN_SML_OFF,onImg:Img.UIPARTS.BTN_SML_ON, pressImg: Img.UIPARTS.BTN_SML_PRESS, disableImg: Img.UIPARTS.BTN_SML_DIS}}
		],
		imageList:[
		],
		textList:[
			{id:"lbl_EP_close",text:Msg.Page.ErrorPopup.btnClose},
			{id:"lbl_EP_title",text:Msg.Page.ErrorPopup.title}
		]
	};
};


ErrorPopup._onPageChange = function(){
	this.updateDisplay();
};
/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
ErrorPopup.updateDisplay=function(){
	BrowserExt.Beep(1);
	var tmp, _msg = this._param.message;
	var _errorCode = this._param.errorCode;
	if(_msg){
		var il=_msg.length;
		for(var i=0; i<this.msgRows||11; i++){
			Common.setText("txt_CEP_msg"+i,_msg[i]);
		}
	}
	if(_errorCode){
		Common.setText("lbl_CEP_code", _errorCode);
	}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
ErrorPopup.EventHandler = function(event, id)
{
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_EP_close":
					BrowserExt.Beep(0);
					if(this._param){
						if(this._param.type==="logout"){				//TODO 확인필요
							SSMILib.LogoutDev();
							BrowserExt.SetScreenChange("allservice");
							return;
						}				
						else if(this._param.targetPage)	//직전페이지로 돌려보내기
						{
							PageManager.changePage(PageManager.prevPage, PageManager.type.CANCEL);
						}
						if(SecureManager){//서비스로 상위에 메뉴가 존재할 경우
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