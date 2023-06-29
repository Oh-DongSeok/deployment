/**
 * 개별 페이지의 표시 및 동작용
 * （메뉴 페이지용）
 */
var LoginPage = new TemplatePage();

LoginPage.ID = "page_login";

/**
 * 개별 페이지의 Data정의
 */
LoginPage._initModel = function()
{
	this._data =
	{
		buttonList:[
			{id:"btn_LP_login", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_LP_login", offImg: Img.IMG_LP_LOGIN_OFF, pressImg: Img.IMG_LP_LOGIN_PRESS, disableImg: Img.IMG_LP_LOGIN_DIS}}
			,{id:"btn_LP_drctPrint", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_LP_drctPrint", offImg: Img.IMG_LP_LOGIN_OFF, pressImg: Img.IMG_LP_LOGIN_PRESS, disableImg: Img.IMG_LP_LOGIN_DIS}}
			,{id:"btn_MP_lang_left", type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg: Img.BTN_DCR_OFF, pressImg: Img.BTN_DCR_PRESS, disableImg: Img.BTN_DCR_DIS}}
			,{id:"btn_MP_lang_right", type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg: Img.BTN_ICR_OFF, pressImg: Img.BTN_ICR_PRESS, disableImg:Img.BTN_ICR_DIS}}
		],
		imageList:[
			{id:"icn_LP_drctPrint", src:Img.IMG_LP_PRINT},
			{id:"img_LP_mainLogo", src:Img.IMG_LP_LOGO}
		],
		textList:[
			{id : "lbl_LP_login", text: Msg.LOGIN.LOGIN_BTN_LABEL},
			{id : "lbl_LP_drctPrint", text: Msg.LOGIN.DRCT_PRINT_BTN_LABEL},
			{id : "lbl_MP_lang",text:Common.languageChk(glbConfig.language[0])}
		]
	};
};

/**
 * 개별 페이지의 HTML Tag를 구성 및 등록
 */
LoginPage._initOthers = function()
{
	if(glbConfig.DRCT_PRINT_ENABLE){
		document.getElementById("lyr_LP_login").style.top = "123px";
		Common.changeVisibility("btn_LP_drctPrint","block");
	}
	Common.changeVisibility("tray_status","block");
};

LoginPage._onPageChange = function()
{
	WidgetLib.setWidgetStatus("btn_LP_login",{enable:true});	//login버튼 활성화
	WidgetLib.setWidgetStatus("btn_LP_drctPrint",{enable:true});//print버튼 활성화
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
LoginPage.updateDisplay = function()
{
	WidgetLib.setWidgetStatus("btn_MP_lang_right", {enable:(glbConfig.language.length>1)}); //+ 버튼
	Common.changeVisibility("tray_status",'block');
	Common.displayTitleArea();
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
LoginPage.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id){
				case "btn_LP_login"://2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
					BrowserExt.Beep(0);
					glbInfo.userId = "guest";
					PageManager.changePage(ServiceSelectPage, PageManager.type.NORMAL);
					break;
				case "btn_MP_lang_left":
					BrowserExt.Beep(0);
					glbConfig.langCount--;
					Common.setText('lbl_MP_lang',Common.languageChk(glbConfig.language[glbConfig.langCount]));
					WidgetLib.setWidgetStatus(id,{enable:(glbConfig.langCount>0)});//-버튼
					WidgetLib.setWidgetStatus('btn_MP_lang_right',{enable:!(glbConfig.langCount>=glbConfig.language.length-1)});//+버튼
					WaitingPage.chageLanguage();
					Common.beforeMoveToMainpage();
					break;
				case "btn_MP_lang_right":
					BrowserExt.Beep(0);
					glbConfig.langCount++;
					Common.setText('lbl_MP_lang',Common.languageChk(glbConfig.language[glbConfig.langCount]));
					WidgetLib.setWidgetStatus('btn_MP_lang_left',{enable:(glbConfig.langCount>0)});//-버튼
					WidgetLib.setWidgetStatus(id,{enable:!(glbConfig.langCount>=glbConfig.language.length-1)});//+버튼
					WaitingPage.chageLanguage();
					Common.beforeMoveToMainpage();
					break;
				default:
					break;
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id){
				case BrowserExt.keyCode.FX_VK_START:
					BrowserExt.Beep(1);
					break;
				case BrowserExt.keyCode.FX_VK_CLEAR://リセットキー
					BrowserExt.Beep(0);
					BrowserExt.SetScreenChange("allservice");
					break;
				case BrowserExt.keyCode.FX_VK_0:
				case BrowserExt.keyCode.FX_VK_1:
				case BrowserExt.keyCode.FX_VK_2:
				case BrowserExt.keyCode.FX_VK_3:
				case BrowserExt.keyCode.FX_VK_4:
				case BrowserExt.keyCode.FX_VK_5:
				case BrowserExt.keyCode.FX_VK_6:
				case BrowserExt.keyCode.FX_VK_7:
				case BrowserExt.keyCode.FX_VK_8:
				case BrowserExt.keyCode.FX_VK_9:
					if(flg_Dummy_Beep){
						return;
					}
				case BrowserExt.keyCode.FX_VK_PAUSE:
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
			break;
	}
};