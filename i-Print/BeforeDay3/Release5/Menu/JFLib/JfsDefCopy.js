/** 
 * @fileoverview ジョブフローにおけるコピージョブを扱うクラスで使用される定数を定義する
 *
 * @author Copyright(C) 2007-2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.3.0
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in Job Flows which include Copy jobs.
 *
 * @author Copyright(C) 2007-2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.3.0
 * @lang en
 */

JFLib.JSInclude("JfsDefCom");
//JfsDefScan.jsのロード
JFLib.JSInclude("JfsDefScan");
//JfsDefPrint.jsのロード
JFLib.JSInclude("JfsDefPrint");

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
JFLib.RESOURCE.COPY = 'Copy';

/**
 * 印画紙写真を表す(コピーサービスのみ使用可能)
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Photo (Available for Copy Service only)
 * @final
 * @type String
 * @lang en
 */
JFLib.IM.PHOTO = "Photo";
/**
 * コントラスト自動(コピージョブのみ)
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Auto Contrast (Copy jobs only)
 * @final
 * @type String
 * @lang en
 */
JFLib.CONT.AUTO = "Auto";
/**
 * 単色カラー画像を表す
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Single-color image
 * @final
 * @type String
 * @lang en
 */
JFLib.CM.MONOCOLOR = "MonoColor";
/**
 * 2色カラー画像を表す
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Two-color image
 * @final
 * @type String
 * @lang en
 */
JFLib.CM.BICOLOR = "BiColor";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.OuputColor.html">OuputColor</a>オブジェクトに用いられる出力色の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing output color, to be used in <a href="JFLib.Copy.OuputColor.html">OuputColor</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.NAMEDCOLOR = function() {};
/**
 * デバイスの固定登録色1 (レッド) を出力色とする 
 * @final
 * @type String
 * @lang ja
 */
 /**
 * MFD Color 1 (Red) 
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.RED = "Red";
/**
 * デバイスの固定登録色2(グリーン) を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * MFD Color 2 (Green)
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.GREEN = "Green";
/**
 * デバイスの固定登録色3 (ブルー) を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * MFD Color 3 (Blue)
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.BLUE = "Blue";
/**
 * デバイスの固定登録色4 (イエロー) を出力色とする 
 * @final
 * @type String
 * @lang ja
 */
 /**
 * MFD Color 4 (Yellow)
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.YELLOW = "Yellow";
/**
 * デバイスの固定登録色5 (マゼンタ) を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * MFD Color 5 (Magenta)
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.MAGENTA = "Magenta";
/**
 * デバイスの固定登録色6 (シアン) を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * MFD Color 6 (Cyan)
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.CYAN = "Cyan";
/**
 * 黒を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Black
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.BLACK = "Black";
/**
 * ユーザー定義色0を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * User-defined color 0
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.USER0 = "User0";
/**
 * ユーザー定義色1を出力色とする
 * @final
 * @type String
 * @lang ja
 */
/**
 * User-defined color 1
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.USER0 = "User1";
/**
 * ユーザー定義色2を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * User-defined color 2
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.USER0 = "User2";
/**
 * ユーザー定義色3を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * User-defined color 3
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.USER0 = "User3";
/**
 * ユーザー定義色4を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * User-defined color 4
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.USER0 = "User4";
/**
 * ユーザー定義色5を出力色とする
 * @final
 * @type String
 * @lang ja
 */
 /**
 * User-defined color
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.USER0 = "User5";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Use device default settings for output color
 * @final
 * @type String
 * @lang en
 */
JFLib.NAMEDCOLOR.DEFAULT = "Default";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.html#colorExt">colorExt</a>に用いられる抽出色の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing colors to use in Color Extraction feature, to be used in <a href="JFLib.Copy.html#colorExt">colorExt</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.EXTRACTCOLOR = function() {};
/**
 * 赤
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Red
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.RED = "Red";
/**
 * 緑
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Green
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.GREEN = "Green";
/**
 * 青
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Blue
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.BLUE = "Blue";
/**
 * シアン
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Cyan
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.CYAN = "Cyan";
/**
 * マゼンタ
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Magenta
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.MAGENTA = "Magenta";
/**
 * 黄
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Yellow
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.YELLOW = "Yellow";
/**
 * 背景色を除く黒以外のすべての色
 * @final
 * @type String
 * @lang ja
 */
 /**
 * All non-black colors, excluding background color.
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.NONBLACK = "NonBlack";
/**
 * デバイスのデフォルト設定に従う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Settings are as set as device default.
 * @final
 * @type String
 * @lang en
 */
