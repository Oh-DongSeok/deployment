var TemplateManager = {
	DataSource:{
		"DocItem":'<img id="bgDocItem{{Idx}}" /><div id="lblDocItemName{{Idx}}" class="lbl fileName"></div><div id="lblDocItemDate{{Idx}}" class="lbl fileDate"></div><div id="lblDocItemPages{{Idx}}" class="lbl filePages"></div><div id="lblDocItemQat{{Idx}}" class="lbl fileQat"></div><img id="icnDocItemColor{{Idx}}" class="icon fileColor" /><div id="lblDocItemColor{{Idx}}" class="lbl fileColor"></div><img id="icnDocItemPlex{{Idx}}" class="icon filePlex" /><div id="lblDocItemPlex{{Idx}}" class="lbl filePlex"></div><img id="icnDocItemNup{{Idx}}" class="icon fileNup"/><div id="lblDocItemNup{{Idx}}" class="lbl fileNup"></div><img id="icnDocItemAlert{{Idx}}" class="icon alert" /><div id="lblDocItemDelete{{Idx}}" class="lbl fileDelete"></div>',
		//Nup,양단면 추가
		"DocItem0":'<img id="bgDocItem0" /><div id="lblDocItemName0" class="lbl fileName"></div><div id="lblDocItemDate0" class="lbl fileDate"></div><div id="lblDocItemPages0" class="lbl filePages"></div><div id="lblDocItemQat0" class="lbl fileQat"></div><img id="icnDocItemColor0" class="icon fileColor" /><div id="lblDocItemColor0" class="lbl fileColor"></div><div id="lblDocItemMS0" class="lbl fileMS"></div><div id="lblDocItemPrice0" class="lbl filePrice"></div><div id="lblDocItemNup0" class="lbl fileNup"></div><div id="lblDocItemPlex0" class="lbl filePlex"></div>',
		"DocItem1":'<img id="bgDocItem1" /><div id="lblDocItemName1" class="lbl fileName"></div><div id="lblDocItemDate1" class="lbl fileDate"></div><div id="lblDocItemPages1" class="lbl filePages"></div><div id="lblDocItemQat1" class="lbl fileQat"></div><img id="icnDocItemColor1" class="icon fileColor" /><div id="lblDocItemColor1" class="lbl fileColor"></div><div id="lblDocItemMS1" class="lbl fileMS"></div><div id="lblDocItemPrice1" class="lbl filePrice"></div><div id="lblDocItemNup1" class="lbl fileNup"></div><div id="lblDocItemPlex1" class="lbl filePlex"></div>',
		"DocItem2":'<img id="bgDocItem2" /><div id="lblDocItemName2" class="lbl fileName"></div><div id="lblDocItemDate2" class="lbl fileDate"></div><div id="lblDocItemPages2" class="lbl filePages"></div><div id="lblDocItemQat2" class="lbl fileQat"></div><img id="icnDocItemColor2" class="icon fileColor" /><div id="lblDocItemColor2" class="lbl fileColor"></div><div id="lblDocItemMS2" class="lbl fileMS"></div><div id="lblDocItemPrice2" class="lbl filePrice"></div><div id="lblDocItemNup2" class="lbl fileNup"></div><div id="lblDocItemPlex2" class="lbl filePlex"></div>',
		"DocItem3":'<img id="bgDocItem3" /><div id="lblDocItemName3" class="lbl fileName"></div><div id="lblDocItemDate3" class="lbl fileDate"></div><div id="lblDocItemPages3" class="lbl filePages"></div><div id="lblDocItemQat3" class="lbl fileQat"></div><img id="icnDocItemColor3" class="icon fileColor" /><div id="lblDocItemColor3" class="lbl fileColor"></div><div id="lblDocItemMS3" class="lbl fileMS"></div><div id="lblDocItemPrice3" class="lbl filePrice"></div><div id="lblDocItemNup3" class="lbl fileNup"></div><div id="lblDocItemPlex3" class="lbl filePlex"></div>',
		"DocItem4":'<img id="bgDocItem4" /><div id="lblDocItemName4" class="lbl fileName"></div><div id="lblDocItemDate4" class="lbl fileDate"></div><div id="lblDocItemPages4" class="lbl filePages"></div><div id="lblDocItemQat4" class="lbl fileQat"></div><img id="icnDocItemColor4" class="icon fileColor" /><div id="lblDocItemColor4" class="lbl fileColor"></div><div id="lblDocItemMS4" class="lbl fileMS"></div><div id="lblDocItemPrice4" class="lbl filePrice"></div><div id="lblDocItemNup4" class="lbl fileNup"></div><div id="lblDocItemPlex4" class="lbl filePlex"></div>'
	},
	getTemplate:function(data){
		var obj = Common.getNewElement("div", {id:data.key + data.attrs.Idx, className:"btn"});
		var _template = this.DataSource[data.tmpl + data.attrs.Idx];
		if(_template){
			//obj.innerHTML = this.convert(_template, data.attrs);
			//ewb의 정규식 대응문제에 따른 임시 대처
			obj.innerHTML = _template;
		}
		else{
			//write log
		}
		return obj;
	},
	convert:function(tmpl,attr){
		var _ptrn;
		for(i in attr){
			try{
				//_ptrn = new RegExp("\\\$\{" + i + "\}","gi");
				//tmpl = tmpl.replace(_ptrn, attr[i])
				eval("tmpl = tmpl.replace(/\{\{"+i+"\}\}/g, attr[i]);");
			}
			catch(e)
			{
				KISUtil.debug("convert","exception");
			}
		}
		return tmpl;
	}
};



/**
 * 문서 리스트용 모듈
 *
 * 초기화
 *  매수연산
 *  플래그 초기화
 *
 * 항목 선택시
 *  플래그 갱신 -> 전체 플래그 재연산
 *
 * 설정변경후 천이
 *  매수변경
 *  플래그 갱신 -> 전체 플래그 재연산
 */
