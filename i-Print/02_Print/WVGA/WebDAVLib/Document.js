/** 
 * @fileoverview WebDAVを用いて親展ボックス内文書の情報を取得する。<br>
 * 使用するには<b>WebDAVLib/WebDAVLib.js</b>を参照すること
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving information on Folder documents.<br>
 * To use this file, see <b>WebDAVLib/WebDAVLib.js</b>.
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */



/**
 * Docfile（文書）オブジェクトを生成する。<br>
 * このコンストラクタを明示的に呼び出すことはない。<br>
 * <a href="WebDAVLib.Mailbox.html#listDocs">WebDAVLib.Mailbox.listDocs</a>メソッドによりこのオブジェクトの配列が取得される。<br>
 * @constructor
 * @class 文書をあらわすクラス<br>
 * @lang ja
 */
/**
 * Creates Docfile (document) instance.<br>
 * This constructor is not explicitly called.<br>
 * An array of this object is retrieved when <a href="WebDAVLib.Mailbox.html#listDocs">WebDAVLib.Mailbox.listDocs</a> method is called.<br>
 * @constructor
 * @class Class representing documents.<br>
 * @lang en
 */
 
 //Author: Miho Yamada, Fuji Xerox Co., Ltd.
WebDAVLib.Docfile = function()
{
	/**
	 *	文書属性をプロパティとして持つオブジェクト。<br>
	 *	各プロパティと文書属性の対応は以下のとおり。<br>
	 *	<b>displayname</b>&nbsp;文書の表示名<br>
	 *	<b>creationdate</b>&nbsp;文書の作成（格納）日時<br>
	 *	<b>getcontenttype</b>&nbsp;ファイル形式。"image/TIFF"(TIFF)または"image/JPEG"（JPEG）の値をとる。<br>
	 *	<b>getlastmodified</b>&nbsp;最終更新日時。文書の格納日時がセットされる。<br>
	 *	<b>ColorDepth</b>&nbsp;イメージの画素ビット数。0、1、2、4、8のいずれかの整数値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0の場合は画素ビット数が不明であることを表す。<br>
	 *	<b>ColorMode</b>&nbsp;イメージのカラーモードを示す文字列。以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Color:&nbsp;カラー<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gray:&nbsp;グレー<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mono:&nbsp;モノクロ<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;不明<br>
	 *	<b>ColorSpace</b>&nbsp;イメージの色空間を示す文字列。以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CMYK:&nbsp;CMYK<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RGB:&nbsp;RGB<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lab:&nbsp;Lab<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YCbCr:&nbsp;YCbCr<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;不明<br>
	 *	<b>Compression</b>&nbsp;イメージの圧縮方式を示す文字列。以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MH:&nbsp;MH<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MMR:&nbsp;MMR<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JPEG:&nbsp;JPEG<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JBIG:&nbsp;JBIG<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LZW:&nbsp;LZW<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AHA:&nbsp;AHA<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PACKBITS:&nbsp;PACKBITS<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Xerox Adaptive:&nbsp;Xerox Adaptive<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALLA:&nbsp;ALLA<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;None:&nbsp;無圧縮<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;不明<br>
	 *	<b>CSOrg</b>&nbsp;イメージの色空間スケールを示す文字列。以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IEC:&nbsp;IEC (International Electrotechnical Commission)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ITU:&nbsp;ITU (International Telecommunication Union) (旧CCITT)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CIE:&nbsp;CIE (Commission Internationale de l’Eclairage)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FX:&nbsp;富士ゼロックス<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;不明<br>
	 *	<b>DocStatusCode</b>&nbsp;文書格納ジョブの実行中にエラーが発生した場合のみ値を持ち、<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;発生原因を示すChain-Linkコードを示す文字列が取得される。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(例) 123-456<br>
	 *	<b>Origin</b>文書の入力種別を示す文字列。以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scanner:&nbsp;スキャン文書<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fax:&nbsp;FAX受信文書<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IFax:&nbsp;Internet Fax受信文書<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IPFax:&nbsp;IPFax受信文書<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Polling:&nbsp;親展ポーリング予約文書<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print:&nbsp;プリント蓄積文書<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;不明<br>
	 *	<b>OutputMediumSize</b>&nbsp;文書の出力用紙サイズを示す文字列。以下の値を取る場合は、原稿の向きに応じて”LEF”または”SEF”を付加した<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文字列が取得される。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(例：サイズが”ISO-A4”の場合、原稿の向きに応じて”ISO-A4SEF”または”ISO-A4LEF”が取得される)。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;それ以外は「(主走査)x(副走査)/(単位:mm、in、milのいずれか)」の形式で文字列をセットする((例)120x210/mm)。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出力用紙サイズが不明な場合は"Unknown"がセットされる。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;なお、原稿の向きを取得できない場合はSEF指定されているものとみなす。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.5x11:&nbsp;Letter<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.5x14:&nbsp;Legal<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-11x17R:&nbsp;Ledger<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A3:&nbsp;A3<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A4:&nbsp;A4<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A5:&nbsp;A5<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A6:&nbsp;A6<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-B4:&nbsp;B4(ISO)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-B5:&nbsp;B5(ISO)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JIS-B4:&nbsp;B4(JIS)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JIS-B5:&nbsp;B5(JIS)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JIS-B6:&nbsp;B6(JIS)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JP-PostCard:&nbsp;郵便はがき<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TW-8Kai:&nbsp;八開<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TW-16Kai:&nbsp;十六開<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-5.5x8.5:&nbsp;5.5x8.5inch (Invoice)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.5x13:&nbsp;8.5x13inch (Folio)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8x10:&nbsp;8x10inch (Government-Letter)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.46x12.4:&nbsp;8.46x12.4inch<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-4x6:&nbsp;4x6inch (PostCard)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UK-11x15:&nbsp;11x15inch<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-3.5x5:&nbsp;3.5x5inch (Picture L size)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-5x7:&nbsp;5x7inch (Picture 2L size)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-7.25x10.5:&nbsp;7.25x10.5inch (Executive)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FUJIXEROX-A4Cover:&nbsp;A4-Cover<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FUJIXEROX-LetterCover:&nbsp;Letter-Cover<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-3.5x5.5:&nbsp;3.5x5.5inch<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-6x9:&nbsp;6x9inch<br>
	 *	<b>Pages</b>&nbsp;文書のページ数を示す整数値。<br>
	 *	<b>PixelSize</b>&nbsp;イメージの画素数を示す文字列。フォーマットは「(X方向画素数)x(Y方向画素数)」。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(例) 100x200<br>
	 *	<b>Resolution</b>&nbsp;イメージの解像度を示す文字列。フォーマットは「(X方向解像度)x(Y方向解像度)/(単位:dpi or dpm)」。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(例) 600x600/dpi<br>
	 *	<b>FCode</b>&nbsp;FAX通信処理の際に使用したFコードを示す文字列。文書の入力元がFAXまたはIPFaxのときのみ属性が存在する。<br>
	 *	<b>LineType</b>&nbsp;FAX通信処理の回線種別を示す文字列。文書の入力元がFAXのときのみ属性が存在し、以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PBX:&nbsp;内線<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Public:&nbsp;外線<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown&nbsp;不明<br>
	 *	<b>PortNumber</b>&nbsp;FAX通信処理の回線チャネル番号を示す整数値。入力元がFAXまたはIPFaxのときのみ値を持つ。<br>
	 *	<b>SenderName</b>&nbsp;入力元がFAXまたはIPFaxのときは通信処理の相手局名称、入力元がInternet Faxのときは送信者のEメールアドレス<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;を示す文字列。入力元がFAX、Internet Fax、IPFaxのいずれかのときのみ属性が存在する。<br>
	 *	<b>SenderIdentifier</b>&nbsp;FAX通信処理のリモートID(通常は相手局電話番号)を示す文字列。入力元がFAXまたはIPFaxのときのみ属性が存在する。<br>
	 *	<b>TransmissionMode</b>&nbsp;FAX通信処理のプロトコル種別を示す文字列。入力元がFAXまたはIPFaxのときのみ属性が存在し、以下の値を取る。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G3/Auto:&nbsp;G3自動<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G4/Auto:&nbsp;G4自動<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G3/International:&nbsp;G3国際通信<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G3:&nbsp;G3<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SuperG3:&nbsp;SuperG3<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;不明&nbsp;<br>
	 *	<b>SenderPhoneNumber</b>&nbsp;FAX通信処理の発信者番号通知情報を示す文字列。入力元がFAXまたはIPFaxのときで、<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;かつNTTのナンバーディスプレイを契約している場合のみ値を持つ。<br>
	 *	<b>DialInNumber</b>&nbsp;FAX通信処理のダイレクト・ダイアル・イン情報を示す文字列。入力元がFAXまたはIPFaxのときのみ値を持つ。<br>
	 *	<b>FaxInfo</b>&nbsp;FAX通信処理の優先順位付きファクシミリ情報を示す文字列。<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入力元がFAXまたはIPFaxのときのみ属性が存在し、デバイスの設定に応じて<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FCode、SenderIdentifier、SenderName、SenderPhoneNumber、DialInNumberのうちのいずれかの属性の値を取る<br>
	 *	<b>identifier</b>&nbsp;文書IDを示す文字列<br>
	 *	<b>path</b>&nbsp;文書のパスを示す文字列<br>
	 *	<b>boxID</b>&nbsp;文書が格納されている親展ボックスのIDを示す文字列<br>
	 *	@type Object
	 *	@default なし
	 * @lang ja
	 */
	/**
	 *	Object with document properties as attributes.<br>
	 *	Document attribute / prop property correspondence is as follows:<br>
	 *	<b>displayname</b> Name to display for document<br>
	 *	<b>creationdate</b> Date/time document was created (stored)<br>
	 *	<b>getcontenttype</b> File format. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image/TIFF:&nbsp;TIFF<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image/JPEG:&nbsp;JPEG<br>
	 *	<b>getlastmodified</b>&nbsp;Date/time document was last modified (stored). <br>
	 *	<b>ColorDepth</b>&nbsp;Image bpp. Integer value of 0, 1, 2, 4, or 8; 0 indicating that bpp is unknown.<br>
	 *	<b>ColorMode</b>&nbsp;String representing image color mode. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Color:&nbsp;Full Color<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gray:&nbsp;Grayscale<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mono:&nbsp;Black & White<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown<br>
	 *	<b>ColorSpace</b>&nbsp;String representing image color space. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CMYK:&nbsp;CMYK<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RGB:&nbsp;RGB<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lab:&nbsp;Lab<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YCbCr:&nbsp;YCbCr<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown<br>
	 *	<b>Compression</b>&nbsp;String representing image compression method. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MH:&nbsp;MH<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MMR:&nbsp;MMR<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JPEG:&nbsp;JPEG<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JBIG:&nbsp;JBIG<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LZW:&nbsp;LZW<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AHA:&nbsp;AHA<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PACKBITS:&nbsp;PACKBITS<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Xerox Adaptive:&nbsp;Xerox Adaptive<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ALLA:&nbsp;ALLA<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;None:&nbsp;No compression<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown<br>
	 *	<b>CSOrg</b>&nbsp;String representing image color space scale. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IEC:&nbsp;IEC(International Electrotechnical Commission)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ITU:&nbsp;ITU (International Telecommunication Union) (formerly CCITT)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CIE:&nbsp;CIE (Commission Internationale de l’Eclairage)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FX:&nbsp;Fuji Xerox<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown<br>
	 *	<b>DocStatusCode</b>&nbsp;This property set only when error occurs upon storage of relevant document.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Value is string representing Chain-Link code of error.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EXAMPLE: 123-456<br>
	 *	<b>Origin</b>&nbsp;String representing document origin (method of storage). Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scanner:&nbsp;Document scanned to Folder<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fax:&nbsp;Document received by Fax<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IFax:&nbsp;Document received by Internet Fax<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IPFax:&nbsp;Document received by IPFax<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Polling:&nbsp;Document for Mailbox polling！！<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print:&nbsp;Document printed to Mailbox<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown<br>
	 *	<b>OutputMediumSize</b>&nbsp;String representing document output size, with "LEF" or "SEF" appended, according to original orientation.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(e.g. if size is "ISO-A4", value may be set to "ISO-A4SEF" or "ISO-A4LEF," depending on <br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;original orientation),<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Otherwise, string value of following format is set:<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"(<i>Length in fast scan direction</i>)x(<i>Length in slow scan direction</i>)/(<i>unit</i>: mm, in, or mil)"<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If document orientation cannot be retrieved, it is assumed that the original document was SEF.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If output size is unknown, value is set to "Unknown."<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.5x11:&nbsp;Letter<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.5x14:&nbsp;Legal<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-11x17R:&nbsp;Ledger<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A3:&nbsp;A3<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A4:&nbsp;A4<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A5:&nbsp;A5<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-A6:&nbsp;A6<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-B4:&nbsp;B4(ISO)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISO-B5:&nbsp;B5(ISO)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JIS-B4:&nbsp;B4(JIS)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JIS-B5:&nbsp;B5(JIS)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JIS-B6:&nbsp;B6(JIS)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JP-PostCard:&nbsp;Japanese Postcard<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TW-8Kai:&nbsp;8K<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TW-16Kai:&nbsp;16K<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-5.5x8.5:&nbsp;5.5x8.5inch (Invoice)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.5x13:&nbsp;8.5x13inch (Folio)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8x10:&nbsp;8x10inch (Government-Letter)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-8.46x12.4:&nbsp;8.46x12.4inch<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-4x6:&nbsp;4x6inch (PostCard)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UK-11x15:&nbsp;11x15inch<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-3.5x5:&nbsp;3.5x5inch (Picture L size)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-5x7:&nbsp;5x7inch (Picture 2L size)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-7.25x10.5:&nbsp;7.25x10.5inch (Executive)<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FUJIXEROX-A4Cover:&nbsp;A4-Cover<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FUJIXEROX-LetterCover:&nbsp;Letter-Cover<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-3.5x5.5:&nbsp;3.5x5.5inch<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA-6x9:&nbsp;6x9inch<br>
	 *	<b>Pages</b>&nbsp;Integer representing number of pages in document.<br>
	 *	<b>PixelSize</b>&nbsp;String representing pixels in image. Format is "(<i>Pixels in X direction</i>)x(<i>Pixels in Y direction</i>).<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EXAMPLE: 100x200<br>
	 *	<b>Resolution</b>&nbsp;String representing image resolution. Format is "(<i>Resolution in X direction</i>)x(<i>Resolution in Y direction</i>)/(<i>unit</i>: dpi or dpm).<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EXAMPLE: 600x600/dpi<br>
	 *	<b>FCode</b>&nbsp;String representing FCode for Fax communication. This property present only for documents received by Fax or IPFax.<br>
	 *	<b>LineType</b>&nbsp;Line type in Fax communication. This property present only for documents received by Fax. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PBX:&nbsp;PBX<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Public:&nbsp;Public line<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown&nbsp;<br>
	 *	<b>PortNumber</b>&nbsp;Integer representing Fax communication line channel number. <br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax or IPFax.<br>
	 *	<b>SenderName</b>&nbsp;Value is string representing sender name in for documents received by Fax or IPFax; <br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for documents received by Internet Fax, string representing email address is set as value.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax, IPFax, or Internet Fax.<br>
	 *	<b>SenderIdentifier</b>&nbsp;String representing remote ID of Fax communication (usually sender phone number). <br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax or IPFax.<br>
	 *	<b>TransmissionMode</b>&nbsp;String representing Fax communication protocol. <br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax or IPFax. Values are as follows.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G3/Auto:&nbsp;G3 Auto<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G4/Auto:&nbsp;G4 Auto<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G3/International:&nbsp;G3 international communication<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G3:&nbsp;G3<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SuperG3:&nbsp;SuperG3<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unknown:&nbsp;Unknown&nbsp;<br>
	 *	<b>SenderPhoneNumber</b>&nbsp;String representing Fax communication sencer phone number.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax or IPFax. <br>
	 *	<b>DialInNumber</b>&nbsp;String representing direct dial in information of Fax communication.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax or IPFax.<br>
	 *	<b>FaxInfo</b>&nbsp;String representing direct dial in information of Fax communication, with preset priority.<br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This property present only for documents received by Fax or IPFax. <br>
	 *	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FCode, SenderIdentifier, SenderName, SenderPhoneNumber, or DialInNumber value is set, depending on device settings.<br>
	 *	<b>identifier</b>&nbsp;String representing document ID.<br>
	 *	<b>path</b>&nbsp;String representing document path.<br>
	 *	<b>boxID</b>&nbsp;String representing Folder ID of folder in which document is stored.<br>
	 *	@type Object
	 *	@default None.
	 *	@lang en
	 */
	this.prop = new Object();
};




