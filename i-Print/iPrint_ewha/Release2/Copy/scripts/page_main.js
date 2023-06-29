/**
 * 개별 페이지의 표시 및 동작용
 * （메뉴 페이지용）
 */
var MainPage = new TemplatePage();

MainPage.ID = "page_main";

/**
 * 개별 페이지의 Data정의
 */
MainPage._initModel = function()
{
	this._data =
	{
		pulldownList:{
			common:{
				pullDown:{
					offImg:Img.UIPARTS.PUL_NOR_OFF,		
					pressImg:Img.UIPARTS.PUL_NOR_PRESS,
					onImg:Img.UIPARTS.PUL_NOR_ON,
					disableImg:Img.UIPARTS.PUL_NOR_DIS
				},
				btn:
				{
					top:{
						offImg:Img.UIPARTS.RAD_TOP_OFF,
						onImg:Img.UIPARTS.RAD_TOP_ON,
						disableImg:Img.UIPARTS.RAD_TOP_DIS,
						pressImg:Img.UIPARTS.RAD_TOP_PRESS
					},
					mid:{
						offImg:Img.UIPARTS.RAD_MID_OFF,
						onImg:Img.UIPARTS.RAD_MID_ON,
						disableImg:Img.UIPARTS.RAD_MID_DIS,
						pressImg:Img.UIPARTS.RAD_MID_PRESS
					},
					bot:{
						offImg:Img.UIPARTS.RAD_BOT_OFF,
						onImg:Img.UIPARTS.RAD_BOT_ON,
						disableImg:Img.UIPARTS.RAD_BOT_DIS,
						pressImg:Img.UIPARTS.RAD_BOT_PRESS
					}
					
				}
			},
			list:[
				{key:"inplex",value:[
					{//단면
						icon:{off:Img.FUNC.ICN_P_PLEX_SIMPLEX_OFF},
						iconLeft:{off:Img.FUNC.ICN_L_PLEX_SIMPLEX_OFF},
						text:Msg.Func.plex.simplex,
						value:	JFLib.PLEX.SIMPLEX
					},
					{//양면(좌우열기)
						icon:{off:Img.FUNC.ICN_P_PLEX_DUPLEX_OFF},
						iconLeft:{off:Img.FUNC.ICN_L_PLEX_DUPLEX_OFF},
						text:Msg.Func.plex.duplex,
						text0:Msg.Func.plex.duplex[0],
						text1:Msg.Func.plex.duplex[1],
						value:	JFLib.PLEX.DUPLEX
					},
					{//양면(상하열기)
						icon:{off:Img.FUNC.ICN_P_PLEX_TUMBLE_OFF},
						iconLeft:{off:Img.FUNC.ICN_L_PLEX_TUMBLE_OFF},
						text:Msg.Func.plex.tumble,
						text0:Msg.Func.plex.tumble[0],
						text1:Msg.Func.plex.tumble[1],
						value:	JFLib.PLEX.TUMBLE
					},
					{//책복사
						icon:{off:Img.ICON.ICN_PS},
						iconLeft:{off:Img.ICON.ICN_PS},
						text:Msg.Page.Etc.lblPageSplit
					}
					
				]},
				{key:"outplex",value:[
					{//단면
						icon:{off:Img.FUNC.ICN_P_PLEX_SIMPLEX_OFF},
						iconLeft:{off:Img.FUNC.ICN_L_PLEX_SIMPLEX_OFF},
						text:Msg.Func.plex.simplex,
						value:	JFLib.PLEX.SIMPLEX
					},
					{//양면(좌우열기)
						icon:{off:Img.FUNC.ICN_P_PLEX_DUPLEX_OFF},
						iconLeft:{off:Img.FUNC.ICN_L_PLEX_DUPLEX_OFF},
						text:Msg.Func.plex.duplex,
						text0:Msg.Func.plex.duplex[0],
						text1:Msg.Func.plex.duplex[1],
						value:	JFLib.PLEX.DUPLEX
					},
					{//양면(상하열기)
						icon:{off:Img.FUNC.ICN_P_PLEX_TUMBLE_OFF},
						iconLeft:{off:Img.FUNC.ICN_L_PLEX_TUMBLE_OFF},
						text:Msg.Func.plex.tumble,
						text0:Msg.Func.plex.tumble[0],
						text1:Msg.Func.plex.tumble[1],
						value:	JFLib.PLEX.TUMBLE
					}
				]},
				//magnification
				{key:"magnification",value:[
  					{//등배100%
  						icon:{off:Img.FUNC.ICN_MG_FIX100,dis:Img.FUNC.ICN_MG_FIX100_DIS},
  						text:Msg.Func.magnification.fix100,
  						value:	JFLib.MAG.FIX100
  					},
  					{//용지맞춤
  						icon:{off:Img.FUNC.ICN_MG_AUTO,dis:Img.FUNC.ICN_MG_AUTO_DIS},
  						text:Msg.Func.magnification.auto,
  						value:	JFLib.MAG.AUTO
  					},
  					{//기타
  						icon:{off:Img.FUNC.ICN_MG_OTH,dis:Img.FUNC.ICN_MG_OTH_DIS},
  						text:Msg.Func.magnification.other,
  						value:	""
  					}
  				]},
				{key:"tray",value:[
					{//Auto
						icon:{off:Img.FUNC.ICN_TRAY_AUTO,dis:Img.FUNC.ICN_TRAY_AUTO},
						text:Msg.Func.tray.auto,
						value:	JFLib.INTRAY.AUTO
					},
					{//Tray1
						icon:{off:"./image/ICN_TRAY_LEF_UNKNOWN.png",dis:"./image/ICN_TRAY_LEF_UNKNOWN_DIS.png"},
						text0:"",
						text1:"",
						value:	JFLib.INTRAY.TRAY1
					},
					{//Tray2
						icon:{off:"",dis:""},
						text0:"",
						text1:"",
						value:	JFLib.INTRAY.TRAY2
					},
					{//Tray3
						icon:{off:"",dis:""},
						text0:"",
						text1:"",
						value:	JFLib.INTRAY.TRAY3
					},
					{//Tray4
						icon:{off:"",dis:""},
						text0:"",
						text1:"",
						value:	JFLib.INTRAY.TRAY4
					}
				]},
				//colorMode
				{key:"colorMode",value:[
					{//컬러
						icon:{off:Img.FUNC.ICN_CM_CLR,dis:Img.FUNC.ICN_CM_CLR},
						text:Msg.Func.colorMode.color,
						value:	JFLib.CM.COLOR
					},
					{//흑백
						icon:{off:Img.FUNC.ICN_CM_BW,dis:Img.FUNC.ICN_CM_BW},//TODO change
						text:Msg.Func.colorMode.bw,
						value:	JFLib.CM.BW
					}
				]}
			]},
		buttonList:[
		    {id:"btn_MP_pageType_0", type:WidgetLib.ButtonType.RADIO, status:{on:true}, attr:{targetImgId:"img_MP_pageType_0", offImg: Img.UIPARTS.RAD_HRZ_POT_OFF, pressImg: Img.UIPARTS.RAD_HRZ_POT_PRESS, onImg: Img.UIPARTS.RAD_HRZ_POT_ON, groupId:"BTN_MP_PAGETYPE"}},
		    {id:"btn_MP_pageType_1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MP_pageType_1", offImg: Img.UIPARTS.RAD_HRZ_LAN_OFF, pressImg: Img.UIPARTS.RAD_HRZ_LAN_PRESS, onImg:Img.UIPARTS.RAD_HRZ_LAN_ON, groupId:"BTN_MP_PAGETYPE"}},
			{id:"btn_MP_etcFunc", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_MP_etcFunc", offImg: Img.UIPARTS.BTN_NOR_OFF, pressImg: Img.UIPARTS.BTN_NOR_PRESS}},
			//{id:"btn_usb_chk", type:WidgetLib.ButtonType.TOGGLE, attr:{targetImgId:"img_usb_chk", offImg: Img.UIPARTS.BTN_USB_OFF, pressImg: Img.UIPARTS.BTN_USB_PRESS, onImg: Img.UIPARTS.BTN_USB_ON}},
			{id:"btn_MP_pages_down", type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg: Img.ICON.BTN_DCR_OFF, pressImg: Img.ICON.BTN_DCR_PRESS, disableImg: Img.ICON.BTN_DCR_DIS}},
			{id:"btn_MP_pages_up", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_ICR_OFF, pressImg: Img.ICON.BTN_ICR_PRESS, disableImg:Img.ICON.BTN_ICR_DIS}},
			{id:"btn_MP_Start", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_MP_Start", offImg: Img.UIPARTS.BTN_OPN_OFF, pressImg: Img.UIPARTS.BTN_OPN_PRESS, disableImg: Img.UIPARTS.BTN_OPN_DIS}}
		],
		imageList:[
			{id:"icn_MP_pageType_0", src:Img.ICON.ICN_DOC_POT_OFF},
			{id:"icn_MP_pageType_1", src:Img.ICON.ICN_DOC_LAN_OFF}
		],
		textList:[
			//타이틀
			{id:"tit_MP_pageType",	text:Msg.Page.Main.titPageType},
			{id:"tit_MP_outplex",	text:Msg.Page.Main.titOutplex},
			{id:"tit_MP_inplex",	text:Msg.Page.Main.titInplex},
			{id:"tit_MP_magnification",	text:Msg.Page.Main.titMagnification},
			//{id:"tit_MP_nup",	text:Msg.Page.Main.titNup},
			{id:"tit_MP_tray",	text:Msg.Page.Main.titTray},
			{id:"tit_MP_colorMode",	text:Msg.Page.Main.titColorMode},
			{id:"tit_MP_pageSet",	text:Msg.Page.Main.titPageSet},
			//위젯 용
			{id:"lbl_MP_inplex",	text:Msg.Func.plex.simplex},
			{id:"lbl_MP_outplex",	text:Msg.Func.plex.simplex},
			{id:"lbl_MP_magnification",	text:Msg.Func.magnification.fix100},
			//{id:"lbl_MP_nup",	text:Msg.Func.nup.none},
			{id:"lbl_MP_tray",	text:Msg.Func.tray.auto},
			{id:"lbl_MP_colorMode",	text:Msg.Func.colorMode.bw},
			{id:"lbl_MP_etcFunc",	text:Msg.Page.Main.lblEtcFunc},
			//{id:"lbl_usb_chk",	text:Msg.Page.Main.lblUsbChk},
			{id:"lbl_MP_pages",	text:"1" + Msg.Page.Main.lblUtilStr},
			{id:"lbl_MP_Start",	text:Msg.Page.Main.lblStart}
		]
	};

	var arg={
		key:"MainPage.pagesSpinner",
		number:this._dataSet.copies,
		min:glbConfig.Quantity.Min,
		max:glbConfig.Quantity.Max,
		labelId:"lbl_MP_pages",
		btnUpId:"btn_MP_pages_up",
		btnDnId:"btn_MP_pages_down",
		unitStr:Msg.Page.Main.lblUtilStr,
		callback:{
			onChange:function(val){
				//console.log("onChangeValue");
				if(val) glbDataSet.copies = val;
			}
			/*
			min:function(){
				MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.Main.slideCopiesOverMin, true);
			},
			max:function(){
				MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.Main.slideCopiesOverMax, true);
			},
			inputHardkeyMax:function(){
				MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.Main.slideCopiesOverMaxVal, true);
			},
			onChange:function(val){
				console.log("onChangeValue");
				if(val) glbDataSet.copies = val;
			}*/
		}
	};
	this.pagesSpinner = new Spinner(arg);
	
};

