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

	LogLib.setLogLevel(LogLib.LEVEL.WRN);

	SystemEventLib.AddNotify("AuthEvent", this.onLoadEvent);

	BrowserExt.Initialize();	//브라우저 확장기능 초기화
	//BrowserExt.EnablePrivilege();	//타서버에의 접근 권한 부여

	//복합기 언어설정에 따른 문자열과 이미지셋 선택
	//var lang = BrowserExt.GetAcceptLanguage();
	//var arrLang = lang.split(",");
	//var _lang = arrLang[0]||"en";
	if(flg_Dummy_Beep){//Chrome Dummy용
		glbInfo.lang = "ko";
	}else{
		var p_glbConfig = window.parent["glbConfig"];
		glbInfo.lang = p_glbConfig.language[p_glbConfig.langCount];
	}
	switch(glbInfo.lang){
		case "ko":
		case "en":
		case "ja":
		case "ch":
			Msg = Msg_lang[glbInfo.lang];
			Extend(Img,Img_lang[glbInfo.lang]);
			break;
		default:
			Msg = Msg_lang["en"];
			Extend(Img,Img_lang["en"]);
			break;
	}

	KISUtil.initDebug("body");

	initModel();
	SoftKeypad.initKeypad("body"); // soft keypad 초기화

	BrowserExt.SetScreenChange("popup:faultAll"); //2016.05.17 Chone 디바이스 에러 화면을 표시함

	quoteParentModule();
	//LogLib.write("IPrint Print --- PRINTER_IP : " + glbConfig.PRINTER_IP, LogLib.LEVEL.WRN);

	//메뉴CS에서 호출되지 않은경우 재기동
	if(!flg_Dummy_Beep&&(!SecureManager)){
		BrowserExt.SetScreenChange("");
		return;
	}
	ContentsLib.contentsName = Msg.Common.CSName;

	Common.doLogin();

	//초기화
	PageManager.init("pageWrapper");

	JobMonitor.init(glbConfig.GetJob.term);//2016.09.01 FXKIS CHONE 프린트 환불 처리

	//대기 페이지로 전환
	PageManager.changePage(FileListPage, PageManager.type.NORMAL);

	//슬라이드 메시지 초기화
	MessageManager.init();

	//CS타이틀 영역 표시
	Common.displayTitleArea();

	/**
	 * 메뉴CS에 정의된 모듈 및 데이터를 인용
	 */
	function quoteParentModule(){
		SecureManager = (!flg_Dummy_Beep)?window.parent["SecureManager"]:"";
		var p_glbInfo = (!flg_Dummy_Beep)?window.parent["glbInfo"]:"";
		glbInfo.userId = (!flg_Dummy_Beep)?p_glbInfo.userId:'12345';
		glbInfo.userPw = (!flg_Dummy_Beep)?p_glbInfo.userPw:'12345';
		glbInfo.displayName = (!flg_Dummy_Beep)?p_glbInfo.displayName:'';
		glbInfo.productCode = (!flg_Dummy_Beep)?p_glbInfo.productCode:'TC101049';
		glbInfo.serialNumber = (!flg_Dummy_Beep)?p_glbInfo.serialNumber:'478009';
		glbConfig.PRINTER_IP = (!flg_Dummy_Beep)?p_glbConfig.PRINTER_IP:'13.197.1.89';
	}
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
		case "LoginChk":
			//console.log(arguments);
			var msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_OTHERS};
			//*//DummyCode start
			//arguments[1]=true;
			//arguments[2]= {rt:"1"};
			//*/
			//DummyCode end
			//excuteToParent("ServiceManager.displayIframe");//★★★Dummy Test때문에 커멘트아웃
			if(arguments[1]===true){
				var obj = arguments[2];
				//console.log(obj);
				//세션만료 케이스
				if(obj.rt == "0"||typeof obj=="undefined"){				//rt가 암호화되지 않은 0인경우 통신오류케이스이므로 배제처리
				//if(obj.rt == "1"||typeof obj=="undefined"){
					excuteToParent("Common.LogOut");		//서비스 종료및 데이터 초기화후 로그인화면으로
					return;
				}
				else{
					//DummyCode start
					/*obj = {rt:"0", msg:"공지사항",UserBalance:"10000.000", JobList:[
						{"JobSeq":"1", "DocName":"doc1", "A3":"0", "Color":"0", "PageCount":"1", "price":"500", "Qty" :"1", "SubmitTime":"2014-04-01 12:00:00.00"},
						{"JobSeq":"2", "DocName":"doc2", "A3":"1", "Color":"1", "PageCount":"10", "price":"1000", "Qty" :"5", "SubmitTime":"2014-04-01 12:00:00.00"},
						{"JobSeq":"3", "DocName":"doc3", "A3":"0", "Color":"1", "PageCount":"100", "price":"2000", "Qty" :"10", "SubmitTime":"2014-04-01 12:00:00.00"},
						{"JobSeq":"4", "DocName":"doc4", "A3":"1", "Color":"1", "PageCount":"10", "price":"1000", "Qty" :"5", "SubmitTime":"2014-04-01 12:00:00.00"},
						{"JobSeq":"5", "DocName":"doc5", "A3":"0", "Color":"1", "PageCount":"100", "price":"1000", "Qty" :"10", "SubmitTime":"2014-04-01 12:00:00.00"},
						{"JobSeq":"6", "DocName":"doc6", "A3":"1", "Color":"1", "PageCount":"10", "price":"1000", "Qty" :"5", "SubmitTime":"2014-04-01 12:00:00.00"},
						{"JobSeq":"7", "DocName":"doc7", "A3":"0", "Color":"1", "PageCount":"100", "price":"1000", "Qty" :"10", "SubmitTime":"2014-04-01 12:00:00.00"}
					]};//*/
					//DummyCode end
					//console.log(obj);
					switch(obj.rt){
						case "0" :
							obj.JobList = _convertTypes(obj.JobList);
							//sort
							//Common.sortList(obj.JobList, glbConfig.docListSortType,"JobSeq");
							glbInfo.docList = obj.JobList;
							obj.msg;
							glbInfo.userBalance = parseInt(obj.UserBalance);
							var currentPage = PageManager.getCurrentPage();
							if(currentPage)
							{
								if(currentPage != FileListPage) {
									PageManager.changePage(FileListPage,PageManager.type.Normal);
								}
								//currentPage.EventHandler.apply(this,arguments);
								//currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
								currentPage.EventHandler(arguments[0], arguments[1], obj);//Dummy용
							}
							return;
						case "1":
							//에러 케이스
							//경고팝업 천이
							msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_LOGIN_INVALID};
							break;
						case "3":
						default :
							msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_SERVER};
							break;
					}
				}
			}
			else{
				msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_TIMEOUT};
			}
			var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			//console.log(obj);
			break;
		case "Action":
		case "CancelJob":
			var msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_OTHERS};
			//console.log(arguments);
			if(arguments[1]===true){
				var obj = arguments[2];
				//console.log(obj);
				//세션만료 케이스
				//if(obj.rt == "0"||typeof obj=="undefined"){
				if(obj.rt == "1"||typeof obj=="undefined"){				//rt가 암호화되지 않은 0인경우 통신오류케이스이므로 배제처리 (Dummy Test용) ★★★삭제요
					excuteToParent("Common.LogOut");		//서비스 종료및 데이터 초기화후 로그인화면으로
					return;
				}
				else{
					var _Arr = obj.split(":"), _tmp;
					var resCnt = {"-1":0,"0":0,"1":0};
					for(var i=0;i<_Arr.length;i++){
						if(typeof resCnt[_Arr[i]] == "number") resCnt[_Arr[i]]++;
					}
					// 종류
					// -1+, 0+, 1+, [0,1]+
					// 그외의 케이스는 존재하지 않음
					if(resCnt["-1"] > 0){
						msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_ENV};
					}
					else if(resCnt["0"] > 0){
						if(resCnt["1"] > 0){
							msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_PRINT_INVALID};
						}
						else{
							msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_PRINT_INVALID_ALL};
						}
					}
					else if(resCnt["1"] > 0){
						//성공
						FileListPage.docListManager.deleteItems();

						if(glbInfo.isDelete){
							glbInfo.isDelete = false;
							//FileListPage.docListManager.refresh();
							Common.doLogin();
						} else {
						//if(event == "Action") {
							glbConfig.JobRunTimeout = setTimeout("PageManager.changePage(FileListPage,PageManager.type.Normal);", glbConfig.JobRunPageDisplayDistance);
						}
						//else{
						//	PageManager.changePage(FileListPage,PageManager.type.Normal);
						//}
						return;
					}
					else{
						msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_OTHERS};
					}
				}
			}
			else{
				msg = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_TIMEOUT};
			}
			var param = {type:"startup", title:msg.title, message:msg.message, targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			//console.log(obj);
			break;
		case "GetDateTime":
			if (arguments[1] == true) {
				var dateTime = arguments[2];
				setDateTime(dateTime.DateTime);
				PageManager.changePage(ResultPopup,PageManager.type.NORMAL);
			} else {
				KISUtil.debug("GetDateTime Fail", "");
				glbDataSet.selectedDoc = {};
				var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};		//TODO DateTime 취득 실패
				var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		case "onbuttonup":
			switch(id)
			{
				case "btn_serviceSelect":
					BrowserExt.Beep(0);
					//excuteToParent("ServiceManager.removeService");
					ConfirmPopup.popupType = "SERVICE_SELECT";
					ConfirmPopup.msg = Msg.Page.CONFIRM.GUIDE_SEVICE_SELECT;
					PageManager.changePage(ConfirmPopup,PageManager.type.MODAL);
				break;
				case "btn_logout":
					//excuteToParent("Common.LogOut",[true]);
					BrowserExt.Beep(0);
					ConfirmPopup.popupType = "LOGOUT";
					ConfirmPopup.msg = Msg.Page.CONFIRM.GUIDE_LOGOUT;
					//PageManager.changePage(PageManager.getPrevPage(),PageManager.type.MODAL);
					PageManager.changePage(ConfirmPopup,PageManager.type.MODAL);
				break;
			}
		default:
			var currentPage = PageManager.getCurrentPage();
			if(currentPage)
			{
				//currentPage.EventHandler.apply(this,arguments);
				currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
			}
			break;
	}
};
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
 * 출력리스트 표시를 위한 함수
 */
