SSMILib.Action = function()
{
	this.aKey="";
 	this.aFunction="";
 	this.aJobList="";
};
/**
 * @fileoverview デバイスのボックス文書を取得または削除するためのクラス定義<br>
 * デバイスのボックス文書を取得に関して以下のメソッドを提供する<br>
 * Action<br><br>
 *
 * @author Copyright(C) 2014 Fuji Xerox Korea Information Service Co., Ltd. All rights reserved.<br>
 * @version 1.2.0
 * @lang ja
 */
/**
 * @private
 */
Extend(SSMILib.Action.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.Action.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	xml.nss.nss = [];//namespace초기화	

	var xsiNS = "http://www.w3.org/2001/XMLSchema-instance";
	var xsdNS = "http://www.w3.org/2001/XMLSchema";
	var soapNS="http://schemas.xmlsoap.org/soap/envelope/";
	
	xml.addNSPrefix(xsiNS, "xsi");
	xml.addNSPrefix(xsdNS, "xsd");
	xml.addNSPrefix(soapNS, "soapenv");
	
	var serviceName = "EPSOFT_SMARTPRINTING_WEBSERVICE";
	//var sdNode=XMLLib.XMLBase.createRootElement(serviceName,this.type);
	var sdNode = xml.createElement(this.type);
	sdNode.setAttribute("xmlns",serviceName);
	//var sdNode = xml.createElementNS(serviceName, this.type);	
	
	var item = xml.createElement("aKey");
	item.appendChild(xml.createTextNode(this.aKey));
	sdNode.appendChild(item);
	
	item = xml.createElement("aFunction");
	item.appendChild(xml.createTextNode(this.aFunction));
	sdNode.appendChild(item);

	item = xml.createElement("aJobList");
	item.appendChild(xml.createTextNode(this.aJobList));
	sdNode.appendChild(item);

	if(!!this.aPrinterIP){
		item = xml.createElement("aPrinterIP");
		item.appendChild(xml.createTextNode(this.aPrinterIP));
		sdNode.appendChild(item);
	}

	xml.addNSDeclaration(xsiNS, root, true);
	xml.addNSDeclaration(xsdNS, root, true);
	xml.addNSDeclaration(soapNS, root, true);

	//body.appendChild(sdNode.documentElement);//namespace문제를 해결하기위하여 우회하여 생성
	body.appendChild(sdNode);
	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * ボックス文書の情報を取得する<br>
 * 取得に成功すると、文書の情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「01-01 SESAMi Service Management Interface Specification.doc」を参照
 * @param	{SSMILib.Action}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.Action}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.DoAction = function(sdObj, timeout)
{
	var _ws = new WebServiceLib.Communicator();

	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.Action.gsdSuccessCb;
	_ws.errorHandler = SSMILib.Action.gsdErrorCb;

	if(timeout){
		_ws.timeout = timeout;
		_ws.timeoutHandler = SSMILib.DoAction.gsdErrorCb;
	}

	var soapAction = "EPSOFT_SMARTPRINTING_WEBSERVICE/xrsAction";
	if(!!CONFIG.PRINTER_IP) soapAction = "EPSOFT_SMARTPRINTING_WEBSERVICE/xrsAction2";
	_ws.soapAction = soapAction;
	_ws.isDeviceReq = true;

	var _targetURL = glbConfig.SERVER_URL;

	if (SSMILib.dummy) {
		var _docBox = null;
		//TODO Need to define dummy data
		SSMILib.onEvent("Action", true, _docBox);
		return;
	}
	var _sdObj = sdObj || new SSMILib.Action();

	_sdObj.type = "xrsAction";
	if(!!CONFIG.PRINTER_IP) _sdObj.type = "xrsAction2";
	
	var _msg = _sdObj.serializeToString();
	KISUtil.debug("Action/send",_msg);
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.Action.gsdSuccessCb = function(res)
{
	KISUtil.debug("Action/gsdSuccessCb", res.responseText);
	try{
		var msg = Common.splitStr(res.responseText, 62);
		for (var i in msg) {
			//LogLib.write(msg[i], LogLib.LEVEL.DBG);
		}
	}
	catch(e){
		//LogLib.write("[CS] exception catched", LogLib.LEVEL.DBG);
	}
	
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("Action", _result, null);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("xrsActionResult");
	if(!!CONFIG.PRINTER_IP) _gsdrNode = res.responseXML.getElementsByTagName("xrsAction2Result");
		//_gsdrNode : Action Result
	//if(_gsdrNode.length > 0 && _gsdrNode[0].hasChildNodes()){
	if(_gsdrNode.length > 0 && _gsdrNode[0]){
		_result = true;
		resObj = Common.xmlToJson(_gsdrNode[0]);
		if(typeof resObj !== "string") resObj="";			//empty케이스 보정
	}

	SSMILib.onEvent("Action", _result, resObj);
};

/**
 * @private
 */
SSMILib.Action.gsdErrorCb = function(res)
{
	KISUtil.debug("Action/gsdErrorCb", res.responseText);
	try{
		var msg = Common.splitStr(res.responseText, 62);
		for (var i in msg) {
			//LogLib.write(msg[i], LogLib.LEVEL.DBG);
		}
	}
	catch(e){
		//LogLib.write("[CS] exception catched", LogLib.LEVEL.DBG);
	}
	
	var _result = false;
	var soapFaultObj = null;
	if(res.responseXML){
		var _gsdrNode = res.responseXML.getElementsByTagName("soap:Fault");
			//_gsdrNode : GetUsagePrnCntResult
		if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
			 soapFaultObj = (Common.xmlToJson)?Common.xmlToJson(_gsdrNode[0]):_gsdrNode[0].textContent;
		}
	}
	SSMILib.onEvent("DoAction", _result, soapFaultObj);
};