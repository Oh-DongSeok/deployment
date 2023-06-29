/**
 * @fileoverview 프린트중 팝업
 * @author FXKIS son.ch
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var ConfirmPopup = new TemplatePage();

ConfirmPopup.ID = "pop_confirm";
ConfirmPopup.pageType = "Special";
ConfirmPopup.key = "";	//메시지 영역 구분자

/**
 * 개별 페이지의 Data정의
 */
ConfirmPopup._initModel=function()
{
	this._data=
	{
		buttonList:[
			{id:"btn_CF_confirm", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_CF_confirm", offImg: Img.ICON.ICN_CF_CONFIRM_OFF, pressImg: Img.ICON.ICN_CF_CONFIRM_PRESS}},
			{id:"btn_CF_cancel", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_CF_cancel", offImg: Img.ICON.ICN_CF_CANCEL_OFF, disableImg: Img.ICON.ICN_CF_CANCEL_PRESS}},
		],
		imageList:[
			//{id:"img_CF_BG", src:Img.BG.IMG_CF_BG}
		],
		textList:[
			{id	:	"lbl_CF_Guide",	text:	""},
			{id	:	"lbl_CF_confirm",	text:	Msg.Page.CONFIRM.BTN_CONFIRM},
			{id	:	"lbl_CF_cancel",	text:	Msg.Page.CONFIRM.BTN_CANCEL},
		]
	};
};

ConfirmPopup._onPageChange = function(){
	if(this.msg) {
		var obj={id:"lbl_CF_Guide",text:this.msg};
		Common.setText(obj.id,obj.text);
	}
};
/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
ConfirmPopup.updateDisplay=function(){
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
ConfirmPopup.EventHandler = function(event, id)
{
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_CF_confirm":
					BrowserExt.Beep(0);
					switch(this.popupType){
						case "SERVICE_SELECT":
							excuteToParent("ServiceManager.removeService");
						break;
						case "LOGOUT":
							excuteToParent("Common.LogOut",[true]);
						break;
						default:
							KISUtil.debug("ConfirmPopup/"+id+"/"+this.popupType);
						break;
					}
					break;
				case "btn_CF_cancel":
					BrowserExt.Beep(0);
					PageManager.changePage(PageManager.getPrevPage(),PageManager.type.ROLLBACK);
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