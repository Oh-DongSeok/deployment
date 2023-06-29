/**
 * @fileoverview 슬라이드 팝업 메시지 관리
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var MessageManager={
	/**
	 * 문자수 제한
	 */
	MESSAGE_MAX:62,
	
	/**
	 * 메세지의 종류
	 */
	MessageType:{
		USER_ACTION_REQUIRED		:	"user_action_required",	//invalid음、7초、화면 조작시 Clear
		CONFLICT	:	"conflict",					//invalid음、7초、화면 조작시 Clear
		JOB_START	:	"job_start_error"			//invalid음、7초、화면 조작시 Clear
	},
	
	/**
	 * Job실행중의 메시지의 종류
	 */
	START_DETAIL:{
		TOO_MANY_JOB_ERROR:0
	},
	
	key:"",
	
	/**
	 * 메시지의 표시 기간
	 */
	messageTimeout:null,	//glbMessageInterval;
	
	/**
	 * 메시지 문자열 격납용
	 */
	txtMessageObj:["",""],
	
	/**
	 * 슬라이드 메시지의 배경 이미지 설정
	 * -AR161590 대응
	 */
	init:function(){
		Common.setImage("img_MA_backGroundImage", Img.MESSAGE_AREA_BG);
	},
	
	/**
	 * 슬라이드 팝업 메시지를 표시
	 * @param {MessageManager.MessageType} type
	 * @param {MessageManager.START_DETAIL} category
	 * @param {string or Array} argument
	 */
	displayMessage:function(type, category, argument)
	{
		if(!type){
			return;
		}
		this.constructMessage(type, category, argument);
		this.displayMessageArea(this.txtMessageObj, type);
	},
	
	/**
	 * 메시지를 구성한다.
	 * @param {MessageManager.MessageType} type
	 * @param {MessageManager.START_DETAIL} category
	 * @param {string or Array} argument
	 */
	constructMessage:function(type, category, argument)
	{
		if(!type){
			return;
		}
	
		if(type == this.MessageType.JOB_START){
			switch(category){
				case this.START_DETAIL.TOO_MANY_JOB_ERROR:
					//Msg.JOB_ERROR.TOO_MANY_JOBS.title;
					this.txtMessageObj=Msg.ERROR_MSG.TOO_MANY_JOBS;
					break;
				default:
					KISUtil.debug("constructMessage/category",category);
					break;
			}
		}else if(type == this.MessageType.USER_ACTION_REQUIRED||type == this.MessageType.CONFLICT){//금칙 처리의 메시지를 표시
			if(argument){
				this.txtMessageObj = (argument instanceof Array)?argument:Common.splitString(argument, this.MESSAGE_MAX);
			}
		}
	},
	
	/**
	 * 슬라이드 팝업 메시지를 표시
	 * @param {string} msg : 메시지
	 * @param {MessageType} type : 메시지의 종류
	 */
	displayMessageArea:function (msg, type)
	{
		this.clearMessageArea();
		clearTimeout(this.messageTimeout);
	
		if(!flg_Dummy_Beep) this.messageTimeout = setTimeout('MessageManager.clearMessageArea()', glbInfo.MSG_TIMEOUT_LENGTH);		//자동으로 사라지지않는 사양이므로 comment out
		/*if(msg[2]){//세 번째 줄의 메시지가 있으면 두 번째 행에 붙인다.
			msg[1] = Common.splitString(msg[1]+msg[2], this.MESSAGE_MAX)[0];
		}*/
		if(msg != null && msg.length > 0){
			this.writeMsg(msg[0], msg[1],msg[2], type);
		}
	},
	
	/**
	 * 메시지 문자열의 Set
	 * 메시지 영역의 배경 이미지 Set
	 * 메시지 영역의 표시
	 * 
	 * @param {string} msg1 : 메시지1
	 * @param {string} msg2 : 메시지2
	 * @param {MessageType} type : 메시지의 종류
	 */
	writeMsg:function (msg1, msg2, msg3, type)
	{
		//console.log(arguments);
		var target = this._getTarget();
		var cssClassKey;

		if(msg1){//１行メッセージ
			Common.setText(target.lbl1, msg1);
			if(msg2){//2行メッセージ
				Common.setText(target.lbl2, msg2);
				if(msg3){//3行メッセージ
					Common.setText(target.lbl3, msg3);
					cssClassKey = "_3line";
				}
				else{
					cssClassKey = "_2line";
				}
			}
			else{
				cssClassKey = "_1line";
			}
		}
		else	//想定外ケース
		{
			KISUtil.debug("writeMsg", "msg1:" + msg1 + "/msg2:" + msg2 + "/msg3:" + msg3);
			return;
		}
		
		Common.setClass("message_area", cssClassKey);
		Common.changeVisibility(target.wrapper, "block");
	},
	/**
	 * 슬라이드 팝업 메시지를 비표시로 한다.
	 */
	clearMessageArea : function() {
		clearTimeout(this.messageTimeout);
		this.txtMessageObj = [];
		var target = this._getTarget();
		if (target == null)
			return;
		Common.changeVisibility(target.wrapper, "none");
		//Common.addClass(target.wrapper, "hidden");
		Common.setText(target.lbl1, "");
		Common.setText(target.lbl2, "");
		Common.setText(target.lbl3, "");
	},

	/**
	 *
	 */
	_getTarget:function() {
		var result = {wrapper:"message_area",lbl1:"txt_message_1",lbl2:"txt_message_2",lbl3:"txt_message_3"};
		if (this.key && this.key.length > 0) {
			result = {
				wrapper : "lyr_" + this.key + "_Msg",
				lbl1 : "txt_" + this.key + "_Msg0",
				lbl2 : "txt_" + this.key + "_Msg1",
				lbl3 : "txt_" + this.key + "_Msg2"
			};
		}
		return result;
	}
};