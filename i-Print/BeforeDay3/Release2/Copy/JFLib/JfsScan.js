/** 
 * @fileoverview ジョブフローにおけるスキャンジョブを扱うクラスを定義する<br>
 * Scanクラス<br><br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2013 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.4.1
 * @lang ja 
 * 
 */
 /** 
 * @fileoverview Defines classes handling Scan jobs in Job Flow:<br>
 * Scan Class
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2013 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.4.1
 * @lang en 
 * 
 */

//JfsDefScan.jsのロード
JFLib.JSInclude("JfsDefScan");
//JfsComScan.jsのロード
JFLib.JSInclude("JfsComScan");

/**
 * Scan インスタンスを作成する
 * @constructor
 * @extends JFLib.Transaction
 * @return Scanオブジェクト <br><br>
 * @example
 * ■使用例 
 *    var scan = new Scan();
 *    scan.inputMedium.size = JFLib.MS.A4LEF;
 *    scan.outputMedium.size = JFLib.MS.NONE;
 *    scan.mag.x = 100;
 *    scan.mag.y = 100;
 *    scan.bgelimination = false;
 *    scan.colorMode = JFLib.CM.BW;
 *    scan.darkness = JFLib.DARK.D1;
 *    scan.edgeErase.x = 10;
 *    scan.edgeErase.y = 10;
 * @class スキャンジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う
 * <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a>にて入力処理を設定する <br>
 * <a href="JFLib.Transaction.html#">Transaction</a>のサブクラス <br>
 * @lang ja 
 */
/**
 * Creates Scan instance.
 * @constructor
 * @extends JFLib.Transaction
 * @return Scan object. <br><br>
 * @example
 * EXAMPLE:  
 *    var scan = new Scan();
 *    scan.inputMedium.size = MS.A4LEF;
 *    scan.outputMedium.size = MS.NONE;
 *    scan.mag.x = 100;
 *    scan.mag.y = 100;
 *    scan.bgelimination = false;
 *    scan.colorMode = CM.BW;
 *    scan.darkness = DARK.D1;
 *    scan.edgeErase.x = 10;
 *    scan.edgeErase.y = 10;
 * @class This class sets Scan job settings.<br>
 * This class is handled as input operations. <br>
 * This class sets input settings using <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a>. Subclass of <a href="JFLib.Transaction.html#">Transaction</a>.
 * @lang en 
 */
