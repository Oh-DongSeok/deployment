/** 
 * @fileoverview ジョブフローにおけるスキャン・コピージョブを扱うクラスで使用される定数を定義する<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2014 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.5.0
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in classes handling Scan/Copy jobs in Job Flow.
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2014 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.5.0
 * @lang en
 */

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">plex</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">plex</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.PLEX = function() {};

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
JFLib.PLEX.SIMPLEX = "Simplex";

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
JFLib.RESOURCE.SCANBW = 'Acquire/Scanner/BW';
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
JFLib.RESOURCE.SCANCOLOR = 'Acquire/Scanner/Color';
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
JFLib.RESOURCE.SCANMULTI = 'Acquire/Scanner/MultiLayers';

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
JFLib.PLEX.DUPLEX = "Duplex";

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
JFLib.PLEX.TUMBLE = "Tumble";

/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.PLEX.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">scanFrom</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">scanFrom</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.INDEVICE = function() {};
/**
 * プラテンガラス上の原稿をスキャンする
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Scan original document from Platen.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INDEVICE.PLATEN = "Platen";

/**
 * DADF上の原稿をスキャンする
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * Scan original document from DADF.
 * @final
 * @type  String
 * @constant
 * @lang en
 */
JFLib.INDEVICE.DADF = "DADF";

/**
 * プラテンガラス、DADFのうち原稿がセットされている入力機構からスキャンを行う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Scan from either Platen or DADF, whichever device document is set on.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.INDEVICE.BOTH = "Both";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">headposition</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">headposition</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.HP = function() {};
/**
 * 読める向きを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Head position set to top.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.HP.TOP = "Top";
/**
 * 左向きを表す
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * Head position set to left.
 * @final
 * @type  String
 * @constant
 * @lang en
 */
JFLib.HP.LEFT = "Left";
/**
 * 不明を表す
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * Head position is unknown.
 * @final
 * @type  String
 * @constant
 * @lang en
 */
JFLib.HP.UNKNOWN = "Unknown";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type  String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type  String
 * @constant
 * @lang en
 */
JFLib.HP.DEFAULT = "Default";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">colorMode</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">colorMode</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.CM = function() {};
/**
 * 自動を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Auto
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CM.AUTO = "Auto";
/**
 * 白黒画像を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Black and white.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CM.BW	= "BlackAndWhite";
/**
 * グレースケールを表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Grayscale.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CM.GRAY = "Grayscale";
/**
 * カラー画像を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Color.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CM.COLOR = "FullColor";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CM.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">resolution</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">resolution</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.RES = function() {};
/**
 * 200x100dpi
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 200x100dpi
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RES.R200_100 = "200x100/dpi";
/**
 * 200dpi
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 200dpi
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RES.R200 = "200x200/dpi";
/**
 * 300dpi
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 300dpi
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RES.R300 = "300x300/dpi";
/**
 * 400dpi
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 400dpi
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RES.R400 = "400x400/dpi";
/**
 * 600dpi
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 600dpi
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RES.R600 = "600x600/dpi";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">imageMode</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">imageMode</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.IM = function() {};
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IM.DEFAULT = "Default";
/**
 * 文字を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Text
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IM.TEXT = "Text";
/**
 * 文字写真（文字＋連続調画像）を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Mixed
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IM.MIXED = "Mixed";
/**
 * 印刷写真を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Halftone
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IM.HALFTONE = "Halftone";
/**
 * 印画紙写真を表す(コピーサービスのみ使用可能)
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Photo (only for Copy service)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IM.PHOTO = "Photo";
/**
 * 文字写真（文字＋印刷写真）を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Magazine (text and photo)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IM.MAGAZINE = "Magazine";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">darkness</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">darkness</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.DARK = function() {};
/**
 * Level3の濃さ
 * @final
 * @type Integer
 * @constant
 * @lang ja
 */
/**
 * Level3 darkness (parameter: darkness).
 * @final
 * @type Integer
 * @constant
 * @lang en
 */
