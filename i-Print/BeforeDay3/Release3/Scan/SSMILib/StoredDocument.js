/**
 * @fileoverview デバイスのボックス文書を取得または削除するためのクラス定義<br>
 * デバイスのボックス文書を取得に関して以下のメソッドを提供する<br>
 * GetStoredDocument<br><br>
 * デバイスのボックス文書の削除に関して以下のメソッドを提供する<br>
 * DeleteStoredDocument<br><br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2011-2012 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.2.1
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for retrieving information on / deleting Mailbox documents.<br>
 * Provides the following methods for retrieving Mailbox document information:<br>
 * GetStoredDocument<br><br>
 * Provides the following methods for deleting Mailbox documents:<br>
 * DeleteStoredDocument<br><br>
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2011-2012 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.2.1
 * @lang en
 */

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class StoredDocumentに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in StoredDocument
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.BOX = function(){};

 /**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class ボックス種別をあらわす定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Mailbox type.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.BOX.TYPE = function(){};

/**
 * 親展ボックス
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Mailbox
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.TYPE.NORMAL = "Normal";

/**
 * プライベートプリントおよびセキュリティプリント文書を蓄積したボックス
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Mailbox storing Private Charged Print / Security Print documents
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.TYPE.SECURITY = "SecurityPrint";

/**
 * サンプルプリント文書を蓄積したボックス
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Mailbox storing Proof Print documents
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.TYPE.PROOF = "ProofPrint";

/**
 * 時刻指定プリント文書を蓄積したボックス
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Mailbox storing Delayed Print documents
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.TYPE.DELAY =  "DelayPrint";

/**
 * 課金認証プリント文書を蓄積したボックス
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Mailbox storing Pay For Print documents
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.TYPE.PAY = "PayForPrint";

 /**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class StoreTypeFiltersで使用する文書の蓄積種別を示す定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing document origin (method of storage to Mailbox), for use in StoreTypeFilters.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.BOX.FILTER = function(){};

/**
 * プリント蓄積
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Print
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.FILTER.PRINT = "Print";

/**
 * スキャン蓄積
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Scan
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.FILTER.SCAN = "Scan";

/**
 * コピー蓄積
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Copy
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.FILTER.COPY = "Copy";

/**
 * ファクス蓄積
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Fax
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.FILTER.FAX = "Fax";

/**
 * 親展ボックスへのプリント蓄積
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Stored to Mailbox via print
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.FILTER.MAILBOX = "MailBox";

 /**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class RespondTypesに用いられる取得文書の属性を示す定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in RespondTypes, representing retrieved document attributes
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.BOX.RESPOND = function() {};

/**
 * すべての属性
 * @constant
 * @type String
 * @lang ja
 */
/**
 * All attributes
 * @constant
 * @type String
 * @lang en
 */
SSMILib.BOX.RESPOND.ALL = "sd:All";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class SortPolicyに用いられる文書の並び順を示す定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in SortPolicy, representing document sort order
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.SORTPOLICY = function(){};

/**
 * 昇順
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Ascending
 * @constant
 * @type String
 * @lang en
 */

SSMILib.SORTPOLICY.ASC = "Ascending";

/**
 * 降順
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Descending
 * @constant
 * @type String
 * @lang en
 */

SSMILib.SORTPOLICY.DSC = "Descending";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class userIdentifierTypesに用いられる文書を取得するユーザーの定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in userIdentifierTypes representing how to specify user to retrieve document information
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.USER_IDTYPE = function(){};

/**
 *  ユーザーID
 *  @constant
 *  @type String
 * @lang ja
 */
/**
 *  User ID
 *  @constant
 *  @type String
 * @lang en
 */
SSMILib.USER_IDTYPE.USER = "UserID";

/**
 *  ICカードID
 *  @type String
 *  @constant
 * @lang ja
 */
/**
 *  IC Card ID
 *  @type String
 *  @constant
 * @lang en
 */
SSMILib.USER_IDTYPE.IC_CARD = "ICCardID";

/**
 *  外部の認証システムが返すユーザーID
 *  @type String
 *  @constant
 * @lang ja
 */
/**
 *  User ID returned by external authentication system
 *  @type String
 *  @constant
 * @lang en
 */
SSMILib.USER_IDTYPE.RELATED_USER = "RelatedUserID";

/**
 *  サブユーザーID
 *  @type String
 *  @constant
 * @lang ja
 */
 /**
 *  SubUser ID
 *  @type String
 *  @constant
 * @lang en
 */
SSMILib.USER_IDTYPE.SUB_USER = "SubUserID";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class PRINT_JOB_STATEを定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class Class that defines PRINT_JOB_STATE.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.PRINT_JOB_STATE = function(){};
/**
 * 未印刷
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Not printed.
 * @type String
 * @constant
 * @lang en
 */
SSMILib.PRINT_JOB_STATE.NOSTATE = "NoState";

