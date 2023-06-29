/**
 * 個別ページの表示および動作用
 * （その他の機能ページ）
 */
var PageSplitPopup = new TemplatePage();
PageSplitPopup.ID = "pop_pageSplit";
/**
 * 個別ページのデータ定義
 */
PageSplitPopup._initModel = function()
{
	this._dataSet = new DataSet();
	this._data = {
		buttonList:[
		    {id:"btn_PS_confirm", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_PS_confirm", offImg: Img.UIPARTS.BTN_SML_OFF, pressImg: Img.UIPARTS.BTN_SML_PRESS}},
		    {id:"btn_PS_cancel", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_PS_cancel", offImg: Img.UIPARTS.BTN_SML_OFF, pressImg: Img.UIPARTS.BTN_SML_PRESS}},
		    {id:"btn_PS_boundAt_0", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_boundAt_0",offImg: Img.UIPARTS.RAD_NOR_TOP_OFF, pressImg: Img.UIPARTS.RAD_NOR_TOP_PRESS, onImg: Img.UIPARTS.RAD_NOR_TOP_ON,disableImg: Img.UIPARTS.RAD_NOR_TOP_DIS, groupId:"BTN_PS_PAGESPLIT"}},
		    {id:"btn_PS_boundAt_1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_boundAt_1",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_PS_PAGESPLIT"}},
		    {id:"btn_PS_boundAt_2", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_boundAt_2",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_PS_PAGESPLIT"}},
		    {id:"btn_PS_boundAt_3", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_boundAt_3",offImg: Img.UIPARTS.RAD_NOR_BOT_OFF, pressImg: Img.UIPARTS.RAD_NOR_BOT_PRESS, onImg: Img.UIPARTS.RAD_NOR_BOT_ON,disableImg: Img.UIPARTS.RAD_NOR_BOT_DIS, groupId:"BTN_PS_PAGESPLIT"}},
		    {id:"btn_PS_order_0", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_order_0",offImg: Img.UIPARTS.RAD_NOR_TOP_OFF, pressImg: Img.UIPARTS.RAD_NOR_TOP_PRESS, onImg: Img.UIPARTS.RAD_NOR_TOP_ON,disableImg: Img.UIPARTS.RAD_NOR_TOP_DIS, groupId:"BTN_PS_ORDER"}},
		    {id:"btn_PS_order_1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_order_1",offImg: Img.UIPARTS.RAD_NOR_MID_OFF, pressImg: Img.UIPARTS.RAD_NOR_MID_PRESS, onImg: Img.UIPARTS.RAD_NOR_MID_ON,disableImg: Img.UIPARTS.RAD_NOR_MID_DIS, groupId:"BTN_PS_ORDER"}},
		    {id:"btn_PS_order_2", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_PS_order_2",offImg: Img.UIPARTS.RAD_NOR_BOT_OFF, pressImg: Img.UIPARTS.RAD_NOR_BOT_PRESS, onImg: Img.UIPARTS.RAD_NOR_BOT_ON,disableImg: Img.UIPARTS.RAD_NOR_BOT_DIS, groupId:"BTN_PS_ORDER"}},
		    {id:"btn_PS_centerEraseDown", type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg: Img.ICON.BTN_DCR_OFF, pressImg: Img.ICON.BTN_DCR_PRESS, disableImg: Img.ICON.BTN_DCR_DIS}},
			{id:"btn_PS_centerEraseUp", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_ICR_OFF, pressImg: Img.ICON.BTN_ICR_PRESS, disableImg:Img.ICON.BTN_ICR_DIS}},
		],
		imageList:[
		    {id:"icn_PS_cancel", src:Img.ICON.ICN_CNCL_OFF},
		    {id:"icn_PS_confirm", src:Img.ICON.ICN_CONF_OFF},
		    {id:"icn_PS_boundAt_0", src:Img.ICON.ICN_PS_NONE},
		    {id:"icn_PS_boundAt_1", src:Img.ICON.ICN_PS_DL_BOTH},
		    {id:"icn_PS_boundAt_2", src:Img.ICON.ICN_PS_DR_BOTH},
		    {id:"icn_PS_boundAt_3", src:Img.ICON.ICN_PS_TUM_BOTH},
		    {id:"icn_PS_order_0", src:Img.ICON.ICN_PS_DL_BOTH},
		    {id:"icn_PS_order_1", src:Img.ICON.ICN_PS_DL_LEFT},
		    {id:"icn_PS_order_2", src:Img.ICON.ICN_PS_DL_RIGHT},
		    {id:"img_PS_explain", src:Img.ICON.ICN_PS_EXPLAIN}
		    
		],
		textList:[
		    {id:"tit_PS", text:Msg.Page.pageSplit.titPageSplit},
		    {id:"lbl_PS_cancel", text:Msg.Page.MagnificationPopup.lblMagCancel},
		    {id:"lbl_PS_confirm",	text:Msg.Page.MagnificationPopup.lblMagConfirm},
		    {id:"tit_PS_direction",	text:Msg.Page.pageSplit.lblPsDirection},
		    {id:"lbl_PS_boundAt_0",	text:Msg.Page.pageSplit.lblPsOff},
		    {id:"lbl_PS_boundAt_1",	text:Msg.Page.pageSplit.lblLeftRigth},
		    {id:"lbl_PS_boundAt_2",	text:Msg.Page.pageSplit.lblRigthLeft},
		    {id:"lbl_PS_boundAt_3",	text:Msg.Page.pageSplit.lblTopBottom},
		    {id:"lbl_PS_explain",	text:Msg.Page.pageSplit.lblExplain},
		    {id:"tit_PS_order", text:Msg.Page.pageSplit.lblPsOrder},
		    {id:"lbl_PS_order_0", text:Msg.Page.pageSplit.lblBothPage},
		    {id:"lbl_PS_order_1", text:Msg.Page.pageSplit.lblLeftPage},
		    {id:"lbl_PS_order_2", text:Msg.Page.pageSplit.lblRightPage},
		    {id:"tit_PS_centerErase", text:Msg.Page.pageSplit.lblCenterErase},
		    {id:"tit_PS_centerEraseRange", text:Msg.Page.pageSplit.lblCenterEraseRange},
		    {id:"lbl_PS_centerErase", text:glbConfig.CenterErase.Min},
		    {id:"lbl_PS_subExplain",	text:Msg.Page.pageSplit.lblSubExplain}
		]
	};

	var arg={
		key:"PageSplitPopup.centerEraseSpinner",
		number:glbConfig.CenterErase.Default,
		min:glbConfig.CenterErase.Min,
		max:glbConfig.CenterErase.Max,
		labelId:"lbl_PS_centerErase",
		btnUpId:"btn_PS_centerEraseUp",
		btnDnId:"btn_PS_centerEraseDown"/*,
		callback:{
			min:function(){
				MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.pageSplit.slideCEOverMin, true);
			},
			max:function(){
				MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.pageSplit.slideCEOverMin, true);
			},
			inputHardkeyMax:function(){
				MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.Page.pageSplit.slideCEOverMaxVal, true);
			}
		}*/
	};
	this.centerEraseSpinner=new Spinner(arg);
};

PageSplitPopup._onPageChange = function(){
	this.updateDisplay();
};

//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
PageSplitPopup.cssChange = function()
{
	switch(glbInfo.lang){
		case "ja":
			Common.setIndent("lbl_PS_cancel","40px");
			Common.setPosition("lyr_PS_subExplain","left","545px");
			Common.setPosition("lyr_PS_subExplain","width","245px");
			break;
		default:
			break;
	}
}

/**
 * 画面表示の更新（共通/画面遷移時呼び出される。）
 */
PageSplitPopup.updateDisplay = function()
{
	KISUtil.debug("function:", "updateDisplay");
	this.displayPsLayer();
	this.cssChange();
	this.setPsBoundAtBtnStatus();
	this.setPsExtractBtnStatus();
	this.setOrderLbl();
	this.setOrderIcn();
	if(this._dataSet.splitScan.enable){
		this.centerEraseSpinner.hardKeyInput = false;
		this.centerEraseSpinner.focused = true;
	}else{
		this.centerEraseSpinner.focused = false;
	}
	
};

PageSplitPopup.setPsBoundAtBtnStatus = function(){
	if(this._dataSet.splitScan.enable){
		WidgetLib.setWidgetStatus("btn_PS_boundAt_0", {on:false});
		var i=1;
		for(i; i<4; i++){
			if(i==this._dataSet.splitScan.boundAt){
				WidgetLib.setWidgetStatus("btn_PS_boundAt_" + i, {on:true});
			}else{
				WidgetLib.setWidgetStatus("btn_PS_boundAt_" + i, {on:false});
			}
		}
	}else{
		WidgetLib.setWidgetStatus("btn_PS_boundAt_0", {on:true});
		var i=1;
		for(i; i<4; i++){
			WidgetLib.setWidgetStatus("btn_PS_boundAt_" + i , {on:false});
		}
	}
};

PageSplitPopup.setPsExtractBtnStatus = function(){
	var i=0;
	for(i; i<3; i++){
		if(i==this._dataSet.splitScan.extract){
			WidgetLib.setWidgetStatus("btn_PS_order_" + i, {on:true});
		}else{
			WidgetLib.setWidgetStatus("btn_PS_order_" + i, {on:false});
		}
	}
};
PageSplitPopup.displayPsLayer = function(){
	var old = document.getElementById('lyr_PS_offOn');
	var clone = old.cloneNode(true);
	this.appendDataToElement(clone);
	old.parentNode.replaceChild(clone,old);
	
	if(!this._dataSet.splitScan.enable){
		document.getElementById('lyr_PS_centerErase').style.display = "none";
	}else{
		document.getElementById('lyr_PS_centerErase').style.display = "block";
	}
};

PageSplitPopup.appendDataToElement = function(clone){
	var i=0;
	var onArr = ["lyr_PS_order", "lyr_PS_subExplain"];
	for(i; i<clone.childNodes.length; i++){
		if(!this._dataSet.splitScan.enable){
			if(Common.indexOf(onArr, clone.childNodes[i].id) > -1){
				clone.childNodes[i].style.display = "none";
			}else if(clone.childNodes[i].id == "lyr_PS_explain"){
				clone.childNodes[i].style.display = "block";
			}
		}else{
			if(Common.indexOf(onArr, clone.childNodes[i].id) > -1){
				clone.childNodes[i].style.display = "block";
			}else if(clone.childNodes[i].id == "lyr_PS_explain"){
				clone.childNodes[i].style.display = "none";
			}
		}
	}
};

glbInfo.Icons={pageSplit:{
	left:[Img.ICON.ICN_PS_DL_BOTH,
	      Img.ICON.ICN_PS_DR_LEFT,
	      Img.ICON.ICN_PS_DL_RIGHT],
	right:[Img.ICON.ICN_PS_DR_BOTH,
	       Img.ICON.ICN_PS_DR_LEFT,
		Img.ICON.ICN_PS_DR_RIGHT],
	top:[Img.ICON.ICN_PS_TUM_BOTH,
		Img.ICON.ICN_PS_TUM_TOP,
		Img.ICON.ICN_PS_TUM_BOT],
}};
PageSplitPopup.setOrderIcn = function(){
	var i, il, key, icons, str;
	//키를 얻어옴 
	//밖으로 뺄까??
	var idx = this._dataSet.splitScanIdx||1;
	switch(idx){
		case 2:
			key = "right";
			break;
		case 3:
			key = "top";
			break;
		case 1:
		default:
		 	key = "left";
			break;
	}
	//아이콘을 취득
	icons = glbInfo.Icons.pageSplit[key];
	//아이콘을 갱신
	str="icn_PS_order_";//이것도 밖으로 뺄까?
	for(i=0,il=icons.length;i<il;i++){
		Common.setImage(str + i, icons[i]);
	}
};
PageSplitPopup.setOrderLbl = function(){
	if(this._dataSet.splitScan.boundAt == 3){
		Common.setText("lbl_PS_order_1", Msg.Page.pageSplit.lblTopPage);
		Common.setText("lbl_PS_order_2", Msg.Page.pageSplit.lblBottomPage);
	}else{
		Common.setText("lbl_PS_order_1", Msg.Page.pageSplit.lblLeftPage);
		Common.setText("lbl_PS_order_2", Msg.Page.pageSplit.lblRightPage);
	}
};

/**
 * 個別ページのイベント処理
 * @param {string} event イベントの種類
 * @param {string} id イベント発生元
 */
PageSplitPopup.EventHandler = function(event, id)
{
	switch(event)
	{
		case "onbuttondown":
			MessageManager.clearMessageArea();
			//BrowserExt.Beep(0);
			switch(id)
			{
				case "btn_PS_centerEraseUp":
					this.centerEraseSpinner.mouseDown("up");
					break;
				case "btn_PS_centerEraseDown":
					this.centerEraseSpinner.mouseDown("dn");
					break;
				default:
					break;
			}
			break;
		case "onbuttonup":
			//MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_PS_confirm":
					BrowserExt.Beep(0);
					if(this._dataSet.splitScan.enable){
						this._dataSet.inplexIdx=3;
					}else{
						this._dataSet.inplexIdx=0;
					}
					PageManager.changePage(MainPage, PageManager.type.CONFIRM);
					break;
				case "btn_PS_cancel":
					BrowserExt.Beep(0);
					PageManager.changePage(MainPage, PageManager.type.CANCEL);
					break;
				case "btn_PS_boundAt_0":
					BrowserExt.Beep(0);
					this._dataSet.splitScan.enable = false;
					this.displayPsLayer();
					this.centerEraseSpinner.focused = false;
					this._dataSet.splitScanIdx = 0;
					break;
				case "btn_PS_boundAt_1":
				case "btn_PS_boundAt_2":
				case "btn_PS_boundAt_3":
					var idx = parseInt(id.substr(15,1));
					if(this._dataSet.splitScanIdx != idx){
						this._dataSet.splitScanIdx = idx;
						this._dataSet.splitScan.enable = true;
						this._dataSet.splitScan.boundAt = parseInt(id.substr(id.length-1, 1));
						this._dataSet.splitScan.extract = 0;
						this.updateDisplay();
						if(id == "btn_PS_boundAt_3" && this._dataSet.headpositionIdx == 0){
							MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.pageSplit.slideChgHeadPositionLeft);		//with invalid beep
							this._dataSet.headpositionIdx = 1;
							Common.setImage("img_PS_subExplain", Img.ICON.ICN_PS_TOP);
						}else{
							if(this._dataSet.headpositionIdx == 1){
								MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.pageSplit.slideChgHeadPositionTop);		//with invalid beep
								this._dataSet.headpositionIdx = 0;
							}
							else{
								BrowserExt.Beep(0);
							}
							if(idx==1){
								Common.setImage("img_PS_subExplain", Img.ICON.ICN_PS_LEFT);
							}else{
								Common.setImage("img_PS_subExplain", Img.ICON.ICN_PS_RIGHT);
							}
						}
						this.centerEraseSpinner.focused = true;
					}
					else{
						BrowserExt.Beep(0);
					}
					break;
				case "btn_PS_order_0":
				case "btn_PS_order_1":
				case "btn_PS_order_2":
					BrowserExt.Beep(0);
					this._dataSet.splitScan.extract = parseInt(id.substr(id.length-1, 1));;
					break;
				case "btn_PS_centerEraseDown":
				case "btn_PS_centerEraseUp":
					this.centerEraseSpinner.mouseUp();
					break;
				default:
					BrowserExt.Beep(0);
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
					if(this.centerEraseSpinner.focused)
					{
						this.centerEraseSpinner.inputHardKey(num);
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
				case BrowserExt.keyCode.FX_VK_BACK_SPACE:
					if(this.centerEraseSpinner.focused)
					{
						this.centerEraseSpinner.hardKeyInput = false;
						this.centerEraseSpinner.clear(0,true);
					}
					else
					{
						BrowserExt.Beep(1);
					}
					break;
				case BrowserExt.keyCode.FX_VK_START:
					MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.pageSplit.slideMagUnusableStart);
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