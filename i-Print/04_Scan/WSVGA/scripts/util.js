/**
 * 사용되는 경우
 * 스캔잡 종료타이밍
 * 프린트잡 종료타이밍
 * 이전처럼 무작정 기다리는 케이스는 없음(추후 대응)
 */
var JobMonitor = (function(){
    var EVENT_NAME="GetJob",
    	_jobFound,
    	_jobID,
    	_jobObj,
    	_jobInfo,
    	_jobType, //2016.08.30 KIS Chone 카피/프린트 환불 관련 대응
    	_continuePooling,
    	_poolingCnt,
    	_poolingTerm = 500,
    	isEventAttached,
    	_successCallback,
    	_errorCallback,
    	_timeoutCallback,
    	_cancelCallback,
    	_foundCallback,
    	_eventOrigin;

    return {
        init: function(term){
        	//console.log("[init]");
        	_init(term);
        },
        startMonitor : function(jobObj,cnt){
        	//console.log("[startMonitor]");
            _startMonitor(jobObj,cnt);
        },
        stopMonitor : function(jobObj){
        	//console.log("[stopMonitor]");
            _stopMonitor(jobObj);
        },
        getJobInfo : function(uuid){
        	//console.log("[getJobInfo]");
        	_doPooling({uuid:uuid});
        }
    };

    function _init(term){
		//console.log("_init");
        //SSMILib....이벤트 후킹로직 추가
        //_jobInfos = {};
        _jobFound = false;
        _isPoolingMode=false;
    	isEventAttached = false;
        _setPoolingTerm(term);
        _attachEventHandler();
    }
    function _setPoolingTerm(term){
		//console.log("_setPoolingTerm");
    	_poolingTerm = term||500;
    }
    function _attachEventHandler(){
		//console.log("_attachEventHandler");
    	if(!isEventAttached){
	        isEventAttached = true;
			_eventOrigin = SSMILib.listener; 
			SSMILib.listener = function(event, result, obj){
				//try{
					if(!_onSSMIEvent(event, result, obj)){
						_eventOrigin(event, result, obj);
					}
				//}
				//catch(ex){
				//	console.log(ex);
				//}
			};
    	}
    }
    function _onSSMIEvent(event, result, obj){
		if(event == "GetJob"){
			if(result){
				if (obj && _jobID == obj.JobID) {
					KISUtil.debug("_onSSMIEvent","# "+obj.JobID + "/" + obj.Status);
					if(!_jobFound){
						_jobFound = true;
				    	if(_foundCallback) _foundCallback(); 	
					}
					switch(obj.Status){
						case "completed":
							if(_successCallback) _successCallback();
							break;
						case "completedWithError":
						case "completedWithWarning":
							if(_errorCallback)_errorCallback();
							_stopMonitor(obj);
							break;
						case "canceled":
						case "canceledByUser":
						case "canceledBySystem":
						//case "paused":
						//case "unknown":
						//case "pending":
						case "terminating":
							if(_jobType != 'print'){//2016.08.30 KIS Chone 카피/프린트 환불 관련 대응, Scan을 canceled 했을 경우는 기존 동작 처리
								if(_cancelCallback)_cancelCallback();
								_stopMonitor(obj);
								return;
							}

							//2016.08.30 KIS Chone 카피/프린트 환불 관련 대응
							if(_jobType == 'print'){
								_stopMonitor(obj);
								LogLib.write("[CS] job Type : print, job status : " + obj.Status, LogLib.LEVEL.INF);
								//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
								//Common.doCopyRefundReq(obj.Status);
								Common.displayCopyRefundPopup(obj.Status);
							}
							break;
						case "processing":
							if(_jobID) setTimeout("JobMonitor.getJobInfo('"+_jobID+"');",_poolingTerm);
							break;
						//case "paused"://2016.08.30 KIS Chone 카피/프린트 환불 관련 대응
						case "other":
						default:
							_poolingCnt--;
							if(_jobID) setTimeout("JobMonitor.getJobInfo('"+_jobID+"');",_poolingTerm);
							break;
					}
				}
				else{

				}
			}
			else{
				KISUtil.debug("_onSSMIEvent","# "+obj.JobID + "/result:" + result);
		    	if(_timeoutCallback) _timeoutCallback();
			}
			return true;
		}
		else{
			return false;
		}
		function getKeies(obj){
			var result=[];
			for(var i in obj){
				result[result.length] = i;
			}
			return result;
		}
		function _onComplete() {
			alert("complete");
		}

		function _onError() {
			alert("error");
		}
	}
    
    function _dettachEventHandler(){
		//console.log("_dettachEventHandler");
    	if(isEventAttached){
	        isEventAttached = false;
			SSMILib.listener = _eventOrigin; 
    	}
    }
    function _startMonitor(jobObj,_cnt){
		//console.log("_startMonitor");
		_successCallback = jobObj.successCallback;
		_errorCallback = jobObj.errorCallback;
		_cancelCallback = jobObj.cancelCallback;
		_jobType = jobObj.type; //2016.08.30 KIS Chone 카피/프린트 환불 관련 대응
		if(_registJobInfo(jobObj)&&!_isPoolingMode){
       		_jobFound = false;
			_poolingCnt = 1300;
        	_isPoolingMode = true;
            _doPooling(jobObj);
        }
    }
    function _stopMonitor(jobObj){
		//console.log("_stopMonitor");
		//console.log(jobObj);
        if(_unregistJobInfo(jobObj)){
	        _isPoolingMode=false;//_stopJobPooling();
        }
        _successCallback = null;
		_errorCallback = null;
		_cancelCallback = null;
	}
    function _clearMonitor(){
		//console.log("_attachEventHandler");
    	_jobID = null;
    	_jobObj = null;
    	_jobInfo = null;
		_isPoolingMode=false;
    }
    function _registJobInfo(jobObj){
		//console.log("_registJobInfo");
        if(!!_jobID){
        	//console.log("점유되어있음:"+_jobID);
        	return false;
        }
        else{
            _jobID = jobObj.uuid;
            _jobObj = jobObj;
            return true;
        }
    }
    function _unregistJobInfo(jobObj){
		//console.log("_unregistJobInfo");
        if(jobObj.uuid && _jobID == jobObj.uuid){
        	_jobID = null;
        	_jobObj = null;
        	_jobInfo = null;
        	return true;
        }
        return false;
    }
    function _doPooling(_jobObj){
		//console.log("_doPooling");
       	if(_poolingCnt>0){
	        if(!_jobInfo) {
	        	_jobInfo = new SSMILib.JobInfo(_jobObj.uuid, true);
				//jobObj.listType = 'active';
        	}
	        SSMILib.GetJob(_jobInfo);
		}
    	else{
    		//send timeout
			if(_errorCallback)_errorCallback();
			_stopMonitor(_jobObj);
    	}
    }
})();