/**
 * プルダウンを構成
 * templatePage.jsから移動
 */	
MainPage.initPullDown = function(){
	//pulldown
	var pulldownList = this._data.pulldownList;
	if(pulldownList == null) {
		return;
	}
	var obj;
	var node;
	var tmp;
	for(var i = 0, il = pulldownList.list.length; i < il; i++) {
		obj = pulldownList.list[i];
		if(obj.key=="tray"){
			document.body.appendChild(Common.createHTMLPulldown("MP", obj.key, obj.value.length, true));
		}else{
			document.body.appendChild(Common.createHTMLPulldown("MP", obj.key, obj.value.length, false));
		}
		for(var j = 0, jl = obj.value.length; j < jl; j++) {
			node = obj.value[j];
			//tmp = pulldownList.common.btn;
			tmp = pulldownList.common.btn[(j==0)?"top":((j==(jl-1))?"bot":"mid")];
			tmp.targetImgId = "img_MP_" + obj.key + "_menu_" + j;
			
			WidgetLib.registerButtonWidgetById("btn_MP_" + obj.key + "_menu_" + j, WidgetLib.ButtonType.RADIO, tmp);
			if(obj.key != "tray" || (obj.key == "tray" && j==0) ){
				Common.setImage("icn_MP_" + obj.key + "_menu_" + j, node.icon.off);
				//Common.setText("lbl_MP_" + obj.key + "_menu_" + j, node.text);
				if(glbInfo.lang=='en' && (obj.key=="inplex"||obj.key == "outplex") && (j==1||j==2)){
					Common.setText("lbl_MP_" + obj.key + "_menu_" + j + "_1", node.text0);
					Common.setText("lbl_MP_" + obj.key + "_menu_" + j + "_2", node.text1);
				}else{
					Common.setText("lbl_MP_" + obj.key + "_menu_" + j, node.text);
				}
			}
		}
		//Common.setImage("img_MP_" + obj.key + "_popup_top", pulldownList.common.popup.top);
		//Common.setImage("img_MP_" + obj.key + "_popup_bottom", pulldownList.common.popup.bottom);
		Common.setImage("icn_MP_" + obj.key, obj.value[0].icon.off);
		Common.setText("lbl_MP_" + obj.key, obj.value[0].text);
		var popupId = "pul_MP_" + obj.key + "_popup";
		var pullBtnAttr = pulldownList.common.pullDown;
		pullBtnAttr.targetImgId = "img_MP_" + obj.key;
		pullBtnAttr.popupId = popupId;
		WidgetLib.registerPopupWidgetById(popupId, WidgetLib.PopupType.MODAL);
		WidgetLib.registerButtonWidgetById("pul_MP_" + obj.key, WidgetLib.ButtonType.POPUP, pullBtnAttr);
		
		if(obj.key == "tray"){
			WidgetLib.setWidgetStatus("pul_MP_tray", {enable:true});
			var obj = document.getElementById("pul_MP_tray");
			var preClass = obj.getAttribute("class");
			/*if(preClass){
				obj = obj.setAttribute("class", preClass + " disableFont" );
			}*/
		}
	}
} ;

