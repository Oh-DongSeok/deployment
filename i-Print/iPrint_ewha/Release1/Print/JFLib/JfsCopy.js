/** 
 * @fileoverview ジョブフローにおけるコピージョブを扱うクラスを定義する<br>
 * Copyクラス<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2012 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.4.0
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for handling Copy jobs in Job Flow.<br>
 * Copy class
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2012 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.4.0
 * @lang en
 */

//JfsDefCopy.jsのロード
JFLib.JSInclude("JfsDefCopy");

//JfsComScan.jsのロード
JFLib.JSInclude("JfsComScan");
//JfsComPrint.jsのロード
JFLib.JSInclude("JfsComPrint");

/**
 * Copy インスタンスを作成する
 * @constructor
 * @extends JFLib.Transaction
 * @return Copyオブジェクト <br><br>
 * @example
 * ■使用例 
 *		var copy = new JFLib.Copy();
 *		copy.inputMedium.size = JFLib.MS.A4LEF;
 *		copy.outputMedium.size = JFLib.MS.NONSTANDARD;
 *		copy.outputMedium.x = 50;
 *		copy.outputMedium.y = 50;
 *		copy.colorMode = JFLib.CM.AUTO;
 *		copy.plex = JFLib.PLEX.DUPLEX;
 *		copy.copies = 2;
 *		copy.outPlex = JFLib.PLEX.DUPLEX;
 * @class コピージョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う
 * <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a>にて入力処理を設定する <br>
 * <a href="JFLib.Transaction.html#">Transaction</a>のサブクラス <br>
 * @lang ja
 */
 /**
 * Creates Copy instance.
 * @constructor
 * @extends JFLib.Transaction
 * @return Copy object.<br><br>
 * @example
 * EXAMPLE: 
 *		var copy = new JFLib.Copy();
 *		copy.inputMedium.size = MS.A4LEF;
 *		copy.outputMedium.size = MS.NONSTANDARD;
 *		copy.outputMedium.x = 50;
 *		copy.outputMedium.y = 50;
 *		copy.colorMode = CM.AUTO;
 *		copy.plex = PLEX.DUPLEX;
 *		copy.copies = 2;
 *		copy.outPlex = PLEX.DUPLEX;
 * @class This class sets Copy job settings.<br> 
 * This class uses <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a> to set input processes. <br>
 * Subclass of <a href="JFLib.Transaction.html#">Transaction</a>.<br>
 * @lang en
 */
