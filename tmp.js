var page = require('webpage').create();
console.log('PhantomJS');
page.open('https0', function(status) {
var e = document.createEvent('MouseEvents');
	console.log('1');
   e.initMouseEvent('click', true, true, window375,563);
   console.log('2');
   a.dispatchEvent(e);
   console.log('3');
phantom.exit();
});