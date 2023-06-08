/** 
 * @fileoverview WebDAV I/Fを用いてデバイスの親展ボックス情報を取得する。<br>
 * 以下のメソッドを提供する。<br>
 * list<br>
 * listDocs<br><br>
 * 使用するには<b>WebDAVLib/WebDAVLib.js</b>を参照すること
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving Mailbox information.<br>
 * Provides the following methods:<br>
 * list<br>
 * listDocs<br><br>
 * To use this file, see <b>WebDAVLib/WebDAVLib.js</b>.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */



/**
 * Mailboxインスタンスを生成する。<br>
 * このコンストラクタを明示的に呼び出すことはない。<br>
 * <a href="WebDAVLib.Mailbox.html#list">WebDAVLib.Mailbox.list</a>メソッドによりこのオブジェクトの配列が取得される。<br>
 * @constructor
 * @class 親展ボックスをあらわすクラス<br>
 * @lang ja
 */
/**
 * Creates Mailbox instance.<br>
 * This constructor is not explicitly called.<br>
 * An array of this object is retrieved when <a href="WebDAVLib.Mailbox.html#list">WebDAVLib.Mailbox.list</a> method is called.<br>
 * @constructor
 * @class Class representing Mailboxes.<br>
 * @lang en
 */
 //Author: Miho Yamada, 
WebDAVLib.Mailbox = function()
{
  /**
   *  親展ボックスの属性をプロパティとして持つオブジェクト。<br>
   *  各プロパティと属性の対応は以下のとおり。<br>
   *  identifier:　親展ボックスID<br>
   *  path:　親展ボックスのパス<br>
   *  displayname:　親展ボックスの表示名<br>
   *  @type Object
   *  @lang ja
   */
  /**
   *  Object with Mailbox attributes set to its properties.<br>
   *  Property/attribute correspondence is as follows.<br>
   *  identifier: Folder ID<br>
   *  path: Mailbox path<br>
   *  displayname: Mailbox display name<br>
   *  @type Object
   *  @default None.
   *  @lang en
   */
  this.prop = new Object();
};

/*
 * @private
*/
WebDAVLib.Mailbox.prototype.getRootPath = function()
{
  var rootPath = "";
  if(WebDAVLib.port != "80"){
    rootPath = WebDAVLib.protocol + WebDAVLib.host + ":" + WebDAVLib.port + "/dav/";
  }
  else{
    rootPath = WebDAVLib.protocol  + WebDAVLib.host + "/dav/";  //Port 80 is omitted in device
  }
  return rootPath;
};

/**
 * 親展ボックス一覧を取得する。<br>
 * 処理が完了すると、コールバック関数として<a href="WebDAVLib.html">WebDAVLib</a>のイベントハンドラを実行する。<br>
 * (ContentsLibを利用する場合には、ContentsLibに登録したイベントハンドラに通知される。)<br>
 * イベントハンドラは以下の形式となる。<br>
 * function("WDlistMailbox", <i>result</i>, <i>obj</i>)<br>
 * 上記"WDlistMailbox"は本メソッドが返すイベント名である。<br>
 * 処理に成功した場合は<i>result</i>にtrue、<i>obj</i>に取得された<a href="WebDAVLib.Mailbox.html#">WebDAVLib.Mailbox</a><br>
 * オブジェクトの配列がセットされる。<br>
 * 各オブジェクトは、表示名(displayname)及びWebDAVパス（path）の情報を含むpropオブジェクトを持つ。<br>
 * 処理に失敗した場合は<i>result</i>にfalse、<i>obj</i>には、通信が失敗した場合はHTTPステータスコードが、<br>
 * 通信は成功したがレスポンスが不正であった場合nullがセットされる。<br>
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox list.<br>
 * When processing is complete, event handler for <a href="WebDAVLib.html">WebDAVLib</a> is run as callback.<br>
 * (When using ContentsLib, event is notified to ContentsLib event handler.)<br>
 * Event handler format and arguments are as follows.<br>
 * function("WDlistMailbox", <i>result</i>, <i>obj</i>)<br>
 * "WDlistMailbox" is event ID for this method.<br>
 * If processing is successful, true is set to <i>result</i>, and array of retrieved <a href="WebDAVLib.Mailbox.html#">WebDAVLib.Mailbox</a><br>
 * objects is set to <i>obj</i>.<br>
 * Each object has prop object with displayname ("displayname" property) and WebDAV path ("path" property).<br>
 * If processing fails, false is set to <i>result</i>. HTTP status code is set to <i>obj</i> if error occurs in communication, <br>
 * and null is set to <i>obj</i> if communication is successful but response is corrupt.
 * @addon
 * @static
 * @lang en
 */
  //Author: Miho Yamada, Fuji Xerox Co., Ltd.