/**
 * スピーナオブジェクト（汎用）
 * ボタンによる値の増減や
 * ボタン押下し続けることで加速
 * キー入力による値のセット
 * 入力制限指定可能
 */
function Spinner(arg)
{
	this.key=arg.key;
	this.number=arg.number;
	this.min=arg.min;
	this.max=arg.max;
	this.intervalObj={};
	this.intervalTime=200;
	this.count=0;
	this.btnId=arg.btnId;
	this.labelId=arg.labelId;
	this.btnUpId=arg.btnUpId;
	this.btnDnId=arg.btnDnId;
	this.hardKeyInput=false;
	this.focused=false;
	this.unitStr = (arg.unitStr)?arg.unitStr:"";
	this.callback=extendDeep(arg.callback,{
		min:function(){
			//console.log("min");
		},
		max:function(){
			//console.log("max");
		},
		inputHardkeyMax : function(){
			//console.log("inputHardkeyMax");
		},
		onChange:function(){
			//console.log("onChange");
		}
	});
	if(this.callback.onChange) this.callback.onChange(this.number);
}

/**
 * 一定時間ごとのイベント発生による増減処理用
 */
Spinner.prototype.onProcess=function(type){
	//console.log("spinner.onProcess");
	if(++this.count==10)
	{
		clearInterval(this.intervalObj);
		this.intervalTime=20;
		this.intervalObj=setInterval(this.key+'.onProcess("'+type+'")',this.intervalTime);
	}
	if(type=="up")
	{
		if(this.max>this.number)
		{
			this.number++;
		}
		else
		{
			//clearInterval
			BrowserExt.Beep(1);
			this.callback.max();
			this.mouseUp();
		}
	}
	else if(type=="dn")
	{
		if(this.min<this.number)
		{
			this.number--;
		}
		else
		{
			//clearInterval
			BrowserExt.Beep(1);
			this.callback.min();
			this.mouseUp();
			this.number = this.min;
		}
	}
	this.focused=true;
	if(this.callback.onChange) this.callback.onChange(this.number);
	this.updateDisplay();
	//this.updateData();
};

/**
 * 値をクリアする（ハードキーのクリアキー対応）
 */
Spinner.prototype.clear=function(num,isForced)
{
	//console.log("spinner.clear");
	BrowserExt.Beep(0);
	this.number=num;
	if(isForced&&this.callback.onChange) this.callback.onChange(this.number);
	this.updateDisplay();
	//this.updateData();
};

/**
 * 全域データに現在の値をセット
 */
//Spinner.prototype.updateData=function()
//{
//	glbDataSet.centerErase=this.number;
//};

/**
 * 調整ボタン押下処理
 * 押下処理（値変更/ビープ音）
 * イベント登録（mouseUp時まで繰り返して実行）
 */
Spinner.prototype.mouseDown=function(type){
	//console.log("spinner.mouseDown");
	//setInterval
	BrowserExt.Beep(0);
	this.onProcess(type);
	this.intervalObj=setInterval(this.key+'.onProcess("'+type+'")',this.intervalTime);
};

/**
 * 調整ボタン押上処理
 * 繰り返して実行イベントを解除
 */
