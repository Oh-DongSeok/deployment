/**
 * 개별 페이지의 표시 및 동작용
 * 인증전 대기화면 표시용
 */
var WaitingPage = new TemplatePage();

WaitingPage.ID = "page_waiting";
WaitingPage.pageType = "Special";

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

WaitingPage._onPageChange = function(){
	this.updateDisplay();
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
		case "onbuttonup":
			MessageManager.clearMessageArea();
			BrowserExt.Beep(0);
			switch(id)
			{
				default:
					//clearMessageAreaTimer();
					break;
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id)
			{
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
			break;
	}
};