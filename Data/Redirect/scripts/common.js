/**
 * @fileoverview CS기본동작과 공통기능을 정의하는 파일
 * @author FBKR System Engineering Team DongSeok.Oh
 * @version 1.0.0
 */
var Common = {};
var time = 0;

/**
 * Contents기동시의 초기설정을 실행한다.
 */
Common.onLoadBody = function()
{
	// Contents Initialization
	ContentsLib.init();
	ContentsLib.contentsIcon = "./info/smallicon.png";
	ContentsLib.contentsName = DATA.TITLE_NAME;
	// Event setting
	ContentsLib.setListener(Common.onLoadEvent);
	// Browser 동작 Setting
	BrowserExt.Initialize();
	BrowserExt.SetScreenChange("popup:faultAll");
	// 초기화
	PageManager.init("pageWrapper");

	KISUtil.initDebug("body");
	//init
	initInfo();
	resetInfo();
	setScreenType();
	KISUtil.debug("EWB Size:", glbInfo.screenType);
	PageManager.changePage(WaitingPage, PageManager.type.NORMAL);
	if(glbConfigData.VIEW_TIME == "0"){
		if(isUrl(glbConfigData.HTML_URL)){
			checkUrl(glbConfigData.HTML_URL, "HEAD");
			BrowserExt.SetScreenChange("changeDisplay:URL:" + glbConfigData.HTML_URL);
		}else{
			if(glbConfigData.HTML_URL == ""){
				PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
			}else{
				BrowserExt.SetScreenChange("menuto:" + glbConfigData.HTML_URL);
			}
		}
	}
	if(glbConfigData.DATA_TYPE == "html"){
		if(glbConfigData.HTML_URL == ""){
			PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
		}else{
			checkUrl(glbConfigData.HTML_URL, "HEAD");
			BrowserExt.SetScreenChange("changeDisplay:URL:" + glbConfigData.HTML_URL);
		}
		// 
	}else{
		glbimgList = [];
		
		for(var i=0; i<glbConfigData.IMG_URL.length; i++){
			if(isUrl(glbConfigData.IMG_URL[i])){
				glbimgList.push(glbConfigData.IMG_URL[i]);
				//loadScript(glbConfigData.IMG_URL[i]);
			}
		}
		//checkUrl(glbimgList[0]);
		if(glbimgList.length > 0){
			checkUrl(glbimgList[0], "GET");
			PageManager.changePage(WaitingPage, PageManager.type.NORMAL);
			// image view
			//BrowserExt.SetScreenChange("menuto:" + glbConfigData.HTML_URL);
			glbCount = glbimgList.length; // 이미지수만큼 반복
			glbCount = glbCount - 1;
			var imageAttribute = document.getElementById("img_MP_top_banner");
			imageAttribute.setAttribute("width", glbInfo.screenWidth.toString());
			imageAttribute.setAttribute("height", glbInfo.screenHeight.toString());
			
			var startBtnLeft = glbInfo.screenWidth - 80;
			if(glbConfigData.BTN_POSITION != "1"){
				startBtnLeft = 10;
			}
			var leftPx = startBtnLeft.toString() + "px";
			var startBtnAttr = document.getElementById("btn_MP_start");
			startBtnAttr.style.left = leftPx;

			var prefBtnTop = glbInfo.screenHeight - 40;
			var prefBtnLeft = glbInfo.screenWidth - 40;
			var topPx = prefBtnTop.toString() + "px";
			var leftPx = prefBtnLeft.toString() + "px";
			var prefBtnAttr = document.getElementById("btn_MP_setting");
			prefBtnAttr.style.top = topPx;
			prefBtnAttr.style.left = leftPx;
			Common.setImage("img_MP_top_banner", glbimgList[glbImageCnt]);
			start();
			
			
		}else{
			PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
		}
	}
}
function start(){
	clearInterval (time);
	time = setInterval("getTimeOut()", glbConfigData.VIEW_TIME * 1000);
}
function getTimeOut(){
	glbCount = glbCount - 1;
	if( glbCount >= 0) {  // 카운트 진행중
		setCount(glbimgList.length);
		Common.setImage("img_MP_top_banner", glbimgList[glbImageCnt]);
	}
	else if ( glbCount < 0 ) {
		clearInterval(time);
		if(glbConfigData.HTML_URL != ""){
			if(isUrl(glbConfigData.HTML_URL)){
				checkUrl(glbConfigData.HTML_URL, "HEAD");
				BrowserExt.SetScreenChange("changeDisplay:URL:" + glbConfigData.HTML_URL);
			}else{
				BrowserExt.SetScreenChange("menuto:" + glbConfigData.HTML_URL);
			}
		}else{
			PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
		}
	}

}
function startMain(){
	clearInterval (time);
	if(isUrl(glbConfigData.HTML_URL)){
		checkUrl(glbConfigData.HTML_URL, "HEAD");
		BrowserExt.SetScreenChange("changeDisplay:URL:" + glbConfigData.HTML_URL);
	}else{
		BrowserExt.SetScreenChange("menuto:" + glbConfigData.HTML_URL);
	}
}
function openSetting(){
	clearInterval (time);
	PageManager.changePage(OTIDPopup, PageManager.type.NORMAL);
}
function openPreference(){
	BrowserExt.Beep(0);
    var tbxOTID = document.getElementById("tbx_OTID");
    if (!tbxOTID.value) {
        BrowserExt.Beep(1);
        return;
    }
	if(tbxOTID.value == PREFERENCE_PASSWORD){
		PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
	}
	else{
		alert("암호가 일치하지 않습니다.");
	}
}
function cancelPreference(){
	BrowserExt.SetScreenChange("allservice");
}
// image count setting function
function setCount(imgCnt){
	if(glbImageCnt == imgCnt - 1){
		glbImageCnt = 0;
	}else{
		glbImageCnt++;
	}
	/*
	if(glbConfigData.VIEW_MODE == "1"){
		if(glbImageCnt == imgCnt - 1){
			glbImageCnt = 0;
		}else{
			glbImageCnt++;
		}
	}else{
		glbImageCnt = randomNum(0, imgCnt - 1);
	}
	*/
}
function randomNum(min, max){
	var randNum = Math.floor(Math.random()*(max-min+1)) + min;
	return randNum;
}
/**
 * 공통 이벤트 처리 메소드
 * 이곳에 정의 되지 않은 경우 각 페이지에서 이벤트가 처리됨
 * @param {event} event
 * @param {string} id
 */
