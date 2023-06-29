/** 
 * @fileoverview ジョブフローにおけるユーザ通知で指定される定数を定義する<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2011-2012 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.0
 * @lang ja
 */
/** 
 * @fileoverview Defines constants specified for user notification in Job Flow.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2011-2012 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.0
 * @lang en
 */
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Notificationオブジェクトのconditionに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * This constructor need not be called explicitly.
 * @class Class for defining constants for condition of Notification object.
 * @constructor This constructor need not be called explicitly.
 * @lang en
 */
JFLib.CONDITION = function() {};
/**
 * 通知しない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
 /**
 * No notification
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONDITION.NEVER = "Never";

/**
 * ジョブ終了時、常に通知する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
 /**
 * Always notify upon job end.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONDITION.ALWAYS = "Always";

/**
 * ジョブ異常終了時に通知する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
 /**
 * Notify upon job fail
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONDITION.JOBFAIL = "JobFail";

/* @private */
JFLib.RESOURCE.NTFYYESR = "Notification/WebService";

JFLib.JSIncluded("JfsDefNotification");