JFLib.Scan = function()
{
  /**
   *  入力サイズを指定する<br> 設定 - <font color = "#ff0000">必須</font>
   *  @type JFLib.ComScan.InputMediumSize
   *  @default サイズ自動
   *  @lang ja 
   */ 
  /**
   *  Input size.<br>  <font color = "#ff0000">REQUIRED.</font>
   *  @type JFLib.ComScan.InputMediumSize
   *  @default Auto.
   *  @lang en 
   */ 
  this.inputMedium = new JFLib.ComScan.InputMediumSize();
  /**
   *  天の向きを指定する<br> 設定 - 任意
   *  @type JFLib.HP
   *  @default デバイスのデフォルトの向き
   *  @lang ja 
   */ 
  /**
   *  Head position.<br> IMPLIED.
   *  @type JFLib.HP
   *  @default Default head position set to device.
   *  @lang en 
   */ 
  this.headposition = JFLib.HP.DEFAULT;
  /**
   *  片面/両面スキャンを指定する<br> 設定 - 任意
   *  @type JFLib.PLEX
   *  @default 片面
   *  @lang ja 
   */ 
  /**
   *  Simplex/Duplex scan settings.<br> IMPLIED.
   *  @type JFLib.PLEX
   *  @default Simplex
   *  @lang en
   */ 
  this.plex = JFLib.PLEX.SIMPLEX;
  /**
   *  スキャン原稿の読み取り元を指定する<br> 設定 - 任意
   *  @type JFLib.INDEVICE
   *  @default 原稿がセットされている入力装置
   *  @lang ja 
   */ 
  /**
   *  Scan input device (platen/DADF).<br> IMPLIED.
   *  @type JFLib.INDEVICE
   *  @default Scan input device to which document is set.
   *  @lang en 
   */ 
  this.scanFrom = JFLib.INDEVICE.BOTH;
  /**
   *  分割スキャンを指定する<br> 設定 - 任意
   *  @type JFLib.ComScan.SplitScan
   *  @default 分割スキャンしない
   *  @lang ja 
   */ 
  this.splitScan = new JFLib.ComScan.SplitScan();
  /**
   *  イメージモードを指定する<br> 設定 - 任意
   *  @type JFLib.IM
   *  @default デバイスのデフォルト設定に従う(V2.0.15以降)
   *  @lang ja 
   */ 
  /**
   *  Image mode. <br> IMPLIED.
   *  @type JFLib.IM
   *  @default Operation is according to device default settings. (from V2.0.15)
   *  @lang en 
   */ 
  this.imageMode = JFLib.IM.DEFAULT;
  /**
   *  カラーモードを指定する<br> 設定 - 任意
   *  @type JFLib.CM
   *  @default 自動
   *  @lang ja 
   */ 
  /**
   *  Color Mode.<br> IMPLIED.
   *  @type JFLib.CM
   *  @default Auto.
   *  @lang en 
   */ 
  this.colorMode = JFLib.CM.AUTO;
  /**
   *  出力サイズを指定する<br> 設定 - <font color = "#ff0000">必須</font>
   *  @type JFLib.ComScan.OutputMediumSize
   *  @default 指定なし
   *  @lang ja 
   */ 
  /**
   *  Output size.<br>  <font color = "#ff0000">REQUIRED.</font>
   *  @type JFLib.ComScan.OutputMediumSize
   *  @default Not specified.
   *  @lang en 
   */ 
  this.outputMedium = new JFLib.ComScan.OutputMediumSize();
  /**
   *  拡大･縮小倍率を指定する<br> 設定 - 任意
   *  @type JFLib.ComScan.Magnification
   *  @default 等倍
   *  @lang ja 
   */ 
  /**
   *  Enlargement/reduction rate.<br> IMPLIED.
   *  @type JFLib.ComScan.Magnification
   *  @default 1:1.
   *  @lang en 
   */ 
  this.magnification = new JFLib.ComScan.Magnification();
  /**
   *  次原稿を指定する<br> 設定 - 任意
   *  @type Bool
   *  @default しない
   *  @lang ja 
   */ 
  /**
   *  Next original.<br> IMPLIED.
   *  @type Bool
   *  @default Last original.
   *  @lang en 
   */ 
  this.nextoriginal = true;
  /**
   *  nextoriginalの指定が有効となる、文書入力機構の条件を指定する<br> 設定 - 任意
   *  @type JFLib.INDEVICE
   *  @default 条件なし
   *  @lang ja
   */ 
  /**
   *  Specifies the document input device condition in which nextoriginal designation is enabled.<br> IMPLIED.
   *  @type JFLib.INDEVICE
   *  @default None.
   *  @lang en
   */ 
  this.whenScannedFrom = "";  
  /**
   *  地色除去を指定する<br>もしくは、デバイスの規定値をJFLib.DEFAULTで設定する<br> 設定 - 任意
   *  @type Bool/JFLib.DEFAULT
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Background elimination. <br>Device default settings may be specified by setting JFLib.DEFAULT.<br> IMPLIED.
   *  @type Bool/JFLib.DEFAULT
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.bgelimination = JFLib.DEFAULT;
  /**
   *  解像度を指定する<br> 設定 - 任意
   *  @type JFLib.RES
   *  @default 600dpi
   *  @lang ja 
   */ 
  /**
   *  Resolution.<br> IMPLIED.
   *  @type JFLib.RES
   *  @default 600dpi
   *  @lang en 
   */ 
  this.resolution = JFLib.RES.R600;
  /**
   *  コントラスト調整を指定する<br> 設定 - 任意
   *  @type JFLib.CONT
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Contrast.<br> IMPLIED.
   *  @type JFLib.CONT
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.contrast = JFLib.CONT.DEFAULT;
  /**
   *  濃度調整を指定する<br> 設定 - 任意
   *  @type JFLib.DARK
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Darkness. <br> IMPLIED.
   *  @type JFLib.DARK
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.darkness = JFLib.DARK.DEFAULT;
  /**
   *  明度調整を指定する<br> 設定 - 任意
   *  @type JFLib.BRIGHT
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Brightness.<br> IMPLIED.
   *  @type JFLib.BRIGHT
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.brightness = JFLib.BRIGHT.DEFAULT;
  /**
   *  シャープネス調整を指定する<br> 設定 - 任意
   *  @type JFLib.SHARP
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Sharpness.<br> IMPLIED.
   *  @type JFLib.SHARP
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.sharpness = JFLib.SHARP.DEFAULT;
  /**
   *  彩度調整を指定する<br> 設定 - 任意
   *  @type JFLib.SAT
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Saturation.<br> IMPLIED.
   *  @type JFLib.SAT
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.saturation = JFLib.SAT.DEFAULT;
  /**
   *  裏写り防止を指定する<br>もしくは、デバイスの規定値をJFLib.DEFAULT設定する<br> 設定 - 任意
   *  @type Bool/JFLib.DEFAULT
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Background elimination. <br>Device default settings may be specified by setting JFLib.DEFAULT.<br> IMPLIED.
   *  @type Bool/JFLib.DEFAULT
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.bleedthroughRemoval = JFLib.DEFAULT;
  /**
   *  枠消しを指定する<br> 設定 - 任意
   *  @type JFLib.ComScan.EdgeErase
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Edge erase.<br> IMPLIED.
   *  @type JFLib.ComScan.EdgeErase
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.edgeErase = new JFLib.ComScan.EdgeErase();
  /**
   *  中消しを指定する<br> 設定 - 任意
   *  @type JFLib.ComScan.CenterErase
   *  @default デバイスのデフォルト設定に従う(V2.1.0以降)
   *  @lang ja 
   */ 
  /**
   *  Center erase.<br> IMPLIED.
   *  @type JFLib.ComScan.CenterErase
   *  @default Operation is according to device default settings. (from V2.1.0)
   *  @lang en 
   */ 
  this.centerErase = new JFLib.ComScan.CenterErase();
  /**
   *  多層画像生成を指定する<br> 設定 - 任意
   *  @type JFLib.Scan.MultiLayer
   *  @default 多層画像生成しない
   *  @lang ja 
   */ 
  /**
   *  Multilayer creation. <br> IMPLIED.
   *  @type JFLib.Scan.MultiLayer
   *  @default Do not create multilayer image.
   *  @lang en 
   */ 
  this.multiLayer = new JFLib.Scan.MultiLayer();
  /**
   *  二値画像圧縮形式を指定する<br> 設定 - 任意
   *  @type String
   *  @default イメージモードにあわせて自動的に圧縮方法を選択する
   *  @lang ja 
   */ 
  /**
   *  Bilevel image compression method.<br> IMPLIED.
   *  @type String
   *  @default Automatically selects compression method according to image mode.
   *  @lang en 
   */ 
  this.bilevel = JFLib.COMPRESSION.AUTO;
  /**
   *  多値画像圧縮率を指定する<br> 設定 - 任意
   *  @type String
   *  @default デバイスのデフォルト設定に従う
   *  @lang ja 
   */ 
  /**
   *  Multilevel image compression rate.<br> IMPLIED.
   *  @type String
   *  @default Operation is according to device default settings. 
   *  @lang en 
   */ 
  this.ratio = JFLib.RATIO.DEFAULT;
  /**
   *  OCR処理を指定する<br> 設定 - 任意
   *  @type JFLib.Scan.OCR
   *  @default しない
   */ 
  this.ocr = new JFLib.Scan.OCR();

  /**
   *  次原稿追加時のパラメータ設定変更を許可する/しない<br>設定 - 任意<br>
   *  許可する：false, 許可しない:true<br>
   *  @type Bool
   *  @default 許可する(false)
   *  @lang ja
   */ 
  /**
   *  Permit / do not permit to change parameter settings upon setting next document.<br>IMPLIED.<br>
   *  Permit:false, Do not permit:true<br>
   *  @type Bool
   *  @default Permit(false)
   *  @lang en
   */ 
  this.lockNextOrgParam = false;
  
  /**
   * 白紙検知を実施する/しない<br>設定 - 任意<br>
   * @type Bool
   * @default 白紙検知しない(false)
   * @lang ja
   */
  /**
   * Whether or not to detect blank paper<br>IMPLIED<br>
   * @type Bool
   * @default Do not detect blank paper (false)
   * @lang en
   */
  this.blankImgCount = false;

  /**
   * 色空間を指定する
   * @type JFLib.ColorSpace
   * @default null
   * @lang ja
   */
  /**
   * Specifies the color space.
   * @type JFLib.ColorSpace
   * @default null
   * @lang en
   */
  this.colorSpace = null;
};
/**
 * 原稿サイズを設定する
 * @param {JFLib.MS} s 定型サイズを指定する
 * @param {int} x 非定型の場合の主操作方向の長さを指定する
 * @param {int} y 非定型の場合の副操作方向の長さを指定する
 * @return {JFLib.InputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang ja 
 */