/**
 * 풀다운 목록
 */
MainPage.pullDownList = ["inplex", "outplex","magnification","tray","colorMode"];

/**
 * 풀다운항목을 표시
 */
MainPage.displayPullMenuBtn = function(idx)
{
	var id = "pul_MP_" + this.pullDownList[idx] + "_popup";
	var node = WidgetLib.getWidgetNode(id);
	if(!node)
	{
		//create
		createPullMenuBtn(this.pullDownList,idx);
		WidgetLib.registerPopupWidgetById(id, WidgetLib.PopupType.MODAL);
	}
	WidgetLib.openPopupWidget(id);
	this.displayPullMenuPopup(idx);
	Common.changeVisibility(id, "block");
};

/**
 * 풀다운이미지를 설정
 */
MainPage.displayPullMenuPopup = function(idx)
{
	var key = this.pullDownList[idx];
	var pullIdx = this._dataSet[key + "Idx"];
	var length = (key=="tray")?glbInfo[key].length+1:glbInfo[key].length;
	this.updatePullMenuPopup(key, pullIdx, length);
	var id = "pul_MP_" + key + "_popup";
	Common.changeVisibility(id, "block");
};

/**
 * 풀다운항목갱신
 */
MainPage.updatePullMenuPopup = function(key, idx, length) {
	var id;
	for (var i = 0; i < length; i++) {
		id = "btn_MP_" + key + "_menu_" + i;
		var btnStatus = (key=='colorMode'&&glbDevInfo.isMono)?{enable:(i == idx),on:(i == idx)}:{on:(i == idx)};//흑백기 일때 컬러 버튼 Disable
		(key=='colorMode'&&glbDevInfo.isMono)?Common.setTextColor("lbl_MP_" + key + "_menu_0","gray"):"";
		WidgetLib.setWidgetStatus(id, btnStatus);
	}
}; 

