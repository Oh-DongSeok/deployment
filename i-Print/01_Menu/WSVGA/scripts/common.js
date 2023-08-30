/**
 * @fileoverview CS기본동작과 공통기능을 정의하는 파일
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var Common = {};
/**
 * Contents기동시의 초기설정을 실행한다.
 */
Common.onLoadBody = function()
{
	ContentsLib.init();
	ContentsLib.contentsIcon = "./info/smallicon.png";
	ContentsLib.setListener(Common.onLoadEvent);
	//JFLib.setEventListener(Common.onLoadEvent);

	//LogLib.setLogLevel(LogLib.LEVEL.INF);

	//SystemEventLib.AddNotify("AuthEvent", this.onLoadEvent);
	BrowserExt.Initialize();	//브라우저 확장기능 초기화
	//BrowserExt.EnablePrivilege();	//타서버에의 접근 권한 부여

	KISUtil.initDebug("body");

	//초기화
	PageManager.init("pageWrapper");

	initModel();

	if(glbConfigError){return;} //환경설정파일 에러 발생시 메뉴화면 표시 중단을 위해

	//BrowserExt.SetScreenChange("popup:faultAll"); //2016.05.17 Chone 디바이스 에러 화면을 표시함

	//복합기 언어설정에 따른 문자열과 이미지셋 선택
	//var lang = BrowserExt.GetAcceptLanguage();
	//var arrLang = lang.split(",");
	//var _lang = arrLang[0]||"en";
	//var _lang = "ko";
	var _lang = glbConfig.language[0];
	switch(_lang){
		case "ko":
		case "en":
		case "ja":
		case "ch":
			Msg = Msg_lang[_lang];
			Extend(Img,Img_lang[_lang]);
			break;
		default:
			Msg = Msg_lang["en"];
			Extend(Img,Img_lang["en"]);
			break;
	}

	ServiceManager.init({targetFrameId:"frm_serviceForm",targetFrameLyrId:"lyr_serviceForm"});
	SoftKeypad.initKeypad("body"); // soft keypad 초기화

	ContentsLib.contentsName = Msg.Common.title || Msg.Common.CSName;

	//대기 페이지로 전환
	PageManager.changePage(WaitingPage, PageManager.type.NORMAL);

	//시리얼No취득용
	SSMILib.GetProductInformation();

	SSMILib.GetTcpIpInfo(false);//2016.09.28 KIS Chone 복합기 IP 자동 취득 기능의 추가 refs #4065s

	SSMILib.GetAccountConfig();

	

	//슬라이드 메시지 초기화
	MessageManager.init();

	//CS타이틀 영역 표시
	Common.displayTitleArea();

};

Common.beforeMoveToMainpage = function(){
	var tmp;
	switch(glbConfig.language[glbConfig.langCount]){
		case 'ko':
			tmp = Msg_lang.ko;
			break;
		case 'en':
			tmp = Msg_lang.en;
			break;
		case 'ja':
			tmp = Msg_lang.ja;
			break;
		case 'ch':
			tmp = Msg_lang.ch;
			break;
		default:
			tmp = Msg_lang.en;
			break;
	}
	//Msg = extendDeep(Msg_default, (glbInfo.currentLang === "en")?Msg_lang.en:Msg_lang.ko);
	Msg = extendDeep(Msg_default, tmp);
};

/**
 * 공통 이벤트 처리 메소드
 * 이곳에 정의 되지 않은 경우 각 페이지에서 이벤트가 처리됨
 * @param {event} event
 * @param {string} id
 */