JFLib.Copy = function()
{
	/**
	 *	入力サイズを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type JFLib.ComScan.InputMediumSize
	 *	@default サイズ自動
	 *  @lang ja
	 */	
	/**
	 *	Input size.<br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type JFLib.ComScan.InputMediumSize
	 *	@default Auto
	 *  @lang en
	 */	
	this.inputMedium = new JFLib.ComScan.InputMediumSize();
	/**
	 *	天の向きを指定する<br> 設定 - 任意
	 *	@type JFLib.HP
	 *	@default デバイスのデフォルトの向き
	 *  @lang ja
	 */	
	/**
	 *	Head position.<br> IMPLIED.
	 *	@type JFLib.HP
	 *	@default Default head position set to device.
	 *  @lang en
	 */	
	this.headposition = JFLib.HP.DEFAULT;
	/**
	 *	片面/両面スキャンを指定する<br> 設定 - 任意
	 *	@type JFLib.PLEX
	 *	@default 片面
	 *  @lang ja
	 */	
	/**
	 *	Simplex/Duplex scan settings.<br> IMPLIED.
	 *	@type JFLib.PLEX
	 *	@default Simplex.
	 *  @lang en
	 */	
	this.plex = JFLib.PLEX.SIMPLEX;
	/**
	 *	スキャン原稿の読み取り元を指定する<br> 設定 - 任意
	 *	@type JFLib.INDEVICE
	 *	@default 原稿がセットされている入力装置
	 *  @lang ja
	 */	
	/**
	 *	Scan input device (platen/DADF).<br> IMPLIED.
	 *	@type JFLib.INDEVICE
	 *	@default Scan input device to which document is set.
	 *  @lang en
	 */	
	this.scanFrom = JFLib.INDEVICE.BOTH;
	/**
	 *	分割スキャンを指定する<br> 設定 - 任意
	 *	@type JFLib.ComScan.SplitScan
	 *	@default 分割スキャンしない
	 *	@lang ja
	 */	
	 	/**
	 *	Whether or not to perform split scan.<br> IMPLIED.
	 *	@type JFLib.ComScan.SplitScan
	 *	@default Do not perform split scan
	 *	@lang en
	 */	
	this.splitScan = new JFLib.ComScan.SplitScan();
	/**
	 *	ブック両面を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.AsBook
	 *	@default ブック両面しない
	 *	@lang ja
	 */	
	/**
	 *	Specifies page split.<br> IMPLIED.
	 *	@type JFLib.Copy.AsBook
	 *	@default Do not perform page split.
	 *	@lang en
	 */	
	this.asBook = new JFLib.Copy.AsBook();
	/**
	 *	イメージモードを指定する<br> 設定 - 任意
	 *	@type JFLib.IM
	 *	@default デバイスのデフォルト設定に従う(V2.0.15以降)
	 *  @lang ja
	 */	
	/**
	 *	Image mode.<br> IMPLIED.
	 *	@type JFLib.IM
	 *	@default Operation is according to device default settings. (from V2.0.15)
	 *  @lang en
	 */	
	this.imageMode = JFLib.IM.DEFAULT;
	/**
	 *	カラーモードを指定する<br> 設定 - 任意
	 *	@type JFLib.CM
	 *	@default 自動
	 *  @lang ja
	 */	
	/**
	 *	Color Mode.<br> IMPLIED.
	 *	@type JFLib.CM
	 *	@default Auto.
	 *  @lang en
	 */	
	this.colorMode = JFLib.CM.AUTO;
	/**
	 *	出力サイズを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type JFLib.ComScan.OutputMediumSize
	 *	@default 指定なし
	 *  @lang ja
	 */	
	/**
	 *	Output size.<br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type JFLib.ComScan.OutputMediumSize
	 *	@default Not specified.
	 *  @lang en
	 */	
	this.outputMedium = new JFLib.ComScan.OutputMediumSize();
	/**
	 *	拡大･縮小倍率を指定する<br> 設定 - 任意
	 *	@type JFLib.ComScan.Magnification
	 *	@default 等倍
	 *  @lang ja
	 */	
	/**
	 *	Enlargement/reduction rate.<br> IMPLIED.
	 *	@type JFLib.ComScan.Magnification
	 *	@default 1:1.
	 *  @lang en
	 */	
	this.magnification = new JFLib.ComScan.Magnification();
	/**
	 *	次原稿を指定する<br> 設定 - 任意
	 *	@type Bool
	 *	@default しない
	 *  @lang ja
	 */	
	 /**
	 *	Next original.<br> IMPLIED.
	 *	@type Bool
	 *	@default Last original.
	 *  @lang en
	 */
	this.nextoriginal = false;

	/**
	 *	nextoriginalの指定が有効となる、文書入力機構の条件を指定する<br> 設定 - 任意
	 *	@type JFLib.INDEVICE
	 *	@default 条件なし
	 *  @lang ja
	 */	
	/**
	 *	Specifies document input device condition in which nextoriginal designation is enabled.<br> IMPLIED.
	 *	@type JFLib.INDEVICE
	 *	@default None.
	 *  @lang en
	 */
	this.whenScannedFrom = "";

	/**
	 *	地色除去を指定する<br>もしくは、デバイスの規定値をJFLib.DEFAULTで設定する<br> 設定 - 任意
	 *	@type Bool/JFLib.DEFAULT
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Background elimination. <br>Device default settings may be specified by setting JFLib.DEFAULT.<br> IMPLIED.
	 *	@type Bool/JFLib.DEFAULT
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.bgelimination = JFLib.DEFAULT;
	/**
	 *	解像度を指定する<br> 設定 - 任意
	 *	@type JFLib.RES
	 *	@default 600dpi
	 *  @lang ja
	 */	
	/**
	 *	Resolution.<br> IMPLIED.
	 *	@type JFLib.RES
	 *	@default 600dpi
	 *  @lang en
	 */	
	this.resolution = JFLib.RES.R600;
	/**
	 *	コントラスト調整を指定する<br> 設定 - 任意
	 *	@type JFLib.CONT
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Contrast.<br> IMPLIED.
	 *	@type JFLib.CONT
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.contrast = JFLib.CONT.DEFAULT;
	/**
	 *	濃度調整を指定する<br> 設定 - 任意
	 *	@type JFLib.DARK
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Darkness.<br> IMPLIED.
	 *	@type JFLib.DARK
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.darkness = JFLib.DARK.DEFAULT;
	/**
	 *	明度調整を指定する<br> 設定 - 任意
	 *	@type JFLib.BRIGHT
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Brightness.<br> IMPLIED.
	 *	@type JFLib.BRIGHT
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.brightness = JFLib.BRIGHT.DEFAULT;
	/**
	 *	シャープネス調整を指定する<br> 設定 - 任意
	 *	@type JFLib.SHARP
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Sharpness.<br> IMPLIED.
	 *	@type JFLib.SHARP
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.sharpness = JFLib.SHARP.DEFAULT;
	/**
	 *	彩度調整を指定する<br> 設定 - 任意
	 *	@type JFLib.SAT
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Saturation.<br> IMPLIED.
	 *	@type JFLib.SAT
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.saturation = JFLib.SAT.DEFAULT;
	/**
	 *	枠消しを指定する<br> 設定 - 任意
	 *	@type JFLib.ComScan.EdgeErase
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Edge erase.<br> IMPLIED.
	 *	@type JFLib.ComScan.EdgeErase
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.edgeErase = new JFLib.ComScan.EdgeErase();
	/**
	 *	中消しを指定する<br> 設定 - 任意
	 *	@type JFLib.ComScan.CenterErase
	 *	@default デバイスのデフォルト設定に従う(V2.1.0以降)
	 *  @lang ja
	 */	
	/**
	 *	Center erase.<br> IMPLIED.
	 *	@type JFLib.ComScan.CenterErase
	 *	@default Operation is according to device default settings. (from V2.1.0)
	 *  @lang en
	 */	
	this.centerErase = new JFLib.ComScan.CenterErase();
	/**
	 *	ネガポジ反転を指定する<br> 設定 - 任意
	 *	@type Bool
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	Reversal.<br> IMPLIED.
	 *	@type Bool
	 *	@default No reversal.
	 *  @lang en
	 */	
	this.reversal = false;
	/**
	 *	領域の抽出/削除を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.AreaErase
	 *	@default しない
	 *	@lang ja
	 */	
	/**
	 *	Whether to perform area erase / extraction.<br> IMPLIED.
	 *	@type JFLib.Copy.AreaErase
	 *	@default Do not perform area erase / extraction.
	 *	@lang en
	 */	
	this.areaErase = new JFLib.Copy.AreaErase();
	/**
	 *	コピー部数を指定する<br> 設定 - 任意
	 *	@type Int
	 *	@default 1
	 *  @lang ja
	 */	
	/**
	 *	Number of copy sets.<br> IMPLIED.
	 *	@type Int
	 *	@default 1
	 *  @lang en
	 */	
	this.copies = 1;
	/**
	 *	仕分けを指定する<br> 設定 - 任意
	 *	@type Bool
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	Collate/uncollate.<br> IMPLIED.
	 *	@type Bool
	 *	@default Uncollate.
	 *  @lang en
	 */	
	this.collate = false;
	/**
	 *	片面･両面プリントを指定する<br> 設定 - 任意
	 *	@type JFLib.PLEX
	 *	@default 片面
	 *  @lang ja
	 */	
	/**
	 *	Simplex/Duplex printing.<br> IMPLIED.
	 *	@type JFLib.PLEX
	 *	@default Simplex.
	 *  @lang en
	 */	
	this.outPlex = JFLib.PLEX.SIMPLEX;
	/**
	 *	入力トレイを指定する<br> 設定 - 任意
	 *	@type JFLib.INTRAY
	 *	@default トレイ自動
	 *  @lang ja
	 */	
	/**
	 *	Input tray.<br> IMPLIED.
	 *	@type JFLib.INTRAY
	 *	@default Auto
	 *  @lang en
	 */	
	this.inputTray = JFLib.INTRAY.AUTO;
	/**
	 *	出力トレイを指定する<br> 設定 - 任意
	 *	@type JFLib.OUTTRAY
	 *	@default フェースダウントレイ
	 *  @lang ja
	 */	
	/**
	 *  Output tray. <br> IMPLIED.
	 *	@type JFLib.OUTTRAY
	 *	@default Face down tray.
	 *  @lang en
	 */	
	this.outputTray = JFLib.OUTTRAY.FACEDOWN0;
	/**
	 *	ステープルを指定する<br> 設定 - 任意
	 *	@type JFLib.ComPrint.Staple
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	Staple. <br> IMPLIED.
	 *	@type JFLib.ComPrint.Staple
	 *	@default No Staple.
	 *  @lang en
	 */	
	this.staple = new JFLib.ComPrint.Staple();
	/**
	 *	パンチを指定する<br> 設定 - 任意
	 *	@type JFLib.ComPrint.Punch
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	Punch. <br>IMPLIED.
	 *	@type JFLib.ComPrint.Punch
	 *	@default No Punch.
	 *  @lang en
	 */	
	this.punch = new JFLib.ComPrint.Punch();
	/**
	 *	折り/中綴じなどの後処理を指定する<br> 設定 - 任意
	 *	@type JFLib.BOOKLET
	 *	@default しない
	 *	@lang ja
	 */
	/**
	 *	Whether to perform booklet finishing, e.g. folding, saddle staple, etc.<br> IMPLIED.
	 *	@type JFLib.BOOKLET
	 *	@default Do not perform booklet finishing
	 *	@lang en
	 */
	this.booklet = "";
	/**
	 *	自動回転を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.Rotation
	 *	@default デバイスのデフォルト設定に従う
	 *  @lang ja
	 */	
	/**
	 *	Auto rotation.<br> IMPLIED.
	 *	@type JFLib.Copy.Rotation
	 *	@default Operation is according to device default settings. 
	 *  @lang en
	 */	
	this.rotation = new JFLib.Copy.Rotation();
	/**
	 *	排出面を指定する<br> 設定 - 任意
	 *	@type JFLib.FACE
	 *	@default デバイスのデフォルト設定に従う
	 *  @lang ja
	 */	
	/**
	 *	Output face.<br> IMPLIED.
	 *	@type JFLib.FACE
	 *	@default Operation is according to device default settings. 
	 *  @lang en
	 */	
	this.face = JFLib.FACE.DEFAULT;
	/**
	 *	全面出力(ちょっと小さめ)を指定する<br> 設定 - 任意
	 *	@type JFLib.FULLPAGE
	 *	@default しない
	 *	@lang ja
	 */	
	 /**
	 *	Whether to reduce image so that it fits in output area.<br> IMPLIED.
	 *	@type JFLib.FULLPAGE
	 *	@default Do not reduce image so that it fits in output area.
	 *	@lang en
	 */	
	this.fullPage = "";
	/**
	 *	<a href="JFLib.Copy.Nup.html">Nup</a>を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.Nup
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	<a href="JFLib.Copy.Nup.html">Nup</a>.<br> IMPLIED.
	 *	@type JFLib.Copy.Nup
	 *	@default 1-up.
	 *  @lang en
	 */	
 	this.nup = new JFLib.Copy.Nup();
	/**
	 *	繰り返し出力機能を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.ImageRepeat
	 *	@default しない
	 *	@lang ja
	 */	
	/**
	 *	Whether to perform Image Repeat feature.<br> IMPLIED.
	 *	@type JFLib.Copy.ImageRepeat
	 *	@default Do not perform Image Repeat feature (false)
	 *	@lang en
	 */	
	this.repeat = new JFLib.Copy.ImageRepeat();
	/**
	 *	ダブルコピー機能を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.DoubleCopy
	 *	@default しない
	 *	@lang ja
	 */	
	 /**
	 *	Whether to perform Double Copy feature.<br> IMPLIED.
	 *	@type JFLib.Copy.DoubleCopy
	 *	@default Do not perform Double Copy feature.
	 *	@lang en
	 */	
	this.doubleCopy = new JFLib.Copy.DoubleCopy();
	/**
	 *	小冊子印刷を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.Signature
	 *	@default しない
	 *	@lang ja
	 */	
	/**
	 *	Whether to perform Signature output.<br> IMPLIED.
	 *	@type JFLib.Copy.Signature
	 *	@default Do not perform Signature output.
	 *	@lang en
	 */	
	this.signature = new JFLib.Copy.Signature();
	/**
	 *	表紙付けを指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.CoverPage
	 *	@default しない
	 *	@lang ja
	 */	
	 /**
	 *	Whether to print Cover Page.<br> IMPLIED.
	 *	@type JFLib.Copy.CoverPage
	 *	@default Do not print Cover Page.
	 *	@lang en
	 */	
	this.coverPage = new JFLib.Copy.CoverPage();
	/**
	 *	アノテーション印刷を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.Annotation
	 *	@default しない
	 *	@lang ja
	 */	
	 /**
	 *	Whether to print annotation.<br> IMPLIED.
	 *	@type JFLib.Copy.Annotation
	 *	@default Do not print annotation.
	 *	@lang en
	 */	
	this.annotation = new JFLib.Copy.Annotation();
	/**
	 *	すかし印刷を指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.Watermark
	 *	@default しない
	 *	@lang ja
	 */	
	 /**
	 *	Whether to overprint Watermark.<br> IMPLIED.
	 *	@type JFLib.Copy.Watermark
	 *	@default Do not overprint Watermark.
	 *	@lang en
	 */	
	this.watermark = new JFLib.Copy.Watermark();
	
	/**
	 *  2色/単色カラーを指定する<br> 設定 - 任意
	 *	@type JFLib.Copy.OutputColor
	 *	@default しない
	 *	@lang ja
	 */	
	/**
	 *  Whether to specify two-color / single-color output.<br> IMPLIED.
	 *	@type JFLib.Copy.OutputColor
	 *	@default Do not specify two-color / single-color output.
	 *	@lang en
	 */	
	this.outputColor = new JFLib.Copy.OutputColor();
};

