/**
 * 개별 페이지의 표시 및 동작용
 * 인증전 대기화면 표시용
 */
var WaitingPage = new TemplatePage();

WaitingPage.ID = "page_waiting";

/**
 * 개별 페이지의 Data정의
 */
WaitingPage._initModel = function(){
	this._data=
	{
		buttonList:[],
		imageList:[],
		textList:[]
	};
};

WaitingPage._onLoadEvent = function(){
	KISUtil.debug("function:","_onLoadEvent");
};
/**
 * 개별 페이지의 초기화
 */
WaitingPage._onPageChange = function(){
	KISUtil.debug("function:","_onPageChange");
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
WaitingPage.updateDisplay = function(){
	KISUtil.debug("function:","updateDisplay");
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
WaitingPage.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler","event:"+event+"/id:"+id);
	switch(event){
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