WebDAVLib.Mailbox.prototype.list = function() 
{
  var op_path = this.getRootPath();
  //Retrieve displayname per path
  var msg = '<?xml version="1.0" encoding="utf-8" ?><D:propfind xmlns:D="DAV:"><D:prop><D:displayname/></D:prop></D:propfind>';
  var _ws = new WebServiceLib.Communicator();
  _ws.method = "PROPFIND";
  _ws.headers[0] = "Depth";
  _ws.headers[1] = "1"; 
  _ws.headers[2] = "Content-Length";
  _ws.headers[3] = "100"; 
  _ws.errorHandler = WebDAVLib.Mailbox.prototype.list.errorCb;
  _ws.successHandler = WebDAVLib.Mailbox.prototype.list.successCb;
  _ws.send(op_path, msg);
  return;
};
/**
 * @private
 */
WebDAVLib.Mailbox.prototype.list.successCb = function(requester)
{
  var _mbList = null;
  var _result = false;
  if(!requester.responseXML) {
    WebDAVLib.onEvent("WDlistMailbox", _result, _mbList);
    return;
  }
  //Array of response nodes
  var _resNodes = requester.responseXML.getElementsByTagNameNS("DAV:", "response");
  var resLen = _resNodes.length;
  //Prepare MailboxList array
  _mbList = new Array();
  //Nodes retrieved in order of appearance in document tree.
  //1st node is root node so start loop with index 1
  for(var i = 1; i < resLen; i++){
    var _resObject = XMLLib.childNodeToProperty(_resNodes[i]);
    var _mb = new WebDAVLib.Mailbox();
    _mb.prop.path = _resObject.href;  //Set Mailbox path
    _mb.prop.displayname = _resObject.propstat.prop.displayname;  //Set displayname
    var mbId = "";
    if(_resObject.href){
      var mbIdStart = _resObject.href.lastIndexOf("-");
      var mbIdEnd = _resObject.href.lastIndexOf("/");
      mbId = _resObject.href.substring(mbIdStart+1, mbIdEnd);
    }
    _mb.prop.identifier = mbId;
    _mbList.push(_mb);
  }
  _result = true;
  //Run event listener function
  WebDAVLib.onEvent("WDlistMailbox", _result, _mbList);
};
  

/**
 * @private
 */
WebDAVLib.Mailbox.prototype.list.errorCb = function(requester)
{
  var _status = requester.status;
  var _result = false;
  WebDAVLib.onEvent("WDlistMailbox", _result, _status);
  return;
};