/**
 * 文書の指定したページのサムネール画像（JPEG）のバイナリを取得する。<br>
 * ページ(引数page)が指定されていない場合は1ページ目のサムネールを取得する。<br>
 * 文書オブジェクト（<a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a>オブジェクト）には、自身のWebDAVパスが<br>
 * （propオブジェクトpathプロパティに）設定されていることが前提となる。（設定されていない場合falseを返す。）<br>
 * 処理が完了すると、コールバック関数として<a href="WebDAVLib.html">WebDAVLib</a>のイベントハンドラを実行する。<br>
 * (ContentsLibを利用する場合には、ContentsLibに登録したイベントハンドラに通知される。)<br>
 * イベントハンドラは以下の形式となる。<br>
 * function("WDgetThumbnail", <i>result</i>, <i>obj</i>)<br>
 * 上記"WDgetThumbnail"は本メソッドが返すイベント名である。<br>
 * 処理に成功した場合は<i>result</i>にtrue、<i>obj</i>に取得されたサムネールのJPEG画像（バイナリ）がセットされる。<br>
 * 処理に失敗した場合は<i>result</i>にfalse、<i>obj</i>には、通信が失敗した場合はHTTPステータスコードが、<br>
 * 通信は成功したがレスポンスが不正であった場合はnullがセットされる。<br>
 * user/passに設定すべき値は、別紙WebDAV外部仕様書を参照のこと。<br>
 * @param {int} page 取得するサムネールのページ番号を指定する
 * @param {String} user 親展ボックスにアクセスするユーザのユーザ名
 * @param {String} pass 親展ボックスにアクセスするユーザのパスワード
 * @return {Bool}
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves thumbnail image (JPEG) of specified page of document.<br>
 * If page (argument page) is not specified, thumbnail of 1st page of document is retrieved.<br>
 * <a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a> object must have WebDAV path set to its<br>
 * prop object (i.e. path property of prop object. If path is not set, method returns false).<br>
 * When processing is complete, event handler for <a href="WebDAVLib.html">WebDAVLib</a> is run as callback.<br>
 * (When using ContentsLib, event is notified to ContentsLib event handler.)<br>
 * Event handler format and arguments are as follows.<br>
 * function("WDgetThumbnail", <i>result</i>, <i>obj</i>)<br>
 * "WDgetThumbnail" is event ID for this method.<br>
 * If processing is successful, true is set to <i>result</i>, and JPEG thumbnail image binary is set to <i>obj</i>.<br>
 * If processing fails, false is set to <i>result</i>. HTTP status code is set to <i>obj</i> if error occurs in communication, <br>
 * and null is set to <i>obj</i> if communication is successful but response is corrupt.
 * See WebDAV I/F external specifications for values to set for user/pass.<br>
 * @param {int} page Page number of document for which to retrieve thumbnail
 * @param {String} user String representing user name for Folder access
 * @param {String} pass String representing password for Folder access
 * @return {bool}
 * @addon
 * @static
 * @lang en
 */
 
  //Author: Miho Yamada, Fuji Xerox Co., Ltd.
