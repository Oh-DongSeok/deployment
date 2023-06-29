/**
 * 개별 페이지의 표시 및 동작용
 * （메뉴 페이지용）
 */
var ServiceSelectPage = new TemplatePage();

ServiceSelectPage.ID = "page_serviceSelect";
ServiceSelectPage.isBtnAvailable = true;

/**
 * 개별 페이지의 Data정의
 */
ServiceSelectPage._initModel = function()
{
	this._data =
	{
		buttonList:[
		//TODO: 추후 확장을 위해 동적구성으로 바꿀것
			//{id:"btn_SS_service01", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"icn_SS_service01", offImg: Img.ICN_SS_PRINT_OFF, disableImg: Img.ICN_SS_PRINT_DIS},status:{enable:false}},
			//{id:"btn_SS_service02", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"icn_SS_service02", offImg: Img.ICN_SS_COPY_OFF, disableImg: Img.ICN_SS_COPY_DIS},status:{enable:false}}
			{id:"btn_SS_logout", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.BTN_SS_LOGOUT_OFF, pressImg: Img.BTN_SS_LOGOUT_PRESS}}
		],
		imageList:[
		],
		textList:[
			{id : "tit_SS_header", text: Msg.SERVICE_SELECT.GUIDE_MESSAGE}
		]
	};
};

/**
 * 개별 페이지의 HTML Tag를 구성 및 등록
 */
ServiceSelectPage._initOthers = function()
{
	/*glbInfo.CSInfo = {"CS_RM_XXXX2":{idx:2,url:""},"CS_RM_XXXX3":{idx:2,url:""}};
	if(glbInfo.CSInfo){
		var services = ["CS_RM_XXXX2",//print:
							"CS_RM_XXXX3"];//copy
		var csExcuteInfo = {};
		for(var i in services){
			tmp = services[i];
			obj = glbInfo.CSInfo[tmp];
			if(obj){
				//실행경로를 설정함(iframe으로 실행시)
				//인덱스를 설정함(changeDisplay로 실행시)
				csExcuteInfo[i] = changeFormatForExcute(tmp);
				//상태를 변경
				//delete this_data.buttonList[i].status;
				this._data.buttonList[i].status.enable=true;
			}
			this._data.buttonList[i].status.enable=true;		//TODO: delete dummy code
		}
		this._dataSet.csExcuteInfo = csExcuteInfo;
	} */
	if(glbInfo.availableCSInfo){
		var services = glbInfo.availableCSInfo;
		var tmp, obj, idx, csExcuteInfo = {},icons,_svName;
		for(var i in services){
			//console.log(i);
			tmp = services[i];
			//this._data.buttonList[i].status.enable = true;
			idx = (1+parseInt(i));
			obj = {id:"btn_SS_service0"+idx, type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"icn_SS_service0"+idx },status:{enable:true}};
			//if(i==1){ obj.status.enable=false; }
			icons=_getServiceIcons(tmp.type);
			if(icons){
				obj.attr.offImg = icons.offImg;
				obj.attr.pressImg = icons.pressImg;
				obj.attr.disableImg = icons.disableImg;
			}
			//console.log(icons);
			this._data.buttonList[idx] = obj;
			_svName = _getServiceName(tmp.type);
			if(_svName) this._data.textList.push({id : "lbl_SS_service0"+idx, text: _svName});
		}
	}
	function _getServiceName(type){
		var result = null;
		var key = type.toUpperCase();
		switch(key){
			case "PRINT":
			case "COPY":
			//case "SCAN":
			//case "FAX":
				result = Msg.SERVICE_SELECT["LBL_"+key]; 
				break;
		}
		return result;
	}
	/**
	 * 서비스버튼 구성용 아이콘 정보 취득용 
	 */
	function _getServiceIcons(type){
		var result = null;
		var key = type.toUpperCase();
		switch(key){
			case "PRINT":
			case "COPY":
			//case "SCAN":
			//case "FAX":
				result = {offImg:Img["IMG_SS_"+key+"_OFF"], pressImg: Img["IMG_SS_"+key+"_PRESS"], disableImg: Img["IMG_SS_"+key+"_DIS"]};
				break;
		}
		return result;
	}
};

ServiceSelectPage._onPageChange = function(){
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
ServiceSelectPage.updateDisplay = function(){
	Common.setText('tit_SS_header',Msg.SERVICE_SELECT.GUIDE_MESSAGE);
	var tmp =(glbConfig.isPrintUse)?'inline-block':'none';
	Common.changeVisibility("btn_service01",tmp);
	tmp = (glbConfig.isCopyUse)?'inline-block':'none';
	Common.changeVisibility("btn_service02",tmp);
	Common.setText('lbl_SS_service01',Msg.SERVICE_SELECT.LBL_PRINT);
	Common.setText('lbl_SS_service02',Msg.SERVICE_SELECT.LBL_COPY);
	if(glbInfo.userBalance){
		Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + formatWithRemainders(glbInfo.userBalance)+" "+Msg.UNIT.WON);
		//Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + new Number(glbInfo.userBalance).zf()+" "+Msg.UNIT.WON);
	}else{
		Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + "0 "+Msg.UNIT.WON);
	}
};
/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
ServiceSelectPage.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_SS_logout":
					BrowserExt.Beep(0);
					//PageManager.changePage(LoginPage,PageManager.type.CANCEL);//서비스페이지가 초기화되지 않음
					//window.location.reload();
					ConfirmPopup.popupType = "LOGOUT";
					ConfirmPopup.msg = Msg.CONFIRM.GUIDE_LOGOUT;
					PageManager.changePage(ConfirmPopup,PageManager.type.MODAL);
					break;
				case "btn_SS_service01":
				case "btn_SS_service02":
				//case "btn_SS_service03":
				//case "btn_SS_service04":
					if(!this.isBtnAvailable) return;
					//ID/PW문자열 존재여부 확인
					var idx = parseInt(id.slice(id.length-2))-1;
					//var service = extendDeep(glbConfig.Services[idx],{});
					//this._dataSet.csExcuteInfo//TODO!!!
					//var service = {name:copy,url:"http://naver.com/"};
					//var service = {name:"print",url:"http://13.197.0.238/dokuwiki/doku.php"};
					//var service = {name:"print",url:"http://localhost:8080/ep_print/?tic="+new Date().valueOf()};
					var service = glbInfo.availableCSInfo[idx];
					if(service){
						BrowserExt.Beep(0);
						ServiceSelectPage.isBtnAvailable = false;
						// Debugging Code 변경
						if(flg_Dummy_Beep){
							switch(service.type){
								case "print":
									service.iframe = addr_print;
									break;
								case "copy":
									service.iframe = addr_copy;
									break;
								case "scan":
									if(service.func == false){
									  service.iframe = addr_scan;
									}
									break;
								case "fax":
									if(service.func == false){
									  service.iframe = addr_fax;
									}
									break;
							}
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
					}
					else{
						BrowserExt.Beep(1);
						//TODO:경고팝업으로
					}
					break;
				default:
					//BrowserExt.Beep(0);
					//clearMessageAreaTimer();
					break;
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
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
			break;
	}
};