/**
 * 印刷待ち/印刷中
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Waiting to be printed / printing in process
 * @type String
 * @constant
 * @lang en
 */
SSMILib.PRINT_JOB_STATE.PROCESSING = "Processing";

/**
 * 印刷待ち/印刷中/印刷済み
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Waiting to be printed / printing in process / printed
 * @type String
 * @constant
 * @lang en
 */
SSMILib.PRINT_JOB_STATE.PROS_N_PRINTED = "ProcessingAndPrinted";

/**
 * 印刷済み
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Printed
 * @type String
 * @constant
 * @lang en
 */
SSMILib.PRINT_JOB_STATE.PRINTED = "Printed";

/**
 * 削除指示済み
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Instructed to be deleted
 * @type String
 * @constant
 * @lang en
 */
SSMILib.PRINT_JOB_STATE.DELETING = "Deleting";

/**
 * SSMILib.Scope インスタンスを作成する
 * @constructor
 * @class 取得対象となる文書の範囲を指定するためのクラス<br>
 * @lang ja
 */
/**
 * Creates SSMILib.Scope instance
 * @constructor
 * @class This class is for specifying scope of documents on which to retrieve information.<br>
 * @lang en
 */
SSMILib.Scope = function(){

  /**
   *  取得を開始する位置を指定する<br>
   *  (0を指定すると先頭からを意味する）
   *  @type Int
   *  @default なし
   *  @lang ja
   */
   /**
   *  Specifies retrieval start point. <br>
   *  ("0" specifies to start from begining)
   *  @type Int
   *  @default None
   *  @lang en
   */
  this.offset = 0;

  /**
   *  取得する個数の最大数
   *  @type Int
   *  @default なし
   *  @lang ja
   */
  /**
   *  Maximum number of documents to retrieve
   *  @type Int
   *  @default None
   *  @lang en
   */
  this.limit = 0;
};

/**
 * SSMILib.SortPolicy インスタンスを作成する
 * @constructor
 * @class SSMILibのScopeのクラス<br>
 * @lang ja
 */
 /**
 * Creates SSMILib.SortPolicy instance
 * @constructor
 * @class Class used to set scope in SSMILib<br>
 * @lang en
 */
SSMILib.SortPolicy = function(){

  /**
  * ソートに用いるキーを指定する<br>
  * 文書名または文書格納日時が指定可能。
  * @type String(sd:Name/sd:StoreTime)
  * @default ""
  *  @lang ja
  */
  /**
   *  Key for sorting.
   *  Document name or storage date/time can be specified.
   *  @type String(sd:Name/sd:StoreTime)
   *  @default ""
   *  @lang en
   */
  this.key = "";

  /**
  * ソート順のタイプを指定する
  * @type SSMILib.SORTPOLICY
  * @default SSMILib.SORTPOLICY.ASC
  * @lang ja
  */
  /**
   *  Sort order.
   *  @type SSMILib.SORTPOLICY
   *  @default SSMILib.SORTPOLICY.ASC
   *  @lang en
   */
  this.type = SSMILib.SORTPOLICY.ASC;
};


/**
 * DocumentBox インスタンスを作成する
 * @constructor
 * @class ボックスを扱うためのクラス<br>
 * @lang ja
 */
/**
 * Creates DocumentBox instance
 * @constructor
 * @class Class for handling Mailbox<br>
 * @lang en
 */
SSMILib.DocumentBox = function(){

  /**
   *  ボックスIDを指定する
   *  @type String
   *  @default なし
   *  @lang ja
   */
  /**
   *  Mailbox ID
   *  @type String
   *  @default None
   *  @lang en
   */
    this.id = "";

  /**
   *  ボックスパスワードを指定する
   *  @type String
   *  @default なし
   *  @lang ja
   */
  /**
   *  Mailbox password
   *  @type String
   *  @default None
   *  @lang en
   */
    this.password = "";
};

/**
 * Document インスタンスを作成する
 * @constructor
 * @class ボックスの文書を扱うためのクラス<br>
 * @lang ja
 */
/**
 * Creates Document instance
 * @constructor
 * @class Class for handling Mailbox documents<br>
 * @lang en
 */
SSMILib.Document = function(){

  /**
   *  文書IDを指定する
   *  @type String
   *  @default なし
   *  @lang ja
   */
  /**
   *  Document ID
   *  @type String
   *  @default None
   *  @lang en
   */
  this.id = "";

  /**
   *  文書が属するボックスを指定する
   *  @type String
   *  @default なし
   *  @lang ja
   */
  /**
   *  Mailbox to which document is stored
   *  @type String
   *  @default None
   *  @lang en
   */
  this.docBox = new SSMILib.DocumentBox();
};

/**
 * DocumentBoxFilter インスタンスを作成する
 * @constructor
 * @class ボックスを選別するフィルタのためのクラス<br>
 * @lang ja
 */
