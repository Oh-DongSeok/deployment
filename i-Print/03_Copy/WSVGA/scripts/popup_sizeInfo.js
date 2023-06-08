/**
 * 원고 사이즈 취득용 가상 페이지
 */
var SizeInfoPopup = new TemplatePage();

SizeInfoPopup.ID = "pop_sizeInfoPopup";

/**
 * 개별 페이지의 Data정의
 */
SizeInfoPopup._initModel = function(){
	this._data=
	{
		buttonList:[],
		imageList:[],//{id:"img_progressing",src:Img.BG.PROGRESSING}],
		textList:[]
	};
};

SizeInfoPopup._onPageChange = function(){
	//var className = "pattern-background";
	//var pageObj = document.getElementById(SizeInfoPopup.ID);
	//if(pageObj && pageObj.classList && !pageObj.classList.contains(className)) pageObj.classList.add(className);
	
	this.updateDisplay();
	//clearMainDisplay();
	//Common.startJobFound();
	/*
	if(!glb_debug_mode){
		SystemEventLib.AddNotify("CstmSvcDispEvent", SizeInfoPopup.CstmSvcDispEventCb);
	}
	else{
		if(glbConfig.chkMailBoxJobFlg){
			getStoredDocument();
		}
		else{
			this.sendRequest(this.setSizeInfo);
		}
	}*/
};
/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
SizeInfoPopup.updateDisplay = function(){
	KISUtil.debug("function:","updateDisplay");
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
SizeInfoPopup.EventHandler = function(event, id)
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
SizeInfoPopup.CstmSvcDispEventCb = function(){
    if(arguments[1]){
    	Common.startJobFound();
    	SystemEventLib.RemoveNotify("CstmSvcDispEvent");
    }
};