/**
 * 기타기능화면
 */
var EtcFuncPage = new TemplatePage();
EtcFuncPage.ID = "page_etcFunc";

/**
 * 個別ページのデータ定義
 */
EtcFuncPage._initModel = function()
{
	this._dataSet = new DataSet();
	this._data = {
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
						pressImg:Img.UIPARTS.RAD_TOP_PRESS
					},
					mid:{
						offImg:Img.UIPARTS.RAD_MID_OFF,
						onImg:Img.UIPARTS.RAD_MID_ON,
						pressImg:Img.UIPARTS.RAD_MID_PRESS
					},
					bot:{
						offImg:Img.UIPARTS.RAD_BOT_OFF,
						onImg:Img.UIPARTS.RAD_BOT_ON,
						pressImg:Img.UIPARTS.RAD_BOT_PRESS
					}
					
				}
			},
			list:[]
		},
		buttonList:[
			{id:"btn_EP_back", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_back", offImg: Img.UIPARTS.BTN_NOR_OFF, pressImg: Img.UIPARTS.BTN_NOR_PRESS}},
			{id:"btn_EP_bgElimination_none", type:WidgetLib.ButtonType.RADIO, status:{on:true},attr:{targetImgId:"img_EP_bgElimination_none", offImg:Img.UIPARTS.RAD_BIG_TOP_OFF, pressImg:Img.UIPARTS.RAD_BIG_TOP_PRESS, onImg:Img.UIPARTS.RAD_BIG_TOP_ON, groupId:"btn_EPbgElimination"	}, value:false},
			{id:"btn_EP_bgElimination_set", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_EP_bgElimination_set",	offImg:Img.UIPARTS.RAD_BIG_BOT_OFF,	pressImg:Img.UIPARTS.RAD_BIG_BOT_PRESS,	onImg:Img.UIPARTS.RAD_BIG_BOT_ON, groupId:"btn_EPbgElimination"	}, value:true},
			{id:"btn_EP_darkness_deep", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_DCR_OFF, pressImg: Img.ICON.BTN_DCR_PRESS, disableImg: Img.ICON.BTN_DCR_DIS}},
			{id:"btn_EP_darkness_light", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_ICR_OFF, pressImg: Img.ICON.BTN_ICR_PRESS, disableImg:Img.ICON.BTN_ICR_DIS}},
			{id:"btn_EP_Start", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_Start", offImg: Img.UIPARTS.BTN_OPN_OFF, pressImg: Img.UIPARTS.BTN_OPN_PRESS, disableImg: Img.UIPARTS.BTN_OPN_DIS}},
			//{id:"btn_EP_pageSplit", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_pageSplit", offImg: Img.UIPARTS.BTN_NOR_OFF, pressImg: Img.UIPARTS.BTN_NOR_PRESS}}
		],
		imageList:[
			{id:"icn_EP_bgElimination_none", src:Img.ICON.ICN_PAPER_GRAY_OFF},
			{id:"icn_EP_bgElimination_set", src:Img.ICON.ICN_PAPER_WHITE_OFF},
			{id:"img_EP_darknessBar", src:Img.UIPARTS.SLI_BG},
			{id:"img_EP_darknessKnob", src:Img.UIPARTS.SLI_NOB},
			{id:"icn_EP_back", src:Img.ICON.ICN_PREV_OFF}
		],
		textList:[
			{id:"lbl_EP_bgElimination_none",	text:Msg.Func.bgElimination.none},
			{id:"lbl_EP_bgElimination_set",	text:Msg.Func.bgElimination.set},
			{id:"lbl_EP_back", text:Msg.Page.Etc.lblMainPage},
			{id:"lbl_EP_Start", text:Msg.Page.Etc.lblStart},
			{id:"tit_EP_bgElimination", text:Msg.Page.Etc.lblBgElimination},
			{id:"tit_EP_darkness", text:Msg.Page.Etc.lblDarkness}
		]
	};
};

/**
 * 풀다운 목록
 */
EtcFuncPage.pullDownList = [];

EtcFuncPage._initOthers = function(){};

EtcFuncPage._onPageChange = function(){
	this.updateDisplay();
};

//濃度管理用Object
EtcFuncPage.Darkness = {
	//薄く
	moveUp : function(){
		var currentPage = PageManager.currentPage;
		var result = true;
		var idx = currentPage._dataSet.darknessIdx;
		if(idx == 6){
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result = false;
		}else if(idx>=0){
			idx++;
			currentPage._dataSet.darknessIdx = idx;
		}else{
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result=false;
		}
		return result;
	},
	//黒く
	moveDown : function(){
		var currentPage = PageManager.currentPage;
		var result = true;
		var idx = currentPage._dataSet.darknessIdx;
		if(idx == 0){
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result = false;
		}else if(idx<=6){
			idx--;
			currentPage._dataSet.darknessIdx = idx;
		}else{
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result=false;
		}
		return result;
	}
};

