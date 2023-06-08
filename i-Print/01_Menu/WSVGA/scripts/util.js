var ServiceManager = {
	targetFrameId:"",
	targetFrameEle:null,
	currentService:"",
	/**
	 * 서비스 매니저 초기화 
	 */
	init : function(param){
		if(param.targetFrameId && param.targetFrameLyrId){
			this.targetFrameId = param.targetFrameId;
			this.targetFrameLyrId = param.targetFrameLyrId;
			this.targetFrameEle = document.getElementById(this.targetFrameId);
			this.targetFrameEle.seamless = true;
		}
		else{
			//TODO: throw exception();
		}
	},
	/**
	 * 서비스 호출 
	 */
	callService : function(service, arg){
		//파라미터 점검
		//만약 현재 다른 서비스 사용중인경우 에러를 날려줌 
		if(!this.currentService && service) {
			//iframe모드일때
			if(glbConfig.SERVICE_CALL_MODE){
				this.currentService = service.name;
				//Note: jQuery code 배제
				//$("#"+this.targetFrameId).on("load",_onIframeLoadEvent).attr("src",service.url).prev().show();
				//$("#"+this.targetFrameLyrId).show();
				//$("#"+this.targetFrameId).contents().on("load",_onIframeLoadEvent);
				
				var _frame = document.getElementById(this.targetFrameId);
				//setEvent(_frame, "load", _onIframeLoadEvent); //trigger는 서비스에서 하도록 변경
				//setEvent((_frame.contentWindow.document || _frame.contentDocument), "load", _onIframeLoadEvent);
				
				_frame.setAttribute("src",service.url);
				_frame.previousSibling.previousSibling.style.display="block";

				var _lyr = document.getElementById(this.targetFrameLyrId);
				_lyr.style.display="block";
			}
			else{
				var loc = "changeDisplay:URL:" + service.url.replace(/http:/,"http-v5:")+";DISP:0";
				BrowserExt.SetScreenChange(loc);
			}
			if(arg&&arg.successFunc){
				arg.successFunc.apply(this);
			}
		}
		else{
			//TODO: throw exception();
			if(arg&&arg.errorFunc){
				arg.errorFunc.apply(this);
			}
		}
		if(arg&&arg.doneFunc){
			arg.doneFunc.apply(this);
		}
		function _onIframeLoadEvent(){
			//console.log("readyToDisplay");
			//console.log(this);
			//$(this).show().off("load").prev().hide();
			this.previousSibling.previousSibling.style.display="none";
			releaseEvent(this,"load",_onIframeLoadEvent);
			this.style.display="block";
		}
		function setEvent(_obj,_eventName,_event){
			if(_obj.attachEvent)_obj.attachEvent(_eventName,_event);
			else if(_obj.addEventListener)_obj.addEventListener(_eventName,_event,false);
		}
		function releaseEvent(_obj,_eventName,_event){
			if(_obj.detachEvent)_obj.detachEvent(_eventName,_event);
			else if(_obj.removeEventListener)_obj.addEventListener(_eventName,_event,false);
		}
	},
	displayIframe:function(){
		this.targetFrameEle.previousSibling.previousSibling.style.display="none";
		this.targetFrameEle.style.display="block";
	},
	/**
	 * 서비스를 종료함 
	 */
	removeService : function(){
		if(this.currentService){
			Common.changeVisibility(this.targetFrameLyrId,"none");
			//this.targetFrameEle.setAttrubute("src","");
			this.targetFrameEle.removeAttribute("src");
			this.targetFrameEle.style.display = "none";
			//$("#"+this.targetFrameLyrId).hide();
			//$("#"+this.targetFrameId).attr("src","").hide();
			this.currentService="";
		}
	},
	excuteScript:function(func){
		if(flg_Dummy_Beep&&this.targetFrameEle){
			//프래임 내 페이지에서 실행하는 방법
			//with(document.getElementsByTagName("iframe")[0].contentWindow){
			//PageManager.changePage(PrintingPopup , PageManager.type.NORMAL);
			//}
			this.targetFrameEle.contentWindow.eval.apply(this.targetFrameEle.contentWindow,func);
		}
	},
	
	/**
	 * 서비스를 종료함 
	 */
	refreshService : function(){
		if(this.currentService){
			var _frame = document.getElementById(this.targetFrameId);
			_frame.previousSibling.previousSibling.style.display="block";
			_frame.contentWindow.location.reload();
		}
	},
	
	/*function showIframe(){
		//console.log("showIframe");
		$("#iframe4onetouch").css({left:0}).parent().show();
		glbInfo.isOnetouchMode=true;
	}
	function hideIframe(){
		//console.log("hideIframe");
		$("#iframe4onetouch").unbind("load").removeAttr("src").css({left:800}).parent().hide();
		glbInfo.isOnetouchMode=false;
	}*/
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
						.replace(/ss/gi, _arg5);
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
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return '0'.string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/**
 * 子ノードを削除する。
 * @param id 親ノードのID
 */
function removeChildObj(id)
{
	var obj = document.getElementById(id);
	if(obj)obj.innerHTML = "";
}

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
 * 암호화 처리 모듈 (Hash)
 * @param {string} str 암호화 처리할 인수값
 * @return {string} sha256digest 암호화된 Hexa값(SHA-256용)
*/
function SecureManager_Hash(str)
{
	var shaObj = new jsSHA(str, "ASCII");
	var sha256digest = shaObj.getHash("SHA-256", "HEX");//헥사값으로 변환
	return sha256digest;
}

/**
 * 암호화 처리 모듈 
 */
var SecureManager = {
	_solvedKey:null,
	_iv:null,
	init:function(solvedKey, iv){
		this._solvedKey = solvedKey;
		this._iv = iv;
	},
	encrypt:function(obj){
		var tmp;
		for(var j in obj){
			if(obj.hasOwnProperty(j)){
				//if(typeof obj[j] === "object"){
				tmp = obj[j];
				//console.log(JSON.stringify(tmp));
				switch(typeof tmp){
					case "object":
						if(tmp.$super){
							obj[j] = this._encodeMsg(tmp);
						}
						else{
							obj[j]=this.encrypt(tmp);
						}
						break;
					case "boolean":
					case "number":
						tmp = tmp.toString();
					case "string":
						obj[j] = this._encodeMsg(tmp);
						break;
					default:
						//pass
						break;
				}
			}
			else{
				//pass
			}
		}
		return obj;
	},
	decrypt:function(obj){
		var tmp;
		for(var j in obj){
			if(obj.hasOwnProperty(j)){
				//if(typeof obj[j] === "object"){
				tmp = obj[j];
				switch(typeof tmp){
					case "object":
						obj[j] = this.decrypt(obj[j]);
						break;
					case "string":
					case "number":
						obj[j] = this._decodeMsg(tmp);
						break;
					default:
						//pass
						break;
				}
			}
			else{
				//pass
			}
		}
		return obj;
	},/*
	decrypt:function(obj){
		var result="";
		switch(typeof obj){
			case "object":
				result = this._decodeObj(obj);
				break;
			case "string":
			case "number":
				result = this._decodeMsg(obj);
				break;
			default:
				//pass
				break;
		}
		return result;
	},
	_decodeObj:function(obj){
		var result = (obj instanceof Array)?[]:{};
		for(var j in obj){
			if(obj.hasOwnProperty(j)){
				//if(typeof obj[j] === "object"){
				result[j] = this.decrypt(obj[j]);
			}
			else{
				//pass
			}
		}
		return result;
	},*/
	_encodeMsg:function(_msg ){
		var _encoded=CryptoJS.AES.encrypt(_msg, this._solvedKey, {iv:this._iv, blockSize :128, mode: CryptoJS.mode.ECB });
		var  result = _encoded.toString();
		_encoded = null;
		return result;
	},
	_decodeMsg:function(_msg){
		var _decoded=CryptoJS.AES.decrypt(_msg, this._solvedKey, {iv:this._iv, blockSize :128, mode: CryptoJS.mode.ECB });
		var  result = _decoded.toString(CryptoJS.enc.Utf8);
		_decoded = null;
		return result;
	}
};



function xrsReOrganizeKey(keyStr)
{//AES 암호화에 사용할 Key를 추출하는 루틴
	var len = 32;
    var key1 = new Array(len); //Key1 : AES 암호화에 사용할 Key
    var xrsKey = new Array(len);
    //var tmKey1 = decodeBase64(keyStr);
    var tmKey1 = atob(keyStr);
	//KISUtil.debug("tmKey1", getCode(tmKey1));
    if (tmKey1 == null || tmKey1.Length == (len + 40)) {//원하는 키 길이가 아니면 return
		return;
    };
    
    BlockCopy(tmKey1, 35, xrsKey, 0, xrsKey.length);
	//KISUtil.debug("xrsKey", getCode(xrsKey));

	for (var i = 0; i < len; i++) {
        key1[i] = tmKey1.charCodeAt(i) ^ xrsKey[i].charCodeAt(0);
        //KISUtil.debug(i, tmKey1.charCodeAt(i)+" ^ "+xrsKey[i].charCodeAt(0) + " = " + key1[i]);
    };
    return key1;
    
    function BlockCopy(src, srcOffset, tar, tarOffset, leng){
		//console.log(tar);
    	var i = srcOffset, k = tarOffset;
		for ( i = 0; i < leng; i++) {
			tar[tarOffset + i] = src[srcOffset + i];
		}
    }
    function getCode(arr){
    	var lst=[];
    	for(var i=0;i<arr.length;i++){
    		lst[i]=arr[i].charCodeAt(0);
    	}
    	return lst.join();
    }
}

function isScanKeyCheck()
{
	var internalKey = SecureManager_Hash(glbInfo.serialNumber + glbDevInfo.AuditronMode + SERVICE_CODE.SCAN);
	if((glbConfig.chkScanUse)&&(glbConfig.chkScanUse.length >= 64)){
		KISUtil.debug("Setlength=",glbConfig.chkScanUse.length);
		KISUtil.debug("Set=",glbConfig.chkScanUse);
		if(internalKey == glbConfig.chkScanUse){
			glbConfig.isScanUse = true;
			glbConfig.chkScan = internalKey;
			KISUtil.debug("OK=",internalKey);
		}else{
			glbConfig.isScanUse = false;
			KISUtil.debug("NG=",internalKey);
		}
	}else{
		glbConfig.isScanUse = false;
	}
}

function isFaxKeyCheck()
{
	var internalKey = SecureManager_Hash(glbInfo.serialNumber + glbDevInfo.AuditronMode + SERVICE_CODE.FAX);
	if((glbConfig.chkFaxUse)&&(glbConfig.chkFaxUse.length >= 64)){
		KISUtil.debug("Set=",glbConfig.chkFaxUse);
		if(internalKey == glbConfig.chkFaxUse){
			glbConfig.isFaxUse = true;
			glbConfig.chkFax = internalKey;
			KISUtil.debug("OK=",internalKey);
		}else{
			glbConfig.isFaxUse = false;
			KISUtil.debug("NG=",internalKey);
		}
	}else{
		glbConfig.isFaxUse = false;
	}
}

/**
 * 숫자에 컴마를 삽입하는 로직 
 * @param {Object} old
 */
/*(function (old) {
	var dec = 0.12 .toLocaleString().charAt(1),
		tho = dec === "." ? "," : ".";

	if (1000 .toLocaleString() !== "1,000.00") {
		Number.prototype.toLocaleString = function () {
			var neg = this < 0,
			f = this.toFixed(2).slice(+neg);
			return (neg ? "-" : "") + f.slice(0,-3).replace(/(?=(?!^)(?:\d{3})+(?!\d))/g, tho)+ dec + f.slice(-2);
		};
	}
})(Number.prototype.toLocaleString);*/
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