/**
 * 원고 사이즈 취득용 가상 페이지
 */
var ProcessingPopup = new TemplatePage();

ProcessingPopup.ID = "pop_processingPopup";

/**
 * 개별 페이지의 Data정의
 */
ProcessingPopup._initModel = function(){
	this._data=
	{
		buttonList:[],
		imageList:[],//{id:"img_progressing",src:Img.BG.PROGRESSING}],
		textList:[]
	};
};

ProcessingPopup._onPageChange = function(){
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
ProcessingPopup.updateDisplay = function(){
	KISUtil.debug("function:","updateDisplay");
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
ProcessingPopup.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler","event:"+event+"/id:"+id);
	switch(event){
		case "onbuttonup":
			break;
		case "onhardkeydown":
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

/**
 * カスタム・サービス画面表示有無の検知した後の処理
 */
ProcessingPopup.CstmSvcDispEventCb = function(){
    if(arguments[1]){
    	Common.startJobFound();
    	SystemEventLib.RemoveNotify("CstmSvcDispEvent");
    }
};