Common.onLoadEvent = function(event, id)
{
	KISUtil.debug("Common.onLoadEvent","event:"+event+"/id:"+id);
	switch(event){
		case "GetAccountConfig":
			if(arguments[1] == true){
				var accountConfig = arguments[2];
				glbDevInfo.authMode = SSMILib.isDeviceAuth(accountConfig);
				glbDevInfo.AuditronMode = accountConfig.AuditronMode;
				//複合機のホスト名を取得
				glbInfo.hostName = accountConfig.HostName;
				//glbEmail.subject = Msg.Common.hostName.replace("HOST_NAME", glbInfo.hostName);

				//설치 컨텐츠 목록 취득
				if(glbDevInfo.authMode){
					//ユーザ情報の取得
					SSMILib.GetUser();
				}
				else{
					//CS起動中のエラー画面に遷移
					var param = {type : "startup", title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_INVALID_CERTMODE, targetPage : false};
					WarnPopup._param = param;
					PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
				}
			}
			else {
				//KISUtil.debug("GetAccountConfig", "error");
				if(arguments[2]) {
					var resStatus = arguments[2];
					//未認証ユーザ・CEユーザ
					if(resStatus == 403) {
						//CS起動中のエラー画面に遷移
						Common.displayTitleArea();
						//TODO: 에러처리 공통화
						var param = {type : "startup", title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_INVALID_CERTMODE, targetPage : false};
						WarnPopup._param = param;
						PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
					}
					else
					{
						var str = "Common.onLoadEvent/GetAccountConfig[res.readyState" + res.readyState + ",res.status:" + res.status + "]";
						//LogLib.write(str, LogLib.LEVEL.WRN);
					}
				}
				else
				{
					var str = "Common.onLoadEvent/GetAccountConfig/null";
					//LogLib.write(str, LogLib.LEVEL.WRN);
				}
			}
			break;
		case "GetProductInformation":
			if(arguments[1] == true){
				var productInfo = arguments[2];
				glbInfo.serialNumber = productInfo.serialNumber;
				glbInfo.productCode = productInfo.productCode;
				glbInfo.familyCode = productInfo.familyCode;
				glbInfo.DocumentRawFormatVersion = productInfo.DocumentRawFormatVersion;
				glbInfo.GenerationNumber = productInfo.GenerationNumber;
				glbInfo.sha = SecureManager_Hash(glbInfo.serialNumber + glbAcode);
				KISUtil.debug("SerialNumber = ",glbInfo.serialNumber);
				KISUtil.debug("SerialNumberSHA = ",glbInfo.sha);
			}else{
				KISUtil.debug("GetProductInformation Error/cnt",glbInfo.tcpipFailCnt);
			}
			break;
		case "GetTcpIpInfo"://2016.09.28 KIS Chone 복합기 IP 자동 취득 기능의 추가 refs #4065
            if(arguments[1] == true){
                var tcpInfoObj = arguments[2];
                glbConfig.PRINTER_IP = tcpInfoObj.IPAddress;
                //LogLib.write("IPrint Menu --- PRINTER_IP : " + glbConfig.PRINTER_IP, LogLib.LEVEL.INF);
            }else{
            	//LogLib.write("[IPrint Menu] Common.onLoadEvent GetTcpIpInfo Error", LogLib.LEVEL.WRN);
            }
            break;
		case "GetTrayInfo":
			if (arguments[1] == true) {
				var tray_msg="";
				var traySize,trayCurrentLevel;
				var trayName="";
				for(var i=0,iMax=arguments[2].length;i<iMax;i++){//TODO 현재 Tray4까지만 존재하는걸로 가정. 이후 트레이장착을 인식후, 트레이 장착수만큼 표시하도록 처리필요.
					traySize = arguments[2][i].MediumSize;
					trayCurrentLevel = (arguments[2][i].CurrentLevel>=0)?arguments[2][i].CurrentLevel:Msg.Common.tray_bar;
					if(trayCurrentLevel != "-"){
						tray_msg = (arguments[2][i].MediumSize!="Unknown")? (tray_msg + " " + (i+1) + Msg.Common.tray_unit + Msg.Common.tray_bar + traySize + ":" + trayCurrentLevel + "%" + " | "):(tray_msg + isCheckTray(i,arguments[2][i].Status));
					}else{
						/*
						if((glbConfig.activatorKey != glbInfo.sha)&&(arguments[2][i].Name == "TRAY1")){
							tray_msg = "미지원 기기";
							trayName = arguments[2][i].Name;
						}
						*/
					}
					//tray_msg = tray_msg + " " + (i+1) + Msg.Common.tray_unit + Msg.Common.tray_bar + "A4:100% |";//Dummy
				}
				if((glbConfig.activatorKey != glbInfo.sha)&&(trayName == "TRAY1")){
					tray_msg = "미지원 기기";
					msg = {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_KEY};
					var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
					WarnPopup._param = param;
					PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
					break;
				}
				Common.setText("tray_status",tray_msg);
				//PageManager.changePage(LoginPage,PageManager.type.NORMAL);
				//만일 서비스가 기동중인경우 서비스창 닫기 실행
				ServiceManager.removeService();
				PageManager.changePage(LoginPage, (PageManager.getCurrentPage() == ConfirmPopup)?PageManager.type.ROLLBACK:PageManager.type.NORMAL);
			}
			/**
			 * UNKNOWN: 不明
			 * READY: 給紙可
			 * EMPTY: 用紙なし
			 * REMOVE: トレイ抜け
			 * SIZESNR_IRREGULAR: サイズセンサ誤検知
			 * RISING: リフトアップ中
			 * NOTEXIST: 未装着
			 * BROKEN: 故障
			 */
			function isCheckTray(index,status)
			{
				switch(status){
					case "SIZESNR_IRREGULAR":
					case "BROKEN":
					case "REMOVE":
						return (index+1) + Msg.Common.tray_unit + Msg.Common.tray_bar + Msg.Common.tray_error + " | ";
					case "NOTEXIST":
					case "RISING":
					default:
						return "";
				}
			};
			/*
			if (SSMILib.dummy) {
				//ServiceManager.removeService();
				PageManager.changePage(LoginPage, (PageManager.getCurrentPage() == ConfirmPopup)?PageManager.type.ROLLBACK:PageManager.type.NORMAL);
			}
			*/
			SSMILib.GetTcpIpInfo(false);	// Tray 정보 취득후 IP정보를 재 취득한다.
			break;
			//유저정보취득
		case "GetUser":
			//isScanKeyCheck();
			//isFaxKeyCheck();
			Common.displayTitleArea();
			var msg = {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
			if(arguments[1] == true){
				var users = arguments[2];
				if(users){
					glbDevInfo.User = {};
					glbDevInfo.User.id = users[0]["UserID"];
					glbDevInfo.User.index = users[0]["Index"];
					glbDevInfo.User.displayName = users[0]["DisplayName"];
					glbDevInfo.User.relatedUserId = users[0]["RelatedUserID"];
					glbDevInfo.User.cardID = users[0]["CardID"];//TODO(추후대응)

					glbInfo.userInfo = {};
					//glbInfo.userInfo.isAdmin = !(glbDevInfo.User.index > 0);
					glbInfo.userInfo.isAdmin = isSytemAdmin(users[0]);
					if (SSMILib.dummy) {
						glbInfo.userInfo.isAdmin = true;
					}
					//유저가 어드민인가?
					if(glbInfo.userInfo.isAdmin){
						//지정 유저인경우
						//서비스 진행
						if(flg_Dummy_Beep||glbDevInfo.User.id == CONFIG.ENV.LOGIN_INFO.ID){//TODO: 실 코드로
							SSMILib.ListCsv();
							SSMILib.GetTrayInfo();
							//PageManager.changePage(LoginPage,PageManager.type.NORMAL);
						}
						else{
							KISUtil.debug("GetUser/glbConfig.ADMIN_USABLE",glbConfig.ADMIN_USABLE);
							KISUtil.debug("GetUser/glbInfo.userInfo.isAdmin",glbInfo.userInfo.isAdmin);
							BrowserExt.SetScreenChange("menuto:native_menu");		//관리자는 네이티브 메뉴로 천이
						}
						break;
					}
					else{
						//기본페이지(로그인)로 천이
//1
						if(flg_Dummy_Beep){
							SSMILib.ListCsv();
							SSMILib.GetTrayInfo();
							//PageManager.changePage(LoginPage,PageManager.type.NORMAL);
							return;
						}
						//일반유저이므로 지정유저일 수 없으므로 무조건 로그아웃후 재로그인 처리
						glbInfo.loginCount=CONFIG.ENV.COUNTER.LOGIN;
						SSMILib.LogoutDev();
						//PageManager.changePage(LoginPage,PageManager.type.NORMAL);
						//msg = {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_ENV};
						break;
					}
				}
				else
				{
//2
					msg = {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_ENV};
				}
			}
			else
			{
				KISUtil.debug("glbDevInfo.authMode",glbDevInfo.authMode);
				if(glbDevInfo.authMode){
					//인증모드/미인증유저 or CE
//3
					if(flg_Dummy_Beep){
						SSMILib.ListCsv();
						SSMILib.GetTrayInfo();
						//PageManager.changePage(LoginPage,PageManager.type.NORMAL);//TODO delete
					}
					else{
						var ceUser = new ToolsLib.user();
						ceUser.isCELogin();
						//glbInfo.loginCount=CONFIG.ENV.COUNTER.LOGIN;
						//SSMILib.LoginDev(CONFIG.ENV.LOGIN_INFO.ID, CONFIG.ENV.LOGIN_INFO.PASSWORD);
					}
					break;
				}
				else{
					//비인증모드/미인증유저
					//기본페이지(로그인)로 천이
//4
					if(flg_Dummy_Beep){
						SSMILib.ListCsv();
						SSMILib.GetTrayInfo();
						//PageManager.changePage(LoginPage,PageManager.type.NORMAL);//TODO delete
						break;
					}
					msg = {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_INVALID_CERTMODE};
				}
			}
			//CS起動中のエラー画面に遷移
			var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "isCELogin":
        	if(arguments[1]==true){
        		//CE유저
        		glbDevInfo.isCeLogin = true;
				BrowserExt.SetScreenChange("menuto:native_menu");
				return;
			}else{
				//CE가 아니고 인증모드인 경우
				if(glbDevInfo.authMode){
					if(!flg_Dummy_Beep) {
						glbInfo.loginCount=CONFIG.ENV.COUNTER.LOGIN;
						SSMILib.LoginDev(CONFIG.ENV.LOGIN_INFO.ID, CONFIG.ENV.LOGIN_INFO.PASSWORD);
					}
					SSMILib.GetTrayInfo();
					//PageManager.changePage(LoginPage,PageManager.type.NORMAL);
				}
				else{
					var param = {type:"startup",title:Msg.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_ENV,targetPage:false};
					WarnPopup._param = param;
					PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
				}
				break;
			}
			break;
		case "LogoutDev":
			if (arguments[1] === true) {
				KISUtil.debug("LogoutDev", "Success");
				clearTimeout(WaitingPage.timer);
				glbInfo.loginCount=CONFIG.ENV.COUNTER.LOGIN;
				SSMILib.LoginDev(CONFIG.ENV.LOGIN_INFO.ID, CONFIG.ENV.LOGIN_INFO.PASSWORD);
			} else {
				KISUtil.debug("LogoutDev", "Failed"+ glbInfo.loginCount);
				if(--glbInfo.loginCount>0){
					glbInfo.loginTimer = setTimeout("Common.retryLogInOut(false)",CONFIG.ENV.TIMEOUTS.LOGIN);
				}
				else{
					//error
					var param = {type:"startup",title:Msg.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_ENV,targetPage:false};
					WarnPopup._param = param;
					PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
				}
			}
			break;
		case "LoginDev":
			if(arguments[1] === true){
				KISUtil.debug("LoginDev", "Success");
				SSMILib.GetUser();
			}else{
				KISUtil.debug("LogoutDev", "Failed" + glbInfo.loginCount);

				//error
				var param = {type:"startup",title:Msg.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_ENV,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		case "ListCsv":		// 복합기에 설치된 각 Custom Service의 정보 취득용.(호출할 주소 취득용)
			if(flg_Dummy_Beep||arguments[1]==true){
				//console.log(JSON.stringify(arguments[2]));
				glbInfo.CSInfo = convertCsInfos(arguments[2]);	// Index, URl 정보를 취득
				glbInfo.availableCSInfo = setAvailableCS(glbInfo.CSInfo, glbConfig.Services);
			}
			else{
				var param = {type : "startup", title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_ENV, targetPage : false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			//TODO delete dummy code start
			//if(flg_Dummy_Beep) glbInfo.availableCSInfo = [{"changeDisplay":"cstm02","iframe":"http://localhost:8080/ep_print/index.html","key":"CS_RM_XXXX1_V0_9_0","type":"print"},{"changeDisplay":"cstm03","iframe":"http://localhost:8080/ep_copy2/index.html","key":"CS_RM_XXXX2_V0_9_0","type":"copy"}];
			//TODO delete dummy code

			function convertCsInfos(obj){	// CS정부중 Index와 URL 정보를 분리 취득
				var result = {},tmp;
				//console.log("TODO");
				//console.log(obj);
				for(i in obj){
					tmp = obj[i];
					result[tmp.Name] = {idx:tmp.Index,url:tmp.URL};
				}
				return result;
			}
			function setAvailableCS(_csInfo,_services){	// 실행서비스와 그에 따른 호출 CS Matchup 함수
				//console.log("setAvailableCS");
				var tmp,obj,result=[];
				for(var i in _services){
					tmp = _services[i];
					if(tmp.func){
						result[result.length]=changeFormatForFuncExcute(tmp);
					}
					else{
						obj = _csInfo[tmp.key];

						if(obj){
							//실행경로를 설정함(iframe으로 실행시)
							//인덱스를 설정함(changeDisplay로 실행시)
							result[result.length]=changeFormatForExcute(obj,tmp);
						}
					}
				}
				//console.log(result);
				return result;
			}
			function changeFormatForExcute(obj,tmp){
				return {changeDisplay:"cstm"+lpad(obj.idx,2,"0"), iframe:obj.url, key:tmp.key, type:tmp.name, func:false};
			}
			function changeFormatForFuncExcute(tmp){
				return {changeDisplay:tmp.key, iframe:"menuto:" + tmp.key, key:tmp.key, type:tmp.name, func:true}
			}
			function lpad(str,len,z){//TODO move to util
				z = z || '0';
				var n = str + '';
				return n.length >= len ? n : new Array(len - n.length + 1).join(z) + n;
			}
			break;
		default:
			var currentPage = PageManager.getCurrentPage();
			if(currentPage)
			{
				currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
			}
			break;
	}

	function isSytemAdmin(userInfo){
		if(userInfo&&userInfo.Roles&&userInfo.Roles.Role&&userInfo.Roles.Role=="SystemAdministrator"){
			return true;
		}
		else{
			return false;
		}
	}
};
/**
 * 로그인 정보를 만료시키고 로그인 페이지표시하기위한 메소드
 */
Common.LogOut = function(){
	//데이터 초기화(로그인후 취득한)
	delete glbInfo.userBalance;
	//delete glbInfo.priceTable;
	delete glbInfo.userId;
	delete glbInfo.userPw;
	delete glbInfo.cardId; //TODO 이후 카드ID대응시
	//만일 서비스가 기동중인경우 서비스창 닫기 실행
//	ServiceManager.removeService();
	//로그인 페이지로 천이
	SSMILib.GetTrayInfo();
	//PageManager.changePage(LoginPage, (PageManager.getCurrentPage() == ConfirmPopup)?PageManager.type.ROLLBACK:PageManager.type.NORMAL);
};

Common.retryLogInOut = function(isLogin){
	if(glbInfo.loginCount>0){
		if(isLogin){
			SSMILib.LoginDev(CONFIG.ENV.LOGIN_INFO.ID, CONFIG.ENV.LOGIN_INFO.PASSWORD);
		}else{
			SSMILib.LogoutDev();
		}
		WaitingPage.count--;
	}else{
		clearTimeout(glbInfo.loginTimer);
		WaitingPage.count=CONFIG.ENV.COUNTER.LOGIN;
		if(isLogin){ //timeout
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			//WarnPopup._errCode = "OT-00";
		}else{
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			//WarnPopup._errCode = "IT-00";
		}
		PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
	}
};

//TODO: util로
Common.sortList = function(lst,order,path){
	if(order != SORT_TYPE.NONE){
		lst.sort(by(order, path));
	}
	/**
	 * 정렬용 로직
	 */
	function by(order, path){
		var orderArr = (order==SORT_TYPE.ASC)?[-1,1]:[1,-1];
		//console.log("orderArr:"+orderArr);
		return function (o, p){
			var a, b;
			if(typeof o === 'object' && typeof p === 'object' && o && p){
				a = o[path];
				b = p[path];
				if(a===b){
					return 0;
				}
				else if( typeof a === typeof b){
					return (a < b ? orderArr[0] : orderArr[1]);
				}
			}
		};
	}
};

/**
 * OTID 로긴 처리
 * 2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
 */
Common.doLogin = function()
{
	var info = {
		'service' : SERVICE_CODE.USER,
		'userType' : USER_TYPE.TEMP, //2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
		'userInfo' : {
			'cardId' : "",//glbDevInfo.User.cardID,
			'userId' : glbInfo.userId, //One Time ID 사용시에는 OTID가 User ID로 사용
			'userPw' : glbInfo.userPw
		},
		'ipAddress' : glbConfig.PRINTER_IP,
		'serialNo' : glbInfo.serialNumber || "000000",
		'language' : glbConfig.language[glbConfig.langCount]
	};

	info.userInfo.userId = (glbConfig.isSHA) ? SecureManager_Hash(info.userInfo.userId) : info.userInfo.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	info.userInfo.userPw = (glbConfig.isSHA) ? SecureManager_Hash(info.userInfo.userPw) : info.userInfo.userPw;//SHA-256 암호화
	KISUtil.debug("Common.doLogin/userId", info.userInfo.userId);
	info = extendDeep(info, {});
	Common.DoPureLoginChkReq(info, Common.DoPureLoginChkResp);
};

Common.updateUserBalance = function(_balance)
{
	glbInfo.userBalance = _balance;
	Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE +  formatWithRemainders(_balance) + " " + Msg.UNIT.WON);
	//Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + new Number(_balance).zf()+" "+Msg.UNIT.WON);
};

//TODO: util.js로 이동
/**
 * Title의 Text와 Icon을 설정
 */
Common.displayTitleArea = function()
{
	//Common.setImage("img_csTitle", Img.CS_TITLE_BAR);
	//Common.setImage("icn_csLogo", Img.SERVICE_ICON);
	Common.setText("lbl_csTitle", Msg_lang[glbConfig.language[glbConfig.langCount]].Common.title||Msg.Common.CSName);//복합기 서비스명을 초기 설정 언어로 표시.
};

/**
 *풀다운의 HTML을 작성
 * @param {string) _page : 적용될 페이지의 Key
 * @param {string} _key : 풀다운의 Key (각 Element의 ID를 작성해 사용한다.)
 * @param {int} _length : 항목 (항목을 나누어 HTML을 작성)
 * @return Full down HTML Element
 */
Common.createHTMLPulldown = function(_page,_key,_length){
	var _popup = Common.getNewElement("div",{id:"pul_" + _page + "_" + _key + "_popup", className:"pullPop hide"}),
		_bgTop = Common.getNewElement("img",{id:"img_" + _page + "_" + _key + "_popup_top", className:"bgTop"}),
		_bgBottom = Common.getNewElement("img",{id:"img_" + _page + "_" + _key + "_popup_bottom", className:"bgBottom"}),
		_body = Common.getNewElement("div",{id:"lst_" + _page + "_" + _key + "_popup", className:"bg"}),
		_list = document.createElement("ul"),
		_btn, _item, _node, _tmp;
	for(var i = 0; i < _length; i++)
	{
		_item =  Common.getNewElement("li",{id:"item" + i});
		_btn = Common.getNewElement("div",{id:"btn_" + _page + "_" + _key + "_menu_" + i, className:"popBtn"});
		_btn.appendChild(Common.getNewElement("img",{id:"img_" + _page + "_" + _key + "_menu_" + i, className:"bg"}));		//bg
		_btn.appendChild(Common.getNewElement("img",{id:"icn_" + _page + "_" + _key + "_menu_" + i, className:"icn"}));	//icon
		_btn.appendChild(Common.getNewElement("div",{id:"lbl_" + _page + "_" + _key + "_menu_" + i, className:"lbl"}));	//label
		_item.appendChild(_btn);
		_list.appendChild(_item);
	}
	_body.appendChild(_list);

	_popup.appendChild(_bgTop);
	_popup.appendChild(_bgBottom);
	_popup.appendChild(_body);

	return _popup;
};

/**
 * List를 입수시 Widget의 Status를 변경
 * @param {Array} list Widget Object Array
 * @param {boolean} flag Enable/Disable
 */
Common.changeStatus = function(list,flag)
{
	for(var i=0,il=list.length;i<il;i++)
	{
		WidgetLib.setWidgetStatus(list[i], {enable:flag});
	}
};

/**************************************************************** 共通 ****************************************************************/
/**
 * 화면 Object의 문자열 표시 처리
 * @param {string} id :Object의 ID
 * @param {string} string :표시할 문자열
 */
Common.setText = function(id, str)
{
	var textNode;
	if(typeof id === String||typeof id === "string"){
		textNode = document.getElementById(id);
		if(!textNode || str == undefined){
			alert("id=" + id + " : string=" + str);
			return;
		}
	}
	else if(typeof id === Object){
		textNode = id;
	}
	else{
		return;
	}
	switch(textNode.nodeName.toLowerCase())
	{
		case "div":
		case "textarea":
		case "option":
		case "span":
		case "p":
			while(textNode.firstChild){
				textNode.removeChild(textNode.firstChild);
			}
			if(str instanceof Array)
			{
				var tmp;
				for(var i = 0, il = str.length; i < il; i++)
				{
					tmp=document.createElement("p");
					tmp.innerHTML=str[i];
					textNode.appendChild(tmp);
				}
			}
			else
			{
				//textNode.appendChild(document.createTextNode(str));
				//textNode.innerHTML = str;
				textNode.innerHTML=(str=="")?"&nbsp;":str;
			}
			break;
		case "input":
			textNode.setAttribute("value",str);
			break;
		default:
			break;
	}
};

/**
 * 화면 Object의 Image표시 처리
 * @param {string} id : Object ID
 * @param {string} src : Image의 Hendle
 */
Common.setImage = function (id, src)
{
	var imgNode = document.getElementById(id);
	if(!imgNode || !src || imgNode.src == src){
		alert("id=" + id + " : src=" + src);
		return;
	}
	imgNode.setAttribute("src", src);
};

/**
 * Text를 취득 한다.
 * @param {string} id : Text를 취득하는 Object ID
 * @return {string} : 지정된 ID의 Text
 */
Common.getText = function (id)
{
	var obj = document.getElementById(id);
	if(!obj || !id){
		return;
	}
	return obj.firstChild.nodeValue;
};

/**
 * 화면 Object의 Text Color변경 처리<br>
 * Off의 경우, #000000지정
 * disable의 경우, #ADAAAD지정
 * @param {string} id : Object의 ID
 * @param {string} color : Text의 Color
 */
Common.setTextColor = function(id, color)
{
	if(!id || !color){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		obj.style.color = color;
	}
};

/**
 * Object의 표시/비표시를 처리
 * @param {string} id : 표시를 변경하는 Object ID
 * @param {string} attr : display를 지정하는 문자열(none, block)
 */
Common.changeVisibility = function(id, attr)
{
	var obj = document.getElementById(id);
	if(!id || !attr || !obj){
		return;
	}
	if(obj.style.display != attr) {
		obj.style.display = attr;
	}
};

/**
 * HTML Element를 작성
 * @param {string} tag : Tag명
 * @param {object} attrs: Teg에 할당된 속성
 * @return 작성된 Tag의 Element
 */
Common.getNewElement = function(tag,attrs)
{
	var result = null;
	if(tag)
	{
		result=document.createElement(tag);

		if(attrs.id){	result.setAttribute("id",attrs.id);	}
		if(attrs.className){	result.setAttribute("class",attrs.className);	}
	}
	return result;
};

/**
 * Event를 할당한다.（사용되지 않고 있다)
 * @param {string} id : Tag ID
 * @param {string} eventName : Event의 종류
 * @param {event} event : 할당된 Event
 */
Common.setEvent=function(id,eventName,event)
{
	var obj=document.getElementById(id);
	if(obj&&eventName&&event){
		if(obj.attachEvent)obj.attachEvent(eventName,event);
		else if(obj.addEventListener)obj.addEventListener(eventName,event,false);
	}
};

/**
 * 문자열의 Bytes수를 계산한다.
 * @param {string} str : 문자열
 * @return {int} cnt : 문자열의 Byte수(반각 기준)
 */
//Common.getStringByteNumber=function(str)
Common.getStringSize = function(str)
{
	var cnt = 0;
	var c;
	for(var i=0; i<str.length; i++){
		c = str.charCodeAt(i);
		//Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
		//Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
		if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
			cnt++;
		}else{
			cnt += 2;
		}
	}
	return cnt;
};

Common.getLocalNumber = function(x) {
//	return (x.toLocaleString)?x.toLocaleString():(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
//	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if(typeof x != "number") return"";
	var _arr=[],_str = x.toString(),len=_str.length-1;
	for(var i=0;i<_str.length;i++){
		_arr[_arr.length]=_str[len-i];
		if(i%3==2)_arr[_arr.length]=",";
	}
	if(_arr[_arr.length-1]==",") _arr.pop();
	return _arr.reverse().join('');
};
/**
 * 지정된 문자열을 잘라 문자열을 분활 한다.
 * @param {string} str : 문자열
 * @param {int} num : 잘라낼 문자열 Bytes수
 * @return {array} strArray : 분할한 문자열 배열
 */

Common.splitString=function (str, num, cnt)
{
	var strArray = [];
	var tmp = [];

	var nowByte = 0;
	var i = 0;
	var c;

	var step=0;
	while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step < num)		//이하의 내용일 경우
		{
			//문자열을 Copy
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte+=step;
		}
		else if(nowByte+step == num)	//상한에 도달한 경우
		{
			//문자열을 Copy
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte+=step;
			//문자열을 격납하고, tmp를 초기화
			strArray[strArray.length] = tmp.join("");
			tmp = [];
			nowByte = 0;
		}
		else if(nowByte+step > num)	//상한을 초과하는 경우
		{
			//문자열을 격납하고, tmp를 초기화
			strArray[strArray.length] = tmp.join("");
			tmp = [];
			nowByte = 0;

			//문자열을 Copy
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte+=step;
		}
	}

	if(tmp.length > 0){
		strArray[strArray.length] = tmp.join("");
	}
	tmp = null;

	if(cnt&&strArray.length<cnt)
	{
		for(var i=strArray.length;i<cnt;i++)
		{
			strArray[i]="";
		}
	}
	return strArray;
};

Common.splitStr = function (str, chunkSize){
	var chunks = [];
	while (str) {
	    if (str.length < chunkSize) {
	        chunks.push(str);
	        break;
	    }
	    else {
	        chunks.push(str.substr(0, chunkSize));
	        str = str.substr(chunkSize);
	    }
	}
	return chunks;
};

Common.getIdx=function(id){return parseInt(id.substring(id.length, id.length-1));};

/**
 * 문자의 폭을 판단한다.
 * @param {string} c : 문자열
 * @return {bool} true: 전각, false:반각
 */
Common.isEmSizeCharacter = function(c)
{
	var width = true;
	//Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
	//Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
	if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
		width = false;
	}
	return width;
};

