/**
 * Tray Info Set インスタンスを作成する
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
    "ip": "string",         -- 출력할 복합기 IP (null이면 API 호출한 네트워크 IP 설정)
    "uuid": [
        {
            "string",          -- 출력할 파일의 uuid 목록
            "string",
        }
    ]
}
 */
SSMILib.TrayInfo = function()
{
	this.ipAddress = "";
	this.serialNo = "";
	this.trays = new Array();
};
/**
 * @private
 */
Extend(SSMILib.TrayInfo.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.TrayInfo.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	xml.nss.nss = [];//namespace초기화

	var soapNS = "http://schemas.xmlsoap.org/soap/envelope/";
	var webNS = "http://webservice.card.mfd.anyguard.kor.fujixerox.com/";
 	var beanNS = "http://bean.print.ws.anyguard.kor.fujixerox.com";

	xml.addNSPrefix(soapNS, "soapenv");
	xml.addNSPrefix(webNS, "web");
	xml.addNSPrefix(beanNS, "bean");

	var sdNode = xml.createElement("ipAddress:" + this.ipAddress );

	xml.addNSDeclaration(soapNS, root, true);
	xml.addNSDeclaration(webNS, root, true);
	xml.addNSDeclaration(beanNS, root, true);

	var itNode = xml.createElement("serialNo");
	itNode.appendChild(xml.createTextNode(this.serialNo));
	sdNode.appendChild(itNode);

	itNode = xml.createElement("trays");
	itNode.appendChild(xml.createTextNode(this.trays));
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
 * @param	{SSMILib.SetTrayInfo}	sdObj	文書取得用のオブジェクトを指定する
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
SSMILib.SetTrayInfo = function(sdObj, timeout, remoteHost)//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
{
	var url = remoteHost + "api/interface/Supplies/paper";//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
	var data = JSON.stringify(sdObj);
	var req = createXMLHttpRequest();

	req.open("POST", url, true);
	if(timeout){
		KISUtil.debug("SetTrayInfo:", timeout);
		req.timeout = timeout;
		req.ontimeout = SSMILib.SetTrayInfo.gsdErrorCb;
	}
	req.setRequestHeader("Content-Type", "application/json");
	req.send(data);
	KISUtil.debug("SetTrayInfo:", "Send!!!");
	req.onreadystatechange = function(){
        if(this.readyState === 4){
        	if(this.status === 200){
        		var resObj = JSON.parse(req.responseText);
        		if(resObj && typeof resObj.status != "undefined"){
        			SSMILib.onEvent("SetTrayInfo", true, resObj);
        		}else{
        			SSMILib.SetTrayInfo.gsdErrorCb();
        		}
	        }else{
	        	SSMILib.SetTrayInfo.gsdErrorCb();
	        }
        }else{
			KISUtil.debug("readyState:", this.readyState);
		}
    };
    //SmartUI 2.0 Enhance 2015.05 End
};

/**
 * @private
 */
SSMILib.SetTrayInfo.gsdSuccessCb = function(res)
{
	KISUtil.debug("SetTrayInfo/gsdSuccessCb", res.responseText);
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("SetTrayInfo", _result);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("return");
		//_gsdrNode : PrintSelectedResult
	if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
		resObj = Common.xmlToJson(_gsdrNode[0]);
		_result = true;
	}

	SSMILib.onEvent("SetTrayInfo", _result, resObj);
};

/**
 * @private
 */
//SmartUI 2.0 Enhance 2015.05 Start
SSMILib.SetTrayInfo.gsdErrorCb = function()
{
	KISUtil.debug("SetTrayInfo:", "ErrorCB");
	SSMILib.onEvent("SetTrayInfo", false, null);
};
//SmartUI 2.0 Enhance 2015.05 End
