/**
 * 개별 페이지의 표시 및 동작용
 * （IC Card등록용 팝업）
 */
var FileListPage = new TemplatePage();

FileListPage.ID = "page_FileList";

/**
 * 개별 페이지의 Data정의
 */
FileListPage._initModel=function()
{
	this._data=
	{
		buttonList:[
			{id:"btn_FL_SelectAll",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{targetImgId:"img_FL_SelectAll", offImg:Img["SELECT_ALL_BTN_OFF"], pressImg:Img["SELECT_ALL_BTN_PRESS"], onImg:Img["SELECT_ALL_BTN_ON"], disableImg:Img["SELECT_ALL_BTN_DIS"]}},
		    {id:"btn_FL_DeleteFile",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{targetImgId:"img_FL_DeleteFile", offImg:Img["DELETE_FILE_BTN_OFF"], pressImg:Img["DELETE_FILE_BTN_PRESS"], disableImg:Img["DELETE_FILE_BTN_DIS"]}},
		    {id:"btn_FL_pageFirst",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_FIRST_BTN_OFF"], pressImg:Img["FILE_LIST_FIRST_BTN_PRESS"], disableImg:Img["FILE_LIST_FIRST_BTN_DIS"]}},
		    {id:"btn_FL_pageUp",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_UP_BTN_OFF"], pressImg:Img["FILE_LIST_UP_BTN_PRESS"], disableImg:Img["FILE_LIST_UP_BTN_DIS"]}},
		    {id:"btn_FL_pageDown",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_DOWN_BTN_OFF"], pressImg:Img["FILE_LIST_DOWN_BTN_PRESS"], disableImg:Img["FILE_LIST_DOWN_BTN_DIS"]}},
		    {id:"btn_FL_pageLast",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_LAST_BTN_OFF"], pressImg:Img["FILE_LIST_LAST_BTN_PRESS"], disableImg:Img["FILE_LIST_LAST_BTN_DIS"]}},
		    {id:"btn_FL_Print",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{targetImgId:"img_FL_Print", offImg:Img["PRINT_BTN_OFF"], pressImg:Img["PRINT_BTN_PRESS"], disableImg:Img["PRINT_BTN_DIS"]}}
		],
		imageList:[
			/*{id:"img_FL_bg",	src:Img["IMG_FL_BG"]},
			{id:"img_FL_PrintQuantity", src:Img["TEXT_INPUT_BOX_ENABLE"]}*/			
		],
		textList:[
			{id:"lbl_FL_SelectedFile",text:Msg.Page.FILELIST.SELECTED_FILE_NUMBER_MSG},
			{id:"lbl_FL_SelectAll",	text:Msg.Page.FILELIST.SELECT_ALL_BTN_LABEL_0},
			{id:"lbl_FL_DeleteFile", text:Msg.Page.FILELIST.DELETE_FILE_BTN_LABEL, className:"lbl disabled"},
			{id:"txt_FL_NotifyMsg0",	text:Msg.Page.FILELIST.LOADING_MSG_0},
			{id:"txt_FL_NotifyMsg1",	text:Msg.Page.FILELIST.LOADING_MSG_1},
			{id:"txt_FL_NotifyMsg2",	text:Msg.Page.FILELIST.LOADING_MSG_2},
			{id:"txt_FL_NotifyMsg3",	text:Msg.Page.FILELIST.LOADING_MSG_3},
			//{id:"lbl_FL_UserBalance",	text:(!!glbInfo.UserBalance)?Msg.Page.FILELIST.USER_BALANCE_FORMAT.replace(/Xxx/,Common.getLocalNumber(glbInfo.UserBalance)):""},
			{id:"lbl_FL_Print", text:Msg.Page.FILELIST.PRINT_SETTING_BTN_LABEL_0, className:"lbl disabled"}
		]
	};
	this.docListManager = new DocListManager({targetId:"lyr_FL_Display_Area", hasFirstBtn:true});
	this.cssChange();
	this.docListManager.updateSelectedFileCount = FileListPage.updateDisplaySelectedFileCount;					//TODO:delete???
	this.docListManager.updateCurrentPage = FileListPage.updateDisplayCurrentPage;
};

//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
FileListPage.cssChange = function()
{
	if(!glbConfig.nup&&!glbConfig.outPlex){
		for(var i=0;i<5;i++){
			Common.setPosition("lblDocItemPrice"+i,"top","27px");
			Common.setPosition("lblDocItemPrice"+i,"left","527px");
		}
	}
	switch(glbInfo.lang){
		case "en":
			Common.setPosition("txt_FL_SelectedFile","left","165px");/* 2016.05.25 chone 다언어대응 */
			Common.setPosition("lbl_FL_DeleteFile","left","-7px");
			break;
		case "ja":
			Common.setPosition("txt_FL_SelectedFile","left","195px");/* 2016.05.25 chone 다언어대응 */
			break;
		case "ch":
			Common.setPosition("txt_FL_SelectedFile","left","135px");/* 2016.05.25 chone 다언어대응 */
			break;	
		default:
			break;
	}
}

/**
 * 페이지 천이 직후 호출됨  
 */
FileListPage._onPageChange = function(){
	//문서리스트가 존재하지않는경우(리스트화면 최초 표시시점)
	//문서리스트를 요청,최초이외의 경우의 갱신은 갱신버튼에 의한 경우밖에 없으므로
	var _loadFlg = false;
	//최초
	////부재
	////존재
	//갱신
	console.log(this._dataSet.docList);
	console.log(glbInfo.isJobExcuted);
	if(!this._dataSet.docList || glbInfo.isJobExcuted){
		_loadFlg = true;
		//잡 실행에 Flag 원복
		glbInfo.isJobExcuted = false;
		//리스트 선택정보 초기화
		this.docListManager.selectedItemIdx = -1;	//선택 초기화		//TODO:delete??
		this.docListManager.setCheckedItems([]);	//체크 초기화

		this.displayFileSelectedNumLoading();

		this.docListManager.initDisplay();

		if(!glbConfig.ENABLE_DOC_PRINT_SET){		//인쇄부수 미지원시
			/*var _css = document.createElement("style");
			_css.setAttribute("type","text/css");
			_css.innerHTML = ".lbl.fileQat{ display:none; }";
			document.body.appendChild(_css);*/
			for(var i=0;i<5;i++){
				Common.changeVisibility("lblDocItemQat"+i,"none");
			}
		}
		
		//glbDataSet.docList=_lst;
		this.store();
		this.docListManager.currentPageIdx = 1;	//페이지 초기화
		this.docListManager.setDataSource(glbInfo.docList||[]);
		this.docListManager.refresh(true);
		document.getElementById("lyr_FL_Display_Area").className = "";
		//this.refreshStoredDocument();
	}
	else {// if(this._dataSet.docList){
		this.docListManager.setDataSource(this._dataSet.docList||[]);
		if(this.docListManager.selectedItemIdx > -1){						//TODO:delete???
			var _doc = this.docListManager.dataSource[this.docListManager.selectedItemIdx];
			//this.prnCntManager.setNum(_doc.printCnt);
			//인쇄매수 변경분 반영
			//this.docListManager.updateQuantity(this.updateQuantity, false);
			//this.docListManager.updateInvalidFlag();
		}
		this.updateDisplay();
	}
};

/**
 * 화면 표시의 갱신 (공용/화면전환시 호출된다.)
 */
FileListPage.updateDisplay = function(){
	KISUtil.debug("function:", "updateDisplay");
	//this.docListManager.setDataSource(this._dataSet.docList);		//TODO:_onPageChange에서 중복할당중임 시간될때 refactoring할것 
	this.cssChange();
	this.docListManager.refresh();
	var _selectedDoc = this.docListManager.getSelectedDocInfo();
	//if(_selectedDoc.success){
	//	this.prnCntManager.setNum(_selectedDoc.doc.printCnt);						//TODO:delete???
	//}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event 발생원
 */
FileListPage.EventHandler = function(event, id)
{
	KISUtil.debug("EventHandler","event:"+event+"/id:"+id);
	switch(event){
		case "LoginChk":
			//console.log(arguments);
			//*//DummyCode start
			//arguments[1]=true;
			//arguments[2]= {rt:"1"};
			//*/
			//DummyCode end
			if(arguments[1]===true){
				var obj = arguments[2];
				
				/*if(obj.JobList){//XML용
					console.log(obj.JobList);//XML용
					this.docListManager.setDataSource(obj.JobList);//XML용*/
				if(obj.jobList){//JSON용
					console.log(obj.jobList);//JSON용
					this.docListManager.setDataSource(obj.jobList);//JSON용
					this.docListManager.refresh(true);
					/*glbInfo.docInfo = {
						docId : tmp.Identifier,
						inputMediumSize : tmp.MediumSize,
						pages : parseInt(tmp.NumberOfPages),
						outputMediumSize : null
					};*/
					//var iframes = window.parent.document.getElementsByTagName("iframe");
					//if(iframes.length>0){
					//	iframes[0].dispatchEvent(new Event("readyToDisplay"));
					//	excuteToParent("ServiceManager.displayIframe", null);
					//}
				}
			}
			break;
		case "onbuttonup":
			MessageManager.clearMessageArea();
			//삭제중인경우 키 입력을 제한함
			if(glbInfo.isDelete){
				BrowserExt.Beep(1);
				break;
			}
			switch(id)
			{
				case "btn_FL_Print":
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, true);
					//인쇄 가능여부 판단
					var _lst = this.docListManager.getCheckedItems();
					if(_lst.length>0){
						WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});		//버튼 연타를 막기위한 조치
						//Run Job
						BrowserExt.Beep(0);
						//카피할 설정내용을 서버에 전송(Request)후, 가격정보를 받는 처리가 필요.
					   Common.doJobStart_Cancel(false,_lst); //JSON대응
					}
					else{
						BrowserExt.Beep(1);
						KISUtil.debug("FileListPage.EventHandler/onbuttonup/btn_FL_Print/lst.length",_lst.length);
					}
					break;
				case "btn_FL_pageFirst":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, false);
					this.docListManager.goFirstPage();
					break;
				case "btn_FL_pageUp":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, false);
					this.docListManager.goPrevPage();
					break;
				case "btn_FL_pageDown":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, false);
					this.docListManager.goNextPage();
					break;
				case "btn_FL_pageLast":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, false);
					this.docListManager.goLastPage();
					break;
				case "btn_FL_SelectAll":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, true);
					this.docListManager.selectAllItems();
					break;
				case "btn_FL_DeleteFile":
					var _lst = this.docListManager.getCheckedItems();
					if(_lst.length>0){
						//Run Job
						BrowserExt.Beep(0);
						Common.doJobStart_Cancel(true,_lst);
					}
					else{
						BrowserExt.Beep(1);
						KISUtil.debug("FileListPage.EventHandler/onbuttonup/btn_FL_Print/lst.length",_lst.length);
					}
					break;
				case "btnDocItem0":
				case "btnDocItem1":
				case "btnDocItem2":
				case "btnDocItem3":
				case "btnDocItem4"://TODO 확장시를 고려
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, true);
					//getIndex
					var idx = parseInt(id.substring(id.length, id.length - 1));
					this.docListManager.selectItem(idx);
					var _selectedDoc = this.docListManager.getSelectedDocInfo();						//TODO:delete???
					if(_selectedDoc.success){
						/*
						if(!_selectedDoc.doc.prnType){
							this.prnCntManager.setNum(_selectedDoc.doc.printCnt);
							//this.prnCntManager.setEnableFlag(!_selectedDoc.doc.prnType);
							var _policy = this._getCurrentPolicy();
							if(_policy.success&&_policy.status.msg!=""){
								MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", Msg.errorMessage[_policy.status.msg]);
								this.prnCntManager.setEnableFlag(_policy.status.printStatus);
							}else{
								this.prnCntManager.setEnableFlag(false);
							}
						}*/
						//console.log(_selectedDoc);
					}
					break;
				default:
					BrowserExt.Beep(0);
					break;
			}
			break;
		case "ondisablekeydown":
			KISUtil.debug(event,id);
			MessageManager.clearMessageArea();
			var status = WidgetLib.getWidgetStatus(id);
			if(!status.enable)
			{
				switch(id)
				{
					case "btn_FL_Print":
					case "btn_FL_DeleteFile":
						//BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.REQUIRE_DOC_SELECTION);
						break;
					case "btn_FL_pageFirst":
					case "btn_FL_pageUp":
						//BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.IS_FIRST_PAGE);
						break;
					case "btn_FL_pageDown":
					case "btn_FL_pageLast":
						//BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.IS_LAST_PAGE);
						break;
					default:
						break;
				}
			}
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			//삭제중인경우 키 입력을 제한함
			if(glbInfo.isDelete){
				BrowserExt.Beep(1);
				break;
			}
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_START:
					//인쇄매수 변경분 반영
					//this.docListManager.updateQuantity(this.updateQuantity, true);
					//인쇄 가능여부 판단
					var _lst = this.docListManager.getCheckedItems();
					if(_lst.length>0){
						//Run Job
						BrowserExt.Beep(0);
						if(WebServiceLib.getActiveRequestCount() != 0){//연타방지
							BrowserExt.Beep(1);
							return;
						}
						//카피할 설정내용을 서버에 전송(Request)후, 가격정보를 받는 처리가 필요.
					   Common.doJobStart_Cancel(false,_lst); //JSON대응
					}
					else{
						BrowserExt.Beep(1);
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.REQUIRE_DOC_SELECTION);
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