/**
 * 문자열을 지정된 Bytes수로 자른다
 * @param {string} str : 문자열
 * @param {int} bytes : 잘라낼 Bytes수
 * @return {string} : 지정 Bytes수로 잘라낸 문자열
 */
Common.cutStringWidth = function(str, num)
{
	var tmp = [];

	var nowByte = 0;
	var i = 0;
	var c;

	var step=0;
	while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step <= num)
		{
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte += step;
		}
		else
		{
			break;
		}
	}
	return tmp.join("");
};

/**
 * List에서 Index를 반환 /Lib문제로 Prototype대신 별도의 Function으로 작성
 * @param {Array} collection
 * @param {object} obj
 * @return {int} idx : 대상이 없는 경우는 -1
 */
Common.indexOf = function(collection,obj)
{
	var idx = -1;
	if(collection instanceof Array)
	{
		for(var i = 0,il = collection.length; i < il; i++)
		{
			if(collection[i] == obj)
			{
				idx=i;
				break;
			}
		}
	}
	return idx;
};

Common.contains = function(collection,obj){
	return (this.indexOf(collection,obj) > -1);
};

/**
 * 해당 Element의 CSS Class를 설정
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 해당하는 Class의 이름
 */
Common.setClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		obj.className = arg;
	}
};

