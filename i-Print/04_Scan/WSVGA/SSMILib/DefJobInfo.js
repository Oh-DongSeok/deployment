/** 
 * @fileoverview ジョブ情報取得のための定数を定義する
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved. 
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines constants for retrieving job information.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved. 
 * @version 1.0.1
 * @lang en
 */


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class JobInfoオブジェクトの<a href="JobInfo.html#listType">listType変数</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JobInfo.html#listType">listType variable</a> of JobInfo object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
SSMILib.JOBLISTTYPE = function() {};
/**
 * 実行中のジョブを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Active job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBLISTTYPE.ACTIVE = 'active';
/**
 * 完了したジョブを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Completed job.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBLISTTYPE.COMPLETED = 'completed';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class JobInfo objectの<a href="JobInfo.html#respond">respond変数</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JobInfo.html#respond">respond variable</a> of JobInfo object.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 *
 */
SSMILib.JOBDETAIL = function() {};
/**
 * ジョブIDの取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job ID retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.JOBID = 'JobID';
/**
 * ジョブの状態の取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job status retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.STATUS = 'Status';
/**
 * ジョブの開始時間の取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job start time retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.STARTTIME = 'StartTime';
/**
 * ジョブの終了時間の取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job completion time retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.COMPLETETIME = 'CompleteTime';
/**
 * ユーザー名の取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * User name retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.USER = 'User';
/**
 * ジョブ名の取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job name retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.NAME = 'Name';
/**
 * ジョブの異常終了理由の取得要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job error reason retrieval request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBDETAIL.REASON = 'FaultReason';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class SortKeyオブジェクトの<a href="SortKey.html#order">order変数</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="SortKey.html#order">order variable</a> of SortKey object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
SSMILib.SORTORDER = function() {};
/**
 * 昇順を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Ascending order.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.SORTORDER.ASC = 'Ascending';
/**
 * 降順を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Descending order.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.SORTORDER.DESC = 'Descending';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class JobOperateオブジェクトの<a href="JobOperate.html#operate">operate変数</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JobOperate.html#operate">operate variable</a> of JobOperate object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
SSMILib.JOBOPERATION = function() {};
/**
 * ジョブ中止要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job abort request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBOPERATION.CANCEL = 'Cancel';
/**
 * ジョブ再開要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job resume request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBOPERATION.RESUME = 'Resume';
/**
 * ジョブ一時停止要求を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Job pause request.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.JOBOPERATION.PAUSE = 'Pause';
