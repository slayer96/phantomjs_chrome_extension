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


PhantomRender.prototype.content = function(text) {
  this.document.writeln("    ... " + text);
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
  this.document.open();
	this.writeHeader();
  this.document.write("<" + "pre" + ">");

  var last_down = null;
  var forget_click = false;

	for (var i=0; i < this.items.length; i++) {
    var item = this.items[i];
    if (item.type == etypes.Comment)
      this.space();
    
    for (var i=0; i < this.items.length; i++) {
    var item = this.items[i];
    if (item.type == etypes.Comment)
      this.space();
    
    if(i==0) {
        if(item.type!=etypes.OpenUrl) {
            this.text("ERROR: the recorded sequence does not start with a url openning.");
        } else {
          this.startUrl(item);
          continue;
        }
    }

    // remember last MouseDown to identify drag
    if(item.type==etypes.MouseDown) {
      last_down = this.items[i];
      continue;
    }
    if(item.type==etypes.MouseUp && last_down) {
      if(last_down.x == item.x && last_down.y == item.y) {
        forget_click = false;
        continue;
      } else {
        item.before = last_down;
        this[this.dispatch[etypes.MouseDrag]](item);
        last_down = null;
        forget_click = true;
        continue;
      }
    }
    if(item.type==etypes.Click && forget_click) {
      forget_click = false;
      continue;
    }

    // we do not want click due to user checking actions
    if(i>0 && item.type==etypes.Click && 
            ((this.items[i-1].type>=etypes.CheckPageTitle && this.items[i-1].type<=etypes.CheckImageSrc) || this.items[i-1].type==etypes.ScreenShot)) {
        continue;
    }

    if (this.dispatch[item.type]) {
      this[this.dispatch[item.type]](item);
    }
    if (item.type == etypes.Comment)
      this.space();
  }
  this.writeFooter();
  this.document.write("<" + "/" + "pre" + ">");
  this.document.close();
}
}

PhantomRender.prototype.writeFooter = function() {
  this.statement("phantom.exit();", 0);
  this.statement("});");
}

PhantomRender.prototype.writeHeader = function() {
	this.text("/* ------------------------------- ", 0);
	this.text(" Phantom generator ", 0);
	this.text(" --------------------------------- /*", 0);
	this.space();

	this.statement("var page = require('webpage').create();", 0)
	this.space();
}


PhantomRender.prototype.urlOpen = function(url) {
	this.statement("page.open('" + url + "', function() {")
}


////////////

PhantomRender.prototype.mousedrag = function(item) {
  if(this.with_xy) {
    this.statement('casper.then(function() {');
    this.statement('    this.mouse.down('+ item.before.x + ', '+ item.before.y +');');
    this.statement('    this.mouse.move('+ item.x + ', '+ item.y +');');
    this.statement('    this.mouse.up('+ item.x + ', '+ item.y +');');
    this.statement('});');
  }
}

//////////


var script_generate = new PhantomRender(document);
window.onload = function onpageload() {
	var with_xy = false;
  	if(window.location.search=="?xy=true") {
    	with_xy = true;
  	}
  	chrome.runtime.sendMessage({action: "get_items"}, function(response) {
      script_generate.items = response.items;
      script_generate.render(with_xy);    
  });
}