FileListPage.getSelectedListByLength = function(cnt){					//TODO:delete???
	var _selectedList = [];
	for(var i = 0; i < cnt; i++){
		_selectedList[i] = i;
	}
	return _selectedList;
};

/**
 * 파일리스트페이지용 HTML구성
 */
FileListPage._createHtml = function()
{
	createFileListPageHtml();
};

/**
 * 
 */
FileListPage._initOthers = function()
{
	if(glbConfig.ENABLE_DOC_DELETE){		//삭제옵션이 활성화 된경우 삭제버튼을 표시
		Common.changeVisibility("btn_FL_DeleteFile","block");
	}
	//disable 버튼에 이벤트 매핑
	/*_btn = document.getElementById("btn_FL_DeleteFile");
	_btn.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_FL_DeleteFile')");
	_btn = document.getElementById("btn_FL_Print");
	_btn.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_FL_pageFirst')");
	_btn = document.getElementById("btn_FL_DeleteFile");
	_btn.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_FL_pageUp')");
	_btn = document.getElementById("btn_FL_Print");
	_btn.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_FL_pageDown')");
	_btn = document.getElementById("btn_FL_DeleteFile");
	_btn.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', 'btn_FL_pageLast')");*/

	var _lst = ['btn_FL_Print','btn_FL_DeleteFile','btn_FL_pageFirst','btn_FL_pageUp','btn_FL_pageDown','btn_FL_pageLast'];
	var i, len=_lst.length, _btn;
	
	for(i=0;i<len;i++){
		_btn = document.getElementById(_lst[i]);
		//_btn.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', "+_tmp+")");
		_btn.addEventListener("mouseup",function(){
			Common.onLoadEvent('ondisablekeydown', this.id);
		},true);
		_btn=null;
	}
};