/**
 * Sets original document size. 
 * @param {JFLib.MS} s Standard medium size. 
 * @param {int} x Length in fast scan direction upon specifying non-standard size.
 * @param {int} y Length in slow scan direction upon specifying non-standard size.
 * @return {JFLib.InputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang en 
 */
JFLib.Scan.prototype.setInputMedium = function (s, x, y)
{
	return this.inputMedium.set(s, x, y);
};
/**
 * 出力サイズを設定する
 * @param {JFLib.MS} s 定型サイズを指定する
 * @param {int} x 非定型の場合の主操作方向の出力サイズ
 * @param {int} y 非定型の場合の副操作方向の出力サイズ
 * @return {JFLib.OutputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang ja 
 */
/**
 * Output medium size.
 * @param {JFLib.MS} s Standard medium size. 
 * @param {int} x Length in fast scan direction upon specifying non-standard size.
 * @param {int} y Length in slow scan direction upon specifying non-standard size.
 * @return {JFLib.OutputMediumSize} [<a href="JFLib.MS.html#">size</a>,x,y]
 * @lang en 
 */
JFLib.Scan.prototype.setOutputMedium = function (s, x, y)
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
JFLib.Scan.prototype.setMagnification = function (x, y)
{
	return this.magnification.set(x, y);
};
/**
 * 枠消しを設定する
 * @param {int} top 上方向の消し量を指定する
 * @param {int} bottom 下方向の消し量を指定する
 * @param {int} left 左方向の消し量を指定する
 * @param {int} right 右方向の消し量を指定する
 * @param {JFLib.UNIT} unit 単位を指定する
 * @return {JFLib.ComScan.EdgeErase} [top, bottom, left, right, unit]
 * @lang ja 
 */