Common.onLoadEvent = function(event, id)
{
	switch(event){
		case "onbuttonup":
			// Button Up Event
			BrowserExt.Beep(0);
			if(id.indexOf("btn_MP_func_") != -1){
				var idArray= id.split("_");
				var _idx = idArray[3];
				id = "btn_MP_func";
			}
			switch(id)
			{
				// 10 Key button Event
				case "btn_num_key0":
				case "btn_num_key1":
				case "btn_num_key2":
				case "btn_num_key3":
				case "btn_num_key4":
				case "btn_num_key5":
				case "btn_num_key6":
				case "btn_num_key7":
				case "btn_num_key8":
				case "btn_num_key9":
					break;
				case "btn_mul_key":	// * Clear
					break;
				case "btn_sharp_key": // # Backspace
					break;
				default:
			}
			break;
		case "onhardkeydown":
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_START:
					break;
				case BrowserExt.keyCode.FX_VK_PAUSE:
					break;
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
					if (flg_Dummy_Beep) {
						return;
					}
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
	}
}
function loadScript(loc){
	var tag = document.createElement("script");
	tag.setAttribute("type", "image/javascript");
	tag.setAttribute("src", loc);
	tag.setAttribute("charset", "UTF-8");
	document.getElementsByTagName("head")[0].appendChild(tag);
};
/**
 * Title의 Text와 Icon을 설정
 */
