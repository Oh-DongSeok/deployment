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
			{id:"btn_LP_login", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_LP_login", offImg: Img.IMG_LP_LOGIN_OFF, pressImg: Img.IMG_LP_LOGIN_PRESS, disableImg: Img.IMG_LP_LOGIN_DIS}},
			{id:"btn_LP_drctPrint", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_LP_drctPrint", offImg: Img.IMG_LP_LOGIN_OFF, pressImg: Img.IMG_LP_LOGIN_PRESS, disableImg: Img.IMG_LP_LOGIN_DIS}},
			{id:"btn_MP_lang_left", type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg: Img.BTN_DCR_OFF, pressImg: Img.BTN_DCR_PRESS, disableImg: Img.BTN_DCR_DIS}},
			{id:"btn_MP_lang_right", type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg: Img.BTN_ICR_OFF, pressImg: Img.BTN_ICR_PRESS, disableImg:Img.BTN_ICR_DIS}},
			//2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
			{id:"btn_LP_guest", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_LP_guest", offImg: Img.IMG_LP_LOGIN_OFF, pressImg: Img.IMG_LP_LOGIN_PRESS, disableImg: Img.IMG_LP_LOGIN_DIS}}
		],
		imageList:[
			{id:"icn_LP_drctPrint", src:Img.IMG_LP_PRINT},
			{id:"img_LP_mainLogo", src:Img.IMG_LP_LOGO}
		],
		textList:[
			{id : "lbl_LP_login", text: Msg.LOGIN.LOGIN_BTN_LABEL},
			{id : "lbl_LP_drctPrint", text: Msg.LOGIN.DRCT_PRINT_BTN_LABEL},
			{id : "lbl_MP_lang",text:Common.languageChk(glbConfig.language[0])},
			{id : "lbl_LP_guest", text: Msg.LOGIN.LOGIN_GUEST_BTN_LABEL}
		]
	};
};

/**
 * 개별 페이지의 HTML Tag를 구성 및 등록
 */
LoginPage._initOthers = function()
{
	var tbxID=document.getElementById("tbx_LP_id");
	var tbxPW=document.getElementById("tbx_LP_password");
	tbxID.placeholder = Msg.LOGIN.GUIDE_ID;
	tbxPW.placeholder = Msg.LOGIN.GUIDE_PW;

	if(glbConfig.DRCT_PRINT_ENABLE){
		document.getElementById("lyr_LP_login").style.top = "123px";
		Common.changeVisibility("btn_LP_drctPrint","block");
	}
	Common.changeVisibility("tray_status","block");
};

LoginPage._onPageChange = function(){
	WidgetLib.setWidgetStatus("btn_LP_login",{enable:true});	//login버튼 활성화
	WidgetLib.setWidgetStatus("btn_LP_drctPrint",{enable:true});//print버튼 활성화
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
LoginPage.updateDisplay = function(){
	var tbxID=document.getElementById("tbx_LP_id");
	var tbxPW=document.getElementById("tbx_LP_password");
	tbxID.value="";
	tbxPW.value="";
	WidgetLib.setWidgetStatus("btn_MP_lang_right",{enable:(glbConfig.language.length>1)});//+버튼
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
			switch(id)
			{
				case "btn_LP_login":
					//ID/PW문자열 존재여부 확인
					var tbxId = document.getElementById("tbx_LP_id");
					var tbxPw = document.getElementById("tbx_LP_password");
					var _userId = tbxId.value;
					var _userPw = tbxPw.value;
					if(_userId.length>0&& _userPw.length>0){
						BrowserExt.Beep(0);
						WidgetLib.setWidgetStatus("btn_LP_login",{enable:false});		//버튼 연타를 막기위한 조치
						WidgetLib.setWidgetStatus("btn_LP_drctPrint",{enable:false});	//버튼 연타를 막기위한 조치
						glbInfo.userId = _userId;
						glbInfo.userPw = _userPw;

						//2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
						//비회원 복사 후 다시 로그인할 경우, 결제 방법 설정 파일에 따라 재설정함.
						glbConfig.isCreditPayment = (DATA.CREDIT_PAYMENT) ? ((parseInt(DATA.CREDIT_PAYMENT)==1)? true : false) : CONFIG.CREDIT_PAYMENT;
						glbConfig.isIMoneyPayment = (DATA.I_MONEY_PAYMENT) ? ((parseInt(DATA.I_MONEY_PAYMENT)==1)? true : false) : CONFIG.I_MONEY_PAYMENT;

						if(CONFIG.ENV.ADMIN_INFO.ID){
							if(_userId==CONFIG.ENV.ADMIN_INFO.ID
								&& _userPw==CONFIG.ENV.ADMIN_INFO.PASSWORD){
									PageManager.changePage(AdminSettingPage,PageManager.type.NORMAL);//관리자 설정화면으로 이동
									break;
							}
						}
						tbxId.value="";
						tbxPw.value="";
						Common.doLogin();
					}
					else{
						BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.REQUIRE_USERID_PW);
					}
					break;
				case "btn_LP_guest"://2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
					BrowserExt.Beep(0);

					if(!glbInfo.availableCSInfo){
						LogLib.write("IPrint Menu glbInfo.availableCSInfo NULL Error");
						WidgetLib.setWidgetStatus("btn_LP_guest", {enable:false});
						return;
					}

					var service;
					for(var i=0; i<glbInfo.availableCSInfo.length; i++){
						service = glbInfo.availableCSInfo[i];
						if(service.type == "copy"){
							glbInfo.userId = "guest_iprint";
							glbInfo.userPw = "22539762";
							glbConfig.isCreditPayment = true;//비회원 복사시 신용카드 결제만 사용.
							glbConfig.isIMoneyPayment = false;
							
							ServiceSelectPage.isBtnAvailable = false;

							//Chrome Debug 코드
							if(flg_Dummy_Beep){
								//service.iframe = "D:/02_CS/BILING_IPRINT/trunk/" + service.type + "/index.html";
								service.iframe = addr_copy;
							}

							ServiceManager.callService({name:service.type,url:(service.iframe)}, {
								doneFunc:function (){
									ServiceSelectPage.isBtnAvailable = true;
								},
								errorFunc:function (){
									var param = {type:"startup",title:Msg.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_ENV,targetPage:false};
									WarnPopup._param = param;
									PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
							}});
							return;
						}
					}

					//Copy CS가 복합기에 미설치된 경우, 로그 남기고 비회원 버튼 disable 처리함
					LogLib.write("IPrint Menu Copy Service Not Exist Error");
					WidgetLib.setWidgetStatus("btn_LP_guest", {enable:false});
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
					//BrowserExt.Beep(0);
					//clearMessageAreaTimer();
					break;
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_START:
					BrowserExt.Beep(1);
					break;
				case BrowserExt.keyCode.FX_VK_CLEAR:
					//リセットキー
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