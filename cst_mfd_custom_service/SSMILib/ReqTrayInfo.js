/**
 * Request Tray Information (Tray Empty발생 알림)
 * @constructor
 * @extends XMLLib.SOAPMsg
 * [GET] /api/interface/PrintInformation/OTID/{otid}
 * @lang ja
 */
/**
 * @private
 */
 SSMILib.ReqTrayInfo = function(timeout, remoteHost)
 {
 	var url = remoteHost + "api/interface/settings/Email/Send";
 	var req = createXMLHttpRequest();

 	req.open("GET", url, true);
 	if(timeout){
 		req.timeout = timeout;
 		req.ontimeout = SSMILib.ReqTrayInfo.gsdErrorCb;
 	}
 	req.setRequestHeader("Content-Type", "application/json");
 	req.send();
 	req.onreadystatechange = function(){
         if(this.readyState === 4){
         	if(this.status === 200){
         		var resObj = JSON.parse(req.responseText);
         		if(resObj && typeof resObj.status != "undefined"){
         			SSMILib.onEvent("ReqTrayInfoEmail", true, resObj);
         		}else{
					SSMILib.ReqTrayInfo.gsdErrorCb();
         		}
 	        }else{
				SSMILib.ReqTrayInfo.gsdErrorCb();
 	        }
         }
     };
 };

 SSMILib.ReqTrayInfo.gsdErrorCb = function()
 {
	SSMILib.onEvent("ReqTrayInfoEmail", false, null);
 };