Common.displayTitleArea = function()
{
	Common.setImage("icn_TB_logo", Img.TOP_BAR_LOGO_ICON);
	Common.setImage("icn_TB_trayStatus_0", Img.TOP_BAR_TRAY_000_ICON);
	Common.setImage("icn_TB_trayStatus_1", Img.TOP_BAR_TRAY_000_ICON);
	Common.setImage("icn_TB_trayStatus_2", Img.TOP_BAR_TRAY_000_ICON);
	Common.setImage("icn_TB_trayStatus_3", Img.TOP_BAR_TRAY_000_ICON);
	Common.setText("lbl_TB_csTitle", glbConfigData.BAR_TITLE);
	Common.setText("lbl_TB_traySize_0", Msg.TOP_BAR.DEFAULT_SIZE);
	Common.setText("lbl_TB_traySize_1", Msg.TOP_BAR.DEFAULT_SIZE);
	Common.setText("lbl_TB_traySize_2", Msg.TOP_BAR.DEFAULT_SIZE);
	Common.setText("lbl_TB_traySize_3", Msg.TOP_BAR.DEFAULT_SIZE);
};

/**************************************************************** 共通 ****************************************************************/
/**
 * 화면 Object의 문자열 표시 처리
 * @param {string} id :Object의 ID
 * @param {string} string :표시할 문자열
 */
Common.setText = function(id, str)
{
	var textNode
	if(typeof id === String||typeof id === "string"){
		textNode = document.getElementById(id);
		if(!textNode || str == undefined){
			alert("id=" + id + " : string=" + str);
			return;
		}
	}
	else if(typeof id === Object){
		textNode = id;
	}
	else{
		return;
	}
	switch(textNode.nodeName.toLowerCase())
	{
		case "div":
		case "textarea":
		case "option":
		case "span":
		case "p":
			while(textNode.firstChild){
				textNode.removeChild(textNode.firstChild);
			}
			if(str instanceof Array)
			{
				var tmp;
				for(var i = 0, il = str.length; i < il; i++)
				{
					tmp=document.createElement("p");
					tmp.innerHTML=str[i];
					textNode.appendChild(tmp);
				}
			}
			else
			{
				textNode.appendChild(document.createTextNode(str));
			}
			break;
		case "input":
			//textNode.setAttribute("value",str);
			textNode["value"] = str;				//textbox의 값 갱신 오류 대응
			break;
		default:
			break;
	}
};

/**
 * 화면 Object의 Image표시 처리
 * @param {string} id : Object ID
 * @param {string} src : Image의 Hendle
 */
Common.setImage = function (id, src)
{
	var imgNode = document.getElementById(id);
	if(!imgNode || !src || imgNode.src == src){
		alert("id=" + id + " : src=" + src);
		return;
	}
	imgNode.setAttribute("src", src);
};

/**
 * Text를 취득 한다.
 * @param {string} id : Text를 취득하는 Object ID
 * @return {string} : 지정된 ID의 Text
 */
Common.getText = function (id)
{
	var obj = document.getElementById(id);
	if(!obj || !id){
		return;
	}
	return obj.firstChild.nodeValue;
};

/**
 * 화면 Object의 Text Color변경 처리<br>
 * Off의 경우, #000000지정
 * disable의 경우, #ADAAAD지정
 * @param {string} id : Object의 ID
 * @param {string} color : Text의 Color
 */
Common.setTextColor = function(id, color)
{
	if(!id || !color){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		obj.style.color = color;
	}
};

/**
 * Object의 표시/비표시를 처리
 * @param {string} id : 표시를 변경하는 Object ID
 * @param {string} attr : display를 지정하는 문자열(none, block)
 */
Common.changeVisibility = function(id, attr)
{
	var obj = document.getElementById(id);
	if(!id || !attr || !obj){
		return;
	}
	if(obj.style.display != attr) {
		obj.style.display = attr;
	}
};

