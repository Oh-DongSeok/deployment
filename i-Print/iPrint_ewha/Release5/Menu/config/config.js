var CONFIG = {
	ENV : {
		LANG:['ko','en','ja','ch'],//입력예:'ko','en','ja','ch'
		LOGIN_INFO:{
			ID :"ch",
			PASSWORD : "1212"
		},
		ADMIN_INFO:{
			ID :"admin",
			PASSWORD : "1111"
		},
		TIMEOUTS :{
			LOGIN : 60000 //관리자로 로그인 시도 Duration (1min)
		},
		COUNTER : {
			LOGIN : 2
		},
		SECURE:{
			isSHA:false
		},
		SERVER:{
			//IP:"ehwa.svr.i-print.co.kr",
			IP:"192.168.200.102",
			PORT:"11180",
			//PORT:"8889",
			SSL:false
		},
		//SERVICES : [{name:"print",url:"http://localhost:8080/ep_print/"},{name:"copy",url:"http://localhost:8080/ep_copy2/"}]
		//SERVICES : [{name:"print", key:"CS_RM_XXXX1_V0_9_0"},{name:"copy", key:"CS_RM_XXXX2_V0_9_0"}]
		SERVICES : [{name:"print", key:"AIP_00001"},{name:"copy", key:"CS_RM_00124"}]
	},
	MODE:{
		_8BIT_DISPLAY:false,
		//프린터IP지정
		//PRINTER_IP:"118.37.180.218",
		PRINTER_IP:"13.197.1.74",
		//옵션화 가능항목 정리
		//관리자 로그인시 네이티브화면이동기능
		ADMIN_USABLE:false,
		DRCT_PRINT_ENABLE:false,
		//개별 서비스 호출 모드
		SERVICE_CALL_MODE:"iframe",
	},
	//결제방식(교통/신용결제 유무)
	CREDIT_PAYMENT :  true,
	//결제방식(i-Money결제 유무)
	I_MONEY_PAYMENT : true,
	PRINT_USE : true,
	COPY_USE : true
};