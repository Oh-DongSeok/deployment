/**
 * @fileoverview デバイスから利用可能な位置と機能を取得するためのクラス定義<br>
 * 利用可能な位置と機能の取得に関して以下のメソッドを提供する<br>
 * GetSupportedFunctionLayout<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
/**
 * @fileoverview Defines classes for retrieving positions and functions available in specified Function Layout from device.<br>
 * The following methods are provided:<br>
 * GetSupportedFunctionLayout<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * SupportedFunctionLayoutインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class 利用可能な位置と機能の取得のためのクラス
 * @lang ja
 */
/**
 * Creates SupportedFunctionLayout instance
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving available positions and functions
 * @lang en
 */
SSMILib.SupportedFunctionLayout = function()
{
	/**
	 * レイアウトグループ名称<br>
	 * サービスセレクトボタン	: "ServiceSelectButton"<br>
	 * ユーティリティボタン	: "UtilityButton"<br>
	 * 登録Nキー			: "CustomizeKey"<br>
	 * 初期表示画面		: "DefaultScreen"<br>
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Layout group name<br>
	 * Service selection button: "ServiceSelectButton"<br>
	 * Utility button: "UtilityButton"<br>
	 * Custom Keys: "CustomizeKey"<br>
	 * Screen default: "DefaultScreen"<br>
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.layoutGroup = "";
}

/**
 * @private
 */
Extend(SSMILib.SupportedFunctionLayout.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.SupportedFunctionLayout.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var flNs = "http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout";
	xml.addNSPrefix(flNs, "fl");

	var _node = body.appendChild(xml.createElementNS(flNs, "GetSupportedFunctionLayout"));
	xml.addNSDeclaration(flNs, _node, true);

	if(this.layoutGroup){
		var _layoutGroup = _node.appendChild(xml.createElement("LayoutGroup"));
		_layoutGroup.appendChild(xml.createTextNode(this.layoutGroup));
	}

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
}

/**
 * 利用可能な位置と機能を取得する。
 * 取得に成功すると、利用可能な位置の一覧、利用可能な機能名の一覧の配列を返す。<br>
 * コールバック関数に返されるオブジェクト obj[0]に位置の一覧、obj[1]に機能名の一覧が格納される。<br>
 * 詳細は「02-09 SESAMi Service Management Interface Specification_FunctionLayout.doc」を参照
 * @param {String} layoutGroup レイアウトグループ名称
 * @return {Bool} 取得の成功、失敗
 * @static
 * @lang ja
 */
/**
 * Retrieves available positions and functions.
 * If retrieval is successful, returns object via callback function containing array of positions and functions.<br>
 * The first array (obj[0]) is array of positions, and second array (obj[1]) is array of function names.<br>
 * @param {String} layoutGroup Layout group name
 * @static
 * @lang en
 */
SSMILib.GetSupportedFunctionLayout = function(layoutGroup)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetSupportedFunctionLayout.successCb;
	_ws.errorHandler = SSMILib.GetSupportedFunctionLayout.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout#GetSupportedFunctionLayout"';
	_ws.isDeviceReq = true;

	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/FunctionLayout";

	var _supportedFl = null;
	if(!layoutGroup){
		SSMILib.onEvent("GetSupportedFunctionLayout", false, null);
		return;
	}else{
		_supportedFl = new SSMILib.SupportedFunctionLayout();
		_supportedFl.layoutGroup = layoutGroup;
	}

	var _msg = _supportedFl.serializeToString();
	_ws.send(_targetURL, _msg);
	return;
}

/**
 * @private
 * @return {array} _supportedFlList Positions情報配列とFunctions情報配列を包含する配列
 * 					0番目の要素はPositions情報
 * 					1番目の要素はFunctions情報
 * @lang ja
 */
/**
 * @private
 * @return {array} _supportedFlList Array which includes Positions information array and Functions information array
 * 					The 0th element is Positions information array.
 * 					The 1st element is Functions information array.
 * @lang en
 */
SSMILib.GetSupportedFunctionLayout.successCb = function(res)
{
	var _positionsList = null;
	var _functionsList = null;
	var _supportedFlList = null;
	var _result = false;

	if(!res.responseXML){
		SSMILib.onEvent("GetSupportedFunctionLayout", _result, _supportedFlList);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout", "Positions");
	if(_resNode && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_positionsList = new Array();
		for(var i = 0; i < _resNodeLen; i++){
			var _node = _resNode[0].childNodes[i];
			//nodeType = 1(element), 2(attribute), 3(text), 4(CDATA)....
			if(_node.nodeType != 1 || !_node.hasChildNodes()){//ELEMENT_NODE以外、不要なノードは除外
				continue;
			}
			_positionsList.push(SSMILib.childNodeToProperty(_node));
		}
		_result = true;
	}

	_resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout", "Functions");
	if(_resNode && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_functionsList = new Array();
		for(var i = 0; i < _resNodeLen; i++){
			var _node = _resNode[0].childNodes[i];
			//nodeType = 1(element), 2(attribute), 3(text), 4(CDATA)....
			if(_node.nodeType != 1 || !_node.hasChildNodes()){//ELEMENT_NODE以外、不要なノードは除外
				continue;
			}
			_functionsList.push(SSMILib.childNodeToProperty(_node));
		}
		_result = true;
	}

	_supportedFlList = new Array();
	_supportedFlList.push(_positionsList);
	_supportedFlList.push(_functionsList);

	SSMILib.onEvent("GetSupportedFunctionLayout", _result, _supportedFlList);
	return;
}

/**
 * @private
 */
SSMILib.GetSupportedFunctionLayout.errorCb = function(res)
{
	SSMILib.onEvent("GetSupportedFunctionLayout", false, null);
	return;
}