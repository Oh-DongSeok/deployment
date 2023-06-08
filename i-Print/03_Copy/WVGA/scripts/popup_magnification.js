/**
 * 個別ページの表示および動作用
 * （その他の機能ページ）
 */
var MagnifPopup = new TemplatePage();

MagnifPopup.ID = "pop_magnification";

/**
 * 個別ページのデータ定義
 */
MagnifPopup._initModel = function()
{
	this._dataSet = new DataSet();
	this._data = {
		buttonList:[
		    {id:"btn_MG_confirm", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_MG_confirm", offImg: Img.UIPARTS.BTN_SML_OFF, pressImg: Img.UIPARTS.BTN_SML_PRESS}},
		    {id:"btn_MG_cancel", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_MG_cancel", offImg: Img.UIPARTS.BTN_SML_OFF, pressImg: Img.UIPARTS.BTN_SML_PRESS}},
		    {id:"btn_MG_FIX100", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_FIX100", offImg: Img.UIPARTS.RAD_NOR_TOP_OFF, pressImg: Img.UIPARTS.RAD_NOR_TOP_PRESS, onImg:Img.UIPARTS.RAD_NOR_TOP_ON, groupId:"BTN_MG_SET_QUICK"}},
		    {id:"btn_MG_AUTO", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_AUTO", offImg: Img.UIPARTS.RAD_NOR_BOT_OFF, pressImg: Img.UIPARTS.RAD_NOR_BOT_PRESS, onImg:Img.UIPARTS.RAD_NOR_BOT_ON, groupId:"BTN_MG_SET_QUICK"}},
		    {id:"btn_MG_down", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_DCR_OFF, pressImg: Img.ICON.BTN_DCR_PRESS, disableImg: Img.ICON.BTN_DCR_DIS}},
			{id:"btn_MG_up", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_ICR_OFF, pressImg: Img.ICON.BTN_ICR_PRESS, disableImg:Img.ICON.BTN_ICR_DIS}},
		    {id:"btn_MG_inputMS_0", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_inputMS_0",offImg: Img.UIPARTS.RAD_NOR_TOP_OFF, pressImg: Img.UIPARTS.RAD_NOR_TOP_PRESS, onImg: Img.UIPARTS.RAD_NOR_TOP_ON,disableImg: Img.UIPARTS.RAD_NOR_TOP_DIS, groupId:"BTN_MG_INPUT_MS"}},
		    {id:"btn_MG_inputMS_1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_inputMS_1",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_MG_INPUT_MS"}},
		    {id:"btn_MG_inputMS_2", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_inputMS_2",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_MG_INPUT_MS"}},
		    {id:"btn_MG_inputMS_3", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_inputMS_3",offImg: Img.UIPARTS.RAD_NOR_BOT_OFF, pressImg: Img.UIPARTS.RAD_NOR_BOT_PRESS, onImg: Img.UIPARTS.RAD_NOR_BOT_ON,disableImg: Img.UIPARTS.RAD_NOR_BOT_DIS, groupId:"BTN_MG_INPUT_MS"}},
		    {id:"btn_MG_outputMS_0", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_outputMS_0",offImg: Img.UIPARTS.RAD_NOR_TOP_OFF, pressImg: Img.UIPARTS.RAD_NOR_TOP_PRESS, onImg: Img.UIPARTS.RAD_NOR_TOP_ON,disableImg: Img.UIPARTS.RAD_NOR_TOP_DIS, groupId:"BTN_MG_OUTPUT_MS"}},
		    {id:"btn_MG_outputMS_1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_outputMS_1",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_MG_OUTPUT_MS"}},
		    {id:"btn_MG_outputMS_2", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_outputMS_2",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_MG_OUTPUT_MS"}},
		    {id:"btn_MG_outputMS_3", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_outputMS_3",offImg: Img.UIPARTS.RAD_NOR_BOT_OFF, pressImg: Img.UIPARTS.RAD_NOR_BOT_PRESS, onImg: Img.UIPARTS.RAD_NOR_BOT_ON,disableImg: Img.UIPARTS.RAD_NOR_BOT_DIS, groupId:"BTN_MG_OUTPUT_MS"}},
		    {id:"btn_MG_tray0", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_tray0",offImg: Img.UIPARTS.RAD_NOR_TOP_OFF, pressImg: Img.UIPARTS.RAD_NOR_TOP_PRESS, onImg: Img.UIPARTS.RAD_NOR_TOP_ON,disableImg: Img.UIPARTS.RAD_NOR_TOP_DIS, groupId:"BTN_MG_TRAY"}},
		    {id:"btn_MG_tray1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_tray1",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_MG_TRAY"}},
		    {id:"btn_MG_tray2", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_tray2",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_MG_TRAY"}},
		    {id:"btn_MG_tray3", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_MG_tray3",offImg: Img.UIPARTS.RAD_NOR_BOT_OFF, pressImg: Img.UIPARTS.RAD_NOR_BOT_PRESS, onImg: Img.UIPARTS.RAD_NOR_BOT_ON,disableImg: Img.UIPARTS.RAD_NOR_BOT_DIS, groupId:"BTN_MG_TRAY"}},
		    

		],
		imageList:[
		    {id:"img_lyr_bar", src:Img.BG.BG_BAR},
		    {id:"icn_MG_cancel", src:Img.ICON.ICN_CNCL_OFF},
		    {id:"icn_MG_confirm", src:Img.ICON.ICN_CONF_OFF},
		    {id:"icn_MG_FIX100", src:Img.FUNC.ICN_MG_FIX100},
		    {id:"icn_MG_AUTO", src:Img.FUNC.ICN_MG_AUTO}
		],
		textList:[
		    {id:"tit_MG", text:Msg.Page.MagnificationPopup.titMagpanel},
		    {id:"lbl_MG_cancel", text:Msg.Page.MagnificationPopup.lblMagCancel},
		    {id:"lbl_MG_confirm",	text:Msg.Page.MagnificationPopup.lblMagConfirm},
		    {id:"lbl_MG_inputMS_0",	text:Msg.Page.MagnificationPopup.lblMSA3},
		    {id:"lbl_MG_inputMS_1",	text:Msg.Page.MagnificationPopup.lblMSB4},
		    {id:"lbl_MG_inputMS_2",	text:Msg.Page.MagnificationPopup.lblMSA4},
		    {id:"lbl_MG_inputMS_3",	text:Msg.Page.MagnificationPopup.lblMSB5},
		    {id:"lbl_MG_outputMS_0", text:Msg.Page.MagnificationPopup.lblMSA3},
		    {id:"lbl_MG_outputMS_1",	text:Msg.Page.MagnificationPopup.lblMSB4},
		    {id:"lbl_MG_outputMS_2",	text:Msg.Page.MagnificationPopup.lblMSA4},
		    {id:"lbl_MG_outputMS_3",	text:Msg.Page.MagnificationPopup.lblMSB5},
		    {id:"tit_MG_panel", text:Msg.Page.MagnificationPopup.lblMag},
		    {id:"lbl_MG_explain", text:Msg.Page.MagnificationPopup.lblMagExpain},
		    {id:"tit_MG_preset", text:Msg.Page.MagnificationPopup.titMagPreset},
		    {id:"tit_MG_inputMS", text:Msg.Page.MagnificationPopup.titMagInputMS},
		    {id:"tit_MG_outputMS", text:Msg.Page.MagnificationPopup.titMagOutputMS},
		    {id:"lbl_MG_FIX100", text:Msg.Page.MagnificationPopup.lblMagFix100},
		    {id:"lbl_MG_AUTO", text:Msg.Page.MagnificationPopup.lblMagAuto},
		    {id:"tit_MG_tray", text:Msg.Page.MagnificationPopup.titMagTray},
		    {id:"lbl_MG_gide", text:Msg.Page.MagnificationPopup.lblSetMagExplain}
		]
	};

	var arg={
		key:"MagnifPopup.magniSpinner",
		number:glbConfig.Magnification.Default,
		min:glbConfig.Magnification.Min,
		max:glbConfig.Magnification.Max,
		labelId:"lbl_MG_magniVal",
		btnUpId:"btn_MG_up",
		btnDnId:"btn_MG_down",
		unitStr:Msg.Page.MagnificationPopup.lblPercent/*,
		callback:{
			min:function(){
				MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagOverMin, true);
			},
			max:function(){
				MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagOverMax, true);
			},
			inputHardkeyMax:function(){
				MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagAlertMaxVal, true);
			}
		}*/
	};
	this.magniSpinner=new Spinner(arg);
};

//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
MagnifPopup.cssChange = function()
{
	switch(glbInfo.lang){
		case "en":
			Common.setMargin("tit_MG_panel","marginLeft","-226px");//2016.05.25 chone 다언어대응
			Common.setPosition("lbl_MG_gide","bottom","20px");
			break;
		case "ja":
			Common.setMargin("tit_MG_panel","marginLeft","-181px");//2016.05.25 chone 다언어대응
			Common.setIndent("lbl_MG_cancel","40px");
			Common.setPosition("lbl_MG_gide","bottom","20px");
			break;
		case "ch":
			Common.setMargin("tit_MG_panel","marginLeft","-156px");//2016.05.25 chone 다언어대응
			break;
		default:
			break;
	}
}

/**
 * 画面表示の更新（共通/画面遷移時呼び出される。）
 */
MagnifPopup.updateDisplay = function()
{
	KISUtil.debug("function:", "updateDisplay");
	this.displayMagnifiPopup();
	this.cssChange();
	this.setTrayInfo();
	this.magniSpinner.focused = true;
	this.magniSpinner.number = parseInt(this._dataSet.magnification.value);
	this.magniSpinner.hardKeyInput = false;
};

MagnifPopup._onPageChange = function(){
	//WidgetLib.setWidgetStatus("btn_MG_AUTO", {enable:false});			//TODO rollback conflict발생시 브라우저패닉 발생에 따른 임시 조치
	this.updateDisplay();
};

MagnifPopup.checkMediumSize = function(mediumSize){
	for(var i=0; i<glbInfo.tray.length; i++){
		if(glbInfo.tray[i].MediumSize == mediumSize){
			return true;
		}
	}
	return false;
};

MagnifPopup.displayMgMsOrTray = function(){
	var old = document.getElementById('lyr_MG_msTray');
	var clone = old.cloneNode(true);
	this.appendDataToElement(clone);
	old.parentNode.replaceChild(clone,old);
};

MagnifPopup.appendDataToElement = function(clone){
	var i=0;
	var msIdArr = ["lyr_MG_inputMS", "lyr_MG_outputMS", "lbl_MG_gide"];
	for(i; i<clone.childNodes.length; i++){
		if(this._dataSet.magnification.value == glbInfo.magnification[1]){
			if(Common.indexOf(msIdArr, clone.childNodes[i].id)>-1){
			//if(msIdArr.indexOf(clone.childNodes[i].id)>-1){
				clone.childNodes[i].style.display = "none";
			}else if(clone.childNodes[i].id == "lyr_MG_tray"){
				clone.childNodes[i].style.display = "block";
			}
		}else{
			if(Common.indexOf(msIdArr, clone.childNodes[i].id)>-1){
				clone.childNodes[i].style.display = "block";
			}else if(clone.childNodes[i].id == "lyr_MG_tray"){
				clone.childNodes[i].style.display = "none";
			}
		}
	}
};

MagnifPopup.displayMagnifiPopup = function(){
	Common.setText("lbl_MG_magniVal", 
			(this._dataSet.magnification.value == glbInfo.magnification[1])?Msg.Page.MagnificationPopup.lblHyphen : parseInt(this._dataSet.magnification.value) + Msg.Page.MagnificationPopup.lblPercent);
	
	var count=0;
	for(var i=0; i<glbConfig.mediumSizes.length; i++){
		//if(Common.indexOf(glbConfig.mediumSizes,glbConfig.mediumSizes[i]) == -1){
		//	WidgetLib.setWidgetStatus("btn_MG_inputMS_" + i, {enable:false});
		//}
		if(!this.checkMediumSize(glbConfig.mediumSizes[i])){
			WidgetLib.setWidgetStatus("btn_MG_outputMS_" + i, {enable:false});
			count++;
		}
	}
	//출력용지크기가 배율설정에 지정된 사이즈범위내에 없는경우 원고용지크기는 전부 Disable
	if(count==glbConfig.mediumSizes.length){
		for(var i=0; i<glbConfig.mediumSizes.length; i++){
			WidgetLib.setWidgetStatus("btn_MG_inputMS_" + i, {enable:false});
		}
	}
	this.displayMgMsOrTray();
	if(this._dataSet.magnification.value == glbInfo.magnification[0]){
		WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:true});
		WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
		//this.setStatusInputMSBtn({"enable":true});
		this.setStatusInputMSBtn({"on":false});
		this.setStatusOutputMSBtn({"on":false});
		this.setStatusMagSpinner({"enable":true});
		
	}else if(this._dataSet.magnification.value == glbInfo.magnification[1]){
		this.setMagAuto();
		this.selectTray();
	}else{
		WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
		WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
		for(var i=0; i<glbConfig.mediumSizes.length; i++){
			if(this._dataSet.magnification.inputMS == glbConfig.mediumSizes[i]){
				WidgetLib.setWidgetStatus("btn_MG_inputMS_" + i, {on:true});
			}else{
				WidgetLib.setWidgetStatus("btn_MG_inputMS_" + i, {on:false});
			}
			if(this._dataSet.magnification.outputMS == glbConfig.mediumSizes[i]){
				WidgetLib.setWidgetStatus("btn_MG_outputMS_" + i, {on:true});
			}else{
				WidgetLib.setWidgetStatus("btn_MG_outputMS_" + i, {on:false});
			}
		}
	}

};

MagnifPopup.setTrayInfo = function()
{
	var i, len, _tray, direction, level,  type, obj, preClass, _img;
	len=(glbInfo.tray.length>4)?glbInfo.tray.length:4;
	for(i=0;  i<len; i++){
		_tray = glbInfo.tray[i];
		//console.log(_tray);
		if(_tray){
			direction = _tray.FeedDirection;
			level = _tray.CurrentLevel;
			type = (typeof Msg.Func.tray[_tray.MediumType] == "undefined")? Msg.Func.tray.other:Msg.Func.tray[_tray.MediumType];
			if(_tray.MediumSize!="wn"){
				Common.setText("lbl_MG_tray" + i + "_0", _tray.MediumSize);		//부존재 트레이 정보 표시시  wn으로 표시되는건 대응
				Common.setText("lbl_MG_tray" + i + "_1", type);
			}
			if(_tray.usable){
				_img = Img.FUNC["ICN_TRAY_"+direction+"_" +level];
				if(_img){
					Common.setImage("icn_MG_tray" + i, _img);					//부존재 트레이의 경우 level이 -2로 오게됨(이미지명을 맞춰서 대응함 unknown size)
				}
				else{
					Common.changeVisibility("icn_MG_tray" + i,"none");
				}
			}
			else{
				WidgetLib.setWidgetStatus("btn_MG_tray" + i, {enable:false});
				_img = Img.FUNC["ICN_TRAY_"+direction+"_" +level + "_DIS"];
				if(_img){
					Common.setImage("icn_MG_tray" + i, _img);
				}
				else{
					Common.changeVisibility("icn_MG_tray" + i,"none");
				}
				obj = document.getElementById("btn_MG_tray" + i);
				preClass = obj.getAttribute("class");
				obj = obj.setAttribute("class", preClass + " disableFont" );
			}
		}
		else{
			WidgetLib.setWidgetStatus("btn_MG_tray" + i, {enable:false});
			Common.changeVisibility("icn_MG_tray" + i,"none");
			Common.setText("lbl_MG_tray" + i + "_0", "");
			Common.setText("lbl_MG_tray" + i + "_1", "");
		}
	}
};

MagnifPopup.setStatusMagSpinner = function(status){
	WidgetLib.setWidgetStatus("btn_MG_down", status);
	WidgetLib.setWidgetStatus("btn_MG_up", status);
};

MagnifPopup.setStatusInputMSBtn = function(status){
	var i, obj;
	for(i=0; i<4; i++){
		WidgetLib.setWidgetStatus("btn_MG_inputMS_" + i, status);
		obj = document.getElementById("btn_MG_inputMS_" + i);
		if(WidgetLib.getWidgetStatus("btn_MG_inputMS_" + i).enable){
			obj.setAttribute("class", obj.getAttribute("class").split(" ")[0]);
		}else{
			obj.setAttribute("class", obj.getAttribute("class") + " disableFont");
		}
	}
};

MagnifPopup.setStatusOutputMSBtn = function(status){
	for(var i=0; i<4; i++){
		WidgetLib.setWidgetStatus("btn_MG_outputMS_" + i, status);
		var obj = document.getElementById("btn_MG_outputMS_" + i);
		if(WidgetLib.getWidgetStatus("btn_MG_outputMS_" + i).enable){
			obj.setAttribute("class", obj.getAttribute("class").split(" ")[0]);
			obj.setAttribute("onmouseup", "");
		}else{
			obj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_MG_outputMS_"+i+"')");
			obj.setAttribute("class", obj.getAttribute("class") + " disableFont");
		}
	}
};

MagnifPopup.getTray1Idx = function(){
	for(var i = 0; i<glbConfig.mediumSizes.length; i++){
		if(glbInfo.tray[0].MediumSize == glbConfig.mediumSizes[i]){
			return i;
		}
	}
};

MagnifPopup.selectTray = function(){
	var i,len,_tray;
	if(this._dataSet.trayIdx != 0){
		for(i=0; i<glbInfo.tray.length; i++){
			if(i==this._dataSet.trayIdx-1){
				WidgetLib.setWidgetStatus("btn_MG_tray" + i, {on:true});
			}else{
				WidgetLib.setWidgetStatus("btn_MG_tray" + i, {on:false});
			}
		}
		
	}else{
		for(i=0, len=glbInfo.tray.length; i < len; i++){
			_tray = glbInfo.tray[i];
			if(_tray.usable){
				//var msg = Msg.Page.Main.slideChangeTray[0] + _tray.MediumSize+"(Tray"+ (i+1) + ")" +Msg.Page.Main.slideChangeTray[1];  
				var msg = (glbInfo.lang=='ko')?[Msg.Page.Main.slideChangeTray[0].replace(/Nnn/,_tray.MediumSize+"(Tray"+ (i+1) + ")"),Msg.Page.Main.slideChangeTray[1]] : [Msg.Page.Main.slideChangeTray[0],Msg.Page.Main.slideChangeTray[1].replace(/Nnn/,_tray.MediumSize+"(Tray"+ (i+1) + ")")];
				MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", msg);
				this._dataSet.trayIdx = i+1;
				WidgetLib.setWidgetStatus("btn_MG_tray" + i, {on:true});
				for(j=i+1, len=glbInfo.tray.length; j < len; j++){//빠른설정(출력용지맞춤) 버튼 선택시, 출력용지 선택에 선택되지 않은 용지는 Disable처리필요 (기존 EP버그 대응)
					WidgetLib.setWidgetStatus("btn_MG_tray" + j, {on:false});
				}
				break;
			}
			else{
				WidgetLib.setWidgetStatus("btn_MG_tray" + i, {on:false});
			}
		}
	}
};


MagnifPopup.setMagByInputMS = function(){
	var key = this._dataSet.magnification.inputMS + "to" + this._dataSet.magnification.outputMS;
	var mag = JFLib.MAG[key];
	if(this._dataSet.magnification.outputMS){
		if(this._dataSet.magnification.outputMS == this._dataSet.magnification.inputMS){
			WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:true});
			WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
			Common.setText("lbl_MG_magniVal", parseInt(JFLib.MAG.FIX100) + Msg.Page.MagnificationPopup.lblPercent);
			this._dataSet.magnification.value = glbInfo.magnification[0];
			this._dataSet.magnificationIdx = 0;
		}else{
			WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
			WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
			Common.setText("lbl_MG_magniVal", parseInt(mag) + Msg.Page.MagnificationPopup.lblPercent);
			this._dataSet.magnification.value = mag;
			this._dataSet.magnificationIdx = 2;
		}
	}
};

//출력용지사이즈 버튼에 의한 화면 갱신
MagnifPopup.setMagByOutputMS = function(id){
	this._dataSet.magnification.outputMS = glbConfig.mediumSizes[parseInt(id.substr(id.length-1, 1))];
	var key = this._dataSet.magnification.inputMS + "to" + this._dataSet.magnification.outputMS;
	var mag = JFLib.MAG[key];
	if(this._dataSet.magnification.inputMS){
		if(this._dataSet.magnification.inputMS == this._dataSet.magnification.outputMS){
			WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:true});
			WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
			Common.setText("lbl_MG_magniVal", parseInt(JFLib.MAG.FIX100) + Msg.Page.MagnificationPopup.lblPercent);
			this._dataSet.magnification.value = glbInfo.magnification[0];
			this._dataSet.magnificationIdx = 0;
		}else{
			WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
			WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
			Common.setText("lbl_MG_magniVal", parseInt(mag) + Msg.Page.MagnificationPopup.lblPercent);
			this._dataSet.magnification.value = mag;
			this._dataSet.magnificationIdx = 2;
		}
	}
};

//용지맞춤 버튼에 의한 화면 갱신
MagnifPopup.displayMagByAutoBtn = function(){
	this.setStatusMagSpinner({"enable":false});
	WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
	Common.setText("lbl_MG_magniVal", Msg.Page.MagnificationPopup.lblHyphen);
	this._dataSet.magnificationIdx = 1;
};

//등배버튼에 의한 화면 표시
MagnifPopup.displayMagByFix100Btn = function(){
	WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:true});
	WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:false});
	this.setStatusInputMSBtn({"on":false});
	this.setStatusOutputMSBtn({"on":false});
	this.setStatusMagSpinner({"enable":true});
	Common.setText("lbl_MG_magniVal", glbInfo.magnification[0] + Msg.Page.MagnificationPopup.lblPercent);
	this._dataSet.magnificationIdx = 0;
	
};