JFLib.DARK.D3 = "100";
/**
 * Level2の濃さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 darkness (parameter: darkness).
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.D2 = "60";
/**
 * Level1の濃さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 darkness (parameter: darkness).
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.D1 = "30";
/**
 * 普通
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Normal.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.NORMAL = "0";
/**
 * Level1の薄さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 lightness.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.L1 = "-30";
/**
 * Level2の薄さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 lightness.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.L2 = "-60";
/**
 * Level3の薄さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level3 lightness.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.L3 = "-100";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.DARK.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">brightness</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">brightness</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.BRIGHT = function(){};
/**
 * Level3の明るさ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level3 brightness
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.B3 = "100";
/**
 * Level2の明るさ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 brightness
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.B2 = "60";
/**
 * Level1の明るさ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 brightness
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.B1 = "30";
/**
 * 普通
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Normal.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.NORMAL = "0";
/**
 * Level1の暗さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 darkness (parameter: brightness)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.D1 = "-30";
/**
 * Level2の暗さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 darkness (parameter: brightness)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.D2 = "-60";
/**
 * Level3の暗さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level3 darkness (parameter: brightness)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.D3 = "-100";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.BRIGHT.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">contrast</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">contrast</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.CONT = function(){};
/**
 * Level2の強さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 strongness in contrast
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.STRONG2 = "100";
/**
 * Level1の強さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 strongness in contrast
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.STRONG1 = "50";
/**
 * 普通
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Normal contrast.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.NORMAL = "0";
/**
 * Level1の弱さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 weakness in contrast.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.WEAK1 = "-50";
/**
 * Level2の弱さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 weakness in contrast.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.WEAK2 = "-100";
/**
 * コントラスト自動(コピージョブのみ)
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Constrast set automatically (Copy jobs only)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.AUTO = "Auto";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.CONT.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">sharpness</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">sharpness</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.SHARP  = function(){};
/**
 * Level2の強さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 strongness in sharpness
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SHARP.D2 = "100";
/**
 * Level1の強さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 strongness in sharpness
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SHARP.D1 = "50";
/**
 * 普通
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Normal
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SHARP.NORMAL = "0";
/**
 * Level1の弱さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 weakness in sharpness.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SHARP.L1 = 	"-50";
/**
 * Level2の弱さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 weakness in sharpness.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SHARP.L2 = 	"-100";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SHARP.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">saturation</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">saturation</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.SAT  = function(){};
/**
 * Level2の高さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 high saturation
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SAT.H2 = "100";
/**
 * Level1の高さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 high saturation
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SAT.H1 = "50";
/**
 * 普通
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Normal
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SAT.NORMAL = "0";
/**
 * Level1の低さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level1 low saturation
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SAT.L1 = 	"-50";
/**
 * Level2の低さ
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Level2 low saturation
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SAT.L2 = 	"-100";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Operation is according to device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.SAT.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComScan.Magnification.html">Magnification</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.ComScan.Magnification.html">Magnification</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.MAG  = function(){};
/**
 * A3->B5
 * @final
 * @constant
 * @lang ja
 */
/**
 * A3->B5
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A3toB5 = 61.2;
/**
 * A3->A4
 * @final
 * @constant
 * @lang ja
 */
/**
 * A3->A4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A3toA4 = 70.7;
/**
 * B4->B5
 * @final
 * @constant
 * @lang ja
 */
/**
 * B4->B5
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B4toB5 = 70.7;
/**
 * B4->A4
 * @final
 * @constant
 * @lang ja
 */
/**
 * B4->A4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B4toA4 = 81.6;
/**
 * B5->A5
 * @final
 * @constant
 * @lang ja
 */
/**
 * B5->A5
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B5toA5 = 81.6;
/**
 * A3->B4
 * @final
 * @constant
 * @lang ja
 */
/**
 * A3->B4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A3toB4 = 86.6;
/**
 * A4->B5
 * @final
 * @constant
 * @lang ja
 */
/**
 * A4->B5
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A4toB5 = 86.6;
/**
 * 等倍
 * @final
 * @constant
 * @lang ja
 */
/**
 * 1:1
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.FIX100 = 100.0;
/**
 * B4->A3
 * @final
 * @constant
 * @lang ja
 */
/**
 * B4->A3
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B4toA3 = 115.4;
/**
 * B5->A4
 * @final
 * @constant
 * @lang ja
 */
/**
 * B5->A4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B5toA4 = 115.4;
/**
 * A4->B4
 * @final
 * @constant
 * @lang ja
 */
/**
 * A4->B4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A4toB4 = 122.5;
/**
 * A5->B5
 * @final
 * @constant
 * @lang ja
 */
/**
 * A5->B5
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A5toB5 = 122.5;
/**
 * A4->A3
 * @final
 * @constant
 * @lang ja
 */