/**
 * 原稿サイズを設定する
 * @param {JFLib.MS} s 定型サイズを指定する
 * @param {int} x 非定型の場合の主走査方向の長さを指定する
 * @param {int} y 非定型の場合の副走査方向の長さを指定する
 * @return {JFLib.ComScan.InputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang ja
 */
/**
 * Sets original document size. 
 * @param {JFLib.MS} s Standard medium size. 
 * @param {int} x Length in fast scan direction upon specifying non-standard size.
 * @param {int} y Length in slow scan direction upon specifying non-standard size.
 * @return {JFLib.ComScan.InputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang en
 */
JFLib.Copy.prototype.setInputMedium = function (s, x, y)
{
	return this.inputMedium.set(s, x, y);
};
/**
 * 出力サイズを設定する
 * @param {JFLib.MS} s 定型サイズを指定する
 * @param {int} x 非定型の場合の主操作方向の出力サイズ
 * @param {int} y 非定型の場合の副操作方向の出力サイズ
 * @return {JFLib.ComScan.OutputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang ja
 */
/**
 * Output medium size.
 * @param {JFLib.MS} s Standard medium size. 
 * @param {int} x Length in fast scan direction upon specifying non-standard size.
 * @param {int} y Length in slow scan direction upon specifying non-standard size.
 * @return {JFLib.ComScan.OutputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang en
 */
JFLib.Copy.prototype.setOutputMedium = function (s, x, y)
{
	return this.outputMedium.set(s, x, y);
};
/**
 * 拡大・縮小率を設定する
 * @param {int/JFLib.MAG} x 主走査方向の拡縮率
 * @param {int/JFLib.MAG} y 副走査方向の拡縮率
 * @return {JFLib.ComScan.Magnification} [<a href="MAG.html#">x</a>,<a href="JFLib.MAG.html#">y</a>]
 * @lang ja
 */
/**
 * Enlargement/reduction rate.
 * @param {int/JFLib.MAG} x Enlargement/reduction rate in fast scan direction.
 * @param {int/JFLib.MAG} y Enlargement/reduction rate in slow scan direction.
 * @return {JFLib.ComScan.Magnification} [<a href="MAG.html#">x</a>,<a href="JFLib.MAG.html#">y</a>]
 * @lang en
 */
JFLib.Copy.prototype.setMagnification = function (x, y)
{
	return this.magnification.set(x, y);
};

/**
 * 枠消しを設定する
 * @param {int} top 上方向の消し量を指定する
 * @param {int} bottom 下方向の消し量を指定する
 * @param {int} left 左方向の消し量を指定する
 * @param {int} right 右方向の消し量を指定する
 * @param {JFLib.UNIT} [unit] 単位を指定する
 * @return {JFLib.ComScan.EdgeErase} [top,bottom,left,right,unit]
 * @lang ja
 */
/**
 * Edge erase.
 * @param {int} top Edge Erase at top.
 * @param {int} bottom Edge Erase at bottom.
 * @param {int} left Edge Erase at left.
 * @param {int} right Edge Erase at right.
 * @param {JFLib.UNIT} [unit] Unit.
 * @return {JFLib.ComScan.EdgeErase} [top,bottom,left,right,unit]
 * @lang en
 */
JFLib.Copy.prototype.setEdgeErase = function (top, bottom, left, right, unit)
{
	return this.edgeErase.set(top, bottom, left, right, unit);
};

/**
 * 中消しを設定する
 * @param {int} center 中消し量を指定する
 * @param {JFLib.UNIT} [unit] 単位を指定する
 * @return {JFLib.ComScan.CenterErase} centerErase
 * @lang ja
 */
/**
 * Sets Center Erase settings.
 * @param {int} center Center Erase area.
 * @param {JFLib.UNIT} [unit] Unit.
 * @return {JFLib.ComScan.CenterErase} centerErase
 * @lang en
 */
JFLib.Copy.prototype.setCenterErase = function (center, unit)
{
	return this.centerErase.set(center, unit);
};

/**
 * ステープルを設定する
 * @param {Bool} enable ステープルする/しない
 * @param {JFLib.STAPLEPOS} [pos] ステープル位置
 * @param {String} [num] ステープル数
 * @return {JFLib.ComPrint.Staple} staple
 * @private
 * @lang ja
 */
/**
 * Sets Staple settings.
 * @param {Bool} enable Whether to Staple or not.
 * @param {JFLib.STAPLEPOS} [pos] Staple position.
 * @param {String} [num] Number of Staples.
 * @return {JFLib.ComPrint.Staple} staple
 * @private
 * @lang en
 */
JFLib.Copy.prototype.setStaple = function (enable, pos, num)
{
	this.staple.enable = enable;
	if(pos) { this.staple.position = pos; }
	if(num) { this.staple.num = num; }
	return this.staple;
};

/**
 * パンチを設定する
 * @param {Bool} enable パンチする/しない
 * @param {JFLib.PUNCHPOS} [pos] パンチ位置
 * @param {String} [num] パンチ穴数
 * @return {JFLib.ComPrint.Punch} punch
 * @private
 * @lang ja
 */
/**
 * Sets Punch settings.
 * @param {Bool} enable Whether to Punch or not.
 * @param {JFLib.PUNCHPOS} [pos] Punch position.
 * @param {String} [num] Number of holes.
 * @return {JFLib.ComPrint.Punch} punch
 * @private
 * @lang en
 */
JFLib.Copy.prototype.setPunch = function (enable, pos, num)
{
	this.punch.enable = enable;
	if(pos) { this.punch.position = pos; }
	if(num) { this.punch.num = num; }
	return this.punch;
};
/**
 * 自動回転を設定する
 * @param {JFLib.ROTATIONSIDE} way 回転の方向
 * @param {JFLib.ROTATIONWAY} side 回転の基準となる辺
 * @return {JFLib.Copy.Rotation} rotation
 * @lang ja
 */
/**
 * Sets Auto Rotation settings.
 * @param {JFLib.ROTATIONSIDE} way Rotation direction.
 * @param {JFLib.ROTATIONWAY} side Base side for rotation.
 * @return {JFLib.Copy.Rotation} rotation
 * @lang en
 */
JFLib.Copy.prototype.setRotation = function (way,side)
{
	return this.rotation.set(way,side);
};
/**
 * Nupを設定する
 * @param {Bool} enable Nupする/しない
 * @param {JFLib.NUPNUM} [num] Nupの分割数
 * @param {JFLib.NUPORDER} [order] Nupの配置順序
 * @return {JFLib.Copy.Nup} nup
 * @lang ja
 */
/**
 * Sets Nup settings.
 * @param {Bool} Whether to enable Nup.
 * @param {JFLib.NUPNUM} [num] "N" in Nup.
 * @param {JFLib.NUPORDER} [order] Nup image placement order.
 * @return {JFLib.Copy.Nup} nup
 * @lang en
 */
JFLib.Copy.prototype.setNup = function (enable, num, order)
{
	this.nup.enable = enable;
	if(num) { this.nup.num = num; }
	if(order) { this.nup.order = order; }
	return this.nup;
};

/**
 * @private
 */