/**
 * Creates DocumentBoxFilter instance
 * @constructor
 * @class Class for filtering Mailboxes<br>
 * @lang en
 */
SSMILib.DocumentBoxFilter = function(){

  /**
   *  Boxタイプ別にBoxをフィルタリングする場合に、Boxのタイプを指定する
   *  @type Array(SSMILib.BOX.TYPE)
   *  @default なし
   *  @lang ja
   */
  /**
   *  Specifies Mailbox type, to filter Mailbox according to Mailbox type
   *  @type Array(SSMILib.BOX.TYPE)
   *  @default None
   *  @lang en
   */
  this.types = new Array();

  /**
   *  オーナー別にBoxをフィルタリングする場合に、オーナーのユーザ識別子を指定する<br>
   *  アクセス者が指定のBoxへのアクセス権を持っている必要がある
   *  @type String
   *  @default なし
   * @lang ja
   */
  /**
   *  Specifies Mailbox owner ID, to filter Mailboxes according to owner.<br>
   *  User accessing Mailbox must be granted access to specified Mailbox.
   *  @type String
   *  @default None
   * @lang en
   */
  this.owner = "";
};

/**
 * StoredDocument インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class  ボックス文書を扱うためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates StoredDocument instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for handling Mailbox documents.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.StoredDocument = function()
{
  /**
   *  SOAP Messageを作成するタイプ
   *  このメンバー変数を明示的に定義する必要はない
   *  @type String
   *  @default なし
   *  @private
   *  @lang ja
   */
  /**
   *  Type for creating SOAP Message.
   *  Theere is no need to explicitly define this member variable.
   *  @type String
   *  @default None
   *  @private
   *  @lang en
   */
  this.type = "";

  /**
   * 文書/ボックスのオーナー種別を指定する。<br>
   * 本要素が省略された場合はSSMILib.USER_IDTYPE.USERを指定したことを意味する。
   * 複数のIDTypeが指定されている場合、それらはOR結合である。
   *  @type Array
   *  @default  なし
   *  @lang ja
   */
  /**
   * Specifies information by which to identify document/Mailbox owner.<br>
   * When omitted, operations are as when SSMILib.USER_IDTYPE.USER is specified.
   * If multiple ID types are specified, these conditions are deemed as connected by OR.
   *  @type Array
   *  @default  None
   *  @lang en
   */
  this.userIdentifierTypes = new Array();

  /**
   *  取得するBoxId、Passwordを指定する<br>
   *  何も指定しない場合はアクセス可能なボックス/文書すべて
   *  @type Array(SSMILib.DocumentBox)
   *  @default なし
   *  @lang ja
   */
  /**
   *  Specifies Mailbox ID and password of Mailbox from which to retrieve document information.<br>
   *  If none is specified, all accessible documents and Mailboxes are deemed as specified.
   *  @type Array(SSMILib.DocumentBox)
   *  @default None
   *  @lang en
   */
  this.boxes = new Array();

  /**
   *  取得したBoxのフィルタリング方法を指定する
   *  @type SSMILib.DocumentBoxFilter
   *  @default なし
   *  @lang ja
   */
  /**
   *  Specifies method for filtering Mailboxes
   *  @type SSMILib.DocumentBoxFilter
   *  @default None
   *  @lang en
   */
  this.boxFilter = new SSMILib.DocumentBoxFilter();

  /**
   *  取得する文書を指定する
   *  @type Array(SSMILib.Document)
   *  @default なし
   *  @lang ja
   */
  /**
   *  Specifies documents to retrieve information on
   *  @type Array(SSMILib.Document)
   *  @default None
   *  @lang en
   */
  this.documents = new Array();

  /**
   * 取得した文書から蓄積タイプでフィルタリングする
   *  @type Array(SSMILib.BOX.FILTER);
   *  @default なし
   *  @lang ja
   */
  /**
   *  Filters documents according to origin (method of storage to Mailbox)
   *  @type Array(SSMILib.BOX.FILTER);
   *  @default None
   *  @lang en
   */
  this.storeTypeFilters = new Array();

  /**
   * 取得した文書から印刷状況でフィルタリングする
   *  @type SSMILib.PRINT_JOB_STATE
   *  @default なし
   *  @lang ja
   */
  /**
   *  Filters retrieved documents according to print job state.
   *  @type SSMILib.PRINT_JOB_STATE
   *  @default None
   *  @lang en
   */
  this.printJobState = "";

  /**
   *  取得対象となる文書の範囲を指定する<br>
   *  注意制限事項：文書全体をロックしているわけではないので、文書の増減があると、正しく全部を取得できないことがある。
   *  @type SSMILib.Scope
   *  @default SSMILib.Scope
   *  @lang ja
   */
  /**
   *  Specifies scope of documents on which to retrieve information.<br>
   *  Notes/Restrictions: Device is not locked; therefore, if documents are deleted/added during retrieval, list may not be complete/correct.
   *  @type SSMILib.Scope
   *  @default SSMILib.Scope
   *  @lang en
   */
  this.scope = new SSMILib.Scope();

  /**
   *  ソートキーを属性名(xs:QName)で指定し、ソート順はソートキーの属性orderで指定する。<br>
   *  文書名と文書格納日時の昇順もしくは降順が利用できる。<br>
   *  他のソートキーを指定された場合、Sender(Client)/InvalidOperation/InvalidArgumentが返る
   *  @type SSMILib.SortPolicy
   *  @default SSMILib.SortPolicy
   *  @lang ja
   */
  /**
   *  Specifies attribute name (xs:QName) as sort key. Sort order is specified by "order" attribute of sort key.<br>
   *  Documents can be sorted in ascending/descending order, by document name or document storage date.<br>
   *  If sort key other than those listed above is specified, Sender(Client)/InvalidOperation/InvalidArgument fault is returned.
   *  @type SSMILib.SortPolicy
   *  @default SSMILib.SortPolicy
   *  @lang en
   */
  this.sortPolicy = new SSMILib.SortPolicy();

  /**
   *  取得する文書属性を指定する<br>
   *  指定がない場合は何も取得できない。<br>
   *  指定可能な文書属性は以下を参照すること<br>
   * 「02-10 SESAMi Service Management Interface Specification_StoredDocument.pdf」<br>
   * 「02-11 SESAMi Service Management Interface Specification_SDAttribute.xls」
   *  @example
   *  ◎使い方◎
   *  var sd = new SSMILib.StoredDocument();
   *  1.全ての属性を取得したい場合
   *  sd.respondTypes.push(SSMILib.BOX.RESPOND.ALL);
   *  または(or)
   *  2.取得したい属性を限定（蓄積日時、文書名、ページ数のみ）する場合
   *  sd.respondTypes.push("sd:StoreTime");
   *  sd.respondTypes.push("sd:Name");
   *  sd.respondTypes.push("sd:NumberOfPages");
   *  @type Array(SSMILib.BOX.RESPOND/String)
   *  @default なし
   *  @lang ja
   */
  /**
   *  Document attributes to retrieve.<br>
   *  If attribute is not specified, attributes are not retrieved.<br>
   *  See the following documents for document attributes that can be specified.<br>
   * "02-10 SESAMi Service Management Interface Specification_StoredDocument.pdf"<br>
   * "02-11 SESAMi Service Management Interface Specification_SDAttribute.xls"
   *  @example
   *  How to use:
   *  var sd = new SSMILib.StoredDocument();
   *  1. To retrieve all attributes, specify<br>
   *  sd.respondTypes.push(SSMILib.BOX.RESPOND.ALL);<br>
   *  2. To retrieve only specific attributes, specify attribute to retrieve.<br>
   *  For example, the below samples retrieve storage date/time, document name, and number of pages, respectively:<br>
   *  sd.respondTypes.push("sd:StoreTime");<br>
   *  sd.respondTypes.push("sd:Name");<br>
   *  sd.respondTypes.push("sd:NumberOfPages");<br>
   *  @type Array(SSMILib.BOX.RESPOND/String)
   *  @default None
   *  @lang en
   */
  this.respondTypes = new Array();
  
  /**
   * SC29039
   * 取得対象文書の指定方法としてDocumentBoxもしくはDocumetを使用し、かつ指定のボックスへのアクセスに失敗した場合に、
   * アクセスに失敗したボックスの情報をレスポンスに含めるかどうかを指定する。
   * trueを指定した場合は情報をレスポンスに含む
   * falseを指定するもしくは本要素を指定しない場合は情報をレスポンスに含めない。
   * @type boolean
   * @default false
   */
  this.needsBoxFault = false;
};
/**
 * @private
 */