//용지맞춤의 경우 화면표시
MagnifPopup.setMagAuto = function(){
	this.setStatusMagSpinner({"enable":false});
	WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
	WidgetLib.setWidgetStatus("btn_MG_AUTO", {on:true});
	
	Common.setText("lbl_MG_magniVal", Msg.Page.MagnificationPopup.lblHyphen);
	this._dataSet.magnificationIdx = 1;
};

MagnifPopup.setFix100BtnBySpinner = function(){
	if(this._dataSet.magnification.value != 100){
		this._dataSet.magnificationIdx = 2;
		WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
	}else{
		WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:true});
	}
};

MagnifPopup.setInputSize = function(size){
	var result = JFLib.MS.A4LEF
	switch(size){
		case 'A4':
			result = JFLib.MS.A4SEF;
			break;
		case 'A3':
			result = JFLib.MS.A3SEF;
			break;
		case 'B4':
			result = JFLib.MS.B4SEF;
			break;
		case 'B5':
			result = JFLib.MS.B5SEF;
			break;
	}
	return result;
}
/**
 * 個別ページのイベント処理
 * @param {string} event イベントの種類
 * @param {string} id イベント発生元
 */
MagnifPopup.EventHandler = function(event, id)
{
	switch(event)
	{
		case "onbuttondown":
			MessageManager.clearMessageArea();
			//BrowserExt.Beep(0);
			switch(id)
			{
				case "btn_MG_up":
					if(this._dataSet.magnification.value == glbInfo.magnification[0]){
						this._dataSet.magnificationIdx = 2;
						WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
					}
					this.magniSpinner.mouseDown("up");
					break;
				case "btn_MG_down":
					if(this._dataSet.magnification.value == glbInfo.magnification[0]){
						this._dataSet.magnificationIdx = 2;
						WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
					}
					this.magniSpinner.mouseDown("dn");
					break;
				default:
					break;
			}
			break;
		case "onbuttonup":
			//MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_MG_confirm":
					if(this.magniSpinner.number < this.magniSpinner.min){
						BrowserExt.Beep(1);
						this.magniSpinner.number = this.magniSpinner.min;
						this._dataSet.magnification.value = this.magniSpinner.number;
						Common.setText("lbl_MG_magniVal", this.magniSpinner.min + Msg.Page.MagnificationPopup.lblPercent);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagAlertMinVal, true);
						return;
					}
					BrowserExt.Beep(0);
					
					if(this._dataSet.magnificationIdx!=1){
						if(this._dataSet.hasOwnProperty("trayIdx")){
							//remove;
							delete this._dataSet.trayIdx;
						}
					}
					if(this._dataSet.magnificationIdx != 0 && this._dataSet.magnification.value == glbInfo.magnification[0]) {
						this._dataSet.magnificationIdx = 0;
					}

					if(this._dataSet.magnificationIdx == 0 && this._dataSet.magnification.outputMS){//2016.08.16 KIS Chone 출력 용지 선택시 트레이 선택하도록 수정
						for(var i = 0, len=glbInfo.tray.length; i<len; i++){
							var tmp = glbInfo.tray[i];
							if(tmp.MediumSize == this._dataSet.magnification.outputMS){
								this._dataSet.trayIdx = i + 1;
								break;
							}
						}
					}

					PageManager.changePage(MainPage, PageManager.type.CONFIRM);
					break;
				case "btn_MG_cancel":
					BrowserExt.Beep(0);
					PageManager.changePage(MainPage, PageManager.type.CANCEL);
					break;
				case "btn_MG_FIX100":
					BrowserExt.Beep(0);
					if(this._dataSet.magnification.value!=glbInfo.magnification[0]){
						this._dataSet.magnification.value = glbInfo.magnification[0];
						this._dataSet.magnification.inputMS = "";
						this._dataSet.magnification.outputMS = "";
						this.magniSpinner.number = glbInfo.magnification[0];
						this.displayMgMsOrTray();
						this.displayMagByFix100Btn();
					}
					break;
				case "btn_MG_AUTO":
					BrowserExt.Beep(0);
					this.magniSpinner.hardKeyInput = false;
					if(this._dataSet.magnification.value!=glbInfo.magnification[1]){
						this._dataSet.magnification.value=glbInfo.magnification[1];
						this._dataSet.magnification.outputMS = glbConfig.mediumSizes[this.getTray1Idx()];
						this._dataSet.magnification.inputMS = "";
						this.displayMgMsOrTray();
						this.displayMagByAutoBtn();
						this.selectTray();
					}
					break;
				case "btn_MG_inputMS_0":
				case "btn_MG_inputMS_1":
				case "btn_MG_inputMS_2":
				case "btn_MG_inputMS_3":
					BrowserExt.Beep(0);
					this._dataSet.magnification.inputMS=glbConfig.mediumSizes[parseInt(id.substr(id.length-1, 1))];
					glbInfo.magnification.inputMS = this.setInputSize(this._dataSet.magnification.inputMS);
					this.setMagByInputMS();
					this.magniSpinner.number = parseInt(this._dataSet.magnification.value);
					this.magniSpinner.hardKeyInput = false;
					break;
				case "btn_MG_outputMS_0":
				case "btn_MG_outputMS_1":
				case "btn_MG_outputMS_2":
				case "btn_MG_outputMS_3":
					BrowserExt.Beep(0);
					this.setMagByOutputMS(id);
					this.magniSpinner.number = parseInt(this._dataSet.magnification.value);
					this.magniSpinner.hardKeyInput = false;
					break;
				case "btn_MG_down":
				case "btn_MG_up":
					this.magniSpinner.mouseUp();
					this.setStatusInputMSBtn({"on":false});
					this.setStatusOutputMSBtn({"on":false});
					this._dataSet.magnification.inputMS = "";
					this._dataSet.magnification.outputMS = "";
					if(this.magniSpinner.number < this.magniSpinner.min){
						BrowserExt.Beep(1);
						this.magniSpinner.number = this.magniSpinner.min;
						this._dataSet.magnification.value = this.magniSpinner.number;
						Common.setText("lbl_MG_magniVal", this.magniSpinner.min + Msg.Page.MagnificationPopup.lblPercent);
						WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagAlertMinVal, true);
						return;
					}else{
						this._dataSet.magnification.value = this.magniSpinner.number;
					}
					this.setFix100BtnBySpinner();
					this.magniSpinner.hardKeyInput = false;
					break;
				case "btn_MG_tray0":
				case "btn_MG_tray1":
				case "btn_MG_tray2":
				case "btn_MG_tray3":
					BrowserExt.Beep(0);
					this._dataSet.trayIdx = parseInt(id.substr(id.length-1, 1)) + 1;
					break;
				default:
					BrowserExt.Beep(0);
					break;
			}
			break;
		//Disable状態でのボタンイベントマッピング（コンフリクトメッセージ表示やクリアのため）
		case "ondisablekeydown":
			if(WidgetLib.getWidgetStatus(id).enable){
				return;
			}
			switch(id){
				case "btn_MG_down":
					MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagOverMin, true);
					break;
				case "btn_MG_up":
					MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagOverMax, true);
					break;
				case "btn_MG_outputMS_0":
				case "btn_MG_outputMS_1":
				case "btn_MG_outputMS_2":
				case "btn_MG_outputMS_3":
					MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideNotReadyTray, true);
				default:
					break;
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
					if(this.magniSpinner.focused  && this._dataSet.magnification.value != glbInfo.magnification[1])
					{
						this.magniSpinner.inputHardKey(num);
						if(this.magniSpinner.number != glbInfo.magnification[0]){
							this._dataSet.magnificationIdx = 2;
							this._dataSet.magnification.value = this.magniSpinner.number;
							WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:false});
						}else{
							this._dataSet.magnificationIdx = 1;
							WidgetLib.setWidgetStatus("btn_MG_FIX100", {on:true});
						}
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
				case BrowserExt.keyCode.FX_VK_BACK_SPACE:
					this.magniSpinner.hardKeyInput = false;
					if(this.magniSpinner.focused && this._dataSet.magnification.value != glbInfo.magnification[1])
					{
						this.magniSpinner.clear(glbInfo.magnification[0]);
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
				case BrowserExt.keyCode.FX_VK_START:
					BrowserExt.Beep(1);
					MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.MagnificationPopup.slideMagUnusableStart);
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