Common.getClassList = function(obj){
	return obj.className.split(" ");
};

Common.setClassList = function(obj, lst){
	obj.className = lst.join(" ");
};

/**
 * 해당 Element의 CSS Class를 추가
 * @param {string} id : 추가할 Object의 ID
 * @param {string} arg : 추가된 Class의 이름
 */
Common.addClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		if(obj.classList) {
			obj.classList.add(arg);
		}
		else{
			var lst = Common.getClassList(obj);
			var idx = Common.indexOf(lst, arg);
			if(idx == -1) {
				lst.push(arg);
				Common.setClassList(obj, lst);
			}
		}
	}
};

/**
 * 해당 Element의 CSS Class를 제거
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 제거된 Class의 이름
 */
Common.removeClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		if(obj.classList){
			obj.classList.remove(arg);
		}
		else{
			var lst = Common.getClassList(obj);
			var idx = Common.indexOf(lst, arg);
			while(idx > -1) {
				lst.splice(idx, 1);
				idx = Common.indexOf(lst, arg);
			}
			Common.setClassList(obj, lst);
		}
	}
};
/**
 * 해당 Element의 CSS Class를 Toggle
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : Toggle된 Class의 이름
 */
Common.toggleClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		obj.classList2.toggle(arg);
	}
};