Extend(SSMILib.StoredDocument.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.StoredDocument.prototype.createMsg = function()
{
  var xml = new XMLLib.XMLSOAP();
  var root = xml.createSOAPEnvelope();
  var env = root;
  var body = xml.body;

  var mgtNS = "http://www.fujixerox.co.jp/2003/12/ssm/management";
  var mbtNS = "http://www.fujixerox.co.jp/2011/02/ssm/management/mailbox/boxtype";
  var attrNS  = "http://www.fujixerox.co.jp/2011/02/ssm/management/attribute";
  var sdNS    = "http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument";
  var tnsNS   ="http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument/attribute/print";

  xml.addNSPrefix(mgtNS, "mgt");
  xml.addNSPrefix(mbtNS, "mbt");
  xml.addNSPrefix(attrNS, "attr");
  xml.addNSPrefix(sdNS, "sd");
  xml.addNSPrefix(tnsNS, "tns");

  var sdNode = body.appendChild(xml.createElementNS(sdNS, this.type ));
  xml.addNSDeclaration(mgtNS, sdNode, true);
  xml.addNSDeclaration(mbtNS, sdNode, true);
  xml.addNSDeclaration(attrNS, sdNode, true);
  xml.addNSDeclaration(sdNS, sdNode, true);
  xml.addNSDeclaration(tnsNS, sdNode, true);

  if(this.userIdentifierTypes.length){
    var iobNode = sdNode.appendChild(xml.createElementNS(sdNS, "IdentifyUserBy"));
    for( iIndex in this.userIdentifierTypes){
      if(this.userIdentifierTypes[iIndex]){
        var itNode = xml.createElementNS(sdNS, "IDType");
        itNode.appendChild(xml.createTextNode(this.userIdentifierTypes[iIndex]));
        iobNode.appendChild(itNode);
        sdNode.appendChild(iobNode);
      }
    }
  }

  if(this.printJobState){
    var pjsfNode = xml.createElementNS(sdNS, "PrintJobStateFilter");
    pjsfNode.appendChild(xml.createTextNode(this.printJobState));
    sdNode.appendChild(pjsfNode);
  }

  if(this.boxes.length){
    for( iIndex in this.boxes){
      if(this.boxes[iIndex] && this.boxes[iIndex].id){
        var docBoxNode = sdNode.appendChild(xml.createElementNS(sdNS, "DocumentBox"));
    	docBoxNode.setAttribute("boxId", this.boxes[iIndex].id);
    	docBoxNode.setAttribute("boxPassword", this.boxes[iIndex].password);
      }
    }
  }

  if(this.boxFilter){
    if(this.boxFilter.types.length){
        for( iIndex in this.boxFilter.types){
        var typeNode = xml.createElementNS(mbtNS, "DocumentBoxType");
        typeNode.appendChild(xml.createTextNode(this.boxFilter.types[iIndex]));
        sdNode.appendChild(typeNode);
      }
    }

    if(this.boxFilter.owner){
      if(this.boxFilter.owner){
        var ownerNode = xml.createElementNS(sdNS, "DocumentBoxOwner");
        ownerNode.appendChild(xml.createTextNode(this.boxFilter.owner));
        sdNode.appendChild(ownerNode);
      }
    }
  }

  if(this.documents.length){
    for( iIndex in this.documents){
      if(this.documents[iIndex] && this.documents[iIndex].id){
        var docNode = sdNode.appendChild(xml.createElementNS(sdNS, "Document"));
        docNode.appendChild(xml.createTextNode(this.documents[iIndex].id));
        if(this.documents[iIndex].docBox.id)
        	docNode.setAttribute("boxId", this.documents[iIndex].docBox.id);
        docNode.setAttribute("boxPassword", this.documents[iIndex].docBox.password);
      }
    }
  }

  if(this.storeTypeFilters.length){
    var storeTypeFilterNode = sdNode.appendChild(xml.createElementNS(sdNS, "StoreTypeFilter"));

    for( iIndex in this.storeTypeFilters){
      if(this.storeTypeFilters[iIndex]){
        var typeNode = storeTypeFilterNode.appendChild(xml.createElementNS(sdNS, "Type"));
        typeNode.appendChild(xml.createTextNode(this.storeTypeFilters[iIndex]));
      }
    }
  }

  var isOffsetAvailable = false;
  var isLimitAvailable = false;
  //It needs to handles this way, becuase this node shouldn't be represent on Delete Request Message
  var docScopeNode = xml.createElementNS(sdNS, "DocumentScope");

  if(this.scope && this.scope.offset){
    var offsetNode = docScopeNode.appendChild(xml.createElement("Offset"));
    offsetNode.appendChild(xml.createTextNode(this.scope.offset));
    isOffsetAvailable = true;
  }
  if(this.scope && this.scope.limit){
    var limitNode = docScopeNode.appendChild(xml.createElement("Limit"));
    limitNode.appendChild(xml.createTextNode(this.scope.limit));
    isLimitAvailable = true;
  }

  if(isOffsetAvailable || isLimitAvailable){
    sdNode.appendChild(docScopeNode);
  }

  if(this.sortPolicy.key){
    var sortPolicyNode = sdNode.appendChild(xml.createElementNS(attrNS, "SortPolicy"));
    var keyNode = sortPolicyNode.appendChild(xml.createElementNS(attrNS, "Key"));
    if(this.sortPolicy.key) keyNode.appendChild(xml.createTextNode(this.sortPolicy.key));
    keyNode.setAttribute("order", this.sortPolicy.type);
  }

  if(this.respondTypes.length){
    var respondNode = sdNode.appendChild(xml.createElementNS(attrNS, "Respond"));
    for( iIndex in this.respondTypes){
      var attrNameNode = respondNode.appendChild(xml.createElementNS(attrNS, "AttributeName"));
      attrNameNode.appendChild(xml.createTextNode(this.respondTypes[iIndex]));
    }
  }

  //SC29039対応
  if(this.type == "GetStoredDocument" && typeof this.needsBoxFault == "boolean"){
	  var needBoxFaultNode = sdNode.appendChild(xml.createElement("NeedsBoxFault"));
	  needBoxFaultNode.appendChild(xml.createTextNode(this.needsBoxFault));
  }

  env.appendChild(body);

  var soapMsg = xml.rootElement;
  return soapMsg;
};

/**
 * ボックス文書の情報を取得する<br>
 * 取得に成功すると、文書の情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「01-01 SESAMi Service Management Interface Specification.doc」を参照
 * @param {SSMILib.StoredDocument}  sdObj 文書取得用のオブジェクトを指定する
 * @param {Int} timeout   通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox document information.<br>
 * If retrieval is successful, object with document information as properties is returned.
 * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
 * @param {SSMILib.StoredDocument}  sdObj Object for retrieving document information
 * @param {Int} timeout   Communication timeout
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetStoredDocument = function(sdObj, timeout)
{
  var _ws = new WebServiceLib.Communicator();

  _ws.async = SSMILib.async;
  _ws.successHandler = SSMILib.StoredDocument.gsdSuccessCb;
  _ws.errorHandler = SSMILib.StoredDocument.gsdErrorCb;

  if(timeout){
    _ws.timeout = timeout;
    _ws.timeoutHandler = SSMILib.StoredDocument.gsdErrorCb;
  }

  _ws.token = SSMILib.RemoteAccess.Interceptor("WebService", _ws);

  _ws.soapAction = '"http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument#GetStoredDocument"';
  _ws.isDeviceReq = true;

  var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/StoredDocument";

  if (SSMILib.dummy) {
    var _docBox = null;
    //TODO Need to define dummy data
    SSMILib.onEvent("GetStoredDocument", true, _docBox);
    return;
  }

  var _sdObj = (sdObj)? sdObj : new SSMILib.StoredDocument();
  _sdObj.type = "GetStoredDocument";
  var _msg = _sdObj.serializeToString();

  /*AR185294*/
  _ws.headers[0] = "Connection";
  _ws.headers[1] = "close";

  _ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.StoredDocument.gsdSuccessCb = function(res)
{
  var _docList = new Array();
  var _result = false;

  if(!res.responseXML) {
    SSMILib.onEvent("GetStoredDocument", _result, _docList);
    return;
  }

  _docList = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, _docList);
  
  //SC29039対応
  var boxFaultNode = res.responseXML.getElementsByTagName("BoxFault");
  var documentNode = res.responseXML.getElementsByTagName("Document");
  if(boxFaultNode.length > 0 && documentNode.length == 0){
	  var _arr = ["BoxFault", _docList[0].RemoteHost, boxFaultNode.length];//AR201368
	  SSMILib.onEvent("GetStoredDocument", true, _arr);
	  return;
  }

  var _gsdrNode = res.responseXML.getElementsByTagNameNS(
      "http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument","GetStoredDocumentResponse");

  //According to the StoredDucment Specification,
  //it's dosn't return any element when there is no file to retrive.
  _result = true;

  if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){

    var _resNodeLen = _gsdrNode[0].childNodes.length;
    for (var i = 0; i < _resNodeLen; i++){
      var _docNode = _gsdrNode[0].childNodes[i];

      if (_docNode.nodeName == "BoxFault" || _docNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_docNode.hasChildNodes()) { //不要なノードを飛ばす
        continue;
      }
      _docList.push(SSMILib.nameAndValueAttrNodeToObject(_docNode));

    }
//    _result = true;
  }

  SSMILib.onEvent("GetStoredDocument", _result, _docList);
};

