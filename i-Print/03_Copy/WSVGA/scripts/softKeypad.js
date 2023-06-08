/**
 * @fileoverview 9th UI에 필요한 Soft Key Pad의 구성 및 동작 구현
 * @author FXKIS dongseok.oh
 * @version 1.0.0
 */

var SoftKeypad = {
	/**
	 * SoftKeypadのバージョンを表す
	 * @constant
	 * @type String
	 * @lang ja
	 */
	version : "1.0.0"
};
 
SoftKeypad.initKeypad = function(body_ID){
	createSoftKeypadHtml();
	SoftKeypad.initData();
	
}
 
/**
 * Soft core keypad용 HTML Tag생성
 */
function createSoftKeypadHtml()
{
	var body =document.body;

	var sideSoftKeypad = document.createElement("div");
	sideSoftKeypad.setAttribute("id", "soft_core_keypad");
	sideSoftKeypad.setAttribute("class", "side");

	body.appendChild(sideSoftKeypad);

	// Background Image
	var _img = document.createElement("img");
	_img.setAttribute("id", "img_Key_bg");
	_img.setAttribute("class", "img");
	sideSoftKeypad.appendChild(_img);

	// 인증키
	var authKey = document.createElement("div");
	authKey.setAttribute("id", "btn_auth_key");
	authKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_auth_key");
	_img.setAttribute("class", "img");
	authKey.appendChild(_img);
	sideSoftKeypad.appendChild(authKey);
	
	
	// 숫자키
	for(var i=0; i<10; i++){
		var numKey = document.createElement("div");
		numKey.setAttribute("id", "btn_num_key" + i);
		numKey.setAttribute("class", "btn");
		_img = document.createElement("img");
		_img.setAttribute("id", "img_num_key" + i);
		_img.setAttribute("class", "img");
		numKey.appendChild(_img);
		sideSoftKeypad.appendChild(numKey);
	}

	// * 키
	var mulKey = document.createElement("div");
	mulKey.setAttribute("id", "btn_mul_key");
	mulKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_mul_key");
	_img.setAttribute("class", "img");
	mulKey.appendChild(_img);
	sideSoftKeypad.appendChild(mulKey); 

	// # 키
	var sharpKey = document.createElement("div");
	sharpKey.setAttribute("id", "btn_sharp_key");
	sharpKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_sharp_key");
	_img.setAttribute("class", "img");
	sharpKey.appendChild(_img);
	sideSoftKeypad.appendChild(sharpKey); 

	// Pause 키
	var pauseKey = document.createElement("div");
	pauseKey.setAttribute("id", "btn_pause_key");
	pauseKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_pause_key");
	_img.setAttribute("class", "img");
	pauseKey.appendChild(_img);
	sideSoftKeypad.appendChild(pauseKey); 

	// 복귀 키
	var comebackKey = document.createElement("div");
	comebackKey.setAttribute("id", "btn_comeback_key");
	comebackKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_comeback_key");
	_img.setAttribute("class", "img");
	comebackKey.appendChild(_img);
	sideSoftKeypad.appendChild(comebackKey); 

	// 단축 키
	var shortenKey = document.createElement("div");
	shortenKey.setAttribute("id", "btn_shorten_key");
	shortenKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_shorten_key");
	_img.setAttribute("class", "img");
	shortenKey.appendChild(_img);
	sideSoftKeypad.appendChild(shortenKey);
	
	// 재설정(Menu) 키
	var menuKey = document.createElement("div");
	menuKey.setAttribute("id", "btn_menu_key");
	menuKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_menu_key");
	_img.setAttribute("class", "img");
	menuKey.appendChild(_img);
	sideSoftKeypad.appendChild(menuKey); 

	// 정지 키
	var stopKey = document.createElement("div");
	stopKey.setAttribute("id", "btn_stop_key");
	stopKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_stop_key");
	_img.setAttribute("class", "img");
	stopKey.appendChild(_img);
	sideSoftKeypad.appendChild(stopKey); 

	// 시작 키
	var startKey = document.createElement("div");
	startKey.setAttribute("id", "btn_start_key");
	startKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_start_key");
	_img.setAttribute("class", "img");
	startKey.appendChild(_img);
	sideSoftKeypad.appendChild(startKey);
}

