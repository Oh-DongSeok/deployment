/**
 * DeleteSelected インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class  ボックス文書を扱うためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates DeleteSelected instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for handling Mailbox documents.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.SelectedPrnInfo4Delete = function()
{
	this.userId = "";
	this.wsIp = "";
	this.listSelected = new Array();
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
	var webNS = "http://webservice.delete.ws.anyguard.fujifilm.com/";
	var beanNS = "http://bean.delete.ws.anyguard.fujifilm.com";
	
	xml.addNSPrefix(soapNS, "soapenv");
	xml.addNSPrefix(webNS, "web");
	xml.addNSPrefix(beanNS, "bean");
	
	var sdNode = xml.createElement("web:" + this.type );
	
	xml.addNSDeclaration(soapNS, root, true);
	xml.addNSDeclaration(webNS, root, true);
	xml.addNSDeclaration(beanNS, root, true);
	
	var itNode = xml.createElement("userId");
	itNode.appendChild(xml.createTextNode(this.userId));
	sdNode.appendChild(itNode);

	itNode = xml.createElement("listSelected");
	var item, subNode, ssNode;  
	for(var i=0,iMax=this.listSelected.length;i<iMax;i++){
		;
		//subNode = xml.createElement("Prn");
		subNode = xml.createElement("bean:DeleteSelectedListForm");
		try
		{
			ssNode = xml.createElement("bean:uuId");
			ssNode.appendChild(xml.createTextNode(this.listSelected[i]));
			subNode.appendChild(ssNode);
		}
		catch(e){
			//console.dir(e);
		}
		itNode.appendChild(subNode);
	}
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
 * @param	{SSMILib.DeleteSelected}	sdObj	文書取得用のオブジェクトを指定する
 * @param	{Int}	timeout		通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param	{SSMILib.DeleteSelected}	sdObj	Object for retrieving document information
 * @param	{Int}	timeout		Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.DeleteSelectedPrnInfo = function(sdObj, timeout, remoteHost)//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
{
	//SmartUI 2.0 Enhance 2015.05 Start
	//var url = glbConfig.remoteHost + "DeleteSelected";
	var url = remoteHost + "DeleteSelected";//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
	var data = JSON.stringify(sdObj);
	var req = createXMLHttpRequest();

	req.open("POST", url, true);
	if(timeout){
		req.timeout = timeout;
		req.ontimeout = SSMILib.DeleteSelectedPrnInfo.gsdErrorCb;
	}
	req.setRequestHeader("Content-Type", "text/plain");
	req.send(data);
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
	KISUtil.debug("DeleteSelectedPrnInfo.gsdSuccessCb",res.responseText);
	var resObj = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("DeleteSelected", _result, _docList);
		return;
	}

	var _gsdrNode = res.responseXML.getElementsByTagName("return");
		//_gsdrNode : DeleteSelectedResult
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
}
//SmartUI 2.0 Enhance 2015.05 End