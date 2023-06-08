SSMILib.LoginChk = function()
{
	this.aKey="";
	this.aID="";
	this.aPass="";
};
/**
 * @fileoverview デバイスのボックス文書を取得または削除するためのクラス定義<br>
 * デバイスのボックス文書を取得に関して以下のメソッドを提供する<br>
 * LoginChk<br><br>
 *
 * @author Copyright(C) 2014 Fuji Xerox Korea Information Service Co., Ltd. All rights reserved.<br>
 * @version 1.2.0
 * @lang ja
 */
/**
 * @private
 */
Extend(SSMILib.LoginChk.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.LoginChk.prototype.createMsg = function()
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
	
	item = xml.createElement("aID");
	item.appendChild(xml.createTextNode(this.aID));
	sdNode.appendChild(item);

	item = xml.createElement("aPass");
	item.appendChild(xml.createTextNode(this.aPass));
	sdNode.appendChild(item);

	xml.addNSDeclaration(xsiNS, root, true);
	xml.addNSDeclaration(xsdNS, root, true);
	xml.addNSDeclaration(soapNS, root, true);

	//body.appendChild(sdNode);			//namespace문제를 해결하기위하여 우회하여 생성
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
 * @param	{SSMILib.LoginChk}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.LoginChk}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.DoLoginChk = function(sdObj, timeout)
{
	var _ws = new WebServiceLib.Communicator();

	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.LoginChk.gsdSuccessCb;
	_ws.errorHandler = SSMILib.LoginChk.gsdErrorCb;

	if(timeout){
		_ws.timeout = timeout;
		_ws.timeoutHandler = SSMILib.LoginChk.gsdErrorCb;
	}

	var soapAction = "EPSOFT_SMARTPRINTING_WEBSERVICE/xrsLoginChk";
	_ws.soapAction = soapAction;
	_ws.isDeviceReq = true;

	var _targetURL = glbConfig.SERVER_URL;

	if (SSMILib.dummy) {
		var _docBox = null;
		SSMILib.onEvent("LoginChk", true, _docBox);
		return;
	}
	var _sdObj = sdObj || new SSMILib.LoginChk();
	_sdObj.type = "xrsLoginChk";
	var _msg = _sdObj.serializeToString();
	KISUtil.debug("LoginChk/send",_msg);
	_ws.send(_targetURL, _msg);
};
/**
 * @private
 */
SSMILib.LoginChk.gsdSuccessCb = function(res)
{
	KISUtil.debug("LoginChk/gsdSuccessCb", res.responseText);
	try{
		var msg = Common.splitStr(res.responseText, 62);
		for (var i in msg) {
			LogLib.write(msg[i], LogLib.LEVEL.DBG);
		}
	}
	catch(e){
		LogLib.write("[CS] exception catched", LogLib.LEVEL.DBG);
	}
	
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("LoginChk", _result, null);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("xrsLoginChkResult");
	if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
		resObj = Common.xmlToJson(_gsdrNode[0]);
		if(resObj && !Common.isNullOrEmpty(resObj.rt)){
			_result = true;
			//JobList가 배열이 아닌 케이스 보정
			if(!!resObj.JobList&& !(resObj.JobList instanceof Array) && !!resObj.JobList.rsJobInfo){
				resObj.JobList = [resObj.JobList.rsJobInfo];
			}
		}
	}

	SSMILib.onEvent("LoginChk", _result, resObj);
};

/**
 * @private
 */
SSMILib.LoginChk.gsdErrorCb = function(res)
{
	KISUtil.debug("LoginChk/gsdErrorCb", res.responseText);
	try{
		var msg = Common.splitStr(res.responseText, 62);
		for (var i in msg) {
			LogLib.write(msg[i], LogLib.LEVEL.DBG);			//2014/06/13 son.ch Log확인용 코드
		}
	}
	catch(e){
		LogLib.write("[CS] exception catched", LogLib.LEVEL.DBG);
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
	SSMILib.onEvent("LoginChk", _result, soapFaultObj);
};