WebDAVLib.Docfile.prototype.getThumbnail = function(page, user, pass)
{	
	if(!this.prop.path){return false;}
	var _page = 1;	//1st page thumbnail retrieved by default
	if(page){_page = page;}
	var docpath = this.prop.path;
	//Deduce docID from path
	var docIdStart = docpath.lastIndexOf("/");
	var docIdEnd = docpath.lastIndexOf(".");
	this.prop.identifier = docpath.substring(docIdStart+1, docIdEnd);
	var op_path = docpath.substr(0,docpath.length-4)+"/thumbnail/"+this.prop.identifier+"-"+_page+".jpg";
	var _ws = new WebServiceLib.Communicator();
	if(user || pass)
	{
		_ws.user = user;
		_ws.password = pass;
	}
	_ws.method = "GET";
	_ws.headers[0] = "X-Singlepage";
	_ws.headers[1] = "Thumbnail";	
	_ws.headers[2] = "Content-Type";
	_ws.headers[3] = "text/xml; charset=utf-8";	
	_ws.headers[4] = "X-Printdocument";
	_ws.headers[5] = "On";	
	_ws.errorHandler = this.getThumbnail.errorCb;
	_ws.successHandler = this.getThumbnail.successCb;
	_ws.send(op_path);
	return true;
};