Common.doLogin = function(){
	var info = {
		"service":SERVICE_CODE.PRINT,
		"userId":glbInfo.userId,
		"ipAddress":glbConfig.PRINTER_IP,
		"serialNo":glbInfo.serialNumber||"000000",
		"language":glbInfo.lang
	};
	info.userId = (glbConfig.isSHA)? SecureManager_Hash(info.userId) : info.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	//info = extendDeep(info,new SSMILib.LoginChk());//XML용
	//SSMILib.DoLoginChk(info);//XML용
	info = extendDeep(info,glbPrintListInit);
	Common.DoLoginChkReq(info,Common.DoLoginChkResp);
};

function _convertTypes(lst){
	var i, item, tmp, result = [];
	for(i in lst){
		tmp={};
		item = lst[i];
		tmp.JobSeq = parseInt(item.JobSeq);
		tmp.docName = item.DocName;
		tmp.mediumSizeIdx = (item.A3==="1")?1:0;
		tmp.colorIdx = (item.Color==="1")?1:0;
		tmp.pageCnt = parseInt(item.PageCount);
		tmp.printCnt = parseInt(item.Qty);
		tmp.price = parseInt(item.price);
		tmp.printDate = item.SubmitTime;
		result.push(tmp);
	}
	return result;
}

function _convertTypes_new(lst){
	var i, item, tmp, result = [];
	for(i in lst){
		tmp={};
		item = lst[i];
		tmp.JobSeq = parseInt(item.jobSeq);
		tmp.docName = item.docName;
		tmp.paperSize = item.paperSize;
		tmp.colorIdx = (item.colorMode==="1")?1:0;
		tmp.pageCnt = parseInt(item.pageCount);
		tmp.printCnt = parseInt(item.qty);
		tmp.price = parseInt(item.price);
		tmp.printDate = item.submitTime;
		tmp.Nup = (glbConfig.nup)?parseInt(item.Nup):"";
		tmp.outPlex = (glbConfig.outPlex)?parseInt(item.outPlex):"";
		result.push(tmp);
	}
	return result;
}
/*
function decodeJSONData(obj, _key, _iv){
//function decodeJSONData(_decryptor, obj){
	var i, tmp;
	//console.log(obj instanceof Array);
	for(i in obj){
		//console.log(i);
		tmp = obj[i];
		switch(typeof tmp){
			case "object":
				obj[i] = decodeJSONData(tmp, _key, _iv);
				//obj[i] = decodeJSONData(_decryptor, tmp);
				break;
			case "string":
				obj[i] = _decodeMsg(tmp, _key, _iv);
				//obj[i] = _decodeMsg2(_decryptor, tmp);
				break;
			default:
				//console.log("default:"+i+"/"+tmp);
				break;
		}
	}
	return obj;
}
function _decodeMsg(_msg, _key, _iv){
	var _decoded=CryptoJS.AES.decrypt(_msg, _key, {iv:_iv, blockSize :128, mode: CryptoJS.mode.ECB });
	var  result = _decoded.toString(CryptoJS.enc.Utf8);
	_decoded = null;
	return result;
}*/
/*
function _decodeMsg2(_decryptor, _msg){
    return _decryptor.finalize(_msg).toString(CryptoJS.enc.Utf8);
}*/
/**
 * 과금결제내용 표시를 위한 함수
 * @ param {string} docInfo : 가격결제를 위한 document정보
 */