/**
 * 指定したノードからオブジェクトを再帰的に生成する
 * 本関数は可能であれば、XMLLibのchildNodeToProperty2を更新したいが、確実なUTが終わる前は本ファイルで定義する。
 * @param {Node} node ノードを指定する
 * @param {Bool} isGetAttrMode Attribute取得モードをOn/Offする
 * @returns {Object} 指定したノードにテキストノード以外の複数の子要素が存在する場合
 * @returns {String} 指定したノードにテキストノードしか存在しない場合
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * 指定したノードからオブジェクトを再帰的に生成する
 * 本関数は可能であれば、XMLLibのchildNodeToProperty2を更新したいが、確実なUTが終わる前は本ファイルで定義する。
 * @param {Node} node ノードを指定する
 * @param {Bool} isGetAttrMode Attribute取得モードをOn/Offする
 * @returns {Object} 指定したノードにテキストノード以外の複数の子要素が存在する場合
 * @returns {String} 指定したノードにテキストノードしか存在しない場合
 * @addon
 * @static
 * @private
 * @lang en
 */
SSMILib.nameAndValueAttrNodeToObject = function(node)
{
  if(!node){
    return "";
  }
  var object = new Object();
  var _childNodeLen = node.childNodes.length;
  var _childNode = null;
  //Returns text if child node is text node
  if(node.attributes){
//    object[node.localName] = node.firstChild.nodeValue;
    var attrArray = node.attributes;
    var _attrLen = node.attributes.length;
    for(var i=0; i < _attrLen; i++){
      if(attrArray.item(i).name == "boxId"){
        if(attrArray.item(i).value){
          object[attrArray.item(i).localName] = attrArray.item(i).value;
          break;
        }else{
          object[attrArray.item(i).localName] = "";
        }
      }
    }
  }
  if(_childNodeLen==1 &&  node.firstChild && node.firstChild.nodeType == 3){
    return node.firstChild.nodeValue;
  } else {

    var faultArr = new Array();
    for(var i=0; i < _childNodeLen; i++){
      var attrName="";
      var value = null;
      var iIndex = 0;
      _childNode = node.childNodes[i];
      if(_childNode.nodeType == 1  && _childNode.nodeName){ //ELEMENT_NODE
        if(_childNode.firstChild){
          //Recursive processing if child node exists
          if(_childNode.localName == "Attribute"){
            var length = _childNode.childNodes.length;
            for(iIndex=0; iIndex<length; iIndex++){
              _subChildNode = _childNode.childNodes[iIndex];
              if(_subChildNode.nodeType == 1  && _subChildNode.nodeName){
                if(_subChildNode.firstChild &&  _subChildNode.localName=="Name"){
                  attrName = SSMILib.removePrefixOfString(_subChildNode.firstChild.nodeValue);
                  break;
                }
              }
            }
            for(iIndex=0; iIndex<length; iIndex++){
              _subChildNode = _childNode.childNodes[iIndex];
              if(_subChildNode.nodeType == 1  && _subChildNode.nodeName){
                if(_subChildNode.firstChild &&  _subChildNode.localName=="Value"){
                  value = new Object();
                  value = SSMILib.nameAndValueAttrNodeToObject(_subChildNode);
                }
              }
            }
            object[attrName] = value;
          }
          else if(_childNode.localName == "AttributeFault"){
            faultArr.push(SSMILib.nameAndValueAttrNodeToObject(_childNode));
          }
          else{
            object[_childNode.localName] = SSMILib.nameAndValueAttrNodeToObject(_childNode);
          }
          object["AttributeFault"] = faultArr;
        } else {
          //子ノードがない場合は、値が空のプロパティを生成
          object[_childNode.localName + iIndex] = "";
        }
      }
    }
    return object;
  }
};

