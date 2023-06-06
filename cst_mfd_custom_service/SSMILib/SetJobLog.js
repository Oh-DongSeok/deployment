/**
 * Job Log Set インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class  ボックス文書を扱うためのクラス<br>
 * [POST]/api/interface/Supplies/paper 전달받은 Tray 정보값을 기준으로 DB에 저장
 * @lang ja
 */
/**
 * Creates PrintSelected instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for handling Mailbox documents.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 {
  "logRequest": [
    {
      "id": 0,
      "flag": "string",
      "deviceId": 0,
      "jobType": "string",
      "uuid": "string",
      "terminalId": 0,
      "price": 0,
      "description": "string"
    }
  ]
}
 */
SSMILib.SetJobLog = function()
{
	this.logRequest = new Array();
}
/**
 * @private
 */
Extend(SSMILib.SetJobLog.prototype, XMLLib.SOAPMsg.prototype);

/**
 * ボックス文書の情報を取得する<br>
 * 取得に成功すると、文書の情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「01-01 SESAMi Service Management Interface Specification.doc」を参照
 * @param	{SSMILib.SetJobLog}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.SetTrayInfo}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.SetJobLog = function(sdObj, timeout, remoteHost)//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
{
	//SmartUI 2.0 Enhance 2015.05 Start
	//var url = glbConfig.remoteHost + "PrintSelected";
	var url = remoteHost + "api/interface/settings/Log";
	var data = JSON.stringify(sdObj);
	var req = createXMLHttpRequest();

	req.open("POST", url, true);
	if(timeout){
		req.timeout = timeout;
		req.ontimeout = SSMILib.SetJobLog.gsdErrorCb;
	}
	req.setRequestHeader("Content-Type", "application/json");
	req.send(data);
	req.onreadystatechange = function(){
        if(this.readyState === 4){
        	if(this.status === 200){
        		var resObj = JSON.parse(req.responseText);
        		if(resObj && typeof resObj.status != "undefined"){
        			SSMILib.onEvent("SetJobLog", true, resObj);
        		}else{
        			SSMILib.SetJobLog.gsdErrorCb();
        		}
	        }else{
	        	SSMILib.SetJobLog.gsdErrorCb();
	        }
        }
    };
    //SmartUI 2.0 Enhance 2015.05 End
};

/**
 * @private
 */
SSMILib.SetJobLog.gsdSuccessCb = function(res)
{
	KISUtil.debug("SetJobLog/gsdSuccessCb", res.responseText);
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("SetJobLog", _result);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("return");
		//_gsdrNode : PrintSelectedResult
	if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
		resObj = Common.xmlToJson(_gsdrNode[0]);
		_result = true;
	}

	SSMILib.onEvent("SetJobLog", _result, resObj);
};

/**
 * @private
 */
//SmartUI 2.0 Enhance 2015.05 Start
SSMILib.SetJobLog.gsdErrorCb = function()
{
	SSMILib.onEvent("SetJobLog", false, null);
};
//SmartUI 2.0 Enhance 2015.05 End
