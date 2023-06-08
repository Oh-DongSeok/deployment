/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/黄色）
 */
var TraySelectionPopup = new TemplatePage();

TraySelectionPopup.ID = "pop_traySelectionPopup";

/**
 * 개별 페이지의 Data정의
 */
TraySelectionPopup._initModel=function()
{
	this._data = {
		buttonList:[			
			//{id:"btn_TS_start", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_TS_start",offImg: Img.UIPARTS.BTN_SML_OFF,onImg:Img.UIPARTS.BTN_SML_ON, pressImg: Img.UIPARTS.BTN_SML_PRESS, disableImg: Img.UIPARTS.BTN_SML_DIS}}
			{id:"btn_TS_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:false}, attr:{targetImgId:"img_TS_confirm",offImg: Img.UIPARTS.BTN_SML_OFF,onImg:Img.UIPARTS.BTN_SML_ON, pressImg: Img.UIPARTS.BTN_SML_PRESS, disableImg: Img.UIPARTS.BTN_SML_DIS}},
			{id:"btn_TS_cancel", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_TS_cancel",offImg: Img.UIPARTS.BTN_SML_OFF,onImg:Img.UIPARTS.BTN_SML_ON, pressImg: Img.UIPARTS.BTN_SML_PRESS, disableImg: Img.UIPARTS.BTN_SML_DIS}}
		],
		imageList:[
		          //{id:"img_card_reader_charge",src:Img.BG.CARD_READER}
		],
		textList:[
			{id:"lbl_TS_guide", text:Msg.Page.TraySelectionPopup.guide},
			{id:"lbl_TS_confirm", text:Msg.Page.TraySelectionPopup.confirm},
			{id:"lbl_TS_cancel", text:Msg.Page.TraySelectionPopup.cancel}
				/*{id:"tit_TS_outputMediumSize", text:Msg.Page.TraySelectionPopup.oms},
				{id:"tit_TS_colorMode", text:Msg.Page.TraySelectionPopup.colorMode},
				{id:"tit_TS_pages", text:Msg.Page.TraySelectionPopup.pages},
				{id:"tit_TS_outplex", text:Msg.Page.TraySelectionPopup.outplex},
				{id:"tit_TS_copiesPrice", text:Msg.Page.TraySelectionPopup.copiesPrice},
				{id:"tit_TS_copies", text:Msg.Page.TraySelectionPopup.copies},
				{id:"tit_TS_totalPrice", text:Msg.Page.TraySelectionPopup.totalPrice},
				{id:"lbl_TS_start",text:Msg.Page.TraySelectionPopup.btnClose}*/
		]
		
	};
};
TraySelectionPopup._initOthers = function()
{
	var _tray,direction,level,trayObj,trayPaperObj,traySizeObj0,traySizeObj1,trayBtnObj;
	//this._data.buttonList = [];		//TODO: 기본 데이터 존재시에 대한 처리 필요
	//this._data.imageList = [];
	//this._data.textList = [];
	var btnImg = {
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
		
	};
	
	for(var i=0,il=(glbInfo.tray.length>4)?glbInfo.tray.length:4;i<il;i++){
		_tray = glbInfo.tray[i];
		_enable = !!(_tray&&_tray.Status == "READY");
		//console.log(JSON.stringify(_tray));
		if(_tray&&_tray.Status){
			direction = _tray.FeedDirection;
			level = _tray.CurrentLevel;
			/*trayObj = {//Auto
				id:"",
				icon:{off:Img.FUNC["ICN_TRAY_"+direction+"_" +level],dis:Img.FUNC["ICN_TRAY_"+direction+"_" +level+"_DIS"]},
				iconLeft:{off:Img.FUNC["ICN_TRAY_"+direction+"_" +level],dis:Img.FUNC["ICN_TRAY_"+direction+"_" + level+"_DIS"]},
				text0:_tray.MediumSize,
				text1:(typeof Msg.Func.tray[_tray.MediumType] == "undefined")? Msg.Func.tray.other:Msg.Func.tray[_tray.MediumType],
				value:JFLib.INTRAY["TRAY"+(i+1)]
			};*/
			trayPaperObj = {id:"icn_TS_tray_menu_" + i, src:Img.FUNC["ICN_TRAY_"+direction+"_" +level]};
			traySizeObj0 = {id:"lbl_TS_tray_menu_"+ i +"_0", text:_tray.MediumSize};
			traySizeObj1 = {id:"lbl_TS_tray_menu_"+ i +"_1", text:(typeof Msg.Func.tray[_tray.MediumType] == "undefined")? Msg.Func.tray.other:Msg.Func.tray[_tray.MediumType]};
			this._data.imageList.push(trayPaperObj);
			this._data.textList.push(traySizeObj0);
			this._data.textList.push(traySizeObj1);
		}
		else{
			Common.changeVisibility("icn_TS_tray_menu_" + i,"none");
			Common.changeVisibility("lbl_TS_tray_menu_"+ i +"_0","none");
			Common.changeVisibility("lbl_TS_tray_menu_"+ i +"_1","none");
		}
		
		trayBtnObj = {	id:"btn_TS_tray_menu_"+ i, 
			type:WidgetLib.ButtonType.RADIO, 
			status:{on:false, enable:_enable}, 
			attr:{
				targetImgId:"img_TS_tray_menu_"+i, 
				groupId:"BTN_TS_TRAY"}};
		extendDeep((i==0)?btnImg.top:((i==3)?btnImg.bot:btnImg.mid),trayBtnObj.attr);
		this._data.buttonList.push(trayBtnObj);
	}
};

TraySelectionPopup._onPageChange = function(){
	KISUtil.debug("TraySelectionPopup.sendRequest:","excute");
	//var className = "pattern-background";
	//var pageObj = document.getElementById(TraySelectionPopup.ID);
	//if(pageObj && pageObj.classList && !pageObj.classList.contains(className)) pageObj.classList.add(className);
	
	this.updateDisplay();
	//Common.sendRequestCardLogIn(Common.getCardLogIn);
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
TraySelectionPopup.updateDisplay = function()
{
	TraySelectionPopup.updateTraySelect();
};

TraySelectionPopup._onPageChange = function(){
	BrowserExt.Beep(0);
	TraySelectionPopup.updateDisplay();
};
TraySelectionPopup.updateTraySelect = function (){
	//var _idx = Common.indexOf(MainPage.pullDownList, "tray");
	//var lst=this._data.pulldownList.list[_idx];
	var i, len, _tray, _val;
	for(i=0, len=glbInfo.tray.length;i<len; i++){
		_tray = glbInfo.tray[i];
		if(_tray&&_tray.Status){
			direction = _tray.FeedDirection;
			level = _tray.CurrentLevel;
			//document.getElementById("lbl_TS_tray_menu_" + i).setAttribute("class", "lbl0");
			Common.setText("lbl_TS_tray_menu_" + i + "_0", _tray.MediumSize);
			Common.setText("lbl_TS_tray_menu_" + i + "_1", (typeof Msg.Func.tray[_tray.MediumType] == "undefined")? Msg.Func.tray.other:Msg.Func.tray[_tray.MediumType]);
					
			if(!_tray.usable){
				Common.setImage("icn_TS_tray_menu_" + i, Img.FUNC["ICN_TRAY_"+direction+"_" +level+"_DIS"]);
				Common.addClass("btn_TS_tray_menu_" + i,"disableFont");
			}else{
				Common.setImage("icn_TS_tray_menu_" + i, Img.FUNC["ICN_TRAY_"+direction+"_" +level]);
				Common.removeClass("btn_TS_tray_menu_" + i,"disableFont");
			}
		}
	}
};
/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
TraySelectionPopup.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_TS_tray_menu_0":
				case "btn_TS_tray_menu_1":
				case "btn_TS_tray_menu_2":
				case "btn_TS_tray_menu_3":
					var idx = parseInt(id[id.length-1]);
					this._dataSet.trayIdx = idx+1;
					this._dataSet.outputMediumSize = glbInfo.tray[idx].MediumSize;
					WidgetLib.setWidgetStatus("btn_TS_confirm",{enable:true});
					break;
				case "btn_TS_confirm":
					//용지크기 지정
					//중지했던 요금계산
					if(this._dataSet.outputMediumSize) glbInfo.docInfo.outputMediumSize = this._dataSet.outputMediumSize;
					Common.calculateCharge(glbInfo.docInfo);
					//과금화면 천이
					PageManager.changePage(ChargeInfoPopup , PageManager.type.NORMAL);
					break;
				case "btn_TS_cancel":
					//취소
					//파일삭제 가능하려나?
					//.promise(function(){});
					//dataClear
					//TODO 전후의 데이터 확인하여 정말 클리어 되는지 조사할것
					//재시작
					window.location.reload(true);
					break;
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id)
			{
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