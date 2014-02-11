// "Link Suppressor: Make any Link Selectable" extension
// Hiroshi Yamamoto (higon@freepress.jp)

var checkInvokeMetaKey;
if (navigator.appVersion.indexOf("Mac")!=-1) {
    checkInvokeMetaKey = function(e) { return e.metaKey == true || e.altKey == true;};
} else{
	checkInvokeMetaKey = function(e) {
	  return e.metaKey == true || (e.ctrlKey == true && e.shiftKey == true);};
}

function checkInvokable( e) {
  var a = huntAnchor(e.target);
  return checkInvokeMetaKey(e) && a && a.tagName.toUpperCase() === 'A';
}

function huntAnchor( elem) {
  return (elem.tagName && elem.tagName.toUpperCase() === 'A') ? elem:
   (elem.parentNode ? huntAnchor(elem.parentNode): null);
}

var fastClickDetection = false;

function onMouseDown(e) {
	if (checkInvokable(e)){
	    var element = huntAnchor(e.target);
		var url = element.href;
		// console.log("[LinkSuppressor]: a link has been exterminated");
		element.removeAttribute("href"); // Kill a link
		fastClickDetection = true;
		setTimeout( function() {
		    fastClickDetection = false;
		}, 150);
		summonReanimator(element, url);
		return false;
	}
}

function summonReanimator(element, url) {
    var reanimator = function(e) {
        console.log("[LinkSuppressor]: a link has been resurrected");
		if (element) {
		    window.removeEventListener("click", arguments.callee);
		    if (url) {
		        var resurrect = function(){
		            element.setAttribute("href",url);
		        };
		        if ( fastClickDetection) {
		            resurrect();
		        } else {
		            setTimeout( resurrect, 100);
		        }
		    }
		    if (e.type ==="mouseup") {
		        window.removeEventListener("mouseup", arguments.callee);
		    }
		}
		e.stopPropagation();
		e.preventDefault();
	    return false;
	};
	window.addEventListener("click", reanimator);
	window.addEventListener("mouseup", reanimator);
}

window.addEventListener('mousedown', onMouseDown);


