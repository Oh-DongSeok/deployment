/**
 * Get Print Information (OTID기준 프린트 목록 불러오기 라이브러리)
 * @constructor
 * @extends XMLLib.SOAPMsg
 * [GET] /api/interface/PrintInformation/OTID/{otid}
 * @lang ja
 */
/**
 * @private
 */
 SSMILib.GetPrintInformation = function(timeout, remoteHost, userId)
 {
 	var url = remoteHost + "api/interface/PrintInformation/OTID/" + userId;
 	var req = createXMLHttpRequest();

 	req.open("GET", url, true);
 	if(timeout){
 		req.timeout = timeout;
 		req.ontimeout = SSMILib.GetPrintInformation.gsdErrorCb;
 	}
 	req.setRequestHeader("Content-Type", "application/json");
 	req.send();
 	req.onreadystatechange = function(){
         if(this.readyState === 4){
         	if(this.status === 200){
         		var resObj = JSON.parse(req.responseText);
         		if(resObj && typeof resObj.status != "undefined"){
         			SSMILib.onEvent("PrintInformation", true, resObj);
         		}else{
					SSMILib.onEvent("PrintInformation", false, null);
         		}
 	        }else{
				SSMILib.onEvent("PrintInformation", false, null);
 	        }
         }
     };
 };

SSMILib.GetPrintInformation.gsdErrorCb = function()
{
	SSMILib.onEvent("GetPrintInformation", false, null);
};