WebDAVLib.Docfile.prototype.getThumbnail.successCb = function(requester)
{
	//Prepare var for thumbnail binary and boolean result to return
	var thumbnailBin = null;
	var _result = false;
	if(!requester.responseXML) {
		WebDAVLib.onEvent("WDgetThumbnail", _result, thumbnailBin);
		return;
	}
	thumbNailBin = requester.responseBody;
	_result = true;
	//Run event listener function
	WebDAVLib.onEvent("WDgetThumbnail", _result, thumbNailBin);
	return;
};
	

/**
 * @private
 */
WebDAVLib.Docfile.prototype.getThumbnail.errorCb = function(requester)
{
	var _status = requester.status;
	var _result = false;
	WebDAVLib.onEvent("WDgetThumbnail", _result, _status);
	return;
};

/**
 * 文書情報を取得する。
 * 文書オブジェクト（<a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a>オブジェクト）には、自身のWebDAVパスが<br>
 * （propオブジェクトpathプロパティに）設定されていることが前提となる。（設定されていないとfalseを返す。）<br>
 * 処理が完了すると、コールバック関数として<a href="WebDAVLib.html">WebDAVLib</a>のイベントハンドラを実行する。<br>
 * (ContentsLibを利用する場合には、ContentsLibに登録したイベントハンドラに通知される。)<br>
 * イベントハンドラは以下の形式となる。<br>
 * function("WDgetProperties", <i>result</i>, <i>obj</i>)<br>
 * 上記"WDgetProperties"は本メソッドが返すイベント名である。<br>
 * 処理に成功した場合は<i>result</i>にtrue、<i>obj</i>に文書の情報を含むpropオブジェクトがセットされる。<br>
 * propオブジェクトのプロパティと文書属性の対応については<a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a>の項を参照。<br>
 * 処理に失敗した場合は<i>result</i>にfalse、<i>obj</i>には、通信が失敗した場合はHTTPステータスコードが、<br>
 * 通信は成功したがレスポンスが不正であった場合はnullがセットされる。<br>
 * user/passに設定すべき値は、別紙WebDAV外部仕様書を参照のこと。<br>
 * @param {String} user 文書にアクセスするユーザのユーザ名
 * @param {String} pass 文書にアクセスするユーザのパスワード
 * @return {Bool}
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves <a href="WebDavLib.Docfile.html#">WebDavLib.Docfile</a> properties as prop object.<br>
 * <a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a> object must have WebDAV path set to its<br>
 * prop object (i.e. path property of prop object. If path is not set, method returns false).<br>
 * When processing is complete, event handler for <a href="WebDAVLib.html">WebDAVLib</a> is run as callback.<br>
 * (When using ContentsLib, event is notified to ContentsLib event handler.)<br>
 * Event handler format and arguments are as follows.<br>
 * function("WDgetProperties", <i>result</i>, <i>obj</i>)<br>
 * "WDgetProperties" is event ID for this method.<br>
 * If processing is successful, true is set to <i>result</i>, and prop object with document atttributes is set to <i>obj</i>.<br>
 * See specification on <a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a> for information on 
 * correspondence between prop object properties and document attributes.<br>
 * If processing fails, false is set to <i>result</i>. HTTP status code is set to <i>obj</i> if error occurs in communication, <br>
 * and null is set to <i>obj</i> if communication is successful but response is corrupt.
 * See WebDAV I/F external specifications for values to set for user/pass.<br>
 * @param {String} user String representing user name for Document access
 * @param {String} pass String representing password for Document access
 * @return {Bool}
 * @addon
 * @static
 * @lang en
 */
  //Author: Miho Yamada, Fuji Xerox Co., Ltd.
