/**
 * @fileoverview サポートしているPDLのコレクションを取得するクラス定義<br>
 * 以下のメソッドを提供する<br>
 * GetPDLInfo<br>

 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for retrieving supported PDL<br>
 * GetPDLInfo<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */

/**
 * サポートしているPDLのコレクションを取得する<br>
 * 情報が取得できた場合、PDLのファミリ/レベル等をプロパティとしてもつオブジェクトが配列の形式で返される。<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls」を参照
 * @static
 * @lang ja
 */
 /**
 * Retrieves supported PDL information.<br>
 * If retrieval is successful, array of objects with PDL family, level, etc. as properties is returned.<br>
 * See "01-02 SESAMi Service Management Interface Specification_Object.xls" for details.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetPDLInfo = function(){
	var dev = new SSMILib.DeviceInfo("PDLCollection", "");
	dev.requester.successHandler = SSMILib.GetPDLInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetPDLInfo.errorCb;

	if (SSMILib.dummy) {
		var _returnArray = new Array();
		_returnArray[0] = {Family:"EscapeP", Level:"01"};
		_returnArray[1] = {Family:"Automatic", Level:"01"};
		_returnArray[2] = {Family:"ART", Level:"4"};
		_returnArray[3] = {Family:"ART", Level:"EX"};
		_returnArray[4] = {Family:"TIFF", Level:"TIFF 6.0"};
		_returnArray[5] = {Family:"PJL", Level:"01"};
		_returnArray[6] = {Family:"PDF", Level:"1"};
		_returnArray[7] = {Family:"XPS", Level:"6", };
		_returnArray[8] = {Family:"PCLWithoutFont", Level:"Unknown", };
		_returnArray[9] = {Family:"XDW", Level:"7", };

		SSMILib.onEvent("GetPDLInfo", true, _returnArray);
		return;
	}

	dev.getDeviceInfo(false);
	return;
}

/**
 * @private
 */
SSMILib.GetPDLInfo.successCb = function(res)
{
	if(!res.responseXML) {
		return null;
	}
	var _returnObj = SSMILib.attrNodeToObject(res.responseXML);

	SSMILib.GetPDLInfoInternal(parseInt(_returnObj.Count));
	return;
};

/**
 * @private
 */
SSMILib.GetPDLInfo.errorCb = function(res)
{
	SSMILib.onEvent("GetPDLInfo", false, null);

	return;
};

/**
 * サポートしているPDLの詳細情報を取得する。<br>
 * PDLの詳細情報を取得に成功した場合、trueを返す。<br>
 * PDLの詳細情報を取得に失敗した場合、falseを返す。<br>
 * @param {int} 取得するPDLの数を指摘する。
 * @return {Object} PDLの詳細情報オブジェクトの配列
 * @addon
 * @private
 * @lang ja
 */
 /**
 * <br>
 * Get the collection of supported PDL <br>
 * Return true, when it gets the requested data.
 * Return false, when it is not able to gets the requested data
 * @return {Bool} Whether the process success or fails.
 * @return {Object} An array of supported PDL collection objects
 * @addon
 * @private
 * @lang en
 */
SSMILib.GetPDLInfoInternal = function(count)
{
	var _obj = new Array();
	var _identifier = new Array();
	for(var i=1; i< count+1; i++) _obj[i] = "PDL";
	for(var i=1; i< count+1; i++) _identifier[i] = i;

	var dev = new SSMILib.DeviceInfo(_obj, "");

	dev.identifier = _identifier;
	dev.requester.successHandler = SSMILib.GetPDLInfoInternal.successCb;
	dev.requester.errorHandler = SSMILib.GetPDLInfoInternal.errorCb;

	if (SSMILib.dummy) {
		var _returnObj = new Object();

		SSMILib.onEvent("GetPDLInfo", true, _returnObj);
		return;
	}

	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetPDLInfoInternal.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetPDLInfo", false, null);
		return;
	}

	var _returnArray = new Array();
	var _objNodes = res.responseXML.getElementsByTagName("Object");
	for (var i = 0; i < _objNodes.length; i++) {
		var _node = _objNodes.item(i);
		if (_node.hasChildNodes()) {
			_returnArray[i] = SSMILib.attrNodeToObject(_node);
		}
	}

	if(_returnArray.length){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetPDLInfo", _result, _returnArray);

	return;
};

/**
 * @private
 */
SSMILib.GetPDLInfoInternal.errorCb = function(res)
{
	SSMILib.onEvent("GetPDLInfo", false, null);

	return;
};

