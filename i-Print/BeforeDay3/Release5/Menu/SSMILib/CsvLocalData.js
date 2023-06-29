/**
 * @fileoverview カスタムサービス固有データの書き込み、削除、取得、一覧取得のクラス定義<br>
 * 以下のメソッドを提供する<br>
 * ListCsvLocal<br>
 * GetCsvLocalData <br>
 * SetCsvLocalData 	<br>
 * DeletetCsvLocalData <br>
 *
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.1.0
 * @lang ja
 */
 /**
 * @fileoverview Defines a class for listing, retrieving, and registering/unregistering Custom Service specific data to/from device.<br>
 * provides the following methods:<br>
 * ListCsvLocalData<br>
 * GetCsvLocalData<br>
 * SetCsvLocalData 	<br>
 * DeleteCsvLocalData<br>
 *
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.1.0
 * @lang en
 */

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class AREAに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in AREA</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.AREA = function(){}

/**
 * NVRAMを表す
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * NVRAM
 * @final
 * @type  String
 * @constant
 * @lang en
 */
SSMILib.AREA.NVRAM = "NVRAM";

/**
 * HDDを表す
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * HDD
 * @final
 * @type  String
 * @constant
 * @lang en
 */
SSMILib.AREA.HDD = "HDD";

 /**
 * CsvLocalData インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class カスタムサービス固有データを扱うためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates CsvLocalData instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for handling Custom Service specific data.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.CsvLocalData = function(id, data, type){
	/**
	 *	識別子を設定する。(最大文字列 : 63+1byte)
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *  Custom Service specific data identifier(maximum length 63+1bytes)
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.id = id;

	/**
	 *	領域を設定する。
	 *	@type  SSMILib.AREA
	 *	@default SSMILib.AREA.NVRAM
	 *	@private
	 *  @lang ja
	 */
	/**
	 *  Area for CsvLocalData Operations
	 *	@type String
	 *	@default SSMILib.AREA.NVRAM.
	 *	@private
	 *  @lang en
	 */
	this.area = SSMILib.AREA.NVRAM;

	/**
	 *	データを設定する。(最大 data size: NVRAM - 511+1byte, HDD - 4031 + 1byte)
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *  Custom Service specific data (maximum length 511+1bytes)
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.data = data;

	/**
	 *	Operation Typeを設定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 * Set a type of Operation
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.type = type;

	/**
	 *	Filtersを設定する。
	 *	@type SSMILib.Filters
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 * Set a Filters
	 *	@type SSMILib.Filters
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.filter = new SSMILib.Filters();
};

/**
 * @private
 */
Extend(SSMILib.CsvLocalData.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.CsvLocalData.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var cvs4NS	=	"http://www.fujixerox.co.jp/2010/06/ssm/management/csv";
	xml.addNSPrefix(cvs4NS, "csv4");

	var mainTag = body.appendChild(xml.createElementNS(cvs4NS, this.type));
	xml.addNSDeclaration(cvs4NS, mainTag, true);

	if(this.type == "ListCsvLocalData" ){
		var areaTag = body.appendChild(xml.createElementNS(cvs4NS, "Area"));
		var text = xml.createTextNode(this.area);
		areaTag.appendChild(text);
		mainTag.appendChild(areaTag);

		if(this.filter){
			mainTag.appendChild(this.filter.toXmlNode(xml));
		}

	}else{
		if(this.id){
			var idTag = body.appendChild(xml.createElementNS(cvs4NS, "Identifier"));
			var text = xml.createTextNode(this.id);
			if(this.area) xml.setAttributeNS(idTag, null, 'area', this.area);
			idTag.appendChild(text);
			mainTag.appendChild(idTag);
		}
	}

	if(this.data){
		var dataTag = body.appendChild(xml.createElementNS(cvs4NS, "Data"));
		var text2 = xml.createTextNode(this.data);
		dataTag.appendChild(text2);
		mainTag.appendChild(dataTag);
	}

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * デバイスからカスタムサービス固有データの識別子一覧を取得する<br>
 * 取得に成功した場合、識別子を配列の形式で返す。<br>
 * 詳細については「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 2.カスタム・サービス固有データ管理機能」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @param {SSMILib.AREA} area スタムサービス固有データ領域を指定する。
 * @param {SSMILib.Filters} filterObj カスタムサービス固有データ領域のfiltersを指定する。
 * @return 	{Bool} 一覧取得の成功、失敗
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves Custom Servie specific data identifier list from device.<br>
 * If retrieval is successful, identifiers are returned in Array form.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.
 * @param {Bool} auth Whether deivce is in authentication mode
 * @param {SSMILib.AREA} area An MFD area that is used by this operation.
 * @param {SSMILib.Filters} filterObj set a filtering condition.
 * @return 	{Bool} Whether retrieval was succesful
 * @addon
 * @static
 * @lang en
 */
SSMILib.ListCsvLocalData = function(auth, area, filterObj)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.CsvLocalData.listSuccessCb;
	_ws.errorHandler = SSMILib.CsvLocalData.listErrorCb;
	//_ws.timeoutHandler = SSMILib.CsvLocalData.listErrorCb;
	_ws.soapAction = '"http://www.fujixerox.co.jp/2010/06/ssm/management/csv#ListCsvLocalData"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Csv";
	}

	if (SSMILib.dummy) {
		var _dataList = new Array("test1", "test2", "test3", "test4", "test5");
		SSMILib.onEvent("ListCsvLocalData", true, _dataList);
		return;
	}

	var _dataObj = new SSMILib.CsvLocalData(null,null,"ListCsvLocalData");

	if(area == SSMILib.AREA.NVRAM || area == SSMILib.AREA.HDD) _dataObj.area = area;
	if(filterObj) _dataObj.filter = filterObj;

	var _msg = _dataObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.CsvLocalData.listSuccessCb = function(res)
{
	var _dataList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("ListCsvLocalData", _result, _dataList);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagNameNS(
			"http://www.fujixerox.co.jp/2010/06/ssm/management/csv","ListCsvLocalDataResponse");

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
	SSMILib.onEvent("ListCsvLocalData", _result, _dataList);
};

