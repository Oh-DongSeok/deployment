/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/黄色）
 */
 var ChargeInfoPopup = new TemplatePage();

 ChargeInfoPopup.ID = "pop_chargeInfoPopup";

 //ChargeInfoPopup.isGetChargeInfo = false;
 //ChargeInfoPopup.isCardLogIn = false;

 /**
  * 개별 페이지의 Data정의
  */
 ChargeInfoPopup._initModel=function()
 {
     this._data = {
         buttonList:[
             {id:"btn_confirm", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_confirm",offImg: Img.BTN_NOR_OFF,onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}},
             {id:"btn_DP_CP_cancel", type:WidgetLib.ButtonType.NORMAL,status:{enable:true}, attr:{targetImgId:"img_DP_CP_cancel",offImg: Img.BTN_NOR_OFF,onImg:Img.BTN_NOR_ON, pressImg: Img.BTN_NOR_PRESS, disableImg: Img.BTN_NOR_DIS}}
         ],
         imageList:[],
         textList:[
                 {id:"tit_CP_joblist", text:Msg.ChargeInfoPopup.joblist},
                 {id:"tit_CP_totalPrice", text:Msg.ChargeInfoPopup.totalPrice},
                 {id:"lbl_confirm",text:Msg.ChargeInfoPopup.btnConfirm},
                 {id:"lbl_DP_CP_cancel",text:Msg.ChargeInfoPopup.btnCancel},
                 {id:"txt_CP_outSize",text:Msg.ChargeInfoPopup.outSize},
                 {id:"txt_CP_outDuplex",text:Msg.ChargeInfoPopup.outDuplex},
                 {id:"txt_CP_outPages",text:Msg.ChargeInfoPopup.outPages},
                 {id:"txt_CP_outCopies",text:Msg.ChargeInfoPopup.outCopies},
                 {id:"txt_CP_msg0",text:Msg.ChargeInfoPopup.msg1},
                 {id:"txt_CP_msg1",text:Msg.ChargeInfoPopup.msg2}
         ]

     };
 };

 //Css 보정 (TODO 이후 언어별 css파일로 관리필요)
 ChargeInfoPopup.cssChange = function()
 {
    var obj = document.getElementById(ChargeInfoPopup.ID);
	obj.style.height = glbInfo.pageHeight.toString() + "px";
    switch(glbInfo.lang){
        case "ja":
            Common.setPosition("lbl_DP_confirm", "top", "5px");//2016.05.25 chone 다언어대응
            document.getElementById("lbl_DP_confirm").style.lineHeight = '25px';//2016.05.25 chone 다언어대응
            Common.setPosition("tit_CP_totalPrice","width","140px");//2016.05.25 chone 다언어대응
            break;
        case "en":
            Common.setPosition("lbl_DP_confirm", "top", "6px");//2016.05.25 chone 다언어대응
            document.getElementById("lbl_DP_confirm").style.lineHeight = '25px';//2016.05.25 chone 다언어대응
            break;
        case "ko":
            Common.setPosition("tit_CP_joblist","width","180px");
            break;
        default:
            break;
    }
    if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
       Common.setPosition("pop_chargeInfoPopup","width","1024px");
       Common.setPosition("lyr_CP_wrapper", "left", "112px");
    }
 }

 ChargeInfoPopup._onPageChange = function(){
    KISUtil.debug("ChargeInfoPopup.sendRequest:","excute");
    switch(jobSelecter){
        case JOB_TYPE.PRINT:
            Common.changeVisibility("txt_CP_outSize", "none");
            Common.changeVisibility("txt_CP_outDuplex", "none");
            Common.changeVisibility("txt_CP_outPages", "none");
            Common.changeVisibility("txt_CP_outCopies", "none");
            Common.changeVisibility("txt_CP_colorMode", "none");
            var _lst = FileListPage.docListManager.getCheckedItems();
     	    var info = this._dataSet.priceInfo;
     	    var lst = [
         	    {id:"lbl_CP_joblist", text:glbDataSet.printSelectedCnt.toString() +" "+Msg.UNIT.COUNT},
         	    {id:"lbl_CP_totalPrice", text:formatWithRemainders(glbDataSet.priceInfo.totalPrice)+" "+Msg.UNIT.WON}];
     	    var obj;
     	    for (var i = 0, il = lst.length; i < il; i++) {
         	    obj = lst[i];
         	    Common.setText(obj.id, obj.text);
         	    if (obj.className) {
             	    var ele = document.getElementById(obj.id);
             	    if (ele)
                 	    ele.className = obj.className;
         	    }
     	    }
            break;
        case JOB_TYPE.COPY:
            var totalpage = glbJobLog.ScanImageInformation.Sheets * glbJobLog.ScanImageInformation.Impressions;
			var jobInfo = {};
			jobInfo.jobType = JOB_TYPE.COPY;
			jobInfo.papersize = glbSetting.selectScanSettings.outputMediumSize;
			jobInfo.colorMode = getDocColorMode(glbJobLog.ScanImageDetailInformation.ColorMode, "JFLib");
			jobInfo.outPlex = glbSetting.selectScanSettings.plexIndex;
			jobInfo.copies = glbSetting.selectScanSettings.copies;
			jobInfo.qty = glbSetting.selectScanSettings.copies;
			jobInfo.physicalpages = glbJobLog.ScanImageInformation.Impressions;
			glbDataSet.priceInfo = {totalPrice: getPriceCalc(jobInfo)};

            if(jobInfo.colorMode == "BlackAndWhite"){
                var _color = Msg.COPY_MAIN_MENU.CM_OPTION_BW;
            }else{
                var _color = Msg.COPY_MAIN_MENU.CM_OPTION_COLOR;
            }
            switch(jobInfo.outPlex){
                case JFLib.OUTPLEX.SIMPLEX:
                    var _duplex = Msg.COPY_MAIN_MENU.PLEX_OPTION_SIM;
                    break;
                case JFLib.OUTPLEX.DUPLEX:
                    var _duplex = Msg.COPY_MAIN_MENU.PLEX_OPTION_DUP;
                    break;
                case JFLib.OUTPLEX.TUMBLE:
                    var _duplex = Msg.COPY_MAIN_MENU.PLEX_OPTION_TUM;
                    break;
                default:
                    var _duplex = "-"
            }

			var lst = [
                {id:"txt_CP_outSize",       text:Msg.ChargeInfoPopup.outSize + sizeCheck(jobInfo.papersize)},
                {id:"txt_CP_outDuplex",     text:Msg.ChargeInfoPopup.outDuplex + _duplex},
                {id:"txt_CP_outPages",      text:Msg.ChargeInfoPopup.outPages + jobInfo.physicalpages},
                {id:"txt_CP_outCopies",     text:Msg.ChargeInfoPopup.outCopies + jobInfo.copies},
                {id:"txt_CP_colorMode",     text:Msg.ChargeInfoPopup.outColorMode + _color},
	         	{id:"lbl_CP_joblist",       text:"-"},
	         	{id:"lbl_CP_totalPrice",    text:formatWithRemainders(glbDataSet.priceInfo.totalPrice)+" "+Msg.UNIT.WON}
            ];
	     	var obj;
	     	for (var i = 0, il = lst.length; i < il; i++) {
	         	obj = lst[i];
	         	Common.setText(obj.id, obj.text);
	         	if (obj.className) {
	             	var ele = document.getElementById(obj.id);
	             	if (ele)
	                 	ele.className = obj.className;
	         	}
	     	}
            /*
			var prevPage = PageManager.getPrevPage();
			if(prevPage.ID == ScanningPopup.ID){
				var objScanningPopup = WidgetLib.getWidgetNode(ScanningPopup.ID);
				document.body.removeChild(objScanningPopup);
			}
            */
            break;
        case JOB_TYPE.SCAN:
            var totalpage = glbJobLog.ScanImageInformation.Sheets * glbJobLog.ScanImageInformation.Impressions;
			var jobInfo = {};
			jobInfo.jobType = JOB_TYPE.SCAN;
			jobInfo.papersize = glbJobLog.ScanImageDetailInformation.Size;
			jobInfo.colorMode = getDocColorMode(glbJobLog.ScanImageDetailInformation.ColorMode, "JFLib");
			jobInfo.outPlex = glbSetting.selectScanSettings.plexIndex;
			jobInfo.copies = glbJobLog.ScanImageInformation.Sheets;
			jobInfo.qty = glbJobLog.ScanImageInformation.Sheets;
			jobInfo.physicalpages = glbJobLog.ScanImageInformation.Impressions;
			glbDataSet.priceInfo = {totalPrice: getPriceCalc(jobInfo)};
            if(glbScanType == "usb"){
			    WidgetLib.setWidgetStatus("btn_confirm",{enable:false});
            }
            if(jobInfo.colorMode == "BlackAndWhite"){
                var _color = Msg.SCAN_MAIN_MENU.CM_OPTION_BW;
            }else{
                var _color = Msg.SCAN_MAIN_MENU.CM_OPTION_COLOR;
            }

			var lst = [
                {id:"txt_CP_outSize",       text:Msg.ChargeInfoPopup.outSize + jobInfo.papersize},
                {id:"txt_CP_outDuplex",     text:" "},
                {id:"txt_CP_outPages",      text:Msg.ChargeInfoPopup.outPages + jobInfo.physicalpages},
                {id:"txt_CP_outCopies",     text:Msg.ChargeInfoPopup.outCopies + "-"},
                {id:"txt_CP_colorMode",     text:Msg.ChargeInfoPopup.outColorMode + _color},
	         	{id:"lbl_CP_joblist", text:"-"},
	         	{id:"lbl_CP_totalPrice", text:formatWithRemainders(glbDataSet.priceInfo.totalPrice)+" "+Msg.UNIT.WON}];
	     	var obj;
	     	for (var i = 0, il = lst.length; i < il; i++) {
	         	obj = lst[i];
	         	Common.setText(obj.id, obj.text);
	         	if (obj.className) {
	             	var ele = document.getElementById(obj.id);
	             	if (ele)
	                 	ele.className = obj.className;
	         	}
	     	}
             if(glbScanType == "usb"){
			    Common.setText("txt_CP_msg0", Msg.ChargeInfoPopup.scan_msg1);
			    Common.setText("txt_CP_msg1", Msg.ChargeInfoPopup.scan_msg2);
            }
            /*
			var prevPage = PageManager.getPrevPage();
			if(prevPage.ID == ScanningPopup.ID){
				var objScanningPopup = WidgetLib.getWidgetNode(ScanningPopup.ID);
				document.body.removeChild(objScanningPopup);
			}
            */
            if(glbScanType == "usb"){
			    glbMediaChkCnt = 100;	// 약 100번을 확인합니다.
			    SSMILib.StartMediaScan(true);
			    SSMILib.setEventListener(Common.onLoadEvent);
            }
            break;
        case JOB_TYPE.FAX:
            var totalpage = glbJobLog.ScanImageInformation.Sheets * glbJobLog.ScanImageInformation.Impressions;
			var jobInfo = {};
			jobInfo.jobType = JOB_TYPE.FAX;
			jobInfo.qty = glbJobLog.ScanImageInformation.Sheets;
			jobInfo.physicalpages = glbJobLog.ScanImageInformation.Impressions;
			glbDataSet.priceInfo = {totalPrice: getPriceCalc(jobInfo)};
            if(jobInfo.colorMode == "BlackAndWhite"){
                var _color = Msg.SCAN_MAIN_MENU.CM_OPTION_BW;
            }else{
                var _color = Msg.SCAN_MAIN_MENU.CM_OPTION_BW;
            }

			var lst = [
                {id:"txt_CP_outSize",       text:Msg.ChargeInfoPopup.outSize + "-"},
                {id:"txt_CP_outDuplex",     text:" "},
                {id:"txt_CP_outPages",      text:Msg.ChargeInfoPopup.outPages + jobInfo.physicalpages},
                {id:"txt_CP_outCopies",     text:Msg.ChargeInfoPopup.outCopies + "-"},
                {id:"txt_CP_colorMode",     text:Msg.ChargeInfoPopup.outColorMode + _color},
	         	{id:"lbl_CP_joblist",       text:"-"},
	         	{id:"lbl_CP_totalPrice",    text:formatWithRemainders(glbDataSet.priceInfo.totalPrice)+" "+Msg.UNIT.WON}];
	     	var obj;
	     	for (var i = 0, il = lst.length; i < il; i++) {
	         	obj = lst[i];
	         	Common.setText(obj.id, obj.text);
	         	if (obj.className) {
	             	var ele = document.getElementById(obj.id);
	             	if (ele)
	                 	ele.className = obj.className;
	         	}
	     	}

            break;
        default:
    }
    this.cssChange();
    this.updateDisplay();

    //Common.sendRequestCardLogIn(Common.getCardLogIn);
 };

 /**
  * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
  */
 ChargeInfoPopup.updateDisplay = function()
 {
     BrowserExt.Beep(0);
     WidgetLib.setWidgetStatus("btn_FL_Print",{enable:true});		//버튼 활성화

     Common.changeVisibility('btn_confirm','block');
     Common.setPosition("btn_DP_CP_cancel","right","100px");
     Common.changeVisibility('txt_CP_msg0','block');
     Common.changeVisibility('txt_CP_msg1','block');
 };


 /**
  * 개별 페이지의 Event처리
  * @param {string} event : Event의 종류
  * @param {string} id : Event의 발생원
  */
 ChargeInfoPopup.EventHandler = function(event, id)
 {
     KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
     switch(event){
         case "onbuttonup":
             MessageManager.clearMessageArea();
             switch(id)
             {
                 case "btn_confirm"://선결제 확인버튼
                     var _lst = FileListPage.docListManager.getCheckedItems();
                     Common.doCharge(PAYMENT_METHOD.PREPAID,_lst);
                     PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
                     break;
                 case "btn_DP_confirm"://직과금 결제 확인
                     BrowserExt.Beep(0);
                     var _lst = FileListPage.docListManager.getCheckedItems();
                     Common.doCharge(PAYMENT_METHOD.CREDIT,_lst);
                     PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
                     break;
                 case "btn_CP_confirm"://Cyber 결제 확인
                     BrowserExt.Beep(0);
                     var _lst = FileListPage.docListManager.getCheckedItems();
                     Common.doCharge(PAYMENT_METHOD.CYBER_MONEY,_lst);
                     PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
                     break;
                 case "btn_DP_CP_cancel":
                     //window.location.reload(true);
                     //window.parent.ServiceManager.refreshService();
                     BrowserExt.Beep(0);
                     excuteToParent("ServiceManager.refreshService");		//서비스 재시작
                     break;
                 default:
                     BrowserExt.Beep(1);
                     break;
             }
             break;
         case "onhardkeydown":
             MessageManager.clearMessageArea();
             switch(id)
             {
                 case BrowserExt.keyCode.FX_VK_PAUSE:
                     break;
                 default:
                     BrowserExt.Beep(1);
                     break;
             }
             break;
         default:
             break;
     }
 };
