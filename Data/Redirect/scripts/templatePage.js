/**
 * 페이지 공통의 기능
 *
 */
function TemplatePage(){
	/**
	 * 페이지의 Data격납용
	 */
	this.key = "";//메시지 영역 구분자,개별 페이지에서 할당하여 처리(공용 메시지 영역을 사용시 공백으로 유지)
	this._data = {};
	this.pageType = "Normal";

	/**
	 * 개별 페이지의 표시요청을 초기화 한다.
	 */
	this._initPage = function()
	{
		this._createHtml();
		this._initOthers();
		this._initImage();
		this._initBtn();
		this._initText();
	};

	/**
	 * 개별 페이지의 이미지를 구성 및 등록 한다.(개별 페이지의 Data를 바탕으로...)
	 */
	this._initImage = function()
	{
		var obj;
		for (var i = 0, il = this._data.imageList.length; i < il; i++) {
			obj = this._data.imageList[i];
			Common.setImage(obj.id, obj.src);
			if (obj.className) {
				var ele = document.getElementById(obj.id);
				if (ele)
					ele.className = obj.className;
			}
		}
	};

	/**
	 * 개별 페이지의 버튼을 구성 및 등록한다. (개별 페이지의 Data를 바탕으로...)
	 */
	this._initBtn = function()
	{
		var obj;
		for (var i = 0, il = this._data.buttonList.length; i < il; i++) {
			obj = this._data.buttonList[i];
			WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
			if (obj.status) {
				WidgetLib.setWidgetStatus(obj.id, obj.status);
			}
		}
	};

	/**
	 * 개별 페이지의 문자열을 구성 및 등록한다. (개별 페이지의 Data를 바탕으로...)
	 */
	this._initText = function()
	{
		var obj;
		for (var i = 0, il = this._data.textList.length; i < il; i++) {
			obj = this._data.textList[i];
			Common.setText(obj.id, obj.text);
			if (obj.className) {
				var ele = document.getElementById(obj.id);
				if (ele)
					ele.className = obj.className;
			}
		}
	};

	/**
	 * 개별 페이지의 기타 Component(현재는 풀다운만)를 구성 및 등록한다. (개별 페이지의 Data를 바탕으로...)
	 */
	this._initOthers = function()
	{
		//개별 페이지로 override하여 사용하는 것으로 변경
	};

	/**
	 * 개별 페이지의 HTML Tag를 구성 및 등록
	 */
	this._createHtml = function()
	{
		var attr = {id:this.ID, className:"page"};
		var div = Common.getNewElement("div", attr);
		div.innerHTML = glbPageSource[this.ID];
		div.setAttribute("onmousedown", "onPageClick();");
		document.body.appendChild(div);
	};

	/**
	 *개별 페이지의 초기화를 실행 (Data, 표시)
	 */
	this._initialize = function(){
		//this._dataSet = new DataSet();
		//console.log(this.ID+"/_initialize");
		//console.log(this._dataSet);
		this._initModel();
		this._initPage();
		this._onLoadEvent();
	};

	/**
	 * 페이지 구성 직후에 실행
	 */
	this._onLoadEvent = function(){
		//개별 페이지로 override하여 사용하는 것으로 변경
	};

	this._onPageChange = function(){
		//개별 페이지로 override하여 사용하는 것으로 변경
	};

	this._onPageLeave = function(){
		//개별 페이지로 override하여 사용할것
	};
	/**
	 * 풀다운 닫기 처리용 메소드
	 *
	 * 풀다운 Widget타입이 MODAL설정 전제로 한 대응
	 * 풀다운이 열린 상태에서 버튼과 메뉴 영역 이외를 눌럿을 경우
	 * 풀다운 닫기 처리하는 방법
	 */
	this.onPageClick=function(){
		//개별 페이지로 override하여 사용하는 것으로 변경
	};

	/**
	 * 풀다운을 구성
	 */
	this._initPullDown = function(key){
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
			document.body.appendChild(Common.createHTMLPulldown(obj.pageKey, obj.key, obj.value.length));
			for (var j = 0, jl = obj.value.length; j < jl; j++) {
				node = obj.value[j];
				tmp = pulldownList.common.btn;
				tmp.targetImgId = "img_" + key + "_" + obj.key + "_menu_" + j;
				WidgetLib.registerButtonWidgetById("btn_" + key + "_" + obj.key + "_menu_" + j, WidgetLib.ButtonType.RADIO, tmp);
				Common.setImage("icn_" + key + "_" + obj.key + "_menu_" + j, node.icon.off);
				Common.setText("lbl_" + key + "_" + obj.key + "_menu_" + j, node.text);
			}
			// Common.setImage("img_" + key + "_" + obj.key + "_popup_top", pulldownList.common.popup.top);
			// Common.setImage("img_" + key + "_" + obj.key + "_popup_bottom", pulldownList.common.popup.bottom);
			Common.setImage("icn_" + key + "_" + obj.key, obj.value[0].icon.off);
			Common.setText("lbl_" + key + "_" + obj.key, obj.value[0].text);
			var popupId = "pul_" + key + "_" + obj.key + "_popup";
			var pullBtnAttr = pulldownList.common.pullDown;
			pullBtnAttr.targetImgId = "img_" + key + "_" + obj.key;
			pullBtnAttr.popupId = popupId;
			WidgetLib.registerPopupWidgetById(popupId, WidgetLib.PopupType.MODAL);			//onPageClickがいらなくなる		v0.1.3で対応
			WidgetLib.registerButtonWidgetById("pul_" + key + "_" + obj.key, WidgetLib.ButtonType.POPUP, pullBtnAttr);
			var pullBtnIcon = pulldownList.common.icn;
			pullBtnIcon.targetImgId = "img_" + key + "_btn_" + obj.key;
			pullBtnIcon.popupId = popupId;
			WidgetLib.registerButtonWidgetById("pul_" + key + "_btn_" + obj.key, WidgetLib.ButtonType.POPUP, pullBtnIcon);
		}
	};

	/**
	 * 풀다운의 구조를 설정
	 */
	this.displayPullMenuBtn = function(pk, idx){
		var id = "pul_"+ pk + "_"+this.pullDownList[idx]+"_popup";
		var node = WidgetLib.getWidgetNode(id);
		if(!node)
		{
			this._initPullDown(pk);
		}
		WidgetLib.openPopupWidget(id);
		this.displayPullMenuPopup(pk, idx);
		Common.changeVisibility(id, "block");
	};

	/**
	 * 풀다운의 이미지를 설정
	 */
	this.displayPullMenuPopup = function(pk, idx){
		var key = this.pullDownList[idx];
		var pullIdx = this._dataSet.selectedDocInfo[key + "Idx"];
		//var length = Common.getObjLength(glbInfo[key]);
		this.updatePullMenuPopup(pk, key, pullIdx, glbInfo[key].length);
		var id = "pul_"+ pk + "_" + key + "_popup";
		Common.changeVisibility(id, "block");

	};

	/**
	 * 화면 표시의 갱신 (풀다운의 항목 버튼)
	 */
	this.updatePullMenuPopup = function(pk, key, idx, length){
		var id;
		for(var i = 0;i < length; i++)
		{
			id=	"btn_" + pk + "_" + key + "_menu_" + i;
			WidgetLib.setWidgetStatus(id,{on:(i == idx)});
		}
	};

	/**
	 * 화면 표시의 갱신(풀다운)
	 */
	this.updatePulldown = function(pk, type, _data)
	{
		//getName
		var key = this.pullDownList[type];
		if(_data == null){_data=this._dataSet;}
		var idx = _data[key + "Idx"];
		if(idx<0)
		{
			KISUtil.debug("invalid DataType/" + key, _data[key]);
		}
		else
		{
			var lst = this._data.pulldownList.list[type];
			Common.setImage("icn_" + pk + "_" + lst.key, lst.value[idx].icon.off);		//update Icon
			Common.setText("lbl_" + pk + "_" + lst.key, lst.value[idx].text);		//update text
			WidgetLib.setWidgetStatus("pul_" + pk + "_" + key, {on:false});
		}
	};
	this.store = function(){
		this._dataSetBackup = extendDeep(this._dataSet, {});
	};
	this.rollBack = function(){
		this._dataSet = extendDeep(this._dataSetBackup, this._dataSet);
	};
	this.deepCopy = function(_source) {
		this._dataSet = extendDeep(_source, this._dataSet);
	};
}