SoftKeypad.initData = function(body_ID)
{
	//Common.setImage("img_Key_bg",Img.IMG_SOFT_CORE_KEYPAD_BG);
	
	//var temp = attr:{targetImgId:"img_auth_key",offImg:, pressImg: Img.BTN_SCK_AUTH_PRESS};
	var attr = {targetImgId:"img_auth_key", offImg:Img.BTN_SCK_AUTH_OFF, pressImg:Img.BTN_SCK_AUTH_PRESS};

	WidgetLib.registerButtonWidgetById("btn_auth_key", WidgetLib.ButtonType.NORMAL, attr);
	
	for(var i=0; i<10; i++){
		attr.targetImgId = "img_num_key" + i;
		attr.offImg = "./image/btn_num_key" + i + "_off.png";
		attr.pressImg = Img.BTN_SCK_NUM_PRESS;
		WidgetLib.registerButtonWidgetById("btn_num_key"+i, WidgetLib.ButtonType.NORMAL, attr);
	}
	
	attr = {targetImgId:"img_mul_key", offImg:Img.BTN_SCK_MUL_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_mul_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_sharp_key", offImg:Img.BTN_SCK_SHARP_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_sharp_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_pause_key", offImg:Img.BTN_SCK_PAUSE_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_pause_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_comeback_key", offImg:Img.BTN_SCK_COMEBACK_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_comeback_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_shorten_key", offImg:Img.BTN_SCK_SHORTEN_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_shorten_key", WidgetLib.ButtonType.NORMAL, attr);
	
	attr = {targetImgId:"img_menu_key", offImg:Img.BTN_SCK_MENU_OFF, pressImg:Img.BTN_SCK_MENU_STOP_PRESS};
	WidgetLib.registerButtonWidgetById("btn_menu_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_stop_key", offImg:Img.BTN_SCK_STOP_OFF, pressImg:Img.BTN_SCK_MENU_STOP_PRESS};
	WidgetLib.registerButtonWidgetById("btn_stop_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_start_key", offImg:Img.BTN_SCK_START_OFF, pressImg:Img.BTN_SCK_START_PRESS};
	WidgetLib.registerButtonWidgetById("btn_start_key", WidgetLib.ButtonType.NORMAL, attr);
	
}

SoftKeypad.eventhendle = function(page_ID, event_ID)
{
	switch(page_ID){
		case "page_login":
			BrowserExt.Beep(0);
			glbInfo.userId = "guest";
			PageManager.changePage(ServiceSelectPage, PageManager.type.NORMAL);
			break;
		case "pop_otidPopup":
			switch(event_ID)
			{
				case "btn_start_key":
					BrowserExt.Beep(1);
					break;
				case "btn_menu_key":
					//재설정 키
					BrowserExt.Beep(0);
					BrowserExt.SetScreenChange("allservice");
					break;
				case BrowserExt.keyCode.FX_VK_PAUSE:
					break;
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		case "page_serviceSelect":
			switch(event_ID)
			{
				case "btn_auth_key":
					// 로그인 페이지로 이동 or 로그아웃
					var result = EwbClass.sendKeyCode(137);
					break;
				case "btn_num_key0":
				case "btn_num_key1":
				case "btn_num_key2":
				case "btn_num_key3":
				case "btn_num_key4":
				case "btn_num_key5":
				case "btn_num_key6":
				case "btn_num_key7":
				case "btn_num_key8":
				case "btn_num_key9":
					//var fn = new Function("event_ID", "return event_ID.substring(9,10);");
					var _num = event_ID.substring(9,10);
					//var _result = this.prnCntManager.insertNum(_num);
					BrowserExt.Beep(_result ? 0 : 1);
					break;
				case "btn_comeback_key":
					//var _result = page_FileList.prnCntManager.removeNum();
					BrowserExt.Beep(_result ? 0 : 1);
					break;
				case "btn_start_key":
					/*
					if(WebServiceLib.getActiveRequestCount() != 0){
						BrowserExt.Beep(1);
						KISUtil.debug("[job return]","getActiveRequestCount()=" + WebServiceLib.getActiveRequestCount());
						return;
					}
					//인쇄매수 변경분 반영
					page_FileList.docListManager.updateQuantity(page_FileList.updateQuantity, true);
					//인쇄 가능여부 판단
					var _lst = page_FileList.docListManager.getCheckedItems();
					if(_lst.length>0){
						//프린트버튼의 상태가 disable일때는 인쇄하지 않도록 처리
						if(!WidgetLib.getWidgetStatus("btn_FL_Print").enable){//FileListPage.prnCntManager.getEnableFlag() 
							BrowserExt.Beep(1);
						}
						else{
							//Run Job
							BrowserExt.Beep(0);
							Common.doJobStart(_lst);
						}
					}
					else{
						BrowserExt.Beep(1);
					}
					*/
					break;
				case "btn_menu_key":
					//リセットキー
					BrowserExt.Beep(0);
					BrowserExt.SetScreenChange("allservice");
					break;
				case "btn_pause_key":
					break;
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
			switch(event_ID){
				case "btn_menu_key":
					//재설정 키
					BrowserExt.Beep(0);
					BrowserExt.SetScreenChange("allservice");
					break;
				default:
					BrowserExt.Beep(1);
			}
			break;
	}
}