var DocListManager = function(opt){
	this.config = {	key : "BASE",
					countPerPage : 5,
					targetId : "lyr_BASE_Display_Area",
					hasFirstBtn:false };
	this.init = function(){
		this.selectedItemIdx = -1;
		this.checkedList = [];
		this.totalSpendPageCount = 0;
	};

	/**
	 * 문서리스트용 데이터 설정
	 */
	this.setDataSource = function(_data){
		KISUtil.debug("setDataSouce","start");
		try{
			KISUtil.debug("setDataSouce/_data.length",_data.length);
			this.dataSource = _data;
			KISUtil.debug("setDataSouce/dataSource.length",_data.length);
			//팝업으로의 천이시에도 리스트의 페이징을 유지를 위해 선별적으로 페이지 초기화
			if (this.currentPageIdx == null || typeof this.currentPageIdx == "undefined")
			{
				this.currentPageIdx = 1;
			}
			this.maxPageIdx = Math.ceil(this.dataSource.length / this.config.countPerPage);
			KISUtil.debug("setDataSouce/maxPageIdx",this.maxPageIdx);
		}
		catch(e){
			KISUtil.debug("setDataSouce","exception");
		}
	};

	/**
	 * 문서리스트용 데이터 삭제
	 */
	this.clearDataSouce = function(){
		this.dataSource = [];
		this.currentPageIdx = 1;
		this.maxPageIdx = 1;
		this.selectedItemIdx = -1;
		this.checkedList = [];
		this.totalSpendPageCount = 0;
	};

	/**
	 * 설정변경데이터의 반영처리
	 */
	this.updateSelectedDataSource = function(_docData){
		this.dataSource[this.selectedItemIdx] = _docData;
	};

	this.getAllItems = function(){
		return this.dataSource;
	};

	this.getCheckedList = function(){
		return this.checkedList;
	};
	/**
	 * 선택항목 리스트를 취득
	 */
	this.getSelectedUUIDs = function(){
		KISUtil.debug("getSelectedUUIDs", "start");
		var result = [];
		for(var i = 0, iMax = this.checkedList.length; i < iMax; i++){
			result.push(this.dataSource[this.checkedList[i]].UUID);
		}
		return result;
	};
	/**
	 * 리스트의 페이징의 최종값을 반환
	 */
	this.getTotalPages = function(){
		return this.maxPageIdx;
	};
	/**
	 * 리스트의 항목수를 반환
	 */
	this.getAllCount = function(){
		return this.dataSource.length||0;
	};
	/**
	 * 선택된(체크) 항목수를 반환
	 */
	this.getSelectedCount = function(){
		return this.checkedList.length;
	};
	/**
	 * 페이지별 표시용 데이터취득
	 */
	this.getDataByPageIdx = function(){
		KISUtil.debug("getDataByPageIdx","start");
		var result = [];
		var offset = this.getStartIdx();
		var tmp;
//		for(var i=offset,iMax=offset+this.config.countPerPage;i<iMax;i++){
		try{
			for (var i = 0, iMax = this.config.countPerPage; i < iMax; i++) {
				tmp = this.dataSource[offset + i];
				if (tmp)
					result.push(this.convertDisplayData(i, tmp));
			}
		}catch(e){
			KISUtil.debug(e);
			throw e;
		}
		return result;
	};
	/**
	 * 선택항목수 갱신용 메소드
	 * override하여 사용
	 */
	this.updateSelectedFileCount = function(){};
	/**
	 * 리스트의 페이지표시 갱신용 메소드
	 * override하여 사용
	 */
	this.updateCurrentPage= function(){};
	/**
	 * (화면하단의)선택(활성화)항목의 인쇄매수 표시 갱신용 메소드
	 * override하여 사용
	 */
	this.updateTextPrnSet = function(){};

	/**
	 *  취득한 문서 데이터를 표시용 데이터 변환
	 */
	this.convertDisplayData = function(idx, _data){
		KISUtil.debug("convertDisplayData","start");
		var result = {text:{}, image:{}};
		result.text["lblDocItemName" + idx] = _data.docName;
		try{
			result.text["lblDocItemDate" + idx] = formatDate(_data.printDate);
			result.text["lblDocItemPages" + idx] = _data.pageCnt + Msg.FILELIST.FILE_LIST_BTN_PAGE_MSG;	//"쪽";
			result.text["lblDocItemQat" + idx] = _data.printCnt + Msg.FILELIST.FILE_LIST_BTN_QUANTITY_LABEL;	//"부";

			var _tmp = glbInfo["color"][_data.colorIdx];
			result.image["icnDocItemColor" + idx] = _tmp.iconOff;
			result.text["lblDocItemColor" + idx] = _tmp.text;

			//_tmp = glbInfo["MS"][_data.mediumSizeIdx];//XML용
			//result.text["lblDocItemMS" + idx] = _tmp.text;//XML용
			_tmp = _data.paperSize;//JSON용
			result.text["lblDocItemMS" + idx] = _tmp;//JSON용

			// 결제금액은 필요없음. 복합기에서는 오지 않는 정보
			result.text["lblDocItemPrice" + idx] = Msg.FILELIST.FILE_LIST_BTN_PRICE + " : " + formatWithRemainders(_data.price) + " " + Msg.FILELIST.FILE_LIST_BTN_WON; //"원";

			//Nup,Plex추가예정
			result.text["lblDocItemNup" + idx] = (glbConfig.nup)? _data.Nup + Msg.FILELIST.COMMON_PRINT_NUP_LABEL:"";
			_tmp = (glbConfig.outPlex)?glbInfo["outPlex"][_data.outPlex]:"";
			result.text["lblDocItemPlex" + idx] = (glbConfig.outPlex)? _tmp.text:"";
		}
		catch(e){
			KISUtil.debug(e);
			throw e;
		}
		return result;
	};

	/**
	 * 문서 리스트 초기구성(템플릿을 통한 HTML및 위젯 등록)
	 */
	this.initDisplay = function(){
		KISUtil.debug("initDisplay","start");
		var fileListButtonAttr = {
			offImg 		:	Img.FILE_LIST_BUTTON_OFF,
			pressImg	:	Img.FILE_LIST_BUTTON_PRESS,
			onImg		:	Img.FILE_LIST_BUTTON_ON
		}
		if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
			fileListButtonAttr.offImg 	= Img.FILE_LIST_BUTTON_OFF_L;
			fileListButtonAttr.pressImg = Img.FILE_LIST_BUTTON_PRESS_L;
			fileListButtonAttr.onImg 	= Img.FILE_LIST_BUTTON_ON_L;
		}
		var data = {
			tmpl : "DocItem",
			key : "btnDocItem",
			attrs:{
				Idx : 0
			}
		};

		if(WidgetLib.getWidgetNode(data.key + "0") == null){//등록되지 않은 경우에만 생성
			this.registListItems(fileListButtonAttr, data);
		}
	};
	/**
	 * 리스트의 항목 버튼 생성 및 위젯에 등록
	 */
	this.registListItems = function(fileListButtonAttr, data){
		KISUtil.debug("registListItems","start");
		//registWidget
		for(var i = 0, iMax = this.config.countPerPage; i < iMax; i++){
			try{
				data.attrs.Idx = i;
				fileListButtonAttr.targetImgId = "bgDocItem" + i;
				//Template를 이용한 HTML구성
				var btnElement = TemplateManager.getTemplate(data);
				document.getElementById(this.config.targetId).appendChild(btnElement);
				WidgetLib.registerButtonWidget(btnElement, WidgetLib.ButtonType.TOGGLE, fileListButtonAttr);			// data[i].Id
			}
			catch(e){
				KISUtil.debug("registListItems","error");
			}
		}
	};

	/**
	 * 리스트의 현재 페이지의 시작 인덱스를 반환
	 */
	this.getStartIdx = function(){
		KISUtil.debug("getStartIdx","start");
		return (this.currentPageIdx-1) * this.config.countPerPage;
	};

	/**
	 * 선택(Check)문서상세정보리스트(인쇄용)취득
	 */
	this.getCheckedDocInfo = function(){
		KISUtil.debug("getCheckedDocInfo","start");
		var result = [];
		var tmp;
		var _min = this.getStartIdx();
		var _max =_min + this.config.countPerPage-1;
		for(var i = 0, iMax = this.checkedList.length; i < iMax; i++){
			tmp = this.checkedList[i];
			if(tmp >= _min && tmp <= _max){
				result.push(this.dataSource[tmp]);
			}
		}
		return result;
	};

	/**
	 * 체크항목 리스트를 취득
	 */
	this.getCheckedItems=function(){
		KISUtil.debug("getCheckedItems", "start");
		var result = [];
		for(var i = 0, iMax = this.checkedList.length; i < iMax; i++){
			result.push(this.dataSource[this.checkedList[i]]);
		}
		return result;
	};
	this.setCheckedItems = function(_lst){
		this.checkedList = _lst;
	};

	/**
	 * 선택(SELECT)문서정보(설정변경용)취득
	 */
	this.getSelectedDocInfo = function(){
		KISUtil.debug("getSelectedDocInfo","start");
		var result = {success:false, doc:{}};
		if(this.selectedItemIdx > -1){
			result.doc = this.dataSource[this.selectedItemIdx];
			result.success = true;
		}
		return result;
	};

	/**
	 * 문서리스트 연관버튼(리스트 외) 상태갱신
	 * TODO:밖으로 빼야할듯
	 */
	this.updateBtnStatus = function(){
		//선택개수 표시갱신
		this.updateSelectedFileCount();
		this.updateCurrentPage();
		//전체 개수!=선택수 true
		Common.setObjectEnable("btn_FL_SelectAll", this.dataSource.length > 0);
		document.getElementById("btn_FL_SelectAll").className= (this.dataSource.length > 0)?"btn":"btn disabled";

		WidgetLib.setWidgetStatus("btn_FL_SelectAll", {on : (this.checkedList.length == this.dataSource.length)});

		//선택수>0
		Common.setObjectEnable("btn_FL_DeleteFile", this.checkedList.length > 0);
		//버튼 라벨상태변경
		var lbl = document.getElementById("lbl_FL_DeleteFile");
		lbl.className = (this.checkedList.length > 0)?"lbl":"lbl disabled";
		FileListPage.cssChange();

		//선택문서가 존재하고 모두가 인쇄가능한경우
		Common.setObjectEnable("btn_FL_Print", (this.checkedList.length > 0));
		//버튼 라벨상태변경
		var lbl = document.getElementById("lbl_FL_Print");
		lbl.className = (this.checkedList.length > 0)?"lbl":"lbl disabled";

		//pageIdx>0
		Common.setObjectEnable("btn_FL_pageUp", this.currentPageIdx > 1);

		//pageIdx<maxPageIdx
		Common.setObjectEnable("btn_FL_pageDown", this.currentPageIdx < this.maxPageIdx);

		if(this.config.hasFirstBtn){
			//pageIdx>0
			Common.setObjectEnable("btn_FL_pageFirst", this.currentPageIdx > 1);

			//pageIdx<maxPageIdx
			Common.setObjectEnable("btn_FL_pageLast", this.currentPageIdx < this.maxPageIdx);
		}

		//true
		Common.setObjectEnable("btn_FL_Refresh", true);
		chkDocPrintPossible();
	};
	/**
	 *
	 *
	 *
	 *
	 * [[프린트버튼]]/하드키도
	 * [액션 공통 동작]
	 * 인쇄매수 변경되었을 시 / 반영
	 * 소요매수 재연산
	 *
	 * [데이터수정] - 없음
	 *
	 * [동작]
	 * !Flag를 갱신하여 인쇄 가능여부를 확인
	 * 인쇄 RUN
	 *
	 *
	 * [[전체프린트버튼]]
	 * [액션 공통 동작]
	 * 인쇄매수 변경되었을 시 / 반영
	 * 소요매수 재연산
	 *
	 * [데이터수정] - 없음
	 * 이동할 페이지 인덱스 비교(최대 최소) OK?
	 * 페이지 인덱스 수정
	 *
	 * [동작]
	 * 인쇄 RUN(조건확인? 무조건?)
	 *
	 *
	 * [[액션 공통 동작]의 적용범위]
	 * 항목버튼*
	 * 페이징 버튼*
	 * 전체선택 버튼*
	 * 프린트버튼
	 * 전체프린트버튼(확인필요)
	 * 페이지 천이간
	 * 하드키(시작)?
	 *
	 * [대상외]
	 * 새로고침 / 어차피 다시 가져오므로
	 * 삭제 / 어차피 삭제되므로
	 */

	/**
	 * [액션 공통 동작]
	 * 인쇄매수 변경되었을 시 / 반영
	 * 소요매수 재연산
	 */

	/**
	 * [[항목 선택/해제]]
	 * [액션 공통 동작]
	 * 인쇄매수 변경되었을 시 / 반영
	 * 소요매수 재연산
	 *
	 * [데이터 수정]
	 * 선택상태가
	 * 미선택이면
	 * 체크 + 선택 + InvalidFlag를 하나로 통합?
	 * 인덱스 + 키
	 *
	 * -체크리스트에 추가
	 * -선택인덱스에 입력
	 * -소요매수 갱신(추가)
	 *
	 * 선택이면
	 * -체크리스트에서 삭제
	 *  선택인덱스에 있는경우
	 *  -선택인덱스에서도 삭제
	 * -소요매수 갱신(삭제)
	 *
	 * [표시갱신]
	 * 현재 페이지의  리스트정보 취득
	 * 현재 페이지의 선택정보 취득
	 *
	 * 순차로 이동하며
	 * 매수와 !Flag를 갱신(항상)
	 * ON이미지 및 상태 갱신
	 * 기타 버튼의 상태갱신
	 */
	this.selectItem = function(idx){
		KISUtil.debug("selectItem", "start");
		try{
			var offset = this.getStartIdx();
			var currentIdx = offset + idx;
			var _idx = Common.indexOf(this.checkedList,currentIdx);
			var _key = "bgDocItem";

			var _selectedData = this.dataSource[currentIdx];
			//선택
			if(_idx == -1){
				//insert
				this.selectedItemIdx = currentIdx;  //selectedItem
				this.checkedList.push(currentIdx);  //checkedList
			}
			//해제
			else{
				//remove
				this.selectedItemIdx = -1;
				this.checkedList.splice(_idx, 1);
			}
			this.refresh();
		}
		catch(e){
			//console.log(e);
		}
	};
	this.updateDisplayListItems = function(flgUpdateForce){
		try{
			// [표시갱신]
			// 현재 페이지의  리스트정보 취득
			var pageDataList = this.getDataByPageIdx(this.currentPageIdx);	//get Data For Display
			// 현재 페이지의 선택정보 취득
			//console.log(this.checkedList);
			var _btnIdKey = "btnDocItem";
			var _btnId, _item, _attr, _prevStatus, _status, _btnObj;
			var _idx = this.getStartIdx();
			//(this.currentPageIdx * this.config.countPerPage) + this.selectedItemIdx
			// 순차로 이동하며
			for(var i = 0,iMax = this.config.countPerPage; i < iMax; i++, _idx++){
				_btnId = _btnIdKey + i;
				tmp = pageDataList[i];
				if(tmp){
					_btnObj = document.getElementById(_btnId);
					//_btnObj.style.visibility = "hidden";
					//기본정보 갱신(선택적으로?)
					if(flgUpdateForce) this.updateDisplayListItem(tmp);
					// 매수와 !Flag를 갱신(항상)
					_status = (Common.indexOf(this.checkedList,_idx)>-1);

					_attr = WidgetLib.getWidgetAttr(_btnId);
					/*if(_idx==this.selectedItemIdx){
						if(_attr.onImg != Img.FILE_LIST_BUTTON_SELECTED){
							WidgetLib.setWidgetAttr(_btnId, {onImg:Img.FILE_LIST_BUTTON_SELECTED});
						}
					}
					else{
						if(_attr.onImg != Img.FILE_LIST_BUTTON_ON){
							WidgetLib.setWidgetAttr(_btnId, {onImg:Img.FILE_LIST_BUTTON_ON});
						}
					}
					_prevStatus = WidgetLib.getWidgetStatus(_btnId);
					if(_prevStatus.on != _status){
						WidgetLib.setWidgetStatus(_btnId, {on:_status});
					}
					_btnObj.style.visibility = "visible";*/
					WidgetLib.setWidgetStatus(_btnId, {on:_status});
					Common.changeVisibility(_btnId, "block");
				}
				else{
					//clear and hide
					Common.changeVisibility(_btnId, "none");
				}

			}
		}
		catch(e){
			KISUtil.debug(e);
		}
	};

	this.updateDisplayListItem = function(_data){
		for(var img in _data.image){
			Common.setImage(img, _data.image[img]);
		}
		for(var t in _data.text){
			Common.setText(t, _data.text[t]);
		}
	};
	/**
	 * [[전체선택/해제]]
	 * [액션 공통 동작]
	 * 인쇄매수 변경되었을 시 / 반영
	 * 소요매수 재연산
	 *
	 * [데이터수정]
	 * 체크리스트의 개수가 데이터의 개수와 같은경우
	 * 해제
	 * 체크리스트를 비움
	 * 선택인덱스를 비움
	 *
	 * 다른경우
	 * 선택
	 * 체크리스트를 비움
	 * 선택인덱스를 비움
	 *
	 * 체크리스트를 순차적으로 채움
	 *
	 * [표시갱신]
	 * 현재 페이지의  리스트정보 취득
	 * 현재 페이지의 선택정보 취득
	 *
	 * 순차로 이동하며
	 * 매수와 !Flag를 갱신(항상)
	 * ON이미지 및 상태 갱신
	 * 기타 버튼의 상태갱신
	 */
	this.selectAllItems = function(){
		KISUtil.debug("selectAllItems","start");
		try {
			var _flag = (this.dataSource.length == this.checkedList.length);
			var offset = this.getStartIdx();

			this.selectedItemIdx = -1;
			this.checkedList = [];

			//전체선택
			if (!_flag){
				//순서가 중요하지않으므로 기존 데이터를 삭제후 추가
				//체크리스트를 순차적으로 채움
				for (var i = 0, iMax = this.dataSource.length; i < iMax; i++) {
					this.checkedList.push(i);
				}
			}
			//표시갱신
			this.refresh();
		}
		catch(e) {
			//console.log(e);
			KISUtil.debug("selectAllItems","exception");
		}
	};


	/**
	 * [[삭제]]
	 * [액션공통동작-생략]
	 *
	 * [표시갱신]
	 * 현재 페이지의  리스트정보 취득
	 * 현재 페이지의 선택정보 취득
	 *
	 * 순차로 이동하며
	 * 매수와 !Flag를 갱신(항상)
	 * ON이미지 및 상태 갱신
	 * 기타 버튼의 상태갱신
	 *
	 * 선택 항목을 삭제
	 * (매니저가 관리중인)선택된 항목의 개수를 확인후
	 * 개수가 1개 이상인경우 팝업을
	 * 아닌경우 invalid를 출력
	 */
	this.deleteItems = function(){
		KISUtil.debug("deleteItems","start");
		var result = false;
		if(this.checkedList.length > 0){
			//[데이터수정]
			this._eraseList(this.checkedList);
			//체크리스트를 비움
			this.checkedList = [];
			//선택인덱스를 비움
			this.selectedItemIdx = -1;
			//최종페이지 재연산
			this.maxPageIdx = Math.ceil(this.dataSource.length / this.config.countPerPage);
			//현재페이지 보정
			if (this.currentPageIdx > this.maxPageIdx) {
				this.currentPageIdx = this.maxPageIdx;
			}
			result = true;
		}
		return result;
	};

	/**
	 * 선택항목 삭제
	 */
	this._eraseList = function(lst){
		KISUtil.debug("_eraseList", "start");
		//체크리스트의 항목을 값기준 역순으로 정렬
		var _lst = lst.sort(function(a,b){return b - a;});
		for(var i = 0, iMax = _lst.length; i < iMax; i++){
			//데이터소스에서 체크된항목을 제거
			this.dataSource.splice(_lst[i], 1);
		}
	};


	/**
	 * [[페이징]]
	 * [액션 공통 동작]
	 * 인쇄매수 변경되었을 시 / 반영
	 * 소요매수 재연산
	 *
	 * [데이터수정] - 없음
	 * 이동할 페이지 인덱스 비교(최대 최소) OK?
	 * 페이지 인덱스 수정
	 *
	 * [표시갱신]
	 * 현재 페이지의  리스트정보 취득
	 * 현재 페이지의 선택정보 취득
	 *
	 * 순차로 이동하며 리스트 정보를 수정(페이지 전환시에만)
	 * 매수와 !Flag를 갱신(항상)
	 * ON이미지 및 상태 갱신
	 * 기타 버튼의 상태갱신
	 */

	/**
	 * 첫 페이지로 이동
	 */
	this.goFirstPage = function(){
		if(this.currentPageIdx > 1){
			this.currentPageIdx = 1;
			this.refresh(true);
		}
		else{
			KISUtil.debug("DocListManager/goFirstPage/currentPageIdx",this.currentPageIdx);
		}
	};
	/**
	 * 이전 페이지로 이동
	 */
	this.goPrevPage = function(){
		if(this.currentPageIdx > 1){
			this.currentPageIdx--;
			this.refresh(true);
		}
		else{
			KISUtil.debug("DocListManager/goPrevPage/currentPageIdx",this.currentPageIdx);
		}
	};
	/**
	 * 다음 페이지로 이동
	 */
	this.goNextPage = function(){
		if(this.currentPageIdx < this.maxPageIdx){
			this.currentPageIdx++;
			this.refresh(true);
		}
		else{
			KISUtil.debug("DocListManager/goNextPage/currentPageIdx",this.currentPageIdx);
		}
	};
	/**
	 * 마지막 페이지로 이동
	 */
	this.goLastPage = function(){
		if(this.currentPageIdx < this.maxPageIdx){
			this.currentPageIdx = this.maxPageIdx;
			this.refresh(true);
		}
		else{
			KISUtil.debug("DocListManager/goLastPage/currentPageIdx",this.currentPageIdx);
		}
	};

	/**
	 *
	 */
	this.refresh = function(flgUpdateForce){
		//표시갱신
		this.updateDisplayListItems(flgUpdateForce);		//TODO:시간나면 분리하기 init과 update
		this.updateBtnStatus();
	};

	Extend(this.config, opt);
	this.init();
};