/**
 * 선택된 파일 개수 표시갱신
 */
FileListPage.updateDisplaySelectedFileCount = function(){
	var _str = this.getSelectedCount() + "/" + this.getAllCount();
	Common.setText("txt_FL_SelectedFile", _str);
};

/**
 * 현재 페이지 표시갱신
 */
FileListPage.updateDisplayCurrentPage=function(){
	if(this.getTotalPages()>0){
		var _str = (this.currentPageIdx) + " / " + this.getTotalPages(); 
		Common.setText("txt_FL_CurrentPage",_str);
	}
	else{
		Common.setText("txt_FL_CurrentPage","");
	}
};
/**
 * 인쇄매수 표시갱신
 */
FileListPage.updateDisplayPrintQuantity = function(num){					//TODO:delete???
	Common.setText("txt_FL_PrintQuantity",num);
};

/**
 * 표시 갱신 버튼, 표시문서 종류별 풀다운 동작 처리
 */
FileListPage.refreshStoredDocument = function()					//TODO:delete???
{
	return;
	//console.log("getDocInfo");
	//기존 데이터 삭제
	this.docListManager.clearDataSouce();
	var plpObj = new SSMILib.PrnListPolicy();
	plpObj.userId = glbInfo.userInfo.RelatedUserID;
	plpObj.deviceIp = glbInfo.ipAddress;
	plpObj.wsIp = glbConfig.wsIp;
	SSMILib.GetPrnListPolicy(plpObj, DOC_PRINT_TIMEOUT);
};

/**
 * 문서 리스트 화면의 총 페이지수 취득
 * @return 총 페이지수
 */
FileListPage.getFileListTotalPage = function(){					//TODO:delete???
	//console.log("getFileListTotalPage");
	return Math.ceil(glbDevInfo.docList.length/MAX_FILE_BTN_NUM);
};

/**
 * 정보 취득중 화면시에 선택 문서수의 표시 처리
 */
FileListPage.displayFileSelectedNumLoading=function()
{
	//console.log("displayFileSelectedNumLoading");
	//[선택수：0] → [선택수：]로 변경대응
	//var msg = Msg.Page.FILELIST.SELECTED_FILE_NUMBER_MSG + "";
	Common.setText("txt_FL_SelectedFile", "0");
};
