// "Link Suppressor: Make any Link Selectable" Chrome extension
// @version 1.0.2
// @author Hiroshi Yamamoto (higon@freepress.jp)
// @license MIT License 

var checkInvokeMetaKey;
if (navigator.appVersion.indexOf("Mac") != -1) {
    checkInvokeMetaKey = function (e) {
        return e.metaKey == true || e.altKey == true;
    };
} else {
    checkInvokeMetaKey = function (e) {
        return e.metaKey == true || (e.ctrlKey == true && e.shiftKey == true) || e.altKey == true;
    };
}

function checkInvokable(e) {
    var a = huntAnchor(e.target);
    return checkInvokeMetaKey(e) && a;
}

function huntAnchor(elem) {
    return (elem.tagName && elem.tagName.toUpperCase() === 'A') ? elem :
        (elem.parentNode ? huntAnchor(elem.parentNode) : null);
}

var fastClickDetection = false;

function onMouseDown(e) {
    var element2 = huntAnchor(e.target);
    if (checkInvokable(e)) {
        var element = huntAnchor(e.target);
        var url = element.href;
        // console.log("[LinkSuppressor]: a link has been exterminated");
        element.removeAttribute("href"); // Kill a link
        fastClickDetection = true;
        setTimeout(function () {
            fastClickDetection = false;
        }, 150);
        summonReanimator(element, url);
        return false;
    }
}

function summonReanimator(element, url) {
    var reanimator = function (e) {
        // console.log("[LinkSuppressor]: a link has been resurrected");
        if (element) {
            window.removeEventListener("click", arguments.callee);
            if (url) {
                var resurrect = function () {
                    element.setAttribute("href", url);
                };
                if (fastClickDetection) {
                    resurrect();
                } else {
                    setTimeout(resurrect, 100);
                }
            }
            if (e.type === "mouseup") {
                window.removeEventListener("mouseup", arguments.callee);
            }
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    };
    window.addEventListener("click", reanimator, false);
    window.addEventListener("mouseup", reanimator, false);
}

var mousedownAdded = false;
window.addEventListener('load',function(e){
    if ( !mousedownAdded ) {
        mousedownAdded = true;
        window.addEventListener('mousedown', onMouseDown, false);
    }
    var currentUrl = window.location.href;
    if ( currentUrl && currentUrl.indexOf("://news.google.com") != -1) {
        var elements = document.getElementsByClassName("article");
        for (i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.addEventListener('mousedown', onMouseDown, false);
        }
    }
}, false);
