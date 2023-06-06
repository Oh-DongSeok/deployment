/**
 * 개별 페이지의 표시 및 동작용
 * （메뉴 페이지용）
 */
var MenuPage = new TemplatePage();
var ScrollCnt = 0;
var MenuScroll = 0;

MenuPage.ID = "page_menu";
MenuPage.isBtnAvailable = true;
/**
 * 개별 페이지의 Data정의
 */
MenuPage._initModel = function()
{
	this._data=
	{
		buttonList:[
			{
				id: "btn_MP_faxinfo", 	
				type: WidgetLib.ButtonType.NORMAL
			},
			// Language select button
			{	// ko
				id:"btn_MP_language_ko",
				type:WidgetLib.ButtonType.RADIO, status:{on:true},
				attr:{targetImgId:"icn_MP_language_ko",offImg: Img.ICN_LANGUAGE_KO_OFF, pressImg: Img.ICN_LANGUAGE_KO_PRESS, onImg: Img.ICN_LANGUAGE_KO_DIS}
			},
			{	// en
				id:"btn_MP_language_en",
				type:WidgetLib.ButtonType.RADIO, status:{on:false},
				attr:{targetImgId:"icn_MP_language_en",offImg: Img.ICN_LANGUAGE_EN_OFF, pressImg: Img.ICN_LANGUAGE_EN_PRESS, onImg: Img.ICN_LANGUAGE_EN_DIS}
			}

		],
		imageList:[],
		textList:[
			{id:"txt_MP_message", text:Msg.MENU_PAGE.NOTICE_MESSAGE },
		]
	}

	/*
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
	*/
}

MenuPage._onPageChange = function(){
	this.updateDisplay();
};
/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
MenuPage.updateDisplay = function(){
	KISUtil.debug("MenuPage:","updateDisplay");
};

MenuPage._initOthers = function(){
	// Screen Size에 따른 변경.
	var objBar				= document.getElementById("bar_status");
	objBar.style.width 		= glbInfo.screenWidth.toString() + "px";
	var obj 				= document.getElementById("page_menu");
	obj.style.height 		= glbInfo.screenHeight.toString() + "px";
	obj.style.width 		= glbInfo.screenWidth.toString() + "px";
	var objBG 				= document.getElementById("bg_page_menu");
	objBG.style.height 		= glbInfo.pageHeight.toString() + "px";
	objBG.style.width 		= glbInfo.screenWidth.toString() + "px";
	var objContent 			= document.getElementById("lyr_MP_content");
	var tmpHeight 			= glbInfo.pageHeight - 10;
	objContent.style.height = tmpHeight.toString() + "px";

	var objMenu = document.getElementById("lyr_MP_serviceMenu");
	tmpHeight = tmpHeight - 100;
	objMenu.style.height = tmpHeight.toString() + "px";


	var objLang = document.getElementById("lyr_MP_language");
	objLang.style.top = tmpHeight.toString() + "px";

	var objmsg = document.getElementById("lyr_MP_message");
	objmsg .style.top = tmpHeight.toString() + "px";
	var objtxt = document.getElementById("txt_MP_message");
	objtxt.style.top = tmpHeight.toString() + "px";

	if(glbBillingTable){
		var result = Msg.MENU_PAGE.NOTICE_MESSAGE;
		// glbBillingTable.billingPrices[0].blackWhiteSimplexPrice.toString()
		var tmpMsg = Msg.MENU_PAGE.NOTICE_MESSAGE[1].replace(/XX/, glbBillingTable.billingPrices[0].colorSimplexPrice.toString());
		result[1] = tmpMsg.replace(/YY/, glbBillingTable.billingPrices[0].blackWhiteSimplexPrice.toString());
		Common.setText("txt_MP_message", result);
	}else{
		Common.setText("txt_MP_message", Msg.MENU_PAGE.NOTICE_ERROR);
	}
	Common.setText("lbl_MP_faxinfo", Msg.MENU_PAGE.FAX_INFO);
	var objBtnFaxinfo = document.getElementById("btn_MP_faxinfo");
	if(objBG.style.height == "560px"){
		objBtnFaxinfo.style.top = "400px";
	}
	if(objBG.style.width == "1024px"){
		objBtnFaxinfo.style.left = "814px";
	}

	this.initList();
}

MenuPage.changeLanguage = function()
{
	Common.setText("lbl_MP_func_Print", Msg.MENU_PAGE["SERVICE_PRINT"]);
	Common.setText("lbl_MP_func_Copy", Msg.MENU_PAGE["SERVICE_COPY"]);
	if((glbConfigData.SERVICE.SCAN)||(glbConfigData.SERVICE.NATIVE_SCAN != "unused")){
		Common.setText("lbl_MP_func_Scan", Msg.MENU_PAGE["SERVICE_SCAN"]);
	}
	if((glbConfigData.SERVICE.FAX)||(glbConfigData.SERVICE.NATIVE_FAX != "unused")){
		Common.setText("lbl_MP_func_Fax", Msg.MENU_PAGE["SERVICE_FAX"]);
	}

	if(glbBillingTable){
		var result = Msg.MENU_PAGE.NOTICE_MESSAGE;
		var tmpMsg = Msg.MENU_PAGE.NOTICE_MESSAGE[1].replace(/XX/, glbBillingTable.billingPrices[0].colorSimplexPrice.toString());
		result[1] = tmpMsg.replace(/YY/, glbBillingTable.billingPrices[0].blackWhiteSimplexPrice.toString());
		Common.setText("txt_MP_message", result);
	}else{
		Common.setText("txt_MP_message", Msg.MENU_PAGE.NOTICE_ERROR);
	}
	Common.setText("lbl_MP_faxinfo", Msg.MENU_PAGE.FAX_INFO);
}

