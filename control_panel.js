// proxy //

function Recorder_Proxy() {
    this.active = null;
}

Recorder_Proxy.prototype.start = function(url) {
  chrome.tabs.getSelected(null, function(tab) {
      chrome.runtime.sendMessage({action: "start", recorded_tab: tab.id, start_url: url});
  });
}


Recorder_Proxy.prototype.stop = function() {
  chrome.runtime.sendMessage({action: "stop"});
}

Recorder_Proxy.prototype.open = function(url, callback) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "open", 'url': url}, callback);
    });
}

// UI //

function App_UI() {
  this.recorder = new Recorder_Proxy();
  chrome.runtime.sendMessage({action: "get_status"}, function(response) {
    if (response.active){
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

App_UI.prototype.start = function() {
  var url = document.forms[0].elements["url"].value;
    if (url == "") {
        return false;
    }
    if ( (url.indexOf("http://") == -1) && (url.indexOf("https://")) ) {
        url = "http://" + url;
    }    
    ui.set_started()
    ui.recorder.start(url);  
    return false
    
  }

App_UI.prototype.show = function() {
  chrome.tabs.create({url: "./phantom.html"});  
}


App_UI.prototype.stop = function() {
  ui.set_stopped();
  ui.recorder.stop();
  return false;
}

App_UI.prototype.set_started = function() {
  var element;
  element = document.getElementById('b_stop');
  element.style.displey = '';
  element.onclick = ui.stop;
  element.value = 'Stop';

}



App_UI.prototype.set_stopped = function() {
  var element;  
  element = document.getElementById('b_stop');
  element.style.displey = '';
  element = document.getElementById('b_start');
  element.style.displey = '';
  element = document.getElementById('b_show_script');
  element.style.displey = '';
}


var ui;
window.onload = function() {
  document.querySelector('input#b_start').onclick=function() {ui.start(); return false;};
  document.querySelector('input#b_stop').onclick=function() {ui.stop(); return false;};
  document.querySelector('input#b_show_script').onclick=function() {ui.show(); return false;};
  ui = new App_UI();
}