/**
 * HTML Element를 작성
 * @param {string} tag : Tag명
 * @param {object} attrs: Teg에 할당된 속성
 * @return 작성된 Tag의 Element
 */
Common.getNewElement = function(tag,attrs)
{
	var result = null;
	if(tag)
	{
		result=document.createElement(tag);

		if(attrs.id){	result.setAttribute("id",attrs.id);	}
		if(attrs.className){	result.setAttribute("class",attrs.className);	}
	}
	return result;
};

/**
 * Event를 할당한다.（사용되지 않고 있다)
 * @param {string} id : Tag ID
 * @param {string} eventName : Event의 종류
 * @param {event} event : 할당된 Event
 */
Common.setEvent=function(id,eventName,event)
{
	var obj=document.getElementById(id);
	if(obj&&eventName&&event){
		if(obj.attachEvent)obj.attachEvent(eventName,event);
		else if(obj.addEventListener)obj.addEventListener(eventName,event,false);
	}
};

/**
 * 문자열의 Bytes수를 계산한다.
 * @param {string} str : 문자열
 * @return {int} cnt : 문자열의 Byte수(반각 기준)
 */
//Common.getStringByteNumber=function(str)
Common.getStringSize = function(str)
{
	var cnt = 0;
	var c;
	for(var i=0; i<str.length; i++){
		c = str.charCodeAt(i);
		//Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
		//Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
		if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
			cnt++;
		}else{
			cnt += 2;
		}
	}
	return cnt;
};

/**
 * 지정된 문자열을 잘라 문자열을 분할 한다.
 * @param {string} str : 문자열
 * @param {int} num : 잘라낼 문자열 Bytes수
 * @return {array} strArray : 분할한 문자열 배열
 */

Common.splitString=function (str, num, cnt)
{
	var strArray = [];
	var tmp = [];

	var nowByte = 0;
	var i = 0,iMax=str.length;
	var c;

	var step=0;
	for(i=0;i<iMax;i++){
		c = str.charCodeAt(i);
	//while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step < num)		//이하의 내용일 경우
		{
			//문자열을 Copy
			//tmp[tmp.length] = str.substr(i++, 1);
			tmp[tmp.length] = str.substr(i, 1);
			nowByte+=step;
		}
		else if(nowByte+step == num)	//상한에 도달한 경우
		{
			//문자열을 Copy
			//tmp[tmp.length] = str.substr(i++, 1);
			tmp[tmp.length] = str.substr(i, 1);
			nowByte+=step;
			//문자열을 격납하고, tmp를 초기화
			strArray[strArray.length] = tmp.join("");
			tmp = [];
			nowByte = 0;
		}
		else if(nowByte+step > num)	//상한을 초과하는 경우
		{
			//문자열을 격납하고, tmp를 초기화
			strArray[strArray.length] = tmp.join("");
			tmp = [];
			nowByte = 0;

			//문자열을 Copy
			//tmp[tmp.length] = str.substr(i++, 1);
			tmp[tmp.length] = str.substr(i, 1);
			nowByte+=step;
		}
	}

	if(tmp.length > 0){
		strArray[strArray.length] = tmp.join("");
	}
	tmp = null;

	if(cnt&&strArray.length<cnt)
	{
		for(var i=strArray.length;i<cnt;i++)
		{
			strArray[i]="";
		}
	}
	return strArray;
};

Common.splitStr = function (str, chunkSize){
	var chunks = [];
	while (str) {
	    if (str.length < chunkSize) {
	        chunks.push(str);
	        break;
	    }
	    else {
	        chunks.push(str.substr(0, chunkSize));
	        str = str.substr(chunkSize);
	    }
	}
	return chunks;
};

Common.getIdx=function(id){return parseInt(id.substring(id.length, id.length-1));};

/**
 * 문자의 폭을 판단한다.
 * @param {string} c : 문자열
 * @return {bool} true: 전각, false:반각
 */
