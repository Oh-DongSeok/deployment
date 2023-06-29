var CONFIG = {
	ENV : {
		TIMEOUTS :{
			GETJOB_DELAY : 500, // Job Log 취득시 Delay
			CHARGEINFO : 60000, //1min(I-Print)
			LOGIN	   : 60000 //1min(I-Print)
		},
		COUNTER : {
			CHARGEINFO : 3,
			GETJOB_DELAY: 300, //2016.09.01 FXKIS CHONE 프린트 환불 처리 - 잡 모니터링 시간 간격
			GETJOB_COUNT : 100  //2016.09.01 FXKIS CHONE 프린트 환불 처리 - 잡 모니터링 횟수(이 횟수동안 잡이 발견되지 않으면 모니터링 중리)
		},
		CAMPAIGN_IMG : [] //Default
		//CAMPAIGN_IMG : ["SNU_GreenCampain0.png","SNU_GreenCampain1.png","SNU_GreenCampain2.png"] //켐페인 이미지 최대 5개까지 설정가능
	},
	isSHA:false,
	//프린터IP지정
	//PRINTER_IP:"118.37.180.218",
	//PRINTER_IP:"210.123.94.161",
	//컬러/흑백(세이토는 불요)
	COLOR_SUPPORT:true,	//미구현
	//삭제기능 활성화
	ENABLE_DOC_DELETE:true,
	//인쇄매수기능 활성화(부수표시/비표시)
	ENABLE_DOC_PRINT_SET:true,
	//관리자 로그인시 네이티브화면이동기능
	ADMIN_USABLE:false,
	//문서목록 정렬기능
	DOC_LIST_SORT : "DESC",
	//인쇄문서 정렬기능
	PRINT_DOCNO_SORT : true,
	//인쇄중화면 표시시간 지정
	JOB_RUN_PAGE_DISPLAY_DISTANCE:3000,
	//문서목록정렬기능(추후)
	
	//결제방식(선결제/후결제)
	PAYMENT_TYPE : "AFTER", //BEFORE,AFTER
	
	FUNCTION_CHECK : {
		NUP : false,
		OUTPLEX : false,
	}
};