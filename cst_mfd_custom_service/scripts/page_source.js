var glbPageSource = [];
glbPageSource["page_waiting"]='';
glbPageSource["page_menu"]=
	'<div id="bg_page_menu" />'
	+ '<div id="lyr_MP_content">'
		+ '<ul id="lyr_MP_serviceMenu" class="main"> </ul>'
		+ '<button id="btn_MP_faxinfo" class="btn">'
			+ '<div id="lbl_MP_faxinfo" class="lbl"></div>'
		+ '</button>'
		+ '<div id="lyr_MP_message" > </div>'
		+ '<div id="txt_MP_message" > </div>'
		+ '<ul id="lyr_MP_language" >'
			+ '<div id="btn_MP_language_ko" class="btn_lang" >'
				+ '<img src="" alt="" class="icn" id="icn_MP_language_ko" />'
			+ '</div>'
			+ '<div id="btn_MP_language_en" class="btn_lang" >'
				+ '<img src="" alt="" class="icn" id="icn_MP_language_en" />'
			+ '</div>'
		+ '</ul>'
	+ '</div>';
glbPageSource["page_otid"] =
	'<div id="lyr_OTID_wrapper" class="lyr">'
		+ '<div id="img_OTID_BG" />'
		+ '<span id="lbl_OTID_guide"></span>'
		+ '<input type="text" id="tbx_OTID" maxlength="8">'
		+ '<div id="lyr_OTID_btn_wrapper" class="btn">'
			+ '<div id="btn_OTID_confirm" class="btn">'
				+ '<img id="img_OTID_confirm" class="btnBg" />'
				+ '<div id="lbl_OTID_confirm" class="lbl"></div>'
			+ '</div>'
			+ '<div id="btn_OTID_cancel" class="btn">'
				+ '<img id="img_OTID_cancel" class="btnBg" />'
				+ '<div id="lbl_OTID_cancel" class="lbl"></div>'
			+ '</div>'
		+ '</div>'
	+ '</div>';
glbPageSource["pop_chargeInfoPopup"]=
	'<div id="lyr_CP_wrapper" class="lyr">'
		+ '<div id="tit_CP_joblist" class="lbl"></div>'
		+ '<div id="tit_CP_unitPrice" class="lbl"></div>'
		+ '<div id="tit_CP_totalPrice" class="lbl"></div>'
		+ '<div id="txt_CP_colorMode" class="lbl"></div>'
		+ '<div id="txt_CP_outSize" class="lbl"></div>'
		+ '<div id="txt_CP_outDuplex" class="lbl"></div>'
		+ '<div id="txt_CP_outPages" class="lbl"></div>'
		+ '<div id="txt_CP_outCopies" class="lbl"></div>'
		+ '<div id="lbl_CP_joblist" class="lbl"></div>'
		+ '<div id="lbl_CP_unitPrice" class="lbl"></div>'
		+ '<div id="lbl_CP_totalPrice" class="lbl"></div>'
		+ '<div id="lbl_CP_msg" >'
			+ '<ul>'
				+ '<li>'
					+ '<div id="txt_CP_msg0">&nbsp;</div>'
				+ '</li>'
				+ '<li>'
					+ '<div id="txt_CP_msg1">&nbsp;</div>'
				+ '</li>'
				+ '<li>'
					+ '<div id="txt_CP_msg2">&nbsp;</div>'
				+ '</li>'
			+ '</ul>'
		+ '</div>'
		+ '<div id="btn_confirm" class="btn ">'
			+ '<img id="img_confirm" class="btnBg" />'
			+ '<div id="lbl_confirm" class="lbl"></div>'
		+ '</div>'
		+ '<div id="btn_DP_CP_cancel" class="btn ">'
			+ '<img id="img_DP_CP_cancel" class="btnBg" />'
			+ '<div id="lbl_DP_CP_cancel" class="lbl"></div>'
		+ '</div>'
	+ '</div>';