/**
 * @private
 */
SSMILib.CsvLocalData.listErrorCb = function(res)
{
	SSMILib.onEvent("ListCsvLocalData", false, null);
};


/**
 * デバイスに書き込まれているカスタムサービスの固有データを取得する<br>
 * データの取得に成功した場合、trueと指定したIdentifier(Key)に対応するデータが返される。<br>
 * データはBase64BinaryからStringにデコードされたものが返る。
 * <br>詳細については「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 2.カスタム・サービス固有データ管理機能」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @param 	{String} id 識別子を指定する。
 * @param {SSMILib.AREA} area カスタムサービス固有データ領域を指定する。
 * @return 	{Bool} データ取得の成功、失敗
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves Custom Servie specific data set to device.<br>
 * If retrieval is successful, true and data corresponding to specified identifier (key) is returned.<br>
 * Data is String, decoded from Base64 binary.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.
 * @param {Bool} auth Whether deivce is in authentication mode
 * @param 	{String} id Custom Service specific data identifier
 * @param {String } area An MFD area that is used by this operation.
 * @return 	{Bool} Whether retrieval was succesful
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetCsvLocalData = function(auth, id, area)
{

	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.CsvLocalData.getSuccessCb;
	_ws.errorHandler = SSMILib.CsvLocalData.getErrorCb;
	//_ws.timeoutHandler = SSMILib.ListCsvLocalData.errorCb;
	_ws.soapAction = '"http://www.fujixerox.co.jp/2010/06/ssm/management/csv#GetCsvLocalData"';
	_ws.isDeviceReq = true;

	_ws.token = SSMILib.RemoteAccess.Interceptor("WebService", _ws);

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Csv";
	}

	if (SSMILib.dummy) {
		var _data = new Object();
		_data = {Identifier:"11111", data:"aaa,bbb,ccc,ddd,eee"};
		SSMILib.onEvent("GetCsvLocalData", true, _data);
		return;
	}

	var _dataObj = new SSMILib.CsvLocalData(id,null,"GetCsvLocalData");
	if(area == SSMILib.AREA.NVRAM || area == SSMILib.AREA.HDD) _dataObj.area = area;

	var _msg = _dataObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.CsvLocalData.getSuccessCb = function(res)
{
	var _data = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetCsvLocalData", _result, _data);
		return;
	}

	var _dataList = new Array();
	_dataList = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, _dataList);

	var _resNode = res.responseXML.getElementsByTagNameNS(
			"http://www.fujixerox.co.jp/2010/06/ssm/management/csv","GetCsvLocalDataResponse");

	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		for (var i = 0; i < _resNodeLen; i++){
			var _dataNode = _resNode[0].childNodes[i];

			if (_dataNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_dataNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_data = SSMILib.childNodeToProperty(_dataNode);
		}
		_result = true;
	}

	var base64Obj = new Base64Lib();
	var decodedData = base64Obj.decode(_data);

	if(_dataList.length){
		//RemoteAccess対応
		_dataList.push(decodedData);
		SSMILib.onEvent("GetCsvLocalData", _result, _dataList);
	}else{
		SSMILib.onEvent("GetCsvLocalData", _result, decodedData);
	}
};

/**
 * @private
 */
SSMILib.CsvLocalData.getErrorCb = function(res)
{
	var _result = false;
	var soapFaultObj = null;
	soapFaultObj  = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
	SSMILib.onEvent("GetCsvLocalData", _result, soapFaultObj);
};