Common.isEmSizeCharacter = function(c)
{
	var width = true;
	//Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
	//Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
	if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
		width = false;
	}
	return width;
};

/**
 * 문자열을 지정된 Bytes수로 자른다
 * @param {string} str : 문자열
 * @param {int} bytes : 잘라낼 Bytes수
 * @return {string} : 지정 Bytes수로 잘라낸 문자열
 */
Common.cutStringWidth = function(str, num)
{
	var tmp = [];

	var nowByte = 0;
	var i = 0;
	var c;

	var step=0;
	while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step <= num)
		{
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte += step;
		}
		else
		{
			break;
		}
	}
	return tmp.join("");
};

/**
 * List에서 Index를 반환 /Lib문제로 Prototype대신 별도의 Function으로 작성
 * @param {Array} collection
 * @param {object} obj
 * @return {int} idx : 대상이 없는 경우는 -1
 */
Common.indexOf = function(collection,obj)
{
	var idx = -1;
	if(collection instanceof Array)
	{
		for(var i = 0,il = collection.length; i < il; i++)
		{
			if(collection[i] == obj)
			{
				idx=i;
				break;
			}
		}
	}
	return idx;
};

Common.contains = function(collection,obj){
	return (this.indexOf(collection,obj) > -1);
};

/**
 * 해당 Element의 CSS Class를 설정
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 해당하는 Class의 이름
 */
Common.setClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		obj.className = arg;
	}
};

Common.getClassList = function(obj){
	return obj.className.split(" ");
};

Common.setClassList = function(obj, lst){
	obj.className = lst.join(" ");
};

/**
 * 해당 Element의 CSS Class를 추가
 * @param {string} id : 추가할 Object의 ID
 * @param {string} arg : 추가된 Class의 이름
 */
Common.addClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		if(obj.classList) {
			obj.classList.add(arg);
		}
		else{
			var lst = Common.getClassList(obj);
			var idx = Common.indexOf(lst, arg);
			if(idx == -1) {
				lst.push(arg);
				Common.setClassList(obj, lst);
			}
		}
	}
};

/**
 * 해당 Element의 CSS Class를 제거
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 제거된 Class의 이름
 */
Common.removeClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		if(obj.classList){
			obj.classList.remove(arg);
		}
		else{
			var lst = Common.getClassList(obj);
			var idx = Common.indexOf(lst, arg);
			while(idx > -1) {
				lst.splice(idx, 1);
				idx = Common.indexOf(lst, arg);
			}
			Common.setClassList(obj, lst);
		}
	}
};
/**
 * 해당 Element의 CSS Class를 Toggle
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : Toggle된 Class의 이름
 */
Common.toggleClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		obj.classList2.toggle(arg);
	}
};


Common.compareStr = function(strInput, strOutput)
{
	var i;
	for( i = strOutput.length, il = 0; i > il; --i) {
		if(strInput[i] == strOutput[i]) {
			break;
		}
	}
	return i+1;
};

Common.trimByEncodingSize = function(str, size)
{
	var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
	var trimedStr = encodedStr.substr(0, size)
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult)
};
Common.getDecode = function(str)
{
	var result;
	try
	{
		result = decodeURIComponent(str);
	}
	catch(ex)
	{
		var pattern = /%[^%]+$/;
		var trimStr = str.replace(pattern,'');
		result = Common.getDecode(trimStr);
	}
	return result;
};

Common.trimEncodedString = function(str, length)
{
	var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
	var trimedStr = encodedStr.substr(0, length)
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult)
};

/**
 * Page를 Click할 때의 Event/현재의 Page의 OnPageClick Event
 */
function onPageClick()
{
	var currentPage = PageManager.getCurrentPage();
	if(currentPage){
		if(currentPage.onPageClick)currentPage.onPageClick();
	}
};

/**
 * Object가 Null 또는 Empty상태일 때의 판별
 */