/**
 * 풀다운표시 갱신
 */
MainPage.updatePulldown = function(type)
{
	//getName
	var key = this.pullDownList[type];
	
	var idx = this._dataSet[key+"Idx"];
	if(idx < 0){
		KISUtil.debug("invalid DataType/"+key,this._dataSet[key]);
	}
	else
	{
		var lst=this._data.pulldownList.list[type];
		//update Icon
		if(lst.value[idx]){
			if(lst.key=="magnification" && this._dataSet.magnification.value != glbInfo.magnification[0] && this._dataSet.magnification.value != glbInfo.magnification[1]){
				Common.setImage("icn_MP_" + lst.key, lst.value[idx].icon.off);
				Common.setText("lbl_MP_" + lst.key, lst.value[idx].text + "(" + parseInt(this._dataSet.magnification.value) + "%)");
			}else if(lst.key == "tray" && this._dataSet.trayIdx>0){
				Common.setImage("icn_MP_" + lst.key, lst.value[idx].icon.off);
				Common.setText("lbl_MP_" + lst.key + "0", lst.value[idx].text0);
				Common.setText("lbl_MP_" + lst.key + "1", lst.value[idx].text1);
			}else{
				if(this._dataSet.orientation == 1 &&
						(lst.key == "inplex" || lst.key == "outplex")){
					Common.setImage("icn_MP_" + lst.key, lst.value[idx].iconLeft.off);
				}else{
					var status = WidgetLib.getWidgetStatus("pul_MP_" + lst.key);
					Common.setImage("icn_MP_" + lst.key, (!status.enable&&!!lst.value[idx].icon.dis)?lst.value[idx].icon.dis:lst.value[idx].icon.off);
				}
				Common.setText("lbl_MP_" + lst.key, lst.value[idx].text);
			}
			
		}
		//update text
		WidgetLib.setWidgetStatus("pul_MP_" + key, {on : false}); 
	}
};

/**
 * 개별 페이지 고유의 항목을 구성
 */