WebDAVLib.Docfile.prototype.getProperties = function(user, pass)
{	
	//if(!this.prop.path){return false;}
	var docpath = this.prop.path;
	//Retrieve properties 
	var msg = '<?xml version="1.0" encoding="utf-8" ?><D:propfind xmlns:D="DAV:"><D:prop><D:allprop/></D:prop></D:propfind>';
	var _ws = new WebServiceLib.Communicator();
	if(user || pass)
	{
		_ws.user = user;
		_ws.password = pass;
	}
	_ws.method = "PROPFIND";
	_ws.headers[0] = "Depth";
	_ws.headers[1] = "1";	
	_ws.headers[2] = "Content-Length";
	_ws.headers[3] = "100";	
	_ws.headers[4] = "X-Printdocument";
	_ws.headers[5] = "On";	
	_ws.errorHandler = this.getProperties.errorCb;
	_ws.successHandler = this.getProperties.successCb;
	_ws.send(docpath, msg);
	return true;
	
};

WebDAVLib.Docfile.prototype.getProperties.successCb = function(requester)
{
	//Prepare object and boolean result to return
	var _propElem = null;
	var _result = false;
	if(!requester.responseXML) {
		WebDAVLib.onEvent("WDgetProperties", _result, _propElem);
		return;
	}
	var _resNodes = requester.responseXML.getElementsByTagNameNS("DAV:", "response");
	//Only one response element should be retrieved
	var _propElem = _resNodes[0];
	var _propObj = XMLLib.childNodeToProperty(_propElem).propstat.prop;
	_result = true;
	//Run event listener function
	WebDAVLib.onEvent("WDgetProperties", _result, _propObj);
	return;

};
	

