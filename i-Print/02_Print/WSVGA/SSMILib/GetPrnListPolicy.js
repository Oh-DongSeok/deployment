SSMILib.PrnListPolicy = function()
{
	this.userId = "";
	this.deviceIp = "";
	this.wsIp = "";
};
/**
 * @fileoverview デバイスのボックス文書を取得または削除するためのクラス定義<br>
 * デバイスのボックス文書を取得に関して以下のメソッドを提供する<br>
 * GetPrnListPolicy<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.2.0
 * @lang ja
 */
/**
 * @private
 */
Extend(SSMILib.PrnListPolicy.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.PrnListPolicy.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	xml.nss.nss = [];//namespace초기화	

	var soapNS="http://schemas.xmlsoap.org/soap/envelope/";
	var webNS="http://webservice.print.mfd.anyguard.fujifilm.com/";
	
	xml.addNSPrefix(soapNS, "soapenv");
	xml.addNSPrefix(webNS, "web");
	
	var sdNode = xml.createElement("web:" + this.type );
	
	xml.addNSDeclaration(soapNS, root, true);
	xml.addNSDeclaration(webNS, root, true);
	
	var itNode = xml.createElement("userId");
	itNode.appendChild(xml.createTextNode(this.userId));
	sdNode.appendChild(itNode);
	
	itNode = xml.createElement("deviceIp");
	itNode.appendChild(xml.createTextNode(this.deviceIp));
	sdNode.appendChild(itNode);

	itNode = xml.createElement("wsIp");
	itNode.appendChild(xml.createTextNode(this.wsIp));
	sdNode.appendChild(itNode);

	body.appendChild(sdNode);
	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * ボックス文書の情報を取得する<br>
 * 取得に成功すると、文書の情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「01-01 SESAMi Service Management Interface Specification.doc」を参照
 * @param	{SSMILib.GetPrnListPolicy}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.GetPrnListPolicy}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetPrnListPolicy = function(sdObj, timeout, remoteHost)//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
{
	//SmartUI 2.0 Enhance 2015.05 Start
	//var url = glbConfig.remoteHost + "GetPrnListPolicy";
	var url = remoteHost + "GetPrnListPolicy";//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
	var data = JSON.stringify(sdObj);
	var req = createXMLHttpRequest();

	req.open("POST", url, true);
	if(timeout){
		req.timeout = timeout;
		req.ontimeout = SSMILib.GetPrnListPolicy.gsdErrorCb;
	}
	req.setRequestHeader("Content-Type", "text/plain");
	req.send(data);
	req.onreadystatechange = function(){
        if(this.readyState === 4){
        	if(this.status === 200){
        		var resObj = JSON.parse(req.responseText);
        		if(resObj.result && resObj.result.prnList){
        			SSMILib.onEvent("GetPrnListPolicy", true, resObj);
        		}else{
        			SSMILib.GetPrnListPolicy.gsdErrorCb();
        		}
	        }else{
	        	SSMILib.GetPrnListPolicy.gsdErrorCb();
	        }
        }
    };
	//SmartUI 2.0 Enhance 2015.05 End
};

/**
 * @private
 */
SSMILib.GetPrnListPolicy.gsdSuccessCb = function(res)
{
	KISUtil.debug("GetPrnListPolicy/gsdSuccessCb", res.responseText);
	try{
		var msg = Common.splitStr(res.responseText, 62);
		for (var i in msg) {
			LogLib.write(msg[i], LogLib.LEVEL.DBG);			//2014/06/13 son.ch Log확인용 코드
		}
	}
	catch(e){
		LogLib.write("[CS] exception catched", LogLib.LEVEL.DBG);
	}
	
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("GetPrnListPolicy", _result, null);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("return");
		//_gsdrNode : GetPrnListPolicyResult
	if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
		resObj = Common.xmlToJson(_gsdrNode[0]);
		//prnlist가 배열이 아닌 케이스 보정
		var _lst = resObj.result.prnList;
		if(_lst){
			if(typeof _lst.length == "undefined" && typeof _lst.Prn == "object"){
				var _backup = extendDeep({},_lst.Prn);
				_lst = [];
				_lst.push(_backup);
				resObj.result.prnList = _lst;
			}
			_result = true;
		}
	}

	SSMILib.onEvent("GetPrnListPolicy", _result, resObj);
};

/**
 * @private
 */
//SmartUI 2.0 Enhance 2015.05 Start
SSMILib.GetPrnListPolicy.gsdErrorCb = function()
{
	SSMILib.onEvent("GetPrnListPolicy", false, null);
}
//SmartUI 2.0 Enhance 2015.05 End