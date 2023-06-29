/**
 * @fileoverview デバイス情報を取得するクラス定義<br>
 * 以下のメソッドを提供する<br>
 * GetCustomizeDeviceInfo<br>
 * 使用するためには
 * <ul>
 * <li>GetDeviceInfo.js
 * </ul>
 * のロードが必要となる<br>
 * <br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 *
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */

/**
 * サポートしているPDLのコレクションを取得する<br>
 * @static
 * @lang ja
 */
SSMILib.GetCustomizeDeviceInfo = function(){
	var arr = [	"productInformation",
					"scannerCapability",
					"printerCapability"];
					//,"PaperTray","PaperTray","PaperTray","PaperTray","PaperTray","PaperTray","PaperTray","PaperTray"];		//TODO 트레이정보 동시 취득 필요시 적용할것
	//var identifier = [	, , , "1", "2", "3", "4", "5", "6", "7", "8"];
	var dev = new SSMILib.DeviceInfo(arr);
	//dev.identifier = identifier;
	dev.requester.successHandler = SSMILib.GetCustomizeDeviceInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetCustomizeDeviceInfo.errorCb;

	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetCustomizeDeviceInfo.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetCustomizeDeviceInfo", false, null);
		return null;
	}
	//var _returnObj = SSMILib.attrNodeToObject(res.responseXML);
	var _returnObj = getNodes(res.responseXML);

	//SSMILib.GetCustomizeDeviceInfoInternal(parseInt(_returnObj.Count));
	SSMILib.onEvent("GetCustomizeDeviceInfo", true, _returnObj);
	return;
	function getNodes(xml){
		var result = {}, tmp, tmp2, name;
		var objs = res.responseXML.querySelectorAll("GetAttributeResponse>Object");
		for(var i=0;i<objs.length;i++){
			tmp = objs[i];
			if(tmp){
				value = tmp.value;
				tmp2=  tmp.attributes["name"];
				if(tmp2){
					name = tmp2.value.replace(/^urn:fujixerox:names:ssm:1.0:management:/,"");
					if(name){
						if(!!result[name]){
							if(!(result[name] instanceof Array)){
								result[name] = [result[name]];
							}
							result[name].push(SSMILib.attrNodeToObject(tmp));
						}
						else{
							result[name] = SSMILib.attrNodeToObject(tmp);
						}
					}
				}
			}
		}
		return result;
	}
};

/**
 * @private
 */
SSMILib.GetCustomizeDeviceInfo.errorCb = function(res)
{
	SSMILib.onEvent("GetCustomizeDeviceInfo", false, null);

	return;
};

/**
 * サポートしているPDLの詳細情報、、アカウンティング情報、プリンター構成を取得する。<br>
 * 情報取得に成功した場合、trueを返す。<br>
 * 情報取得に失敗した場合、falseを返す。<br>
 * @param {int} 取得するPDLの数を指摘する。
 * @return {Object} PDLの詳細情報、アカウント情報、プリンター構成情報オブジェクトの配列
 * @addon
 * @private
 * @lang ja
 */
SSMILib.GetCustomizeDeviceInfoInternal = function(count)
{
	var _objs = new Array();
	var _identifiers = new Array();
	for(var i=1; i< count+1; i++) _objs[i] = "PDL";
	for(var i=1; i< count+1; i++) _identifiers[i] = i;

	//_objs[count+1] = "AccountConfiguration";
	//_objs[count+2] = "printerCapability";
	//_objs[count+3] = "PrintColorModeCapability";//2色カラー対応
	_objs[count+1] = "productInformation";
	_objs[count+2] = "scannerCapability";
	_objs[count+3] = "printerCapability";
	_objs[count+4] = "PaperTray";

	var dev = new SSMILib.DeviceInfo(_objs, "");

	dev.identifier = _identifiers;
	dev.requester.successHandler = SSMILib.GetCustomizeDeviceInfoInternal.successCb;
	dev.requester.errorHandler = SSMILib.GetCustomizeDeviceInfoInternal.errorCb;

	if (SSMILib.dummy) {
		var _returnObj = new Object();

		SSMILib.onEvent("GetCustomizeDeviceInfo", true, _returnObj);
		return;
	}

	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetCustomizeDeviceInfoInternal.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetCustomizeDeviceInfo", false, null);
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
	SSMILib.onEvent("GetCustomizeDeviceInfo", _result, _returnArray);

	return;
};

/**
 * @private
 */
SSMILib.GetCustomizeDeviceInfoInternal.errorCb = function(res)
{
	SSMILib.onEvent("GetCustomizeDeviceInfo", false, null);

	return;
};

