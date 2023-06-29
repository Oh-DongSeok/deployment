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
			//{id:"btn_WP_close",	type:WidgetLib.ButtonType.NORMAL,	attr:{offImg:"", pressImg:""}	},
			{id:"btn_WP_close",	type:WidgetLib.ButtonType.NORMAL,	attr:{	targetImgId:"img_WP_close",	offImg:Img["BTN_ERROR_OFF"], pressImg:Img["BTN_ERROR_PRESS"]}	},
		],
		imageList:[
			//{id:"img_WP_bg",	src:Img["IMG_POPUP_WARN_BG"]}
		],
		textList:[
			//{id	:	"lbl_WP_popup",	text:	Msg.DateFormatPopup.lbl_WP_popup	},	//동적할당
			//{id	:	"lbl_WP_cancel",	text:	Msg.Common.lbl_POPUP_cancel	},	//동적할당
			{id:"lbl_WP_close",text:Msg_lang[glbConfig.language[glbConfig.langCount]].Common.lbl_POPUP_cancel},
			{id:"lbl_WP_title",text:Msg_lang[glbConfig.language[glbConfig.langCount]].WarnPopup.title}
		]
	};
};

WarnPopup._onPageChange = function(){
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
WarnPopup.updateDisplay = function()
{
	BrowserExt.Beep(1);
	//KISUtil.debug("warnPopup message",this._param.message);
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
							SSMILib.LogoutDev();
							BrowserExt.SetScreenChange("allservice");
							return;
						}				
						else if(this._param.targetPage)	//직전페이지로 돌려보내기
						{
							//PageManager.changePage(PageManager.prevPage, PageManager.type.NORMAL);
							PageManager.changePage(PageManager.prevPage, PageManager.type.CANCEL);
						}
						else{
							BrowserExt.SetScreenChange("allservice");
						}
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
				case BrowserExt.keyCode.FX_VK_CLEAR:
					if(this._message.targetPage)
					{
						//Reset Key
						BrowserExt.Beep(0);
						BrowserExt.SetScreenChange("allservice");
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
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