/**
 * A4->A3
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A4toA3 = 141.4;
/**
 * B5->B4
 * @final
 * @constant
 * @lang ja
 */
/**
 * B5->B4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B5toB4 = 141.4;
/**
 * 出力サイズで指定された画像サイズに適合するように拡大・縮小率を自動的に決定する
 * @final
 * @constant
 * @lang ja
 */
/**
 * Automatically sets enlargement/reduction rates according to output image size.
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.AUTO = "Auto";
/**
 * A3->A5
 * @final
 * @constant
 * @lang ja
 */
/**
 * A3->A5
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A3toA5= 50.0;
/**
 * B4->B6
 * @final
 * @constant
 * @lang ja
 */
/**
 * B4->B6
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B4toB6= 50.0;
/**
 * A5->A3
 * @final
 * @constant
 * @lang ja
 */
/**
 * A5->A3
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.A5toA3= 200.0;
/**
 * B6->B4
 * @final
 * @constant
 * @lang ja
 */
/**
 * B6->B4
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.B6toB4= 200.0;
/**
 * 25％
 * @final
 * @constant
 * @lang ja
 */
/**
 * 25％
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.FIX25= 25.0;
/**
 * 400％
 * @final
 * @constant
 * @lang ja
 */
/**
 * 400%
 * @final
 * @constant
 * @lang en
 */
JFLib.MAG.FIX400= 400.0;

