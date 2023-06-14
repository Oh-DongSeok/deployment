/* 
 * Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.
 *
 * Java Script Library for Apeos Intrgration Plus.
 * ver2.0.0
 */

var JFManager;
if (!JFManager) JFManager = {};

(function() {


/**
 * public class: JFManager
 */
JFManager = function(url, success_CB, error_CB) {

	this.success_CB = success_CB;
	this.error_CB = error_CB;
	
	this.CreateFaxJobFlow_CB.bind = this.bind;
	WebServiceReq.WebService.LoadTemplate(url, this.CreateFaxJobFlow_CB.bind(this), error_CB);
}


JFManager.prototype = {

	bind : function(target,arg) {
		var _func = this;
		return function() {
			var args = [];
			for(i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
				if(arg!=undefined){ args.push(arg); }
				_func.apply(target,args);
		}
	},

	jobFlow: null,
	
	userName: null,
	
	password: null,
	
	success_CB: null,
	
	error_CB: null,
	
	CreateFaxJobFlow_CB: function(req) {
		this.jobFlow = req.responseXML;
		this.success_CB();
	},
	
	SetValue: function(xpath, value) {
		var _node = this.GetNode(this.jobFlow, xpath);

		if (_node) {
			for(var i = 0; i < _node.length; i++){
				if (_node[i].nodeType == Node.ELEMENT_NODE || _node[i].nodeType == Node.ATTRIBUTE_NODE) {
					if (_node[i].firstChild == null) {
						_node[i].appendChild(this.jobFlow.createTextNode(value));
					} else {
						if(value != null) {
							_node[i].firstChild.nodeValue = value;
						}
					}
				}
			}
		}
	},
	
	Execute: function(userName, password, success_CB, error_CB) {
	
		this.userName = userName;
		this.password = password;
		this.success_CB = success_CB;
		this.error_CB = error_CB;
	
		this.GetDevInfo();
	},

	GetDevInfo: function() {
		try {
			var _devAccess = new DeviceAccess(this.userName, this.password);
			this.GetDevInfo_CB.bind = this.bind;
			_devAccess.GetDeviceInformation(this.GetDevInfo_CB.bind(this), error_CB);
		}
		catch (e) {
			error_CB(e);
		}
	},

	GetDevInfo_CB: function(deviceInfo) {
		try {
			
			if (deviceInfo.MachineOID.match(/^1\.3\.6\.1\.4\.1\.297\.1\.11\.93\.1\.35\.20\.\d+\.1$/) != null
				&& deviceInfo.SoftwareVersion.match(/^1\.\d\.|^1\.4\d\.|^1\.10\d\./) != null) {
				var _jobManager = new JobManager(this.userName, this.password);
				this.CheckJobStatus_CB.bind = this.bind;
				_jobManager.CheckJobStatus("active", this.CheckJobStatus_CB.bind(this), error_CB);
			}
			else {
				this.LoadTemp();
			}
		}
		catch (e) {
			error_CB(e);
		}
	},

	CheckJobStatus_CB: function(req) {
		if(req == false) {
			this.LoadTemp();
		}
		else {
			error_CB();
		}
	},
	
	LoadTemp: function() {
		var _soapTemplate = "./template/ExecuteJobTemplate2.xml";
		
		try {	
			this.CreateSoapMessage_CB.bind = this.bind;
			WebServiceReq.WebService.LoadTemplate(_soapTemplate, this.CreateSoapMessage_CB.bind(this), error_CB);
		}
		catch (e) {
			error_CB(e);
		}
	},
	
	CreateSoapMessage_CB: function(req) {
	
		var _hostNameOrIpAddress = "127.0.0.1";
		var _portNumber = "80";
		var _useSSL = false;
	
		var _soap = req.responseXML;

		var _jthExt = this.jobFlow.getElementsByTagName("JobTemplate")[0];
		var _jthLcl = _soap.getElementsByTagName("JobTemplateHeader")[0];
		var _jth = this.importNode(_soap, _jthLcl, _jthExt);

		var _jtbLcl = _soap.getElementsByTagName("RawData")[0];

		this.importNode(_soap, _jtbLcl, this.jobFlow.documentElement);

		xmlSerializer = new XMLSerializer();
		_msg = xmlSerializer.serializeToString(_soap);

		var _ws = new WebServiceReq.WebService();
		_ws.Host = _hostNameOrIpAddress;
		_ws.Port = _portNumber;
		_ws.UseSSL = _useSSL;
		_ws.CallJobExecService(this.userName, this.password, _msg, this.success_CB, this.error_CB);
	},
	
	importNode: function(doc, target, node) {

		var newnode = null;

		if (node.nodeType == Node.ELEMENT_NODE) {
			var _prefix = node.nodeName.split(":")[0];
			if (_prefix == "jt") {
				newnode = doc.createElementNS(NS.JT, node.tagName);
			}
			else if (_prefix == "soapENV") {
				newnode = doc.createElementNS(NS.SOAP, node.tagName);
			}
			else if (_prefix == "soap") {
				newnode = doc.createElementNS(NS.SOAP, node.tagName);
			}
			else {
				newnode = doc.createElement(node.tagName);
			}

			var attrs = node.attributes;
			var i = 0;
			while (attrs.item(i) != null) {
				newnode.setAttribute(attrs.item(i).nodeName, attrs.item(i).nodeValue);
				i++;
			}
			for (var n = node.firstChild; n != null; n = n.nextSibling)
			{
				newnode = this.importNode(doc, newnode, n);
			}
		} else if (node.nodeType == Node.TEXT_NODE) {
			newnode = doc.createTextNode(node.nodeValue);
		} else if (node.nodeType == Node.COMMENT_NODE) {
			newnode = doc.createComment(node.nodeValue);
		} else {
			alert("NodeType: " + node.nodeType + " not supported val: "+node.nodeValue);
		}
		if (target != null && newnode != null) {
			target.appendChild(newnode);
		}
		return target;
	},

	GetNode: function(document, xpath) {
		var AXIS = { CHILD: '/', PARENT: '..', SELF: '.', DESCEDANT: '//', ATTRIBUTE: '@' };
		var PREDICATE = { ON: '[', OFF: ']' };
		var OPERATOR = { EQUAL: '=', NOTEQUAL: '!=' };
		
		var tokens = xpath.match(/\/\/|\.\.|((?![0-9-])[\w-]+:)?(?![0-9-])[\w-]+|"[^"]*"|'[^']*'|./g);

		var steps = createSteps(tokens);

		if(steps.length > 20) {
			return null;
		}

		var targetNodes = new Array(document);
		for (var i = 0; i < steps.length; i++) {
			targetNodes = getTargetNodes(targetNodes, steps[i]);
		}
		
		return targetNodes;
		
		function createSteps(tokens) {
			var isPredicate = false;
			var steps = new Array();
			var countPredicate = 0;
			
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				
				switch (token) {
					case AXIS.CHILD:
					case AXIS.DESCEDANT:
						if (!isPredicate) {
							if (tmp) { steps.push(analyticsStep(tmp)); }
							var tmp = new Array();
						}
						break;
						
					case PREDICATE.ON:
					case PREDICATE.OFF:
						isPredicate = (token == PREDICATE.ON) ? true : false;
						countPredicate = (token == PREDICATE.ON) ? countPredicate + 1 : countPredicate - 1;
						isPredicate = (countPredicate == 0) ? false : true;
						break;
					
					default:
						break;
				}
				if(tmp != undefined) {
					tmp.push(token);
				}
			}
			if(tmp != undefined) {
				steps.push(analyticsStep(tmp));
			}
			return steps;
		}
		
		function analyticsStep(tokens) {
			var isPredicate = false;
			var countPredicate = 0;
			
			var step = { axis: tokens[0], nodetest: new Array(), predicates: new Array() };
			for (var i = 1; i < tokens.length; i++) {
				var token = tokens[i];
				switch (token) {
					case PREDICATE.ON:
					case PREDICATE.OFF:
						if (token == PREDICATE.ON) {
							if(countPredicate == 0) {
								isPredicate = true;
								var tmp = new Array();
							}
							if(countPredicate != 0) { tmp.push(token); }
							countPredicate++;
						} else {
							countPredicate--;
							if (countPredicate != 0) { tmp.push(token); }
						}
						if(countPredicate == 0) {
							isPredicate = false;
							if (tmp.length != 0) { step.predicates.push(tmp); }
						}
						continue;
					
					default:
						if (isPredicate) {

							tmp.push(token);
						} else {
							step.nodetest.push(token);
						}
						break;
				}
			}
			
			return step;
		}
		
		function getTargetNodes(targetNodes, step) {
			var returnNodes = [];
			
			for (var i = 0; i < targetNodes.length; i++) {
				var tmpNodes = [];
				switch (step.axis) {
					case AXIS.CHILD:
						tmpNodes = analyticsChildStep(targetNodes[i], step);
						break;
						
					case AXIS.DESCEDANT:
						tmpNodes = analyticsDescedantStep(targetNodes[i], step);
						break;
						
					default:
						break;
				}
				
				for (var j = 0; j < tmpNodes.length; j++) {
					returnNodes.push(tmpNodes[j]);
				}
			}
			
			return returnNodes;
		}
		
		function analyticsChildStep(target, step) {
			var returnNodes = [];
			
			if (step.nodetest[0] == AXIS.ATTRIBUTE) {
				for (var i = 0; i < target.attributes.length; i++) {
					if (target.attributes[i].nodeName == step.nodetest[1]) {
						returnNodes.push(target.attributes[i]);
					}
				}
			} else if (step.nodetest[0] == AXIS.SELF) {
				returnNodes.push(target);
			} else if (step.nodetest[0] == AXIS.PARENT) {
				returnNodes.push(target.parentNode);
			} else if (step.nodetest[0] + step.nodetest[1] + step.nodetest[2] == "node()") {
				returnNodes = target.childNodes;
			} else {
				for (var i = 0; i < target.childNodes.length; i++) {
					if (target.childNodes[i].nodeName == step.nodetest[0]) {
						returnNodes.push(target.childNodes[i]);
					}
				}
			}
			
			returnNodes = checkPredicates(returnNodes, step.predicates);
			
			return returnNodes;
		}
		
		function analyticsDescedantStep(target, step) {
			var returnNodes = [];
			
			if (step.nodetest[0] == AXIS.ATTRIBUTE) {
				for (var i = 0; i < target.childNodes.length; i++) {
					if(target.childNodes[i].nodeName !== "#text") {
						for (var j = 0; j < target.childNodes[i].attributes.length; j++) {
							if (target.childNodes[i].attributes[j].nodeName == step.nodetest[1]) {
								returnNodes.push(target.childNodes[i].attributes[j]);
							}
						}
					}
				}
			} else if (step.nodetest[0] == AXIS.SELF) {
				returnNodes.push(target);
				returnNodes = getDescendant(target, returnNodes);
			} else if (step.nodetest[0] == AXIS.PARENT) {
				if (target.parentNode) {
					returnNodes.push(target.parentNode);
				}
				if (target.hasChildNodes) {
					returnNodes.push(target);
					returnNodes = getHasChildDescendant(target, returnNodes);
				}
			} else if (step.nodetest[0] + step.nodetest[1] + step.nodetest[2] == "node()") {
				allNodePush(target, returnNodes)
			} else {
				var tmpNodes = target.getElementsByTagName(removePrefix(step.nodetest[0]));
				for (var i = 0; i < tmpNodes.length; i++) {
					returnNodes.push(tmpNodes[i]);
				}
			}
			
			returnNodes = checkPredicates(returnNodes, step.predicates);
			
			return returnNodes;
		}

		function allNodePush(target, returnNodes) {
			for(var i = 0; i < target.childNodes.length; i++){
				returnNodes.push(target.childNodes[i]);
				allNodePush(target.childNodes[i], returnNodes);
			}
		}
		
		function getDescendant(target, returnNodes) {
			for (var i = 0; i < target.childNodes.length; i++) {
				if (target.childNodes[i].hasChildNodes) {
					returnNodes = getDescendant(target.childNodes[i], returnNodes);
				} else {
					returnNodes.push(target.childNodes[i]);
				}
			}
			return returnNodes;
		}
		
		function getHasChildDescendant(target, returnNodes) {
			for (var i = 0; i < target.childNodes.length; i++) {
				if (target.childNodes[i].hasChildNodes) {
					returnNodes.push(target.childNodes[i]);
					returnNodes = getHasChildDescendant(target.childNodes[i], returnNodes);
				}
			}
			return returnNodes;
		}
		
		function checkPredicates(nodes, predicates) {
			if (predicates.length == 0) {
				return nodes;
			}
			for (var i = 0; i < predicates.length; i++) {
				var tmpNodes = [];
				for (var j = 0; j < nodes.length; j++) {
					if (isMatchPredicate(nodes[j], predicates[i])) {
						tmpNodes.push(nodes[j]);
					}
				}
				nodes = tmpNodes;
			}
			return nodes;
		}
		
		function isMatchPredicate(node, predicate) {
			if ((predicate[0] == AXIS.ATTRIBUTE) && (predicate.length == 4)) {
				// attribute=
				if (!node.hasAttributes()) {
					// no attribute
					return false;
				}
				for(var i = 0; i < node.attributes.length; i++) {
					if(node.attributes[i].nodeName == predicate[1]) {
						var attribute = node.attributes[i].nodeValue;
						break;
					}
				}
				switch (predicate[2]) {
					case OPERATOR.EQUAL:
						return (attribute == removeSingleQuart(predicate[3]));
					default:
						return false;
				}
			} else if ((predicate[0] == AXIS.ATTRIBUTE) && (predicate.length == 5)) {
				// attribute!=
				if (!node.hasAttributes()) {
					// no attribute
					return false;
				}
				for(var i = 0; i < node.attributes.length; i++) {
					if(node.attributes[i].nodeName == predicate[1]) {
						var attribute = node.attributes[i].nodeValue;
						break;
					}
				}
				switch (predicate[2] + predicate[3]) {
					case OPERATOR.NOTEQUAL:
						return (attribute != removeSingleQuart(predicate[4]));
					default:
						return false;
				}
			} else if ((predicate[0] == "Node") && (predicate.length == 6) && (predicate[1] == "[") && (predicate[3] == "]")) {
				// Node[n]=
				var index = 1;
				for(var i = 0; i < node.childNodes.length; i++){
					if(node.childNodes[i].nodeType == Node.ELEMENT_NODE) {
						if(index == predicate[2]) {
							var newNode = node.childNodes[i];
							break;
						}
						index++;
					}
				}
				if(predicate[4] == OPERATOR.EQUAL && newNode && newNode.firstChild) {
					return (newNode.firstChild.nodeValue == removeSingleQuart(predicate[5]));
				}
				return false;
			} else if ((predicate[0] == "Node") && (predicate.length == 7) && (predicate[1] == "[") && (predicate[3] == "]")) {
				// Node[n]!=
				var index = 1;
				for(var i = 0; i < node.childNodes.length; i++){
					if(node.childNodes[i].nodeType == Node.ELEMENT_NODE) {
						if(index == predicate[2]) {
							var newNode = node.childNodes[i];
							break;
						}
						index++;
					}
				}
				if(predicate[4] + predicate[5] == OPERATOR.NOTEQUAL && newNode && newNode.firstChild) {
					return (newNode.firstChild.nodeValue != removeSingleQuart(predicate[6]));
				}
				return false;
			} else if ((predicate[0] == "node") && (predicate.length == 5) && (predicate[1] == "(") && (predicate[2] == ")")) {
				// node()=
				switch (predicate[3]) {
					case OPERATOR.EQUAL:
						for(var i = 0; i < node.childNodes.length; i++){
							if(node.childNodes[i].nodeType == Node.ELEMENT_NODE
								&& node.childNodes[i].firstChild
								&& node.childNodes[i].firstChild.nodeValue == removeSingleQuart(predicate[4])) {
								return true;
							}
						}
						return false;
					default:
						return false;
				}
			} else if ((predicate[0] == "node") && (predicate.length == 6) && (predicate[1] == "(") && (predicate[2] == ")")) {
				// node()!=
				switch (predicate[3] + predicate[4]) {
					case OPERATOR.NOTEQUAL:
						for(var i = 0; i < node.childNodes.length; i++){
							if(node.childNodes[i].nodeType == Node.ELEMENT_NODE
								&& node.childNodes[i].firstChild
								&& node.childNodes[i].firstChild.nodeValue == removeSingleQuart(predicate[5])) {
								return false;
							}
						}
						return true;
					default:
						return false;
				}
			} else if ((predicate[0] == "node") && (predicate.length == 8) && (predicate[1] == "(") 
						&& (predicate[2] == ")") && (predicate[3] == "[") && (predicate[5] == "]")) {
				// node()[n]
				var index = 1;
				for(var i = 0; i < node.childNodes.length; i++){
					if(node.childNodes[i].nodeType == Node.ELEMENT_NODE) {
						if(index == predicate[4]) {
							var newNode = node.childNodes[i];
							break;
						}
						index++;
					}
				}
				if(predicate[6] == OPERATOR.EQUAL && newNode && newNode.firstChild) {
					return (newNode.firstChild.nodeValue == removeSingleQuart(predicate[7]));
				}
				return false;
			} else if ((predicate[0] == "node") && (predicate.length == 9) && (predicate[1] == "(") 
						&& (predicate[2] == ")") && (predicate[3] == "[") && (predicate[5] == "]")) {
				// node()[n]!=
				var index = 1;
				for(var i = 0; i < node.childNodes.length; i++){
					if(node.childNodes[i].nodeType == Node.ELEMENT_NODE) {
						if(index == predicate[4]) {
							var newNode = node.childNodes[i];
							break;
						}
						index++;
					}
				}
				if(predicate[6] + predicate[7] == OPERATOR.NOTEQUAL && newNode && newNode.firstChild) {
					return (newNode.firstChild.nodeValue != removeSingleQuart(predicate[8]));
				}
				return false;
			} else if (predicate.length == 3) {
				// jt:ELEMENT=
				for(var i = 0; i < node.childNodes.length; i++){
					if(node.childNodes[i].nodeType == Node.ELEMENT_NODE && node.childNodes[i].nodeName == predicate[0]) {
						var newNode = node.childNodes[i];
						break;
					}
				}
				if(predicate[1] == OPERATOR.EQUAL && newNode && newNode.firstChild) {
					return (newNode.firstChild.nodeValue == removeSingleQuart(predicate[2]));
				}
				return false;
			} else if (predicate.length == 4) {
				// jt:ELEMENT!=
				for(var i = 0; i < node.childNodes.length; i++){
					if(node.childNodes[i].nodeType == Node.ELEMENT_NODE && node.childNodes[i].nodeName == predicate[0]) {
						var newNode = node.childNodes[i];
						break;
					}
				}
				if(predicate[1] + predicate[2] == OPERATOR.NOTEQUAL && newNode && newNode.firstChild) {
					return (newNode.firstChild.nodeValue != removeSingleQuart(predicate[3]));
				}
				return false;
			}
			return false;
		}
		
		function removePrefix(value) {
			if(value) {
				return (value.search(/:/)) ? value.split(":")[1] : value;
			}
			return "";
		}
		
		function removeSingleQuart(value) {
			return value.replace(/\'/g, "");
		}
	},
}


/**
 * public class: Namespace
 */
function NS () {}


NS.JOB = "http://www.fujifilm.com/fb/2021/03/ssm/management/job";
NS.JT = "http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate";
NS.SOAP = "http://schemas.xmlsoap.org/soap/envelope/";

})();