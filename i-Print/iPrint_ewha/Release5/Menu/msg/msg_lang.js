var Msg = {};
var Msg_default = {};
var Msg_lang = {
	en:{
		Common : {
			Lang:"English",
			CSName : "Print / Copy service",
			lbl_POPUP_confirm	:	"Setting",
			lbl_POPUP_cancel	:	"Cancel",
			lbl_POPUP_close	:	"Close",
			UnknownUserName : "_No User",
			title : "Print / Copy service",
			tray_unit: "단",
			tray_bar:"-",
			tray_error: "ERROR",
			CS_NUMBER: "CS-RM-XXXX0",//コンテンツ識別子
			ServerSetName : "서버환경설정"
		},
		UNIT:{
			WON : "Won"
		},
		LOGIN:{
			LOGIN_ID_LABEL : "ID",
			LOGIN_PW_LABEL : "PASSWORD",
			LOGIN_BTN_LABEL : "Login",
			LOGIN_GUEST_BTN_LABEL : "Non-member Copy",//2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
			DRCT_PRINT_BTN_LABEL :"Direct Print",
			GUIDE_ID:"ID",
			GUIDE_PW:"PASSWORD"
		},
		SERVICE_SELECT:{
			GUIDE_MESSAGE : "Please select the desired service.",
			LBL_BALANCE : "The balance : ",
			LBL_PRINT : "Print",
			LBL_COPY : "Copy"
		},
		CONFIRM:{
			BTN_CONFIRM:"Confirm",
			BTN_CANCEL:"Cancel",
			GUIDE_LOGOUT:["Do you want to log out?"]
		},
		ErrorPopup:{title:"Error"},
		WarnPopup:{title:"Warning"},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV : ["The environment configuration is incorrect.","","Please contact administrator."],
			FAIL_COMM:["A failure occurred during communication.","","Please contact administrator."],
			FAIL_OTHERS : ["Unknown failure has occurred.","","Please contact administrator."],

			//기동중
			FAIL_INVALID_CERTMODE : ["In the current authentication mode is not available for this service."],
			
			//로그인
			REQUIRE_USERID_PW : ["User ID or Password are empty.","Please confirm and try again."],
			FAIL_LOGIN_INVALID : ["Please check your ID or Password.","Unregistered ID.","You have entered the wrong ID or Password."],
		}
	},
	ko:{
		Common : {
			Lang:"한국어",
			CSName : "복합기 서비스",
			lbl_POPUP_confirm	:	"설정",
			lbl_POPUP_cancel	:	"취소",
			lbl_POPUP_close	:	"닫기",
			UnknownUserName : "_No User",
			title : "복합기 서비스", //TODO Message
			tray_unit: "단",
			tray_bar:"-",
			tray_error: "ERROR",
			CS_NUMBER: "CS-RM-XXXX0",//コンテンツ識別子
			ServerSetName : "서버환경설정"
		},
		UNIT:{
			WON : "원"
		},
		LOGIN:{
			LOGIN_ID_LABEL : "ID",
			LOGIN_PW_LABEL : "PASSWORD",
			LOGIN_BTN_LABEL : "로그인",
			LOGIN_GUEST_BTN_LABEL : "비회원 복사",//2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
			DRCT_PRINT_BTN_LABEL : "즉시출력",
			GUIDE_ID:"ID",
			GUIDE_PW:"PASSWORD"
		},
		SERVICE_SELECT:{
			GUIDE_MESSAGE : "원하시는 서비스를 선택해 주세요.",
			LBL_BALANCE : "잔액 : ",
			LBL_PRINT : "인쇄",
			LBL_COPY : "복사"
		},
		CONFIRM:{
			BTN_CONFIRM:"확인",
			BTN_CANCEL:"취소",
			GUIDE_LOGOUT:["로그아웃 하시겠습니까?"]
		},
		ErrorPopup : {title : "에러"},
		WarnPopup : {title : "경고"},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV:["환경구성이 바르지 않습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_COMM:["통신중 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_OTHERS : ["알수없는 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],

			//기동중
			FAIL_INVALID_CERTMODE:["현재의 인증모드로는 이 서비스를 이용하실수 없습니다."],
			
			//로그인관련
			REQUIRE_USERID_PW:["유저ID 혹은 Password의 입력이 비었습니다.","확인 후 다시 시도 바랍니다."],
			FAIL_LOGIN_INVALID:["아이디 또는 비밀번호를 다시 확인하세요.", "등록되지 않은 아이디이거나, ","아이디 또는 비밀번호를 잘못 입력하셨습니다."],
		}
	},
	ja:{
		Common : {
			Lang:"日本語",
			CSName : "印刷/コピーサービス",
			lbl_POPUP_confirm	:	"セット",
			lbl_POPUP_cancel	:	"キャンセル",
			lbl_POPUP_close	:	"クローズ",
			UnknownUserName : "_No User",
			title : "印刷/コピーサービス", //TODO Message
			tray_unit: "단",
			tray_bar:"-",
			tray_error: "ERROR",
			CS_NUMBER: "CS-RM-XXXX0",//コンテンツ識別子
			ServerSetName : "서버환경설정"
		},
		UNIT:{
			WON : "ウォン"
		},
		LOGIN:{
			LOGIN_ID_LABEL : "ID",
			LOGIN_PW_LABEL : "PASSWORD",
			LOGIN_BTN_LABEL : "ログイン",
			LOGIN_GUEST_BTN_LABEL : "非会員のコピー",//2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
			DRCT_PRINT_BTN_LABEL : "すべて出力",
			GUIDE_ID:"ID",
			GUIDE_PW:"PASSWORD"
		},
		SERVICE_SELECT:{
			GUIDE_MESSAGE : "ご希望のサービスを選択してください。",
			LBL_BALANCE : "残高 : ",
			LBL_PRINT : "印刷",
			LBL_COPY : "コピー"
		},
		CONFIRM:{
			BTN_CONFIRM:"確認します",
			BTN_CANCEL:"キャンセル",
			GUIDE_LOGOUT:["あなたはログアウトしますか？"]
		},
		ErrorPopup:{title:"エラー"},
		WarnPopup:{title:"警告"},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV : ["環境の構成が正しくありません。","","管理者に連絡してください。"],
			FAIL_COMM:["障害が通信中に発生しました。","","管理者に連絡してください。"],
			FAIL_OTHERS : ["不明なエラーが発生しました。","","管理者に連絡してください。"],

			//기동중
			FAIL_INVALID_CERTMODE : ["現在の認証モードでは、このサービスは利用できません。"],
			
			//로그인
			REQUIRE_USERID_PW : ["ユーザーIDまたはパスワードの入力が空であります。","確認して、もう一度お試しください。"],
			FAIL_LOGIN_INVALID : ["あなたのIDまたはパスワードを確認してください。","未登録のID.","あなたは間違ったIDやパスワードを入力しました。"]
		}
	},
	ch:{
		Common : {
			Lang:"中国",
			CSName : "打印/复印服务",
			lbl_POPUP_confirm	:	"组",
			lbl_POPUP_cancel	:	"取消",
			lbl_POPUP_close	:	"关",
			UnknownUserName : "_No User",
			title : "All-in-One Services",
			tray_unit: "단",
			tray_bar:"-",
			tray_error: "ERROR",
			CS_NUMBER: "CS-RM-XXXX0",//コンテンツ識別子
			ServerSetName : "서버환경설정"
		},
		UNIT:{
			WON : "韩元"
		},
		LOGIN:{
			LOGIN_ID_LABEL : "ID",
			LOGIN_PW_LABEL : "PASSWORD",
			LOGIN_BTN_LABEL : "登录",
			LOGIN_GUEST_BTN_LABEL : "Non-member Copy",//2017.02.15 FXKIS IPrint 비회원 복사 기능 추가 refs #4261
			DRCT_PRINT_BTN_LABEL :"Direct Print",
			GUIDE_ID:"ID",
			GUIDE_PW:"PASSWORD"
		},
		SERVICE_SELECT:{
			GUIDE_MESSAGE : "请选择所需的服务.",
			LBL_BALANCE : "余额 : ",
			LBL_PRINT : "打印",
			LBL_COPY : "复制"
		},
		CONFIRM:{
			BTN_CONFIRM:"确认",
			BTN_CANCEL:"取消",
			GUIDE_LOGOUT:["你要注销？"]
		},
		ErrorPopup:{title:"错误"},
		WarnPopup:{title:"警告"},
		ERROR_MESSAGE:{
			//공통
			FAIL_ENV : ["环境配置不正确.","","请与管理员联系."],
			FAIL_COMM:["通信过程中发生故障.","","请与管理员联系."],
			FAIL_OTHERS : ["未知的故障发生.","","请与管理员联系."],

			//기동중
			FAIL_INVALID_CERTMODE : ["在当前的认证模式是不适用于这项服务"],
			
			//로그인
			REQUIRE_USERID_PW : ["用户ID或密码是空的.","请证实并再试一次."],
			FAIL_LOGIN_INVALID : ["请检查您的ID或密码.","未注册ID","您输入了错误的ID或密码."],
		}
	}
};