/**
 * このコンストラクタを明示的に呼び出す必要はない<br>
 * ｢XXXXクラスのみ適用可能である｣というコメントがない用紙サイズは<br>
 * スキャン(<a href="JFLib.ComScan.InputMediumSize.html">InputMediumSize</a>, <a href="JFLib.ComScan.OutputMediumSize.html">OutputMediumSize</a>)と<br>
 * メディアプリント(<a href="JFLib.ComPrint.MediumSize.html">MediumSize</a>、<a href="JFLib.ComPrint.OriginalImageSize.html">OriginalImageSize</a>)の両方で指定可能である。
 * @class <a href="JFLib.ComScan.InputMediumSize.html">InputMediumSize</a>,
 * <a href="JFLib.ComScan.OutputMediumSize.html">OutputMediumSize</a>,
 * <a href="JFLib.ComPrint.MediumSize.html">MediumSize</a>,
 * <a href="JFLib.ComPrint.OriginalImageSize.html">OriginalImageSize</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.<br>
 * Paper sizes without the comment "Applied only for XXXX class"<br>
 * can be specified for both Scan (<a href="JFLib.ComScan.InputMediumSize.html">InputMediumSize</a>, <a href="JFLib.ComScan.OutputMediumSize.html">OutputMediumSize</a>) and <br>
 * Media Print (<a href="JFLib.ComPrint.MediumSize.html">MediumSize</a>, <a href="JFLib.ComPrint.OriginalImageSize.html">OriginalImageSize</a>).
 * @class This class defines constants used in <a href="JFLib.ComScan.InputMediumSize.html">InputMediumSize</a> and <a href="JFLib.ComScan.OutputMediumSize.html">OutputMediumSize</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.MS  = function(){};
/**
 * 自動
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Auto
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.AUTO = "Auto";
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
JFLib.MS.NOTSPEC = "NotSpecified";
/**
 * 非定型
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Other (non-standard size)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.NONSTANDARD = "Other";
/**
 * A3SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A3SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A3SEF = "ISO-A3SEF";
/**
 * A4SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A4SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A4SEF = "ISO-A4SEF";
/**
 * A4LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A4LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A4LEF = "ISO-A4LEF";
/**
 * A5SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A5SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A5SEF = "ISO-A5SEF";
/**
 * A5LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A5LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A5LEF = "ISO-A5LEF";
/**
 * A6SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A6SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A6SEF = "ISO-A6SEF";
/**
 * A6LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A6LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A6LEF = "ISO-A6LEF";
/**
 * B4SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B4SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B4SEF = "JIS-B4SEF";
/**
 * B5SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B5SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B5SEF = "JIS-B5SEF";
/**
 * B5LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B5LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B5LEF = "JIS-B5LEF";
/**
 * B6SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B6SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B6SEF = "JIS-B6SEF";
/**
 * B6LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B6LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B6LEF = "JIS-B6LEF";
/**
 * LetterLEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * LetterLEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LETTERLEF = "NA-8.5x11LEF";
/**
 * LetterSEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * LetterSEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LETTERSEF = "NA-8.5x11SEF";
/**
 * Legal
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Legal
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LEGAL = "NA-8.5x14SEF";
/**
 * Ledger
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Ledger
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LEDGER = "NA-11x17SEF";
/**
 * ページごとにサイズを自動検知
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Automatically detect size per page (size mix original)
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.MIXED = "Mixed";

/**
 * B4(ISO) SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B4(ISO) SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B4ISOSEF = "ISO-B4SEF";

/**
 * B5(ISO) SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B5(ISO) SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B5ISOSEF = "ISO-B5SEF";

/**
 * B5(ISO) LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B5(ISO) LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B5ISOLEF = "ISO-B5LEF";

/**
 * 郵便はがき SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.JPPOSTCARDSEF = "JP-PostCardSEF";

/**
 * 郵便はがき LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.JPPOSTCARDLEF = "JP-PostCardLEF";

/**
 * 十六開(大陸) SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 16 Kai (mainland China) SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.CN16KAISEF = "CN-16KaiSEF";

/**
 * 十六開(大陸) LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 16 Kai (mainland China) LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.CN16KAILEF = "CN-16KaiLEF";

/**
 * 八開(大陸) SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8 Kai (mainland China) SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.CN8KAISEF = "CN-8KaiSEF";

/**
 * 十六開(台湾) SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 16 Kai (Taiwan) SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.TW16KAISEF = "TW-16KaiSEF";

/**
 * 十六開(台湾) LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 16 Kai (Taiwan) LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.TW16KAILEF = "TW-16KaiLEF";

/**
 * 八開(台湾) SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8 Kai (Taiwan) SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.TW8KAISEF = "TW-8KaiSEF";

/**
 * 写真Lサイズ SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Photo L size SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.PICTURELSIZESEF = "NA-3.5x5SEF";

/**
 * 写真Lサイズ LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Photo L size LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.PICTURELSIZELEF = "NA-3.5x5LEF";

/**
 * Postcard SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard SEF<br>
 * 
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.POSTCARDSEF = "NA-3.5x5.5SEF";

/**
 * Postcard-US SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard-US SEF<br>
 * 
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.USPOSTCARDSEF = "NA-4x6SEF";

/**
 * Postcard-US LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard-US LEF<br>
 * 
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.USPOSTCARDLEF = "NA-4x6LEF";

/**
 * 写真2Lサイズ SEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Photo 2L size SEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.PICTURE2LSIZESEF = "NA-5x7SEF";

/**
 * 写真2Lサイズ LEF
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Photo 2L size LEF
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.PICTURE2LSIZELEF = "NA-5x7LEF";

/**
 * Statement/Invoice SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Statement/Invoice SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.INVOICESEF = "NA-5.5x8.5SEF";

/**
 * Statement/Invoice LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Statement/Invoice LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.INVOICELEF = "NA-5.5x8.5LEF";

/**
 * Postcard(6x9) SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard(6x9) SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.POSTCARD6X9SEF = "NA-6x9SEF";

/**
 * Executive SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Executive SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.EXECUTIVESEF = "NA-7.25x10.5SEF";

/**
 * Executive LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Executive LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.EXECUTIVELEF = "NA-7.25x10.5LEF";

/**
 * NA-8x10 SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * NA-8x10 SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.NA8X10SEF = "NA-8x10SEF";

/**
 * NA-8x10 LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * NA-8x10 LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.NA8X10LEF = "NA-8x10LEF";

/**
 * Spanish Folio SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Spanish Folio SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.SPANISHFOLIOSEF = "NA-8.46x12.4SEF";

/**
 * 8.5x13 SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8.5x13 SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.FOLIOSEF = "NA-8.5x13SEF";

/**
 * UK-11x15 SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * UK-11x15 SEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.UK11X15SEF = "UK-11x15SEF";

/**
 * A4-Cover LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A4-Cover LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A4COVERLEF = "FUJIXEROX-A4CoverLEF";

/**
 * Letter-Cover LEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Letter-Cover LEF<br>
 * Applied only for JFLib.ComScan.MediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LETTERCOVERLEF = "FUJIXEROX-LetterCoverLEF";

/**
 * A3(ISO)LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A3(ISO)LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A3LEF = "ISO-A3LEF";

/**
 * B4(JIS) LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B4(JIS) LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B4LEF = "JIS-B4LEF";

/**
 * B4(ISO) LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * B4(ISO) LEF<br>
 * Applied only for OutputMediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.B4ISOLEF = "ISO-B4LEF";

/**
 * 八開(大陸) LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8 Kai (mainland China) LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.CN8KAILEF = "CN-8KaiLEF";

/**
 * 八開(台湾) LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8 Kai (Taiwan) LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.TW8KAILEF = "TW-8KaiLEF";

/**
 * Postcard LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.POSTCARDLEF = "NA-3.5x5.5LEF";

/**
 * Postcard(6x9) LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Postcard(6x9) LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.POSTCARD6X9LEF = "NA-6x9LEF";

/**
 * Spanish Folio LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Spanish Folio LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.SPANISHFOLIOLEF = "NA-8.46x12.4LEF";

/**
 * 8.5x13 LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8.5x13 LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.FOLIOLEF = "NA-8.5x13LEF";

/**
 * Legal LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Legal LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LEGALLEF = "NA-8.5x14LEF";

/**
 * Ledger LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Ledger LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LEDGERLEF = "NA-11x17LEF";

/**
 * UK-11x15 LEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * UK-11x15 LEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize class
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.UK11X15LEF = "UK-11x15LEF";

/**
 * A4-Cover SEF<br>
 * JFLib.ComScan.OutputMediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * A4-Cover SEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.A4COVERSEF = "FUJIXEROX-A4CoverSEF";

/**
 * Letter-Cover SEF<br>
 * JFLib.ComScan.MediumSizeクラスのみ適用可能である
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Letter-Cover SEF<br>
 * Applied only for JFLib.ComScan.OutputMediumSize
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.LETTERCOVERSEF = "FUJIXEROX-LetterCoverSEF";

/**
 * SRA3(12.6x17.7) SEF<br>
 * JFLib.ComPrint.OutputMediumSizeクラスのみ適用可能である<br>
 * デジカメプリントの場合のみ指定可能
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * SRA3(12.6x17.7) SEF<br>
 * Applied only for JFLib.ComPrint.OutputMediumSize class<br>
 * It can be specified only for printing of pictures input from a digital camera
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.SRA3SEF = "SRA3-SEF";

/**
 * SRA3(12.6x17.7) LEF<br>
 * JFLib.ComPrint.OutputMediumSizeクラスのみ適用可能である<br>
 * デジカメプリントの場合のみ指定可能
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * SRA3(12.6x17.7) LEF<br>
 * Applied only for JFLib.ComPrint.OutputMediumSize class<br>
 * It can be specified only for printing of pictures input from a digital camera
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.MS.SRA3LEF = "SRA3-LEF";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">bilevel</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">bilevel</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.COMPRESSION = function(){};

/**
 * 複合機の既定値を使用する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Device default settings.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.COMPRESSION.DEFAULT = 'Default';
/**
 * 自動的に圧縮方法を選択する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Automatic selection of compression method.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.COMPRESSION.AUTO = 'Auto';
/**
 * MMR圧縮
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * MMR compression.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.COMPRESSION.MMR = 'MMR';
/**
 * MH圧縮
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * MH compression
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.COMPRESSION.MH = 'MH';
/**
 * JBIG2算術符号化圧縮
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * JBIG2A
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.COMPRESSION.JBIG2A = 'JBIG2A';
/**
 * JJBIG2ハフマン符号化圧縮
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * JJBIG2H
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.COMPRESSION.JBIG2H = 'JBIG2H';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Scan.html">ratio</a>に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.Scan.html">ratio</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.RATIO = function(){};
/**
 * 多値画像圧縮率として複合機の既定値を使用する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Device default compression rate for multilevel images.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RATIO.DEFAULT = 'Default';
/**
 * 高く
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * "Higher" compression rate for multilevel images.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RATIO.H2 = '100';
/**
 * やや高く
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * "High" compression rate for multilevel images.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RATIO.H1 = '70';
/**
 * 標準
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * "Normal" compression rate for multilevel images.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RATIO.NORMAL = '50';
/**
 * やや低く
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * "Low" compression rate for multilevel images.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RATIO.L1 = '30';
/**
 * 低く
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * "Lower" compression rate for multilevel images.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.RATIO.L2 = '0';


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComScan.SplitScan.html">SplitScan</a>オブジェクトに用いられる2面の画像のページ順と向きの定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants of order and orientation of two impressions used in <a href="JFLib.ComScan.SplitScan.html">SplitScan</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.SPLITBOUND = function(){};

/**
 * 左綴じ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Left
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITBOUND.LEFT = 'Left';
/**
 * 右綴じ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Right
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITBOUND.RIGHT = 'Right';
/**
 * 上綴じ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Top
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITBOUND.TOP = 'Top';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComScan.SplitScan.html">SplitScan</a>オブジェクトに用いられる2面の画像の選択画像の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants of selected image(s) of the two impessions used in <a href="JFLib.ComScan.SplitScan.html">SplitScan</a> object.
 * @constructor 
 * @lang en
 */
