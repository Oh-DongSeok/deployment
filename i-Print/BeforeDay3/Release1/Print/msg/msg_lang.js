var Msg = {};
var Msg_lang = {
	en:{
		Common : {
			CSName : "Printing Service",
			logout:"Select a services",
			lbl_POPUP_confirm	:	"Setting",
			lbl_POPUP_cancel	:	"Cancel",
			lbl_POPUP_close	:	"Close",
			UnknownUserName : "_No User"
		},
		UNIT:{
			PAGE : "Page",
			PRN_SET : "Copies",//2016.05.25 chone 다언어대응
			WON : "Won",
			COUNT: "Number",
			TOTALPRICE : "The total amount: " //2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		Page:{
			FILELIST:{
				//문서목록화면
				SELECTED_FILE_NUMBER_MSG : "Selected file(s):",
				//USER_BALANCE_FORMAT : "Balance Xxx won",
				FILE_NOT_EXIST : "No Document.",
				FILE_LIST_BTN_PAGE_MSG : "Page",
				COMMON_PRINT_QUANTITY_LABEL : "Number of copies",
				FILE_LIST_BTN_COLOR_MODE_BW_MSG : "B & W",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_COLOR_MODE_AUTO_MSG : "Color",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG : "A4",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG : "A3",
				FILE_LIST_BTN_OUTPUT_SIMPLEX:"1 Side",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_OUTPUT_DUPLEX:"2 Side(Left and Right)",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_OUTPUT_TUMBLE:"2 Side(Up and Down)",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_PRICE:"Price",//2016.05.25 chone 다언어대응
				COMMON_PRINT_NUP_LABEL : "up",
				SELECT_ALL_BTN_LABEL_0 : "Select All",
				SELECT_ALL_BTN_LABEL_1 : "",
				DELETE_FILE_BTN_LABEL : "Delete",
				PRINT_SETTING_BTN_LABEL_0 : "Print",
				LOADING_MSG_0 : "Please wait...",
				LOADING_MSG_1 : "It may take some time to display the document.",
				LOADING_MSG_2 : "",
				LOADING_MSG_3 : ""
			},
			CONFIRM:{
				BTN_CONFIRM:"Confirm",
				BTN_CANCEL:"Cancel",
				GUIDE_SEVICE_SELECT:["Would you like to return to the Service screen?"],
				GUIDE_LOGOUT:["Do you want to log out?"],
			},
			ErrorPopup:{title:"Error",btnClose:"Close"},
			WarnPopup:{title:"Warning",btnClose:"Close"},
			ResultPopup:{
				eco_text:"Nnn장의 종이를 절약했습니다."
			},
			ChargeInfoPopup:{
				title:"Payment notification",
				btnConfirm:"Confirm",
				btnDirectConfirm:"Payment to T-money / Credit card",
				btnCyberConfirm:"Payment to Point",
				btnCancel:"Cancel",
				//msg1:"요금은 ",
				//msg2:"원 입니다.",
				//msg3:"단말기에 카드를 올리신 후 확인 버튼을 눌러주십시오."
				//,currency:"￦"
				//Please click the payment button below to proceed with the payment.
				msg1:["Please click ", "the payment button", "below to proceed with the payment."],//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				msg2:"",//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				joblist:"Select the number of prints:",
				totalPrice:"The total amount:"
			},
			PrintingPopup : {//2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblRequestCardPayment : "Please make a payment from card terminal.",
				lblPrinting : "Printing..."
			}
		},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV:["The environment configuration is incorrect.", "", "Please contact administrator."],
			FAIL_COMM:["A failure occurred during communication.","","Please contact administrator."],
			FAIL_TIMEOUT : ["A failure occurred during communication.","","Please contact your administrator."],
			//FAIL_SERVER : ["There was a server or DB failure.","","Please contact administrator."],
			FAIL_OTHERS : ["Unknown failure has occurred.","","Please contact administrator."],

			//문서리스트페이지
			IS_FIRST_PAGE:["First page."],
			IS_LAST_PAGE:["Last page."],
			REQUIRE_DOC_SELECTION:["There is no document. ","After selection, please try again."],
			FAIL_PRINT_REFUND : ["The job was terminated because it could not be printed."]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		}
	},
	ko:{
		Common : {
			CSName : "프린트 서비스",
			logout:"서비스선택으로",
			lbl_POPUP_confirm	:	"설정",
			lbl_POPUP_cancel	:	"취소",
			lbl_POPUP_close	:	"닫기",
			UnknownUserName : "_No User"
		},
		UNIT:{
			PAGE:"페이지",
			PRN_SET:"부",
			WON : "원",
			COUNT: "건",
			TOTALPRICE : "총결제금액: " //2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		Page:{
			FILELIST:{
				//문서목록화면
				SELECTED_FILE_NUMBER_MSG : "선택수:",
				//USER_BALANCE_FORMAT:"잔액 : Xxx 원",
				FILE_NOT_EXIST : "문서가 없습니다.",
				FILE_LIST_BTN_PAGE_MSG : "페이지",
				COMMON_PRINT_QUANTITY_LABEL : "부",
				FILE_LIST_BTN_COLOR_MODE_BW_MSG : "흑백",
				FILE_LIST_BTN_COLOR_MODE_AUTO_MSG : "컬러",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG:"A4",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG:"A3",
				FILE_LIST_BTN_OUTPUT_SIMPLEX:"단면",
				FILE_LIST_BTN_OUTPUT_DUPLEX:"양면(좌우)",
				FILE_LIST_BTN_OUTPUT_TUMBLE:"양면(상하)",
				FILE_LIST_BTN_PRICE:"결제금액",
				COMMON_PRINT_NUP_LABEL : "up",
				SELECT_ALL_BTN_LABEL_0 : "전체 선택",
				SELECT_ALL_BTN_LABEL_1 : "",
				DELETE_FILE_BTN_LABEL : "삭제",
				PRINT_SETTING_BTN_LABEL_0 : "프린트",
				LOADING_MSG_0 : "잠시 기다려 주세요.",
				LOADING_MSG_1 : "문서 표시에 시간이 걸리는 경우가 있습니다.",
				LOADING_MSG_2 : "",
				LOADING_MSG_3 : ""
			},
			CONFIRM:{
				BTN_CONFIRM:"확인",
				BTN_CANCEL:"취소",
				GUIDE_SEVICE_SELECT:["서비스선택화면으로 돌아가시겠습니까?"],
				GUIDE_LOGOUT:["로그아웃 하시겠습니까?"]
			},
			ErrorPopup : {title : "에러",btnClose:"닫기"},
			WarnPopup : {title : "경고",btnClose:"닫기"},
			ResultPopup:{
				eco_text:"Nnn장의 종이를 절약했습니다."
			},
			ChargeInfoPopup:{
				title:"결제 금액 알림",
				btnConfirm:"확인",
				btnDirectConfirm:"교통/신용 결제",
				btnCyberConfirm:"충전금 결제",
				btnCancel:"취소",
				//msg1:"요금은 ",
				//msg2:"원 입니다.",
				//msg3:"단말기에 카드를 올리신 후 확인 버튼을 눌러주십시오."
				//,currency:"￦"
				msg1:["아래 ", "결제 버튼", "을 눌러 결제를 진행하여 주세요."],//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				msg2:"",//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				joblist:"출력물선택건수:",
				totalPrice:"총결제금액:"
			},
			PrintingPopup : {//2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblRequestCardPayment : "카드 단말기에 결제를 진행해주세요!",
				lblPrinting : "인쇄중..."
			}
		},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV:["환경구성이 바르지 않습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_COMM:["통신중 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_TIMEOUT:["통신중 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			//FAIL_SERVER:["서버 혹은  DB장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_OTHERS : ["알수없는 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],

			//문서리스트페이지
			IS_FIRST_PAGE:["첫 페이지 입니다."],
			IS_LAST_PAGE:["마지막 페이지 입니다."],
			REQUIRE_DOC_SELECTION:["선택된 문서가 없습니다. ","선택후 다시 시도 바랍니다."],
			FAIL_PRINT_REFUND : ["프린트를 할 수 없어서 작업을 종료합니다"]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		}
	},
	ja:{
		Common : {
			CSName : "印刷サービス",
			logout:"サービスを選択",
			lbl_POPUP_confirm	:	"セット",
			lbl_POPUP_cancel	:	"キャンセル",
			lbl_POPUP_close	:	"クローズ",
			UnknownUserName : "_No User"
		},
		UNIT:{
			PAGE:"ページ",
			PRN_SET:"部",
			WON : "",//2016.05.25 chone 다언어대응
			COUNT: "数",
			TOTALPRICE : "合計お支払い額: " //2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		Page:{
			FILELIST:{
				//문서목록화면
				SELECTED_FILE_NUMBER_MSG : "選択したファイル:",
				//USER_BALANCE_FORMAT:"残額 : Xxx ウォン",
				FILE_NOT_EXIST : "ドキュメントはありません",
				FILE_LIST_BTN_PAGE_MSG : "ページ",
				COMMON_PRINT_QUANTITY_LABEL : "部数",
				FILE_LIST_BTN_COLOR_MODE_BW_MSG : "白黒",
				FILE_LIST_BTN_COLOR_MODE_AUTO_MSG : "色",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG:"A4",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG:"A3",
				FILE_LIST_BTN_OUTPUT_SIMPLEX:"片面",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_OUTPUT_DUPLEX:"両面（左右）",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_OUTPUT_TUMBLE:"両面（上下）",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_PRICE:"支払額",
				COMMON_PRINT_NUP_LABEL : "up",
				SELECT_ALL_BTN_LABEL_0 : "すべて選択",
				SELECT_ALL_BTN_LABEL_1 : "",
				DELETE_FILE_BTN_LABEL : "削除",
				PRINT_SETTING_BTN_LABEL_0 : "印刷",
				LOADING_MSG_0 : "お待ちください。",
				LOADING_MSG_1 : "これは、ドキュメントを表示するには時間がかかる場合があります。",
				LOADING_MSG_2 : "",
				LOADING_MSG_3 : ""
			},
			CONFIRM:{
				BTN_CONFIRM:"確認します",
				BTN_CANCEL:"キャンセル",
				GUIDE_SEVICE_SELECT:["[サービス]画面に戻りますか？"],
				GUIDE_LOGOUT:["あなたはログアウトしますか？"]
			},
			ErrorPopup : {title : "エラー",btnClose:"クローズ"},
			WarnPopup : {title : "警告",btnClose:"クローズ"},
			ResultPopup:{
				eco_text:"Nnn枚の紙を節約しました。"
			},
			ChargeInfoPopup:{
				title:"支払通知",
				btnConfirm:"確認します",
				btnDirectConfirm:"Tマネーの支払い/クレジットカード",
				btnCyberConfirm:"ポイントの支払い",//2016.05.25 chone 다언어대응
				btnCancel:"キャンセル",
				//msg1:"요금은 ",
				//msg2:"원 입니다.",
				//msg3:"단말기에 카드를 올리신 후 확인 버튼을 눌러주십시오."
				//,currency:"￦"
				// 下の決済ボタンを押して決済を進めてください。
				msg1:["下の", "決済ボタンを", "押して決済を進めてください。"],//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				msg2:"",//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				joblist:"選択したプリント枚数:",
				totalPrice:"合計お支払い額:"
			},
			PrintingPopup : {//2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblRequestCardPayment : "カード端末からの支払いを行ってください。",
				lblPrinting : "印刷..."
			}
		},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV : ["環境の構成が正しくありません。","","管理者に連絡してください。"],
			FAIL_COMM:["障害が通信中に発生しました。","","管理者に連絡してください。"],
			FAIL_TIMEOUT : ["障害が通信中に発生しました。","","管理者に連絡してください。"],
			//FAIL_SERVER : ["サーバまたはDB障害が発生しました。","","管理者に連絡してください。"],
			FAIL_OTHERS : ["不明なエラーが発生しました。","","管理者に連絡してください。"],

			//문서리스트페이지
			IS_FIRST_PAGE:["最初のページ。"],
			IS_LAST_PAGE:["最後のページ。"],
			REQUIRE_DOC_SELECTION:["何の文書がありません。","選択後、再度お試しください。"],
			FAIL_PRINT_REFUND : ["プリントをすることができなくて操作を終了します。"]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		}
	},
	ch:{
		Common : {
			CSName : "印刷服务",
			logout:"选择服务",
			lbl_POPUP_confirm	:	"组",
			lbl_POPUP_cancel	:	"取消",
			lbl_POPUP_close	:	"关",
			UnknownUserName : "_No User"
		},
		UNIT:{
			PAGE:"页",
			PRN_SET:"数量",//2016.05.25 chone 다언어대응
			WON : "",//2016.05.25 chone 다언어대응
			COUNT: "数",
			TOTALPRICE : "支付总额: " //2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		Page:{
			FILELIST:{
				//문서목록화면
				SELECTED_FILE_NUMBER_MSG : "选定的文件:",
				//USER_BALANCE_FORMAT:"残額 : Xxx ウォン",
				FILE_NOT_EXIST : "没有文件",
				FILE_LIST_BTN_PAGE_MSG : "页",
				COMMON_PRINT_QUANTITY_LABEL : "复印数量",
				FILE_LIST_BTN_COLOR_MODE_BW_MSG : "黑白",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_COLOR_MODE_AUTO_MSG : "颜色",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG:"A4",
				FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG:"A3",
				FILE_LIST_BTN_OUTPUT_SIMPLEX:"单面",
				FILE_LIST_BTN_OUTPUT_DUPLEX:"两面（左右）",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_OUTPUT_TUMBLE:"两面（上下）",//2016.05.25 chone 다언어대응
				FILE_LIST_BTN_PRICE:"支付金额",
				COMMON_PRINT_NUP_LABEL : "up",
				SELECT_ALL_BTN_LABEL_0 : "全选",
				SELECT_ALL_BTN_LABEL_1 : "",
				DELETE_FILE_BTN_LABEL : "删除",
				PRINT_SETTING_BTN_LABEL_0 : "打印",
				LOADING_MSG_0 : "请稍候.",
				LOADING_MSG_1 : "这可能需要一些时间来显示文档.",
				LOADING_MSG_2 : "",
				LOADING_MSG_3 : ""
			},
			CONFIRM:{
				BTN_CONFIRM:"确认",
				BTN_CANCEL:"取消",
				GUIDE_SEVICE_SELECT:["你想，返回到服务界面？"],
				GUIDE_LOGOUT:["你要注销？"]
			},
			ErrorPopup : {title : "错误",btnClose:"关"},
			WarnPopup : {title : "警告",btnClose:"关"},
			ResultPopup:{
				eco_text:"Nnn枚の紙を節約しました。"
			},
			ChargeInfoPopup:{
				title:"付款通知",
				btnConfirm:"确认",
				btnDirectConfirm:"支付T-货币/信用卡",
				btnCyberConfirm:"支付给网络赚钱",
				btnCancel:"取消",
				//msg1:"요금은 ",
				//msg2:"원 입니다.",
				//msg3:"단말기에 카드를 올리신 후 확인 버튼을 눌러주십시오."
				//,currency:"￦"
				//请点击下面的付款按钮以继续付款
				msg1:["请点击下面的付款按钮以继续付款"],//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				msg2:"",//2017.02 FXKIS IPrint-One Time ID 지원(OTID) 기능판 개발 refs #4230
				joblist:"选择打印数量:",
				totalPrice:"支付总额:"
			},
			PrintingPopup : {//2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblRequestCardPayment : "请从卡终端付款.",
				lblPrinting : "印花..."
			}
		},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV : ["环境配置不正确.","","请与管理员联系."],
			FAIL_COMM:["通信过程中发生故障.","","请与管理员联系."],
			FAIL_TIMEOUT : ["通信过程中发生故障.","","请与管理员联系."],
			//FAIL_SERVER : ["サーバまたはDB障害が発生しました。","","请与管理员联系."],
			FAIL_OTHERS : ["未知的故障发生.","","请与管理员联系."],

			//문서리스트페이지
			IS_FIRST_PAGE:["第一页."],
			IS_LAST_PAGE:["最后一页."],
			REQUIRE_DOC_SELECTION:["没有文件.","选择完毕后，请重试."],
			FAIL_PRINT_REFUND : ["作业被终止，因为无法打印."]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		}
	}
};
