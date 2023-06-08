/**
 * @fileoverview デバイスから機能のレイアウトを取得するためのクラス定義<br>
 * 機能のレイアウトの取得に関して以下のメソッドを提供する<br>
 * GetFunctionLayout<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
/**
 * @fileoverview Defines classes for retrieving function layout from device.<br>
 * The following methods are provided:<br>
 * GetFunctionLayout<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * FunctionLayoutインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class 機能レイアウトの取得のためのクラス
 * @lang ja
 */
/**
 * Creates FunctionLayout instance
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving function layout
 * @lang en
 */
SSMILib.FunctionLayout = function()
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
Extend(SSMILib.FunctionLayout.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.FunctionLayout.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var flNs = "http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout";
	xml.addNSPrefix(flNs, "fl");

	var _node = body.appendChild(xml.createElementNS(flNs, "GetFunctionLayout"));
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
 * 機能レイアウトを取得する。<br>
 * 取得に成功すると、指定したレイアウトグループに設定されているレイアウトの
 * 位置と機能名の配列が返される。<br>
 * 詳細は「02-09 SESAMi Service Management Interface Specification_FunctionLayout.pdf」を参照
 * @param {String} layoutGroup レイアウトグループ名称
 * @return {Bool} 取得の成功、失敗
 * @static
 * @lang ja
 */
/**
 * Retrieves function layout.
 * If retrieval is successful, array of positions and functions set to specified layout group is returned.<br>
 *  See "02-09 SESAMi Service Management Interface Specification_FunctionLayout.pdf" for details.
 * @param {String} layoutGroup Layout group name
 * @static
 * @lang en
 */
SSMILib.GetFunctionLayout = function(layoutGroup)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetFunctionLayout.successCb;
	_ws.errorHandler = SSMILib.GetFunctionLayout.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout#GetFunctionLayout"';
	_ws.isDeviceReq = true;

	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/FunctionLayout";

	var _functionLayoutObj = null;
	if(!layoutGroup){
		SSMILib.onEvent("GetFunctionLayout", false, null);
		return;
	}else{
		_functionLayoutObj = new SSMILib.FunctionLayout();
		_functionLayoutObj.layoutGroup = layoutGroup;
	}

	var _msg = _functionLayoutObj.serializeToString();
	_ws.send(_targetURL, _msg);
	return;
}

/**
 * @private
 */
SSMILib.GetFunctionLayout.successCb = function(res)
{
	var _functionLayoutList = null;
	var _result = false;

	if(!res.responseXML){
		SSMILib.onEvent("GetFunctionLayout", _result, _functionLayoutList);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/functionLayout", "GetFunctionLayoutResponse");
	if(_resNode && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_functionLayoutList = new Array();
		for(var i = 0; i < _resNodeLen; i++){
			var _node = _resNode[0].childNodes[i];
			//nodeType = 1(element), 2(attribute), 3(text), 4(CDATA)....
			if(_node.nodeType != 1 || !_node.hasChildNodes()){//ELEMENT_NODE以外、不要なノードは除外
				continue;
			}
			_functionLayoutList.push(SSMILib.childNodeToProperty(_node));
		}
		_result = true;
	}

	SSMILib.onEvent("GetFunctionLayout", _result, _functionLayoutList);
	return;
}

/**
 * @private
 */
SSMILib.GetFunctionLayout.errorCb = function(res)
{
	SSMILib.onEvent("GetFunctionLayout", false, null);
	return;
}