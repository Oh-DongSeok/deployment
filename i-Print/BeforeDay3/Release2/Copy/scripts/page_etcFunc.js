/**
* 個別ページの表示および動作用
 * （その他の機能ページ）
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
			list:[
					{pageKey:"EP",key:"imageMode",value:[
						{
							icon:{off:Img.FUNC.ICN_IM_MIXED,dis:Img.FUNC.ICN_IM_MIXED},
							iconLeft:{off:Img.FUNC.ICN_IM_MIXED,dis:Img.FUNC.ICN_IM_MIXED},
							text:Msg.Func.imageMode.mixed,
							value:	JFLib.IM.MIXED
						},
						{
							icon:{off:Img.FUNC.ICN_IM_TEXT,dis:Img.FUNC.ICN_IM_TEXT},
							iconLeft:{off:Img.FUNC.ICN_IM_TEXT,dis:Img.FUNC.ICN_IM_TEXT},
							text:Msg.Func.imageMode.text,
							value:	JFLib.IM.TEXT
						},
						{
							icon:{off:Img.FUNC.ICN_IM_PHOTO,dis:Img.FUNC.ICN_IM_PHOTO},
							iconLeft:{off:Img.FUNC.ICN_IM_PHOTO,dis:Img.FUNC.ICN_IM_PHOTO},
							text:Msg.Func.imageMode.photo,
							value: JFLib.IM.HALFTONE
						}
					]}
				]
		},
		buttonList:[
		    {id:"btn_EP_pageType_0", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_EP_pageType_0", offImg: Img.UIPARTS.RAD_HRZ_POT_OFF, pressImg: Img.UIPARTS.RAD_HRZ_POT_PRESS, onImg: Img.UIPARTS.RAD_HRZ_POT_ON, groupId:"btn_EP_pageType"}},
		    {id:"btn_EP_pageType_1", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_EP_pageType_1", offImg: Img.UIPARTS.RAD_HRZ_LAN_OFF, pressImg: Img.UIPARTS.RAD_HRZ_LAN_PRESS, onImg:Img.UIPARTS.RAD_HRZ_LAN_ON, groupId:"btn_EP_pageType"}},
			{id:"btn_EP_back", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_back", offImg: Img.UIPARTS.BTN_NOR_OFF, pressImg: Img.UIPARTS.BTN_NOR_PRESS}},
			{id:"btn_EP_headposition_top", type:WidgetLib.ButtonType.RADIO,	status:{on:true},attr:{	targetImgId:"img_EP_headposition_top", offImg:Img.UIPARTS.RAD_BIG_TOP_OFF, pressImg:Img.UIPARTS.RAD_BIG_TOP_PRESS, onImg:Img.UIPARTS.RAD_BIG_TOP_ON, groupId:"btn_EP_headposition"	}, value: JFLib.HP.TOP},
			{id:"btn_EP_headposition_left", type:WidgetLib.ButtonType.RADIO, attr:{	targetImgId:"img_EP_headposition_left",	offImg:Img.UIPARTS.RAD_BIG_BOT_OFF,	pressImg:Img.UIPARTS.RAD_BIG_BOT_PRESS,	onImg:Img.UIPARTS.RAD_BIG_BOT_ON, groupId:"btn_EP_headposition"	}, value: JFLib.HP.LEFT},
			{id:"btn_EP_bgElimination_none", type:WidgetLib.ButtonType.RADIO, status:{on:true},attr:{targetImgId:"img_EP_bgElimination_none", offImg:Img.UIPARTS.RAD_BIG_TOP_OFF, pressImg:Img.UIPARTS.RAD_BIG_TOP_PRESS, onImg:Img.UIPARTS.RAD_BIG_TOP_ON, groupId:"btn_EPbgElimination"	}, value:false},
			{id:"btn_EP_bgElimination_set", type:WidgetLib.ButtonType.RADIO, attr:{targetImgId:"img_EP_bgElimination_set",	offImg:Img.UIPARTS.RAD_BIG_BOT_OFF,	pressImg:Img.UIPARTS.RAD_BIG_BOT_PRESS,	onImg:Img.UIPARTS.RAD_BIG_BOT_ON, groupId:"btn_EPbgElimination"	}, value:true},
			{id:"btn_EP_darkness_deep", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_DCR_OFF, pressImg: Img.ICON.BTN_DCR_PRESS, disableImg: Img.ICON.BTN_DCR_DIS}},
			{id:"btn_EP_darkness_light", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.ICON.BTN_ICR_OFF, pressImg: Img.ICON.BTN_ICR_PRESS, disableImg:Img.ICON.BTN_ICR_DIS}},
			{id:"btn_EP_Start", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_Start", offImg: Img.UIPARTS.BTN_OPN_OFF, pressImg: Img.UIPARTS.BTN_OPN_PRESS, disableImg: Img.UIPARTS.BTN_OPN_DIS}},
			{id:"btn_EP_pageSplit", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId:"img_EP_pageSplit", offImg: Img.UIPARTS.BTN_NOR_OFF, pressImg: Img.UIPARTS.BTN_NOR_PRESS}}
		],
		imageList:[
		    {id:"icn_EP_pageType_0", src:Img.ICON.ICN_DOC_POT_OFF},
		    {id:"icn_EP_pageType_1", src:Img.ICON.ICN_DOC_LAN_OFF},
			{id:"icn_EP_headposition_top", src:Img.ICON.ICN_PRINT_POT_OFF},
			{id:"icn_EP_headposition_left", src:Img.ICON.ICN_PRINT_LAN_OFF},
			{id:"icn_EP_bgElimination_none", src:Img.ICON.ICN_PAPER_GRAY_OFF},
			{id:"icn_EP_bgElimination_set", src:Img.ICON.ICN_PAPER_WHITE_OFF},
			{id:"img_EP_darknessBar", src:Img.UIPARTS.SLI_BG},
			{id:"img_EP_darknessKnob", src:Img.UIPARTS.SLI_NOB},
			{id:"icn_EP_back", src:Img.ICON.ICN_PREV_OFF}
		],
		textList:[
			{id:"lbl_EP_headposition_top",	text:Msg.Func.headPosition.top},
			{id:"lbl_EP_headposition_left",	text:Msg.Func.headPosition.left},
			{id:"lbl_EP_bgElimination_none",	text:Msg.Func.bgElimination.none},
			{id:"lbl_EP_bgElimination_set",	text:Msg.Func.bgElimination.set},
			{id:"lbl_EP_back", text:Msg.Page.Etc.lblMainPage},
			{id:"lbl_EP_Start", text:Msg.Page.Etc.lblStart},
			{id:"tit_EP_pageType", text:Msg.Page.Etc.lblPageType},
			{id:"tit_EP_headposition", text:Msg.Page.Etc.lblHeadPosition},
			{id:"tit_EP_imageMode", text:Msg.Page.Etc.lblImageMode},
			{id:"tit_EP_bgElimination", text:Msg.Page.Etc.lblBgElimination},
			{id:"tit_EP_darkness", text:Msg.Page.Etc.lblDarkness}
		]
	};
};

EtcFuncPage._initOthers = function(){
	this._initPullDown("EP");
};

EtcFuncPage._onPageChange = function(){
	this.updateDisplay();
};


/**
 * 풀다운 목록
 */