/**
 * Sets Edge Erase settings.
 * @param {int} top Edge Erase at top.
 * @param {int} bottom Edge Erase at bottom.
 * @param {int} left Edge Erase at left.
 * @param {int} right Edge Erase at right.
 * @param {JFLib.UNIT} unit Unit.
 * @return {JFLib.ComScan.EdgeErase} [top, bottom, left, right, unit]
 * @lang en 
 */
JFLib.Scan.prototype.setEdgeErase = function (top, bottom, left, right, unit)
{
	return this.edgeErase.set(top, bottom, left, right, unit);
};
/**
 * 中消しを設定する
 * @param {int} center 中消し量を指定する
 * @param {JFLib.UNIT} unit 単位を指定する
 * @return {EdgeErase} edgeErase
 * @lang ja 
 */
/**
 * Sets Center Erase settings.
 * @param {int} center Center Erase area.
 * @param {JFLib.UNIT} unit Unit.
 * @return {EdgeErase} edgeErase
 * @lang en 
 */
JFLib.Scan.prototype.setCenterErase = function (center, unit)
{
	return this.centerErase.set(center, unit);
};
/**
 * 高圧縮/サムネイル付加を設定する
 * @param {Bool} enable 高圧縮する/しないを指定する
 * @param {Bool} isThumbnail サムネイル付加する/しないを指定する
 * @return {JFLib.Scan.MultiLayer} multiLayer
 * @lang ja 
 */
