/** 
 * @fileoverview WebDAV I/F利用のためのクラス定義<br>
 * WebDAV I/F利用のために必要な基本となるクラスが定義される<br>
 * WebDAVLibを使用する際には、本ライブラリを必ず最初にロードすること。<br>
 * 使用するためには
 * <ul>
 * <li>DependLib/BrowserExt.js
 * <li>WSLib/WebServiceLib.js
 * <li>ToolsLib/XML.js
 * </ul>
 * をロードする必要がある。<br><br>
 * ContentsLibを利用する場合には、ContentsLib/ContentsLib.jsの前に
 * <ul>
 * <li>WebDAVLib/WebDAVLib.js
 * </ul>
 * をロードする必要がある。
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.0.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for using WebDAV I/F.<br>
 * Defines basic classes necessary for using WebDAV I/F.<br>
 * To use WebDAVLib, this library must be loaded first.<br>
 * To use this file,
 * <ul>
 * <li>DependLib/BrowserExt.js
 * <li>WSLib/WebServiceLib.js
 * <li>ToolsLib/XML.js
 * </ul>
 * need to be loaded.<br><br>
 * To use ContentsLib,
 * <ul>
 * <li>WebDAVLib/WebDAVLib.js
 * </ul>
 * need to be loaded before ContentsLib/ContentsLib.js.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.0.0
 * @lang en
 */
 //Author: Miho Yamada


 /** 
 * WebDAVを利用したデバイスからの各種情報を取得するクラスための名前空間定義
 * @namespace WebDAVを利用したデバイスからの各種情報を取得を行う
 * @static
 * @lang ja
 */
 /** 
 * Namespace definition for classes for retrieving device information using WebDAV.
 * @namespace Retrieves device information using WebDAV.
 * @static
 * @lang en
 */
 //Author: Miho Yamada
var WebDAVLib = {
  /**
   *  WebDAVLibのバージョンを表す
   *  @constant
   *  @type String
   *  @lang ja
   *  @constant
   *  @default "1.0.0"
   */ 
   /**
   *  WebDAVLib version.
   *  @constant
   *  @type String
   *  @lang en
   *  @constant
   *  @default "1.0.0"
   */ 
  version   : "1.0.0",
  /**
   *  通信先のホストを設定する
   *  @type String
   *  @default "localhost"
   *  @lang ja
   */ 
   /**
   *  Destination host.
   *  @type String
   *  @default "localhost"
   *  @lang en
   */ 
  host    : "localhost",
    
  /**
   *  通信プロトコルを設定する
   *  @type String
   *  @default "http://"
   *  @lang ja
   */ 
  /**
   *  Communication protocol.
   *  @type String
   *  @default "http://"
   *  @lang en
   */ 
  protocol  : "http://",

  /**
   *  WebDAVポート番号を設定する
   *  @type int
   *  @default 80
   *  @lang ja
   */ 
  /**
   *  WebDAV port number.
   *  @type int
   *  @default 80
   *  @lang en
   */ 
  port  : 80
};



/**
 * 初期化処理。
 * ContentsLibを利用する場合には、本メソッドでの初期化は不要である。
 * また、本初期化処理の中で、HTTP/1.1を有効にする。<br>
 * @param {String} host 通信先を指定する
 * @addon
 * @lang ja
 * @static
 */
/**
 * Initializes WebDAVLib class.
 * When using ContentsLib, this method does not need to be called to initialize WebDAVLib class.
 * Switches HTTP version to 1.1.
 * @param {String} host Destination host.
 * @addon
 * @lang en
 * @static
 */
 //Author: Miho Yamada
WebDAVLib.init = function(host) 
{
  WebDAVLib.listener = null;
  if(host){
    WebDAVLib.host = host;
  }
  BrowserExt.EnableHttp11();
  return;
};



/**
 * イベントハンドラを登録する。<br>
 * ContentsLibを利用する場合には、ContentsLibに登録したイベントハンドラに通知されるため設定不要。<br>
 * イベントハンドラは以下の形式の関数である必要がある。<br>
 * function(<i>msgID</i>, <i>result</i>, <i>obj</i>)<br>
 * ここで<i>msgID</i>はイベント名を表す文字列、<i>result</i>は処理の成否を表す真偽値、<br>
 * <i>obj</i>は通信の結果返されるオブジェクトを表す。<br>
 * なお、ContentsLibを利用する場合には、ContentsLibのイベントを利用すること。
 * @param {Function} func イベントハンドラを指定する。<br>
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Sets event handler.<br>
 * When using ContentsLib, events are notified to ContentsLib event handler; <br>
 * therefore event handler need not be set using this method.<br>
 * Event handler must be function of the following format.
 * function(<i>msgID</i>, <i>result</i>, <i>obj</i>)<br>
 * Here, <i>msgID</i> is string representing event ID, <br>
 * <i>result</i> is boolean representing success/failure, <br>
 * and <i>obj</i> is object returned as a result of communication.<br>
 * When using ContentsLib, use events defined in ContentsLib.
 * @param {Function} func Event handler.
 * @addon
 * @static
 * @lang en
 */
 //Author: Miho Yamada
WebDAVLib.setEventListener = function(func)
{
  WebDAVLib.listener = func;
  return;
};

/**
 * 設定済みのイベントハンドラを実行する。<br>
 * なお、ContentsLibを利用する場合には、ContentsLibのイベントを利用すること。
 * @param {String} msgId イベント名を指定する
 * @param {Bool} result 通信処理の成功可否を指定する
 * @param {Object} obj 通信結果によって得られたオブジェクトを指定する
 * @addon
 * @static
 * @private
 * @lang ja
 */
 /**
 * Runs set event handler.<br>
 * When using ContentsLib, use events defined in ContentsLib.
 * @param {String} msgId Event ID.
 * @param {Bool} result Whether communcation was successful or not.
 * @param {Object} obj Object obtained as a result of communication.
 * @addon
 * @static
 * @private
 * @lang en
 */
 //Author: Miho Yamada
WebDAVLib.onEvent = function(msgId, result, obj)
{
  if (WebDAVLib.listener) {
    WebDAVLib.listener(msgId, result, obj);
  }
  return;
};


