/**
 * akey:암호화키
 * payment:결제처리여부(true:결제진행,false:금액조회만)
 * service:서비스종류(copy/scan/fax등)
 * info:실행관련 정보들
 * -outplex:출력양단면정보(Simplex,Duplex,Tumble)
 * -outputmediumsize:출력용지사이즈(A3,A4,B4,B5)
 * -colormode:색상정보(FullColor,GrayScale)
 * -pages:원고장수(1-n)
 * -copies:원고매수(1-999) 
 */
SSMILib.Charge = function()
{
	this.aKey="";
	this.service = "";
	this.outplex=0;
	this.mediasize=0;
	this.colormode=0;
	this.pages=1;
};
/**
 * @fileoverview デバイスのボックス文書を取得または削除するためのクラス定義<br>
 * デバイスのボックス文書を取得に関して以下のメソッドを提供する<br>
 * Charge<br><br>
 *
 * @author Copyright(C) 2014 Fuji Xerox Korea Information Service Co., Ltd. All rights reserved.<br>
 * @version 1.2.0
 * @lang ja
 */
/**
 * @private
 */
Extend(SSMILib.Charge.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.Charge.prototype.createMsg = function()
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
	
	item = xml.createElement("service");
	item.appendChild(xml.createTextNode(this.service));
	sdNode.appendChild(item);
	
	item = xml.createElement("outplex");
	item.appendChild(xml.createTextNode(this.outplex));
	sdNode.appendChild(item);
	
	item = xml.createElement("mediasize");
	item.appendChild(xml.createTextNode(this.mediasize));
	sdNode.appendChild(item);
	
	item = xml.createElement("colormode");
	item.appendChild(xml.createTextNode(this.colormode));
	sdNode.appendChild(item);
	
	item = xml.createElement("pages");
	item.appendChild(xml.createTextNode(this.pages));
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
 * @param	{SSMILib.Charge}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.Charge}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.DoCharge = function(sdObj, timeout, targetURL)
{
	var _ws = new WebServiceLib.Communicator();

	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.Charge.gsdSuccessCb;
	_ws.errorHandler = SSMILib.Charge.gsdErrorCb;

	if(timeout){
		_ws.timeout = timeout;
		_ws.timeoutHandler = SSMILib.Charge.gsdErrorCb;
	}

	var soapAction = "EPSOFT_SMARTPRINTING_WEBSERVICE/xrsCharge";
	_ws.soapAction = soapAction;
	_ws.isDeviceReq = true;

	var _targetURL = targetURL||glbConfig.SERVER_URL;

	if (SSMILib.dummy) {
		var _docBox = null;
		SSMILib.onEvent("Charge", true, _docBox);
		return;
	}
	var _sdObj = sdObj || new SSMILib.Charge();
	_sdObj.type = "xrsCharge";
	var _msg = _sdObj.serializeToString();
	KISUtil.debug("Charge/send",_msg);
	_ws.send(_targetURL, _msg);
};
/**
 * @private
 */
SSMILib.Charge.gsdSuccessCb = function(res)
{
	KISUtil.debug("Charge/gsdSuccessCb", res.responseText);
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
		SSMILib.onEvent("Charge", _result, null);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("xrsChargeResult");
	if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
		resObj = Common.xmlToJson(_gsdrNode[0]);
		if(resObj && resObj.rt){
			_result = true;
			//JobList가 배열이 아닌 케이스 보정
			if(!!resObj.JobList && !(resObj.JobList instanceof Array) && !!resObj.JobList.rsJobInfo){
				resObj.JobList = [resObj.JobList.rsJobInfo];
			}
		}
	}

	SSMILib.onEvent("Charge", _result, resObj);
};

/**
 * @private
 */
SSMILib.Charge.gsdErrorCb = function(res)
{
	KISUtil.debug("Charge/gsdErrorCb", res.responseText);
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
	SSMILib.onEvent("Charge", _result, soapFaultObj);
};