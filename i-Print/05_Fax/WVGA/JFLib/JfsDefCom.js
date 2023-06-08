/** 
 * @fileoverview ジョブフロー作成のために共通で使用される定数を定義する
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 2.2.0
 * @lang ja
 */
/** 
 * @fileoverview Defines constants commonly used in creating Job Flow.
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 2.2.0
 * @lang en
 */
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Headerオブジェクトの<a href="JFLib.Header.html#profile">profile</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Header.html#profile">profile</a> of Header object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.LANGPROFILE = function() {};
/**
 * 全ての言語要素を使用して記述されたデバイス指示書
 * @final
 * @type String
 * @lang ja
 */
/**
 * Job Flow Sheet that may contain any element available as specified by Job Flow Sheet Language Specifications.
 * @final
 * @type String
 * @lang en
 */
JFLib.LANGPROFILE.ALL = '0';
/**
 * 実行対象のデバイスで再編集可能なレベルの言語要素を使用して記述されたデバイス指示書
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job Flow Sheet that may contain only those elements that can be re-edited by in target device.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.LANGPROFILE.DEVICE = '1';
/**
 * ジョブフローエディタで再編集可能なレベルの言語要素を使用して記述されたデバイス指示書
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job Flow Sheet that may contain only those elements that can be re-edited by Job Flow editor.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.LANGPROFILE.EDITOR = '2';
/**
 * システム提供者が事前に用意したデバイス指示書を実現するために使われるレベルの言語要素を使用して記述されたデバイス指示書
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job Flow Sheet that may contain only those elements used in Job Flow Sheet provided in advance by system supplier.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.LANGPROFILE.SYSTEM = '4';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.JobTemplate.html#category">JobTemplate</a>オブジェクトのcategoryに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in category of <a href="JFLib.JobTemplate.html#category">JobTemplate</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.JOBCATEGORY = function() {};
/**
 * コピージョブ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Copy job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JOBCATEGORY.COPY = 'Copy';
/**
 * 印刷ジョブ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Print job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JOBCATEGORY.PRINT = 'Print';
/**
 * スキャンジョブ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Scan job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JOBCATEGORY.SCAN = 'Scan';
/**
 * ファクス送信ジョブ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Fax send job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JOBCATEGORY.FAX = 'Fax';
/**
 * その他ジョブフロージョブ.
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Other Job Flow job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.JOBCATEGORY.UNKNOWN = 'Unknown';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Headerオブジェクトのkeywordのクラス変数<a href="JFLib.Header.html#scope">scope</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in class variable "<a href="JFLib.Header.html#scope">scope</a>" of "keyword" of Header object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.KEY = function() {};
/**
 * システム(アプリケーションを含む)が機械的に検索をする場合に用いるキーワードであることを示す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Keyword to be used for mechanical search by system (including application).
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.KEY.SYSTEM = 'System';
/**
 * 人間が対話的な処理の中で検索をする場合に用いるキーワードであることを示す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Keyword to be used by humans users in interactive processing.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.KEY.HUMAN = 'Human';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class JobTemplateオブジェクトの<a href="JFLib.JobTemplate.html#process">process</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.JobTemplate.html#process">process</a> of JobTemplate object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.PROCESS = function() {};
/**
 * エラーを無視し、実行可能な処理を継続する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Errors are ignored and those operations that can be continued are proceeded with.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PROCESS.CONTINUE = 'ContinueProcess';
/**
 * エラーを検知した時点で処理中断し、ジョブを異常終了させる
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Processing is aborted upon error detection and job is aborted.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PROCESS.ABORT = 'AbortProcess';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class リソース定義に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @private
 * @lang ja
 */

/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in resource definition.
 * @constructor There is no need to explicitly call this constructor.
 * @private
 * @lang en
 */
JFLib.RESOURCE = function() {};
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
JFLib.RESOURCE.OPINPUTS = 'OperatorInputs/Simple';
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
JFLib.RESOURCE.WITHOUTDOC = 'ExecutionWithoutDocument';

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
JFLib.RESOURCE.MAILBOX = 'Acquire/Mailbox';


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
JFLib.RESOURCE.MAILBOXFLOW = 'MailboxFlow';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.JobTemplate.html">JobTemplate</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.JobTemplate.html">JobTemplate</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.OutputProcessType = function() {};
/**
 * メール通知
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * Email notification.
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.MailNotification = 9;

/**
 *	デバイスのデフォルト設定に従う<br>
 *	デフォルト値の設定が可能な各プロパティで使用する
 *	@property
 *	@type String
 * @constant
 * @lang ja
 */
/**
 *	Operation is according to device default settings.<br>
 *	Used in properties to which default values can be set.
 *	@property
 *	@type String
 * @constant
 * @lang en
 */
JFLib.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class 単位指定に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used to specify unit.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.UNIT = function() {};
/**
 * ミリメートル
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Millimeters.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.UNIT.MM = 'mm';
/**
 * 1/100インチ（25.4/1000ミリメートル）
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 1/100 inch（25.4/1000 millimeters）
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.UNIT.IN = 'in';
/**
 * 1/1000インチ（25.4/1000ミリメートル）
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 1/1000 inch（25.4/1000 millimeters）
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.UNIT.MIL = 'mil';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class 言語情報に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
JFLib.LANG = function(){};

/**
 * デバイスに設定されているデフォルト言語
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LANG.DEFAULT = "x-default";

/**
 * 日本語
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LANG.JA = "ja";

/**
 * 英語
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LANG.EN = "en";

/**
 * 韓国語
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LANG.KO = "ko";

/**
 * 繁体中国語
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LANG.ZH_TW = "zh-TW";

/**
 * 簡体中国語
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LANG.ZH_CN = "zh-CN";

JFLib.JSIncluded("JfsDefCom");