Common.isNullOrEmpty = function(obj){
	var result = false;
	switch(typeof obj){
		case "undefined":
			result = true;
			break;
		case "object":
			if(obj === null){
				result = true;
			}
			break;
		case "string":
			if(obj === null || obj === ""){
				result = true;
			}
			break;
		default:
			//console.log(obj);
			break;
	}
	return result;
};

Common.removePrefix = function(str){
	var pattern = /([^:]+)$/;
	var result = str.match(pattern);
	return result[1];
};

// Changes XML to JSON
Common.xmlToJson = function(xml)
{
	// Create the return object
	var obj = {};
	// do children
	if (xml.hasChildNodes()) {
		for (var i = 0, iMax = xml.childNodes.length; i < iMax; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = this.removePrefix(item.nodeName);
			if (item.nodeType == 1) {//object
				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = this.xmlToJson(item);
				}
				else {
					if (typeof (obj[nodeName].length) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
						obj.flg=true;
					}
					obj[nodeName].push(this.xmlToJson(item));
				}
			}
			else if (item.nodeType == 3) {// text
				obj = item.nodeValue;
			}
		}
		if(obj.flg == true){
			var old = obj[nodeName];
			obj = old;
		}
	}
	return obj;
};

Common.getIndex = function(collection,_value){
	var idx = -1;
	var tmp;
	for(var i = 0, iMax = collection.length; i < iMax; i++){
		tmp = collection[i];
		if(tmp.value == _value){
			idx = i;
			break;
		}
	}
	return idx;
};

Common.getKey = function(collection,_value){
	var key = "";
	var tmp;
	for(var i = 0, iMax = collection.length; i < iMax; i++){
		tmp = collection[i];
		if(tmp.value == _value){
			key = tmp.key;
			break;
		}
	}
	return key;
};

Common.setIndex = function(_id,_idx){
	var obj = document.getElementById(_id);
	if(obj && obj.tagName.toLowerCase() == "select"){
		obj.selectedIndex=_idx;
	}
};

Common.replaceStrAtArray = function(_collection,_key,_value){
	var _result = new Array(_collection.length);
	for(var i = 0, iMax = _collection.length, _msg; i < iMax; i++){
		_result[i] = _collection[i].replace(_key,_value);
	}
	return _result;
};

Common.setPosition = function(id, margin, arg)
{
	if(!id || !margin){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		switch(margin){
			case 'left':
				obj.style.left = arg;
				break;
			case 'right':
				obj.style.right = arg;
				break;
			case 'top':
				obj.style.top = arg;
				break;
			case 'bottom':
				obj.style.bottom = arg;
				break;
			case 'width':
				obj.style.width = arg;
				break;
			case 'height':
				obj.style.height = arg;
				break;
			default:
				break;
		}
	}
};

/**
 * 화면 Object의 enable, disable처리
 * @param id {string} : Object의 ID
 * @param enable {boolean} true:enable한다, false:disable한다.
 */
Common.setObjectEnable = function(id, enable){
	if(!id){
		return;
	}
	if(enable){
		WidgetLib.setWidgetStatus(id, {enable:true});
	}else{
		WidgetLib.setWidgetStatus(id, {enable:false});
	}
};

// 서버 주소 동작 확인
function checkUrl(url, type){
	var method = "HEAD";
	if(type == "HEAD"){
		method = "HEAD";
	}else{
		method = "GET";
	}
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.onreadystatechange = checkedUrlEvent["checkUrl"];
	xhr.send();
}
var checkedUrlEvent = {
	checkUrl: function(){
		
		if (this.readyState == 4){
			if (this.status == 200){

			} else{
				//alert("서버와 연결이 안됩니다. \n관리자에 문의해주세요.\n메뉴페이지로 이동합니다.");
				//BrowserExt.SetScreenChange("menuto:native_menu");
				clearInterval (time);
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
			}
		}else{
			if(this.status != 200){
				clearInterval (time);
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
			}
		}
	}
}