/**
 * 개별 페이지 고유의 항목을 구성
 */
MenuPage.initList = function()
{
	var attr, txtAttr, imgAttr;
	var lst = document.getElementById("lyr_MP_serviceMenu");
	//func 0-3
	var us;

	var keys = ["Print", "Copy"];
	if((glbConfigData.SERVICE.SCAN)||(glbConfigData.SERVICE.NATIVE_SCAN != "unused")){
		keys.push(UNIT_PRICE_TYPE.SCAN);
		SERVICE_COUNT++;

	}
	if((glbConfigData.SERVICE.FAX)||(glbConfigData.SERVICE.NATIVE_FAX != "unused")){
		keys.push(UNIT_PRICE_TYPE.FAX);
		SERVICE_COUNT++;
	}

	for(var i = 0; i < keys.length; i++){
		us = keys[i];
		attr = {
			id:"btn_MP_func_" + us,
			type:WidgetLib.ButtonType.NORMAL,
			status:{enable:true},
			attr: {
				targetImgId:"img_MP_func_"+us,
				offImg : Img["BTN_MENU_OFF"],
				pressImg : Img["BTN_MENU_PRESS"],
				groupId:"BTN_MP_FUNC"
			}
		};
		txtAttr = {id:"lbl_MP_func_" + us, text:Msg.MENU_PAGE["SERVICE_" + us.toUpperCase()]};
		_btn = Common.getNewElement("div", {id:attr.id, className:"menu_btn"});
		_btn.innerHTML = "<img id='img_MP_func_"+us+"' class='btnBg' /><img id='icn_MP_func_"+ us +"' class='mpIcn' /><div id='"+txtAttr.id+"' class='mpLbl'></div>";
		//_btn.innerHTML = "<img id='icn_MP_func_"+ us +"' class='mpIcn' /><div id='"+txtAttr.id+"' class='mpLbl'></div><img id='img_MP_func_"+us+"' class='btnBg' />";
		lst.appendChild(_btn);
		imgAttr = {id:"icn_MP_func_" + us, src:Img["ICN_FUNC_" + us.toUpperCase()]};

		this._data.buttonList.push(attr);
		this._data.textList.push(txtAttr);
		this._data.imageList.push(imgAttr);
		if(glbInfo.screenType == BrowserLib.ScreenType.WVGA_ALL_SCREEN){
			_btn.style.marginTop 	= "18px";
			_btn.style.marginBottom = "18px";
		}else{
			_btn.style.marginTop 	= "90px";
			_btn.style.marginBottom = "110px";
		}
		// button layout
		var trayObj 	= document.getElementById("lyr_TB_trayInfo");
		var widthObj 	= document.getElementById("lyr_MP_serviceMenu");
		var contentObj 	= document.getElementById("lyr_MP_content");
		var langObj 	= document.getElementById("lyr_MP_language");
		var msgObj 		= document.getElementById("lyr_MP_message");
		var txtObj 		= document.getElementById("txt_MP_message");
		if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
			trayObj.style.left 		= "736px";
			widthObj.style.width 	= "948px";
			widthObj.style.left 	= "33px";
			contentObj.style.width 	= "1014px";
			langObj.style.left 		= "800px";
			msgObj.style.width 		= "800px";
			txtObj.style.width 		= "770px";
		}
		switch (SERVICE_COUNT) {
			case 4:
				var name = keys[i];
				var tmpObj = document.getElementById("btn_MP_func_" + name);
				if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
					tmpObj.style.marginLeft		= "25px";
					tmpObj.style.marginRight	= "25px";
				}else{
					tmpObj.style.marginLeft		= "5px";
					tmpObj.style.marginRight	= "5px";
				}
				break;
			case 3:
				var name = keys[i];
				var tmpObj = document.getElementById("btn_MP_func_" + name);
				if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
					tmpObj.style.marginLeft 	= "38px";
					tmpObj.style.marginRight 	= "38px";
				}else{
					tmpObj.style.marginLeft 	= "38px";
					tmpObj.style.marginRight 	= "38px";
				}
				break;
			default:
				var name = keys[i];
				var tmpObj = document.getElementById("btn_MP_func_" + name);
				if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
					tmpObj.style.marginLeft  	= "104px";
					tmpObj.style.marginRight 	= "104px";
				}else{
					tmpObj.style.marginLeft  	= "104px";
					tmpObj.style.marginRight 	= "104px";
				}
		}

	}
	// 위치 조정

}

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
MenuPage.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler","event:"+event+"/id:"+id);
	switch(event){
		case "onbuttonup":
			BrowserExt.Beep(0);
			if(id.indexOf("btn_MP_func_") != -1){
				var idArray= id.split("_");
				var _idx = idArray[3];
				id = "btn_MP_func";
			}
			switch(_idx)
			{
				case "Print":
					jobSelecter = JOB_TYPE.PRINT;
					PageManager.changePage(OTIDPopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					break;
				case "Copy":
					jobSelecter = JOB_TYPE.COPY;
					PageManager.changePage(CopyMainPage, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					break;
				case "Scan":
					jobSelecter = JOB_TYPE.SCAN;
					PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					break;
				case "Fax":
					break;
			}
			break;
		case "onhardkeydown":
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