Common.compareStr = function(strInput, strOutput)
{
	var i;
	for( i = strOutput.length, il = 0; i > il; --i) {
		if(strInput[i] == strOutput[i]) {
			break;
		}
	}
	return i+1;
};

Common.trimByEncodingSize = function(str, size)
{
	var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
	var trimedStr = encodedStr.substr(0, size);
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult);
};
Common.getDecode = function(str)
{
	var result;
	try
	{
		result = decodeURIComponent(str);
	}
	catch(ex)
	{
		var pattern = /%[^%]+$/;
		var trimStr = str.replace(pattern,'');
		result = Common.getDecode(trimStr);
	}
	return result;
};

Common.trimEncodedString = function(str, length)
{
	var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
	var trimedStr = encodedStr.substr(0, length);
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult);
};

/**
 * Page를 Click할 때의 Event/현재의 Page의 OnPageClick Event
 */
function onPageClick()
{
	var currentPage = PageManager.getCurrentPage();
	if(currentPage){
		if(currentPage.onPageClick)currentPage.onPageClick();
	}
};

/**
 * Object가 Null 또는 Empty상태일 때의 판별
 */
Common.isNullOrEmpty = function(obj){
	var result = false;
	switch(typeof obj){
		case "undefined":
			result = true;
			break;
		case "object":
			if(obj === null){
				result = true;
			}
			break;
		case "string":
			if(obj === null || obj === ""){
				result = true;
			}
			break;
		default:
			//console.log(obj);
			break;
	}
	return result;
};