MainPage._initOthers = function(){
	//책복사 기능 활성/비활성
	if(!glbConfig.PAGE_SPLIT_USABLE){
		//console.log(JSON.stringify(this._data.pulldownList.list[0].value[3]));
		//delete this._data.pulldownList.list[0].value[3];
		this._data.pulldownList.list[0].value.pop();
		//console.log(this._data.pulldownList.list[0].value);
	}
	
	this.initTrayPulldown();
	this.initPullDown();
	if(!glbConfig.MAGNIFICATION_ENABLE){ 
		WidgetLib.setWidgetStatus("pul_MP_magnification", {enable:false});
		//Common.setImage("icn_MP_magnification", Img.FUNC.ICN_MG_FIX100_DIS);
	}
    //var btnDownObj = document.getElementById("btn_MP_pages_down");
    //btnDownObj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_MP_pages_down')");
    //var btnUpObj = document.getElementById("btn_MP_pages_up");
    //btnUpObj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_MP_pages_up')");
};

MainPage.initTrayPulldown = function(){
	//ICN_TRAY_SEF_50
	
	this._data.pulldownList.list[3].value.splice(1,4);
	var i, len, _tray;
	for(i=0, len=glbInfo.tray.length;i<len; i++){
		_tray = glbInfo.tray[i];
		//if(_tray.Status == "READY"){
			var direction = _tray.FeedDirection;
			var level = _tray.CurrentLevel;
			if(level == "-3"){
				level = "50";
			}
			var trayObj = {//Auto
				icon:{off:Img.FUNC["ICN_TRAY_"+direction+"_" +level],dis:Img.FUNC["ICN_TRAY_"+direction+"_" +level+"_DIS"]},
				iconLeft:{off:Img.FUNC["ICN_TRAY_"+direction+"_" +level],dis:Img.FUNC["ICN_TRAY_"+direction+"_" + level+"_DIS"]},
				text0:_tray.MediumSize,
				text1:(typeof Msg.Func.tray[_tray.MediumType] == "undefined")? Msg.Func.tray.other:Msg.Func.tray[_tray.MediumType],
				value:JFLib.INTRAY["TRAY"+(i+1)]
			};
			this._data.pulldownList.list[3].value.push(trayObj);
		//}
	}
	
};

MainPage.ChechMediumSize = function(mediumSize){
	var size=["A4", "A3", "B4", "B5"];
	for(var i=0;i<size.length; i++){
		if(size[i] == mediumSize){
			return true;
		}
	}
	return false;
};

MainPage.checkUsableTray = function(){
	var countDisableTray = 0;
	var i, len, _tray;
	for(i=0, len=glbInfo.tray.length;i<len; i++){
		_tray = glbInfo.tray[i];
		//console.log(_tray);
		if(_tray.Status === "NOTEXIST"){
			//pass
			countDisableTray++;
		}
//		else if(_tray.Status != "READY" || _tray.CurrentLevel == 0 
//				|| !this.ChechMediumSize(_tray.MediumSize)){
		else if(_tray.Status != "READY" || _tray.CurrentLevel == 0){
				countDisableTray++;
			WidgetLib.setWidgetStatus("btn_MP_tray_menu_" + (i+1), {enable:false});
			_tray.usable = false;
		}else{
			WidgetLib.setWidgetStatus("btn_MP_tray_menu_" + (i+1), {enable:true});
			_tray.usable = true;
		}
	}
	if(countDisableTray == glbInfo.tray.length){
		//WarnPopup._param = Msg.ERROR_MSG["TS-01"];
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.USABLE_TRAY_NOT_FOUND};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
		WarnPopup._param = param;
		PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
		return;
	}
};

MainPage.setTrayPulldownMenuBtn = function(){
	var _idx = Common.indexOf(MainPage.pullDownList, "tray");
	var lst=this._data.pulldownList.list[_idx];
	var i, len, _tray, _val;
	for(i=0, len=glbInfo.tray.length;i<len; i++){
		_tray = glbInfo.tray[i];
		_val = lst.value[i+1];
		if(_val){
			document.getElementById("lbl_MP_tray_menu_" + (i+1)).setAttribute("class", "lbl0");
			Common.setText("lbl_MP_tray_menu_" + (i+1), lst.value[i+1].text0);
			Common.setText("lbl_MP_tray_menu_" + (i+1) + "_0", lst.value[i+1].text1);
			if(!_tray.usable){
				Common.setImage("icn_MP_tray_menu_" + (i+1), lst.value[i+1].icon.dis);
				var obj = document.getElementById("btn_MP_tray_menu_" + (i+1));
				var preClass = obj.getAttribute("class");
				obj = obj.setAttribute("class", preClass + " disableFont" );
			}else{
				if(lst.value[i+1].icon.off){
					Common.setImage("icn_MP_tray_menu_" + (i+1), lst.value[i+1].icon.off);
				}else{
					Common.setImage("icn_MP_tray_menu_" + (i+1), "./image/ICN_TRAY_LEF_UNKNOWN.png");
				}
			}
		} 
	}
	//풀다운위치보정
	var _pop = document.getElementById("pul_MP_tray_popup");
	var _top = 134 + ((4-lst.value.length) * 62);
	_pop.style.top= _top+"px";
};

