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
		case "GetTrayInfo":
			if(arguments[1]){
				//Common.setTrayInfo(arguments[2]);
				PageManager.changePage(MainPage, PageManager.type.NORMAL);
				MainPage.setTrayPulldownA4();//2016.09.30 KIS Chone 기동시 상위 Tray의 A4를 Default치로 선택 refs #4069
				//메뉴로 이벤트 송신(컨텐츠 표시를 위해)
				//window.parent["_onIframeLoadEvent"]();
				var iframes = window.parent.document.getElementsByTagName("iframe");
				if(iframes.length>0){
					//var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
					//evt.initCustomEvent('readyToDisplay', false, false, null);
					//iframes[0].dispatchEvent(evt);
					excuteToParent("ServiceManager.displayIframe", null);
				}
				//$(window.parent.document).find("iframe").eq(0).trigger("readyToDisplay");
			}else{
				KISUtil.Debug("GetTrayInfo", "failed");
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