/**
 * カスタムサービス固有データを書き込む。<br>
 * データ書き込みに成功した場合、trueを返す。<br>
 * データ書き込みに失敗した場合、falseを返す。<br>
 * 3番目のパラメータは常にnullを返す。<br>
 * 詳細については「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 2.カスタム・サービス固有データ管理機能」を参照
 * @param {String} id 識別子を指定する。
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @param {String} data 書き込むデータを文字列で指定する(Base64Binaryにエンコードされたものが書き込まれる)
 * @param {SSMILib.AREA} area カスタムサービス固有データ領域を指定する。(最大 NVRAM:10個、HDD:512個まで)
 * @return {Bool} データ書き込みの成功、失敗
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Sets Custom Service specific data to device. Up to 10 items can be set.<br>
 * If data is set successfully, true is returned; otherwise, false is returned.<br>
 * The 3rd parameter always returns null.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.
 * @param {String} id Custom Service specific data identifier
 * @param {Bool} auth Whether deivce is in authentication mode
 * @param {String} data Data to set, in String form. This data is encoded to Base64Binary and set to device.
 * @param {String } area An MFD area that is used by this operation.
 * @return {Bool} Whether data was set successfully
 * @addon
 * @static
 * @lang en
 */
SSMILib.SetCsvLocalData = function(id, auth, data, area)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.CsvLocalData.setSuccessCb;
	_ws.errorHandler = SSMILib.CsvLocalData.setErrorCb;
	//_ws.timeoutHandler = SSMILib.CsvLocalData.setErrorCb;

	_ws.soapAction = '"http://www.fujixerox.co.jp/2010/06/ssm/management/csv#SetCsvLocalData"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Csv";
	}

	if (SSMILib.dummy) {
		SSMILib.onEvent("SetCsvLocalData", true, null);
		return;
	}

	var base64Obj = new Base64Lib();
	var encodedData = base64Obj.encode(data);

	var _dataObj = new SSMILib.CsvLocalData(id, encodedData, "SetCsvLocalData");
	if(area == SSMILib.AREA.NVRAM || area == SSMILib.AREA.HDD) _dataObj.area = area;

	var _msg = _dataObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.CsvLocalData.setSuccessCb = function(res)
{
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("SetCsvLocalData", _result, null);
		return;
	}
	_result = true;
	SSMILib.onEvent("SetCsvLocalData", _result, null);
	return;
};

/**
 * @private
 */
SSMILib.CsvLocalData.setErrorCb = function(res)
{
	SSMILib.onEvent("SetCsvLocalData", false, null);
};

/**
 * カスタムサービス固有データを削除する<br>
 * データ削除に成功した場合、trueを返す。<br>
 * データ削除に失敗した場合、falseを返す。<br>
 * 3番目のパラメータは常にnullを返す。<br>
 * 詳細については「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 2.カスタム・サービス固有データ管理機能」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @param {String} id 識別子を指定する。
 * @param {String } area スタムサービス固有データ領域を指定する。
 * @return {Bool} データ削除の成功、失敗
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Removes Custom Service specific data.<br>
 * If data is removed successfully, true is returned; otherwise, false is returned.<br>
 * The 3rd parameter always returns null.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.
 * @param {Bool} auth Whether deivce is in authentication mode
 * @param {String} id Custom Service specific data identifier
 * @param {String } area An MFD area that is used by this operation.
 * @return {Bool} Whether data was removed successfully
 * @addon
 * @static
 * @lang en
 */
SSMILib.DeleteCsvLocalData = function(auth, id, area)
{

	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.CsvLocalData.delSuccessCb;
	_ws.errorHandler = SSMILib.CsvLocalData.delErrorCb;
	//_ws.timeoutHandler = SSMILib.CsvLocalData.delErrorCb;
	_ws.soapAction = '"http://www.fujixerox.co.jp/2010/06/ssm/management/csv#DeleteCsvLocalData"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Csv";
	}

	if (SSMILib.dummy) {
		SSMILib.onEvent("DeleteCsvLocalData", true, null);
		return;
	}

	var _dataObj = new SSMILib.CsvLocalData(id, null, "DeleteCsvLocalData");
	if(area == SSMILib.AREA.NVRAM || area == SSMILib.AREA.HDD) _dataObj.area = area;

	var _msg = _dataObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.CsvLocalData.delSuccessCb = function(res)
{
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("DeleteCsvLocalData", _result, null);
		return;
	}

	_result = true;
	SSMILib.onEvent("DeleteCsvLocalData", _result, null);
	return;

};

/**
 * @private
 */
SSMILib.CsvLocalData.delErrorCb = function(res)
{
	SSMILib.onEvent("DeleteCsvLocalData", false, null);
};
