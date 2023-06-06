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
			{id:"btn_FL_SelectAll",		type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{targetImgId:"img_FL_SelectAll", offImg:Img["SELECT_ALL_BTN_OFF"], pressImg:Img["SELECT_ALL_BTN_PRESS"], onImg:Img["SELECT_ALL_BTN_ON"], disableImg:Img["SELECT_ALL_BTN_DIS"]}},
		    {id:"btn_FL_DeleteFile",	type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{targetImgId:"img_FL_DeleteFile", offImg:Img["DELETE_FILE_BTN_OFF"], pressImg:Img["DELETE_FILE_BTN_PRESS"], disableImg:Img["DELETE_FILE_BTN_DIS"]}},
		    {id:"btn_FL_pageFirst",		type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_FIRST_BTN_OFF"], pressImg:Img["FILE_LIST_FIRST_BTN_PRESS"], disableImg:Img["FILE_LIST_FIRST_BTN_DIS"]}},
		    {id:"btn_FL_pageUp",		type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_UP_BTN_OFF"], pressImg:Img["FILE_LIST_UP_BTN_PRESS"], disableImg:Img["FILE_LIST_UP_BTN_DIS"]}},
		    {id:"btn_FL_pageDown",		type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_DOWN_BTN_OFF"], pressImg:Img["FILE_LIST_DOWN_BTN_PRESS"], disableImg:Img["FILE_LIST_DOWN_BTN_DIS"]}},
		    {id:"btn_FL_pageLast",		type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{offImg:Img["FILE_LIST_LAST_BTN_OFF"], pressImg:Img["FILE_LIST_LAST_BTN_PRESS"], disableImg:Img["FILE_LIST_LAST_BTN_DIS"]}},
		    {id:"btn_FL_Print",			type:WidgetLib.ButtonType.NORMAL, status:{enable:false}, attr:{targetImgId:"img_FL_Print", offImg:Img["PRINT_BTN_OFF"], pressImg:Img["PRINT_BTN_PRESS"], disableImg:Img["PRINT_BTN_DIS"]}}
		],
		imageList:[],
		textList:[
			{id:"txt_FL_SelectInfo1",	text:" "},
			{id:"txt_FL_SelectInfo2",	text:" "},
			{id:"lbl_FL_SelectedFile",	text:Msg.FILELIST.SELECTED_FILE_NUMBER_MSG},
			{id:"lbl_FL_SelectAll",		text:Msg.FILELIST.SELECT_ALL_BTN_LABEL_0},
			{id:"lbl_FL_DeleteFile", 	text:Msg.FILELIST.DELETE_FILE_BTN_LABEL, className:"lbl disabled"},
			{id:"txt_FL_NotifyMsg0",	text:Msg.FILELIST.LOADING_MSG_0},
			{id:"txt_FL_NotifyMsg1",	text:Msg.FILELIST.LOADING_MSG_1},
			{id:"txt_FL_NotifyMsg2",	text:Msg.FILELIST.LOADING_MSG_2},
			{id:"txt_FL_NotifyMsg3",	text:Msg.FILELIST.LOADING_MSG_3},
			{id:"lbl_FL_Print", 		text:Msg.FILELIST.PRINT_SETTING_BTN_LABEL_0, className:"lbl disabled"}
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

	Common.setPosition("page_FileList","height", glbInfo.pageHeight.toString() + "px");
	if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		Common.setPosition("page_FileList","width", glbInfo.screenWidth.toString() + "px");
		Common.setPosition("lyr_FL_Display_Area", "width", "930px");// lyr_FL_Display_Area
		// class 불러오기
		var classList = document.getElementById("lyr_FL_Display_Area");
		if(classList != null){
			var objbtn = classList.getElementsByClassName("btn");
			objbtn[0].style.width = "926px";
			objbtn[1].style.width = "926px";
			objbtn[2].style.width = "926px";
			objbtn[3].style.width = "926px";
			objbtn[4].style.width = "926px";
		}
		Common.setPosition("btn_FL_Print","left","713px");
	}
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
			Common.changeVisibility("lblDocItemQat"+i,"on");
		}
	}
	//glbDataSet.docList=_lst;
	this.store();
	this.docListManager.currentPageIdx = 1;	//페이지 초기화
	//this.docListManager.setDataSource(glbInfo.docList||[]);
	this.docListManager.setDataSource(jobList);
	this.docListManager.refresh(true);
	document.getElementById("lyr_FL_Display_Area").className = "";

	if(jobList.length > 0){
		this.docListManager.setDataSource(jobList);
		if(this.docListManager.selectedItemIdx > -1){						//TODO:delete???
			var _doc = this.docListManager.dataSource[this.docListManager.selectedItemIdx];
		}
	}
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공용/화면전환시 호출된다.)
 */
