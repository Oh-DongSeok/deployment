/**
 * Get Billing Policy(과금 테이블 수신용)
 * @constructor
 * @extends XMLLib.SOAPMsg
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * @private
 */
 SSMILib.GetBillingPolicy = function(timeout, remoteHost, groupId)
 {
	var url = "";
	if(groupId == null){
		url = remoteHost + "api/interface/settings/BillingPolicy";
	}else{
		url = remoteHost + "api/interface/settings/BillingPolicy/" + groupId;
	}
 	var req = createXMLHttpRequest();

 	req.open("GET", url, true);
 	if(timeout){
 		req.timeout = timeout;
		req.ontimeout = SSMILib.GetBillingPolicy.gsdErrorCb;
 	}
 	req.setRequestHeader("Content-Type", "application/json");
 	req.send();
 	req.onreadystatechange = function(){
         if(this.readyState === 4){
         	if(this.status === 200){
         		var resObj = JSON.parse(req.responseText);
         		if(resObj && typeof resObj.status != "undefined"){
         			SSMILib.onEvent("BillingPolicy", true, resObj);
         		}else{
					SSMILib.onEvent("BillingPolicy", false, null);
         		}
 	        }else{
				SSMILib.onEvent("BillingPolicy", false, null);
 	        }
         }
     };
 	//SmartUI 2.0 Enhance 2015.05 End
 };

 SSMILib.GetBillingPolicy.gsdErrorCb = function()
{
	SSMILib.onEvent("BillingPolicy", false, null);
};