function getPaperSpend(_item){
	var _nup = parseInt(glbInfo.nup[_item.nupIdx].value);
	return Math.ceil(_item.pageCnt / _nup) * _item.printCnt;
};

Date.prototype.toString = function(){
	switch(arguments.length){
		case 1:
			var format = arguments[0];
			switch(typeof format){
				case "string":
					var result = format;
					var _arg0 = this.getFullYear().toString();
					var _arg1 = (this.getMonth() + 1).toString();	//0-11
					var _arg2 = this.getDate().toString();
					var _arg3 = this.getHours().toString();
					var _arg4 = this.getMinutes().toString();
					var _arg5 = this.getSeconds().toString();

					if (_arg1.length == 1) _arg1 = "0" + _arg1;
					if (_arg2.length == 1) _arg2 = "0" + _arg2;
					if (_arg3.length == 1) _arg3 = "0" + _arg3;
					if (_arg4.length == 1) _arg4 = "0" + _arg4;
					if (_arg5.length == 1) _arg5 = "0" + _arg5;

					result = result.replace(/yyyy/gi, _arg0)
						.replace(/MM/gi, _arg1)
						.replace(/dd/gi, _arg2)
						.replace(/HH/gi, _arg3)
						.replace(/mm/gi, _arg4)
						.replace(/ss/gi, _arg5)
					return result;
				case "object":
					break;
				default:
					break;
			}
			break;
		default:
			this.__proto__.toString(arguments);
			break;

	}
};

/**
 * 子ノードを削除する。
 * @param id 親ノードのID
 */
