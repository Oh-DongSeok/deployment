/**
 * Get Registed Device Inforamtion(서버 등록 장비정보 수신용)
 * @constructor
 * @extends XMLLib.SOAPMsg
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * @private
 */
 SSMILib.GetRegiDeviceInfo = function(timeout, remoteHost)
 {
 	//SmartUI 2.0 Enhance 2015.05 Start
 	//var url = glbConfig.remoteHost + "GetUsagePrnCnt";
 	var url = remoteHost + "api/interface/settings/Devices/DeviceId";
 	var req = createXMLHttpRequest();

 	req.open("GET", url, true);
 	if(timeout){
 		req.timeout = timeout;
 		req.ontimeout = SSMILib.GetRegiDeviceInfo.gsdErrorCb;
 	}
 	req.setRequestHeader("Content-Type", "application/json");
 	req.send();
 	req.onreadystatechange = function(){
         if(this.readyState === 4){
         	if(this.status === 200){
         		var resObj = JSON.parse(req.responseText);
         		if(resObj && typeof resObj.status != "undefined"){
         			SSMILib.onEvent("RegiDeviceInfo", true, resObj);
         		}else{
					SSMILib.onEvent("RegiDeviceInfo", false, null);
         		}
 	        }else{
				SSMILib.onEvent("RegiDeviceInfo", false, null);
 	        }
         }
     };
 	//SmartUI 2.0 Enhance 2015.05 End
 };

 SSMILib.GetRegiDeviceInfo.gsdErrorCb = function()
{
	SSMILib.onEvent("RegiDeviceInfo", false, null);
};