JFLib.Copy.prototype.toXmlNode = function (xml) 
{
	var scan = xml.createElementNS(XMLLib.NS.JT, 'Scanner');

	var node = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'InputMediumSize'));
	node.appendChild(this.inputMedium.toXmlNode(xml));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'HeadPosition', this.headposition));

	var plex = scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Duplex', this.plex));
	xml.setAttributeNS(plex, XMLLib.NS.JT, 'scanFrom', this.scanFrom);

	if(!this.asBook.enable && this.splitScan.enable){
		scan.appendChild(this.splitScan.toXmlNode(xml));
	}

	if(this.asBook.enable){
		scan.appendChild(this.asBook.toXmlNode(xml));
	}

	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ImageMode', this.imageMode));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ColorMode', this.colorMode));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'EnableBackgroundElimination', this.bgelimination));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Darkness', this.darkness));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Contrast', this.contrast));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Brightness', this.brightness));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Sharpness', this.sharpness));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Saturation', this.saturation));
	scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'ImageCount'));
	scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resolution', this.resolution));
	var nextoriginal = scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'EnableNextOriginal', this.nextoriginal));
	if (this.whenScannedFrom) {
		xml.setAttributeNS(nextoriginal, XMLLib.NS.JT, 'whenScannedFrom', this.whenScannedFrom);
	}
	
	if(this.reversal) {
		var reversal = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Reversal'));
		reversal.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Type', 'Inverted'));
	}
	node = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'OutputMediumSize'));
	node.appendChild(this.outputMedium.toXmlNode(xml));
	scan.appendChild(this.magnification.toXmlNode(xml));
	scan.appendChild(this.edgeErase.toXmlNode(xml));
	scan.appendChild(this.centerErase.toXmlNode(xml));
	if(this.areaErase.enable) { scan.appendChild(this.areaErase.toXmlNode(xml)); }
	if(this.outputColor.enable && this.colorMode == JFLib.CM.BICOLOR) { 
		scan.appendChild(this.outputColor.toXmlNode(xml));
		if(this.colorExt) {
			var colorExt = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'ColorExtract'));
			if(this.colorExt instanceof Array) {
				var colorExtLen = this.colorExt.length;
				for(var i=0; i< colorExtLen; i++) {
					colorExt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'NamedColor', this.colorExt[i]));
				}
			} else {
				switch(this.colorExt) {
					case JFLib.EXTRACTCOLOR.NONBLACK:
					case JFLib.EXTRACTCOLOR.DEFAULT:
						colorExt.appendChild(xml.createElementNS(XMLLib.NS.JT, this.colorExt));
						break;

					default:
						colorExt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'NamedColor', this.colorExt));
						break;
				}
			}
		}
	}
	
	return scan;
};
/**
 * @private
 */
JFLib.Copy.prototype.toXmlNode2 = function (xml) 
{
	var lp = xml.createElementNS(XMLLib.NS.JT, 'LocalPrint');
	lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Copies', this.copies));
	lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'EnableCollation', this.collate));
	lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Plex', this.outPlex));
	lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'InputTray', this.inputTray));

	var outTray = xml.createElementNSwithText(XMLLib.NS.JT, 'OutputTray', this.outputTray);
	xml.setAttributeNS(outTray, XMLLib.NS.JT, 'face', this.face);
	lp.appendChild(outTray);
	/*
	T.B.D コンフリクトで設定するか、固定とするか。機能判別のため要設定
	if(this.repeat.enable) {
		this.rotation.way = JFLib.ROTATIONWAY.NONE; //自動回転しない固定
	}
	if(this.doubleCopy.enable) {
		this.rotation.way = JFLib.ROTATIONWAY.ALWAYS;//自動回転する固定
	}
	*/
	lp.appendChild(this.rotation.toXmlNode(xml));

	var finishing = lp.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Finishing'));
	if(this.staple.enable) {
		finishing.appendChild(this.staple.toXmlNode(xml));
	}
	if(this.punch.enable) {
		finishing.appendChild(this.punch.toXmlNode(xml));
	}
	if(this.booklet && this.booklet != JFLib.BOOKLET.NONE) {
		var booklet = finishing.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Booklet'));
		var staple = (this.booklet == JFLib.BOOKLET.SADDLESTAPLE) ? true : false;
		xml.setAttributeNS(booklet, XMLLib.NS.JT, "staple", staple);
	}
	var pageSet = lp.appendChild(xml.createElementNS(XMLLib.NS.JT, 'PageSet'));
	if(this.fullPage) {
		xml.setAttributeNS(pageSet, XMLLib.NS.JT, "fullPage", this.fullPage);
	}
	if(this.nup.enable) {
		pageSet.appendChild(this.nup.toXmlNode(xml));
	}
	if(this.repeat.enable) {
		pageSet.appendChild(this.repeat.toXmlNode(xml));
	}
	if(this.doubleCopy.enable) {
		pageSet.appendChild(this.doubleCopy.toXmlNode(xml));
	}

	if(this.signature.enable) {
		this.coverPage.back.enable = false;//裏表紙指定不可
		pageSet.appendChild(this.signature.toXmlNode(xml));
	}

	if(this.coverPage.front.enable || this.coverPage.back.enable) {
		lp.appendChild(this.coverPage.toXmlNode(xml));
	}

	var ovPrt = lp.appendChild(xml.createElementNS(XMLLib.NS.JT, "OverPrint"));
	if(this.annotation.stamp.enable || this.annotation.date.enable || this.annotation.page.enable || this.annotation.numbering.enable) {
		ovPrt.appendChild(this.annotation.toXmlNode(xml));
	}
	if(this.watermark.enable) {
		ovPrt.appendChild(this.watermark.toXmlNode(xml));
	}

	return lp;
};
/**
 * Rotation インスタンスを作成する
 * @constructor
 * @class 自動回転を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Rotation instance.
 * @constructor
 * @class This class specifies auto-rotation.<br>
 * @lang en
 */
JFLib.Copy.Rotation = function() 
{
	/**
	 *	回転の方法をあらわす定数を設定する
	 *	@type JFLib.ROTATIONWAY
	 *  @lang ja
	 *	@default デバイスのデフォルト設定に従う
	 */
	/**
	 *	Rotation direction.
	 *	@type JFLib.ROTATIONWAY
	 *	@default Operation is according to device default settings. 
	 *  @lang en
	 */
	this.way = JFLib.ROTATIONWAY.DEFAULT;
	/**
	 *	回転の基準となる辺をあらわす定数を設定する
	 *	@type JFLib.ROTATIONSIDE
	 *	@default デバイスのデフォルト設定に従う
	 *  @lang ja
	 */
	/**
	 *	Rotation base side.
	 *	@type JFLib.ROTATIONSIDE
	 *	@default Operation is according to device default settings. 
	 *  @lang en
	 */
	this.side = JFLib.ROTATIONSIDE.DEFAULT;
	
};
/**
 * @private
 * Rotationオブジェクトをxml node化する
 */
JFLib.Copy.Rotation.prototype.toXmlNode = function (xml)
{
	var rot = xml.createElementNSwithText(XMLLib.NS.JT, 'AutoRotation',this.way);
	xml.setAttributeNS(rot, XMLLib.NS.JT, 'baseSide', this.side);

	return rot;
};
/**
 * OutputColor インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 2色/単色カラーを指定した際に、置き換える色を指定するクラス<br>
 * @lang ja
 */
 /**
 * Creates OutputColor instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify output colors in single-color and two-color copy.<br>
 * @lang en
 */

JFLib.Copy.OutputColor = function()
{
	/**
	 *	置き換え色の指定する/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *	@lang ja
	 */
	/**
	 *	Whether or not to specify output color.<br>
	 *	@type Bool
	 *	@default Do not specify output color (false).
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	第1出力色
	 *	@type JFLib.NAMEDCOLOR
	 *	@default なし
	 *	@lang ja
	 */
	 /**
	 *	Primary color
	 *	@type JFLib.NAMEDCOLOR
	 *	@default None
	 *	@lang en
	 */
	this.primary = "";
	/**
	 *	第2出力色
	 *	@type JFLib.NAMEDCOLOR
	 *	@default なし
	 *	@lang ja
	 */
	/**
	 *	Secondary color
	 *	@type JFLib.NAMEDCOLOR
	 *	@default None
	 *	@lang en
	 */
	this.secondary = "";
};
/**
 * @private
 * OutputColorオブジェクトをxml node化する
 */
JFLib.Copy.OutputColor.prototype.toXmlNode = function (xml)
{
	var outColor = xml.createElementNS(XMLLib.NS.JT, 'OutputColor');
	if(this.primary) {
		var primaryColor = outColor.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Primary'));
		if(this.primary == JFLib.NAMEDCOLOR.DEFAULT) {
			primaryColor.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Instruction', JFLib.NAMEDCOLOR.DEFAULT));

		} else {
			primaryColor.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'NamedColor', this.primary));
		}
	}
	if(this.secondary) {
		var secondaryColor = outColor.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Secondary'));
		if(this.secondary == JFLib.NAMEDCOLOR.DEFAULT) {
			secondaryColor.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Instruction', JFLib.NAMEDCOLOR.DEFAULT));
		} else {
			secondaryColor.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'NamedColor', this.secondary));
		}
	}
	return outColor;
};

/**
 * AreaErase インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 領域の抽出/削除を指定するクラス<br>
 * @lang ja
 */
 /**
 * Creates AreaErase instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify area erase/extraction.<br>
 * @lang en
 */