Common.calculateCharge = function(docInfo){
	glbDataSet.priceInfo = _calculateCharge(docInfo);

	/**
	 * 과금금액 연산 (TraySelectionPopup에서도 사용해야하므로 이동 필요 )
	 */
	function _calculateCharge(docInfo){
		KISUtil.debug("_calculateCharge",JSON.stringify(docInfo));
		var priceInfo = {totalPrice:0};

		try{
			for (var i in docInfo){
				priceInfo.totalPrice = priceInfo.totalPrice + docInfo[i].price;
			}
			return priceInfo;
		}
		catch(ex){
			//console.log(ex);
			KISUtil.debug("_calculateCharge/exception",ex);
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_ENV};
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
		}
		return null;
	}
};
//TODO: util.js로 이동
/**
 * Title의 Text와 Icon을 설정
 */
Common.displayTitleArea = function()
{
	//Common.setImage("img_csTitle", Img.CS_TITLE_BAR);
	Common.setImage("icn_csLogo", Img.SERVICE_ICON);
	Common.setText("lbl_csTitle", glbConfig.TITLE_NAME||Msg.Common.CSName);
	var obj = {id:"btn_logout", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.BTN_LOGOUT_OFF, pressImg: Img.BTN_LOGOUT_PRESS}};
	WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
	obj = {id:"btn_serviceSelect", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.BTN_SERVICE_SELECT_OFF, pressImg: Img.BTN_SERVICE_SELECT_PRESS}};
	WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
	Common.changeVisibility("btn_logout", "block");
	Common.changeVisibility("btn_serviceSelect", "block");
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
					tmp.innerHTML=(str[i]=="")?"&nbsp;":str[i];
					textNode.appendChild(tmp);
				}
			}
			else if(typeof str == "string")
			{
				//textNode.innerText = str;
				//textNode.appendChild(document.createTextNode((str=="")?"&nbsp;":str));
				textNode.innerHTML=(str=="")?"&nbsp;":str;
			}
			else{
			}
			break;
		case "input":
			if(textNode["type"]==="image"){
				//textNode.appendChild(document.createTextNode((str=="")?"&nbsp;":str));
				textNode.innerHTML=(str=="")?"&nbsp;":str;
			}
			else{
				textNode.setAttribute("value",str);
			}
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
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} margin : Text의 margin 위치 (left/right/top/bottom)
 * @param {string} margin : Text의 margin 위치값
 */