/**
 * 親展ボックス内文書一覧を取得する。<br>
 * 処理が完了すると、コールバック関数として<a href="WebDAVLib.html">WebDAVLib</a>のイベントハンドラを実行する。<br>
 * イベントハンドラは以下の形式となる。<br>
 * function("WDlistDocs", <i>result</i>, <i>obj</i>)<br>
 * 上記"WDlistDocs"は本メソッドが返すイベント名である。<br>
 * 処理に成功した場合は<i>result</i>にtrue、<i>obj</i>に取得された<a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a><br>
 * オブジェクトの配列がセットされる。<br>
 * 各オブジェクトは、文書の属性をpropオブジェクトとして有する。<br>
 * プロパティと属性の対応については<a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a>の項を参照。<br>
 * 処理に失敗した場合は<i>result</i>にfalse、<i>obj</i>には、通信が失敗した場合はHTTPステータスコードが、<br>
 * 通信は成功したがレスポンスが不正であった場合nullがセットされる。<br>
 * user/passに設定すべき値は、別紙WebDAV外部仕様書を参照のこと。<br>
 * @param {String} user 親展ボックスにアクセスするユーザのユーザ名
 * @param {String} password 親展ボックスにアクセスするユーザのパスワード
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves document information list in Mailbox.<br>
 * When processing is complete, event handler for <a href="WebDAVLib.html">WebDAVLib</a> is run as callback.<br>
 * Event handler format and arguments are as follows.<br>
 * function("WDlistDocs", <i>result</i>, <i>obj</i>)<br>
 * "WDlistDocs" is event ID for this method.<br>
 * If processing is successful, true is set to <i>result</i>, and array of retrieved <a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a><br>
 * objects is set to <i>obj</i>.<br>
 * Each object has prop object containing document attribute information.<br>
 * See specification on <a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a> for information on property/attribute correspondence.<br>
 * If processing fails, false is set to <i>result</i>. HTTP status code is set to <i>obj</i> if error occurs in communication, <br>
 * and null is set to <i>obj</i> if communication is successful but response is corrupt.
 * See WebDAV I/F external specifications for values to set for user/pass.<br>
 * @param {String} user String representing user name for Mailbox access
 * @param {String} password String representing password for Mailbox access
 * @addon
 * @static
 * @lang en
 */
WebDAVLib.Mailbox.prototype.listDocs = function(user, pass)
{
  var op_path = this.prop.path;
  //Retrieve displayname and origin per path 
  var msg = '<?xml version="1.0" encoding="utf-8" ?><D:propfind xmlns:D="DAV:" xmlns:sss="http://www.fujifilm.com/fb/2021/04/ssm/storageService"><D:prop><D:displayname/><sss:Origin/></D:prop></D:propfind>';
  var _ws = new WebServiceLib.Communicator();
  if(user || pass)
  {
    _ws.user = user;
    _ws.password = pass;
  }
  _ws.method = "PROPFIND";
  _ws.headers[0] = "Depth";
  _ws.headers[1] = "1"; 
  _ws.headers[2] = "Content-Length";
  _ws.headers[3] = "100"; 
  _ws.headers[4] = "X-Printdocument";
  _ws.headers[5] = "On";  
  _ws.errorHandler = this.listDocs.errorCb;
  _ws.successHandler = this.listDocs.successCb;
  _ws.send(op_path, msg);
  return;
};
/**
 * @private
 */
WebDAVLib.Mailbox.prototype.listDocs.successCb = function(requester)
{
  //Prepare docList arrays and boolean result to return
  var _docList = null;
  var _result = false;
  if(!requester.responseXML) {
    WebDAVLib.onEvent("WDlistDocs", _result, _docList);
    return;
  }
  //Array of response nodes
  var _resNodes = requester.responseXML.getElementsByTagNameNS("DAV:", "response");
  var resLen = _resNodes.length;
  //Set array instance to docList
  _docList = new Array();
  //Nodes retrieved in order of appearance in document tree.
  //1st node is Mailbox node so start loop with index 1
  for(var i = 1; i < resLen; i++){
    var _resObject = XMLLib.childNodeToProperty(_resNodes[i]);
    //Loop to create document objects
    var _doc = new WebDAVLib.Docfile();
    _doc.prop = _resObject.propstat.prop;//Set document property object
    _doc.prop.path = _resObject.href; //Set document path
    var docId = null;
    if(_resObject.href){
      var docIdStart = _resObject.href.lastIndexOf("/");
      var docIdEnd = _resObject.href.lastIndexOf(".");
      docId = _resObject.href.substring(docIdStart+1, docIdEnd);
    }
    _doc.prop.identifier = docId;
    _docList.push(_doc);
  }
  _result = true;
  //Run event listener function
  WebDAVLib.onEvent("WDlistDocs", _result, _docList);
};
  

/**
 * @private
 */
WebDAVLib.Mailbox.prototype.listDocs.errorCb = function(requester)
{
  var _status = requester.status;
  var _result = false;
  WebDAVLib.onEvent("WDlistDocs", _result, _status);
  return;
};