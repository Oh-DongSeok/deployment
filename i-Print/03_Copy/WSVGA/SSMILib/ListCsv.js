/** 
 * @fileoverview カスタムサービスの一覧・属性一覧取得のためのクラス定義<br>
 * カスタム・サービス一覧取得に関して以下のメソッドを提供する<br>
 * ListCsv<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.1.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving Custom Service / properties list.<br>
 * The following methods are provided for retrieving Cusotm Service list:<br>
 * ListCsv<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.1.1
 * @lang en
 */

/**
 * CsvListインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class カスタム・サービスの一覧取得のためのクラス
 * @private
 * @lang ja
 */
/**
 * Creates CsvList instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving Custom Service list.
 * @private
 * @lang en
 */
SSMILib.CsvList = function()
{
	/**
	 * 取得するカスタム・サービス名
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Name of Custom Service to retrieve.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.name = "";
	
	/**
	 * 取得開始するカスタム・サービス名を指定
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Name of Custom Service from which to start list retrieval.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.scopeFrom = "";
	
	/**
	 * 取得開始するカスタム・サービス名を指定<br>
	 * 指定されたカスタム・サービス名の直後のカスタム・サービス名から取得
	 * @type String
	 * @default null
	 * @lang ja
 	 */
	/**
	 * Name of Custom Service immediately preceding that from which to start list.<br>
	 * @type String
	 * @default null
	 * @lang en
 	 */
	this.scopeAfter = "";
	
	/**
	 * 取得するカスタム・サービス数を指定
	 * @type int
	 * @default null
	 * @lang ja
	 */
	/**
	 * Number of Custom Services to list.
	 * @type int
	 * @default null
	 * @lang en
	 */
	this.scopeCount = "";
}

/**
 * private
 */
Extend(SSMILib.CsvList.prototype, XMLLib.SOAPMsg.prototype);

/**
 * private
 */
SSMILib.CsvList.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	
	var csvNs = "http://www.fujifilm.com/fb/2021/01/ssm/management/csv";
	var mgt3Ns = "http://www.fujifilm.com/fb/2021/02/ssm/management";
	xml.addNSPrefix(csvNs, "csv");
	xml.addNSPrefix(mgt3Ns, "mgt3");
	
	var _listCsvNode = body.appendChild(xml.createElementNS(csvNs, "ListCsv"));
	xml.addNSDeclaration(csvNs, _listCsvNode, true);

	if(this.name){
		var _name = _listCsvNode.appendChild(xml.createElement("Name"));
		_name.appendChild(xml.createTextNode(this.name));		
	}
	
	if(this.scopeFrom || this.scopeAfter || this.scopeCount){
		var _scopeNode = _listCsvNode.appendChild(xml.createElementNS(mgt3Ns, "Scope"));
		xml.addNSDeclaration(mgt3Ns, _scopeNode, true);
		if(this.scopeCount){
			_scopeNode.setAttribute("count", this.scopeCount);
		}
		if(this.scopeFrom){
			_scopeNode.setAttribute("from", this.scopeFrom);
		}
		if(this.scopeAfter){
			_scopeNode.setAttribute("after", this.scopeAfter);
		}
	}
	
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
}

/**
 * カスタム・サービス一覧とカスタム・サービス属性の一覧を取得する。<br>
 * 取得に成功するとカスタム・サービス名などをプロパティとしてもつオブジェクトが返される。<br>
 * プロパティ名が重複する場合、プロパティは配列となる。<br>
 * obj["Description"][0], obj["Description"][1]... <br><br>
 * IconLabelMulti：多言語のIconLabel。lang(言語コード), value(対応文字列）プロパティを持つ。<br>
 * DescriptionMulti : 多言語のDescription。lang(言語コード), value(対応文字列）プロパティを持つ。<br>
 * LibInfo：カスタム・サービス・ライブラリのバージョンをあらわす。Version,Valueプロパティを持つ。<br>
 * その他のプロパティの詳細は「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.doc 1.カスタム・サービス・スクリプト管理機能」を参照<br>
 * 取得範囲の指定が無い場合は全て取得し, 指定がある場合は name > from > after の順で優先される。<br>
 * countの指定なし, または0を指定した場合は条件に一致するものを全て取得する。<br>
 *
 * @param {String} name 取得するカスタム・サービス名
 * @param {int} count 取得するカスタム・サービス数
 * @param {String} from 取得開始するカスタム・サービス名
 * @param {String} after 取得開始するカスタム・サービス名(指定されたカスタム・サービスの直後から取得)
 * @lang ja
 */
 /**
 * Retrieves list of Custom Services and properties thereof.<br>
 * If list is successfully retrieved, list of objects each containing properties representing attributes such as Custom Service name, etc., is returned.<br>
 * Attributes whose names overlap are returned in array form.<br>
 * Example: obj["Description"][0], obj["Description"][1]... <br><br>
 * IconLabelMulti: Object representing Icon Labels for localization, with properties "lang" (representing language code) and "value" (representing Icon Label string).<br>
 * DescriptionMulti: Object representing Description for localization, with properties "lang" (representing language code) and "value" (representing Description string).<br>
 * LibInfo: Object representing Custom Service Library version, with properties "Version" and "Value."<br>
 * See "02-06 SESAMi Service Management Interface Specification_CustomServiceScript.pdf" for details on other properties.<br>
 * If scope of list retrieval is not specified, list of all Custom Services is retrieved; otherwise, scope specification is prioritized in the following order: name > from > after.<br>
 * If "count" is not specified or 0 is specified as its value, all Custom Services that match the specified conditions are retrieved.<br>
 * @param {String} name Custom Service name.
 * @param {int} count Number of Custom Services to list.
 * @param {String} from Name of Custom Service from which to start list.
 * @param {String} after Name of Custom Service immediately preceding that from which to start list.
 * @lang en
 */