function removeChildObj(id)
{
	var obj = document.getElementById(id);
	if(obj)obj.innerHTML = "";
}

function createXMLHttpRequest()
{
  var obj;

  if( window.XMLHttpRequest) {
    obj = new XMLHttpRequest();
  } else if(window.ActiveXObject) {
    try {
      obj = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e) {
      obj = new ActiveXObject("Microsoft.XMLHTTP");
    }
  } else {
    return null;
  }
  return obj;
}

/**************************************************************
 * @contents Get Status Index from file
 * @public
 * @return
 * @Lang EN
 **************************************************************/
function load_content_to_file(filePath, callback){
	//console.log("load_content_to_file");
    var httpRequest = createXMLHttpRequest();

	//_requester.onreadystatechange = onReadyStateChangeEventHandler["get"];
	httpRequest.onreadystatechange = function() {
        // inline function to check the status
        // of our request
        // this is called on every state change
        //console.log("onreadystatechange/httpRequest.readyState:"+this.readyState+"/httpRequest.status:"+this.status);
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	            // call the callback function
	        }
	        else{
	            callback.call(this);
	        }
        }
    };

    httpRequest.open("GET", filePath, true);
    httpRequest.send();
}

var PrintCountManager = function(){
	this.config = {min : 1, max : 1000, enableFlag:true};
	this.currentNum = 1;
	this.updateDisplay = function(num){
		//console.log("PrintCountManager/updateDisplay/num:"+num);
	};
	this.setNum = function(num){
		this.insertFlg = false;
		this.currentNum = num;
		this.updateDisplay(this.currentNum);
	};
	this.setEnableFlag = function(flg){
		this.config.enableFlag = flg;
	}
	this.getEnableFlag = function(){
		return this.config.enableFlag;
	}
	this.insertNum = function(num){
		var result = false;
		//check flag
		if(this.config.enableFlag){
			if(this.insertFlg){
				//*10+num
				this.currentNum = this.currentNum * 10 + num
				result = true;
			}
			else{
				if(num != 0){
					this.insertFlg = true;
					this.currentNum = num
					result = true;
				}
			}
			if(this.currentNum > this.config.max){
				this.currentNum = this.config.max;
				result = false;
			}
            if(!WidgetLib.getWidgetStatus("btn_FL_PrintRemove").enable && result){
                WidgetLib.setWidgetStatus("btn_FL_PrintRemove", {enable:true});
            }
            if(this.currentNum >= this.config.max){
                WidgetLib.setWidgetStatus("btn_FL_PrintAdd", {enable:false})
            }
			this.updateDisplay(this.currentNum);
		}
		return result;
	};
	this.removeNum = function(){
		var result = false;
		try{
			//check flag
			if(this.currentNum>9){
				result = true;
				this.currentNum = (this.currentNum - (this.currentNum % 10)) / 10;
                WidgetLib.setWidgetStatus("btn_FL_PrintAdd", {enable:true})
			}
			else{
				this.insertFlg = false;
				if(this.currentNum > this.config.min){
					result = true;
					this.currentNum = this.config.min;
				}
			}
            if(this.currentNum == this.config.min){
                WidgetLib.setWidgetStatus("btn_FL_PrintRemove", {enable:false})
            }
			this.updateDisplay(this.currentNum);
		}
		catch(e){
			KISUtil.debug(e);
		}
		return result;
	};
	this.clearNum = function(){
		//reset flag
		this.insertFlg = false;
		this.currentNum = this.config.min;
		this.updateDisplay(this.currentNum);
	};
	this.setStatus = function(flag){
		this.config.enableFlag = flag;
	};
};
/**
 *  deepCopy method
 */
var extendDeep = function(parent, child){
	var toStr = Object.prototype.toString,
		astr = "[object Array]";

	child = child || {};

	for(var j in parent){
		if(parent.hasOwnProperty(j)){
			if(parent[j] == null & child[j] == undefined){
				child[j] = null;
			}
			else if(typeof parent[j] === "object"){
				child[j] = (toStr.call(parent[j]) === astr) ? [] : {};
				extendDeep(parent[j],child[j]);
			}
			else{
				child[j] = parent[j];
			}
		}
		else{
			//pass
		}
	}
	return child;
};
/**
 * 정책 판단룰을 이용한 판단 모듈
 *
 * 프린트옵션정책 - 0:적용, 1:강제흑백, 2:기본흑백
 * 문서컬러 - 0:흑백,1:컬러
 * 복합기기능 - 0:기능제한없음,1:흑백만사용가능,2:기능제한(컬러/흑백가능),3:기능제한(컬러가능/흑백불가),4:기능제한(컬러불가/흑백가능),5:기능제한(컬러/흑백불가),6:사용량제한
 */
function Validator(){
	this.rule = null;

	this.forceBW = {none:0, forceBW:1, DefaultBW:2};
	this.forceNup = {one:0, others:1};
	this.forceDuplex = {simplex:0, duplex:1};
	//this.color = {bw:0, color:1};
	this.color = {bw:1, color:0};
	this.forbides = {none:0, bwOnly:1, bothUseable:2, colorUsable:3, bwUsable:4, noneUsable:5, usageLimit:6};

	this.getBtnStatusByPolicy = function(_forbid, _forcedNup, _forcedDuplex, _forceBW, _doc){
		var _policy = {success: false};
        if(glbDataSet.userPolicyInfo.forcedBlack && glbDataSet.userPolicyInfo.defaultBlack){
            _forceBW = 2;
        }
		if(_doc.prnType){	//PS문서 체크 스킵
			_policy = {success : true, status : {invalidFlag : 0, printStatus : true}};
		}
		else{
			if(this.rule != null&&_policy != null&&_doc.colorIdx != null&&_forbid != null){
				try{
					//result.status = this.rule[_policy][_docColor][_forbid];
					//_policy.status = this.rule[_forbid][_forcedNup][_forcedDuplex][_forceBW][_doc.colorIdx];
					_policy.status = extendDeep(this.rule[_forbid][_forcedNup][_forcedDuplex][_forceBW][_doc.colorIdx],{});		//deepCopy
					_policy.success = true;
				}
				catch(e){
					KISUtil.debug("Validator/getBtnStatusByPolicy", _policy + "," + _doc.colorIdx + "," + _forbid);
				}
			}

			//사용량제한중 사용량을 넘어서는 케이스와 그렇지 않은 케이스간의 메시지 리매핑처리
			//추후 두개의 플래그를 조합하는 형태로 리팩토링 되어야함
			if(glbDataSet.userPolicyInfo.functionCtrl == 6){
				if(_doc.overFlow){
					switch(_policy.status.msg){
						case "FORCE_BW":
                        case "FORCE_DEFAULTBW":
						case "FORCE_DUPLEX":
						case "FORCE_BW_DUPLEX":
                        case "FORCE_DEFAULTBW_DUPLEX":
						case "FORCE_NUP":
						case "FORCE_BW_NUP":
                        case "FORCE_DEFAULTBW_NUP":
						case "FORCE_NUP_DUPLEX":
						case "FORCE_BW_NUP_DUPLEX":
                        case "FORCE_DEFAULTBW_NUP_DUPLEX":
							_policy.status.msg = _policy.status.msg + "_USAGE_LIMIT_OVER";
							break;
						case "": 	//선행 메시지가 비었을경우 접합용 _를 제거
							_policy.status.msg = "USAGE_LIMIT_OVER";
							break;
						default:
							//KISUtil.debug("getBtnStatusByPolicy/overflow",JSON.stringify(_policy));
							break;
					}
					_policy.status.invalidFlag = 2;
					_policy.status.printStatus = false;
				}
				else
				{
					switch(_policy.status.msg){
						case "USAGE_LIMIT_OVER":
						case "FORCE_BW_USAGE_LIMIT_OVER":
                        case "FORCE_DEFAULTBW_USAGE_LIMIT_OVER":
						case "FORCE_DUPLEX_USAGE_LIMIT_OVER":
						case "FORCE_BW_DUPLEX_USAGE_LIMIT_OVER":
                        case "FORCE_DEFAULTBW_DUPLEX_USAGE_LIMIT_OVER":
						case "FORCE_NUP_USAGE_LIMIT_OVER":
						case "FORCE_BW_NUP_USAGE_LIMIT_OVER":
                        case "FORCE_DEFAULTBW_NUP_USAGE_LIMIT_OVER":
						case "FORCE_NUP_DUPLEX_USAGE_LIMIT_OVER":
						case "FORCE_BW_NUP_DUPLEX_USAGE_LIMIT_OVER":
                        case "FORCE_DEFAULTBW_NUP_DUPLEX_USAGE_LIMIT_OVER":
							_policy.status.msg = _policy.status.msg.replace("_USAGE_LIMIT_OVER","");
							break;
						default:
							//KISUtil.debug("getBtnStatusByPolicy/notOverflow",JSON.stringify(_policy));
							break;
					}
					_policy.status.invalidFlag = 0;
					_policy.status.printStatus = true;
				}
			}
		}

		return _policy;
	};
	this.init = function(){
		var printRule = getPrintRule();
		if(printRule instanceof Array) this.rule = extendDeep(printRule, this.rule);
	};
}

/**
 * 정책 판단룰을 이용한 판단 모듈 <- 다수 문서 선택시
 *
 * 프린트옵션정책 - 0:적용, 1:강제흑백, 2:기본흑백
 * 문서컬러 - 0:흑백,1:컬러
 * 복합기기능 - 0:기능제한없음,1:흑백만사용가능,2:기능제한(컬러/흑백가능),3:기능제한(컬러가능/흑백불가),4:기능제한(컬러불가/흑백가능),5:기능제한(컬러/흑백불가),6:사용량제한
 */