JFLib.EXTRACTCOLOR.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.AreaErase.AreaClip.html">AreaClip</a>オブジェクトに用いられる領域削除・抽出を適用する面の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing side for which to perform area erase/extraction, to be used in <a href="JFLib.Copy.AreaErase.AreaClip.html">AreaClip</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.AERASESIDE = function() {};

/**
 * 表面のみ適用する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Front side only
 * @final
 * @type String
 * @lang en
 */
JFLib.AERASESIDE.FRONT = "Front";
/**
 * 両面原稿の、裏面のみ適用し、片面原稿の場合は領域削除・抽出は実行されない
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Back side of duplex document. No area erase/extraction is performed for simplex documents.
 * @final
 * @type String
 * @lang en
 */
JFLib.AERASESIDE.BACK = "Back";
/**
 * 両面原稿の両面に適用し、片面原稿の場合は、表面に適用する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Back side of duplex document, and front side of simplex documents.
 * @final
 * @type String
 * @lang en
 */


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Rotation.html">Rotation</a>オブジェクトに用いられる回転指定の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing rotation direction, to be used in <a href="JFLib.Copy.Rotation.html">Rotation</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.ROTATIONWAY = function() {};

/**
 * 自動回転しない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Disable auto rotation.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ROTATIONWAY.NONE = "None";
/**
 * 自動回転する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Enable auto rotation.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ROTATIONWAY.ALWAYS = "Always";
/**
 * 拡大/縮小率に自動が指定されているか、給紙トレイに自動が指定されている場合のみ自動回転する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Auto rotation is performed only when enlargement/reduction rate is set to Auto, or when input tray is set to Auto.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ROTATIONWAY.CONDITIONAL = "Conditional";
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
JFLib.ROTATIONWAY.DEFAULT = "Default";


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Rotation.html">Rotation</a>オブジェクトに用いられる回転の基準辺の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing base side for auto rotation, to be used in <a href="JFLib.Copy.Rotation.html">Rotation</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.ROTATIONSIDE = function() {};

/**
 * 縦長原稿の左辺と横長用紙の上辺が一致する向き
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Rotate so that left edge of portrait document becomes top edge of landscape document.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ROTATIONSIDE.LEFT = "Left";
/**
 * 縦長原稿の右辺と横長用紙の上辺が一致する向き
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Rotate so that right edge of portrait document becomes top edge of landscape document.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ROTATIONSIDE.RIGHT = "Right";
/**
 * 綴じ位置を基準とする
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Roatate based on binding position.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.ROTATIONSIDE.BOUND = "Bound";
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
JFLib.ROTATIONSIDE.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.html#face">face</a>に用いられる排出面の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing output face used in <a href="JFLib.Copy.html#face">face</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.FACE = function() {};

/**
 * デバイス既定の向きと逆の向きで排出する
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * Documents are output according to device default settings.
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.FACE.INVERT = "Invert";
/**
 * 表面を上向きに排出する
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * Front side up.
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.FACE.UP = "Up";
/**
 * 裏面を上向きに排出する
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * Back side up.
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.FACE.DOWN = "Down";
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
JFLib.FACE.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Nup.html">Nup</a>オブジェクトに用いられる分割数の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing "N" in Nup, to be used in <a href="JFLib.Copy.Nup.html">Nup</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.NUPNUM = function() {};

/**
 * 通常印刷
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 1-up output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPNUM.ONE = "1";
/**
 * 2up
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 2up output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPNUM.TWO = "2";
/**
 * 4up
 * @final
 * @type String
 * @constant
 * @lang ja
 */
 /**
 * 4up output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPNUM.FOUR = "4";
/**
 * 8up
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * 8up output.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPNUM.EIGHT = "8";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Nup.html">Nup</a>オブジェクトに用いられる配置順序の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants specifying image positioning order in Nup output, to be used in <a href="JFLib.Copy.Nup.html">Nup</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.NUPORDER = function() {};

/**
 * 左上、右上、左下、右下の順に配置する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top left -> top right -> bottom left -> bottom right
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPORDER.LRTD = "LRTD";
/**
 * 右上、左上、右下、左下の順に配置する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top right -> top left -> bottom right -> bottom left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPORDER.RLTD = "RLTD";
/**
 * 左上、左下、右上、右下の順に配置する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top left -> bottom left -> top right -> bottom right
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPORDER.TDLR = "TDLR";
/**
 * 右上、右下、左上、左下の順に配置する
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Top right -> bottom right -> top left -> bottom left
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.NUPORDER.TDRL = "TDRL";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.ImageRepeat.html">Repeat</a>オブジェクトに用いられる分割されたページへの配置方法の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing image placement settings, to be used in <a href="JFLib.Copy.ImageRepeat.html">Repeat</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.RPTPLACE = function() {};
/**
 * 入力画像を均等に配置する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Place input images evenly onto page
 * @final
 * @type String
 * @lang en
 */