Spinner.prototype.mouseUp=function(){
	//console.log("spinner.mouseUp");
	//clearInterval
	if(!this.intervalObj)
	{
		return;
	}
	clearInterval(this.intervalObj);
	this.intervalObj=null;
	this.intervalTime=200;
	this.count=0;
	this.hardKeyInput=false;
	this.focused=true;
};

/**
 * 表示の更新
 * ボタン/数値ラベル
 */
Spinner.prototype.updateDisplay=function()
{
	//console.log("spinner.updateDisplay");
	Common.setText(this.labelId,this.number + this.unitStr);
	WidgetLib.setWidgetStatus(this.btnId,{on:this.focused});
	var status =[true,true];
	if((this.min>=this.number && !this.hardKeyInput) || this.number==0)
	{
		status[1]=false;
		
	}
	else if(this.max<=this.number)
	{
		status[0]=false;
	}
	WidgetLib.setWidgetStatus(this.btnUpId,{enable:status[0]});
	WidgetLib.setWidgetStatus(this.btnDnId,{enable:status[1]});
	
	var btnUpObj=document.getElementById(this.btnUpId);
	var btnDnObj=document.getElementById(this.btnDnId);

	if(btnUpObj&&!status[0]) {
		btnUpObj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', '"+this.btnUpId+"')");
	}else{
		btnUpObj.setAttribute("onmouseup","");
	}
	//else if(btnUpObj.onmouseup!=null)  btnUpObj.removeAttribute("onmouseup");
	if(btnDnObj&&!status[1]){
		btnDnObj.setAttribute("onmouseup","Common.onLoadEvent('ondisablekeydown', '"+this.btnDnId+"')");
	}else{
		btnDnObj.setAttribute("onmouseup","");
	}
	//else if(btnDnObj.onmouseup!=null)  btnDnObj.removeAttribute("onmouseup");
};

/**
 * 数値ラベルの選択状態変更用
 * @param {boolean} status
 */
Spinner.prototype.changeFocus=function(status)
{
	//console.log("spinner.changeFocus");
	this.focused=status;
	this.hardKeyInput=false;
};

/**
 * ハートキー入力対応
 * @param {int} num 入力値
 */
Spinner.prototype.inputHardKey=function(num)
{
	//console.log("spinner.inputHardKey");
	var minNum = this.min;
	var maxNum = this.max;
	var nowNum = this.number;
	var len = nowNum.toString().length;
	var len2 = maxNum.toString().length;
	var setNum = 0;
	
	if(this.hardKeyInput){
		if(len<len2)
		{
			setNum = nowNum * 10 + num;
			if(setNum>maxNum)
			{
				//setMax
				setNum=maxNum;
				BrowserExt.Beep(1);
				this.callback.inputHardkeyMax();
			}
			else
			{
				BrowserExt.Beep(0);
			}
		}
		else if(len==len2)
		{
			setNum = maxNum;
			BrowserExt.Beep(1);
			this.callback.inputHardkeyMax();
		}
		else
		{
			BrowserExt.Beep(1);
			this.callback.inputHardkeyMax();
			return;
		}
	}
	else
	{
		if(num == 0&&this.min !== 0){
			BrowserExt.Beep(1);
			return;
		}
		setNum = num;
		this.hardKeyInput = true;
		BrowserExt.Beep(0);
	}
	
	this.number=setNum;
	if(this.callback.onChange) this.callback.onChange(this.number);
	this.updateDisplay();
	//this.updateData();
};

/**
 * 日付にパターンを適用するためDateを拡張する。
 * @param {string} pattern 日付の形式
 */
Date.prototype.format = function(pattern)
{
	if (!this.valueOf()) return "";

	var d = this;

    return pattern.replace(/(yyyy|yy|MM|dd|hh|mm|ss|fff|a\/p)/gi, 
    	function(token){
	        switch(token){
	            case 'yyyy': 	return d.getFullYear();
	            case 'yy': 		return (d.getFullYear() % 1000).zf(2);
	            case 'MM': 		return (d.getMonth() + 1).zf(2);
	            case 'dd': 		return d.getDate().zf(2);
	            case 'HH': 		return d.getHours().zf(2);
	            case 'hh': 		return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case 'mm': 		return d.getMinutes().zf(2);
	            case 'ss': 		return d.getSeconds().zf(2);
	            case 'fff': 		return d.getMilliseconds().zf(3);
	            case 'a/p': 	return d.getHours() < 12 ? 'AM' : 'PM';
	            default: 		return token;
	        }
    	}
    );
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

/**
 * 親Windowのスクリプトをを実行
 */
function excuteToParent(funcName,param)
{
	if(typeof funcName != "string") return;
	//if(flg_Dummy_Beep) return param;
	var func; 
	var nameArr = funcName.split(".");
	func = window.parent;
	for(var i=0;i<nameArr.length-1;i++){
		func = func[nameArr[i]];
		if(typeof func == "undefined"){
			return null;
		}
	}
	//return func[nameArr[nameArr.length-1]].apply(this,param);
	//func.removeService();
	//return (eval("func."+nameArr[nameArr.length-1]))(param);
	return func[nameArr[nameArr.length-1]].apply(func,param);
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