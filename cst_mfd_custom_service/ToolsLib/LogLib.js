/** 
 * @fileoverview デバイスログを記録するためのクラス定義<br><br>
 * これらのクラスを使うためには
 * <ul>
 * <li>DependLib/BrowserExt.js
 * </ul>
 * のロードが必要となる
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for displaying log to screen.<br>
 * To use these classes,
 * <ul>
 * <li>DependLib/BrowserExt.js
 * </ul>
 * must be loaded.
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */



/** 
 * デバイスログを記録するクラスのための名前空間定義
 * @namespace デバイスログに記録する
 * @static
 * @lang ja
 */
 /** 
 * Defines namespace for class for writing device log.
 * @namespace Writes to device log.
 * @static
 * @lang en
 */
var LogLib = 
{
  /**
   *  ログを記録するレベルを定義する
   *  @class
   *  @type Int
   *  @constant
   *  @lang ja
   *  @private
   */ 
   /**
   *  Defines levels of log to write.
   *  @class
   *  @type Int
   *  @constant
   *  @lang en
   *  @private
   */ 
  LEVEL   : {
    ERR   : 0,
    WRN   : 1,
    INF   : 2,
    DBG   : 3
  },

  /**
   *  ログを記録する際にタイトルに付加されるプレフィクスを定義する
   *  E: Error, W: Warning, I: Information, D: Debug
   *  @class
   *  @type Int
   *  @constant
   *  @lang ja
   *  @private
   */ 
   /**
   *  Defines prefixes for title upon log write.
   *  E: Error, W: Warning, I: Information, D: Debug
   *  @class
   *  @type Int
   *  @constant
   *  @lang en
   *  @private
   */ 
  PREFIX    : new Array("E","W","I","D"),

  /**
   *  ログを記録するレベルを表す
   *  @type String
   *  @lang ja
   *  @private
   */ 
  /**
   *  Level of log to write.
   *  @type String
   *  @lang en
   *  @private
   */ 
  logLevel  : 0,

  /**
   *  ログを記録するレベルを設定する
   *  LogLib.LEVELで指定し、指定した値以下のログレベルのログが記録される
   *  @function
   *  @param {LogLib.LOGLEVEL} level レベルを指定する
   *  @lang ja
   */ 
  /**
   *  Sets level of log to write.
   *  Specified using LogLib.LEVEL. Logs of specified level and lower are written.
   *  @function
   *  @param {LogLib.LOGLEVEL} level Log write level.
   *  @lang en
   */ 
  setLogLevel : function(level){
    LogLib.logLevel = level;
    return;
  },

  /**
   *  エラーログを書き込む 62byteまでの文字列。62byte以降は記録されない。
   *  @function
   *  @param {String} str ログの内容を指定する
   *  @lang ja
   */ 
  /**
   *  Writes error log. Error log should be string of no more than 62 bytes.
   *  Anything exceeding this length is truncated.
   *  @function
   *  @param {String} str Log content.
   *  @lang en
   */ 
  error   : function(str){
    return LogLib.write(str, LogLib.LEVEL.ERR);
  },
  /**
   *  警告ログを書き込む
   *  @function
   *  @param {String} str ログの内容を指定する
   *  @lang ja
   */ 
  /**
   *  Writes warning log.
   *  @function
   *  @param {String} str Log content.
   *  @lang en
   */ 
  warn    : function(str){
    return LogLib.write(str, LogLib.LEVEL.WRN);
  },
  /**
   *  情報ログを書き込む
   *  @function
   *  @param {String} str ログの内容を指定する
   *  @lang ja
   */ 
  /**
   *  Writes info log.
   *  @function
   *  @param {String} str Log content.
   *  @lang en
   */ 
  info    : function(str){
    return LogLib.write(str, LogLib.LEVEL.INF);
  },
  /**
   *  デバッグログを書き込む
   *  @function
   *  @param {String} str ログの内容を指定する
   *  @lang ja
   */ 
  /**
   *  Writes debug log.
   *  @function
   *  @param {String} str Log content.
   *  @lang en
   */ 
  debug   : function(str){
    return LogLib.write(str, LogLib.LEVEL.DBG);
  },
  point: 0

};

/**
 *  ログを書き込む
 *  @function
 *  @param {String} str ログの内容を指定する
 *  @param {String} name ログのタイトル名を指定する
 *  @param {LogLib.LOGLEVEL} logLevel ログを記録するレベルを設定する
 *  @lang ja
 *  @private
 */ 
/**
 *  Writes log.
 *  @function
 *  @param {String} str Log content.
 *  @param {String} name Log title.
 *  @param {LogLib.LOGLEVEL} logLevel Level of log to write.
 *  @lang en
 *  @private
 */ 
LogLib.write = function(str, logLevel)
{
  if(LogLib.logLevel >= logLevel && str){
    if(typeof(str) == 'object'){
      str = XMLLib.XMLToString(str);
    }

    var prefix = LogLib.PREFIX[logLevel];
    
    str = prefix + ":"+ str;
    BrowserExt.SetLogMessage(str, LogLib.point++);
  }
  return;
};

/** @private */
LogLib.alert = function(str, logLevel)
{
  if(LogLib.logLevel >= logLevel && str){
    if(typeof(str) == 'object'){
      str = XMLLib.XMLToString(str);
    }

    var prefix = LogLib.PREFIX[logLevel];
    
    str = prefix + ":"+ str;

    alert(str);
  }
  return;
};