JFLib.RPTPLACE.EVEN = "even";
/**
 * 入力画像間に余白が生じないように配置する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Place input images so that no blank space is present between them
 * @final
 * @type String
 * @lang en
 */
JFLib.RPTPLACE.SERIAL = "serial";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.DoubleCopy.html">DoubleCopy</a>オブジェクトに用いられる出力ページの分割数の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing the number of parts into which to divide output page, to be used in <a href="JFLib.Copy.DoubleCopy.html">DoubleCopy</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.DBLCOPYFACES = function() {};

/**
 * 通常印刷
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Output page is not divided (standard output)
 * @final
 * @type String
 * @lang en
 */
JFLib.DBLCOPYFACES.ONE = "1";
/**
 * 出力ページを2分割する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Output page is divided into 2 parts
 * @final
 * @type String
 * @lang en
 */
JFLib.DBLCOPYFACES.TWO = "2";
/**
 * 出力ページを4分割する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Output page is divided into 4 parts
 * @final
 * @type String
 * @lang en
 */
JFLib.DBLCOPYFACES.FOUR = "4";
/**
 * 出力ページを8分割する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Output page is divided into 8 parts
 * @final
 * @type String
 * @lang en
 */
JFLib.DBLCOPYFACES.EIGHT = "8";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Signature.html">Signature</a>オブジェクトに用いられる綴じ方向の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing binding settings, to be used in <a href="JFLib.Copy.Signature.html">Signature</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.SIGBIND = function() {};
/**
 * 左綴じ(上綴じ)
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Bind at left/top
 * @final
 * @type String
 * @lang en
 */
JFLib.SIGBIND.LEFT = "Left";
/**
 * 右綴じ
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Bind at right
 * @final
 * @type String
 * @lang en
 */
JFLib.SIGBIND.RIGHT = "Right";
/**
 * 入力画像が面付けされているものとみなして面付けを行わない
 * @final
 * @type String
 * @lang ja
 */
 /**
 * No settings; MFD assumes that images are already set accordingly
 * @final
 * @type String
 * @lang en
 */
JFLib.SIGBIND.NONE = "None";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Cover.html">Cover</a>オブジェクトに用いられる表紙への画像印刷の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing cover image settings, to be used in <a href="JFLib.Copy.Cover.html">Cover</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.COVERIMG = function() {};
/**
 * 表紙への画像印刷を行わない
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Image is not printed to Cover
 * @final
 * @type String
 * @lang en
 */

JFLib.COVERIMG.NONE = "None";
/**
 * 表紙表面への画像印刷を行う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Image is printed to Side 1 of Cover
 * @final
 * @type String
 * @lang en
 */
JFLib.COVERIMG.FRONT = "Front";
/**
 * 表紙裏面への画像印刷を行う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Image is printed to Side 2 of Cover
 * @final
 * @type String
 * @lang en
 */
JFLib.COVERIMG.BACK = "Back";
/**
 * 表紙表裏両面への画像印刷を行う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Image is printed to both sides of Cover
 * @final
 * @type String
 * @lang en
 */
