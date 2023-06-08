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
	if(glbInfo.availableCSInfo){
		var services = glbInfo.availableCSInfo;
		var tmp, obj, idx, csExcuteInfo = {},icons,_svName;
		for(var i in services){
			tmp = services[i];
			idx = (1+parseInt(i));
			obj = {id:"btn_SS_service0"+idx, type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"icn_SS_service0"+idx },status:{enable:true}};
			icons=_getServiceIcons(tmp.type);
			if(icons){
				obj.attr.offImg = icons.offImg;
				obj.attr.pressImg = icons.pressImg;
				obj.attr.disableImg = icons.disableImg;
			}
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
			case "SCAN":
			case "FAX":
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
			case "SCAN":
			case "FAX":
				result = {offImg : Img["IMG_SS_"+key+"_OFF"], pressImg : Img["IMG_SS_"+key+"_PRESS"], disableImg : Img["IMG_SS_"+key+"_DIS"]};
				break;
		}
		return result;
	}
};

ServiceSelectPage._onPageChange = function()
{
	this.updateDisplay();
};

ServiceSelectPage.SoftKeypadCheck = function(id)
{
	// 문자열 확인
	if(id.indexOf("btn_num_key") > -1){
		// softkeypad에서 입력된 문자열
		var _num = id.substring(11,12);
		var result = "btn_SS_service0" + _num;
		return result;
	}else{
		// menu에서 입력된 문자열
		return id;
	}
}
/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
ServiceSelectPage.updateDisplay = function()
{
	Common.setText('tit_SS_header',Msg.SERVICE_SELECT.GUIDE_MESSAGE);

	var tmp =(glbConfig.isPrintUse)?'inline-block':'none';
	Common.changeVisibility("btn_service01",tmp);
	tmp = (glbConfig.isCopyUse)?'inline-block':'none';
	Common.changeVisibility("btn_service02",tmp);
	tmp = (glbConfig.isScanUse)?'inline-block':'none';
	Common.changeVisibility("btn_service03",tmp);
	tmp = (glbConfig.isFaxUse)?'inline-block':'none';
	Common.changeVisibility("btn_service04",tmp);

	Common.setText('lbl_SS_service01',Msg.SERVICE_SELECT.LBL_PRINT);
	Common.setText('lbl_SS_service02',Msg.SERVICE_SELECT.LBL_COPY);
	Common.setText('lbl_SS_service03',Msg.SERVICE_SELECT.LBL_SCAN);
	Common.setText('lbl_SS_service04',Msg.SERVICE_SELECT.LBL_FAX);

	if(glbInfo.userBalance){
		Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + formatWithRemainders(glbInfo.userBalance)+" "+Msg.UNIT.WON);
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
				case "btn_stop_key":
					BrowserExt.Beep(0);
					ConfirmPopup.popupType = "LOGOUT";
					ConfirmPopup.msg = Msg.CONFIRM.GUIDE_LOGOUT;
					PageManager.changePage(ConfirmPopup,PageManager.type.MODAL);
					break;
				case "btn_SS_service01":
				case "btn_SS_service02":
				case "btn_SS_service03":
				case "btn_SS_service04":
				case "btn_num_key1":
				case "btn_num_key2":
				case "btn_num_key3":
				case "btn_num_key4":
					id = this.SoftKeypadCheck(id);
					if(!this.isBtnAvailable) return;
					var idx = parseInt(id.slice(id.length-2))-1;
					var service = glbInfo.availableCSInfo[idx];
					if(service){
						BrowserExt.Beep(0);

						if(service.type == "print"){//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
							OTIDPopup.targetService = service;
							PageManager.changePage(OTIDPopup, PageManager.type.NORMAL);
							//document.getElementById("tbx_OTID").focus(); 키보드가 나오는 기종이 있어 focus 삭제
							document.getElementById("tbx_OTID");
							return;
						}

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
						// softkey 비표시
						//document.getElementById("soft_core_keypad").style.display = "none";
						// CS와 MFD 기능 구분
						if(service.func){
							//BrowserExt.Beep(0);
							BrowserExt.SetScreenChange(service.iframe);
						}
						else
						{
							ServiceManager.callService(
								{
									name:service.type,
									url:(service.iframe)
								},
								{
									doneFunc:function (){
										ServiceSelectPage.isBtnAvailable = true;
									},
									errorFunc:function (){
										var param = {type:"startup",title:Msg.WarnPopup.title,message:Msg.ERROR_MESSAGE.FAIL_ENV,targetPage:false};
										WarnPopup._param = param;
										PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
									}
								}
							);
						}
					}
					else{
						BrowserExt.Beep(1);
					}
					break;
				default:
					break;
			}
			break;
		case "onbuttondown":
			MessageManager.clearMessageArea();
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id){
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
