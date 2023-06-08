/**
 * @fileoverview カスタムサービス登録のためのクラス定義<br>
 * 以下のメソッドを提供する<br>
 * CreateCsvFolder<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for registering Custom Services.<br>
 * Provides the following methods:<br>
 * CreateCsvFolder<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */
 
/**
 * CsvFolderCreateインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class カスタムサービス登録のためのクラス
 * @lang ja
 */
 /**
 * Creates CsvFolderCreate instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for registering Custom Services.
 * @lang en
 */
SSMILib.CsvFolderCreate = function()
{
	/**
	 * カスタム・サービス名を指定する<br>
	 * デバイス内部には指定したカスタム・サービス名と同じ名前のフォルダが生成される<br>
	 * 名前文字列に空文字列は許されない<br>
	 * 名前文字列に使用可能な文字は英字 (a-z, A-Z)、数字 (0-9) および下線 (_)<br>
	 * この要素を省略することはできない。<br>
	 * @type String
	 * @default null
	 * @lang ja
	 */
	 /**
	 * Custom Service name.<br>
	 * Folder with Custom Service name as folder name is created in device.<br>
	 * Empty string not allowed.<br>
	 * Only alphanumerics (a-z, A-Z, 0-9) and underscores (_) allowed.<br>
	 * This element cannot be omitted.<br>
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.name = "";
}

/**
 * @private
 */
Extend(SSMILib.CsvFolderCreate.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.CsvFolderCreate.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	
	var csvNs = "http://www.fujifilm.com/fb/2021/01/ssm/management/csv";
	xml.addNSPrefix(csvNs, "csv");
	
	var _createCsvFolderNode = body.appendChild(xml.createElementNS(csvNs, "CreateCsvFolder"));
	xml.addNSDeclaration(csvNs, _createCsvFolderNode, true);

	if(this.name){
		var _folderName = _createCsvFolderNode.appendChild(xml.createElement("FolderName"));
		_folderName.appendChild(xml.createTextNode(this.name));
	}
	
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
}

/**
 * カスタム・サービスを登録する。<br>
 * デバイス内部にカスタム・サービスを登録するため同名のフォルダが生成される。<br>
 * 使用できるユーザーは管理者(KO)のみである。<br>
 * 詳細は「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 1.カスタム・サービス・スクリプト管理機能」を参照<br>
 * @param {String} name 生成するカスタム・サービスの名前を指定する。
 * @lang ja
 */
 /**
 * Registers Custom Service to device.<br>
 * Custom Service name as folder name is created in device.<br>
 * Only system administrator (KO user) can use this method.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.<br>
 * @param {String} name Name of Custom Service to register.
 * @lang en
 */
SSMILib.CreateCsvFolder = function(name)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.CreateCsvFolder.successCb;
	_ws.errorHandler = SSMILib.CreateCsvFolder.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/csv#CreateCsvFolder"';
	_ws.isDeviceReq = true;
	
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	
	var _csvFolder = null;
	if(!name){
		SSMILib.onEvent("CreateCsvFolder", false, null);
		return;
	}else{
		_csvFolder = new SSMILib.CsvFolderCreate();
		_csvFolder.name = name;		
	}
	
	var _msg = _csvFolder.serializeToString();
	_ws.send(_targetURL, _msg);
	return;		
}

/**
 * @private
 */
SSMILib.CreateCsvFolder.successCb = function(res)
{
	var _result = false;
	if(!res.responseXML){
		SSMILib.onEvent("CreateCsvFolder", _result, null);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/01/ssm/management/csv", "CreateCsvFolderResponse");
	if(_resNode.length){
		_result = true;
	}
	
	SSMILib.onEvent("CreateCsvFolder", _result, null);
	return;		
}

/**
 * @private
 */
SSMILib.CreateCsvFolder.errorCb = function(res)
{
	var _result = false;

	SSMILib.onEvent("CreateCsvFolder", _result, null);
	return;
}