/**
 * @private
 */
SSMILib.StoredDocument.gsdErrorCb = function(res)
{
  var _result = false;
  var soapFaultObj = null;
  soapFaultObj  = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
  SSMILib.onEvent("GetStoredDocument", _result, soapFaultObj);
};

/**
 * ボックス文書の文書数を取得する<br>
 * 取得条件をオブジェクトにより指定する。<br>
 * 取得に成功すると文書数を返す。
 * プロパティ詳細については「02-10 SESAMi Service Management Interface Specification_StoredDocument.pdf」を参照
 * @param {SSMILib.StoredDocument}  sdObj 文書数取得用のオブジェクトを指定する
 * @param {Int} timeout   通信のタイムアウト値を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves number of Mailbox documents. <br>
 * Retrieval conditions are specified as object.<br>
 * If retrieval is succesful, number of Mailbox documents is returned.
 * See "02-10 SESAMi Service Management Interface Specification_StoredDocument.pdf" for details.
 * @param {SSMILib.StoredDocument}  sdObj Object for retrieving number of documents.
 * @param {Int} timeout   Communication timeout.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetStoredDocumentCount = function(sdObj, timeout)
{
  var _ws = new WebServiceLib.Communicator();

  _ws.async = SSMILib.async;
  _ws.successHandler = SSMILib.StoredDocument.gsdCountSuccessCb;
  _ws.errorHandler = SSMILib.StoredDocument.gsdCountErrorCb;

  if(timeout){
    _ws.timeout = timeout;
    _ws.timeoutHandler = SSMILib.StoredDocument.gsdCountErrorCb;
  }

  _ws.token = SSMILib.RemoteAccess.Interceptor("WebService", _ws);

  _ws.soapAction = '"http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument#GetStoredDocumentCount"';
  _ws.isDeviceReq = true;

  var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/StoredDocument";

  if (SSMILib.dummy) {
    var _docBox = null;
    //TODO Need to define dummy data
    SSMILib.onEvent("GetStoredDocumentCount", true, _docBox);
    return;
  }

  var _sdObj = (sdObj)? sdObj : new SSMILib.StoredDocument();
  _sdObj.type = "GetStoredDocumentCount";
  var _msg = _sdObj.serializeToString();

  /*AR185294*/
  _ws.headers[0] = "Connection";
  _ws.headers[1] = "close";

  _ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.StoredDocument.gsdCountSuccessCb = function(res)
{
  var _returnArr = new Array();
  var _result = false;

  if(!res.responseXML) {
    SSMILib.onEvent("GetStoredDocumentCount", _result, _returnArr);
    return;
  }
  _returnArr = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, _returnArr);

  var _gsdrNode = res.responseXML.getElementsByTagNameNS(
      "http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument","GetStoredDocumentCountResponse");

