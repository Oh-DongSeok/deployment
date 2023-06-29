/** 
 * @fileoverview 文書転送を含むジョブフローのために共通で使用される定数を定義する
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 2.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines constants commonly used in creating Job Flows which specify document distribution.
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 2.1.1
 * @lang en
 */


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class 文書フォーマット指定に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used to specify document format.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.DOCFORMAT = function() {};
/**
 * 指定なし
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Not specified.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.NOTSPEC = 'NotSpecified';
/**
 * マルチページTIFF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Multipage TIFF.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.TIFF_MULTI = 'TIFF/Multi';
/**
 * シングルページTIFF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Single-page TIFF.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.TIFF_SINGLE = 'TIFF/Single';
/**
 * RFC3250で規定されたフォーマット
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Format designated by RFC3250.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.TIFF_FX = 'TIFF/FX';
/**
 * PDF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * PDF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.PDF = 'PDF';
/**
 * DocuWorks
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * DocuWorks
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.XDW = 'DocuWorks';
/**
 * JPEG
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * JPEG
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.JPEG = 'JFIF';
/**
 * XPS
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * XPS
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DOCFORMAT.XPS = 'XPS';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Distribute.AuthInfo.html">AuthInfo</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants for use by <a href="JFLib.Distribute.AuthInfo.html">AuthInfo</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.AUTH = function() {};
/**
 * 未認証
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * No authentication.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.AUTH.NONE = 'Unauthenticated';
/**
 * ユーザー名・パスワード認証
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Authenticate by username/password.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.AUTH.NAMEPASS = 'OperatornamePassword';
/**
 * パスワード認証
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Password authentication.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.AUTH.PASSONLY = 'PasswordOnly';
/**
 * HTTP認証
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * HTTP authentication.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.AUTH.HTTP = 'Rfc2617';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class ファイル生成ポリシー設定に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in setting filing policies.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.FILEPOLICY = function() {};
/**
 * 同名の文書が存在していた場合には、既存の文書を上書きする
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * If file of same name exists, existing file is overwritten by new file.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.FILEPOLICY.OVERWRITE = 'Overwrite';
/**
 * 指定されたフォルダ名の下に配送する<br>同名のフォルダが存在していた場合には、指定されたフォルダ名を変更し、その下に配送する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Distribute document to specified folder. <br>
 * If folder of the same name exists, specified folder name is modified and file is distributed to the newly created folder.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.FILEPOLICY.NEWAUTOGEN = 'NewAutoGenerate';
/**
 * 同名の文書が存在していた場合には、配送しない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * If file of the same name already exists, file is not distributed.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.FILEPOLICY.NEWEAXACT = 'NewExact';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Fax/InternetFaxの通信モード設定に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants to specify transmission mode in Fax / Internet Fax.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.TM = function() {};

/**
 * G3自動
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * G3 Auto
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.TM.G3 = 'G3/Auto';
/**
 * G4自動
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * G4 Auto 
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.TM.G4 = 'G4/Auto';
/**
 * G3国際通信
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * G3 international
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.TM.INTNL = 'G3/international';
/**
 * G3自動 ECMあり
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * G3 Auto, with ECM
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.TM.G3ECM = 'G3/ECM';
/**
 * スーパーG3
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Super G3
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.TM.SUPERG3 = 'SuperG3';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Fax/InternetFaxの送信元記録設定に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used to set sender record settings in Fax / Internet Fax.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.SR = function() {};
/**
 * 発信元記録を出力しない 
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Sender record is not output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SR.NONE = 'None';
/**
 * デバイス設定（システムデータ）の設定に準じて動作する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings (system data settings).
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SR.DEFAULT = 'Default';
/**
 * デバイスに既定された発信元記録を出力する 
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Default device sender record is output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SR.SYSTEM = 'System';

JFLib.JSIncluded("JfsDefDistribute");