EtcFuncPage.pullDownList = ["imageMode"];

//濃度管理用Object
EtcFuncPage.Darkness = {
	//薄く
	moveUp : function()
	{
		var currentPage = PageManager.currentPage;
		var result = true;
		var idx = currentPage._dataSet.darknessIdx;
		if(idx == 6) {
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result = false;
		}
		else if(idx>=0){
			idx++;
			currentPage._dataSet.darknessIdx = idx;
		}
		else
		{
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result=false;
		}
		return result;
	},
	//黒く
	moveDown : function()
	{
		var currentPage = PageManager.currentPage;
		var result = true;
		var idx = currentPage._dataSet.darknessIdx;
		if(idx == 0) {
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result = false;
		}
		else if(idx<=6){
			idx--;
			currentPage._dataSet.darknessIdx = idx;
		}
		else
		{
			KISUtil.debug("invalid DataType/darkness", currentPage._dataSet.darkness);
			result=false;
		}
		return result;
	}
};

//原稿向きの表示更新
EtcFuncPage.updateDisplayPageType = function()
{
	if(this._dataSet.orientation==0){
		WidgetLib.setWidgetStatus("btn_EP_pageType_0", { on : true });
		WidgetLib.setWidgetStatus("btn_EP_pageType_1", { on : false });
	}else{
		WidgetLib.setWidgetStatus("btn_EP_pageType_0", { on : false });
		WidgetLib.setWidgetStatus("btn_EP_pageType_1", { on : true });
	}
	updatePreviewImg("EP");
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
	}
	else if(this._dataSet.darknessIdx == 6) {
		status[1]=false;
	}

	WidgetLib.setWidgetStatus(btnDeepId, { enable : status[0] });
	WidgetLib.setWidgetStatus(btnLightId, { enable : status[1] });
	
	var btnDeepObj=document.getElementById(btnDeepId);
	var btnLightObj=document.getElementById(btnLightId);

	if(btnDeepObj)
	{
		if(!status[0]) btnDeepObj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', '"+btnDeepId+"')");
	}
	if(btnLightObj){
		if(!status[1]) btnLightObj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', '"+btnLightId+"')");
	}
};