JFLib.Copy.AreaErase = function()
{
	/**
	 *	領域の抽出/削除のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *	@lang ja
	 */
	 /**
	 *	Whether or not to perform area erase/extraction.<br>
	 *	@type Bool
	 *	@default Do not perform area erase/extraction (false).
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	領域の抽出/削除の座標点を設定する<br>最大1個指定可能で、指定は表・裏両面に適用される
	 *	@type Copy.AreaErase.AreaClip
	 *	@default なし
	 *	@lang ja
	 */
	 /**
	 *	Coordinates specifying area to erase/extract. <br>
	 *	Maximum of 1 object can be specified, settings represented by which are applied to both front and back side of page.
	 *	@type Copy.AreaErase.AreaClip
	 *	@default None
	 *	@lang en
	 */
	//this.clip = new Array(new JFLib.Copy.AreaErase.AreaClip());
	this.clip = new JFLib.Copy.AreaErase.AreaClip();
	/**
	 *	領域指定で指定された領域の画像を消去する場合はtrue、領域外画像を消去する場合(領域の画像を抽出)はfalseを設定する
	 *	@type Bool
	 *	@default 領域の画像を消去する
	 *	@lang ja
	 */
	/**
	 *	Whether to erase area specified (true; area erase) or area excluding that specified (false; area extraction).
	 *	@type Bool
	 *	@default Erase area specified (true).
	 *	@lang en
	 */
	this.erase = true;
	
};
/**
 * @private
 * AreaEraseオブジェクトをxml node化する
 */
JFLib.Copy.AreaErase.prototype.toXmlNode = function (xml)
{
	var areaErase = xml.createElementNS(XMLLib.NS.JT, 'AreaErase');
	xml.setAttributeNS(areaErase, XMLLib.NS.JT, 'erase', this.erase);
/*
	if(this.clip.length) {
		var areaClipLen = this.clip.length;
		for(var i=0; i < areaClipLen; i++) {
			areaErase.appendChild(this.clip[i].toXmlNode(xml));
		}
	}
*/
	areaErase.appendChild(this.clip.toXmlNode(xml));
	return areaErase;
};
/**
 * AreaClip インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 領域の抽出/削除の座標点を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates AreaClip instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify endpoint coordinates for area to erase/extract.<br>
 * @lang en
 */
JFLib.Copy.AreaErase.AreaClip = function() 
{
	/**
	 *	x1と合わせて抽出・削除する領域の、主操作方向の範囲の対角座標点を0以上の整数値で設定する<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Endpoint coordinate which, together with x1, specifies range in fast scan direction to erase/extract. Specified as non-negative integer.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type Int
	 *	@default 0
	 *	@lang en
	 */
	this.x0 = 0;
	/**
	 *	y1と合わせて抽出・削除する領域の、副操作方向の範囲の対角座標点を0以上の整数値で設定する<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Endpoint coordinate which, together with y1, specifies range in slow scan direction to erase/extract. Specified as non-negative integer.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type Int
	 *	@default 0
	 *	@lang en
	 */
	this.y0 = 0;
	/**
	 *	x0と合わせて抽出・削除する領域の、主操作方向の範囲の対角座標点を0以上の整数値で設定する<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Endpoint coordinate which, together with x0, specifies range in fast scan direction to erase/extract. Specified as non-negative integer.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type Int
	 *	@default 0
	 *	@lang en
	 */
	this.x1 = 0;
	/**
	 *	y0と合わせて抽出・削除する領域の、副操作方向の範囲の対角座標点を0以上の整数値で設定する<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Endpoint coordinate which, together with y0, specifies range in slow scan direction to erase/extract. Specified as non-negative integer.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type Int
	 *	@default 0
	 *	@lang en
	 */
	this.y1 = 0;
	/**
	 *	領域削除・抽出を適用する面を設定する
	 *	@type JFLib.AERASESIDE
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Side to which to apply area erase/extraction settings.
	 *	@type JFLib.AERASESIDE
	 *	@default 0
	 *	@lang en
	 */
	this.side = "";
	/**
	 *	座標点の各要素の値の単位を設定する
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 */
	this.unit =	JFLib.UNIT.MM;
	
};
/**
 * @private
 * AreaClipオブジェクトをxml node化する
 */
JFLib.Copy.AreaErase.AreaClip.prototype.toXmlNode = function (xml)
{
	var areaClip = xml.createElementNS(XMLLib.NS.JT, 'AreaClip');
	areaClip.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'X0', this.x0));
	areaClip.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'X1', this.x1));
	areaClip.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Y0', this.y0));
	areaClip.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Y1', this.y1));
	if(this.side) { xml.setAttributeNS(areaClip, XMLLib.NS.JT, 'side', this.side); }
	xml.setAttributeNS(areaClip, XMLLib.NS.JT, 'unit', this.unit);
	return areaClip;
};
/**
 * Nup インスタンスを作成する
 * @constructor
 * @class Nupを指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Nup instance.
 * @constructor
 * @class This class specifies Nup.<br>
 * @lang en
 */
JFLib.Copy.Nup = function()
{
	/**
	 *	Nupのする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *  @lang ja
	 */
	/**
	 *  Whether to specify Nup.<br>
	 *	@type Bool
	 *	@default Do not specify (i.e. 1-up).
	 *  @lang en
	 */
	this.enable = false;
	/**
	 *	Nupの分割数をあらわす定数を設定する
	 *	@type JFLib.NUPNUM
	 *	@default 通常印刷
	 *  @lang ja
	 */
	/**
	 *	N of Nup.
	 *	@type JFLib.NUPNUM
	 *	@default 1-up.
	 *  @lang en
	 */
	this.num = JFLib.NUPNUM.ONE;
	/**
	 *	Nupの配置順序をあらわす定数を設定する
	 *	@type JFLib.NUPORDER
	 *	@default 左上、右上、左下、右下の順
	 *  @lang ja
	 */
	/**
	 *	Constant specifying image positioning in Nup.
	 *	@type JFLib.NUPORDER
	 *	@default Top left -> top right -> bottom left -> bottom right
	 *  @lang en
	 */
	this.order = JFLib.NUPORDER.LRTD;
};
/**
 * @private
 * Nupオブジェクトをxml node化する
 * @lang ja
 */
/**
 * @private
 * Creates xml node from Nup object.
 * @lang en
 */
JFLib.Copy.Nup.prototype.toXmlNode = function (xml)
{
	var nup = xml.createElementNS(XMLLib.NS.JT, 'Nup');
	xml.setAttributeNS(nup, XMLLib.NS.JT, 'order', this.order);
	nup.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Faces',this.num));
	return nup;
};

/**
 * AsBook インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class ブック両面を指定するクラス<br>
 * @lang ja
 */
 /**
 * Creates AsBook instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify Page Split.<br>
 * @lang en
 */
JFLib.Copy.AsBook = function()
{
	/**
	 *	ブック両面のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Page Split.<br>
	 *	@type Bool
	 *	@default Do not perform Page Split.
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	スキャン原稿の綴じ位置によって分割出力された2面の画像のページ順と向き設定する<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type JFLib.SPLITBOUND
	 *	@default なし
	 *	@lang ja
	 */
	/**
	 *	Speciifes order and orientation according to binding position of scanned document.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type JFLib.SPLITBOUND
	 *	@default None
	 *	@lang en
	 */
	this.boundAt = "";
	/**
	 *	分割されたページのどちら側をスキャン開始ページとするかを設定する(コピーサービスのみ)<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type JFLib.SPLITPAGE
	 *	@default なし
	 *	@lang ja
	 */
	 /**
	 *	Specifies which of the pages resulting from the split is start page. Supported in Copy Service only.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type JFLib.SPLITPAGE
	 *	@default None
	 *	@lang en
	 */
	this.startFrom = "";
	/**
	 *	分割されたページのどちら側をスキャン終了ページとするかを設定する(コピーサービスのみ)<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type JFLib.SPLITPAGE
	 *	@default なし
	 *	@lang ja
	 */
	/**
	 *	Specifies which page resulting from page split is final page. Supported in Copy Service only.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type JFLib.SPLITPAGE
	 *	@default None
	 *	@lang en
	 */
	this.endTo = "";
};
/**
 * @private
 * AsBookオブジェクトをxml node化する
 */
JFLib.Copy.AsBook.prototype.toXmlNode = function (xml)
{
	var asBook = xml.createElementNS(XMLLib.NS.JT, 'SplitScan');
	var pageSplit = asBook.appendChild(xml.createElementNS(XMLLib.NS.JT, 'PageSplit'));
	if(this.boundAt) { xml.setAttributeNS(pageSplit, XMLLib.NS.JT, 'boundAt', this.boundAt); }
	if(this.startFrom){ xml.setAttributeNS(pageSplit, XMLLib.NS.JT, 'startFrom', this.startFrom); }
	if(this.endTo) { xml.setAttributeNS(pageSplit, XMLLib.NS.JT, 'endTo', this.endTo); }
	return asBook;
};

/**
 * ImageRepeat インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 繰り返し出力（同一ページを分割した出力ページに順次出力する機能）を指定するクラス<br>
 * @lang ja
 */
 /**
 * Creates ImageRepeat instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify Image Repeat feature. In Image Repeat feature, output pages are divided into parts to which the image of a given page is repeatedly output.<br>
 * @lang en
 */
