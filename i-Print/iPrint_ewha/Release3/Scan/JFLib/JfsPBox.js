/** 
 * @fileoverview ジョブフローにおける親展ボックス配送ジョブを扱うクラスを定義する<br>
 * PBoxクラス<br><br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for jobs handling Mailbox documents in Job Flow.<br>
 * PBox class
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang en
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");

//JfsDefPBox.jsのロード
JFLib.JSInclude("JfsDefPBox");

/**
 * BOX インスタンスを作成する
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * ■使用例 
 *    var pb = new JFLib.Pbox();
 *    pb.boxNo = "100";
 * @class ボックスジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates BOX instance.
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * EXAMPLE:  
 *    var pb = new JFLib.Pbox();
 *    pb.boxNo = "100";
 * @class Class for setting jobs for Mailbox document documents.<br>
 * This class is handled as output operations.<br>
 * Output settings are set using <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>. <br>
 * Subclass of <a href="JFLib.OutputProcess.html#">OutputProcess</a>.

 * @lang en
 */
JFLib.Pbox = function()
{
  /**
   *  配送先ボックス番号を指定する<br> 設定 - <font color = "#ff0000">必須</font>
   *  @type String
   *  @default null
   *  @lang ja
   */ 
  /**
   *  Specifies destination Mailbox number.<br>  <font color = "#ff0000">REQUIRED.</font>
   *  @type String
   *  @default null
   *  @lang en
   */ 
  this.boxNo = "";
  /**
   *  ジョブ実行時に表示する宛先名を設定する<br> 設定 - 任意
   *  @type String
   *  @default null
   *  @lang ja
   */ 
  /**
   *  Specifies destination name to display upon job run.<br> IMPLIED.
   *  @type String
   *  @default null
   *  @lang en
   */ 
  this.name = "";
  /**
   *  配送先ボックス認証情報を指定する<br> 設定 - <font color = "#ff0000">必須</font>
   *  @type JFLib.Distribute.AuthInfo
   *  @default しない
   *  @lang ja
   */ 
  /**
   *  Specifies authentication information for destination Mailbox.<br>  <font color = "#ff0000">REQUIRED.</font>
   *  @type JFLib.Distribute.AuthInfo
   *  @default No authentication.
   *  @lang en
   */ 
  this.authInfo = new JFLib.Distribute.AuthInfo();
  /**
   *  配送先ボックスファイリングポリシーを指定する<br> 設定 - 任意
   *  @type JFLib.FILEPOLICY
   *  @default 重複の場合は機械的に決定
   *  @private
   *  @lang ja
   */ 
  /**
   *  Filing policy for destination Mailbox.<br> IMPLIED.
   *  @type JFLib.FILEPOLICY
   *  @default New Auto Generate
   *  @private
   *  @lang en
   */ 
  this.filepolicy = JFLib.FILEPOLICY.NEWAUTOGEN;
  /**
   *  配送文書名を指定する<br> 設定 - 任意
   *  @type String
   *  @default null
   *  @lang ja
   */
  /**
   *  Document name.<br> IMPLIED.
   *  @type String
   *  @default null
   *  @lang en
   */
  this.docName = "";

};
/**
 * 配送先の親展ボックスパスワードを設定する
 * @param {String} password ボックスパスワード
 * @return {JFLib.Distribute.AuthInfo} authInfo
 * @private
 * @lang ja
 */
/**
 * Specifies password for destination Mailbox.
 * @param {String} password Password for Mailbox.
 * @return {JFLib.Distribute.AuthInfo} authInfo
 * @private
 * @lang en
 */
JFLib.Pbox.prototype.setBoxPassword = function(password)
{
  if(password) {
    this.authInfo.method = JFLib.AUTH.PASSONLY;
    this.authInfo.password = password;
  }
  return this.authInfo;
};
/**
 * @private
 */
JFLib.Pbox.prototype.toXmlNode = function (xml) 
{
  var dist = xml.createElementNS(XMLLib.NS.JT, 'Distribute');
  xml.setAttributeNS(dist, XMLLib.NS.JT, 'container', 'Document');

  dist.appendChild((new JFLib.Distribute.Serialization()).toXmlNode(xml));
  
  var dests = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
  var box = dests.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Mailbox'));
  box.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'FilingPolicy', this.filepolicy));
  box.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'BoxIdentifier', this.boxNo));
  if(this.boxName){
    box.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'FolderName', this.boxName));
  }
  if(this.docName){
    box.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'DocumentName', this.docName));
  }
  box.appendChild(this.authInfo.toXmlNode(xml));
  
  return dist;

};
/**
 * @private
 */
Extend(JFLib.Pbox.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.Pbox.prototype.addRscNode = function (xml, node)
{
  node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.STORMAILBOX));
};

JFLib.JSIncluded("JfsPBox");