EtcFuncPage.updateDisplayHeadPosition = function(){
	if(this._dataSet.headpositionIdx == 0){
		WidgetLib.setWidgetStatus("btn_EP_headposition_top", { on : true });
		WidgetLib.setWidgetStatus("btn_EP_headposition_left", { on : false });
	}else{
		WidgetLib.setWidgetStatus("btn_EP_headposition_top", { on : false });
		WidgetLib.setWidgetStatus("btn_EP_headposition_left", { on : true });
	}
};

/**
 * 画面表示の更新（共通/画面遷移時呼び出される。）
 */
EtcFuncPage.updateDisplay = function()
{
	this.updateDisplayHeadPosition();
	this.updateDisplayBgElimination();
	this.updateDisplayDarkness();
	this.updateDisplayPageType();
	this.updatePulldown("EP", 0);
	updatePreviewImg("EP");
};

/**
 * 個別ページのイベント処理
 * @param {string} event イベントの種類
 * @param {string} id イベント発生元
 */
EtcFuncPage.EventHandler = function(event, id)
{
	switch(event)
	{
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_EP_Start":
					if(!WidgetLib.getWidgetStatus("pul_MP_tray").enable){
						BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.Main.slideStartTrayDis);
						return;
					}
					WidgetLib.setWidgetStatus("btn_MP_Start",{enable:false});		//버튼 연타를 막기위한 조치
					WidgetLib.setWidgetStatus("btn_EP_Start",{enable:false});		//버튼 연타를 막기위한 조치
					BrowserExt.Beep(0);
					doScanJobStart();
					break;
				case "btn_EP_pageType_0":
				case "btn_EP_pageType_1":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.orientation=idx;
					updatePreviewImg("EP");
					break;
				case "btn_EP_back":
					BrowserExt.Beep(0);
					//画面遷移
					PageManager.changePage(MainPage, PageManager.type.CONFIRM);
					break;
				case "btn_EP_imageMode_menu_0":
				case "btn_EP_imageMode_menu_1":
				case "btn_EP_imageMode_menu_2":
					BrowserExt.Beep(0);
					var idx=parseInt(id.substring(id.length, id.length-1));
					this._dataSet.imageModeIdx=idx;
					setImageModeIdx();
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
				case "btn_EP_headposition_top":
					BrowserExt.Beep(0);
					this._dataSet.headpositionIdx = 0;
					setHeadPosition();
					break;
				case "btn_EP_headposition_left":
					BrowserExt.Beep(0);
					this._dataSet.headpositionIdx = 1;
					setHeadPosition();
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
		case  "onpopupopen":
			switch(id)
			{
				case "pul_EP_imageMode_popup":
					this.displayPullMenuBtn("EP", 0);
					break;
				default:
					break;
			}
			break;
		case  "onpopupclose":
			switch(id)
			{
				case "pul_EP_imageMode_popup":
					this.updatePulldown("EP",0);
					break;
				default:
					break;
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_START:
					if(!WidgetLib.getWidgetStatus("pul_MP_tray").enable){
						BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.Page.Main.slideStartTrayDis);
						return;
					}
					if(WebServiceLib.getActiveRequestCount() != 0){
						BrowserExt.Beep(1);
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

/**
 * プルダウン閉じ処理用メソッド
 * templatePage.jsから移動
 */
EtcFuncPage.onPageClick = function(){
	MessageManager.clearMessageArea();
	switch(WidgetLib._popupId)
	{
		case "pul_EP_imageMode_popup":
			WidgetLib.closePopupWidget(WidgetLib._popupId);
			break;
		default:
			break;
	}
};