function ValidatorMulti() {
    this.rule = null;

    this.init = function() {
        var printRule = getPrintRule();
        if (printRule instanceof Array) this.rule = extendDeep(printRule, this.rule);
    };

    this.getBtnStatusByPolicy = function(_functionCtrl, _forcedNup, _forcedDuplex, _forceBW, _docs) {
        var _policy = { success: false, status: { msg: "", printStatus: true, invalidFlag: 0 } };
        if(glbDataSet.userPolicyInfo.forcedBlack && glbDataSet.userPolicyInfo.defaultBlack){
            _forceBW = 2;
        }
        if (this.rule != null && _policy != null && _functionCtrl != null) {
            _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][1]; //디폴트 설정
            _policy.success = true;

            //기능제한 체크
            if (_functionCtrl == 1 || _functionCtrl == 4) { //1:흑백만사용가능, 4:기능제한(컬러불가/흑백가능)
                for (var i = 0; i < _docs.length; i++) {
                    var tmpIdx = PrintSettingMultiPopup._dataSet.selectedDocInfo['multicolorIdx'];
                    if (_docs[i].boxId) {
                        if (_docs[i].colorIdx == 0) { //여러건 문서중, private print 문서+ 컬러의 경우에는 print 불가 즉시 처리
                            _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][0];
                            _policy.success = true;
                            break;
                        }
                    }

                    if (_forceBW == 1 || _forceBW == 2 ) { //기능제한(흑백만 가능) + 기본흑백/강제흑백 적용시
                        _policy.status.printStatus = (tmpIdx == 0 || tmpIdx == 2) ? true : false;
                        _policy.success = true;
                        break;
                    } else {
                        //컬러 풀다운[기본값, 컬러]이고 문서중에 컬러가 있거나 or 컬러 풀다운[컬러]이고 흑백이지만 원본이 컬러인 경우)
                        if ((tmpIdx == 0 || tmpIdx == 1) && _docs[i].colorIdx == 0 || (tmpIdx == 1 && _docs[i].colorIdx == 1 && _docs[i].originColorIdx == 0)) { //컬러 문서
                            _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][0];
                            _policy.success = true;
                            break;
                        }
                    }
                }
            } else if (_functionCtrl == 3) { //3:기능제한(컬러가능/흑백불가)
                _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][0];
                for (var i = 0; i < _docs.length; i++) {
                    var tmpIdx = PrintSettingMultiPopup._dataSet.selectedDocInfo['multicolorIdx'];
                    if (_docs[i].boxId) {
                        if (_docs[i].colorIdx == 1) { //여러건 문서중, private print 문서+ 흑백의 경우에는 print 불가
                            _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][1];
                            _policy.success = true;
                            break;
                        }
                    }
                    //흑백(원본) 문서가 존재하거나 || 컬러문서인데 흑백으로 변경하거나 || 기본값이고 흑백일 때
                    if (_docs[i].originColorIdx == 1 || (tmpIdx == 2 && _docs[i].originColorIdx == 0) || (tmpIdx == 0 && _docs[i].colorIdx == 1)) {
                        _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][1];
                        _policy.success = true;
                        break;
                    }
                }
            } else if (_functionCtrl == 5) { // 5:기능제한(컬러/흑백불가)
                _policy.status = this.rule[_functionCtrl][_forcedNup][_forcedDuplex][_forceBW][0];
                _policy.success = true;
            }

            if (_functionCtrl == 6) { //사용량 제한
                switch (_policy.status.msg) {
                    case "USAGE_LIMIT_OVER":
                    case "FORCE_BW_USAGE_LIMIT_OVER":
                    case "FORCE_DEFAULTBW_USAGE_LIMIT_OVER":
                    case "FORCE_DUPLEX_USAGE_LIMIT_OVER":
                    case "FORCE_BW_DUPLEX_USAGE_LIMIT_OVER":
                    case "FORCE_DEFAULTBW_DUPLEX_USAGE_LIMIT_OVER":
                        _policy.status.msg = _policy.status.msg.replace("_USAGE_LIMIT_OVER", "");
                        break;
                    default:
                        break;
                }

                _policy.success = true;
                _policy.status.invalidFlag = 0;
                _policy.status.printStatus = true;

                for (var i = 0; i < _docs.length; i++) {
                    if (_docs[i].overFlow) { //문서 다수 선택시 1건이라도 overFlow 발생시에는 print 불가
                        switch (_policy.status.msg) {
                            case "FORCE_BW":
                            case "FORCE_DEFAULTBW":
                            case "FORCE_DUPLEX":
                            case "FORCE_BW_DUPLEX":
                            case "FORCE_DEFAULTBW_DUPLEX":
                            case "":
                                _policy.status.msg = _policy.status.msg + (_policy.status.msg == "" ? "" : "_") + "USAGE_LIMIT_OVER";
                                break;
                            default:
                                break;
                        }
                        _policy.success = true;
                        _policy.status.invalidFlag = 2;
                        _policy.status.printStatus = false;
                        break;
                    }
                }
            }
        }

        return _policy;
    };
};


/**
 * 文書の更新日時をYYYY/MM/DD　HH:MM:SSの形式で変える
 * @param {string} str 文書の更新日時
 * @return {string} dateStr 文書の更新日時（YYYY/MM/DD　HH:MM:SSの形式）
 */
function getDateString(str)
{
	//console.log("getDateString");
	if(!str){
		return;
	}

	var dateStr = str.replace(/-/g, '/');

	var dateEndPoint = dateStr.indexOf('T');
	var ymdStr = dateStr.substring(0, dateEndPoint);

	var timeEndPoint = dateStr.indexOf('+');
	var timeStr = dateStr.substring(dateEndPoint+1, timeEndPoint);

	return ymdStr + " " + timeStr;
}



/**
 * 화면표시용 Data로 가공
 */
function convertToVMData(_lst){
	var _result = {}, _used = [], _notUsed = [], _tmp, _remain;

	//리스트 표시 제한 적용
	var iMax = (_lst.length > glbConfig.DATA.JOB_LIST_COUNT)? glbConfig.DATA.JOB_LIST_COUNT : _lst.length;
	for(var i = 0; i < iMax; i++){
		try{
			_tmp = {};
			_obj = _lst[i];
			_tmp.UUID = _obj.uuId;
			_tmp.docName = _obj.docName;
            _tmp.driverType = _obj.driverType;
			_tmp.prnType = (_obj.prnType == "Y");
			//_tmp.prnType = true;
			//초기화 사용가능매수보다  소요매수가 큰경우 true
			_tmp.printInvalidType = PRINTABLE_VALID_TYPE.none;

			//SmartUI 2017.02 복수의 Print Server 대응 refs #4184
            _tmp.serverIdx = (typeof arguments[1] != 'undefined') ? parseInt(arguments[1]) : -1;

			if (!_tmp.prnType) {
                _tmp.printDate = _obj.printDate;
                _tmp.pageCnt = parseInt(_obj.pageCnt);
                _tmp.printCnt = parseInt(_obj.printCnt);
                _tmp.useYn = (_obj.useYn == "Y");

                //_tmp.originColorIdx = _tmp.colorIdx = glbInfo.getIndexByKey("color", _obj.color, 1);	//1은 default값(흑백)
                if (_obj.destColor) { // 구 버전의 WebService와 신버전을 동시 대응하도록 하기 위함. #4327
                    _tmp.originColorIdx = glbInfo.getIndexByKey("color", _obj.color, 1); //1은 default값(흑백)
                    _tmp.colorIdx = glbInfo.getIndexByKey("destColor", _obj.destColor, 1); //1은 default값(흑백)
                } else {
                    _tmp.colorIdx = glbInfo.getIndexByKey("color", _obj.color, 1); //1은 default값(흑백)
                }

                if (glbDataSet.userPolicyInfo.forcedBlack || glbDataSet.userPolicyInfo.defaultBlack) { //방어적 코딩, 강제흑백상태에서 컬러문서가 온경우 흑백으로 전환
                    _tmp.colorIdx = 1;
                }
                _tmp.originPlexIdx = _tmp.plexIdx = glbInfo.getIndexByKey("plex", _obj.duplex, 0); //0은 default값
                //방어적 코딩, 강제양면상태에서 단면문서가 온경우 양면으로 전환, 1page이상인경우도 포함
                //단면에 대한 조건이 빠져있던 부분 대응(2013/12/03 son.ch)
                if ((_tmp.plexIdx === 0 && glbDataSet.userPolicyInfo.forcedDuplex) && (1 <= _tmp.pageCnt)) {
                    _tmp.plexIdx = 1; // 1:DL
                }
                _tmp.originNupIdx = _tmp.nupIdx = glbInfo.getIndexByKey("nup", _obj.nUp, 0); //0은 default값
                if ((_tmp.nupIdx === 0 && glbDataSet.userPolicyInfo.forced2Up) && (1 <= _tmp.pageCnt)) {
                    _tmp.nupIdx = 1; // 1:DL
                }
                _tmp.srcNupIdx = glbInfo.getIndexByKey("nup", _obj.SRCnUp, 0); //0은 default값		//2013/4/3사양변경대응

                _tmp.deleteIdx = glbInfo.getIndexByKey("delete", glbConfig.DATA.DELETE, 0); //0은 default값
				//if(glbDataSet.userPolicyInfo.watermarkPolicy){ // 불필요한 조건문 삭제
				_tmp.watermark = (_obj.watermark == "Y");
				//}

                //사용가능량
                _remain = glbInfo.usagePrnCnt.remain[_tmp.colorIdx];
                //소요매수 계산
                _tmp.paperSpend = getPaperSpend(_tmp);

                if (_tmp.useYn) {
                    _used.push(_tmp);
                } else {
                    _notUsed.push(_tmp);
                }
            } else {
                _notUsed.push(_tmp);
            }
		}
		catch(e){
			//console.log(e);
			//KISUtil.debug("convertToVMData/e",JSON.stringify(e));
			//KISUtil.debug("convertToVMData/catch/_lst",JSON.stringify(_lst));
		}
	}
	_result.usedFileCount = _used.length;
	_result.lst = _notUsed.concat(_used);
	return _result;
}

/**
 * 인쇄용 Data로 가공
 */