/**
 * Sets high compression / thumbnail settings.
 * @param {Bool} enable Whether or not to perform high compression.
 * @param {Bool} isThumbnail Whether or not to create thumbnail.
 * @return {JFLib.Scan.MultiLayer} multiLayer
 * @lang en 
 */
JFLib.Scan.prototype.setMultiLayer = function(enable, isThumbnail)
{
	this.multiLayer.enable = enable;
	this.multiLayer.thumbnail = isThumbnail;
};
/**
 * OCR処理を設定する
 * @param {Bool} enable OCRする/しない
 * @param {JFLib.OCRCOMP} [compress] OCR結果テキストの圧縮方法
 * @param {JFLib.OCRLANG} [lang] パンチ穴数
 * @return {JFLib.OCR} ocr
 * @private
 */
JFLib.Scan.prototype.setOCR = function (enable, compress, lang)
{
	this.ocr.enable = enable;
	if(compress) { this.ocr.compress = compress; }
	if(lang) { this.ocr.lang = lang; }
	return this.ocr;
};
/**
 * @private
 */
JFLib.Scan.prototype.toXmlNode = function (xml) 
{
  var scan = xml.createElementNS(XMLLib.NS.JT, 'Scanner');

  var node = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'InputMediumSize'));
  node.appendChild(this.inputMedium.toXmlNode(xml));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'HeadPosition', this.headposition));

  var plex = scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Duplex', this.plex));
  xml.setAttributeNS(plex, XMLLib.NS.JT, 'scanFrom', this.scanFrom);

  if(this.splitScan.enable){
    scan.appendChild(this.splitScan.toXmlNode(xml));
  }

  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ImageMode', this.imageMode));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ColorMode', this.colorMode));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'EnableBackgroundElimination', this.bgelimination));
  scan.appendChild(this.multiLayer.toXmlNode(xml));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Darkness', this.darkness));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Contrast', this.contrast));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Brightness', this.brightness));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Sharpness', this.sharpness));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Saturation', this.saturation));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'BleedthroughRemoval', this.bleedthroughRemoval));
  scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'ImageCount'));
  scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resolution', this.resolution));
  var nextoriginal = scan.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'EnableNextOriginal', this.nextoriginal));
  if (this.whenScannedFrom) {
    xml.setAttributeNS(nextoriginal, XMLLib.NS.JT, 'whenScannedFrom', this.whenScannedFrom);
  }
  node = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'OutputMediumSize'));
  node.appendChild(this.outputMedium.toXmlNode(xml));
  scan.appendChild(this.magnification.toXmlNode(xml));
  scan.appendChild(this.edgeErase.toXmlNode(xml));
  scan.appendChild(this.centerErase.toXmlNode(xml));

  var compression = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Compression'));
  compression.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Bilevel', this.bilevel));
  compression.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'LossyLevel', this.ratio));

  var nextOrgParam = scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'NextOriginalParam'));
  xml.setAttributeNS(nextOrgParam, XMLLib.NS.JT, 'lock', this.lockNextOrgParam);

  if(this.blankImgCount){
	  scan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'BlankImageCount'));
  }

  if(this.colorSpace && this.colorSpace.named){
	  scan.appendChild(this.colorSpace.toXmlNode(xml));
  }

  return scan;
};

/**
 * MultiLayer インスタンスを作成する
 * @constructor
 * @class 多層画像生成を指定するクラス<br>
 * @lang ja 
 */
