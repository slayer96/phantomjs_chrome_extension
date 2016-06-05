// proxy //

function Recorder_Proxy() {
    this.active = null;
}

Recorder_Proxy.prototype.start = function(url) {
  chrome.tabs.getSelected(null, function(tab) {
      chrome.runtime.sendMessage({action: "start", recorded_tab: tab.id, start_url: url});
  });
}

// UI //

function App_UI() {
  this.recorder = new Recorder_Proxy()
}

App_UI.prototype.start = function() {
  var url = document.forms[0].elements["url"].value;
    if (url == "") {
        return false;
    }
    if ( (url.indexOf("http://") == -1) && (url.indexOf("https://")) ) {
        url = "http://" + url;    
    ui.recorder.start(url);  
    return false
    }
}

App_UI.prototype.show = function(options) {
  if(options && options.xy) {
    chrome.tabs.create({url: "./phantom.html?xy=true"});
  } else {
    chrome.tabs.create({url: "./phantom.html"});
  }
}

var ui;
window.onload = function() {
  document.querySelector('input#b_start').onclick=function() {ui.start(); return false;};
  document.querySelector('input#b_show_script').onclick=function() {ui.show({xy: true}); return false;};
  ui = new App_UI();
}