function convertToPRNData(_lst){
	var _result=[],_tmp;
	for (var i = 0, iMax = _lst.length; i < iMax; i++) {
		try{
			_tmp = {};
			_obj = _lst[i];

			_tmp.uuId = _obj.UUID;
			_tmp.prnType = _obj.prnType ? "Y" : "N";
			if(_obj.prnType){
				_tmp.pageCnt = 1;
				_tmp.printCnt = 1;
				_tmp.prnSave = "N";
				_tmp.color = "C";
				_tmp.duplex = "S";
				_tmp.nUp = "1";
				_tmp.watermark = "N"
			}
			else{
				//_tmp.docName = _obj.docName;
				//_tmp.printDate = _obj.printDate;
				_tmp.pageCnt = _obj.pageCnt;
				_tmp.printCnt = _obj.printCnt;
				_tmp.prnSave = (glbInfo["delete"][_obj.deleteIdx].key == "1") ? "Y" : "N";
				//_tmp.useYn = _obj.useYn ? "Y" : "N";
				_tmp.color = glbInfo.color[_obj.colorIdx].key;
				_tmp.duplex = glbInfo.plex[_obj.plexIdx].key;
				_tmp.nUp = glbInfo.nup[_obj.nupIdx].key;
				_tmp.watermark = (_obj.watermark == true) ? "Y" : "N";
				//AR Start TODO:
				//portrait 2up 8up의 경우  장변단변이 반대로 되어야하는데(그에대한 처리가 필요)
				//landscape의경우는??
				/*
				if(_tmp.duplex != "S" && (_tmp.nUp==2||_tmp.nUp==8)){
					if(_tmp.duplex == "DL"){
						_tmp.duplex == "DS";
					}
					else if(_tmp.duplex == "DS"){
						_tmp.duplex == "DL";
					}
				}*/
				//AR End
			}

			_result[i] = _tmp;
		}
		catch(e){
			//console.log(e);
			//KISUtil.debug("convertToPRNData/e", JSON.stringify(e));
			//KISUtil.debug("convertToPRNData/catch/_lst", JSON.stringify(_lst));
		}
	}
	return _result;
}

function parseDate(str) //2017.01 FXKIS Chone 개인프린트 리스트를 즉시출력, 선택출력 기능에 포함 refs #4193
{
    if (!str) {
        return "";
    }

    var dateStr = str.replace('-', '/');
    dateStr = dateStr.replace('-', '/');

    var dateEndPoint = dateStr.indexOf('T');
    var ymdStr = dateStr.substring(0, dateEndPoint);

    var timeEndPoint = dateStr.indexOf('+');
    var timeStr = dateStr.substring(dateEndPoint + 1, timeEndPoint);

    return ymdStr + " " + timeStr;
}

function sortingLogic(a, b) //2017.01 FXKIS Chone 개인프린트 리스트를 즉시출력, 선택출력 기능에 포함 refs #4193
{
	/*
    if (a.printDate < b.printDate)
        return 1;
    if (a.printDate > b.printDate)
        return -1;
    return 0;
	*/
	if(glbConfig.DATA.LIST_SORT_ASC){
		if (a.printDate < b.printDate)
			return -1;
		if (a.printDate > b.printDate)
			return 1;
	}else{
		if (a.printDate < b.printDate)
			return 1;
		if (a.printDate > b.printDate)
			return -1;
	}
	return 0;
}

// 문자열에서 숫자만 추출
function fn(str){
    var res;
    res = str.replace(/[^0-9]/g,"");
    return Number(res);
}

/**
 * 프린트 설정에 따른 실출력 Page수 계산
 * Document Page, N-up, Duplex설정을 입력 받아 실제 출력 용지수를 구합니다.
 */
function countPrintingPaper(page, nupIdx, duplex)
{
	var count = page;
	// N-up 설정에 따른 계산
	var nup = nupIndexToNup(nupIdx);
	var quotient = parseInt(page/nup);
	var mod = page % nup;
	if(mod > 0){
		count = quotient + 1;
	}else{
		count = quotient;
	}
	// 양면 설정일 경우의 계산
	if(duplex > 0){
		quotient = parseInt(count/2);
		mod = count % 2;
		if(mod > 0){
			count = quotient + 1;
		}else{
			count = quotient;
		}
	}

	//var result = String(count);
	var result = count;
	return result;
}

/**
 * N-up Index를 N-up숫자로 변경
 *
 */
function nupIndexToNup(index)
{
	var result = 1;
	switch(index){
		case 0:
			result = 1;
			break;
		case 1:
			result = 2;
			break;
		case 2:
			result = 4;
			break;
		case 3:
			result = 8;
			break;
		case 4:
			result = 16;
			break;
		case 5:
			result = 32;
			break;
	}
	return result;
}

function roundToTwo(value) {
    return(Math.round(value * 100) / 100);
}