Common.removePrefix = function(str){
	var pattern = /([^:]+)$/;
	var result = str.match(pattern);
	return result[1];
};

// Changes XML to JSON
Common.xmlToJson = function(xml)
{
	// Create the return object
	var obj = {};
	/*if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
		for (var j = 0; j < xml.attributes.length; j++) {
			var attribute = xml.attributes.item(j);
			obj["@attributes"][this.removePrefix(attribute.nodeName)] = attribute.nodeValue;
		}
	}*/
	// do children
	if (xml.hasChildNodes()) {
		for (var i = 0, iMax = xml.childNodes.length; i < iMax; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = this.removePrefix(item.nodeName);
			if (item.nodeType == 1) {//object
				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = this.xmlToJson(item);
				}
				else {
					if (typeof (obj[nodeName].length) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
						obj.flg=true;
					}
					obj[nodeName].push(this.xmlToJson(item));
				}
			}
			else if (item.nodeType == 3) {// text
				obj = item.nodeValue;
			}
		}
		if(obj.flg == true){
			var old = obj[nodeName];
			obj = old;
		}
	}
	return obj;
};

Common.getIndex = function(collection,_value){
	var idx = -1;
	var tmp;
	for(var i = 0, iMax = collection.length; i < iMax; i++){
		tmp = collection[i];
		if(tmp.value == _value){
			idx = i;
			break;
		}
	}
	return idx;
};

