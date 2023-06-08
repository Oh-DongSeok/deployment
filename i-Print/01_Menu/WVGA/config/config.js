var CONFIG = {
	ENV : {
		ACTIVATOR_KEY: "",
		LANG:['ko','en','ja','ch'],//입력예:'ko','en','ja','ch'
		LOGIN_INFO:{
			ID :"ch",
			PASSWORD : "1212"
		},
		ADMIN_INFO:{
			ID :"admin",
			PASSWORD : "xerox"
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
			IP:"cloud.svr01.i-print.co.kr",
			PORT:"11180",
			SSL:true
		},
		SERVICES : [
			/* =========================================================== */
			/* name: 서비스 명칭                                            */
			/* key: 서비스 주소명                                           */
			/* func: 복합기 Native기능 사용여부                              */
			/* =========================================================== */
			// Scan 기능일람
			// - 스캔 폴더 저장: scan_mbox
			// - 스캔 메일전송: scan_email
			// - 스캔 PC전송: scan_pc
			// - 스캔 USB저장: scan_media
			// Fax 기능일람
			// - 일반 FAX: fax
			// - 간단 FAX: fax_easy
			/* =========================================================== */
			// 설정된 CS가 설치되어 있으면 각각의 기능 버튼동작에 해당 CS가 할당된다.
			// func 추가 복합기 기능을 쓸건지 CS를 호출할 건지를 나타낸다.
			{ name:"print", key:"AIP_53007", func:false },
			{ name:"copy" ,	key:"AIP_53008", func:false },
			{ name:"scan" ,	key:"AIP_53009", func:false },
			{ name:"fax"  , key:"AIP_53010", func:false }
		]
	},
	FUNC_SCAN:"",
	FUNC_FAX:"",
	MODE:{
		_8BIT_DISPLAY:false,
		//프린터IP지정
		PRINTER_IP:"192.168.0.198",
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
	I_MONEY_PAYMENT : false,
	PRINT_USE : true,
	COPY_USE : true,
	SCAN_USE : true,
	FAX_USE : true
};