glbPageSource["pop_printingPopup"]=
	'<img id="img_printer" />'
	+ '<div id="lyr_PP_aniWrapper"></div>'
	+ '<div id="lbl_pay_amount"></div>'
	+ '<div id="lbl_printing_progress"></div>'
	+ '<img id="img_printing_progress_bar" />';
glbPageSource["pop_scanningPopup"]=
	'<div id="lyr_SP_wrapper" class="lyr">'
		+ '<img id="img_scanner" />'
		+ '<div id="lyr_SP_aniWrapper"></div>'
		+ '<div id="lbl_scanning_msg"></div>'
		+ '<div id="lbl_scanning_progress"></div>'
		+ '<img id="img_scanning_progress_bar" />'
	+ '</div>';
glbPageSource["page_copy_main"] =
	'<div id="lyr_copy_main_wrapper" class="lyr">'
		+ '<img id="copy_setting_base">'
		+ '<div id="copy_setting_title"></div>'
		+ '<img id="copy_setting_user_icon">'
		+ '<div id="copy_setting_user"></div>'
		+ '<img id="copy_setting_cancel_btn">'
		+ '<div id="copy_setting_cancel_btn_msg"></div>'
		+ '<div id="copy_setting_start_btn" class="btn ">'
			+ '<img id="img_copy_setting_start_btn" class="btnBg" />'
			+ '<div id="lbl_copy_setting_start_btn" class="lbl"></div>'
		+ '</div>'
		+ '<div id="copy_setting_src_duplex_label"></div>'
		+ '<select id="copy_setting_src_duplex" class="select"></select>'
		+ '<div id="copy_setting_duplex_label"></div>'
		+ '<select id="copy_setting_duplex" class="select"></select>'
		+ '<div id="copy_setting_color_label"></div>'
		+ '<select id="copy_setting_color" class="select"></select>'
		+ '<div id="copy_setting_dpi_label"></div>'
		+ '<select id="copy_setting_dpi" class="select"></select>'
		+ '<div id="copy_setting_mag_label"></div>'
		+ '<select id="copy_setting_mag" onchange="MagOptionCheck()" class="select"></select>'
		+ '<div id="copy_setting_output_size_label"></div>'
		+ '<select id="copy_setting_output_size" class="select"></select>'
		+ '<div id="copy_setting_copies_label"></div>'
		+ '<input type="number" id="box_copy_setting_copies" value="1" maxlength="2">'
		+ '<button id="copy_setting_copies_plus_btn"> + </button>'
		+ '<button id="copy_setting_copies_minus_btn"> - </button>'
		+ '<div id="copy_setting_mag_manual_label"></div>'
		+ '<input type="text" id="box_copy_setting_manual_mag" value="100" maxlength="4" onchange="MagValueChange()">'
		+ '<button id="copy_setting_manual_mag_plus_btn"> + </button>'
		+ '<button id="copy_setting_manual_mag_minus_btn"> - </button>'
	+ '</div>';
glbPageSource["page_scan_type_select"] =
	'<div id="lyr_scan_type_select_wrapper" class="lyr">'
		+ '<img id="img_usb_input">'
		+ '<div id="msg_not_scan_to_usb"></div>'
		+ '<img id="img_center_line">'
		+ '<div id="btn_scan_to_usb" class="btn ">'
			+ '<img id="img_scan_to_usb" class="btnBg" />'
			+ '<div id="lbl_scan_to_usb" class="lbl"></div>'
		+ '</div>'
		+ '<div id="btn_scan_to_pc0" class="btn ">'
			+ '<img id="img_scan_to_pc0" class="btnBg" />'
			+ '<div id="lbl_scan_to_pc0" class="lbl"></div>'
		+ '</div>'
		+ '<div id="btn_scan_to_pc1" class="btn ">'
			+ '<img id="img_scan_to_pc1" class="btnBg" />'
			+ '<div id="lbl_scan_to_pc1" class="lbl"></div>'
		+ '</div>'
		+ '<div id="btn_scan_to_pc2" class="btn ">'
			+ '<img id="img_scan_to_pc2" class="btnBg" />'
			+ '<div id="lbl_scan_to_pc2" class="lbl"></div>'
		+ '</div>'
		+ '<div id="btn_scan_to_pc3" class="btn ">'
			+ '<img id="img_scan_to_pc3" class="btnBg" />'
			+ '<div id="lbl_scan_to_pc3" class="lbl"></div>'
		+ '</div>'
		+ '<div id="btn_scan_to_pc4" class="btn ">'
			+ '<img id="img_scan_to_pc4" class="btnBg" />'
			+ '<div id="lbl_scan_to_pc4" class="lbl"></div>'
		+ '</div>'
	+ '</div>';