Common.getKey = function(collection,_value){
	var key = "";
	var tmp;
	for(var i = 0, iMax = collection.length; i < iMax; i++){
		tmp = collection[i];
		if(tmp.value == _value){
			key = tmp.key;
			break;
		}
	}
	return key;
};

Common.setIndex = function(_id,_idx){
	var obj = document.getElementById(_id);
	if(obj && obj.tagName.toLowerCase() == "select"){
		obj.selectedIndex=_idx;
	}
};

Common.replaceStrAtArray = function(_collection,_key,_value){
	var _result = new Array(_collection.length);
	for(var i = 0, iMax = _collection.length, _msg; i < iMax; i++){
		_result[i] = _collection[i].replace(_key,_value);
	}
	return _result;
};

/**
 * 로그인후, 메뉴서비스 표시를 위해 서버전송 Request함수
 * @param {Function} callback 메뉴페이지 표시처리 Response함수
 * @param {Array} data 메뉴페이지 표시를 위한 필요데이터
 */
Common.DoPureLoginChkReq = function(data,callback)
{
	KISUtil.debug("Common.DoPureLoginChk", "excute");

	if(!glbConfig.SERVER_IP){
		return;
	}

	var httpRequest = createXMLHttpRequest();

	var url = (glbConfig.SERVER_SSL) ? "https://" : "http://";
	url = url + glbConfig.SERVER_IP + ":" + glbConfig.SERVER_PORT;

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange", "excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	        }else{
				KISUtil.debug("PureLoginChk Ajax Fail", this.status);
	        	clearTimeout(glbInfo.loginTimer);
				var param = {type:"startup",title:Msg.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };

    httpRequest.open("POST", url, true);
    httpRequest.timeout=CONFIG.ENV.TIMEOUTS.LOGIN||60000;
	httpRequest.withCredentials = true;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * OTID 로그인 후 처리 함수
 * 2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
 */
Common.DoPureLoginChkResp = function()
{
	KISUtil.debug("Common.DoPureLoginChkResp","excute");

	try{
		var data = JSON.parse(this.responseText);
	}catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
		WarnPopup._param = param;
		PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
		return;
	}

	KISUtil.debug(data.status+"/responseText", this.responseText);

	//WidgetLib.setWidgetStatus("btn_LP_login", {enable:true});		//login버튼 활성화
	//WidgetLib.setWidgetStatus("btn_LP_drctPrint", {enable:false});//print버튼 활성화

	if(data.status == 'success'){
		//glbInfo.userBalance = parseInt(data.chargeRemains);
		glbInfo.displayName = data.displayName; //TODO 이후 서버로부터 제공된 유저명 사용

		//print 화면으로 이동 처리
		var service = OTIDPopup.targetService;
		if(service.type == "print" && flg_Dummy_Beep){//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230 - 크롬 디버깅 코드
			service.iframe = addr_print;
			KISUtil.debug("service.iframe","excute");
		}
		ServiceSelectPage.isBtnAvailable = false;
		ServiceManager.callService({name : service.type, url : (service.iframe)}, {
			doneFunc:function(){
				ServiceSelectPage.isBtnAvailable = true;
			},
			errorFunc:function (){
				var param = {type : "startup", title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_ENV, targetPage : false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
		}});

		PageManager.changePage(ServiceSelectPage, PageManager.type.NORMAL);
		return;
	}else{
		var msg = (data.reason) ? {title : Msg.WarnPopup.title, message : data.reason} : {title : Msg.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
		var param = {type:"startup", title : msg.title, message : msg.message, targetPage : false};
		WarnPopup._param = param;
		var targetPopup = WarnPopup;
	}

	PageManager.changePage(targetPopup,PageManager.type.NORMAL);
};

Common.languageChk = function(arg)
{
	switch(arg){
		case 'ko':
			return Msg_lang.ko.Common.Lang;
		case 'en':
			return Msg_lang.en.Common.Lang;
		case 'ja':
			return Msg_lang.ja.Common.Lang;
		case 'ch':
			return Msg_lang.ch.Common.Lang;
		default:
			return Msg_lang.en.Common.Lang;
	}
}