JFLib.COVERIMG.BOTH = "Both";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Signature.html">booklet</a>に用いられる後処理(ブックレット排出)の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing booklet finishing options, to be used in <a href="JFLib.Copy.Signature.html">booklet</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.BOOKLET = function() {};
/**
 * 後処理しない
 * @final
 * @type String
 * @lang ja
 */
 /**
 * No finishing is performed
 * @final
 * @type String
 * @lang en
 */
JFLib.BOOKLET.NONE = 1;
/**
 * 折りのみ
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Bi-fold only
 * @final
 * @type String
 * @lang en
 */
JFLib.BOOKLET.BIFOLD = 2;
/**
 * 中綴じステープルを行う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Saddle staple
 * @final
 * @type String
 * @lang en
 */
JFLib.BOOKLET.SADDLESTAPLE = 3;
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.FullPage.html">FullPage</a>オブジェクトに用いられるデバイスの出力可能領域より大きい原稿の処理方法の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing how to handle documents whose images are larger than area that can be output, to be used in <a href="JFLib.Copy.FullPage.html">FullPage</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.FULLPAGE = function() {};
/**
 * 全面出力を行わず、出力可能領域外の画像の像欠けを許容する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Full-page output is not carried out. Parts of image that cannot be contained within output area are lost.
 * @final
 * @type String
 * @lang en
 */
JFLib.FULLPAGE.FALSE = "false";
/**
 * 出力可能領域外への強制出力を行う<br>機内汚れが発生する場合がある
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Image is output outside margin.<br>This may cause contamination within the MFD.
 * @final
 * @type String
 * @lang en
 */
JFLib.FULLPAGE.MARGINLESS = "marginLess";
/**
 * 出力可能領域に収まるように自動的に縮小する
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Image is reduced so that it fits in output area.
 * @final
 * @type String
 * @lang en
 */
JFLib.FULLPAGE.REDUCTION = "reduction";
/**
 * デバイスの設定に従い、MARGINLESSまたはREDUCTIONの処理を行う
 * @final
 * @type String
 * @lang ja
 */
 /**
 * Processing specified by “MARGINLESS” or “REDUCTION” is carried out, according to MFD settings.
 * @final
 * @type String
 * @lang en
 */
JFLib.FULLPAGE.TRUE = "true";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Stamp.html">Stamp</a>/<a href="Date.html">Date</a>オブジェクトに用いられる印字するページの指定の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing which pages to perform Stamp / Date printing, to be used in <a href="JFLib.Copy.Stamp.html">Stamp</a>/<a href="Date.html">Date</a> objects.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.ANPRINTPAGE = function() {};
/**
 * 先頭ページのみに印字し、以降のページにはスタンプ印刷を行わない。
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * Stamp printed only on first page and not on any other page. 
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPRINTPAGE.HEAD = "1";
/**
 * すべてのページにスタンプ印刷を行う
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * Stamp printed on all pages.
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPRINTPAGE.ALL = "2";
/**
 * 先頭ページ以外のすべてのページにスタンプ印刷を行う
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * Stamp printed on all pages except first page
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPRINTPAGE.ALL_EXCEPT_COVER_AND_FIRST = "3";
/**
 * 
 * @constant
 * @type Int
 */