JFLib.SPLITEXTRACT = function(){};
/**
 * 両ページ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Both
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.BOTH = 'Both';
/**
 * 左ページのみ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Left
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.LEFT = 'Left';
/**
 * 右ページのみ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Right
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.RIGHT = 'Right';
/**
 * 上ページのみ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Top
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.TOP = 'Top';
/**
 * 下ページのみ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Bottom
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.BOTTOM = 'Bottom';
/**
 * 前ページのみ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Front
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.FRONT = 'Front';
/**
 * 後ページのみ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Back
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITEXTRACT.BACK = 'Back';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.AsBook.html">AsBook</a>オブジェクトに用いられる分割されたページの開始/終了ページの定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants of which of the pages resulting from the split is start/end page used in <a href="JFLib.Copy.AsBook.html">AsBook</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.SPLITPAGE = function(){};
/**
 * 左ページから(まで)
 * @constant
 * @type String
 * @lang ja
 */
/**
 * From (To) left
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITPAGE.LEFT = 'Left';
/**
 * 右ページから(まで)
 * @constant
 * @type String
 * @lang ja
 */
/**
 * From (To) right
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITPAGE.RIGHT = 'Right';
/**
 * 上ページから(まで)
 * @constant
 * @type String
 * @lang ja
 */
