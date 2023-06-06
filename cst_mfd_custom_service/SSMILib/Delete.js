/**
 * Delete インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class  ボックス文書を扱うためのクラス<br>
 * [POST]/api/interface/PrintInformation/uuid/{uuid} 전달받은 UUID값을 기준으로 저장된 spool 파일을 출력
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
    "uuid": [
        {
            "string",          -- 삭제할 파일의 uuid 목록
            "string",
        }
    ]
}
 */
SSMILib.SelectedPrnInfo4Delete = function()
{
	this.uuid = "";
};
/**
 * @private
 */
Extend(SSMILib.SelectedPrnInfo4Delete.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.SelectedPrnInfo4Delete.prototype.createMsg = function()
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

	var sdNode = xml.createElement("web:" + this.type );

	xml.addNSDeclaration(soapNS, root, true);
	xml.addNSDeclaration(webNS, root, true);
	xml.addNSDeclaration(beanNS, root, true);

	var itNode = xml.createElement("ip");
	itNode.appendChild(xml.createTextNode(this.ip));
	sdNode.appendChild(itNode);

	itNode = xml.createElement("uuid");
	itNode.appendChild(xml.createTextNode(this.uuid));
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
 * @param	{SSMILib.PrintSelected}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.PrintSelected}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.DeleteSelectedPrnInfo = function(sdObj, timeout, remoteHost)//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
{
	//SmartUI 2.0 Enhance 2015.05 Start
	//var url = glbConfig.remoteHost + "PrintSelected";
	var url = remoteHost + "api/interface/PrintInformation/uuid/" + sdObj.uuid;//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
	//var data = JSON.stringify(sdObj);
	var req = createXMLHttpRequest();

	req.open("DELETE", url, true);
	if(timeout){
		req.timeout = timeout;
		req.ontimeout = SSMILib.DeleteSelectedPrnInfo.gsdErrorCb;
	}
	req.setRequestHeader("Content-Type", "application/json");
	req.send();
	req.onreadystatechange = function(){
        if(this.readyState === 4){
        	if(this.status === 200){
        		var resObj = JSON.parse(req.responseText);
        		if(resObj && typeof resObj.status != "undefined"){
        			SSMILib.onEvent("DeleteSelected", true, resObj);
        		}else{
        			SSMILib.DeleteSelectedPrnInfo.gsdErrorCb();
        		}
	        }else{
	        	SSMILib.DeleteSelectedPrnInfo.gsdErrorCb();
	        }
        }
    };
    //SmartUI 2.0 Enhance 2015.05 End
};

/**
 * @private
 */
SSMILib.DeleteSelectedPrnInfo.gsdSuccessCb = function(res)
{
	KISUtil.debug("DeleteSelectedPrnInfo/gsdSuccessCb", res.responseText);
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("DeleteSelected", _result, _docList);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("return");
		//_gsdrNode : PrintSelectedResult
	if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
		resObj = Common.xmlToJson(_gsdrNode[0]);
		_result = true;
	}

	SSMILib.onEvent("DeleteSelected", _result, resObj);
};

/**
 * @private
 */
//SmartUI 2.0 Enhance 2015.05 Start
SSMILib.DeleteSelectedPrnInfo.gsdErrorCb = function()
{
	SSMILib.onEvent("DeleteSelected", false, null);
};
//SmartUI 2.0 Enhance 2015.05 End
