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


RecorderProxy.prototype.get_item = function() {
  chrome.ta
}

RecorderProxy.prototype.open = function(url, callback) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "open", 'url': url}, callback);
    });
}
//-----------------------------------------------
// UI
//----------------------------------------------
function RecorderUI() {
  this.recorder = new RecorderProxy();
  chrome.runtime.sendMessage({action: "get_status"}, function(response) {
    alert(response.active);
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
  e = document.getElementById("bshowscript");
  e.style.display = 'none';
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
  e = document.getElementById("bshowscript");
  e.style.display = '';
}



RecorderUI.prototype.show = function() {
    chrome.tabs.create({url: "./phantom.html"});
}


var ui;

// bind events to ui elements
window.onload = function(){
    ui = new RecorderUI();
    document.querySelector('input#bstart').onclick=function() {ui.start(); return false;};
    document.querySelector('input#bstop').onclick=function() {ui.stop(); return false;};
    document.querySelector('input#bshowscript').onclick=function() {ui.show(); return false;};


}