/**
 * From (To) top
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITPAGE.TOP = 'Top';
/**
 * 下ページから(まで)
 * @constant
 * @type String
 * @lang ja
 */
/**
 * From (To) bottom
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITPAGE.BOTTOM = 'Bottom';
/**
 * 前ページから(まで)
 * @constant
 * @type String
 * @lang ja
 */
/**
 * From (To) front
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITPAGE.FRONT = 'Front';
/**
 * 後ページから(まで)
 * @constant
 * @type String
 * @lang ja
 */
/**
 * From (To) back
 * @constant
 * @type String
 * @lang en
 */
JFLib.SPLITPAGE.BACK = 'Back';


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.OCR.html">OCR</a>オブジェクトに用いられるOCR結果テキストの圧縮方法の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 */
JFLib.OCRCOMP = function(){};
/**
 * OCR結果テキスト圧縮を行わない
 * @constant
 * @type String
 */
JFLib.OCRCOMP.NONE = 'none';
/**
 * デバイスのデフォルト値にもとづいて圧縮方法を決定する
 * @constant
 * @type String
 */
JFLib.OCRCOMP.DEFAULT = 'default';
/**
 * OCR結果テキストの圧縮方法をシステムが決定する
 * @constant
 * @type String
 */
JFLib.OCRCOMP.SYSTEM = 'system';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.OCR.html">OCR</a>オブジェクトに用いられるOCR結果テキストの圧縮方法の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 */
JFLib.OCRLANG = function(){};
/**
 * 日本語
 * @constant
 * @type String
 */
JFLib.OCRLANG.JA = 'ja';
/**
 * 英語
 * @constant
 * @type String
 */
JFLib.OCRLANG.EN = 'en';
/**
 * デバイスに設定されているデフォルトOCR言語
 * @constant
 * @type String
 */
JFLib.OCRLANG.DEFAULT = 'x-default';

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class 色空間を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines the color space.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en 
 */
JFLib.NAMEDCOLORSPACE = function(){};

/**
 * 標準YCC
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Standard YCC
 * @constant
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLORSPACE.STDYCC = "sYCC";

/**
 * デバイスRGB
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Device RGB (RGB colorspace defined by device.)
 * @constant
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLORSPACE.DRGB = "DeviceRGB";

/**
 * デバイスYCC
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Device YCC (YCC colorspace defined by device.)
 * @constant
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLORSPACE.DYCC = "DeviceYCC";

JFLib.JSIncluded("JfsDefScan");