/**
 * @private
 */
WebDAVLib.Docfile.prototype.getProperties.errorCb = function(requester)
{
	var _status = requester.status;
	var _result = false;
	WebDAVLib.onEvent("WDgetProperties", _result, _status);
	return;
};

/**
 * 文書を削除する。<br>
  * 文書オブジェクト（<a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a>オブジェクト）には、自身のWebDAVパスが<br>
 * （propオブジェクトpathプロパティに）設定されていることが前提となる。（設定されていない場合falseを返す。）<br>
 * 処理が完了すると、コールバック関数として<a href="WebDAVLib.html">WebDAVLib</a>のイベントハンドラを実行する。<br>
 * (ContentsLibを利用する場合には、ContentsLibに登録したイベントハンドラに通知される。)<br>
 * イベントハンドラは以下の形式となる。<br>
 * function("WDdeleteDocument", <i>result</i>, <i>obj</i>)<br>
 * 上記"WDdeleteDocument"は本メソッドが返すイベント名である。<br>
 * 処理に成功した場合は<i>result</i>にtrue、<i>obj</i>にnullがセットされる。<br>
 * 処理に失敗した場合は<i>result</i>にfalse、<i>obj</i>には、通信が失敗した場合はHTTPステータスコードが、<br>
 * 通信は成功したがレスポンスが不正であった場合はnullがセットされる。<br>
 * user/passに設定すべき値は、別紙WebDAV外部仕様書を参照のこと。<br>
 * @param {String} user 文書にアクセスするユーザのユーザ名
 * @param {String} pass 文書ボックスにアクセスするユーザのユーザ名
 * @return {Bool}
 * @static
 * @lang ja
 */
