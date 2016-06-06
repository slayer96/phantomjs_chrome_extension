if (typeof(EventTypes) == "undefined") {
  	EventTypes = {};
}


EventTypes.OpenURL = 0;
EventTypes.Click = 2;
EventTypes.PageLoad = 3;



function PhantomRender(document) {
	this.document = document;

}

PhantomRender.prototype.space = function() {
	this.document.write("\n");
}

PhantomRender.prototype.text = function(_text) {
	this.document.writeln(_text);
}

PhantomRender.prototype.statement = function(_text, index) {
  	if(indent==undefined) indent = 1;
  	var output = (new Array(4*indent)).join(" ") + text;
  	this.document.writeln(output);
}
}

PhantomRender.prototype.render = function() {
	this.writeHeader();
}

PhantomRender.prototype.writeHeader = function() {
	this.text("/* ------------------------------- */", 0);
	this.text(" Phantom generator ", 0);
	this.text(" --------------------------------- ", 0);
	this.space();
	this.statement("var page = require('webpage').create();", 0)
	this.space();
}


var script_generate = new PhantomRender(document);
window.onload = function onpageload() {
	var with_xy = false;
  	if(window.location.search=="?xy=true") {
    	with_xy = true;
  	}
  	chrome.runtime.sendMessage({}, function(response) {
  		script_generate.render()
  	})
}





