/**
 * @fileoverview 프린트중 팝업
 * @author FXKIS son.ch
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var ResultPopup = new TemplatePage();

ResultPopup.ID = "pop_ResultPopup";

/**
 * 개별 페이지의 Data정의
 */
ResultPopup._initModel=function()
{
	this._data=
	{
		buttonList:[
				   {id:"btn_thankyou_screen_close", type:WidgetLib.ButtonType.NORMAL, attr:{targetImgId :"img_thankyou_screen_close", offImg: Img.ICON.ICN_CF_CONFIRM_OFF, pressImg: Img.ICON.ICN_CF_CONFIRM_PRESS}}
		],
		imageList:[
		           //{id:"thankyou_screen_base",src:Img.BG.BG_RESULT},
				   {id:"eco_level1",src:Img.BG.BG_RESULT.TREE},
				   {id:"eco_level2",src:Img.BG.BG_RESULT.TREE},
				   {id:"eco_level3",src:Img.BG.BG_RESULT.TREE}
		],
		textList:[
				   {id:"lbl_thankyou_screen_close",	text:Msg.CommonLbl.lbl_POPUP_close},
		]
	};
};

ResultPopup._onPageChange = function(){
	this.updateDisplay();
	SSMILib.GetChildJobInfo(true , glbInfo.printJobID, "", 1);
};
ResultPopup._onPageLeave = function(){
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
ResultPopup.updateDisplay=function(){
	this.displayEcoImage();
	this.displayEcoLevel();
};

/**
 * Eco 텍스트 표시를 위한 함수
 */
ResultPopup.displayEcoText=function(ecoNum){
	//Common.setText('eco_text',Msg.Page.ResultPopup.eco_text.replace(/Nnn/,ecoNum)); //Dummy Test용
	(ecoNum > 0)?Common.setText('eco_text',Msg.Page.ResultPopup.eco_text.replace(/Nnn/,ecoNum)):"";
	(glbInfo.thankScreenState==THANK_SCREEN_STATE.NIGHT)?Common.setTextColor('eco_text',"white"):"";
}

/**
 * Eco 이미지표시를 위한 함수(오전/저녁/오후)
 */
ResultPopup.displayEcoImage = function(){
	var img_base;
	var img_add;
	var pos_x;
	var pos_y;
	//glbInfo.thankScreenState=THANK_SCREEN_STATE.DAY //Dummy Test용
	switch(glbInfo.thankScreenState){
		case THANK_SCREEN_STATE.DAY:
			img_base = Img.BG.BG_RESULT.DAY0;
			img_add = Img.BG.BG_RESULT.DAY;
			pos_x = "470px";
			pos_y = "250px";
			break;
		case THANK_SCREEN_STATE.EVENING:
			img_base = Img.BG.BG_RESULT.EVE0;
			img_add = Img.BG.BG_RESULT.EVE;
			pos_x = "470px";
			pos_y = "250px";
			break;
		case THANK_SCREEN_STATE.NIGHT:
			img_base = Img.BG.BG_RESULT.NIGHT0;
			img_add = Img.BG.BG_RESULT.NIGHT;
			pos_x = "10px";
			pos_y = "100px";
			break;
	}

	Common.setImage("thankyou_screen_base", img_base);
	Common.setImage("thankyou_additional",img_add);
	Common.setPosition("thankyou_additional_base","left",pos_x);
	Common.setPosition("thankyou_additional_base","top",pos_y);
}

 /**
 * Eco level의 이미지를 표시를 위한 함수(TODO 3단계)
 */
ResultPopup.displayEcoLevel = function(){
	var eco_level = calcEcoLevel();
	//eco_level =3;//Dummy Test용
	for(var i = 1;i <= 3;i++){
		if(i <= eco_level){
			Common.changeVisibility("eco_level"+i, "block");
		} else {
			Common.changeVisibility("eco_level"+i, "none");
		}
	}
}

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
ResultPopup.EventHandler = function(event, id)
{
	switch(event){
		case "GetChildJobInfo":
			if(arguments[1] == true){
				var childJobInfo = arguments[2];
				var impression = glbDataSet.pages;//입력 용지수
				var sheets = parseInt(childJobInfo.PrintMediumInformation.Sheets);//실제 출력된 용지수
				var copies = parseInt(childJobInfo.PrintMediumInformation.Copies);//부수
				var ecoNum = calcEcoSheetsNum(impression,sheets,copies);
				//var ecoNum = 3; //Dummy Test용
				this.displayEcoText(ecoNum);
			} else {
				//changePageView("red_popup", onPopupPageEvent);
				//openCriticalErrorPopup(POPUP_TYPE.ERROR, POPUP_LIST.FILE_LIST_ERROR , ERROR_TYPE.OTHER_ERRORS);
			}
			break;
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case "btn_thankyou_screen_close":
					BrowserExt.Beep(0);
					document.location.reload();
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