//  _result = true;

  if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){

    var _resNodeLen = _gsdrNode[0].childNodes.length;
    for (var i = 0; i < _resNodeLen; i++){
      var _docNode = _gsdrNode[0].childNodes[i];

      if (_docNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_docNode.hasChildNodes()) { //不要なノードを飛ばす
        continue;
      }
      _returnArr.push(SSMILib.childNodeToProperty(_docNode));

    }
    _result = true;
  }
  SSMILib.onEvent("GetStoredDocumentCount", _result, _returnArr);
};

/**
 * @private
 */
SSMILib.StoredDocument.gsdCountErrorCb = function(res)
{
  var _result = false;
  var soapFaultObj = null;
  soapFaultObj  = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
  SSMILib.onEvent("GetStoredDocumentCount", _result, soapFaultObj);
};

/**
 * ボックス文書を削除する<br>
 * 削除に成功すると、削除した文書IDが返される。<br>
 * プロパティ詳細については「01-01 SESAMi Service Management Interface Specification.pdf」を参照
 * @param {SSMILib.StoredDocument}  sdObj 削除する文書用のオブジェクトを指定する
 * @param {Int} timeout 通信のタイムアウト値を指定する
 * @return  {Bool} true:削除成功、false:削除失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Deletes Mailbox documents.<br>
 * If deletion is successful, document ID of deleted document is returned.<br>
 * See "01-01 SESAMi Service Management Interface Specification.pdf" for details.
 * @param {SSMILib.StoredDocument}  sdObj Object representing document to delete.
 * @param {Int} timeout Communication timeout
 * @return  {Bool} true: deletion successful, false: deletion failed
 * @addon
 * @static
 * @lang en
 */