MainPage._onPageChange = function(){
	//WidgetLib.setWidgetStatus("btn_MP_inplex_menu_3", {enable:false});			//TODO rollback conflict발생시 브라우저패닉 발생에 따른 임시 조치
	//WidgetLib.setWidgetStatus("btn_MP_tray_menu_0", {enable:false});			//TODO rollback conflict발생시 브라우저패닉 발생에 따른 임시 조치
		//btn_MP_inplex_menu_3
	this.checkUsableTray();
	this.updateDisplay();
};

MainPage.setTrayPulldownMagAuto = function(){
	//용지맞춤일 때 트레이풀다운 설정
	if(this._dataSet.magnification.value == glbInfo.magnification[1] && this._dataSet.trayIdx == 0){
	//if(this._dataSet.trayIdx == 0){			//TODO rollback conflict발생시 브라우저패닉 발생에 따른 임시 조치
		var i, len, _tray;
		for(i=0, len=glbInfo.tray.length;i<len; i++){
			_tray = glbInfo.tray[i];
			if(_tray.usable){
				this._dataSet.trayIdx = i+1;
				break;
			}
		}
	}
	this.clearTrayPulldownLbl();
	this.updatePulldown(Common.indexOf(MainPage.pullDownList, "tray"));
};

/*
 * 2016.09.30 KIS Chone 기동시 상위 Tray의 A4를 Default치로 선택 refs #4069
 * 기동 후 MainPage 이동했을 경우, MainPage.setTrayPulldownMagAuto를 실시하지만 A4 용지 유무를 체크하지 않음
 * (배율의 경우 A4 유무와 상관없이 트레이를 자동에서 사용가능한 트레이로 변경함)
 * WaitingPage에서 MainPage로 화면 전환 시 호출하도록 함.
 */
