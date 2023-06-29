/** 
 * @fileoverview ジョブフローにおける外部サービス連携処理を扱うクラスで使用される定数を定義する
 *
 * @author Copyright(C) 2007-2009 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines constants use din classes handling external web requests (ESR) in Job Flow.
 *
 * @author Copyright(C) 2007-2009 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang en
 */
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */

JFLib.JSInclude("JfsDefCom");
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.RESOURCE.ESR = 'Invoke/WebService';
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.RESOURCE.ESRWITHDOC = 'Invoke/WebService/Attachment';

/**
 * 外部サービス呼び出し
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * External service request (ESR).
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.ESR = 7;
/**
 * 添付文書付き外部サービス呼び出し
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * External service request (ESR) with attachment.
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.ESRWithDoc = 8;

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Requestオブジェクトのクラス変数<a href="JFLib.Invoke.Request.html#messageType">messageType</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class Request This class defines constants used in class variable <a href="JFLib.Invoke.Request.html#messageType">messageType</a> of Request object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */

JFLib.REQ = function() {};
/**
 * 同期型呼び出しを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Synchronous call
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.REQ.SYNC = "RPC/Synchronous";

/**
 * 非同期型呼び出しを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Asynchronous call
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.REQ.ASYNC = "RPC/Asynchronous";
/**
 * 通知型呼び出しを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Notification
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.REQ.NOTIFICATION = "Notification";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Responseオブジェクトのクラス変数<a href="JFLib.Invoke.Response.html#handling">handling</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in class variable <a href="JFLib.Invoke.Response.html#handling">handling</a> of Response object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.HANDLING = function() {};
/**
 * 成否の判断を、ジョブ識別子の取り出しで判断する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Determines whether request was successful by referencing job ID.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.HANDLING.JOBID = "JobIdentifier";
/**
 * 成否の判断を、フォルトで判断する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Determines whether request was successful by referencing fault.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.HANDLING.FAULT = "Fault";
/**
 * 応答メッセージ内で判断する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Determines whether request was successful by referencing response message.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.HANDLING.MESSAGE = "Message";
/**
 * 判断しない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Success/failure of request is not determined.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.HANDLING.NONE = "None";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Responseオブジェクトのクラス変数<a href="JFLib.Invoke.JudgementValue.html#type">type</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class Response This class defines constants used in class variable <a href="JFLib.Invoke.JudgementValue.html#type">type</a> of Response object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.JUDGEVALUE = function() {};
/**
 * 成功を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Success.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JUDGEVALUE.SUCCEEDED = "Succeeded";
/**
 * 失敗を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Failure.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JUDGEVALUE.FAILED = "Failed";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Attachオブジェクトのクラス変数<a href="JFLib.Invoke.Attach.html#encode">encode</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class Attach This class defines constants used in class variable <a href="JFLib.Invoke.Attach.html#encode">encode</a> of Attach object. 
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.ENCODE = function() {};
/**
 * バイナリ形式を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Binary format.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ENCODE.BINARY = "binary";
/**
 * Base64エンコーディング形式を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Base64 encoding.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ENCODE.BASE64 = "base64";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Referenceオブジェクトのクラス変数<a href="JFLib.Invoke.Reference.html#operation">operation</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in class variable <a href="JFLib.Invoke.Reference.html#operation">operation</a> of Reference object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.OPTYPE = function() {};
/**
 * 対象となる要素の子ノードとして追加する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Append as child node of target element.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OPTYPE.APPEND = "Append";
/**
 * 対象となる要素の直前の兄弟ノードとして挿入する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Append as sibling node of target element.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OPTYPE.INSERT = "InsertBefore";

JFLib.JSIncluded("JfsDefInvoke");