JFLib.Copy.ImageRepeat = function()
{
	/**
	 *	繰り返し出力のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Image Repeat.<br>
	 *	@type Bool
	 *	@default Do not perform Image Repeat (false)
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	分割されたページへの配置方法を設定する<br>
	 *	@type JFLib.RPTPLACE
	 *	@default JFLib.RPTPLACE.EVEN
	 *	@lang ja
	 */
	/**
	 *	Specifies how to place images to divided page parts.<br>
	 *	@type JFLib.RPTPLACE
	 *	@default JFLib.RPTPLACE.EVEN
	 *	@lang en
	 */
	this.placement = JFLib.RPTPLACE.EVEN;
	/**
	 *	出力ページの縦分割数を1以上の整数値で設定する<br>
	 *	@type Int
	 *	@default なし
	 *	@lang ja
	 */
	/**
	 *	Positive integer representing number of parts to divide output page into, in vertical direction.<br>
	 *	@type Int
	 *	@default None
	 *	@lang en
	 */
	this.countV = 0;
	/**
	 *	出力ページの横分割数を1以上の整数値で設定する<br>
	 *	@type Int
	 *	@default なし
	 *	@lang ja
	 */
	/**
	 *	Positive integer representing number of parts to divide output page into, in horizontal direction.<br>
	 *	@type Int
	 *	@default None
	 *	@lang en
	 */
	this.countH = 0;
};
/**
 * @private
 * ImageRepeatオブジェクトをxml node化する
 */
JFLib.Copy.ImageRepeat.prototype.toXmlNode = function (xml)
{
	var repeat = xml.createElementNS(XMLLib.NS.JT, 'Repeat');
	if(this.countV || this.countH){
		var faces = repeat.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Faces'));
		if(this.countV) {
			xml.setAttributeNS(faces, XMLLib.NS.JT, 'countV', this.countV);
		}
		if(this.countH) {
			xml.setAttributeNS(faces, XMLLib.NS.JT, 'countH', this.countH);
		}
	}
	xml.setAttributeNS(repeat, XMLLib.NS.JT, 'placement', this.placement);
	
	return repeat;
};
/**
 * DoubleCopy インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class ダブルコピー機能（出力ページを等分割し、入力ページを繰り返し貼り付ける機能）を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates DoubleCopy instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify Double Copy feature. In Double Copy feature, output page is divided into equal parts onto which input page images are printed repeatedly.<br>
 * @lang en
 */
JFLib.Copy.DoubleCopy = function()
{
	/**
	 *	繰り返し出力のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Double Copy.<br>
	 *	@type Bool
	 *	@default Do not perform Double Copy (false)
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	出力ページの分割数を設定する<br>
	 *	@type JFLib.DBLCOPYFACES
	 *	@default JFLib.DBLCOPYFACES.ONE
	 *	@lang ja
	 */
	/**
	 *	Number of parts into which to divide output page.<br>
	 *	@type JFLib.DBLCOPYFACES
	 *	@default JFLib.DBLCOPYFACES.ONE
	 *	@lang en
	 */
	this.faces = JFLib.DBLCOPYFACES.ONE;
};
/**
 * @private
 * DoubleCopyオブジェクトをxml node化する
 */
JFLib.Copy.DoubleCopy.prototype.toXmlNode = function (xml)
{
	var doubleCopy = xml.createElementNS(XMLLib.NS.JT, 'DoubleCopy');
	doubleCopy.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Faces', this.faces));
	return doubleCopy;
};

/**
 * Signature インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 小冊子印刷を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Signature instance. 
 * @constructor
 * @return None <br>
 * @class This class is used to specify Signature printing. <br>
 * @lang en
 */
JFLib.Copy.Signature = function()
{
	/**
	 *	小冊子印刷のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Signature printing<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	綴じ方向をあらわす定数を設定する
	 *	@type JFLib.SIGBIND
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Binding position, specified by constants defined for binding position.
	 *	@type JFLib.SIGBIND
	 *	@default null
	 *	@lang en
	 */
	this.bind = "";
	/**
	 *	綴じ代を整数値(0～50)で設定する<br>単位はmm
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Binding margin in millimeters. Range is 0-50.<br>
	 *	@type Int
	 *	@default 0
	 *	@lang en
	 */
	this.margin = 0;
	/**
	 *	面付けを行う出力用紙枚数の制限を指定する
	 *	@type Int
	 *	@default 1
	 *	@lang ja
	 */
	/**
	 *	Maximum number of pages that can be output to a single Signature booklet.
	 *	@type Int
	 *	@default 1
	 *	@lang en
	 */
	this.divide = 1;
	/**
	 *	裏表紙出力のする/しないを設定する
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether to arrange images so that last page of input is output as last page (back cover page) of output
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.backPrt = false;
	/**
	 *	表紙付けを設定する
	 *	@type JFLib.Copy.Cover
	 *	@lang ja
	 */
	 /**
	 *	Whether or not to set Cover.
	 *	@type JFLib.Copy.Cover
	 *	@lang en
	 */
	//this.cover = new JFLib.Copy.Cover();
	/**
	 *	折り/中綴じなどの後処理を設定する
	 *	@type String
	 */
	//this.booklet = "";
};
/**
 * @private
 * Signatureオブジェクトをxml node化する
 */
JFLib.Copy.Signature.prototype.toXmlNode = function (xml)
{
	var sig = xml.createElementNS(XMLLib.NS.JT, 'Signature');
	if(this.bind) {
		sig.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "BoundAt",this.bind));
	}
	/* 面付け無しでは禁則となる設定値をクリアする T.B.D*/
	if(this.bind == JFLib.SIGBIND.NONE) {
		this.margin = 0;
		this.divide = 0;
		this.backPrt = false;
	}
	if(this.margin) {
		sig.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "BindingMargin",this.margin));
	} 
	if(this.divide) {
		sig.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "Divide",this.divide));
	}
	xml.setAttributeNS(sig, XMLLib.NS.JT, "backPrint", this.backPrt);
	return sig;
};
/**
 * Cover インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 表紙設定を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Cover instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify cover sheet output.<br>
 * @lang en
 */
JFLib.Copy.Cover = function()
{
	/**
	 *	表紙を付加する/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to print cover sheet.<br>
	 *	@type Bool
	 *	@default Do not print cover sheet (false)
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	表紙への画像印刷方法をあらわす定数を設定する
	 *	@type JFLib.COVERIMG
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Where to print images on cover sheet.
	 *	@type JFLib.COVERIMG
	 *	@default null
	 *	@lang en
	 */
	this.img = "";
	/**
	 *	表紙トレイをあらわす定数を設定する
	 *	@type JFLib.INTRAY
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Cover Tray, specified by constants defined for Cover Tray.
	 *	@type JFLib.INTRAY
	 *	@default null
	 *	@lang en
	 */
	this.tray = "";
	/**
	 *	表紙枚数を設定する
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 */
	/**
	 *	Specifies number of sheets to feed for cover.
	 *	@type Int
	 *	@default 0
	 *	@lang en
	 */
	this.sheet = 0;
};
/**
 * CoverPage インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 表紙付けを指定するクラス<br>
 * @lang ja
 */
 /**
 * Creates CoverPage instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify Cover Sheet settings.<br>
 * @lang en
 */
JFLib.Copy.CoverPage = function()
{
	/**
	 *	表紙付けする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 */
	//this.enable = false;
	/**
	 *	おもて表紙を設定する
	 *	@type JFLib.Copy.Cover
	 *	@default new JFLib.Copy.Cover()
	 *	@lang ja
	 */
	 /**
	 *	Front Cover
	 *	@type JFLib.Copy.Cover
	 *	@default new JFLib.Copy.Cover()
	 *	@lang en
	 */
	this.front = new JFLib.Copy.Cover();
	/**
	 *	うら表紙を設定する
	 *	@type JFLib.Copy.Cover
	 *	@default new JFLib.Copy.Cover()
	 *	@lang ja
	 */
	/**
	 *	Back Cover
	 *	@type JFLib.Copy.Cover
	 *	@default new JFLib.Copy.Cover()
	 *	@lang en
	 */
	this.back = new JFLib.Copy.Cover();
};
/**
 * @private
 * CoverPageオブジェクトをxml node化する
 */
JFLib.Copy.CoverPage.prototype.toXmlNode = function (xml)
{
	var cp = xml.createElementNS(XMLLib.NS.JT, 'CoverPage');
	if(this.front.enable) {
		var fcover = cp.appendChild(xml.createElementNS(XMLLib.NS.JT, "FrontCover"));
		if(this.front.img) { 
			fcover.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "CoverImage",this.front.img));
		}
		if(this.front.tray) { 
			fcover.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "CoverTray",this.front.tray));
		}
		if(this.front.sheet) { 
			if(this.front.img != JFLib.COVERIMG.NONE) {
				this.front.sheet = 1; //イメージありの場合は枚数は1固定
			}
			fcover.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "CoverSheets",this.front.sheet));
		}
	}

	if(this.back.enable) {
		var bcover = cp.appendChild(xml.createElementNS(XMLLib.NS.JT, "BackCover"));
		if(this.back.img) { 
			bcover.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "CoverImage",this.back.img));
		}
		if(this.back.tray) { 
			bcover.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "CoverTray",this.back.tray));
		}
		if(this.back.sheet) { 
			if(this.back.img != JFLib.COVERIMG.NONE) {
				this.back.sheet = 1; //イメージありの場合は枚数は1固定
			}
			bcover.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "CoverSheets",this.back.sheet));
		}
	}

	return cp;
};