/**
 * 신규 Password 입력시 정책에 따른 확인용 함수
 *
**/
function checkPasswordPolicy(password)
{
	// Password 최대 길이 30(1byte)
	// 최소 길이 1로 범위는 1~30 까지
	// password = password + "가"; // Test용
	var cntCapitalChar = 	parseInt(glbInfo.userInfo.passwordPolicy.neededCapitalCharCnt);
	var cntDigitChar = 		parseInt(glbInfo.userInfo.passwordPolicy.neededDigitCnt);
	var cntSpecialChar = 	parseInt(glbInfo.userInfo.passwordPolicy.neededSpecialCharCnt);
	var cntMinPW = 			parseInt(glbInfo.userInfo.passwordPolicy.minPasswordCnt);
	var cntMaxPW = 			parseInt(glbInfo.userInfo.passwordPolicy.maxPasswordCnt);

	var result = "OK";
	// 정규식 정리
	var spaceExp	= /\s/g;		// 공백 확인용
	var upperExp 	= /[^A-Z]/g;	// 대문자 확인용
	var digitExp 	= /[^0-9]/g;	// 숫자 확인용
	var specialExp	= /[^\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	var apphabetExp	= /[^a-zA-Z]/g;	// 영문 확인용
	var cntPassword = password.length;
	var inputErrCnt = password.length;

	// 공백 채크 FAIL_SPACE
	if(password.match(spaceExp)){
		return result = "FAIL_SPACE";
	}

	// 대문자 포함 확인 FAIL_CAPITAL_CHAR
	if(cntCapitalChar > 0){
		var upper = password.replace(upperExp, '');
		if(cntCapitalChar > upper.length){
			return result = "FAIL_CAPITAL_CHAR";
		}
	}

	// 숫자 포함 확인 FAIL_DIGIT
	var digit = password.replace(digitExp, '');
	inputErrCnt = inputErrCnt - digit.length;
	if(cntDigitChar > 0){
		//var digit = password.replace(digitExp, '');
		//inputErrCnt = inputErrCnt - digit.length;
		if(cntDigitChar > digit.length){
			return result = "FAIL_DIGIT";
		}
	}

	// 특수문자 포함 확인 FAIL_SPECIAL_CHAR
	var special = password.replace(specialExp, '');
	inputErrCnt = inputErrCnt - special.length;
	if(cntSpecialChar > 0){
		//var special = password.replace(specialExp, '');
		//inputErrCnt = inputErrCnt - special.length;
		if(cntSpecialChar > special.length){
			return result = "FAIL_SPECIAL_CHAR";
		}
	}

	// 영문 확인
	var check_eng = password.replace(apphabetExp, '');
	inputErrCnt = inputErrCnt - check_eng.length;
	if(inputErrCnt > 0){
		return result = "FAIL_INPUT_TEXT";
	}

	// 최소 길이 확인 FAIL_MIN_LENGTH
	if(cntMinPW > cntPassword){
		return result = "FAIL_MIN_LENGTH";
	}

	// 최대 길이 확인 FAIL_MAX_LENGTH
	if(cntMaxPW < cntPassword){
		return result = "FAIL_MAX_LENGTH";
	}

	return result;
}

/**
 * 신규 Password 입력시 정책에 따른 안내문구 생성용
 *
**/
function noticePasswordPolicy()
{
	// Password 최대 길이 30(1byte)
	// 최소 길이 1로 범위는 1~30 까지
	var result = " ";
	if(glbInfo.userInfo.passwordPolicy){
		var cntCapitalChar = 	parseInt(glbInfo.userInfo.passwordPolicy.neededCapitalCharCnt);
		var cntDigitChar = 		parseInt(glbInfo.userInfo.passwordPolicy.neededDigitCnt);
		var cntSpecialChar = 	parseInt(glbInfo.userInfo.passwordPolicy.neededSpecialCharCnt);
		var cntMinPW = 			parseInt(glbInfo.userInfo.passwordPolicy.minPasswordCnt);
		var cntMaxPW = 			parseInt(glbInfo.userInfo.passwordPolicy.maxPasswordCnt);

		var temp = (Msg.PASSWORD_EXP.PW_LENGTH_GUIDE).replace(/XX/, glbInfo.userInfo.passwordPolicy.minPasswordCnt);
		result = temp.replace(/YY/, glbInfo.userInfo.passwordPolicy.maxPasswordCnt);

		// 대문자 포함 확인 FAIL_CAPITAL_CHAR
		if(cntCapitalChar > 0){
			result = result + (Msg.PASSWORD_EXP.PW_CAPITAL_GUIDE).replace(/XX/, glbInfo.userInfo.passwordPolicy.neededCapitalCharCnt);
		}

		// 숫자 포함 확인 FAIL_DIGIT
		if(cntDigitChar > 0){
			result = result + (Msg.PASSWORD_EXP.PW_DIGIT_GUIDE).replace(/XX/, glbInfo.userInfo.passwordPolicy.neededDigitCnt);
		}

		// 특수문자 포함 확인 FAIL_SPECIAL_CHAR
		if(cntSpecialChar > 0){
			result = result + (Msg.PASSWORD_EXP.PW_SPECIAL_GUIDE).replace(/XX/, glbInfo.userInfo.passwordPolicy.neededSpecialCharCnt);
		}

		result = result + Msg.PASSWORD_EXP.PW_SPACE_GUIDE;
	}

	return result;
}

/**
 * Job 정보에 따른 가격 계산 함수
 *
**/
function getPriceCalc(jobInfo)
{
	var result = NO_PRICE;

	switch(jobInfo.jobType)
	{
		case JOB_TYPE.PRINT:	// Print Job의 금액 계산
			var unitJobInfo = {};
			unitJobInfo.UnitJobType = UNIT_PRICE_TYPE.PRINT;
			unitJobInfo.paperSize = jobInfo.papersize;
			unitJobInfo.colorMode = getDocColorMode(jobInfo.rendermode, "JFLib");
			unitJobInfo.outPlex = getDuplexMode(jobInfo.binding, jobInfo.duplex);
			unitPrice = getUnitPrice(unitJobInfo);
			if(jobInfo.duplex == "OFF"){
				result = (unitPrice * parseInt(jobInfo.physicalpages)) * getDocCopies(parseInt(jobInfo.copies), parseInt(jobInfo.qty));
			}else{
				if(evenOrOdd() == "Even"){
					// page가 짝수인 경우 양면 금액으로
					result = (unitPrice * parseInt(jobInfo.physicalpages)) * getDocCopies(parseInt(jobInfo.copies), parseInt(jobInfo.qty));
				}else {
					// page가 홀수인 경우 마지막 1page는 단면 금액으로
					unitJobInfo.outPlex = getDuplexMode(jobInfo.binding, "OFF");	// 단면 Unit price 취득
					simpUnitPrice = getUnitPrice(unitJobInfo);
					dupPage = parseInt(jobInfo.physicalpages) - 1;
					result = (dupPage * unitPrice + simpUnitPrice) * getDocCopies(parseInt(jobInfo.copies), parseInt(jobInfo.qty));
				}
			}
			break;
		case JOB_TYPE.COPY:
			var unitJobInfo = {};
			unitJobInfo.UnitJobType = UNIT_PRICE_TYPE.COPY;
			unitJobInfo.paperSize = sizeCheck(jobInfo.papersize);
			unitJobInfo.colorMode = getDocColorMode(jobInfo.colorMode, "JFLib");
			//unitJobInfo.outPlex = getDuplexMode(jobInfo.binding, jobInfo.duplex);
			unitJobInfo.outPlex = jobInfo.outPlex;
			unitPrice = getUnitPrice(unitJobInfo);
			if(jobInfo.duplex == "OFF"){
				result = (unitPrice * parseInt(jobInfo.physicalpages)) * getDocCopies(parseInt(jobInfo.copies), parseInt(jobInfo.qty));
			}else{
				if(evenOrOdd() == "Even"){
					// page가 짝수인 경우 양면 금액으로
					result = (unitPrice * parseInt(jobInfo.physicalpages)) * getDocCopies(parseInt(jobInfo.copies), parseInt(jobInfo.qty));
				}else {
					// page가 홀수인 경우 마지막 1page는 단면 금액으로
					unitJobInfo.outPlex = getDuplexMode(jobInfo.binding, "OFF");	// 단면 Unit price 취득
					simpUnitPrice = getUnitPrice(unitJobInfo);
					dupPage = parseInt(jobInfo.physicalpages) - 1;
					result = (dupPage * unitPrice + simpUnitPrice) * getDocCopies(parseInt(jobInfo.copies), parseInt(jobInfo.qty));
				}
			}
			break;
		case JOB_TYPE.SCAN:		// Scan Job의 금액 계산
			var unitJobInfo = {};
			unitJobInfo.UnitJobType = UNIT_PRICE_TYPE.SCAN;
			unitJobInfo.paperSize = jobInfo.papersize;
			unitJobInfo.colorMode = getDocColorMode(jobInfo.colorMode, "JFLib");
			unitJobInfo.outPlex = JFLib.PLEX.SIMPLEX;
			unitPrice = getUnitPrice(unitJobInfo);
			result = parseInt(jobInfo.physicalpages) * unitPrice;
			break;
		case JOB_TYPE.FAX:		// Fax Job의 금액 계산
			var unitJobInfo = {};
			unitJobInfo.UnitJobType = UNIT_PRICE_TYPE.FAX;
			unitPrice = getUnitPrice(unitJobInfo);
			result = parseInt(jobInfo.physicalpages) * unitPrice;
			break;
		case JOB_TYPE.ETC:		// 기타 Job의 금액 계산(Service의 추가가 있을 경우)
		default:
			break;
	}
	return result;
}

/**
 * Uint당 가격 확인 함수
 *
**/
function getUnitPrice(jobInfo)
{
	var result = NO_PRICE;
	for(var i=0;i<glbBillingTable.billingPrices.length;i++)
	{
		// Print용 Unit Price 확인
		if(jobInfo.UnitJobType == UNIT_PRICE_TYPE.PRINT){
			if((glbBillingTable.billingPrices[i.toString()].jobType == jobInfo.UnitJobType)
			&&(glbBillingTable.billingPrices[i.toString()].paperSize == jobInfo.paperSize)){
				if(jobInfo.colorMode == JFLib.CM.COLOR){
					if(jobInfo.outPlex == JFLib.PLEX.SIMPLEX){
						result = glbBillingTable.billingPrices[i.toString()].colorSimplexPrice;
					}else {
						result = glbBillingTable.billingPrices[i.toString()].colorDuplexPrice;
					}
				}else{
					if(jobInfo.outPlex == JFLib.PLEX.SIMPLEX){
						result = glbBillingTable.billingPrices[i.toString()].blackWhiteSimplexPrice;
					}else {
						result = glbBillingTable.billingPrices[i.toString()].blackWhiteDuplexPrice;
					}
				}
			}
		}else if(jobInfo.UnitJobType == UNIT_PRICE_TYPE.COPY){
			// Copy용 Unit Print 확인
			if((glbBillingTable.billingPrices[i.toString()].jobType == jobInfo.UnitJobType)
			&&(glbBillingTable.billingPrices[i.toString()].paperSize == jobInfo.paperSize)){
				if(jobInfo.colorMode == JFLib.CM.COLOR){
					if(jobInfo.outPlex == JFLib.PLEX.SIMPLEX){
						result = glbBillingTable.billingPrices[i.toString()].colorSimplexPrice;
					}else {
						result = glbBillingTable.billingPrices[i.toString()].colorDuplexPrice;
					}
				}else{
					if(jobInfo.outPlex == JFLib.PLEX.SIMPLEX){
						result = glbBillingTable.billingPrices[i.toString()].blackWhiteSimplexPrice;
					}else {
						result = glbBillingTable.billingPrices[i.toString()].blackWhiteDuplexPrice;
					}
				}
			}
		}else if(jobInfo.UnitJobType == UNIT_PRICE_TYPE.SCAN){
			// Scan용 Unit Print 확인
			if((jobInfo.colorMode == JFLib.CM.COLOR) && (glbBillingTable.billingPrices[i.toString()].jobType == jobInfo.UnitJobType)){
				result = glbBillingTable.billingPrices[i.toString()].colorSimplexPrice;
			}else{
				if(glbBillingTable.billingPrices[i.toString()].jobType == jobInfo.UnitJobType){
					result = glbBillingTable.billingPrices[i.toString()].blackWhiteSimplexPrice;
				}
			}
		}else if(jobInfo.UnitJobType == UNIT_PRICE_TYPE.FAX){	// 팩스용 Unit Price 확인
			result = glbBillingTable.billingPrices[i.toString()].blackWhiteSimplexPrice;
		}else {
			result = NO_PRICE;		// 과금없이 Job을 개시합니다.
		}
	}
	return result;
}

/**
 * Screen Type 확인 함수
 *
**/
function setScreenType()
{
	/* 表示領域の取得 */
	glbInfo.screenWidth 	= BrowserLib.getScreenWidth();
	glbInfo.screenHeight 	= BrowserLib.getScreenHeight();
	var _scrType = null;
	if ( BrowserLib ) {
		_scrType = BrowserLib.getScreenType();
	}
	/* 表示開始位置 */
	if ( _scrType && _scrType == BrowserLib.ScreenType.WVGA_ALL_SCREEN ){
		glbInfo.screenType 		= BrowserLib.ScreenType.WVGA_ALL_SCREEN;
		glbInfo.pageHeight 		= 440;
	} else if ( _scrType && _scrType == BrowserLib.ScreenType.SVGA_ALL_SCREEN ){
		glbInfo.screenType 		= BrowserLib.ScreenType.SVGA_ALL_SCREEN;
		glbInfo.pageHeight 		= 560;
	}else if ( _scrType && _scrType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN ){
		glbInfo.screenType 		= BrowserLib.ScreenType.WSVGA_ALL_SCREEN;
		glbInfo.pageHeight 		= 560;
	}else{
		// Default는 WVGA
		glbInfo.screenType 		= BrowserLib.ScreenType.WVGA_ALL_SCREEN;
		glbInfo.pageHeight 		= 440;
	}
}

/**
 * Print Job List 변환 함수
 *
**/
function getPrintJobList(printList)
{
	var count = printList.length;
	var _lst = new Array();

	for(i = 0; i < count; i++){
		var item = printList[i];
		var tmp = new Object();
		tmp.JobSeq		= i;
		tmp.uuid 		= item.uuid;
		//tmp.docName		= item.uacn;
		if(item.uacn){
			tmp.docName		= item.uacn;
		}else{
			tmp.docName		= item.acna;
		}
		tmp.paperSize	= item.papersize;
		tmp.colorIdx	= getDocColorMode(item.rendermode);
		tmp.pageCnt 	= item.physicalpages;
		tmp.printCnt 	= getDocCopies(parseInt(item.copies), parseInt(item.qty));
		tmp.plexIdx		= getDuplexMode(item.binding, item.duplex);
		tmp.nupIdx		= parseInt(item.nlpp);
		item.jobType	= JOB_TYPE.PRINT;
		tmp.price		= getPriceCalc(item);
		tmp.printDate	= item.registeredTime;
		_lst.push(tmp);
		//_lst[i] = tmp;
	}
	return _lst;
}
/**
 * Duplex Mode 확인
 *
**/
function getDuplexMode(binding, duplex)
{
	var result = JFLib.PLEX.SIMPLEX;
	if(duplex == "OFF"){
		result = JFLib.PLEX.SIMPLEX;
	}else{
		if(binding == "LONGEDGE"){
			result = JFLib.PLEX.DUPLEX;
		}else{
			result = JFLib.PLEX.TUMBLE;
		}
	}
	return result;
}
/**
 * Page 확인
 *
**/
function getDocCopies(copies, qty)
{
	var maxnum;
	if(copies >= qty){
		maxnum = copies;
	}else{
		maxnum = qty;
	}
	return maxnum;
}
/**
 * Color Mode 확인
 *
**/
function getDocColorMode(rendermode, mode)
{
	var result;
	if((rendermode == "GRAYSCALE")||(rendermode == "monochrome")||(rendermode == "BlackAndWhite")){
		if(mode == "JFLib"){
			result = JFLib.CM.BW;
		}else{
			result = 0;
		}
	}else{
		if(mode == "JFLib"){
			result = JFLib.CM.COLOR;
		}else{
			result = 1;
		}
	}

	return result;
}

function evenOrOdd(num)
{
	if ( num % 2 == 0 ) {
		return "Even"
	} else {
		return "Odd"
	}
}

function formatWithRemainders(value) {
    var original = value;
    var isNegative = value < 0;
    var absValue = Math.abs(value);
    var floorValue = Math.floor(absValue);
    var v = floorValue;
    if (v == 0)
        return "0";
    var formatted = "";
    while (v > 0) {
        if (formatted.length > 0) {
            formatted = "," + formatted;
        }
        var remainder = (v % 1000) + "";
        v = Math.floor(v / 1000);
        if (v > 0) {
            for (var i = remainder.length; i < 3; i++) {
                remainder = "0" + remainder;
            }
        }
        formatted = remainder + formatted;
    }
    if (absValue !== floorValue) {
        formatted += "." + original.toString().split('.')[1];
    }
    if (isNegative) {
        formatted = "-" + formatted;
    }
    return formatted;
}

function sizeCheck(size)
{
	// A4, A3, B5, B4 총 4가지 용지만 지원함, 이외의 용지는 "?"처리
	var result = "A4";
	if(size.length > 2){
		if(size.indexOf("B4") == -1)
		{
			if(size.indexOf("B5") == -1)
			{
				result = "?";
			}else{
				result = "B5";
			}
		}else{
			result = "B4";
		}
	}else{
		if((size == "A4")||(size == "A3"))
		{
			result = size;
		}else{
			result = "?";
		}
	}
	return result;
};

/************************************************************
 * Get the job information from device
 *************************************************************/
function getJobInfo(){
	SSMILib.GetJobInfo(glbInfo.authMode, glbInfo.jobId,"DeviceJobInformation");
};

function formatDate(dateStr)
{
	// Response Date format : 2021-03-15T17:23:27+09:00
	var result = dateStr;
	var temp = dateStr.replace('T', ' ');
	result = temp.substring(0, 19);
	return result;
};
/************************************************************
 * Get Copy Scan job File Name create
 *************************************************************/
function getCopyFileName()
{
	//20140202_235959999_13_197_1_73_D_2_A4_C_1.xdw
	var date = new Date();
	var timestamp = date.format("yyyyMMdd_HHhhmmssfff");
	var result = glbDeviceInfo.serialNumber + "_" + timestamp;
	KISUtil.debug("getCopyFileName : ", result);
	return result;
};
/************************************************************
 * Get Scan job File Name create
 *************************************************************/
function getScanFileName()
{
	// filename ex "20230621235959999_1_fujifilm_1200_9200.pdf"
	var date = new Date();
	var timestamp = date.format("yyyyMMddHHhhmmss");
	var result = timestamp + "_"  + glbJobLogInfo.deviceId + "_" + glbDeviceInfo.serialNumber + "_" 
				+ glbResOptions[glbSetting.selectScanSettings.resIndex].value + "_" 
				+ glbConfigData.SCAN_PC_PORT;
	KISUtil.debug("getScanFileName : ", result);
	return result;
};
/************************************************************
 * Get Fax Scan job File Name create
 *************************************************************/
function getFaxFileName()
{
	//20140202235959999_13_fujifilm_1300_023108688.tiff
	var date = new Date();
	var timestamp = date.format("yyyyMMddHHhhmmss");
	if(glbDataSet.priceInfo){
		var result = timestamp + "_" + glbJobLogInfo.deviceId +"_" + glbDeviceInfo.serialNumber + "_" + glbDataSet.priceInfo.totalPrice + "_" + glbSetting.FaxNumber;
	}else{
		var result = timestamp + "_" + glbJobLogInfo.deviceId +"_" + glbDeviceInfo.serialNumber + "_" + glbSetting.FaxNumber;
	}
	KISUtil.debug("getFaxFileName : ", result);
	return result;
};

/**
 * 日付にパターンを適用するためDateを拡張する。
 * @param {string} pattern 日付の形式
 */
Date.prototype.format = function(pattern) {
    if (!this.valueOf()) return "";

    var d = this;

    return pattern.replace(/(yyyy|yy|MM|dd|hh|mm|ss|fff|a\/p)/gi,
        function(token) {
            switch (token) {
                case 'yyyy':
                    return d.getFullYear();
                case 'yy':
                    return (d.getFullYear() % 1000).zf(2);
                case 'MM':
                    return (d.getMonth() + 1).zf(2);
                case 'dd':
                    return d.getDate().zf(2);
                case 'HH':
                    return d.getHours().zf(2);
                case 'hh':
                    return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case 'mm':
                    return d.getMinutes().zf(2);
                case 'ss':
                    return d.getSeconds().zf(2);
                case 'fff':
                    return d.getMilliseconds().zf(3);
                case 'a/p':
                    return d.getHours() < 12 ? 'AM' : 'PM';
                default:
                    return token;
            }
        }
    );
};
String.prototype.string = function(len) { var s = '',
        i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function(len) { return '0'.string(len - this.length) + this; };
Number.prototype.zf = function(len) { return this.toString().zf(len); };


function replaceAll(str, searchStr, replaceStr) {
	return str.split(searchStr).join(replaceStr);
}
function subNetsplit(){
	var subnet = glbInfo.PRINTER_IP.split('.');
	var dot = ".";

	result = subnet[0] + dot + subnet[1] + dot + subnet[2] + dot;

	return result;
}

function getScanToPcCheck(){
	for(var i = 0; i < 5; i++ ){
		if(glbConfigData.SCAN_PC_IP[i] != ""){
			getBridgeUserInfo(glbConfigData.SCAN_PC_IP[i]);
		}
	}
}
/************************************************************
 * Get the user information from client
 *************************************************************/
 function getBridgeUserInfo(clientid){
	var port = CLIENT_PORT;
	if(glbConfigData.SCAN_PC_PORT != ""){
		port = glbConfigData.SCAN_PC_PORT;
	}
	var url = HTTP_PROTOCOL + clientid + ":" + port + "/bridgeapp/main/information";
	var ws = new WebServiceLib.Communicator();
	ws.method = 'GET';
	ws.timeout = "100";
	ws.successHandler = onGetBridgeUserInfoSuccess;
	ws.errorHandler = onGetBridgeUserInfoError;
	ws.timeoutHandler = onGetBridgeUserInfoTimeout;
	ws.send(url);
}

/************************************************************
 * Success event for getting the user information from client
 *************************************************************/
 function onGetBridgeUserInfoSuccess(res){
	var resText = res.responseText;
	var obj = JSON.parse(resText);
	SSMILib.onEvent("GetBridgeUserInfo", true, obj);
	return;
}
/************************************************************
 * Error event for getting the user information from client
 *************************************************************/
function onGetBridgeUserInfoError(res){
	var obj = res;
	SSMILib.onEvent("GetBridgeUserInfo", false, obj);
	return;
}
/************************************************************
 * Timeout event for getting the user information from client
 *************************************************************/
function onGetBridgeUserInfoTimeout(){
	SSMILib.onEvent("GetBridgeUserInfo", false, null);
	return;
}

/************************************************************
 * Get the user online status
 *************************************************************/
 function getClientStatus(clientid){
	var port = CLIENT_PORT;
	if(glbConfigData.SCAN_PC_PORT != ""){
		port = glbConfigData.SCAN_PC_PORT;
	}
	var target = clientid+":"+ port;
	var url = HTTP_PROTOCOL + target + "/bridgeapp/main/online";
	var ws = new WebServiceLib.Communicator();
	ws.method = 'HEAD';
	ws.timeout = '100';
	ws.successHandler = onGetClientStatusSuccess;
	ws.errorHandler = onGetClientStatusError;
	ws.timeoutHandler = onGetClientStatusError;
	ws.send(url);
}
/************************************************************
 * Success event for getting the user online status
 *************************************************************/
function onGetClientStatusSuccess(res){
	SSMILib.onEvent("GetClientStatus", true);
	return;
}
/************************************************************
 * Error event for getting the user online status
 *************************************************************/
function onGetClientStatusError(res){
	SSMILib.onEvent("GetClientStatus", false);
	return;
}

function isNumeric(num, opt){
	// 좌우 trim(공백제거)을 해준다.
	num = String(num).replace(/^\s+|\s+$/g, "");
   
	if(typeof opt == "undefined" || opt == "1"){
	  // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
	  var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
	}else if(opt == "2"){
	  // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
	  var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
	}else if(opt == "3"){
	  // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
	  var regex = /^[0-9]+(\.[0-9]+)?$/g;
	}else{
	  // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
	  var regex = /^[0-9]$/g;
	}
   
	if( regex.test(num) ){
	  num = num.replace(/,/g, "");
	  return isNaN(num) ? false : true;
	}else{ return false;  }
  }
/************************************************************
 * 특정 문자열 포함여부 확인
 *************************************************************/
function isUrl(str){
	var result = false;
	var searchStr = "http";
	if(str.indexOf(searchStr) != -1){
		result = true;
	}
	return result;
}