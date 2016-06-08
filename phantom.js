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
EventTypes.KeyPress = 23;



function PhantomRender(document) {
	this.document = document;
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

PhantomRender.prototype.cleanStringForXpath = function(str, escape)  {
    var parts  = str.match(/[^'"]+|['"]/g);
    parts = parts.map(function(part){
        if (part === "'")  {
            return '"\'"'; // output "'"
        }

        if (part === '"') {
            return "'\"'"; // output '"'
        }
        return "'" + part + "'";
    });
    var xpath = '';
    if(parts.length>1) {
      xpath = "concat(" + parts.join(",") + ")";
    } else {
      xpath = parts[0];
    }
    if(escape) xpath = xpath.replace(/(["])/g, "\\$1");
    return xpath;
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



PhantomRender.prototype.content = function(text) {
  this.document.writeln("    ... " + text);
}

PhantomRender.prototype.pyout = function(text) {
  this.document.writeln("    " + text);
}


PhantomRender.prototype.regexp_escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s\/]/g, "\\$&");
};


PhantomRender.prototype.render = function() {

  var etypes = EventTypes;
  this.document.open();
  this.document.write("<" + "pre" + ">");
  this.writeHeader();
  var last_down = null;
  var forget_click = false;
  
  for (var i=0; i < this.items.length; i++) {
    var item = this.items[i];
   
    if(i==0) {
        if(item.type!=etypes.OpenUrl) {
            this.text("ERROR: the recorded sequence does not start with a url openning.");
        } else {
          this.startUrl(item);
          continue;
        }
    }
        this.s;
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
  if(i>0 && item.type==etypes.Click && 
        ((this.items[i-1].type>=etypes.CheckPageTitle && this.items[i-1].type<=etypes.CheckImageSrc) || this.items[i-1].type==etypes.ScreenShot)) {
      continue;
    }

  if (this.dispatch[item.type]) {
      this[this.dispatch[item.type]](item);
    }
  }
  
  this.writeFooter();
  this.document.write("<" + "/" + "pre" + ">");
  this.document.close();
}

PhantomRender.prototype.rewriteUrl = function(url) {
  return url;
}

PhantomRender.prototype.pyrepr = function(text, escape) {
  var s = text;
  if (escape) s = s.replace(/(['"])/g, "\\$1");
  var s = "'" + s + "'"; 
  return s;
}

PhantomRender.prototype.shortUrl = function(url) {
  return url.substr(url.indexOf('/', 10), 999999999);
}




PhantomRender.prototype.openUrl = function(item) {
  var url = this.pyrepr(this.rewriteUrl(item.url));
  this.statement("page.open('" + url + ", function(status) {", 0)
}


PhantomRender.prototype.pageLoad = function(item) {
  var url = this.pyrepr(this.rewriteUrl(item.url));
  this.history.push(url);
}

PhantomRender.prototype.normalizeWhitespace = function(s) {
  return s.replace(/^\s*/, '').replace(/\s*$/, '').replace(/\s+/g, ' ');
}

PhantomRender.prototype.getControl = function(item) {
  var type = item.info.type;
  var tag = item.info.tagName.toLowerCase();
  var selector;
  if ((type == "submit" || type == "button") && item.info.value)
    selector = tag+'[type='+type+'][value='+this.pyrepr(this.normalizeWhitespace(item.info.value))+']';
  else if (item.info.name)
  selector = tag+'[name='+this.pyrepr(item.info.name)+']';
  else if (item.info.id)
  selector = tag+'#'+item.info.id;
  else
  selector = item.info.selector;

  return selector;
}
  
PhantomRender.prototype.getControlXPath = function(item) {
  var type = item.info.type;
  var way;
  if ((type == "submit" || type == "button") && item.info.value)
    way = '@value=' + this.pyrepr(this.normalizeWhitespace(item.info.value));
  else if (item.info.name)
    way = '@name=' + this.pyrepr(item.info.name);
  else if (item.info.id)
  way = '@id=' + this.pyrepr(item.info.id);
  else
    way = 'TODO';

  return way;
}

PhantomRender.prototype.getLinkXPath = function(item) {
  var way;
  if (item.text)
    way = 'normalize-space(text())=' + this.cleanStringForXpath(this.normalizeWhitespace(item.text), true);
  else if (item.info.id)
    way = '@id=' + this.pyrepr(item.info.id);
  else if (item.info.href)
    way = '@href=' + this.pyrepr(this.shortUrl(item.info.href));
  else if (item.info.title)
    way = 'title='+this.pyrepr(this.normalizeWhitespace(item.info.title));

  return way;
}

PhantomRender.prototype.getFormSelector = function(item) {
  var info = item.info;
  if(!info.form) {
    return '';
  }
  if(info.form.name) {
        return "form[name=" + info.form.name + "] ";
    } else if(info.form.id) {
    return "form#" + info.form.id + " ";
  } else {
    return "form ";
  }
}


PhantomRender.prototype.click = function(item) {
  var tag = item.info.tagName.toLowerCase();
  if (!(tag == 'a' || tag == 'input' || tag == 'button')) {
    this.statement("var e = document.createEvent('MouseEvents');", item);
    this.statement("e.initMouseEvent('click', true, true, window" + item.x + ',' + item.y + ");");
    this.statement("a.dispatchEvent(e);");
 }
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
  	chrome.runtime.sendMessage({action: "stop"}, function(response) {
      script_generate.items = response.items;
      if (script_generate.items) {
      script_generate.render();   
      } 
  });
}