SSMILib.ListCsv = function(name, count, from, after)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.ListCsv.successCb;
	_ws.errorHandler = SSMILib.ListCsv.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/csv#ListCsv"';
	_ws.isDeviceReq = true;
	
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	
	if(SSMILib.dummy) {
		var _listCsv = new Array();
		_listCsv = [{
			Name 				: 	"testFolder01",
			Description			: 	"This is test",
			VendorName 			: 	"Fuji Xerox",
			IsNative			: 	true,
			SmallIconUrl		:	"http://localhost/cs/testFolder01/info/smallicon.png",
			LargeIconUrl		:	"http://localhost/cs/testFolder01/info/largeicon.png",
			URL					:	"http://localhost/cs/testFolder01/index.html",
			DescriptionUrl		:	"http://localhost/cs/testFolder01/info/csinfo.xml",
			IsDisabled			:	false,
			Index				:	"4",//カスタム・サービスの登録インデクス値
			StartTiming			:	
			{
				Timing			:	"Opening"
			},
			DisplayMode			:
			{
				ToolBar			:	false,
				StatusBar		:	true
			},
			AuthInformation		:
			{
				Source			:	"RegisteredInfo",
				User			:	""
			},
			SendInformation		:
			{
				Status			:	false	
				//Type			:	"Public" //Statusがtrueの時に存在し得る要素
			},
			SendAuthorizedRight	:	false,
			ServiceAccessRule	:
			{
				Authenticate	:	true,
				Visible			:	true
			}
		}];

		SSMILib.onEvent("ListCsv", true, _listCsv);
		return;
	}

	var _csv = null;
	if(name){
		_csv = new SSMILib.CsvList();
		_csv.name = name;
	}else{
		_csv = new SSMILib.CsvList();
		if(count){
			_csv.scopeCount = count;
		}

		if(from){
			_csv.scopeFrom = from;
		}else{
			if(after){
				_csv.scopeAfter = after;
			}
		}
	}

	var _msg = _csv.serializeToString();
	_ws.send(_targetURL, _msg);
	return;
}

/**
 * @private
 */
SSMILib.ListCsv.successCb = function(res)
{
	var _listCsv = null;
	var _result = false;

	if(!res.responseXML){
		SSMILib.onEvent("ListCsv", _result, _listCsv);
		return;
	}

	var _faultNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2020/12/ssm/management", "Fault");
	if(_faultNode.length){
		SSMILib.onEvent("ListCsv", false, null);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/01/ssm/management/csv", "ListCsvResponse");
	if(_resNode && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_listCsv = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _csvNode = _resNode[0].childNodes[i];
			if (_csvNode.nodeType != 1 || !_csvNode.hasChildNodes()) {//ELEMENT以外また不要なノードは除外する。
				continue;
			}
			_listCsv.push(SSMILib.ListCsv.getChildNodeToObject(_csvNode));
		}
		_result = true;
	}

	SSMILib.onEvent("ListCsv", _result, _listCsv);
	return;	
}

/**
 * 指定したノードの子要素を取得しオブジェクト化する。
 * @param {Node} node ノードを指定する。
 * @return {array} 指定したノードに子要素を配列形式で返す。
 *                 DMP-Xの場合、csinfo.xmlとcsProp.xmlのデータを取得するが、既存の要素名(例：Description)と重なった場合、 同名の要素は配列で保持される。
 *                 例えば、DescriptionとDescription(prop:Description)は
 *                 配列要素obj["Description"][0]、obj["Description"][1]で返される。
 * @private
 */
