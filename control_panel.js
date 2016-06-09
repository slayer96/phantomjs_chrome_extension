//-----------------------------------------------
// Proxy to access current tab recorder instance
// ----------------------------------------------
function RecorderProxy() {
    this.active = null;
}

RecorderProxy.prototype.start = function(url) {
<<<<<<< HEAD
	chrome.tabs.getSelected(null, function(tab) {
	    chrome.runtime.sendMessage({action: "start", recorded_tab: tab.id, start_url: url});
	});
=======
  chrome.tabs.getSelected(null, function(tab) {
      chrome.runtime.sendMessage({action: "start", recorded_tab: tab.id, start_url: url});
  });
>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
}

RecorderProxy.prototype.stop = function() {
    chrome.runtime.sendMessage({action: "stop"});
}

<<<<<<< HEAD
=======

RecorderProxy.prototype.get_item = function() {
  chrome.ta
}

>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
RecorderProxy.prototype.open = function(url, callback) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "open", 'url': url}, callback);
    });
}
<<<<<<< HEAD


=======
>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
//-----------------------------------------------
// UI
//----------------------------------------------
function RecorderUI() {
<<<<<<< HEAD
	this.recorder = new RecorderProxy();
	chrome.runtime.sendMessage({action: "get_status"}, function(response) {
	    if (response.active) {
	    	ui.set_started();
	    } else {
	    	if (!response.empty) {
	            ui.set_stopped();
	        }
	        chrome.tabs.getSelected(null, function(tab) {
                  document.forms[0].elements["url"].value = tab.url;
            });
	    }
	});
=======
  this.recorder = new RecorderProxy();
  chrome.runtime.sendMessage({action: "get_status"}, function(response) {
    //alert(response.active);
      if (response.active) {
        ui.set_started();
      } else {
        if (!response.empty) {
              ui.set_stopped();
          }
          chrome.tabs.getSelected(null, function(tab) {
                  document.forms[0].elements["url"].value = tab.url;
            });
      }
  });
>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
  
}

RecorderUI.prototype.start = function() {
    var url = document.forms[0].elements["url"].value;
    if (url == "") {
        return false;
    }
    if ( (url.indexOf("http://") == -1) && (url.indexOf("https://")) ) {
        url = "http://" + url;
    }
    ui.set_started()
    ui.recorder.start(url);
  
    return false;
}

RecorderUI.prototype.set_started = function() {
  var e = document.getElementById("bstop");
  e.style.display = '';
  e.onclick = ui.stop;
  e.value = "Stop Recording";
  e = document.getElementById("bstart");
  e.style.display = 'none';
<<<<<<< HEAD
  e = document.getElementById("bshow");
=======
  e = document.getElementById("bshowscript");
>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
  e.style.display = 'none';
}

RecorderUI.prototype.stop = function() {
  ui.set_stopped();
<<<<<<< HEAD
	ui.recorder.stop();
	return false;
}

RecorderUI.prototype.set_stopped = function() {
	var e = document.getElementById("bstop");
	e.style.display = 'none';
	e = document.getElementById("bstart");
  e.style.display = '';
	e = document.getElementById("bshow");
	e.style.display = '';
}

RecorderUI.prototype.export = function(options) {
  if(options && options.xy) {
    chrome.tabs.create({url: "./phantom.html?xy=true"});
  } else {
    chrome.tabs.create({url: "./phantom.html"});
  }
}

=======
  ui.recorder.stop();
  return false;
}

RecorderUI.prototype.set_stopped = function() {
  var e = document.getElementById("bstop");
  e.style.display = 'none';
  e = document.getElementById("bstart");
  e.style.display = '';
  e = document.getElementById("bshowscript");
  e.style.display = '';
}



RecorderUI.prototype.show = function() {
    chrome.tabs.create({url: "./phantom.html"});
}


>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
var ui;

// bind events to ui elements
window.onload = function(){
<<<<<<< HEAD
    document.querySelector('input#bstart').onclick=function() {ui.start(); return false;};
    document.querySelector('input#bstop').onclick=function() {ui.stop(); return false;};
    document.querySelector('input#bshow').onclick=function() {ui.export(); return false;};
    ui = new RecorderUI();
=======
    ui = new RecorderUI();
    document.querySelector('input#bstart').onclick=function() {ui.start(); return false;};
    document.querySelector('input#bstop').onclick=function() {ui.stop(); return false;};
    document.querySelector('input#bshowscript').onclick=function() {ui.show(); return false;};


>>>>>>> 527daceb6555c99d3093464ace88f86619db2d1b
}