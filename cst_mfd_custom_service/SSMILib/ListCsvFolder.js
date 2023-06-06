/**
 * @fileoverview カスタムサービス一覧取得のためのクラス定義<br>
 * 以下のメソッドを提供する<br>
 * ListCsvFolder<br><br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for listing Custom Services.<br>
 * Provides the following methods:<br>
 * ListCsvFolder
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */
 
/**
 * CsvFolderインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @private
 * @class カスタムサービス一覧取得のためのクラス
 * @lang ja
 */
 /**
 * Creates CsvFolder instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @private
 * @class Class for listing Custom Services.
 * @lang en
 */
SSMILib.CsvFolder = function()
{
  /**
   * カスタムサービス名を指定する
   * @type String
   * @default null
   * @lang ja
   */
   /**
   * Custom Service name
   * @type String
   * @default null
   * @lang en
   */
  this.name = "";
  
  /**
   * 取得開始するカスタムサービス名を指定する。
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
   * 取得開始するカスタム・サービス名を指定する。指定されたカスタム・サービス名の直後のカスタム・サービスから取得
   * @type String
   * @default null
   * @lang ja
   */
   /**
   * Name of Custom Service immediately preceding that from which to start list.
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
};

/**
 * @private
 */
Extend(SSMILib.CsvFolder.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.CsvFolder.prototype.createMsg = function()
{
  var xml = new XMLLib.XMLSOAP();
  var root = xml.createSOAPEnvelope();
  var env = root;
  var body = xml.body;
  
  var csvNs = "http://www.fujixerox.co.jp/2007/07/ssm/management/csv";
  var mgt3Ns = "http://www.fujixerox.co.jp/2007/07/ssm/management";
  xml.addNSPrefix(csvNs, "csv");
  xml.addNSPrefix(mgt3Ns, "mgt3");
  
  var _listCsvFolderNode = body.appendChild(xml.createElementNS(csvNs, "ListCsvFolder"));
  xml.addNSDeclaration(csvNs, _listCsvFolderNode, true);

  if(this.name){
    var _folderName = _listCsvFolderNode.appendChild(xml.createElement("FolderName"));
    _folderName.appendChild(xml.createTextNode(this.name));   
  }
  
  if(this.scopeFrom || this.scopeAfter || this.scopeCount){
    var _scopeNode = _listCsvFolderNode.appendChild(xml.createElementNS(mgt3Ns, "Scope"));
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
};

/**
 * カスタム・サービスの一覧を取得する。<br>
 * 取得に成功するとカスタム・サービス名などをプロパティとしてもつオブジェクトの一覧が返る。プロパティの詳細は「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 1.カスタム・サービス・スクリプト管理機能」を参照<br>
 * 使用できるユーザーは管理者(KO)のみである。<br>
 * 取得範囲の指定が無い場合は全て取得し, 指定がある場合は name > from > after の順で優先される。<br>
 * countの指定なし, または0を指定した場合は条件に一致するものを全て取得する。<br>
 * @param {String} name 取得するカスタム・サービス名
 * @param {int} count 取得するカスタム・サービス数
 * @param {String} from 取得開始するカスタム・サービス名
 * @param {String} after 取得開始するカスタム・サービス名(指定されたカスタム・サービス名の直後のフォルダから取得)
 * @lang ja
 */
/**
 * Retrieves Custom Service list.<br>
 * If list is successfully retrieved, list of objects each containing properties representing attributes such as Custom Service name, etc., is returned. See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details on properties.<br>
 * Only system administrator (KO user) can use this method.<br>
 * If scope of list retrieval is not specified, list of all Custom Services is retrieved; otherwise, scope specification is prioritized in the following order: name > from > after.<br>
 * If "count" is not specified or 0 is specified as its value, all Custom Services that match the specified conditions are retrieved.<br>
 * @param {String} name Custom Service name.
 * @param {int} count Number of Custom Services to list.
 * @param {String} from Name of Custom Service from which to start list.
 * @param {String} after Name of Custom Service immediately preceding that from which to start list.
 * @lang en
 */
SSMILib.ListCsvFolder = function(name, count, from, after)
{
  var _ws = new WebServiceLib.Communicator();
  _ws.async = SSMILib.async;
  _ws.successHandler = SSMILib.ListCsvFolder.successCb;
  _ws.errorHandler = SSMILib.ListCsvFolder.errorCb;
  _ws.soapAction = '"http://www.fujixerox.co.jp/2007/07/ssm/management/csv#ListCsvFolder"';
  _ws.isDeviceReq = true;
  
  var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
  
  if(SSMILib.dummy) {
    var _listCsvFolder = new Array();
    _listCsvFolder = [{
      Name : "src01",
      State : "ready",
    }];

    SSMILib.onEvent("ListCsvFolder", true, _listCsvFolder);
    return;
  }
  
  var _csvFolder = null;
  if(name){
    _csvFolder = new SSMILib.CsvFolder();
    _csvFolder.name = name;
  }else{
    _csvFolder = new SSMILib.CsvFolder();
    if(count){
      _csvFolder.scopeCount = count;
    }
    
    if(from){
      _csvFolder.scopeFrom = from;
    }else{
      if(after){
        _csvFolder.scopeAfter = after;
      }
    }
  }

  var _msg = _csvFolder.serializeToString();
  _ws.send(_targetURL, _msg);
  return;
};

/**
 * @private
 */
SSMILib.ListCsvFolder.successCb = function(res)
{
  var _listCsvFolder = null;
  var _result = false;
  if(!res.responseXML){
    SSMILib.onEvent("ListCsvFolder", _result, _listCsvFolder);
    return;
  }
  
  var _faultNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2003/12/ssm/management", "Fault");
  if(_faultNode.length){
    SSMILib.onEvent("ListCsvFolder", false, null);
    return;
  }
  
  var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2007/07/ssm/management/csv", "ListCsvFolderResponse");
  if(_resNode && _resNode[0].hasChildNodes()){
    var _resNodeLen = _resNode[0].childNodes.length;
    _listCsvFolder = new Array();
    for (var i = 0; i < _resNodeLen; i++){
      var _csvFolderNode = _resNode[0].childNodes[i];
      
      //nodeType = 1(element), 2(attribute), 3(text) , 4(CDATA)....
      if (_csvFolderNode.nodeType != 1 || !_csvFolderNode.hasChildNodes()) {//ELEMENT_NODE以外、不要なノードを飛ばす
        continue;
      }
      
      _listCsvFolder.push(SSMILib.childNodeToProperty(_csvFolderNode));
    }
    _result = true;
  }
  
  SSMILib.onEvent("ListCsvFolder", _result, _listCsvFolder);
  return;
};

/**
 * @private
 */
SSMILib.ListCsvFolder.errorCb = function(res)
{
  var _listCsvFolder = null;
  var _result = false;

  SSMILib.onEvent("ListCsvFolder", _result, _listCsvFolder);
  return;
};