SSMILib.ListCsv.getChildNodeToObject = function(node)
{
	if(!node){
		return null;
	}

	var _arrList = new Array();
	for(var i=0; i<node.childNodes.length; i++){
		var child = node.childNodes[i];
		if(child.nodeType == 1 && child.nodeName){//ELEMENT_NODE
			if(_arrList[child.localName] != null){//同名のオブジェクトがある場合
				if(_arrList[child.localName] && typeof _arrList[child.localName] == 'object' && _arrList[child.localName].length > 0){
					_arrList[child.localName].push(SSMILib.ListCsv.childNodeToProperty(child));//配列に追加する。
				}else{
					//配列を生成し、既存値を保持する。
					var firstData = _arrList[child.localName];
					_arrList[child.localName] = new Array();
					_arrList[child.localName].push(firstData);
					_arrList[child.localName].push(SSMILib.ListCsv.childNodeToProperty(child));
				}
			}else{
				_arrList[child.localName] = SSMILib.ListCsv.childNodeToProperty(child);
			}
		}
	}
	return _arrList;
}

/**
 * ノードの属性値の取得のため、XMLLib.childNodeToPropertyをこのファイルで再定義する。
 * 他の属性は無視し、version属性だけ取得する仕組みである。
 * @param {Node} node ノードを指定する。
 * @returns {Object} 指定したノードにテキストノード以外の複数の子要素が存在する場合
 * @returns {String} 指定したノードにテキストノードしか存在しない場合
 * @private
 */
SSMILib.ListCsv.childNodeToProperty = function(node)	
{
	if(!node){
		return "";
	}

	var _childNodeLen = node.childNodes.length;
	var _childNode = null;

	if(_childNodeLen == 0){//下位ノート(チャイルドノード)がないエレメントの場合(例：<VendorName/>)
		return "";
	}else if(_childNodeLen == 1 && node.firstChild && node.firstChild.nodeType == 3){//TEXT_NODE
		return node.firstChild.nodeValue;
	}else{
		var object = new Object();
		if(node.localName == "ServiceDescription"){//カスタムサービススクリプト情報ファイルのServiceDescription要素
			return SSMILib.ListCsv.getSrvcDescNodeValue(node);
		}
		for(var i=0; i<_childNodeLen; i++){
			_childNode = node.childNodes[i];
			if(_childNode.nodeType == 1  && _childNode.nodeName){//ELEMENT_NODE
				if(_childNode.firstChild){
					if(object[_childNode.localName] == null){
						object[_childNode.localName] = SSMILib.ListCsv.childNodeToProperty(_childNode);
					}
					//プロパティファイルのDescription要素のReferenceのversion属性の取得
					if(_childNode.localName == "LibInfo" && _childNode.attributes.length > 0 && _childNode.attributes.getNamedItem('version')){
						var value = object[_childNode.localName];
						object[_childNode.localName] = {};
						object[_childNode.localName]["Value"] = value;
						object[_childNode.localName]["Version"] = _childNode.attributes.getNamedItem('version').nodeValue;
					}
				}else{
					object[_childNode.localName] = "";
				}
			}
		}
		return object;
	}
};

/**
 * カスタムサービススクリプト情報ファイルのServiceDescription要素多言語対応
 * @private
 */
SSMILib.ListCsv.getSrvcDescNodeValue = function(node)
{
	var object = new Object();

	//IconLabel
	var iconLabelNodes = node.getElementsByTagName("IconLabel");
	var isExistDefaultNode = false;
	for(var i=0; i<iconLabelNodes.length; i++){
		var childNode = iconLabelNodes[i];
		if(childNode.nodeType == 1){
			var value = SSMILib.ListCsv.childNodeToProperty(childNode);
			if(childNode.attributes.length == 0){
				object["IconLabel"] = value;
				isExistDefaultNode = true;
			}else{
				if(object["IconLabelMulti"] == null){
					object["IconLabelMulti"] = new Array();
				}
				var obj = {};
				obj.lang = childNode.attributes[0].value;
				obj.value = value;
				object["IconLabelMulti"].push(obj);
			}
		}
	}
	if((iconLabelNodes.length) && !isExistDefaultNode){//デフォルトIconLabelエレメント自体がない場合
		object["IconLabel"] = "";
	}

	//Description
	var descLabelNodes = node.getElementsByTagName("Description");
	isExistDefaultNode = false;
	for(var i=0; i<descLabelNodes.length; i++){
		var childNode = descLabelNodes[i];
		if(childNode.nodeType == 1){
			var value = SSMILib.ListCsv.childNodeToProperty(childNode);
			if(childNode.attributes.length == 0){
				object["Description"] = value;
				isExistDefaultNode = true;
			}else{
				if(object["DescriptionMulti"] == null){
					object["DescriptionMulti"] = new Array();
				}
				var obj = {};
				obj.lang = childNode.attributes[0].value;
				obj.value = value;
				object["DescriptionMulti"].push(obj);
			}
		}
	}
	if((descLabelNodes.length > 0) && !isExistDefaultNode){//デフォルトDescriptionエレメント自体がない場合
		object["Description"] = "";
	}

	return object;
}

/**
 * @private
 */
SSMILib.ListCsv.errorCb = function(res)
{
	var _listCsv = null;
	var _result = false;

	SSMILib.onEvent("ListCsv", _result, _listCsv);
	return;
}