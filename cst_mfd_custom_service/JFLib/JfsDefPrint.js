/** 
 * @fileoverview ジョブフローにおけるプリント・コピージョブを扱うクラスで使用される定数を定義する<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.4.0
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in classes handling Print/Copy jobs in Job Flow.
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.4.0
 * @lang en
 */

JFLib.JSInclude("JfsDefCom");
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
JFLib.RESOURCE.PRINT = 'Print';

/**
 * プリント出力
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Print output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.Print = 1;


 /**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html">outPlex</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Print.html">outPlex</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.OUTPLEX = function() {};

/**
 * 片面を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Simplex.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTPLEX.SIMPLEX = "Simplex";

/**
 * 両面（左右開き）を表す
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * Duplex (head to head)
 * @final
 * @type  String
 * @constant
 * @lang en
 */
JFLib.OUTPLEX.DUPLEX = "Duplex";

/**
 * 両面（上下開き）を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Duplex (head to tail)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTPLEX.TUMBLE = "Tumble";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html">inputTray</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Print.html">inputTray</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.INTRAY = function() {};
/**
 * 自動トレイ選択
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Auto Tray selection.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.AUTO = "Auto";
/**
 * 手差しトレイ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * MSI
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.BYPASS = "Bypass";
/**
 * 大容量トレイ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * High-capacity feeder 
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.HCF = "HCF";
/**
 * トレイ1
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Tray 1
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY1 = "Tray0";
/**
 * トレイ2
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Tray 2
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY2 = "Tray1";
/**
 * トレイ3
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Tray 3
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY3 = "Tray2";
/**
 * トレイ4
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Tray 4
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY4 = "Tray3";
/**
 * 手差しトレイ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * MSI
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY5 = "Tray4";
/**
 * 第1大容量フィーダー
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * High-capacity feeder 1 (Tray 5)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY6 = "Tray5";
/**
 * 第2大容量フィーダー
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * High-capacity feeder 2 (Tray 6)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY7 = "Tray6";
/**
 * インターポーザー
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Interposer
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY8 = "Tray7";
/**
 * 第3大容量フィーダー
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * High-capacity feeder 3 (Tray 8)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY9 = "Tray8";
/**
 * 第4大容量フィーダー
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * High-capacity feeder 4 (Tray 9)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INTRAY.TRAY10 = "Tray9";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComPrint.Staple.html">Staple</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.ComPrint.Staple.html">Staple</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS = function() {};
/**
 * 上
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.TOP = 'Top';
/**
 * 下
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Bottom
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.BOT = 'Bottom';
/**
 * 左上
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.TOPLEF = 'TopLeft';
/**
 * 右上
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top right
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.TOPRGT = 'TopRight';
/**
 * 左中央
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Center left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.MIDLEF = 'MiddleLeft';
/**
 * 右中央
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Center right
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.MIDRGT = 'MiddleRight';
/**
 * 左下
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Bottom left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.BOTLEF = 'BottomLeft';
/**
 * 右下
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Bottom right
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.STAPLEPOS.BOTRGT = 'BottomRight';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComPrint.Punch.html">Punch</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */

