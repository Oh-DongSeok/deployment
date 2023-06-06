/**
 * Price Request(JetWork용)
 * @constructor
 * @extends XMLLib.SOAPMsg
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates CardInfo instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
 SSMILib.PriceJetWorksInfo = function()
 {
     this.cmd = "pay";
     this.jobType 	= "";
     this.totalAmount = 0;
     this.totalPages = 1;
     this.color = false;
     this.paperSize = "A4";
 
 };
 /**
  * @private
  */
 Extend(SSMILib.PriceJetWorksInfo.prototype, XMLLib.SOAPMsg.prototype);
 
 /**
  * @private
  */
 SSMILib.PriceJetWorksInfo.prototype.createMsg = function()
 {
     var xml = new XMLLib.XMLSOAP();
     var root = xml.createSOAPEnvelope();
     var env = root;
     var body = xml.body;
     xml.nss.nss = [];//namespace초기화
 
     var soapNS="http://schemas.xmlsoap.org/soap/envelope/";
     var webNS = "http://webservice.card.mfd.anyguard.kor.fujixerox.com/";
 
     xml.addNSPrefix(soapNS, "soapenv");
     xml.addNSPrefix(webNS, "web");
 
     var sdNode = xml.createElement("web:" + this.type );
 
     xml.addNSDeclaration(soapNS, root, true);
     xml.addNSDeclaration(webNS, root, true);
 
     var itNode = xml.createElement("header");
     itNode.appendChild(xml.createTextNode(this.header));
     sdNode.appendChild(itNode);
 
     itNode = xml.createElement("cmd");
     itNode.appendChild(xml.createTextNode(this.userPw));
     sdNode.appendChild(itNode);
 
     itNode = xml.createElement("jobType");
     itNode.appendChild(xml.createTextNode(this.userPw));
     sdNode.appendChild(itNode);
 
     itNode = xml.createElement("totalAmount");
     itNode.appendChild(xml.createTextNode(this.userPw));
     sdNode.appendChild(itNode);
 
     itNode = xml.createElement("totalPages");
     itNode.appendChild(xml.createTextNode(this.userPw));
     sdNode.appendChild(itNode);
 
     itNode = xml.createElement("color");
     itNode.appendChild(xml.createTextNode(this.userPw));
     sdNode.appendChild(itNode);
 
     itNode = xml.createElement("paperSize");
     itNode.appendChild(xml.createTextNode(this.userPw));
     sdNode.appendChild(itNode);
 
     body.appendChild(sdNode);
     env.appendChild(body);
 
     var soapMsg = xml.rootElement;
     return soapMsg;
 };
 
 /**
  * ボックス文書の情報を取得する<br>
  * 取得に成功すると、文書の情報をプロパティとしてもつオブジェクトが配列で返る。
  * プロパティ詳細については「01-01 SESAMi Service Management Interface Specification.doc」を参照
  * @param	{SSMILib.CardInfo}	sdObj	文書取得用のオブジェクトを指定する
  * @param	{Int}	timeout		通信のタイムアウト値を指定する
  * @addon
  * @static
  * @lang ja
  */
 /**
  * Retrieves Mailbox document information.<br>
  * If retrieval is successful, object with document information as properties is returned.
  * See "01-01 SESAMi Service Management Interface Specification.doc" for document attribute details.
  * @param	{SSMILib.CardInfo}	sdObj	Object for retrieving document information
  * @param	{Int}	timeout		Communication timeout
  * @addon
  * @static
  * @lang en
  */
 SSMILib.PriceJetWorksRequest = function(sdObj, timeout, remoteHost, type)//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
 {
     //SmartUI 2.0 Enhance 2015.05 Start
     //var url = glbConfig.remoteHost + "RegisterCard";
     //var url = remoteHost + "stech/xerox/xeroxPayment";//2017.11 KIS [v1.5] SmartUI 복수의 Print Server 대응 refs #4502
     //var url = remoteHost + "GetUsagePrnCnt";
     var url = remoteHost;
     //var data = JSON.stringify(sdObj);
     var data = sdObj;
     var req = createXMLHttpRequest();
 
     req.open("POST", url, true);
     if(timeout){
         req.timeout = timeout;
         req.ontimeout = SSMILib.PriceJetWorksInfo.gsdErrorCb;
     }
     req.setRequestHeader("Content-Type", "application/json");
     req.send(data);
     req.onreadystatechange = function(){
         if(this.readyState === 4){
             if(this.status === 200){
                 var resObj = JSON.parse(req.responseText);
                 if(resObj && typeof resObj.payment.result != "undefined"){
                     SSMILib.onEvent("PriceRequest", true, resObj);
                 }else{
                     SSMILib.PriceJetWorksInfo.gsdErrorCb();
                 }
             }else{
                 SSMILib.PriceJetWorksInfo.gsdErrorCb();
             }
         }
     };
     //SmartUI 2.0 Enhance 2015.05 End
 };
 
 /**
  * @private
  */
 SSMILib.PriceJetWorksInfo.gsdSuccessCb = function(res)
 {
     KISUtil.debug("PriceInfo/gsdSuccessCb", res.responseText);
     var resObj = null;
     var _result = false;
 
     if(!res.responseXML) {
         SSMILib.onEvent("PriceRequest", _result, null);
         return;
     }
 
     var _gsdrNode = res.responseXML.getElementsByTagName("return");
         //_gsdrNode : RegisterCardResult
     if(_gsdrNode.length && _gsdrNode[0].hasChildNodes()){
         resObj = Common.xmlToJson(_gsdrNode[0]);
         _result = true;
     }
 
     SSMILib.onEvent("PriceRequest", _result, resObj);
 };
 
 
 /**
  * @private
  */
 SSMILib.PriceJetWorksInfo.gsdErrorCb = function()
 {
     SSMILib.onEvent("PriceRequest", false, null);
 };
 