JFLib.ANPRINTPAGE.ALL_EXCEPT_COVER = "4";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Stamp.html">Stamp</a>オブジェクトに用いられる印字するスタンプの種類の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Stamp type, to be used in <a href="JFLib.Copy.Stamp.html">Stamp</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.ANSTAMP = function() {};
/**
 * 日本語環境では「マル秘」、英語環境では "CONFIDENTIAL" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "CONFIDENTIAL"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.CONFIDENTIAL = "Confidential";
/**
 * 日本語環境では「禁複写」、英語環境では "Copy Prohibited" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * "Copy Prohibited"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.COPYPROHIBITED = "CopyProhibited";
/**
 * 日本語環境では「至急」、英語環境では "URGENT" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * "URGENT"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.URGENT = "Urgent";
/**
 * 日本語環境では「重要」、英語環境では "IMPORTANT" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * "IMPORTANT"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.IMPORTANT = "Important";
/**
 * 日本語環境では「回覧」、英語環境では "Circulate" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
/**
 * "Circulate"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.CIRCULATE = "Circulate";
/**
 * 日本語環境では「裏紙使用」、英語環境では "Ignore Side 2" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "Ignore Side 2"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USED = "IgnoreSide2";
/**
 * 日本語環境、英語環境ともに "DRAFT" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "DRAFT"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.DRAFT = "Draft";
/**
 * 日本語環境では「CONFIDENTIAL」、英語環境では "VOID" を印字するスタンプ
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "VOID"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.SYSTEM8 = "System_8";
/**
 * ユーザスタンプ1を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 1
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF1 = "User_1";
/**
 * ユーザスタンプ2を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 2
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF2 = "User_2";
/**
 * ユーザスタンプ3を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 3
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF3 = "User_3";
/**
 * ユーザスタンプ4を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 4
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF4 = "User_4";
/**
 * ユーザスタンプ5を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 5
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF5 = "User_5";
/**
 * ユーザスタンプ6を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 6
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF6 = "User_6";
/**
 * ユーザスタンプ7を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 7
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF7 = "User_7";
/**
 * ユーザスタンプ8を印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined stamp 5
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMP.USERDEF8 = "User_8";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Annotation.html">Annotation</a>オブジェクトに用いられる印字位置の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing print position, to be used in <a href="JFLib.Copy.Annotation.html">Annotation</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.ANPOS = function() {};
/**
 * ページ左上に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Top left of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.TOPLEFT = "TopLeft";
/**
 * ページの上中央に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Top center of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.TOP = "Top";
/**
 * ページの右上に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Top right of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.TOPRIGHT = "TopRight";
/**
 * ページ左中央に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Center left of page
 * @constant
 * @type String
 * @lang en
 */

JFLib.ANPOS.LEFT = "Left";
/**
 * ページ中央に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Center of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.CENTER = "Center";
/**
 * ページ右中央に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Center right of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.RIGHT = "Right";
/**
 * ページ左下に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Bottom left of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.BOTTOMLEFT = "BottomLeft";
/**
 * ページ下中央に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Bottom center of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.BOTTOM = "Bottom";

/**
 * ページ右下に印字する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Bottom right of page
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANPOS.BOTTOMRIGHT = "BottomRight";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Stamp.html">Stamp</a>オブジェクトに用いられる印字色の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Stamp print color, to be used in <a href="JFLib.Copy.Stamp.html">Stamp</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.ANSTAMPCOLOR = function() {};
/**
 * 黒色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Black
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.BLACK = "Black";
/**
 * 青色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Blue
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.BLUE = "Blue";
/**
 * 緑色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Green
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.GREEN = "Green";
/**
 * 赤色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Red
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.RED = "Red";
/**
 * 黄色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Yellow
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.YELLOW = "Yellow";
/**
 * マゼンタ色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Magenta
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.MAGENTA = "Magenta";
/**
 * シアン色
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Cyan
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANSTAMPCOLOR.CYAN = "Cyan";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.DatePrint.html">DatePrint</a>オブジェクトに用いられる日付の印字形式の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Date format, to be used in <a href="JFLib.Copy.DatePrint.html">DatePrint</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.ANDATE = function() {};
/**
 * "yyyy/mm/dd" 形式で日付印字を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "yyyy/mm/dd"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANDATE.YMD = "YMD";
/**
 * "mm/dd/yyyy" 形式で日付印字を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "mm/dd/yyyy"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANDATE.MDY = "MDY";
/**
 * "dd/mm/yyyy" 形式で日付印字を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "dd/mm/yyyy"
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANDATE.DMY = "DMY";
/**
 * "yyyy年mm月dd日" 形式で日付印字を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "yyyy年mm月dd日" (Japanese)
 * @constant
 * @type String
 * @lang en
 */