/**
 * Annotation インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class アノテーションを指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Annotation instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify annotation.<br>
 * @lang en
 */
JFLib.Copy.Annotation = function()
{
	/**
	 *	スタンプ印字を設定する
	 *	@type JFLib.Copy.Stamp
	 *	@default new JFLib.Copy.Stamp()
	 *	@lang ja
	 */
	/**
	 *	Stamp
	 *	@type JFLib.Copy.Stamp
	 *	@default new JFLib.Copy.Stamp()
	 *	@lang en
	 */
	this.stamp = new JFLib.Copy.Stamp();
	/**
	 *	スタンプ印字を設定する
	 *	@type JFLib.Copy.DatePrint
	 *	@default new JFLib.Copy.DatePrint()
	 *	@lang ja
	 */
	/**
	 *	Date
	 *	@type JFLib.Copy.DatePrint
	 *	@default new JFLib.Copy.DatePrint()
	 *	@lang en
	 */
	this.date = new JFLib.Copy.DatePrint();
	/**
	 *	ページ番号印字を設定する
	 *	@type JFLib.Copy.PagePrint
	 *	@default new JFLib.Copy.PagePrint()
	 *	@lang ja
	 */
	/**
	 *	Page number
	 *	@type JFLib.Copy.PagePrint
	 *	@default new JFLib.Copy.PagePrint()
	 *	@lang en
	 */
	this.page = new JFLib.Copy.PagePrint();
	/**
	 *	番号文字列印字を設定する
	 *	@type JFLib.Copy.Numbering
	 *	@default new JFLib.Copy.Numbering()
	 *	@lang ja
	 */
	/**
	 *	Page number style
	 *	@type JFLib.Copy.Numbering
	 *	@default new JFLib.Copy.Numbering()
	 *	@lang en
	 */
	this.numbering = new JFLib.Copy.Numbering();
};
/**
 * @private
 * Annotationオブジェクトをxml node化する
 */
JFLib.Copy.Annotation.prototype.toXmlNode = function (xml)
{
	var antion = xml.createElementNS(XMLLib.NS.JT, 'Annotation');
	if(this.stamp.enable) {
		antion.appendChild(this.stamp.toXmlNode(xml));
	}
	if(this.date.enable) {
		antion.appendChild(this.date.toXmlNode(xml));
	}
	if(this.page.enable) {
		antion.appendChild(this.page.toXmlNode(xml));
	}
	if(this.numbering.enable) {
		antion.appendChild(this.numbering.toXmlNode(xml));
	}

	return antion;
};
/**
 * Stamp インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class アノテーションのスタンプ印字を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Stamp instance
 * @constructor
 * @return None <br>
 * @class This class is used to specify Stamp annotation printing.<br>
 * @lang en
 */
JFLib.Copy.Stamp = function()
{
	/**
	 *	スタンプ印字のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Stamp printing.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	スタンプの種類をあらわす定数を設定する
	 *	@type JFLib.ANSTAMP
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Stamp type, specified by constants defined for Stamp type.
	 *	@type JFLib.ANSTAMP
	 *	@default null
	 *	@lang en
	 */
	this.style = "";
	/**
	 *	印字位置をあらわす定数を設定する
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Annotation print position, specified by constants defined for annotation print position.
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang en
	 */
	this.position = "";
	/**
	 *	印字するページをあらわす定数をで設定する
	 *	@type JFLib.ANPRINTPAGE
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Annotation print page, specified by constants defined for annotation print page.
	 *	@type JFLib.ANPRINTPAGE
	 *	@default null
	 *	@lang en
	 */
	this.prtPage = "";
	/**
	 *	両面印刷時の裏面印刷の対称/非対称をtrue/falseで設定する
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether to position Stamp on side 2 symmetrically to that on side 1 (true), or on the same position as that on side 1 (false).
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.backSide = false;
	/**
	 *	印字サイズを設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Font size for Stamp.
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.size = "";
	/**
	 *	スタンプ色をあらわす定数を設定する
	 *	@type JFLib.ANSTAMPCOLOR
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Stamp print color, specified by constants defined for Stamp print color.
	 *	@type JFLib.ANSTAMPCOLOR
	 *	@default null
	 *	@lang en
	 */
	this.color = "";
};
/**
 * @private
 * Stampオブジェクトをxml node化する
 */
JFLib.Copy.Stamp.prototype.toXmlNode = function (xml)
{
	var stamp = xml.createElementNS(XMLLib.NS.JT, 'Stamp');
	/* styleはNamedStyleで指定する */
	if(this.style) {
		stamp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "NamedStyle", this.style));
	}
	/*else if(this.style >= JFLib.ANSTAMP.USERDEF1 && this.style <= JFLib.ANSTAMP.USERDEF8) {
		var userStyle = parseInt(this.style) - parseInt(JFLib.ANSTAMP.SYSTEM8);
		stamp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "UserStyle", userStyle));
	}*/
	if(this.position) { xml.setAttributeNS(stamp, XMLLib.NS.JT, "position", this.position); }
	if(this.prtPage) {
		var prtPg = "AllPages";
		var prtCv = false;

		switch(this.prtPage) {
			case JFLib.ANPRINTPAGE.HEAD:
				prtPg = "TopPageOnly";
				prtCv = true;
				break;

			case JFLib.ANPRINTPAGE.ALL:
				prtCv = true;
				break;

			case JFLib.ANPRINTPAGE.ALL_EXCEPT_COVER_AND_FIRST:
				prtPg = "ExceptTopPage";
				break;

			case JFLib.ANPRINTPAGE.ALL_EXCEPT_COVER:
				break;

			default:
				break;
		}
	
		xml.setAttributeNS(stamp, XMLLib.NS.JT, "printPage", prtPg);
		xml.setAttributeNS(stamp, XMLLib.NS.JT, "printCover", prtCv);
	}
	if (this.backSide) { xml.setAttributeNS(stamp, XMLLib.NS.JT, "backSideSymm", this.backSide); }
	if(this.size) { xml.setAttributeNS(stamp, XMLLib.NS.JT, "size", this.size); }
	if(this.color) { xml.setAttributeNS(stamp, XMLLib.NS.JT, "namedColor", this.color); }
	return stamp;
};

/**
 * DatePrint インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class アノテーションの日付印字を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates DatePrint instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify Date annotation printing.<br>
 * @lang en
 */
JFLib.Copy.DatePrint = function()
{
	/**
	 *	日付印字のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Date printing.<br>
	 *	@type Bool
	 *	@default Do not perform Date printing
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	印字方法あらわす定数を設定する
	 *	@type JFLib.ANDATE
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Date format, specified by constants defined for Date format.
	 *	@type JFLib.ANDATE
	 *	@default null
	 *	@lang en
	 */
	this.style = "";
	/**
	 *	印字位置をあらわす定数を設定する
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Annotation print position, specified by constants defined for annotation print position.
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang en
	 */
	this.position = "";
	/**
	 *	印字するページをあらわす定数をで設定する
	 *	@type JFLib.ANPRINTPAGE
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Pages to which to print Date, specified by constants defined for pages to which to print Date.
	 *	@type JFLib.ANPRINTPAGE
	 *	@default null
	 *	@lang en
	 */
	this.prtPage = "";
	/**
	 *	両面印刷時の裏面印刷の対称/非対称をtrue/falseで設定する
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether to position date on side 2 symmetrically to that on side 1 (true), or on the same position as that on side 1 (false).
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.backSide = false;
	/**
	 *	印字サイズを設定する
	 *	@type Int(6～24)
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Font size for date
	 *	@type Int, range 6-24
	 *	@default null
	 *	@lang en
	 */
	this.size = "";
};
/**
 * @private
 * DatePrintオブジェクトをxml node化する
 */
JFLib.Copy.DatePrint.prototype.toXmlNode = function (xml)
{
	var andate = xml.createElementNS(XMLLib.NS.JT, 'Date');
	if(this.style) {
		andate.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "NamedStyle", this.style));
	}
	if(this.position) { xml.setAttributeNS(andate, XMLLib.NS.JT, "position", this.position); }
	if(this.prtPage) {
		var prtPg = "AllPages";
		var prtCv = "false";

		switch(this.prtPage)
		{
			case JFLib.ANPRINTPAGE.HEAD:
				prtPg = "TopPageOnly";
				prtCv = "true";
				break;

			case JFLib.ANPRINTPAGE.ALL:
				prtCv = "true";
				break;

			case JFLib.ANPRINTPAGE.ALL_EXCEPT_COVER_AND_FIRST:
				prtPg = "ExceptTopPage";
				break;

			case JFLib.ANPRINTPAGE.ALL_EXCEPT_COVER:
				break;

			default:
				break;
		}
	
		xml.setAttributeNS(andate, XMLLib.NS.JT, "printPage", prtPg);
		xml.setAttributeNS(andate, XMLLib.NS.JT, "printCover", prtCv);
	}
	if(this.backSide) { xml.setAttributeNS(andate, XMLLib.NS.JT, "backSideSymm", this.backSide); }
	if(this.size) { xml.setAttributeNS(andate, XMLLib.NS.JT, "size", this.size); }
	return andate;
};