MainPage.setTrayPulldownA4 = function(){
	var isChanged = false;
	for(i=0, len=glbInfo.tray.length;i<len; i++){
		var _tray = glbInfo.tray[i];
		if(_tray.usable && _tray.MediumSize == "A4"){
			isChanged = true;
			this._dataSet.trayIdx = i+1;
			break;
		}
	}
	
	if(!isChanged){//A4 용지가 없음.
		LogLib.write("IPrint Copy --- A4 tray not exist", LogLib.LEVEL.WRN);
		return;
	}

	this.clearTrayPulldownLbl();
	this.updatePulldown(Common.indexOf(MainPage.pullDownList, "tray"));
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
MainPage.updateDisplay = function(){
	for(var i=0; i<this.pullDownList.length; i++){
		this.updatePulldown(i);
	}
	this.setTrayPulldownMagAuto();
	this.displayOrientation();
	this.pagesSpinner.focused = true;
	this.pagesSpinner.hardKeyInput = false;
	updatePreviewImg("MP");
};

MainPage.clearTrayPulldownLbl = function(){
	Common.setText("lbl_MP_tray", "");
	Common.setText("lbl_MP_tray0", "");
	Common.setText("lbl_MP_tray1", "");
};

/**
 * 画面表示の更新（プルダウンメニューアイコン）
 */
MainPage.updatePullMenuIcon=function(data,idx)
{
	var key=this.pullDownList[idx];
	var flag=(this._dataSet.orientation == 1);
	
	var iconKey="icon";
	var iconStatus="off";
	if(flag){
		iconKey="iconLeft";
		var id;
		for(var i=0,il=glbInfo[key].length;i<il;i++)
		{
			id=	"icn_MP_"+key+"_menu_"+i;
			Common.setImage(id,data.pulldownList.list[idx].value[i][iconKey][iconStatus]);
		}
	}else{
		var id;
		for(var i=0,il=glbInfo[key].length;i<il;i++)
		{
			id=	"icn_MP_"+key+"_menu_"+i;
			Common.setImage(id,data.pulldownList.list[idx].value[i][iconKey][iconStatus]);
		}
		
	}
};
	

MainPage.displayOrientation = function()
{
	if(this._dataSet.orientation==0){
		WidgetLib.setWidgetStatus("btn_MP_pageType_0", { on : true });
		WidgetLib.setWidgetStatus("btn_MP_pageType_1", { on : false });
	}else{
		WidgetLib.setWidgetStatus("btn_MP_pageType_0", { on : false });
		WidgetLib.setWidgetStatus("btn_MP_pageType_1", { on : true });
	}
};

MainPage.selectTray = function()
{
	var i, len, _tray;
	for(i=0, len=glbInfo.tray.length;i<len; i++){
		_tray = glbInfo.tray[i];
		if(_tray.usable){
			//var msg = Msg.Page.Main.slideChangeTray[0] + _tray.MediumSize+"(Tray"+ (i+1) + ")" +Msg.Page.Main.slideChangeTray[1];
			var msg = (glbInfo.lang=='ko')?[Msg.Page.Main.slideChangeTray[0].replace(/Nnn/,_tray.MediumSize+"(Tray"+ (i+1) + ")"),Msg.Page.Main.slideChangeTray[1]] : [Msg.Page.Main.slideChangeTray[0],Msg.Page.Main.slideChangeTray[1].replace(/Nnn/,_tray.MediumSize+"(Tray"+ (i+1) + ")")];
			MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", msg);
			this._dataSet.trayIdx = i+1;
			break;
		}
	}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
MainPage.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "GetTrayInfo":
			if(arguments[1]){
				//Common.setTrayInfo(arguments[2]);
				this.checkUsableTray();
				this.initTrayPulldown();
				this.updateDisplay();
				this.updatePulldown(Common.indexOf(MainPage.pullDownList, "tray"));
				WidgetLib.setWidgetStatus("pul_MP_tray", {enable:true});
				document.getElementById("pul_MP_tray").setAttribute("class",  "pulldown");
			}else{
				KISUtil.Debug("GetTrayInfo", "failed");
			}
			break;
		case "onbuttonup":
			var isChange = false;
			switch(id)
			{
				case "btn_MP_Start":
					if(!WidgetLib.getWidgetStatus("pul_MP_tray").enable){
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.Main.slideStartTrayDis);
						return;
					}
					WidgetLib.setWidgetStatus("btn_MP_Start",{enable:false});		//버튼 연타를 막기위한 조치
					WidgetLib.setWidgetStatus("btn_EP_Start",{enable:false});		//버튼 연타를 막기위한 조치
					BrowserExt.Beep(0);
					doScanJobStart();
					break;
				case "btn_MP_etcFunc":
					BrowserExt.Beep(0);
					PageManager.changePage(EtcFuncPage, PageManager.type.NORMAL);
					break;
				case "btn_MP_inplex_menu_0":
				case "btn_MP_inplex_menu_1":
				case "btn_MP_inplex_menu_2":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.inplexIdx=idx;
					this._dataSet.splitScan.enable = false;
					this._dataSet.splitScanIdx = 0;
					this._dataSet.centerErase = 0;
					break;
				case "btn_MP_inplex_menu_3":
					BrowserExt.Beep(0);
					PageManager.changePage(PageSplitPopup, PageManager.type.NORMAL);
					break;
				case "btn_MP_outplex_menu_0":
				case "btn_MP_outplex_menu_1":
				case "btn_MP_outplex_menu_2":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.outplexIdx=idx;
					isChange = true;
					break;
				case "btn_MP_magnification_menu_0":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.magnificationIdx=idx;
					this._dataSet.magnification.value=glbInfo.magnification[idx];
					break;
				case "btn_MP_magnification_menu_1":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.magnificationIdx=idx;
					this._dataSet.magnification.value=glbInfo.magnification[idx];
					this._dataSet.magnification.inputMS = "";
					this._dataSet.magnification.outputMS = "";
					if(this._dataSet.trayIdx == 0){
						this.clearTrayPulldownLbl();
						this.selectTray();
						this.updatePulldown(Common.indexOf(MainPage.pullDownList, "tray"));
					}
					break;
				case "btn_MP_magnification_menu_2":
					BrowserExt.Beep(0);
					PageManager.changePage(MagnifPopup, PageManager.type.NORMAL);
					break;
					/*
				case "btn_MP_nup_menu_0":
				case "btn_MP_nup_menu_1":
				case "btn_MP_nup_menu_2":
				case "btn_MP_nup_menu_3":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.nupIdx=idx;
					isChange = true;
					break;*/
				case "btn_MP_colorMode_menu_0":
				case "btn_MP_colorMode_menu_1":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.colorModeIdx=idx;
					setColorModeIdx();
					isChange = true;
					break;
				case "btn_MP_tray_menu_0":
					BrowserExt.Beep(0);
					this._dataSet.trayIdx = 0;
					if(this._dataSet.magnificationIdx == 1){
						this._dataSet.magnificationIdx=0;
						this._dataSet.magnification.value=glbInfo.magnification[0];
						this.updatePulldown(Common.indexOf(MainPage.pullDownList, "magnification"));
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.Main.slideChangeMagnifi);
					}
					break;
				case "btn_MP_tray_menu_1":
				case "btn_MP_tray_menu_2":
				case "btn_MP_tray_menu_3":
				case "btn_MP_tray_menu_4":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.trayIdx=idx;
					if(this._dataSet.magnificationIdx == 1){
						this._dataSet.magnification.outputMS = glbInfo.tray[idx-1].MediumSize;
					}
					break;
				case "btn_MP_pages_up":
				case "btn_MP_pages_down":
					this.pagesSpinner.mouseUp();
					break;
				case "btn_MP_pageType_0":
				case "btn_MP_pageType_1":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.orientation=idx;
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "inplex"));
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "outplex"));
					isChange = true;
					break;
				default:
					//BrowserExt.Beep(0);
					//clearMessageAreaTimer();
					break;
			}
			if(isChange)updatePreviewImg("MP");
			break;
		case "onbuttondown":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_MP_pages_up":
					this.pagesSpinner.mouseDown("up");
					break;
				case "btn_MP_pages_down":
					this.pagesSpinner.mouseDown("dn");
					break;
				default:
					break;
			}
			break;
		case "onpopupopen":
			BrowserExt.Beep(0);
			switch(id)
			{
				case "pul_MP_inplex_popup":
					this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "inplex"));
					this.updatePullMenuIcon(this._data,0);
					if(this._dataSet.inplexIdx<3){
						WidgetLib.setWidgetStatus("btn_MP_inplex_menu_3", {on:false});
					}
					break;
				case "pul_MP_outplex_popup":
					this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "outplex"));
					this.updatePullMenuIcon(this._data,1);
					break;
				case "pul_MP_magnification_popup":
					this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "magnification"));
					if(this._dataSet.magnificationIdx == 2){
						Common.setText("lbl_MP_magnification_menu_2", Msg.Func.magnification.other + "(" + parseInt(this._dataSet.magnification.value) + "%)");
					}else{
						Common.setText("lbl_MP_magnification_menu_2", Msg.Func.magnification.other);
					}
					break;
					/*
				case "pul_MP_nup_popup":
					this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "nup"));
					this.updatePullMenuIcon(this._data,3);
					break;*/
				case "pul_MP_tray_popup":
					this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "tray"));
					if(document.getElementById("icn_MP_tray_menu_1")&&!document.getElementById("icn_MP_tray_menu_1").getAttribute("src")){
						this.setTrayPulldownMenuBtn();
					}
					break;
				case "pul_MP_colorMode_popup":
					this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "colorMode"));
					break;
				default:
					break;
			}
			break;
		case "onpopupclose":
			switch(id)
			{
				case "pul_MP_inplex_popup":
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "inplex"));
					break;
				case "pul_MP_outplex_popup":
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "outplex"));
					break;
				case "pul_MP_magnification_popup":
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "magnification"));
					break;
					/*
				case "pul_MP_nup_popup":
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "nup")););
					break;*/
				case "pul_MP_tray_popup":
					this.clearTrayPulldownLbl();
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "tray"));
					break;
				case "pul_MP_colorMode_popup":
					this.updatePulldown(Common.indexOf(MainPage.pullDownList, "colorMode"));
					break;
				default:
					break;
			}
			break;
			//Disable状態でのボタンイベントマッピング（コンフリクトメッセージ表示やクリアのため）
		case "ondisablekeydown":
            var isEnable = WidgetLib.getWidgetStatus(id).enable;
            if(!isEnable) {
                switch (id) {
                    case "btn_MP_pages_down":
                    	if(this.pagesSpinner.isLimitOver)
                        MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.Main.slideCopiesOverMin);
                        break;
                    case "btn_MP_pages_up":
                        if(this.pagesSpinner.isLimitOver)
                        MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.Main.slideCopiesOverMax);
                        break;
                    default:
                        break;
                }
            }
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id)
			{
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
					var num = id - BrowserExt.keyCode.FX_VK_0;
					if(this.pagesSpinner.focused)
					{
						this.pagesSpinner.inputHardKey(num);
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
				case BrowserExt.keyCode.FX_VK_START:
					BrowserExt.Beep(0);
					if(!WidgetLib.getWidgetStatus("pul_MP_tray").enable){
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.Main.slideStartTrayDis);
						return;
					}
					if(WebServiceLib.getActiveRequestCount() != 0){
						BrowserExt.Beep(1);
						return;
					}
					doScanJobStart();
					break;
				case BrowserExt.keyCode.FX_VK_BACK_SPACE:
					if(this.pagesSpinner.focused)
					{
						this.pagesSpinner.hardKeyInput = false;
						this.pagesSpinner.clear(1,true);
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
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
 * プルダウン閉じ処理用メソッド
 * templatePage.jsから移動
 */
MainPage.onPageClick = function(){
	MessageManager.clearMessageArea();
	switch(WidgetLib._popupId)
	{
		case "pul_MP_inplex_popup":
		case "pul_MP_outplex_popup":
		case "pul_MP_magnification_popup":
		//case "pul_MP_nup_popup":
		case "pul_MP_tray_popup":
		case "pul_MP_colorMode_popup":
			WidgetLib.closePopupWidget(WidgetLib._popupId);
			break;
		default:
			break;
	}
};