EtcFuncPage.updateDisplayBgElimination = function()
{
	if(!this._dataSet.bgElimination){
		WidgetLib.setWidgetStatus("btn_EP_bgElimination_set", { on : false });
		WidgetLib.setWidgetStatus("btn_EP_bgElimination_none", { on : true });
	}else{
		WidgetLib.setWidgetStatus("btn_EP_bgElimination_set", { on : true });
		WidgetLib.setWidgetStatus("btn_EP_bgElimination_none", { on : false });
	}
};

//濃度スライダーおよびボタンの表示を更新
EtcFuncPage.updateDisplayDarkness = function()
{
	var knobObj = document.getElementById("img_EP_darknessKnob");
	if(knobObj.className != glbInfo.darkness[this._dataSet.darknessIdx].cls){
		knobObj.className = glbInfo.darkness[this._dataSet.darknessIdx].cls;
	}
	
	//changeBtnStatus
	var status = [true,true];
	var btnDeepId = "btn_EP_darkness_deep";
	var btnLightId = "btn_EP_darkness_light";
	
	if(this._dataSet.darknessIdx == 0) {
		status[0]=false;
	}else if(this._dataSet.darknessIdx == 6) {
		status[1]=false;
	}

	WidgetLib.setWidgetStatus(btnDeepId, { enable : status[0] });
	WidgetLib.setWidgetStatus(btnLightId, { enable : status[1] });
};

/**
 * 画面表示の更新（共通/画面遷移時呼び出される。）
 */
EtcFuncPage.updateDisplay = function()
{
	this.updateDisplayBgElimination();
	this.updateDisplayDarkness();
};

/**
 * 個別ページのイベント処理
 * @param {string} event イベントの種類
 * @param {string} id イベント発生元
 */
EtcFuncPage.EventHandler = function(event, id)
{
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id){
				case "btn_EP_Start":
					WidgetLib.setWidgetStatus("btn_MP_Start",{enable:false});		//버튼 연타를 막기위한 조치
					WidgetLib.setWidgetStatus("btn_EP_Start",{enable:false});		//버튼 연타를 막기위한 조치
					var infoData = document.getElementById("txt_userInputInfo").value;
					if(!infoData){
						BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.ERROR_MSG.FAIL_NOT_INPUT_USER_INFO);
						WidgetLib.setWidgetStatus("btn_MP_Start",{enable:true});
						WidgetLib.setWidgetStatus("btn_EP_Start",{enable:true});
						return;
					}
					BrowserExt.Beep(0);
					doScanJobStart();
					break;
				case "btn_EP_back":
					BrowserExt.Beep(0);
					PageManager.changePage(MainPage, PageManager.type.CONFIRM);
					break;
				case "btn_EP_darkness_deep":
					if(!this.Darkness.moveDown()) {
						BrowserExt.Beep(1);
					}
					BrowserExt.Beep(0);
					this.updateDisplayDarkness();
					setDarknessIdx();
					break;
				case "btn_EP_darkness_light":
					if(!this.Darkness.moveUp()) {
						BrowserExt.Beep(1);
					}
					BrowserExt.Beep(0);
					this.updateDisplayDarkness();
					setDarknessIdx();
					break;
				case "btn_EP_bgElimination_set":
					BrowserExt.Beep(0);
					this._dataSet.bgElimination = true;
					setBgElimination();
					break;
				case "btn_EP_bgElimination_none":
					BrowserExt.Beep(0);
					this._dataSet.bgElimination = false;
					setBgElimination();
					break;
				default:
					BrowserExt.Beep(0);
					break;
			}
			break;
		case "onbuttondown":
			MessageManager.clearMessageArea();
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id){
				case BrowserExt.keyCode.FX_VK_START:
					if(WebServiceLib.getActiveRequestCount() != 0){
						BrowserExt.Beep(1);
						return;
					}

					var infoData = document.getElementById("txt_userInputInfo").value;
					if(!infoData){
						BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.ERROR_MSG.FAIL_NOT_INPUT_USER_INFO);
						WidgetLib.setWidgetStatus("btn_MP_Start",{enable:true});
						WidgetLib.setWidgetStatus("btn_EP_Start",{enable:true});
						return;
					}

					BrowserExt.Beep(0);
					doScanJobStart();
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