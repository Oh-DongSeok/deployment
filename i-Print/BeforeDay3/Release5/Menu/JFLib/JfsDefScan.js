/** 
 * @fileoverview ジョブフローにおけるスキャン・コピージョブを扱うクラスで使用される定数を定義する
 *
 * @author Copyright(C) 2007-2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.2.2
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in classes handling Scan/Copy jobs in Job Flow.
 *
 * @author Copyright(C) 2007-2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.2.2
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
 * 文字写真を表す
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
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComScan.InputMediumSize.html">InputMediumSize</a>と<a href="JFLib.ComScan.OutputMediumSize.html">OutputMediumSize</a>オブジェクトに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.ComScan.InputMediumSize.html">InputMediumSize</a> and <a href="JFLib.ComScan.OutputMediumSize.html">OutputMediumSize</a> objects.
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
 */
JFLib.SPLITBOUND = function(){};

/**
 * 左綴じ
 * @final
 * @type String
 */
JFLib.SPLITBOUND.LEFT = 'Left';
/**
 * 右綴じ
 * @final
 * @type String
 */
JFLib.SPLITBOUND.RIGHT = 'Right';
/**
 * 上綴じ
 * @final
 * @type String
 */
JFLib.SPLITBOUND.TOP = 'Top';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.ComScan.SplitScan.html">SplitScan</a>オブジェクトに用いられる2面の画像の選択画像の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 */
JFLib.SPLITEXTRACT = function(){};
/**
 * 両ページ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.BOTH = 'Both';
/**
 * 左ページのみ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.LEFT = 'Left';
/**
 * 右ページのみ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.RIGHT = 'Right';
/**
 * 上ページのみ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.TOP = 'Top';
/**
 * 下ページのみ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.BOTTOM = 'Bottom';
/**
 * 前ページのみ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.FRONT = 'Front';
/**
 * 後ページのみ
 * @final
 * @type String
 */
JFLib.SPLITEXTRACT.BACK = 'Back';
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.AsBook.html">AsBook</a>オブジェクトに用いられる分割されたページの開始/終了ページの定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 */
JFLib.SPLITPAGE = function(){};
/**
 * 左ページから(まで)
 * @final
 * @type String
 */
JFLib.SPLITPAGE.LEFT = 'Left';
/**
 * 右ページから(まで)
 * @final
 * @type String
 */
JFLib.SPLITPAGE.RIGHT = 'Right';
/**
 * 上ページから(まで)
 * @final
 * @type String
 */
JFLib.SPLITPAGE.TOP = 'Top';
/**
 * 下ページから(まで)
 * @final
 * @type String
 */
JFLib.SPLITPAGE.BOTTOM = 'Bottom';
/**
 * 前ページから(まで)
 * @final
 * @type String
 */
JFLib.SPLITPAGE.FRONT = 'Front';
/**
 * 後ページから(まで)
 * @final
 * @type String
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
 * @final
 * @type String
 */
JFLib.OCRCOMP.NONE = 'none';
/**
 * デバイスのデフォルト値にもとづいて圧縮方法を決定する
 * @final
 * @type String
 */
JFLib.OCRCOMP.DEFAULT = 'default';
/**
 * OCR結果テキストの圧縮方法をシステムが決定する
 * @final
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
 * @final
 * @type String
 */
JFLib.OCRLANG.JA = 'ja';
/**
 * 英語
 * @final
 * @type String
 */
JFLib.OCRLANG.EN = 'en';
/**
 * デバイスに設定されているデフォルトOCR言語
 * @final
 * @type String
 */
JFLib.OCRLANG.DEFAULT = 'x-default';


JFLib.JSIncluded("JfsDefScan");