/**
 * Creates MultiLayer instance.
 * @constructor
 * @class This class creates multilayer image.<br>
 * @lang en 
 */
JFLib.Scan.MultiLayer = function()
{
	/**
	 *	多値画像圧縮をする/しないを設定する<br>
	 *	@type Bool
	 *	@default しない
	 *  @lang ja 
	 */	
	/**
	 *	Whether or not to perform multilevel image compression.<br>
	 *	@type Bool
	 *	@default Do not perform multilevel image compression.
	 *  @lang en 
	 */	
	this.enable = false;
	/**
	 *	サムネイル付加をする/しないを設定する<br>
	 *	@type Bool
	 *	@default しない
	 *  @lang ja 
	 */	
	/**
	 *	Whether or not to add thumbnail.<br>
	 *	@type Bool
	 *	@default Do not add thumbnail.
	 *  @lang en 
	 */	
	this.thumbnail = false;
};
/**
 * @private
 */	
JFLib.Scan.MultiLayer.prototype.toXmlNode = function (xml)
{
	var mLayerString = this.enable ? "ObjectSeparation" : "None";
	var multiLayer = xml.createElementNSwithText(XMLLib.NS.JT, 'CreateMultiLayers', mLayerString);
	xml.setAttributeNS(multiLayer, XMLLib.NS.JT, 'withThumbnails', this.thumbnail);
	return multiLayer;
};

/**
 * OCR インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class OCR処理を指定するクラス<br>
 */
JFLib.Scan.OCR = function()
{
	/**
	 *	OCR処理のする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 */
	this.enable = false;
	/**
	 *	OCR結果テキストの圧縮方法をあらわす定数を設定する
	 *	@type JFLib.OCRCOMP
	 *	@default ""
	 */
	this.compress = "";
	/**
	 *	OCR処理を行う言語を表す定数を設定する
	 *	@type JFLib.OCRLANG
	 *	@default ""
	 */
	this.lang = "";

};
/**
 * @private
 * OCRオブジェクトをxml node化する
 */
JFLib.Scan.OCR.prototype.toXmlNode = function (xml)
{
	var ocr = xml.createElementNS(XMLLib.NS.JT, 'OCR');
	if(this.compress){ xml.setAttributeNS(ocr, XMLLib.NS.JT, 'compression', this.compress); }
	if(this.lang){ xml.setAttributeNS(ocr, XMLLib.NS.JT, 'lang', this.lang); }
	return ocr;
};

/**
 * ColorSpace インスタンスを作成する
 * @constructor
 * @class 色空間を指定するクラス
 * @lang ja
 */
/**
 * Creates ColorSpace instance.
 * @constructor
 * @class This class specifies the color space.
 * @lang en
 */
JFLib.ColorSpace = function()
{
	/**
	 * 色空間名を指定する
	 * @type JFLib.NAMEDCOLORSPACE/JFLib.DEFAULT
	 * @default null
	 * @lang ja
	 */
	/**
	 * Specifies the color space name.
	 * @type JFLib.NAMEDCOLORSPACE/JFLib.DEFAULT
	 * @default null
	 * @lang en
	 */
	this.named = null;
};

/**
 * ColorSpaceオブジェクトをxml node化する
 * @private
 * @lang ja
 */
/**
 * Creates xml node from ColorSpace object.
 * @private
 * @lang en
 */
JFLib.ColorSpace.prototype.toXmlNode = function(xml)
{
	var colorSpaceNode = xml.createElementNS(XMLLib.NS.JT, 'ScanColorSpace');
	if(this.named !== null){
		colorSpaceNode.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'NamedColorSpace', this.named));
	}
	return colorSpaceNode;
};

/**
 * @private
 */
Extend(JFLib.Scan.prototype, JFLib.Transaction.prototype);
/**
 * @private
 */
JFLib.Scan.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.SCANBW));
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.SCANCOLOR));
};

JFLib.JSIncluded("JfsScan");