/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.ComPrint.Punch.html">Punch</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.PUNCHPOS = function() {};
/**
 * 上
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PUNCHPOS.TOP = 'Top';
/**
 * 下
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Bottom
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PUNCHPOS.BOT = 'Bottom';
/**
 * 左
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PUNCHPOS.LEF = 'Left';
/**
 * 右
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Right
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PUNCHPOS.RGT = 'Right';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html">outputTray</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Print.html">outputTray</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.OUTTRAY = function() {};
/**
 * 自動トレイ選択
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Auto Tray selection
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.AUTO = "Auto";
/**
 * フィニッシャー
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Finisher
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.FINISHER = "Finisher";
/**
 * メールボックス
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX = "Mailbox";
/**
 * フェースダウントレイ0
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Facedown Tray 0
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.FACEDOWN0 = "Facedown0";
/**
 * フェースダウントレイ1
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Facedown Tray 1
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.FACEDOWN1 = "Facedown1";
/**
 * フェースダウントレイ2
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * Facedown Tray 2
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.FACEDOWN2 = "Facedown2";
/**
 * フェースアップトレイ0
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Faceup Tray 0
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.FACEUP0 = "Faceup0";
/**
 * フェースアップトレイ1
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Faceup Tray 1
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.FACEUP1 = "Faceup1";
/**
 * メールボックスビン1
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 1
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX0 = "Mailbox0";
/**
 * メールボックスビン2
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 2
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX1 = "Mailbox1";
/**
 * メールボックスビン3
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 3
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX2 = "Mailbox2";
/**
 * メールボックスビン4
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 4
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX3 = "Mailbox3";
/**
 * メールボックスビン5
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 5
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX4 = "Mailbox4";
/**
 * メールボックスビン6
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 6
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX5 = "Mailbox5";
/**
 * メールボックスビン7
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 7
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX6 = "Mailbox6";
/**
 * メールボックスビン8
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 8
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX7 = "Mailbox7";
/**
 * メールボックスビン9
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 9
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX8 = "Mailbox8";
/**
 * メールボックスビン10
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mailbox bin 10
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.MAILBOX9 = "Mailbox9";
/**
 * スタッカ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Stacker 
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.STACKER = "Stacker";
/**
 * スタッカ0
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Stacker 0
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.STACKER0 = "Stacker0";
/**
 * スタッカ1
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Stacker 1
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTTRAY.STACKER1 = "Stacker1";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html#outPlexOverwriteCondition">overwriteCondition</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Print.html#outPlexOverwriteCondition">overwriteCondition</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.OUTPLEXOWCONDITION = function() {};
/**
 * 蓄積時の指定にかかわらず両面出力設定を上書きする
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Overwrites simplex/duplex output setting regardless of the designation upon storage.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTPLEXOWCONDITION.ALL = "All";
/**
 * 蓄積時に片面出力設定がされた文書のみ両面出力設定を上書きする
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Overwrites simplex/duplex output setting only for documents of which simplex setting is set upon storage.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OUTPLEXOWCONDITION.SIMPLEX = "Simplex";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html#smoothing">smoothing</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Print.html#smoothing">smoothing</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.SMOOTHING = function(){};

/**
 * デバイスの設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Conforms to MFD settings
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SMOOTHING.DEFAULT = 'Default';

/**
 * スムージングを行う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Performs smoothing
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SMOOTHING.TRUE = 'true';

/**
 * スムージングを行わない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Does not perform smoothing
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SMOOTHING.FALSE = 'false';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class 出力ページの分割数に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines the constant used for the number of areas that an output page is divided to.
 * @constructor There is no need to explicitly call this constructor.
 * @constant
 * @lang en
 */
JFLib.NUPFACES = function(){};

/**
 * 自動<br>
 * デジカメプリントの場合のみ適用できる。それ以外は無視される。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Auto<br>
 * Valid only for printing of pictures input from a digital camera. Otherwise, the designation is ignored.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.AUTO = 'Auto';

/**
 * 出力ページを分割しない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Do not divide output page
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.ONE = '1';

/**
 * 出力ページを2分割する。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Divide output page into two parts.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.TWO = '2';

/**
 * 出力ページを3分割する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Divide output page into three parts
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.THREE = '3';

/**
 * 出力ページを4分割する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Divide output page into four parts
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.FOUR = '4';

/**
 * 出力ページを6分割する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Divide output page into six parts
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.SIX = '6';

/**
 * 出力ページを8分割する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Divide output page into eight parts
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPFACES.EIGHT = '8';

/**
 * 左寄せで配置する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Layout with images shifted to left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPSHIFT = 'left';

//Modification for 2Color Print (FXKIS : Soyeon, Hwang ) START
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html#colorMode">OutputColor</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
JFLib.PRINT_OUTPUTCOLOR = function() {};

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Print.html#colorMode">OutputColor</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @constant
 * @lang ja
 */
JFLib.PRINT_OUTPUTCOLOR.METHOD = function() {};

/**
 * 文書内容の明度に応じた色変換処理を指定する。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.PRINT_OUTPUTCOLOR.METHOD.BRIGHTNESS = "Brightness";

/**
 * 文書内容の彩度に応じた色変換処理を指定する。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.PRINT_OUTPUTCOLOR.METHOD.SATURATION = "Saturation";
//Modification for 2Color Print (FXKIS : Soyeon, Hwang ) End

JFLib.JSIncluded("JfsDefPrint");