glbPageSource["page_scan_main"] =
	'<div id="lyr_scan_main_wrapper" class="lyr">'
		+ '<img id="scan_setting_base">'
		+ '<div id="txt_scan_to_pc_setting" class="lbl"></div>'
		+ '<div id="scan_setting_title"></div>'
		+ '<img id="scan_setting_user_icon">'
		+ '<div id="scan_setting_user"></div>'
		+ '<img id="scan_setting_cancel_btn">'
		+ '<div id="scan_setting_cancel_btn_msg"></div>'
		+ '<div id="scan_setting_start_btn" class="btn ">'
			+ '<img id="img_scan_setting_start_btn" class="btnBg" />'
			+ '<div id="lbl_scan_setting_start_btn" class="lbl"></div>'
		+ '</div>'
		+ '<div id="scan_setting_src_duplex_label"></div>'
		+ '<select id="scan_setting_src_duplex" class="select"></select>'
		+ '<div id="scan_setting_color_label"></div>'
		+ '<select id="scan_setting_color" class="select"></select>'
		+ '<div id="scan_setting_dpi_label"></div>'
		+ '<select id="scan_setting_dpi" class="select"></select>'
		+ '<div id="scan_setting_mag_label"></div>'
		+ '<select id="scan_setting_mag" class="select"></select>'
	+ '</div>';
glbPageSource["page_fax_main"] =
	'<div id="lyr_fax_main_wrapper" class="lyr">'
		+ '<img id="fax_setting_base">'
		+ '<div id="fax_setting_title"></div>'
		+ '<img id="fax_setting_user_icon">'
		+ '<div id="fax_setting_user"></div>'
		+ '<img id="fax_setting_cancel_btn">'
		+ '<div id="fax_setting_cancel_btn_msg"></div>'
		+ '<div id="faxnumber_input_label"></div>'
		+ '<input type="text" id="tbx_faxnumber_input" maxlength="25">'
		+ '<div id="faxnumber_input_info"></div>'
		+ '<div id="fax_setting_start_btn" class="btn ">'
			+ '<img id="img_fax_setting_start_btn" class="btnBg" />'
			+ '<div id="lbl_fax_setting_start_btn" class="lbl"></div>'
		+ '</div>'
		+ '<div id="fax_setting_src_duplex_label"></div>'
		+ '<select id="fax_setting_src_duplex" class="select"></select>'
		+ '<div id="fax_setting_dpi_label"></div>'
		+ '<select id="fax_setting_dpi" class="select"></select>'
		+ '<div id="fax_setting_color_label"></div>'
		+ '<select id="fax_setting_color" class="select"></select>'
	+ '</div>';