FileListPage.updateDisplay = function(){
	KISUtil.debug("function:", "updateDisplay");
	this.cssChange();
	this.docListManager.refresh();
	var _selectedDoc = this.docListManager.getSelectedDocInfo();
	//chkDocPrintPossible();
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
			if(arguments[1]===true){
				var obj = arguments[2];
				if(obj.jobList){
					this.docListManager.setDataSource(obj.jobList);
					this.docListManager.refresh(true);
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
					this.docListManager.goFirstPage();
					break;
				case "btn_FL_pageUp":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					this.docListManager.goPrevPage();
					break;
				case "btn_FL_pageDown":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					this.docListManager.goNextPage();
					break;
				case "btn_FL_pageLast":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					this.docListManager.goLastPage();
					break;
				case "btn_FL_SelectAll":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
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
					var idx = parseInt(id.substring(id.length, id.length - 1));
					this.docListManager.selectItem(idx);
					var _selectedDoc = this.docListManager.getSelectedDocInfo();						//TODO:delete???
					if(_selectedDoc.success){
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
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.REQUIRE_DOC_SELECTION);
						break;
					case "btn_FL_pageFirst":
					case "btn_FL_pageUp":
						MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED,"",Msg.ERROR_MESSAGE.IS_FIRST_PAGE);
						break;
					case "btn_FL_pageDown":
					case "btn_FL_pageLast":
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

	var _lst = ['btn_FL_Print','btn_FL_DeleteFile','btn_FL_pageFirst','btn_FL_pageUp','btn_FL_pageDown','btn_FL_pageLast'];
	var i, len=_lst.length, _btn;

	for(i=0;i<len;i++){
		_btn = document.getElementById(_lst[i]);
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
	//Common.setText("txt_FL_SelectInfo", Msg.FILELIST.SELECT_INFO);
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

// Print JobMonitor
var PrintJobMonitor = (function(){
    var EVENT_NAME = "GetJob",
    	_jobFound,
    	_jobInfo,
    	_poolingCnt,
    	_poolingCntBackup = 0,
    	_poolingTerm = 400,
    	_isEventAttached,
    	_successCallback,
    	_errorCallback,
    	_timeoutCallback,
    	_cancelCallback,
    	_foundCallback,
    	_eventOrigin;

    return {
        init: function(term){
        	_init(term);
        },
        startMonitor : function(jobObj,cnt){
            _startMonitor(jobObj,cnt);
        },
        stopMonitor : function(jobObj){
            _stopMonitor(jobObj);
        },
        getJobInfo : function(uuid){
        	_doPooling({uuid:uuid});
        }
    };

    function _init(term){
        _jobFound = false;
    	_isEventAttached = false;
    	_poolingTerm = term || 400;
        _attachEventHandler();
    }

    function _attachEventHandler(){
    	if(!_isEventAttached){
	        _isEventAttached = true;
			_eventOrigin = SSMILib.listener;
			SSMILib.listener = function(event, result, obj){
				if(!_onSSMIEvent(event, result, obj)){
					_eventOrigin(event, result, obj);
				}
			};
    	}
    }

    function _dettachEventHandler(){
    	if(_isEventAttached){
	        _isEventAttached = false;
			SSMILib.listener = _eventOrigin;
    	}
    }

    function _onSSMIEvent(event, result, obj){
    	var objCnt = 1;
    	if(event == EVENT_NAME){
			if((obj)&&(result)){
				if(!glbJobLogInfo.uuid){
					glbJobLogInfo.uuid = obj.JobID;
				}
				_poolingCnt = _poolingCntBackup;
				_jobFound = true;
				if(typeof obj.length == "number"){
					objCnt = obj.length;
				}
				for(var i=0; i<objCnt; i++){
					var tmpObj = (objCnt == 1)? obj : obj[i];
					switch(tmpObj.Status){
						case "canceled":
						case "canceledByUser":
						case "canceledBySystem":
						case "paused":
						//case "unknown":
						//case "pending":	// 잠시 팬딩이 발생하는 경우가 있음.
						case "terminating":
							_stopMonitor(obj);
							LogLib.write("[CS] Print job : " + tmpObj.JobID + ", " + tmpObj.Status, LogLib.LEVEL.WRN);
							//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
							//Common.doPrintRefundReq(tmpObj.Status);
							//Common.displayPrintRefundPopup(tmpObj.Status);
							return;
						default:
							break;
					}
				}

				setTimeout("PrintJobMonitor.getJobInfo()", _poolingTerm);

			}else{//잡 미발견
				if(_jobFound){//이전에 잡이 있었고 다시 잡 모니터링시 잡이 없는 경우 - 잡이 다 실시된 걸로 판단하여 잡 모니터링 중지
					LogLib.write("Job Monitoring Completed", LogLib.LEVEL.WRN);
					_successCallback();
					_stopMonitor();
					return;
				}

				_poolingCnt--;
				setTimeout("PrintJobMonitor.getJobInfo()", _poolingTerm);
			}
		}else{
			return false;
		}
	}

    function _startMonitor(jobObj, _cnt){
    	_jobFound = false;
    	_poolingCnt = _cnt || 10;
    	_poolingCntBackup = _cnt || 10;
    	_successCallback = jobObj.successCallback;
		_errorCallback = jobObj.errorCallback;
		_cancelCallback = jobObj.cancelCallback;
        _doPooling();
    }

    function _stopMonitor(){
    	_jobFound = false;
        _successCallback = null;
		_errorCallback = null;
		_cancelCallback = null;
	}

    function _doPooling(){
    	if(_poolingCnt > 0){
			if(!_jobInfo){
				_jobInfo = new SSMILib.JobInfo(null, true);
				_jobInfo.listType = SSMILib.JOBLISTTYPE.ACTIVE;
				_jobInfo.sortKeys = [{element : SSMILib.JOBDETAIL.STARTTIME, order : SSMILib.SORTORDER.ASC}];
			}
	        SSMILib.GetJob(_jobInfo);
		}else{
			LogLib.write("doPooing _poolingCnt 0", LogLib.LEVEL.WRN);
    		if(_errorCallback)_errorCallback();
			_stopMonitor();
    	}
    }
})();
