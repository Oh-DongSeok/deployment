var CONFIG = {
	USER_SET : {
		/* Available Images :
		 * copy, scan_pc, scan_mbox, scan_email, fax, web, eco_copy, edoc,
		 * private_print, form_printing, ips, ips_scan, bridge_app, native_menu
		 * reserved_01은 scan_media에 할당되었습니다.
		 * 
		 * Icon Size: 96 x 116 (하단 26 pixel은 기능 명칭이 들어갈 공간으로 비워 두도록 아이콘을 작성합니다.
		 * reserved_01~12 까지는 예약 아이콘으로 되어 있고 press_reserved01.png ~ press_reserved12.png 로 
		 * 이미지를 만들어 파일을 교체하면 사용할 수 있습니다. 이 때에 Image 설정은 "reserved_xx" 형식으로 기입하면 됩니다.
		 * 이 때에 메뉴 명칭은 코딩을 해야 하므로 커스텀 라벨 기능을 사용하여 대응합니다.
		 * */
		 FUN_IMG_01 : "ips_scan",
 		 FUN_IMG_02 : "fax",
 		 FUN_IMG_03 : "copy",
 		 FUN_IMG_04 : "native_menu",
 		 FUN_IMG_05 : "",
 		 FUN_IMG_06 : "",
 		 FUN_IMG_07 : "",
 		 FUN_IMG_08 : "",
 		 FUN_IMG_09 : "",
 		 FUN_IMG_10 : "",
 		 FUN_IMG_11 : "",
 		 FUN_IMG_12 : "",
 		 FUN_IMG_13 : "",
 		 FUN_IMG_14 : "",
 		 FUN_IMG_15 : "",
 		 FUN_IMG_16 : "",
 		 FUN_IMG_17 : "",
 		 FUN_IMG_18 : "",
 		 FUN_IMG_19 : "",
 		 FUN_IMG_20 : "",
 		 FUN_IMG_21 : "",
 		 FUN_IMG_22 : "",
 		 FUN_IMG_23 : "",
 		 FUN_IMG_24 : "",
 		 FUN_IMG_25 : "",
 		 FUN_IMG_26 : "",
 		 FUN_IMG_27 : ""
	    },
		/*
	SmartUI Menu Button Native Content
	* 표시는 Icon 등록된 기능
	복합기에서 지원하지 않는 기능의 경우 동작하지 않습니다. (옵션 기능의 경우)
	-------------------------------------------------------------------------------------------------
	|	Transition		|	Transition				|	Transition		|	Transition				|
	|	Destination Name|	Destination window		|	Destination Name|	Destination window		|
	-------------------------------------------------------------------------------------------------
	|	menu			|	“All Services” window	|	web1			|	Web Application 1		|
	|	allservice		|	“All Services” window	|	web2			|	Web Application 2		|
	|	*copy			|	Copy					|	web3			|	Web Application 3		|
	|	*copy_easy		|	Simple Copy				|	web4			|	Web Application 4		|
	|	box	Extended 	|	Folder					|	web5			|	Web Application 5		|
	|	*scan_mbox		|	Store to Folder			|	web6			|	Web Application 6		|
	|	*scan_email		|	E-mail					|	web7			|	Web Application 7		|
	|	*scan_jt		|	Job Template			|	web8			|	Web Application 8		|
	|	*scan_pc		|	Scan to PC				|	web9			|	Web Application 9		|
	|	scan_url		|	Store & Send Link		|	web10			|	Web Application 10		|
	|	scan_media		|	Store to USB			|	ifax			|	Internet Fax			|
	|	bm_scan_s		|	BMLinkS Scan			|	mp_cam			|	Media Print – Photos	|
	|	bm_pl_p			|	BMLinkS Print			|	jobmem			|	Stored Programming		|
	|	bm_menu			|	BMLinkS Menu			|	jobflow			|	Job Flow Sheets			|
	|	sfax			|	Server Fax				|	web				|	Web Application			|
	|	mp_doc			|	Media Print – Text		|	*fax	        |	Fax						|
	|	fax_easy		|	Simple Fax				|	*private_print	|	Private Charge Print	|
	|	scan_wsd		|	Scan(WSD)*2				|	*native_menu	|	Menu(fixed to Native)	|
	|	charge_print	|	Charge Print			|	secure_print	|	Secure Print			|
	|	delayed_print	|	Delayed Print			|	sample_print	|	Sample Set				|
	|	box_fax_sip		|	Fax received – line SIP	|	box_fax_line0	|	Fax received – line 0	|
	|	box_fax_line1	|	Fax received – line 1	|	box_fax_line2	|	Fax received – line 2	|
	|	box_fax_line3	|	Fax received – line 3	|	box_fax_line4	|	Fax received – line 4	|
	|	box_fax_line5	|	Fax received – line 5	|	cstm1			|	Custom Service 1*1		|
	|	cstm2			|	Custom Service 2*1		|	cstm3			|	Custom Service 3*1		|
	|	cstm4			|	Custom Service 4*1		|	cstm5			|	Custom Service 5*1		|
	|	cstm6			|	Custom Service 6*1		|	cstm7			|	Custom Service 7*1		|
	|	cstm8			|	Custom Service 8*1		|	cstm9			|	Custom Service 9*1		|
	-------------------------------------------------------------------------------------------------
	*/
	FUNCTIONS : {
		FUC_1  : "web1",
		FUC_2  : "fax",
		FUC_3  : "copy",
		FUC_4  : "native_menu",
		FUC_5  : "",
		FUC_6  : "",
		FUC_7  : "",
		FUC_8  : "",
	    FUC_9  : "",
	    FUC_10 : "",
	    FUC_11 : "",
	    FUC_12 : "",
	    FUC_13 : "",
	    FUC_14 : "",
	    FUC_15 : "",
	    FUC_16 : "",
	    FUC_17 : "",
	    FUC_18 : "",
	    FUC_19 : "",
	    FUC_20 : "",
	    FUC_21 : "",
	    FUC_22 : "",
	    FUC_23 : "",
	    FUC_24 : "",
	    FUC_25 : "",
	    FUC_26 : "",
	    FUC_27 : ""
	},
	// 버튼의 라벨을 변경할 필요가 있을 경우 하기의 내용을 변경해주세요.
	// 언어별로 변경할 필요가 있습니다.(사용하지 않는 경우는 문제없음)
	// 해당 언어의 정의가 없을 경우 영문으로 표기해주세요.
	// 버튼에 할당한 USER_SET.FUN_IMG_0?에 설정된 Index에 대응하여 변경하시면 됩니다.
	// Custom label을 사용하기 위해서는 CUSTOM_LABEL을 true로 설정해주세요.
	// "Default"치로 설정하면 기본 설정된 Label을 사용합니다.
	CUSTOM_LABEL: false,
	FUNC_LABEL: {
		// 영문
		en:{
			FUN_LABEL_01 : "Default",
			FUN_LABEL_02 : "Default",
			FUN_LABEL_03 : "Default",
			FUN_LABEL_04 : "Default",
			FUN_LABEL_05 : "Default",
			FUN_LABEL_06 : "Default",
			FUN_LABEL_07 : "Default",
			FUN_LABEL_08 : "Default",
			FUN_LABEL_09 : "Default",
			FUN_LABEL_10 : "Default",
			FUN_LABEL_11 : "Default",
			FUN_LABEL_12 : "Default",
			FUN_LABEL_13 : "Default",
			FUN_LABEL_14 : "Default",
			FUN_LABEL_15 : "Default",
			FUN_LABEL_16 : "Default",
			FUN_LABEL_17 : "Default",
			FUN_LABEL_18 : "Default",
			FUN_LABEL_19 : "Default",
			FUN_LABEL_20 : "Default",
			FUN_LABEL_21 : "Default",
			FUN_LABEL_22 : "Default",
			FUN_LABEL_23 : "Default",
			FUN_LABEL_24 : "Default",
			FUN_LABEL_25 : "Default",
			FUN_LABEL_26 : "Default",
			FUN_LABEL_27 : "Default"
		},
		// 한글
		ko:{
			FUN_LABEL_01 : "Default",
			FUN_LABEL_02 : "Default",
			FUN_LABEL_03 : "Default",
			FUN_LABEL_04 : "Default",
			FUN_LABEL_05 : "Default",
			FUN_LABEL_06 : "Default",
			FUN_LABEL_07 : "Default",
			FUN_LABEL_08 : "Default",
			FUN_LABEL_09 : "Default",
			FUN_LABEL_10 : "Default",
			FUN_LABEL_11 : "Default",
			FUN_LABEL_12 : "Default",
			FUN_LABEL_13 : "Default",
			FUN_LABEL_14 : "Default",
			FUN_LABEL_15 : "Default",
			FUN_LABEL_16 : "Default",
			FUN_LABEL_17 : "Default",
			FUN_LABEL_18 : "Default",
			FUN_LABEL_19 : "Default",
			FUN_LABEL_20 : "Default",
			FUN_LABEL_21 : "Default",
			FUN_LABEL_22 : "Default",
			FUN_LABEL_23 : "Default",
			FUN_LABEL_24 : "Default",
			FUN_LABEL_25 : "Default",
			FUN_LABEL_26 : "Default",
			FUN_LABEL_27 : "Default"
		},
		// 중국어
		"zh-cn":{
			FUN_LABEL_01 : "Default",
			FUN_LABEL_02 : "Default",
			FUN_LABEL_03 : "Default",
			FUN_LABEL_04 : "Default",
			FUN_LABEL_05 : "Default",
			FUN_LABEL_06 : "Default",
			FUN_LABEL_07 : "Default",
			FUN_LABEL_08 : "Default",
			FUN_LABEL_09 : "Default",
			FUN_LABEL_10 : "Default",
			FUN_LABEL_11 : "Default",
			FUN_LABEL_12 : "Default",
			FUN_LABEL_13 : "Default",
			FUN_LABEL_14 : "Default",
			FUN_LABEL_15 : "Default",
			FUN_LABEL_16 : "Default",
			FUN_LABEL_17 : "Default",
			FUN_LABEL_18 : "Default",
			FUN_LABEL_19 : "Default",
			FUN_LABEL_20 : "Default",
			FUN_LABEL_21 : "Default",
			FUN_LABEL_22 : "Default",
			FUN_LABEL_23 : "Default",
			FUN_LABEL_24 : "Default",
			FUN_LABEL_25 : "Default",
			FUN_LABEL_26 : "Default",
			FUN_LABEL_27 : "Default"
		}
	}
};