glbPageSource["pop_noticePopup"] =
	'<div id="tit_NT_title" class="lbl"></div>'
	+ '<div id="tit_NT_message" class="lbl"></div>'
	+ '<img id="img_NT_qrcode">'
	+ '<div id="btn_NT_confirm" class="btn ">'
		+ '<img id="img_NT_confirm" class="btnBg" />'
		+ '<div id="lbl_NT_confirm" class="lbl"></div>'
	+ '</div>'
	+ '<div id="btn_NT_admin" class="btn ">'
		+ '<img id="img_NT_admin" class="btnBg" />'
		+ '<div id="lbl_NT_admin" class="lbl"></div>'
	+ '</div>'
	+ '<div id="btn_NT_retry" class="btn ">'
		+ '<img id="img_NT_retry" class="btnBg" />'
		+ '<div id="lbl_NT_retry" class="lbl"></div>'
	+ '</div>';
glbPageSource["page_preference"] =	// 국내용으로 설정은 한글만 사용
	'<div id="tit_PF_title" class="lbl"></div>'
	+ '<div id="lbl_PF_bar_title" class="lbl"></div>'
	+ '<input type="text" id="tbx_PF_bar_title" maxlength="128">'
	+ '<div id="lbl_PF_server_url" class="lbl"></div>'
	+ '<input type="text" id="tbx_PF_server_url" maxlength="128">'
	+ '<div id="lbl_PF_service_scan" class="lbl"></div>'
	+ '<select id="scan_use_setting" class="select"></select>'
	+ '<div id="lbl_PF_service_native_scan" class="lbl"></div>'
	+ '<select id="scan_native_setting" class="select"></select>'
	+ '<div id="lbl_PF_service_fax" class="lbl"></div>'
	+ '<select id="fax_use_setting" class="select"></select>'
	+ '<div id="lbl_PF_service_native_fax" class="lbl"></div>'
	+ '<select id="fax_native_setting" class="select"></select>'
	+ '<div id="lbl_PF_scan_type_setting" class="lbl"></div>'
	+ '<select id="select_scan_type_setting" class="select"></select>'
	+ '<div id="msg_PF_scan_set_fail" class="lbl"></div>'
	+ '<div id="msg_PF_fax_set_fail" class="lbl"></div>'
	+ '<div id="msg_PF_fax_set_fail" class="lbl"></div>'
	+ '<div id="lbl_PF_charge_mode" class="lbl"></div>'
	+ '<select id="select_PF_charge_mode" class="select"></select>'
	+ '<div id="lbl_PF_charge_url" class="lbl"></div>'
	+ '<input type="text" id="tbx_PF_charge_url" maxlength="128">'
	+ '<button id="btn_PF_setting_save">적용</button>'
	+ '<button id="btn_PF_setting_cancel">취소</button>'
	+ '<button id="btn_PF_find_scan_pc">Scan PC 설정</button>'
	+ '<button id="btn_PF_mfd_home">복합기 Home</button>'
	+ '<div id="btn_PF_find_scan_msg"></div>';
glbPageSource["page_preference2"] =	// 국내용으로 설정은 한글만 사용
	'<div id="tit_PF2_title" class="lbl"></div>'
	+ '<button id="btn_PF2_setting_save">적용</button>'
	+ '<button id="btn_PF2_setting_cancel">취소</button>'
	+ '<button id="btn_PF_mfd_home">복합기 Home</button>'
	+ '<div id="lbl_PF2_ip">IP 입력</div>'
	+ '<div id="lbl_PF2_name">PC명 입력</div>'
	+ '<div id="lbl_PF2_pc0">PC 1번:</div>'
	+ '<div id="lbl_PF2_pc1">PC 2번:</div>'
	+ '<div id="lbl_PF2_pc2">PC 3번:</div>'
	+ '<div id="lbl_PF2_pc3">PC 4번:</div>'
	+ '<div id="lbl_PF2_pc4">PC 5번:</div>'
	+ '<input type="text" id="tbx_PF2_pc_ip0" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_ip1" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_ip2" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_ip3" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_ip4" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_name0" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_name1" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_name2" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_name3" maxlength="128">'
	+ '<input type="text" id="tbx_PF2_pc_name4" maxlength="128">';