/**
 * Deletes document.<br>
 * <a href="WebDAVLib.Docfile.html#">WebDAVLib.Docfile</a> object must have WebDAV path set to its<br>
 * prop object (i.e. path property of prop object. If path is not set, method returns false).<br>
 * When processing is complete, event handler for <a href="WebDAVLib.html">WebDAVLib</a> is run as callback.<br>
 * (When using ContentsLib, event is notified to ContentsLib event handler.)<br>
 * Event handler format and arguments are as follows.<br>
 * function("WDdeleteDocument", <i>result</i>, <i>obj</i>)<br>
 * "WDdeleteDocument" is event ID for this method.<br>
 * If processing is successful, true is set to <i>result</i>, and null is set to <i>obj</i>.<br>
 * If processing fails, false is set to <i>result</i>. HTTP status code is set to <i>obj</i> if error occurs in communication, <br>
 * and null is set to <i>obj</i> if communication is successful but response is corrupt.
 * See WebDAV I/F external specifications for values to set for user/pass.<br>
 * @param {String} user String representing user name for Document access
 * @param {String} pass String representing password for Document access
 * @addon
 * @return {Bool}
 * @static
 * @lang en
 */
WebDAVLib.Docfile.prototype.deleteDoc = function(user,pass)
{
	if(!this.prop.path){return false;}
	var op_path = this.prop.path;
	var _ws = new WebServiceLib.Communicator();
	if(user || pass)
	{
		_ws.user = user;
		_ws.password = pass;
	}
	_ws.method = "DELETE";
	_ws.headers[0] = "Content-Type";
	_ws.headers[1] = "text/xml; charset=utf-8";	
	_ws.headers[2] = "Content-Length";
	_ws.headers[3] = "100";	
	_ws.headers[4] = "X-Printdocument";
	_ws.headers[5] = "On";	
	_ws.errorHandler = WebDAVLib.Docfile.prototype.deleteDoc.errorCb;
	_ws.successHandler = WebDAVLib.Docfile.prototype.deleteDoc.successCb;
	_ws.send(op_path);
	return true;
};

/**
 * @private
 */
WebDAVLib.Docfile.prototype.deleteDoc.successCb = function(requester)
{
	var _result = false;
	if(!requester.responseXML) {
		WebDAVLib.onEvent("WDdeleteDocument", _result, null);
		return;
	}
	_result = true;
	//Run event listener function
	WebDAVLib.onEvent("WDdeleteDocument", _result, null);
	return;
};
	

/**
 * @private
 */
WebDAVLib.Docfile.prototype.deleteDoc.errorCb = function(requester)
{
	var _status = requester.status;
	var _result = false;
	WebDAVLib.onEvent("WDdeleteDocument", _result, _status);
	return;
};