SSMILib.DeleteStoredDocument = function(sdObj, timeout)
{
  var _ws = new WebServiceLib.Communicator();
  _ws.async = SSMILib.async;
  _ws.successHandler = SSMILib.StoredDocument.dsdSuccessCb;
  _ws.errorHandler = SSMILib.StoredDocument.dsdErrorCb;

  if(timeout){
    _ws.timeout = timeout;
    _ws.timeoutHandler = SSMILib.GetStoredDocument.dsdErrorCb;
  }

  _ws.token = SSMILib.RemoteAccess.Interceptor("WebService", _ws);

  _ws.soapAction = '"http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument#DeleteStoredDocument"';
  _ws.isDeviceReq = true;
  var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/StoredDocument";

  if (SSMILib.dummy) {
    SSMILib.onEvent("DeleteStoredDocument", true, null);
    return;
  }

  var _sdObj = new SSMILib.StoredDocument();

  if(sdObj.documents) _sdObj.documents = sdObj.documents;
  if(sdObj.boxes) _sdObj.boxes = sdObj.boxes;
  if(sdObj.userIdentifierTypes) _sdObj.userIdentifierTypes = sdObj.userIdentifierTypes;
  _sdObj.type = "DeleteStoredDocument";

  var _msg = _sdObj.serializeToString();

  /*AR185294*/
  _ws.headers[0] = "Connection";
  _ws.headers[1] = "close";

  _ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.StoredDocument.dsdSuccessCb = function(res)
{
  var _result = false;
  var _docList = new Array();

  if(!res.responseXML) {
    SSMILib.onEvent("DeleteStoredDocument", _result, null);
    return;
  }

  _docList = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, _docList);

  var _dsdrNode = res.responseXML.getElementsByTagNameNS(
      "http://www.fujixerox.co.jp/2011/02/ssm/management/storeddocument","DeleteStoredDocumentResponse");

  if(_dsdrNode.length && _dsdrNode[0].hasChildNodes()){

    var _resNodeLen = _dsdrNode[0].childNodes.length;
    for (var i = 0; i < _resNodeLen; i++){
      var _docNode = _dsdrNode[0].childNodes[i];

      if (_docNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_docNode.hasChildNodes()) { //不要なノードを飛ばす
        continue;
      }
      _docList.push(SSMILib.childNodeToProperty(_docNode));
    }
    _result = true;
  }
  SSMILib.onEvent("DeleteStoredDocument", _result, _docList);
};

/**
 * @private
 */
SSMILib.StoredDocument.dsdErrorCb = function(res)
{
  var _result = false;
  var soapFaultObj = null;
  soapFaultObj  = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
  SSMILib.onEvent("DeleteStoredDocument", _result, soapFaultObj);
};

/**
 * @private
 */
SSMILib.removePrefixOfString = function (str)
{
  if(!str)
    return;
  var returnStr = "";
  var iIndex = str.indexOf(':');
  returnStr = str.substring(iIndex+1, str.length);
  return returnStr;
};