Common.setPosition = function(id, margin, arg)
{
	if(!id || !margin){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		switch(margin){
			case 'left':
				obj.style.left = arg;
				break;
			case 'right':
				obj.style.right = arg;
				break;
			case 'top':
				obj.style.top = arg;
				break;
			case 'bottom':
				obj.style.bottom = arg;
				break;
			case 'width':
				obj.style.width = arg;
				break;
			case 'height':
				obj.style.height = arg;
				break;
			default:
				break;
		}
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
 * 유저 제한 정보의 취득ユ?ザの制限情報の取得
 * -사양 변경(V1.5.0)
 * -Step2.1에 Refactoring(Copy/Print와 공통화)
 */
Common.getUserPermitInfo = function()
{
	var tempInfo = BrowserExt.getPermitInfo();
	glbDevInfo.permitInfo = [];
	glbDevInfo.permitInfo[PERMIT_CHK.FULL_COLOR] = tempInfo.slice(8,9);
	glbDevInfo.permitInfo[PERMIT_CHK.LIMITED_COLOR] = tempInfo.slice(9,10);
	glbDevInfo.permitInfo[PERMIT_CHK.BW] = tempInfo.slice(10,11);
};

/**
 * 유저의 Color이용 제한 의 판별
 * -Step2.1에 Refactoring
 */
Common.setCmType = function()
{
	with(glbDevInfo)
	{
		if(permitInfo[PERMIT_CHK.FULL_COLOR]==0)
		{
			if(permitInfo[PERMIT_CHK.BW]==0)
			{
				glbDevInfo.cmType = CMType.None;
			}
			else if(permitInfo[PERMIT_CHK.BW]==1)
			{
				glbDevInfo.cmType = CMType.BNW;
			}
		}
		else if(permitInfo[PERMIT_CHK.FULL_COLOR]==1)
		{
			if(permitInfo[PERMIT_CHK.BW]==0)
			{
				glbDevInfo.cmType = CMType.Color;
			}
			else if(permitInfo[PERMIT_CHK.BW]==1)
			{
				glbDevInfo.cmType = CMType.All;
			}
		}
	}
};

/**
 * 유저의 기준ColorMode를 취득
 * -사양변경(V1.5.0) Start
 */
Common.getColorModeDefault = function(){
	var result = 0;
	switch(glbDevInfo.cmType)
	{
		case CMType.All:
			result = 0;		//Color Auto
			break;
		case CMType.Color:
			result = 1;		//Full Color
			break;
		case CMType.BNW:
			result = 2;		//GrayScale
			break;
		case CMType.None:
			result = -1;	//대상외
			break;
		default:
			//error
			break;
	}
	return result;
};

/**
 * 유저의 Color Mode를 확인
 * -사양변경(V1.5.0)
 */
Common.chkColorMode = function(idx){
	var modes = Common.chkColorModes();
	var result = {forbid:modes.status[idx],msg:modes.msg};
	return result;
};
/**
 * 유저의 Color Mode를 확인
 * -사양변경(V1.5.0)
 */
Common.chkColorModes = function()
{
	var result = {};
	switch(glbDevInfo.cmType)
	{
		case CMType.All:
			result = {status:[false,false,false,false],msg:""};
			break;
		case CMType.Color:
			result = {status:[true,false,true,true],msg:Msg.CONFLICT.MSG_R2};
			break;
		case CMType.BNW:
			result = {status:[true,true,false,false],msg:Msg.CONFLICT.MSG_R1};
			break;
		case CMType.None:
			result = {status:[true,true,true,true],msg:""};	//invalid parameter
			LogLib.write("Common.chkColorModes/invalid parameter:0_0",LogLib.LEVEL.WRN);
			break;
		default:
			LogLib.write("Common.chkColorModes/invalid parameter:" + glbDevInfo.cmType, LogLib.LEVEL.WRN);		//error
			break;
	}
	return result;
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
 * 화면 Object의 enable, disable처리
 * @param id {string} : Object의 ID
 * @param enable {boolean} true:enable한다, false:disable한다.
 */
Common.setObjectEnable = function(id, enable){
	if(!id){
		return;
	}
	if(enable){
		WidgetLib.setWidgetStatus(id, {enable:true});
	}else{
		WidgetLib.setWidgetStatus(id, {enable:false});
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
Common.getObjLength = function(obj){
	var cnt=0;
	for(var tmp in obj){
		cnt++;
	}
	return cnt;
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
 * 출력리스트 표시를 위해 서버전송 Request함수
 * @param {Function} callback 출력리스트 표시처리 Response함수
 * @param {Array} data 출력리스트 표시를 위해 필요데이터
 */
Common.DoLoginChkReq = function(data,callback){
	KISUtil.debug("Common.DoLoginChkReq","excute");
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}
	var httpRequest = createXMLHttpRequest();

	var url = (p_glbConfig.SERVER_SSL)?"https://":"http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange","excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	        }
			else{
				KISUtil.debug("DoLoginChkReq Ajax Fail",this.status);
	        	clearTimeout(glbInfo.loginTimer);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.timeout=CONFIG.ENV.TIMEOUTS.LOGIN;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 서버로부터 출력리스트 표시가 완료된 Response함수
 */
Common.DoLoginChkResp = function(){
	KISUtil.debug("Common.DoLoginChkResp:","excute");
	try{
		var data = JSON.parse(this.responseText);
	} catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup = WarnPopup;
		PageManager.changePage(targetPopup,PageManager.type.NORMAL);
		return;
	}
	/*//Dummy Test
	var data = {"status":"success","displayName":"김재관","chargeRemains":"50000","jobList":[{"jobSeq":"1","docName":"Print a documents of A4 COLOR 3 pages","paperSize":"A4","colorMode":"1","pageCount":"3","qty":"1","price":"900","submitTime":"2016-03-23 15:41:49.860"},{"jobSeq":"2","docName":"Print a documents of A4 MONO 1 pages","paperSize":"A4","colorMode":"0","pageCount":"1","qty":"1","price":"60","submitTime":"2016-03-23 15:41:25.33"}],"reason":["출력List전송 성공"]}
	var data = {status:"success", displayName:"유저1",chargeRemains:"10000.000", jobList:[
		{"jobSeq":"1", "docName":"doc1", "paperSize":"A3", "outPlex":"0", Nup:"1", "colorMode":"0", "pageCount":"1", "price":"500", "qty" :"1", "submitTime":"2014-04-01 12:00:00.00"},
		{"jobSeq":"2", "docName":"doc2", "paperSize":"A4", "outPlex":"1", Nup:"2", "colorMode":"1", "pageCount":"10", "price":"1000", "qty" :"5", "submitTime":"2014-04-01 12:00:00.00"},
		{"jobSeq":"3", "docName":"doc3", "paperSize":"A5", "outPlex":"2", Nup:"4", "colorMode":"1", "pageCount":"100", "price":"2000", "qty" :"10", "submitTime":"2014-04-01 12:00:00.00"},
		{"jobSeq":"4", "docName":"doc4", "paperSize":"8.5x11", "outPlex":"1", Nup:"8", "colorMode":"1", "pageCount":"10", "price":"1000", "qty" :"5", "submitTime":"2014-04-01 12:00:00.00"},
		{"jobSeq":"5", "docName":"doc5", "paperSize":"A4", "outPlex":"2", Nup:"1", "colorMode":"1", "pageCount":"100", "price":"1000", "qty" :"10", "submitTime":"2014-04-01 12:00:00.00"},
		{"jobSeq":"6", "docName":"doc6", "paperSize":"B4", "outPlex":"2", Nup:"2", "colorMode":"1", "pageCount":"10", "price":"1000", "qty" :"5", "submitTime":"2014-04-01 12:00:00.00"},
		{"jobSeq":"7", "docName":"doc7", "paperSize":"B5", "outPlex":"1", Nup:"1", "colorMode":"1", "pageCount":"100", "price":"1000", "qty" :"10", "submitTime":"2014-04-01 12:00:00.00"}
	]};*/
	var iframes = window.parent.document.getElementsByTagName("iframe");
	if(iframes.length>0){
		excuteToParent("ServiceManager.displayIframe", null);
	}

	if(data.status=='success'){
		if(data.jobList.length==0){
			var msg = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
			var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			KISUtil.debug("warning/data.jobList", data.jobList);
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			return;
		}
		data.jobList = _convertTypes_new(data.jobList);

		//glbInfo.displayName = data.displayName; //TODO
		glbInfo.docList = data.jobList;//잡리스트
		glbInfo.userBalance = parseInt(data.chargeRemains);
		//sort
		//Common.sortList(data.jobList, glbConfig.docListSortType,"JobSeq"); //로그인시 서버로부터 Paper Size별 전송받으므로 정렬할 필요없음.
		var currentPage = PageManager.getCurrentPage();
		if(currentPage)
		{
			if(currentPage != FileListPage) {
				PageManager.changePage(FileListPage,PageManager.type.Normal);
			}
			//currentPage.EventHandler.apply(this,arguments);
			currentPage.EventHandler('LoginChk', true, data);
		}
		KISUtil.debug("success/responseText", this.responseText);

		return;
	}
	else{
		var msg = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
	}
	var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
	WarnPopup._param = param;
	KISUtil.debug("fail/responseText", this.responseText);
	PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
};

/**
 * 과금결제 표시를 위한 함수
 * @param {boolean} isJobDelete 잡삭제/잡실행 Flag
 * @param {Array} _lst 가격결제 정보 표시를 위한 document정보
 */
Common.doJobStart_Cancel = function(isJobDelete,_lst){
	if(!isJobDelete){//과금팝업창으로 이동
		//진행여부 판단필요시점
		Common.calculateCharge(_lst);
		PageManager.changePage(ChargeInfoPopup , PageManager.type.NORMAL);
	}else{//잡 삭제 실시(서버Request)
		Common.doCancelJob_New(_lst);
	}
};

/**
 * 과금 결제 처리 함수(과금기본정보 생성)
 * @param {string} payType : 과금 결제 Type (직과금/사이버머니/선결제)
 * @param {Array} _lst : 과금 결제할 잡Document 정보
 */
Common.doCharge = function(payType,_lst){
	var jobSeq=[];
	for(var i in _lst){
		jobSeq.push(_lst[i].JobSeq.toString());
	}
	var charge = {
		"service":SERVICE_CODE.PRINT_CHARGE,
		"selectedJobSeq":jobSeq,
		"paymentMethods":payType,
		"userId":glbInfo.userId,
		"ipAddress":glbConfig.PRINTER_IP,
		"serialNo":glbInfo.serialNumber||"000000",
		"language":glbInfo.lang
	};
	KISUtil.debug("Common.doCharge/charge",JSON.stringify(charge));

	charge.userId = (glbConfig.isSHA)? SecureManager_Hash(charge.userId) : charge.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	charge = extendDeep(charge,glbChargeInit);
	Common.DoChargeReq(charge,Common.DoChargeResp);
};

/**
 * 과금 결제 처리를 위해 서버전송 Request함수
 * @param {Function} callback 과금결제처리 Response함수
 * @param {Array} data 과금결제를 위해 필요데이터
 */
Common.DoChargeReq = function(data,callback){
	KISUtil.debug("Common.DoChargeReq","excute");
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}
	var httpRequest = createXMLHttpRequest();

	var url = (p_glbConfig.SERVER_SSL)?"https://":"http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange","excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
        		//2016.05.16 Chone 신용/교통 카드 결제 요청 문구 추가, 신용카드 결제의 경우 response가 오면 결제 금액 문자열 표시 처리
        		var currentPage = PageManager.getCurrentPage();
				if(currentPage && currentPage == PrintingPopup && glbChargeInit && glbChargeInit.paymentMethods == 'typeA'){
					currentPage.updatePriceInfo();
				}

	            callback.call(this);
	        }
			else{
				KISUtil.debug("DoChargeReq Ajax Fail",this.status);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.timeout=ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 서버로부터 과금 결제 처리 완료된 Response함수
 */
Common.DoChargeResp = function(){
	KISUtil.debug("Common.DoChargeResp:","excute");
	try{
		var data = JSON.parse(this.responseText);
	} catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup = WarnPopup;
		PageManager.changePage(targetPopup,PageManager.type.NORMAL);
		return;
	}

	if(data.status=='success'){
		KISUtil.debug("Charge_data:",JSON.stringify(data));

		//2016.09.01 FXKIS CHONE 프린트 환불 처리
		var _balance = parseInt(data.chargeRemains);
		(_balance)? excuteToParent("Common.updateUserBalance",[_balance]):"";//메뉴 화면의 유저 잔액을 갱신해 둠.
		glbInfo.userBalance = parseInt(data.chargeRemains); //유저 잔액을 갱신해 둠.
		/*glbInfo.isJobExcuted = true;
		glbDataSet.selectedDoc=FileListPage.docListManager.getCheckedItems();
		FileListPage.docListManager.deleteItems();
		var page = (glbConfig.campaignImg.length!=0) ? "getDateTime();" : "PageManager.changePage(FileListPage,PageManager.type.Normal);";//켐페인이미지가 존재할 경우 탄소결과 화면을 표시
		glbConfig.JobRunTimeout = setTimeout(page, glbConfig.JobRunPageDisplayDistance);
		return;*/

		JobMonitor.startMonitor({successCallback:function(){
			KISUtil.debug("successCallback", "");
			Common.afterJobProcess();
		}, errorCallback:function(){//지정된 횟수만큼 잡 모니터링 했으나 프린트 잡 미발견 시
			KISUtil.debug("errorCallback", "");
			Common.displayWarnPopup("logout");
		}, cancelCallback:function(){
			KISUtil.debug("cancelCallback", "");
			Common.displayWarnPopup("logout");
		}, jobCount : (typeof data.jobCount != 'undefined')? parseInt(data.jobCount) : FileListPage.docListManager.getCheckedItems().length}, glbConfig.GetJob.count);
	}
	else{
		var msg = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};//잔액 부족등 체크
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	}
};
Common.updateUserBalance = function(_balance){
	glbInfo.userBalance = _balance;
	//Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE +  formatWithRemainders(_balance) + " " + Msg.UNIT.WON);
	//Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + new Number(_balance).zf()+" "+Msg.UNIT.WON);
};

//2016.09.01 FXKIS CHONE 프린트 환불 처리 Start
Common.afterJobProcess = function()
{
	glbInfo.isJobExcuted = true;
	glbDataSet.selectedDoc=FileListPage.docListManager.getCheckedItems();
	FileListPage.docListManager.deleteItems();
	var page = (glbConfig.campaignImg.length!=0) ? "getDateTime();" : "PageManager.changePage(FileListPage,PageManager.type.Normal);";//켐페인이미지가 존재할 경우 탄소결과 화면을 표시
	glbConfig.JobRunTimeout = setTimeout(page, glbConfig.JobRunPageDisplayDistance);
};

//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
Common.displayWarnPopup = function(warningType, detailInfo)
{
	var param = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_PRINT_REFUND, targetPage:false, type:warningType, detail:((detailInfo)? detailInfo : "")};
	WarnPopup._param = param;
	PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
};

Common.doPrintRefundReq = function()
{
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}

	var url = (p_glbConfig.SERVER_SSL) ? "https://" : "http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	var data = {
		"service" : SERVICE_CODE.PRINT_REFUND,
		"jobStatus" : glbInfo.jobStatus,//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		"paymentMethods" : glbChargeInit.paymentMethods,
		"userId" : glbInfo.userId,
		"ipAddress" : glbConfig.PRINTER_IP,
		"serialNo" : glbInfo.serialNumber||"000000",
		'language' : glbInfo.lang
	}

	var httpRequest = createXMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (this.readyState === 4){
			LogLib.write("[CS] IPrint Print RefundReq status : " + this.status, LogLib.LEVEL.WRN);
        	if(this.status === 200) {
        		//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
        		//(Common.doPrintRefundRes).call(this);
        		LogLib.write("[CS] IPrint Print Common.doPrintRefundReq Succeed", LogLib.LEVEL.WRN);
        		Common.printRefundPostProc();//2017.02.02 FXKIS 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
	        }else{
	        	//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
	        	/*KISUtil.debug("Common.doPrintRefundReq ajax failed", this.status);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);*/
	        	//2017.02.02 FXKIS 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
	        	glbInfo.refundCount++;
	        	if(glbInfo.refundCount == MAX_REFUND_COUNT){
	        		LogLib.write("[CS] IPrint Print Common.doPrintRefundReq Failed", LogLib.LEVEL.WRN);
	        		Common.printRefundPostProc();
	        	}else{
	        		LogLib.write("[CS] IPrint Print Common.doPrintRefundReq retry glbInfo.refundCount : " + glbInfo.refundCount, LogLib.LEVEL.WRN);
	        		Common.doPrintRefundReq();
	        	}
	        }
        }
    };

    httpRequest.open("POST", url, true);
    httpRequest.timeout = ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

//2017.02.02 FXKIS 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
Common.printRefundPostProc = function()
{
	SSMILib.LogoutDev();
	BrowserExt.SetScreenChange("allservice");
};

//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
/*Common.doPrintRefundRes = function()
{
	var data = null;
	try{
		data = JSON.parse(this.responseText);
	}catch(error){//JSON 형식이 아닐 경우
		Common.displayWarnPopup("logout");
		return;
	}

	Common.displayWarnPopup("logout", data);
};*/

//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
Common.displayPrintRefundPopup = function(status)
{
	glbInfo.jobStatus = status;
	Common.displayWarnPopup("logout", "refund");
};
//2016.09.01 FXKIS CHONE 프린트 환불 처리 End

/**
 * 잡삭제를 위한 함수
  * @param {Array} _lst 가격결제 정보 표시를 위한 document정보
 */
Common.doCancelJob_New = function(_lst){
	var jobSeq=[];
	for(var i in _lst){
		jobSeq.push(_lst[i].JobSeq.toString());
	}
	//삭제잡 기본정보 생성
	var info = {
		"service":SERVICE_CODE.PRINT_CANCEL,
		"selectedJobSeq":jobSeq,
		"userId":glbInfo.userId,
		"ipAddress":glbConfig.PRINTER_IP,
		"serialNo":glbInfo.serialNumber||"000000",
		"language":glbInfo.lang
	};
	KISUtil.debug("Common.doCancelJob/info",JSON.stringify(info));
	glbInfo.isDelete = true;

	info.userId = (glbConfig.isSHA)? SecureManager_Hash(info.userId) : info.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	info = extendDeep(info,glbJobCancelInit);
	Common.DoActionReq(info,Common.DoActionResp);
};

/**
 * 잡삭제 실행을 위해 서버에 전송하는 Request함수
 * @param {data} 잡삭제를 위한 필요데이터 정보
 * @param {callback} Response함수
 */
Common.DoActionReq = function(data,callback){
	KISUtil.debug("Common.DoActionReq","excute");
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}
	var httpRequest = createXMLHttpRequest();

	var url = (p_glbConfig.SERVER_SSL)?"https://":"http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange","excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	        }
			else{
				KISUtil.debug("DoChargeReq Ajax Fail",this.status);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.timeout=ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 잡삭제 실행을 위해 서버로 부터 전송받은 Response함수
 */
Common.DoActionResp = function(){
	KISUtil.debug("Common.DoActionResp:","excute");
	try{
		var data = JSON.parse(this.responseText);
	} catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup = WarnPopup;
		PageManager.changePage(targetPopup,PageManager.type.NORMAL);
		return;
	}

	if(data.status=='success'){
		glbInfo.isJobExcuted = true;
		FileListPage.docListManager.deleteItems();
		glbInfo.isDelete = false;
		Common.doLogin();//출력 리스트 화면으로 이동
	}else{
		var msg = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MESSAGE.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	}
};

/**
 * 디바이스로 부터 날짜/시간을 취득하는 함수
 */
function getDateTime(){
	var dev = new SSMILib.DeviceInfo("systemInformation", "DateTime");
	dev.requester.successHandler = onGetDateTimeSuccess;
	dev.requester.errorHandler = onGetDateTimeError;
	dev.getDeviceInfo(false);
	return;
}

/**
 * getDateTime의 성공 이벤트 함수
 */
function onGetDateTimeSuccess(res){
	var _dateTimeConf = null;
	if(!res.responseXML) {
		SSMILib.onEvent("GetDateTime", false, _dateTimeConf);
		return;
	}
	_dateTimeConf = SSMILib.attrNodeToObject(res.responseXML);

	if(_dateTimeConf){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetDateTime", _result, _dateTimeConf);

	return;
}

/**
 * getDateTime의 실패 이벤트 함수
 */
function onGetDateTimeError(res){
	var _dateTimeConf = null;
	SSMILib.onEvent("GetDateTime", false, _dateTimeConf);
	return;
}

 /**
 * 일정 기간을 설정하는 함수
 */
function setDateTime(dateTime){
	var start = dateTime.indexOf("T", 0);
	var end = dateTime.indexOf(":");

	var hours = dateTime.substring(start+1, end);
	if( (hours >= 5) && (hours <= 16) ){
		glbInfo.thankScreenState = THANK_SCREEN_STATE.DAY;
	}else if( (hours >= 17) && (hours <= 18) ){
		glbInfo.thankScreenState = THANK_SCREEN_STATE.EVENING;
	}else{
		glbInfo.thankScreenState = THANK_SCREEN_STATE.NIGHT;
	}
}
