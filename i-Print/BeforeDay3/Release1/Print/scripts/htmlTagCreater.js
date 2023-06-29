/**
 * File List 화면의 HTML Tag생성
 */
function createFileListPageHtml()
{
	var body =document.body;

	var fileListPag = Common.getNewElement("div", {id:"page_FileList", className:"page"});
	fileListPag.addEventListener("mousedown", onPageClick, true);

	fileListPag.appendChild(Common.getNewElement("div", {id:"lbl_FL_SelectedFile", className:"lbl"}));
	fileListPag.appendChild(Common.getNewElement("div", {id:"txt_FL_SelectedFile", className:"lbl"}));
	fileListPag.appendChild(Common.getNewElement("div", {id:"lbl_FL_UserBalance", className:"lbl"}));

	var flDisplayArea = Common.getNewElement("div", {id:"lyr_FL_Display_Area", className:"loading"});
	//Loading Message
	for(var i=0; i<5; i++){
		flDisplayArea.appendChild(Common.getNewElement("div", {id:"txt_FL_NotifyMsg" + i, className:"txt_FL_NotifyMsg"}));
	}
	fileListPag.appendChild(flDisplayArea);

	fileListPag.appendChild(Common.getNewElement("img", {id:"btn_FL_pageFirst", className:"btn"}));
	fileListPag.appendChild(Common.getNewElement("img", {id:"btn_FL_pageUp", className:"btn"}));
	fileListPag.appendChild(Common.getNewElement("div", {id:"txt_FL_CurrentPage", className:"lbl"}));
	fileListPag.appendChild(Common.getNewElement("img", {id:"btn_FL_pageDown", className:"btn"}));
	fileListPag.appendChild(Common.getNewElement("img", {id:"btn_FL_pageLast", className:"btn"}));

	var flSelecAll = Common.getNewElement("div", {id:"btn_FL_SelectAll", className:"btn"});
	flSelecAll.appendChild(Common.getNewElement("img", {id:"img_FL_SelectAll", className:"btnBg"}));
	flSelecAll.appendChild(Common.getNewElement("div", {id:"lbl_FL_SelectAll", className:"lbl"}));
	fileListPag.appendChild(flSelecAll);

	var flDelete = Common.getNewElement("div", {id:"btn_FL_DeleteFile", className:"btn"});
	flDelete.appendChild(Common.getNewElement("img", {id:"img_FL_DeleteFile", className:"btnBg"}));
	flDelete.appendChild(Common.getNewElement("div", {id:"lbl_FL_DeleteFile", className:"lbl"}));
	fileListPag.appendChild(flDelete);
	
	var flPrint = Common.getNewElement("div", {id:"btn_FL_Print", className:"btn"});
	flPrint.appendChild(Common.getNewElement("img", {id:"img_FL_Print", className:"btnBg"}));
	flPrint.appendChild(Common.getNewElement("div", {id:"lbl_FL_Print", className:"lbl"}));
	fileListPag.appendChild(flPrint);

	body.appendChild(fileListPag);
}