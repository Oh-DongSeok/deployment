/**
 * @fileoverview カスタム・サービス削除のためのクラス定義<br>
 * 以下のメソッドを提供する<br>
 * DeleteCsv<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for deleting Custom Services.<br>
 * Provides the following methods:<br>
 * DeleteCsv<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */
 
/**
 * CsvDeleteインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class カスタム・サービス削除のためのクラス
 * @private
 * @lang ja
 */
/**
 * Creates CsvDelete instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for deleting Custom Service.
 * @private
 * @lang en
 */
SSMILib.CsvDelete = function()
{
	/**
	 * 削除するカスタム・サービスの名前
	 * @type String
	 * @lang ja
	 */
	/**
	 * Name of Custom Service to delete.
	 * @type String
	 * @lang en
	 */
	this.name = "";
}

/**
 * @private
 */
Extend(SSMILib.CsvDelete.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.CsvDelete.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	
	var csvNs = "http://www.fujifilm.com/fb/2021/01/ssm/management/csv";
	xml.addNSPrefix(csvNs, "csv");
	
	var _deleteCsvNode = body.appendChild(xml.createElementNS(csvNs, "DeleteCsv"));
	xml.addNSDeclaration(csvNs, _deleteCsvNode, true);

	if(this.name){
		var _name = _deleteCsvNode.appendChild(xml.createElement("Name"));
		_name.appendChild(xml.createTextNode(this.name));		
	}
	
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
}
 /**
 * カスタム・サービスを削除する<br>
 * 使用できるユーザーは管理者(KO)のみである。<br>
 * 削除に成功すると、成功の応答を返す。<br>
 * 詳細は「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 1.カスタム・サービス・スクリプト管理機能」を参照<br>
 * @param {String} name 削除するカスタム・サービスの名前
 * @lang ja
 */
/**
 * Deletes Custom Service.<br>
 * Only system administrator (KO user) can use this method.<br>
 * If Custom Service is successfully deleted, response thereof is returned.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.<br>
 * @param {String} name Name of Custom Service to delete.
 * @lang en
 */

SSMILib.DeleteCsv = function(name)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.DeleteCsv.successCb;
	_ws.errorHandler = SSMILib.DeleteCsv.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/csv#DeleteCsv"';
	_ws.isDeviceReq = true;
	
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	
	var _csv = null;
	if(!name){
		SSMILib.onEvent("DeleteCsv", false, null);
		return;
	}else{
		_csv = new SSMILib.CsvDelete();
		_csv.name = name;
	}
	
	var _msg = _csv.serializeToString();
	_ws.send(_targetURL, _msg);
	return;	
}

/**
 * @private
 */
SSMILib.DeleteCsv.successCb = function(res)
{
	var _result = false;
	
	if(!res.responseXML){
		SSMILib.onEvent("DeleteCsv", _result, null);
		return;
	}
	
	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/01/ssm/management/csv", "DeleteCsvResponse");
	
	if(_resNode.length){
		_result = true;
	}
	
	SSMILib.onEvent("DeleteCsv", _result, null);
	return;
}

/**
 * @private
 */
SSMILib.DeleteCsv.errorCb = function(res)
{
	var _result = false;
	
	SSMILib.onEvent("DeleteCsv", _result, null);
	return;
}