JFLib.ANDATE.JYMD = "JYMD";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.PagePrint.html">PagePrint</a>オブジェクトに用いられるページの印字形式の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Page number print format, to be used in <a href="JFLib.Copy.PagePrint.html">PagePrint</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.ANPAGE = function() {};
/**
 * デバイスに設定された既定のスタイル。
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * Style is as specified by MFD settings.
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.DEFAULT = "0";
/**
 * ページ番号のみ。
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * Page number only
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.ONLYNUMBER = "1";
/**
 * "-△<i>ページ番号</i>△-"（△は半角スペースを表す）
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * "- <i>page number</i> -"
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.HYPHEN = "2";
/**
 * "Page△<i>ページ番号</i>"（△は半角スペースを表す）
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * "Page <i>page number</i>"
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.STR = "3";
/**
 * "<i>ページ番号</i>△/△<i>総ページ数</i>" （△は半角スペースを表す）
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * "<i>page number</i> / <i>Total number of pages</i>"
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.TOTAL = "4";
/**
 * "-△[<i>ページ番号</i>]△/△[<i>総ページ数</i>]△-"（△は半角スペースを表す）
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * "- [<i>page number</i>] / [<i>Total number of pages</i>] -"
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.TOTAL_HYPHEN = "5";
/**
 * "Page△[<i>ページ番号</i>]△/△[<i>総ページ数</i>]"（△は半角スペースを表す）
 * @constant
 * @type Int
 * @lang ja
 */
 /**
 * "Page [<i>page number</i>] / [<i>Total number of pages</i>]"
 * @constant
 * @type Int
 * @lang en
 */
JFLib.ANPAGE.TOTAL_STR = "6";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Numbering/PagePrintオブジェクトに用いられる, ページ番号印刷を終了するページを指定する定数を定義したクラス 
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
JFLib.ANPAGETO = function() {};
/**
 * 最終ページを指定する
 * @constant
 * @type String
 * @lang ja
 */
JFLib.ANPAGETO.LASTPAGE = "LastPage";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Watermark.html">Watermark</a>オブジェクトに用いられるすかし印刷の印字文字列の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Watermark settings, to be used in <a href="JFLib.Copy.Watermark.html">Watermark</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.WMTEXT = function() {};
/**
 * 日本語環境では「禁複写」、英語環境では "Copy Prohibited" を印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "Copy Prohibited"
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMTEXT.COPYPROHIBITED = "CopyProhibited";
/**
 * 日本語環境では「コピー」、英語環境では "Copy" を印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "Copy"
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMTEXT.COPY = "Copy";
/**
 * 日本語環境では「複写」、英語環境では "Duplicated" を印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * "Duplicated"
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMTEXT.DUPLICATED = "Duplicated";
/**
 * ユーザー指定文字列1を印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined text 1
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMTEXT.USER1 = "User_1";
/**
 * ユーザー指定文字列2を印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined text 2
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMTEXT.USER2 = "User_2";
/**
 * ユーザー指定文字列3を印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * User-defined text 3
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMTEXT.USER3 = "User_3";
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.Copy.Watermark.html">Watermark</a>オブジェクトに用いられるすかし印刷の隠し印刷方法の定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants representing Watermark print settings, to be used in <a href="JFLib.Copy.Watermark.html">Watermark</a> object.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.WMSECPRT = function() {};
/**
 * すかし印刷内容を見えるように印刷する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Visible watermark
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMSECPRT.VISIBLE = "Visible";
/**
 * すかし印刷を行った文書をコピーすると、すかし印刷内容が濃く浮き出すように隠し印刷を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * When document printed with watermark is copied, watermark portion is printed darkly.
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMSECPRT.DARKEN = "Darken";
/**
 * すかし印刷を行った文書をコピーすると、すかし印刷内容が白抜きになるように隠し印刷を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * When document printed with watermark is copied, watermark portion is printed in white.
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMSECPRT.LIGHTEN = "Lighten";
/**
 * すかし印刷を行った文書に追跡情報を隠し印刷する。複写機での複製時にはすかし印刷内容は白抜きとなる
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Tracking information printed. When this output is copied on MFD, tracking information is printed in white.
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMSECPRT.TRACKING = "Tracking";
/**
 * すかし印刷を行った文書に追跡情報と複製抑止情報を隠し印刷する。
 * 複製抑止に対応していない複写機で複製した場合にはすかし印刷内容が白抜きになるように隠し印刷を行う
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Tracking information and copy control information is printed. <br>
 * Watermark for devices with no copy control feature is also printed (in these devices, watermark images are printed in white).
 * @constant
 * @type String
 * @lang en
 */
JFLib.WMSECPRT.COPYCONTROL = "CopyControlled";
/**
 * 
 * @constant
 * @type String
 */

JFLib.JSIncluded("JfsDefCopy");

