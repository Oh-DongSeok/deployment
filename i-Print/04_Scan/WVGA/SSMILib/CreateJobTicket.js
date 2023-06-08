/**
 * @fileoverview ジョブ実行チケット生成機能を提供する。<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /**
 * @fileoverview Provides Job Ticket generation feature.<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

 /**
 * JobTicket インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class JobTicketを扱うためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates JobTicket instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class This class is for handling Job Tickets.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */

SSMILib.JobTicket = function(){};

/**
 * @private
 */
Extend(SSMILib.JobTicket.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.JobTicket.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var lcl4NS	=	"http://www.fujifilm.com/fb/2021/04/ssm/management/local";
	xml.addNSPrefix(lcl4NS, "lcl4");

	var mainTag = body.appendChild(xml.createElementNS(lcl4NS, "CreateJobTicket"));
	xml.addNSDeclaration(lcl4NS, mainTag, true);

	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * ジョブ実行チケットを生成する<br>
 * 生成に成功すると、ジョブ実行チケットを配列の形式で返す。<br>
 * 詳細は「02-07 SESAMi Service Management Interface Specification_LocalAccess.doc.」のCreateJobTicketの項を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @return 	{Bool} 生成の成功、失敗
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Generates Job Ticket.<br>
 * See section on CreateJobTicket in "02-07 SESAMi Service Management Interface Specification_LocalAccess.doc."
 * @param {Bool} auth Whether device is in authentication mode.
 * @return 	{Bool} Whether Job Ticket was successfully generated.
 * @addon
 * @static
 * @lang en
 */
SSMILib.CreateJobTicket = function(auth)
{

	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.JobTicket.cjtSuccessCb;
	_ws.errorHandler = SSMILib.JobTicket.cjtErrorCb;
	//_ws.timeoutHandler = SSMILib.JobTicket.cjtErrorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/04/ssm/management/local#CreateJobTicket"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Local";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Local";
	}

	if (SSMILib.dummy) {
		SSMILib.onEvent("CreateJobTicket", true, "jobTicket-1234564345");
		return;
	}

	var _dataObj = new SSMILib.JobTicket();
	var _msg = _dataObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.JobTicket.cjtSuccessCb = function(res)
{
	var _dataList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("CreateJobTicket", _result, _dataList);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagNameNS(
			"http://www.fujifilm.com/fb/2021/04/ssm/management/local","CreateJobTicketResponse");

	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_dataList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _dataNode = _resNode[0].childNodes[i];

			if (_dataNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_dataNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_dataList.push(SSMILib.childNodeToProperty(_dataNode));
		}
		_result = true;
	}
	SSMILib.onEvent("CreateJobTicket", _result, _dataList);
};

/**
 * @private
 */
SSMILib.JobTicket.cjtErrorCb = function(res)
{
	SSMILib.onEvent("CreateJobTicket", false, null);
};

