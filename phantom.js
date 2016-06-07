if (typeof(EventTypes) == "undefined") {
  	EventTypes = {};
}

EventTypes.OpenUrl = 0;
EventTypes.Click = 1;
EventTypes.Change = 2;
EventTypes.Comment = 3;
EventTypes.Submit = 4;
EventTypes.CheckPageTitle = 5;
EventTypes.CheckPageLocation = 6;
EventTypes.CheckTextPresent = 7;
EventTypes.CheckValue = 8;
EventTypes.CheckValueContains = 9;
EventTypes.CheckText = 10;
EventTypes.CheckHref = 11;
EventTypes.CheckEnabled = 12;
EventTypes.CheckDisabled = 13;
EventTypes.CheckSelectValue = 14;
EventTypes.CheckSelectOptions = 15;
EventTypes.CheckImageSrc = 16;
EventTypes.PageLoad = 17;
EventTypes.ScreenShot = 18;
EventTypes.MouseDown = 19;
EventTypes.MouseUp = 20;
EventTypes.MouseDrag = 21;
EventTypes.MouseDrop = 22;
EventTypes.KeyPress = 23;d = 3;


function PhantomRender(document) {
	this.document = document;
  this.title = "Testcase";
  this.items = null;
  this.history = new Array();
  this.last_events = new Array();
  this.screen_id = 1;
  this.unamed_element_id = 1;
}

PhantomRender.prototype.space = function() {
	this.document.writeln();	
}

PhantomRender.prototype.text = function(_text) {
	this.document.writeln(_text);
}

PhantomRender.prototype.statement = function(_text, indent) {
  	if(indent==undefined) indent = 1;
  	var output = (new Array(4*indent)).join(" ") + _text;
  	this.document.writeln(output);
}


PhantomRender.prototype.content = function(_text) {
  this.document.writeln("    ... " + _text);
}


var d = {};
d[EventTypes.OpenUrl] = "openUrl";
d[EventTypes.Click] = "click";
d[EventTypes.Comment] = "comment";
d[EventTypes.Submit] = "submit";
d[EventTypes.CheckPageTitle] = "checkPageTitle";
d[EventTypes.CheckPageLocation] = "checkPageLocation";
d[EventTypes.CheckTextPresent] = "checkTextPresent";
d[EventTypes.CheckValue] = "checkValue";
d[EventTypes.CheckText] = "checkText";
d[EventTypes.CheckHref] = "checkHref";
d[EventTypes.CheckEnabled] = "checkEnabled";
d[EventTypes.CheckDisabled] = "checkDisabled";
d[EventTypes.CheckSelectValue] = "checkSelectValue";
d[EventTypes.CheckSelectOptions] = "checkSelectOptions";
d[EventTypes.CheckImageSrc] = "checkImageSrc";
d[EventTypes.PageLoad] = "pageLoad";
d[EventTypes.ScreenShot] = "screenShot";
d[EventTypes.MouseDrag] = "mousedrag";
d[EventTypes.KeyPress] = "keypress";

PhantomRender.prototype.dispatch = d;

var cc = EventTypes;


PhantomRender.prototype.render = function(with_xy) {
	this.with_xy = with_xy;
  var etypes = EventTypes;
  //this.document.open();
  this.document.write("<" + "pre" + ">");
  this.writeHeader();
  this.urlOpen();
  
  this.writeFooter();
  this.document.write("<" + "/" + "pre" + ">");
  this.document.close();
}


PhantomRender.prototype.writeFooter = function() {
  this.statement("phantom.exit();", 0);
  this.statement("});", 0);
}

PhantomRender.prototype.writeHeader = function() {
	this.text("/*-------------------------------", 0);
	this.text("Phantom generator", 0);
	this.text("-------------------------------*/", 0);
	this.space();
	this.statement("var page = require('webpage').create();", 0);
	this.statement("console.log('PhantomJS');");
} 


PhantomRender.prototype.urlOpen = function(url) {
	this.statement("page.open('" + url + "', function() {");
}


var script_generate = new PhantomRender(document);
window.onload = function onpageload() {
	var with_xy = false;
  	if(window.location.search=="?xy=true") {
    	with_xy = true;
  	}
  	chrome.runtime.sendMessage({action: "get_items"}, function(response) {
      //script_generate.items = response.items;
      script_generate.render(with_xy);    
  });
}