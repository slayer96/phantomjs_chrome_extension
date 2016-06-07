var testcase_items = new Array();
var active = false;
var empty = true;
var tab_id = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "append") {
    alert("Append");
    testcase_items[testcase_items.length] = request.obj;
    empty = false;
    sendResponse({});
  }
  if (request.action == "poke") {
    alert("Poke");
    testcase_items[testcase_items.length - 1] = request.obj;
    sendResponse({});
  }
  if (request.action == "get_status") {
    //alert('get_status')
    sendResponse({'active': active, 'empty': empty});
  }
  if (request.action == "start") {
  	if(!active) {
  	    active = true;
  	    empty = true;
  	    testcase_items = new Array();
  	    tab_id = request.recorded_tab;
  	    chrome.tabs.update(tab_id, {url: request.start_url}, function(tab) {
          alert("You are now recording your test sequence.");
          chrome.tabs.sendMessage(tab_id, {action: "open", 'url': request.start_url});
          sendResponse({start: true});
  	    });
  	}
  }
  if (request.action == "stop") {
    alert('Stop');
    active = false;
    chrome.tabs.sendMessage(tab_id, {action: "stop"});
    sendResponse({stop: truex});
  }
  
  if ((request.action == "get_items") && (testcase_items != '')) {
  alert('get_items');
  sendResponse({'items': testcase_items});
  }  
});