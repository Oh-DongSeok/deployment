/**
 * @fileoverview カスタム・サービス削除のためのクラス定義<br>
 * 以下のメソッドを提供する<br>
 * DeleteCsvFolder<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for deleting Custom Services.<br>
 * Provides the following methods:<br>
 * DeleteCsvFolder<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */
 
/**
 * CsvFolderDeleteインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class カスタム・サービス削除のためのクラス
 * @private
 * @lang ja
 */
 /**
 * Creates CsvFolderDelete instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for deleting Custom Service.
 * @private
 * @lang en
 */
SSMILib.CsvFolderDelete = function()
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
	
	/**
	 * カスタム・サービスの強制削除を指定する<br>
	 * カスタム・サービス登録フォルダ中にファイルが存在する場合、forceDeleteがtrueであれば、フォルダ中のファイルも一括で削除する
	 * カスタム・サービス登録フォルダ中にファイルが存在する場合、forceDeleteにfalseが指定されていれば、フォルダ中にファイルが存在するとエラーとなり、フォルダの削除に失敗する
	 * forceDeleteが省略されている場合は、falseが指定されているとみなす。
	 * @type Boolean
	 * @default false
	 * @lang ja
	 */
	 /**
	 * Whether to force delete Custom Service.<br>
	 * If Custom Service folder is not empty and forceDelete is set to false, error occurs upon CsvFolderDelete.
	 * If Custom Service folder is not empty and forceDelete is set to true, folder and its contents are deleted.
	 * If forceDelete is omitted, operations are as when forceDelete is set to false.
	 * @type Boolean
	 * @default false
	 * @lang en
	 */
　	this.forceDelete = false;
}

/**
 * @private
 */
Extend(SSMILib.CsvFolderDelete.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.CsvFolderDelete.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	
	var csvNs = "http://www.fujifilm.com/fb/2021/01/ssm/management/csv";
	xml.addNSPrefix(csvNs, "csv");
	
	var _deleteCsvFolderNode = body.appendChild(xml.createElementNS(csvNs, "DeleteCsvFolder"));
	xml.addNSDeclaration(csvNs, _deleteCsvFolderNode, true);

	if(this.name){
		var _folderName = _deleteCsvFolderNode.appendChild(xml.createElement("FolderName"));
		_folderName.appendChild(xml.createTextNode(this.folderName));		
	}
	
	var _forceDelete = _deleteCsvFolderNode.appendChild(xml.createElement("ForceDelete"));
	_forceDelete.appendChild(xml.createTextNode(this.forceDelete));	
	
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
}

/**
 * カスタムサービスを削除する<br>
 * 指定されたカスタム・サービス名と同名のフォルダを削除する。<br>
 * 使用できるユーザーは管理者(KO)のみである。<br>
 * 削除に成功すると、成功の応答を返す。<br>
 * 詳細は「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 1.カスタム・サービス・スクリプト管理機能」を参照<br>
 * @param {String} name 削除するカスタム・サービスの名前
 * @param {Boolean} forceDelete	強制削除を指定する<br>
 * 						true  : カスタムサービス登録フォルダ・フォルダ内ファイルを一括で削除する<br>
 * 						false : カスタムサービス登録フォルダ内にファイルがあるとエラーとなる
 * @lang ja
 */
 /**
 * Deletes Custom Service.<br>
 * Deletes folder of name (Custom Service name) specified.<br>
 * Only system administrator (KO user) can use this method.<br>
 * When deletion is successful, response thereof is returned.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf for details.<br>
 * @param {String} name Name of Custom Service to delete.
 * @param {Boolean} forceDelete	Whether to force delete.<br>
 * 						true: Delete folder even if it is not empty, along with its contents.<br>
 * 						false: If folder is not empty, error occurs.
 * @lang en
 */
SSMILib.DeleteCsvFolder = function(name, forceDelete)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.DeleteCsvFolder.successCb;
	_ws.errorHandler = SSMILib.DeleteCsvFolder.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/csv#DeleteCsvFolder"';
	_ws.isDeviceReq = true;
	
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	
	var _csvFolder = null;
	if(!name){
		SSMILib.onEvent("DeleteCsvFolder", false, null);
		return;
	}else{
		_csvFolder = new SSMILib.CsvFolderDelete();
		_csvFolder.name = name;
		_csvFolder.forceDelete = forceDelete;
	}

	var _msg = _csvFolder.serializeToString();
	_ws.send(_targetURL, _msg);
	return;	
}

/**
 * @private
 */
SSMILib.DeleteCsvFolder.successCb = function(res)
{
	var _result = false;
	
	if(!res.responseXML){
		SSMILib.onEvent("DeleteCsvFolder", _result, null);
		return;
	}
	
	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/01/ssm/management/csv", "DeleteCsvFolderResponse");
	
	if(_resNode.length){
		_result = true;
	}
	
	SSMILib.onEvent("DeleteCsvFolder", _result, null);
	return;
}

/**
 * @private
 */
SSMILib.DeleteCsvFolder.errorCb = function(res)
{
	var _result = false;
	
	SSMILib.onEvent("DeleteCsvFolder", _result, null);
	return;
}