/**
 * PagePrint インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class アノテーションのページ番号印字を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates PagePrint instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify page number printing.<br>
 * @lang en
 */
JFLib.Copy.PagePrint = function()
{
	/**
	 *	ページ番号印字のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform page number printing.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	印字方法あらわす定数を設定する
	 *	@type JFLib.ANPAGE
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Page number print format, specified by constants defined for page number print format.
	 *	@type JFLib.ANPAGE
	 *	@default null
	 *	@lang en
	 */
	this.style = "";
	/**
	 *	印字開始ページを設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Page from which to print page number.
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.pageFrom = "";
	/**
	 *	印字終了ページを設定する
	 *	@type Int/JFLib.ANPAGETO
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Page up to which to print page number.
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.pageTo = "";
	/**
	 *	表紙への印字をする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to print page number to Cover Sheet.<br>
	 *	@type Bool
	 *	@default Do not print page number to Cover Sheet (false)
	 *	@lang en
	 */
	this.prtCover = false;
	/**
	 *	印字初期ページ番号を設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Initial page number
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.initial = "";
	/**
	 *	印字総ページ数を設定する<br>
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Total number of pages<br>
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.total = "";
	/**
	 *	印字位置をあらわす定数を設定する
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Annotation print position, specified by constants defined for annotation print position.
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang en
	 */
	this.position = "";
	/**
	 *	両面印刷時の裏面印刷の対称/非対称をtrue/falseで設定する
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether to position page number on side 2 symmetrically to that on side 1 (true), or on the same position as that on side 1 (false).
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.backSide = false;
	/**
	 *	印字サイズを設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Font size for page number
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.size = "";
};
/**
 * @private
 * PagePrintオブジェクトをxml node化する
 */
JFLib.Copy.PagePrint.prototype.toXmlNode = function (xml)
{
	var anpg = xml.createElementNS(XMLLib.NS.JT, 'PageNumber');
	if(this.style) { anpg.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "SystemStyle", this.style)); }
	if(this.pageFrom) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "pageFrom", this.pageFrom); }
	if(this.pageTo) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "pageTo", this.pageTo); }
	xml.setAttributeNS(anpg, XMLLib.NS.JT, "printCover", this.prtCover);
	if(this.initial) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "initialNumber", this.initial); }
	if(this.total) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "totalPages", this.total); }
	if(this.position) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "position", this.position); }
	if(this.backSide) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "backSideSymm", this.backSide); }
	if(this.size) { xml.setAttributeNS(anpg, XMLLib.NS.JT, "size", this.size); }
	return anpg;
};

/**
 * Numbering インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class アノテーションの番号文字列印字を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Numbering instance.
 * @constructor
 * @return None <br>
 * @class This class is used to specify settings for feature in which page number can be printed in combination with text.<br>
 * @lang en
 */
JFLib.Copy.Numbering = function()
{
	/**
	 *	番号文字列印字のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform printing of text in combination with page number.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	ページ番号に付加する文字列を設定する
	 *	@type String
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Text to append to page number.
	 *	@type String
	 *	@default null
	 *	@lang en
	 */
	this.text = "";
	/**
	 *	印字開始ページを設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Page from which page number with text is printed.
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.pageFrom = "";
	/**
	 *	印字終了ページを設定する
	 *	@type Int/JFLib.ANPAGETO
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Page up to which page number with text is printed.
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.pageTo = "";
	/**
	 *	表紙への印字をする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false;
	 *	@lang ja
	 */
	/**
	 *	Whether or not to print page number with text to Cover Sheet.<br>
	 *	@type Bool
	 *	@default Do not print page number to Cover Sheet (false)
	 *	@lang en
	 */
	this.prtCover = false;
	/**
	 *	印字初期ページ番号を設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Initial page number
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.initial = "";
	/**
	 *	印字桁数を設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Number of digits in page number
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.digit = "";
	/**
	 *	印字位置をあらわす定数を設定する
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Annotation print position, specified by constants defined for annotation print position.
	 *	@type JFLib.ANPOS
	 *	@default null
	 *	@lang en
	 */
	this.position = "";
	/**
	 *	両面印刷時の裏面印刷の対称/非対称をtrue/falseで設定する
	 *	@type Bool
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Whether to position page number on side 2 symmetrically to that on side 1 (true), or on the same position as that on side 1 (false).
	 *	@type Bool
	 *	@default null
	 *	@lang en
	 */
	this.backSide = false;
	/**
	 *	印字サイズを設定する
	 *	@type Int
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Font size for page number / text
	 *	@type Int
	 *	@default null
	 *	@lang en
	 */
	this.size = "";
};
/**
 * @private
 * Numberingオブジェクトをxml node化する
 */
JFLib.Copy.Numbering.prototype.toXmlNode = function (xml)
{
	var annumber = xml.createElementNS(XMLLib.NS.JT, 'BatesNumber');
	if(this.text) { annumber.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "Text", this.text)); }
	if(this.pageFrom) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "pageFrom", this.pageFrom); }
	if(this.pageTo) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "pageTo", this.pageTo); }
	xml.setAttributeNS(annumber, XMLLib.NS.JT, "printCover", this.prtCover);
	if(this.initial) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "initialNumber", this.initial); }
	if(this.digit) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "pageDigits", this.digit); }
	if(this.position) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "position", this.position); }
	if(this.backSide) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "backSideSymm", this.backSide); }
	if(this.size) { xml.setAttributeNS(annumber, XMLLib.NS.JT, "size", this.size); }
	return annumber;
};


/**
 * Watermark インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class すかし印刷を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Watermark instance.
 * @constructor
 * @return None <br>
 * @class This class is used for specifying Watermark printing, i.e. printing of additional information / copy control patterns to background.<br>
 * @lang en
 */
JFLib.Copy.Watermark = function()
{
	/**
	 *	すかし印刷のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to perform Watermark printing.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.enable = false;
	/**
	 *	管理番号を設定する
	 *	@type Int
	 *	@default 0
	 *	@lang ja
	 *	@private
	 */
	this.manageId = 0;
	/**
	 *	すかし印刷する文字列をあらわす定数を設定する
	 *	@type JFLib.WMTEXT
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	String to output as Watermark, specified by constants defined for Watermark settings.
	 *	@type JFLib.WMTEXT
	 *	@default null
	 *	@lang en
	 */
	this.text = "";
	/**
	 *	ユーザーの識別子をすかし印刷する/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to output user ID as Watermark.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.userId = false;
	/**
	 *	日時をすかし印刷する/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to output date/time as Watermark.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.date = false;
	/**
	 *	シリアル番号をすかし印刷する/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
	 *	@lang ja
	 */
	/**
	 *	Whether or not to output MFD serial number as Watermark.<br>
	 *	@type Bool
	 *	@default false
	 *	@lang en
	 */
	this.serial = false;
	/**
	 *	すかし印刷の印刷方法をあらわす定数を設定する
	 *	@type JFLib.WMSECPRT
	 *	@default null
	 *	@lang ja
	 */
	/**
	 *	Watermark print settings, specified by constants defined for Watermark print settings.
	 *	@type JFLib.WMSECPRT
	 *	@default null
	 *	@lang en
	 */
	this.secPrt = "";
	
};
/**
 * @private
 * Watermarkオブジェクトをxml node化する
 */
JFLib.Copy.Watermark.prototype.toXmlNode = function (xml)
{
	var wm = xml.createElementNS(XMLLib.NS.JT, 'Watermark');
	if(this.text) {
		wm.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "Text",this.text));
	}
	if(this.userId) {
		wm.appendChild(xml.createElementNS(XMLLib.NS.JT, "UserIdentity"));
	}
	if(this.date) {
		wm.appendChild(xml.createElementNS(XMLLib.NS.JT, "DateTime"));
	}
	if(this.serial) {
		wm.appendChild(xml.createElementNS(XMLLib.NS.JT, "SerialNumber"));
	}
	if(this.secPrt) {
		xml.setAttributeNS(wm, XMLLib.NS.JT, "secretPrint", this.secPrt);
	}
	return wm;
};
/**
 * @private
 */
Extend(JFLib.Copy.prototype, JFLib.Transaction.prototype);
/**
 * @private
 */
JFLib.Copy.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.COPY));
};

JFLib.JSIncluded("JfsCopy");

