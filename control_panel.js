//-----------------------------------------------
// Proxy to access current tab recorder instance
// ----------------------------------------------
function RecorderProxy() {
    this.active = null;
}

RecorderProxy.prototype.start = function(url) {
  chrome.tabs.getSelected(null, function(tab) {
      chrome.runtime.sendMessage({action: "start", recorded_tab: tab.id, start_url: url});
  });
}

RecorderProxy.prototype.stop = function() {
    chrome.runtime.sendMessage({action: "stop"});
}

RecorderProxy.prototype.open = function(url, callback) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "open", 'url': url}, callback);
    });
}

RecorderProxy.prototype.addComment = function(text, callback) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "addComment", 'text': text}, callback);
    });
}

//-----------------------------------------------
// UI
//----------------------------------------------
function RecorderUI() {
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
  e = document.getElementById("bshow");
  e.style.display = 'none';
  //e = document.getElementById("bshowxy");
  //e.style.display = 'none';
}

RecorderUI.prototype.stop = function() {
  ui.set_stopped();
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
 // e = document.getElementById("bshowxy");
  //e.style.display = '';
}


RecorderUI.prototype.show = function(options) {
  if(options && options.xy) {
    chrome.tabs.create({url: "./phantom.html?xy=true"});
  } else {
    chrome.tabs.create({url: "./phantom.html"});
  }
}


var ui;

// bind events to ui elements
window.onload = function(){
    document.querySelector('input#bstart').onclick=function() {ui.start(); return false;};
    document.querySelector('input#bstop').onclick=function() {ui.stop(); return false;};
    document.querySelector('input#bshow').onclick=function() {ui.show(); return false;};
    //document.querySelector('input#bshowxy').onclick=function() {ui.show({xy: true}); return false;};
    ui = new RecorderUI();
}