/**
 * Label은
 * 한글/중국어 : 10자 이내
 * 영어 : 14자 이내
 * 숫자 : 14자
 * Custom Label 적용 후에 표시 영역을 확인해주세요.
 *
 * Label의 Default value
 * 영문 ==================================
 * copy : "Copy"
 * scan_pc : "Scan(PC)"
 * scan_mbox : "Scan(MailBox Save)"
 * scan_email : "Scan(Mail)"
 * fax : "Fax"
 * web : "Web Application"
 * eco_copy : "eco COPY"
 * private_print : "Private Charge Print"
 * form_printing : "Form Access"
 * ips : "iPS"
 * ips_scan : "iPS MyScan"
 * bridge_app : "Bridge App"
 * native_menu : "Native-UI"
 * scan_jt : "NetworkScan"
 * edoc : "E-Doc"
 *
 * 한글 ==================================
 * copy : "복사"
 * scan_pc : "스캔(PC전송)"
 * scan_mbox : "스캔(메일박스저장)"
 * scan_email : "스캔(메일송신)"
 * fax : "팩스"
 * web : "웹 애플리케이션"
 * eco_copy : "eco COPY"
 * private_print : "개인 프린트"
 * form_printing : "양식지 출력"
 * ips : "iPS"
 * ips_scan : "iPS MyScan"
 * bridge_app : "Bridge App"
 * native_menu : "Native-UI"
 * scan_jt : "NetworkScan"
 * edoc : "전자문서"
 *
 * 중문 ==================================
 * copy : "複印"
 * scan_pc : "扫描(PC儲存)"
 * scan_mbox : "扫描(保存邮箱)"
 * scan_email : "扫描(送电子邮件)"
 * fax : "傳真"
 * web : "外部存取"
 * eco_copy : "eco COPY"
 * private_print : "个人的列印"
 * form_printing : "Form Access"
 * ips : "iPS"
 * ips_scan : "iPS MyScan"
 * bridge_app : "Bridge App"
 * native_menu : "Native-UI"
 * scan_jt : "NetworkScan"
 * edoc : "E-Doc"
 *
 */
