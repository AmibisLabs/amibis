// S5 v1.1 slides.js -- released into the Public Domain
//
// Please see http://www.meyerweb.com/eric/tools/s5/credits.html for information 
// about all the wonderful and talented contributors to this code!

var undef;
var slideCSS = '';
var snum = 0;
var smax = 1;
var incpos = 0;
var number = undef;
var s5mode = true;
var defaultView = 'slideshow';
var controlVis = 'visible';

var isIE = navigator.appName == 'Microsoft Internet Explorer' ? 1 : 0;
var isOp = navigator.userAgent.indexOf('Opera') > -1 ? 1 : 0;
var isGe = navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('Safari') < 1 ? 1 : 0;

function hasClass(object, className) {
	if (!object.className) return false;
	return (object.className.search('(^|\\s)' + className + '(\\s|$)') != -1);
}

function hasValue(object, value) {
	if (!object) return false;
	return (object.search('(^|\\s)' + value + '(\\s|$)') != -1);
}

function removeClass(object,className) {
	if (!object) return;
	object.className = object.className.replace(new RegExp('(^|\\s)'+className+'(\\s|$)'), RegExp.$1+RegExp.$2);
}

function addClass(object,className) {
	if (!object || hasClass(object, className)) return;
	if (object.className) {
		object.className += ' '+className;
	} else {
		object.className = className;
	}
}

function GetElementsWithClassName(elementName,className) {
	var allElements = document.getElementsByTagName(elementName);
	var elemColl = new Array();
	for (var i = 0; i< allElements.length; i++) {
		if (hasClass(allElements[i], className)) {
			elemColl[elemColl.length] = allElements[i];
		}
	}
	return elemColl;
}

function isParentOrSelf(element, id) {
	if (element == null || element.nodeName=='BODY') return false;
	else if (element.id == id) return true;
	else return isParentOrSelf(element.parentNode, id);
}

function nodeValue(node) {
	var result = "";
	if (node.nodeType == 1) {
		var children = node.childNodes;
		for (var i = 0; i < children.length; ++i) {
			result += nodeValue(children[i]);
		}		
	}
	else if (node.nodeType == 3) {
		result = node.nodeValue;
	}
	return(result);
}

function slideLabel() {
	var slideColl = GetElementsWithClassName('*','slide');
	var list = document.getElementById('jumplist');
	smax = slideColl.length;
	for (var n = 0; n < smax; n++) {
		var obj = slideColl[n];

		var did = 'slide' + n.toString();
		obj.setAttribute('id',did);
		if (isOp) continue;

		var otext = '';
		var menu = obj.firstChild;
		if (!menu) continue; // to cope with empty slides
		while (menu && menu.nodeType == 3) {
			menu = menu.nextSibling;
		}
	 	if (!menu) continue; // to cope with slides with only text nodes

		var menunodes = menu.childNodes;
		for (var o = 0; o < menunodes.length; o++) {
			otext += nodeValue(menunodes[o]);
		}
		list.options[list.length] = new Option(n + ' : '  + otext, n);
	}
}

function currentSlide() {
	var cs;
	if (document.getElementById) {
		cs = document.getElementById('currentSlide');
	} else {
		cs = document.currentSlide;
	}
	cs.innerHTML = '<span id="csHere">' + snum + '<\/span> ' + 
		'<span id="csSep">\/<\/span> ' + 
		'<span id="csTotal">' + (smax-1) + '<\/span>';
	if (snum == 0) {
		cs.style.visibility = 'hidden';
	} else {
		cs.style.visibility = 'visible';
	}
        textShadows();
}

function go(step) {
	if (document.getElementById('slideProj').disabled || step == 0) return;
	var jl = document.getElementById('jumplist');
	var cid = 'slide' + snum;
	var ce = document.getElementById(cid);
	if (incrementals[snum].length > 0) {
		for (var i = 0; i < incrementals[snum].length; i++) {
			removeClass(incrementals[snum][i], 'current');
			removeClass(incrementals[snum][i], 'incremental');
		}
	}
	if (step != 'j') {
		snum += step;
		lmax = smax - 1;
		if (snum > lmax) snum = lmax;
		if (snum < 0) snum = 0;
	} else
		snum = parseInt(jl.value);
	var nid = 'slide' + snum;
	var ne = document.getElementById(nid);
	if (!ne) {
		ne = document.getElementById('slide0');
		snum = 0;
	}
	if (step < 0) {incpos = incrementals[snum].length} else {incpos = 0;}
	if (incrementals[snum].length > 0 && incpos == 0) {
		for (var i = 0; i < incrementals[snum].length; i++) {
			if (hasClass(incrementals[snum][i], 'current'))
				incpos = i + 1;
			else
				addClass(incrementals[snum][i], 'incremental');
		}
	}
	if (incrementals[snum].length > 0 && incpos > 0)
		addClass(incrementals[snum][incpos - 1], 'current');
	ce.style.visibility = 'hidden';
	ne.style.visibility = 'visible';
	jl.selectedIndex = snum;
	currentSlide();
	number = 0;
}

function goTo(target) {
	if (target >= smax || target == snum) return;
	go(target - snum);
}

function subgo(step) {
	if (step > 0) {
		removeClass(incrementals[snum][incpos - 1],'current');
		removeClass(incrementals[snum][incpos], 'incremental');
		addClass(incrementals[snum][incpos],'current');
		incpos++;
	} else {
		incpos--;
		removeClass(incrementals[snum][incpos],'current');
		addClass(incrementals[snum][incpos], 'incremental');
		addClass(incrementals[snum][incpos - 1],'current');
	}
}

function toggle() {
	var slideColl = GetElementsWithClassName('*','slide');
	var slides = document.getElementById('slideProj');
	var outline = document.getElementById('outlineStyle');
	if (!slides.disabled) {
		slides.disabled = true;
		outline.disabled = false;
		s5mode = false;
		fontSize('1em');
		for (var n = 0; n < smax; n++) {
			var slide = slideColl[n];
			slide.style.visibility = 'visible';
		}
	} else {
		slides.disabled = false;
		outline.disabled = true;
		s5mode = true;
		fontScale();
		for (var n = 0; n < smax; n++) {
			var slide = slideColl[n];
			slide.style.visibility = 'hidden';
		}
		slideColl[snum].style.visibility = 'visible';
	}
}

function showHide(action) {
	var obj = GetElementsWithClassName('*','hideme')[0];
	switch (action) {
	case 's': obj.style.visibility = 'visible'; break;
	case 'h': obj.style.visibility = 'hidden'; break;
	case 'k':
		if (obj.style.visibility != 'visible') {
			obj.style.visibility = 'visible';
		} else {
			obj.style.visibility = 'hidden';
		}
	break;
	}
}

// 'keys' code adapted from MozPoint (http://mozpoint.mozdev.org/)
function keys(key) {
	if (!key) {
		key = event;
		key.which = key.keyCode;
	}
	if (key.which == 84) {
		toggle();
		return;
	}
	if (s5mode) {
		switch (key.which) {
			case 10: // return
			case 13: // enter
				if (window.event && isParentOrSelf(window.event.srcElement, 'controls')) return;
				if (key.target && isParentOrSelf(key.target, 'controls')) return;
				if(number != undef) {
					goTo(number);
					break;
				}
			case 32: // spacebar
			case 34: // page down
			case 39: // rightkey
			case 40: // downkey
				if(number != undef) {
					go(number);
				} else if (!incrementals[snum] || incpos >= incrementals[snum].length) {
					go(1);
				} else {
					subgo(1);
				}
				break;
			case 33: // page up
			case 37: // leftkey
			case 38: // upkey
				if(number != undef) {
					go(-1 * number);
				} else if (!incrementals[snum] || incpos <= 0) {
					go(-1);
				} else {
					subgo(-1);
				}
				break;
			case 36: // home
				goTo(0);
				break;
			case 35: // end
				goTo(smax-1);
				break;
			case 67: // c
				showHide('k');
				break;
		}
		if (key.which < 48 || key.which > 57) {
			number = undef;
		} else {
			if (window.event && isParentOrSelf(window.event.srcElement, 'controls')) return;
			if (key.target && isParentOrSelf(key.target, 'controls')) return;
			number = (((number != undef) ? number : 0) * 10) + (key.which - 48);
		}
	}
	return false;
}

function clicker(e) {
	number = undef;
	var target;
	if (window.event) {
		target = window.event.srcElement;
		e = window.event;
	} else target = e.target;
	if (target.getAttribute('href') != null || hasValue(target.rel, 'external') || isParentOrSelf(target, 'controls') || isParentOrSelf(target,'embed') || isParentOrSelf(target,'object')) return true;
	if (!e.which || e.which == 1) {
		if (!incrementals[snum] || incpos >= incrementals[snum].length) {
			go(1);
		} else {
			subgo(1);
		}
	}
}

function findSlide(hash) {
	var target = null;
	var slides = GetElementsWithClassName('*','slide');
	for (var i = 0; i < slides.length; i++) {
		var targetSlide = slides[i];
		if ( (targetSlide.name && targetSlide.name == hash)
		 || (targetSlide.id && targetSlide.id == hash) ) {
			target = targetSlide;
			break;
		}
	}
	while(target != null && target.nodeName != 'BODY') {
		if (hasClass(target, 'slide')) {
			return parseInt(target.id.slice(5));
		}
		target = target.parentNode;
	}
	return null;
}

function slideJump() {
	if (window.location.hash == null) return;
	var sregex = /^#slide(\d+)$/;
	var matches = sregex.exec(window.location.hash);
	var dest = null;
	if (matches != null) {
		dest = parseInt(matches[1]);
	} else {
		dest = findSlide(window.location.hash.slice(1));
	}
	if (dest != null)
		go(dest - snum);
}

function fixLinks() {
	var thisUri = window.location.href;
	thisUri = thisUri.slice(0, thisUri.length - window.location.hash.length);
	var aelements = document.getElementsByTagName('A');
	for (var i = 0; i < aelements.length; i++) {
		var a = aelements[i].href;
		var slideID = a.match('\#slide[0-9]{1,2}');
		if ((slideID) && (slideID[0].slice(0,1) == '#')) {
			var dest = findSlide(slideID[0].slice(1));
			if (dest != null) {
				if (aelements[i].addEventListener) {
					aelements[i].addEventListener("click", new Function("e",
						"if (document.getElementById('slideProj').disabled) return;" +
						"go("+dest+" - snum); " +
						"if (e.preventDefault) e.preventDefault();"), true);
				} else if (aelements[i].attachEvent) {
					aelements[i].attachEvent("onclick", new Function("",
						"if (document.getElementById('slideProj').disabled) return;" +
						"go("+dest+" - snum); " +
						"event.returnValue = false;"));
				}
			}
		}
	}
}

function externalLinks() {
	if (!document.getElementsByTagName) return;
	var anchors = document.getElementsByTagName('a');
	for (var i=0; i<anchors.length; i++) {
		var anchor = anchors[i];
		if (anchor.getAttribute('href') && hasValue(anchor.rel, 'external')) {
			anchor.target = '_blank';
			addClass(anchor,'external');
		}
	}
}

function createControls() {
	var controlsDiv = document.getElementById("controls");
	if (!controlsDiv) return;
	var hider = ' onmouseover="showHide(\'s\');" onmouseout="showHide(\'h\');"';
	var hideDiv, hideList = '';
	if (controlVis == 'hidden') {
		hideDiv = hider;
	} else {
		hideList = hider;
	}
	controlsDiv.innerHTML = '<form action="#" id="controlForm"' + hideDiv + '>' +
	'<div id="navLinks">' +
	'<a accesskey="t" id="toggle" href="javascript:toggle();">&#216;<\/a>' +
	'<a accesskey="z" id="prev" href="javascript:go(-1);">&laquo;<\/a>' +
	'<a accesskey="x" id="next" href="javascript:go(1);">&raquo;<\/a>' +
	'<div id="navList"' + hideList + '><select id="jumplist" onchange="go(\'j\');"><\/select><\/div>' +
	'<\/div><\/form>';
	if (controlVis == 'hidden') {
		var hidden = document.getElementById('navLinks');
	} else {
		var hidden = document.getElementById('jumplist');
	}
	addClass(hidden,'hideme');
}

function fontScale() {  // causes layout problems in FireFox that get fixed if browser's Reload is used; same may be true of other Gecko-based browsers
	if (!s5mode) return false;
	var vScale = 22;  // both yield 32 (after rounding) at 1024x768
	var hScale = 32;  // perhaps should auto-calculate based on theme's declared value?
	if (window.innerHeight) {
		var vSize = window.innerHeight;
		var hSize = window.innerWidth;
	} else if (document.documentElement.clientHeight) {
		var vSize = document.documentElement.clientHeight;
		var hSize = document.documentElement.clientWidth;
	} else if (document.body.clientHeight) {
		var vSize = document.body.clientHeight;
		var hSize = document.body.clientWidth;
	} else {
		var vSize = 700;  // assuming 1024x768, minus chrome and such
		var hSize = 1024; // these do not account for kiosk mode or Opera Show
	}
	var newSize = Math.min(Math.round(vSize/vScale),Math.round(hSize/hScale));
	fontSize(newSize + 'px');
	if (isGe) {  // hack to counter incremental reflow bugs
		var obj = document.getElementsByTagName('body')[0];
		obj.style.display = 'none';
		obj.style.display = 'block';
	}
}

function fontSize(value) {
	if (!(s5ss = document.getElementById('s5ss'))) {
		if (!isIE) {
			document.getElementsByTagName('head')[0].appendChild(s5ss = document.createElement('style'));
			s5ss.setAttribute('media','screen, projection');
			s5ss.setAttribute('id','s5ss');
		} else {
			document.createStyleSheet();
			document.s5ss = document.styleSheets[document.styleSheets.length - 1];
		}
	}
	if (!isIE) {
		while (s5ss.lastChild) s5ss.removeChild(s5ss.lastChild);
		s5ss.appendChild(document.createTextNode('body {font-size: ' + value + ' !important;}'));
	} else {
		document.s5ss.addRule('body','font-size: ' + value + ' !important;');
	}
}

function notOperaFix() {
	slideCSS = document.getElementById('slideProj').href;
	var slides = document.getElementById('slideProj');
	var outline = document.getElementById('outlineStyle');
	slides.setAttribute('media','screen');
	outline.disabled = true;
	if (isGe) {
		slides.setAttribute('href','null');   // Gecko fix
		slides.setAttribute('href',slideCSS); // Gecko fix
	}
	if (isIE && document.styleSheets && document.styleSheets[0]) {
		document.styleSheets[0].addRule('img', 'behavior: url(ui/default/iepngfix.htc)');
		document.styleSheets[0].addRule('div', 'behavior: url(ui/default/iepngfix.htc)');
		document.styleSheets[0].addRule('.slide', 'behavior: url(ui/default/iepngfix.htc)');
	}
}

function getIncrementals(obj) {
	var incrementals = new Array();
	if (!obj) 
		return incrementals;
	var children = obj.childNodes;
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (hasClass(child, 'incremental')) {
			if (child.nodeName == 'OL' || child.nodeName == 'UL') {
				removeClass(child, 'incremental');
				for (var j = 0; j < child.childNodes.length; j++) {
					if (child.childNodes[j].nodeType == 1) {
						addClass(child.childNodes[j], 'incremental');
					}
				}
			} else {
				incrementals[incrementals.length] = child;
				removeClass(child,'incremental');
			}
		}
		if (hasClass(child, 'show-first')) {
			if (child.nodeName == 'OL' || child.nodeName == 'UL') {
				removeClass(child, 'show-first');
				if (child.childNodes[isGe].nodeType == 1) {
					removeClass(child.childNodes[isGe], 'incremental');
				}
			} else {
				incrementals[incrementals.length] = child;
			}
		}
		incrementals = incrementals.concat(getIncrementals(child));
	}
	return incrementals;
}

function createIncrementals() {
	var incrementals = new Array();
	for (var i = 0; i < smax; i++) {
		incrementals[i] = getIncrementals(document.getElementById('slide'+i));
	}
	return incrementals;
}

function defaultCheck() {
	var allMetas = document.getElementsByTagName('meta');
	for (var i = 0; i< allMetas.length; i++) {
		if (allMetas[i].name == 'defaultView') {
			defaultView = allMetas[i].content;
		}
		if (allMetas[i].name == 'controlVis') {
			controlVis = allMetas[i].content;
		}
	}
}

// Key trap fix, new function body for trap()
function trap(e) {
	if (!e) {
		e = event;
		e.which = e.keyCode;
	}
	try {
		modifierKey = e.ctrlKey || e.altKey || e.metaKey;
	}
	catch(e) {
		modifierKey = false;
	}
	return modifierKey || e.which == 0;
}

function startup() {
	defaultCheck();
	if (!isOp) createControls();
	slideLabel();
	fixLinks();
	externalLinks();
	fontScale();
	if (!isOp) {
		notOperaFix();
		incrementals = createIncrementals();
		slideJump();
		if (defaultView == 'outline') {
			toggle();
		}
		document.onkeyup = keys;
		document.onkeypress = trap;
		document.onclick = clicker;
	}
parent.resizeTo(screen.availWidth,screen.availHeight); moveTo(0,0);
//        textShadows();
}
function setStyles(o,s,clean){
	var i;
	s=s.split(';');
	for(i in s){
		var p=s[i].split(':');
		o.style[p[0]]=p[1];
	}
//       if(clean){ o.style.remove('text-shadow');}
}

function textShadows(){
	var ua=navigator.userAgent;
	if(ua.indexOf('KHTML')>=0&&!(ua.indexOf('Safari')>=0))return;
	var ss=document.styleSheets,a;
	for(a in ss){
		var theRules=[],b;
		if(ss[a].cssRules)theRules=ss[a].cssRules;
		else if(ss[a].rules)theRules=ss[a].rules;
		for(b in theRules){
			var selector=theRules[b].selectorText,r=theRules[b].style.cssText;
			if(/text-shadow/.test(r)){
				r=r.replace(/([ ,]) /g,'$1').replace(/.*text-shadow[ :]+/,'').replace(/[ ]*;.*/,'');
				var shadows=r.split(','),k,els=cssQuery(selector),l;
				for(l in els){
                                        if(els[l].style.zIndex=='-1') {
                                                els[l].parentNode.removeChild(els[l]);
                                                continue;
                                        }
                                        if(els[l].parentNode.style.visibility=='visible') {
					var x=parseInt(els[l].offsetLeft),y=parseInt(els[l].offsetTop)/*,el3=els[l].cloneNode(true)*/;
                			setStyles(els[l],'zIndex:50;',false);
//					setStyles(el3,'position:absolute;z-index:50;margin:0',false);
					for(k in shadows){
						var parts=shadows[k].split(' ');
						var newX=x+parseInt(parts[1]),newY=y+parseInt(parts[2]),rad=parseInt(parts[3]);
						for(m=0-rad;m<=rad;++m)for(n=0-rad;n<=rad;++n)showShadow(els[l],newX+m,newY+n,parts[0]);
//						var el2=el3.cloneNode(true);
//						setStyles(el2,'left:'+x+'px;top:'+y+'px;',false);
//						els[l].parentNode.appendChild(el2);
					}
					}
				}
			}
		}
	}
}
function showShadow(el,x,y,color){
	var el2=el.cloneNode(true);
	setStyles(el2,'position:absolute;color:'+color+';left:'+x+'px;top:'+y+'px;margin:0;z-index:-1;zIndex:-1;',true);
	el2.style.opacity='.08';
	el2.style.filter='alpha(opacity=8)';
	el.parentNode.appendChild(el2);
}



/*
	This work is licensed under a Creative Commons License.

	License: http://creativecommons.org/licenses/by/1.0/

	You are free:

	to copy, distribute, display, and perform the work
	to make derivative works
	to make commercial use of the work

	Under the following conditions:

	Attribution. You must give the original author credit

	Author:  Dean Edwards/2004
	Web:     http://dean.edwards.name/
*/

/* keeping code tidy! */

/* extendible css query function for common platforms

			tested on IE5.0/5.5/6.0, Mozilla 1.6/Firefox 0.8, Opera 7.23/7.5
			(all windows platforms - somebody buy me a mac!)
*/

// -----------------------------------------------------------------------
//  css query engine
// -----------------------------------------------------------------------

var cssQuery=function() {
	var version="1.0.1"; // timestamp: 2004/05/25

	// constants
	var STANDARD_SELECT=/^[^>\+~\s]/;
	var STREAM=/[\s>\+~:@#\.]|[^\s>\+~:@#\.]+/g;
	var NAMESPACE=/\|/;
	var IMPLIED_SELECTOR=/([\s>\+~\,]|^)([\.:#@])/g;
	var ASTERISK ="$1*$2";
	var WHITESPACE=/^\s+|\s*([\+\,>\s;:])\s*|\s+$/g;
	var TRIM="$1";
	var NODE_ELEMENT=1;
	var NODE_TEXT=3;
	var NODE_DOCUMENT=9;

	// sniff for explorer (cos of one little bug)
	var isMSIE=/MSIE/.test(navigator.appVersion), isXML;

	// cache results for faster processing
	var cssCache={};

	// this is the query function
	function cssQuery(selector, from) {
		if (!selector) return [];
		var useCache=arguments.callee.caching && !from;
		from=(from) ? (from.constructor == Array) ? from : [from] : [document];
		isXML=checkXML(from[0]);
		// process comma separated selectors
		var selectors=parseSelector(selector).split(",");
		var match=[];
		for (var i in selectors) {
			// convert the selector to a stream
			selector=toStream(selectors[i]);
			// process the stream
			var j=0, token, filter, cacheSelector="", filtered=from;
			while (j < selector.length) {
				token=selector[j++];
				filter=selector[j++];
				cacheSelector += token + filter;
				// process a token/filter pair
				filtered=(useCache && cssCache[cacheSelector]) ? cssCache[cacheSelector] : select(filtered, token, filter);
				if (useCache) cssCache[cacheSelector]=filtered;
			}
			match=match.concat(filtered);
		}
		// return the filtered selection
		return match;
	};
	cssQuery.caching=false;
	cssQuery.reset=function() {
		cssCache={};
	};
	cssQuery.toString=function () {
		return "function cssQuery() {\n  [version " + version + "]\n}";
	};

	var checkXML=(isMSIE) ? function(node) {
		if (node.nodeType != NODE_DOCUMENT) node=node.document;
		return node.mimeType == "XML Document";
	} : function(node) {
		if (node.nodeType == NODE_DOCUMENT) node=node.documentElement;
		return node.localName != "HTML";
	};

	function parseSelector(selector) {
		return selector
		// trim whitespace
		.replace(WHITESPACE, TRIM)
		// encode attribute selectors
		.replace(attributeSelector.ALL, attributeSelector.ID)
		// e.g. ".class1" --> "*.class1"
		.replace(IMPLIED_SELECTOR, ASTERISK);
	};

	// convert css selectors to a stream of tokens and filters
	//  it's not a real stream. it's just an array of strings.
	function toStream(selector) {
		if (STANDARD_SELECT.test(selector)) selector=" " + selector;
		return selector.match(STREAM) || [];
	};

	var pseudoClasses={ // static
		// CSS1
		"link": function(element) {
			for (var i=0; i < document.links; i++) {
				if (document.links[i] == element) return true;
			}
		},
		"visited": function(element) {
			// can't do this without jiggery-pokery
		},
		// CSS2
		"first-child": function(element) {
			return !previousElement(element);
		},
		// CSS3
		"last-child": function(element) {
			return !nextElement(element);
		},
		"root": function(element) {
			var document=element.ownerDocument || element.document;
			return Boolean(element == document.documentElement);
		},
		"empty": function(element) {
			for (var i=0; i < element.childNodes.length; i++) {
				if (isElement(element.childNodes[i]) || element.childNodes[i].nodeType == NODE_TEXT) return false;
			}
			return true;
		}
		// add your own...
	};

	var QUOTED=/([\'\"])[^\1]*\1/;
	function quote(value) {return (QUOTED.test(value)) ? value : "'" + value + "'"};
	function unquote(value) {return (QUOTED.test(value)) ? value.slice(1, -1) : value};

	var attributeSelectors=[];

	function attributeSelector(attribute, compare, value) {
		// properties
		this.id=attributeSelectors.length;
		// build the test expression
		var test="element.";
		switch (attribute.toLowerCase()) {
			case "id":
				test += "id";
				break;
			case "class":
				test += "className";
				break;
			default:
				test += "getAttribute('" + attribute + "')";
		}
		// continue building the test expression
		switch (compare) {
			case "=":
				test += "==" + quote(value);
				break;
			case "~=":
				test="/(^|\\s)" + unquote(value) + "(\\s|$)/.test(" + test + ")";
				break;
			case "|=":
				test="/(^|-)" + unquote(value) + "(-|$)/.test(" + test + ")";
				break;
		}
		push(attributeSelectors, new Function("element", "return " + test));
	};
	attributeSelector.prototype.toString=function() {
		return attributeSelector.PREFIX + this.id;
	};
	// constants
	attributeSelector.PREFIX="@";
	attributeSelector.ALL=/\[([^~|=\]]+)([~|]?=?)([^\]]+)?\]/g;
	// class methods
	attributeSelector.ID=function(match, attribute, compare, value) {
		return new attributeSelector(attribute, compare, value);
	};

	// select a se tof matching elements.
	// "from" is an array of elements.
	// "token" is a character representing the type of filter
	//  e.g. ">" means child selector
	// "filter" represents the tag name, id or class name that is being selected
	// the function returns an array of matching elements
	function select(from, token, filter) {
		//alert("token="+token+",filter="+filter);
		var namespace="";
		if (NAMESPACE.test(filter)) {
			filter=filter.split("|");
			namespace=filter[0];
			filter=filter[1];
		}
		var filtered=[], i;
		switch (token) {
			case " ": // descendant
				for (i in from) {
					var subset=getElementsByTagNameNS(from[i], filter, namespace);
					for (var j=0; j < subset.length; j++) {
						if (isElement(subset[j]) && (!namespace || compareNamespace(subset[j], namespace)))
							push(filtered, subset[j]);
					}
				}
				break;
			case ">": // child
				for (i in from) {
					var subset=from[i].childNodes;
					for (var j=0; j < subset.length; j++)
						if (compareTagName(subset[j], filter, namespace)) push(filtered, subset[j]);
				}
				break;
			case "+": // adjacent (direct)
				for (i in from) {
					var adjacent=nextElement(from[i]);
					if (adjacent && compareTagName(adjacent, filter, namespace)) push(filtered, adjacent);
				}
				break;
			case "~": // adjacent (indirect)
				for (i in from) {
					var adjacent=from[i];
					while (adjacent=nextElement(adjacent)) {
						if (adjacent && compareTagName(adjacent, filter, namespace)) push(filtered, adjacent);
					}
				}
				break;
			case ".": // class
				filter=new RegExp("(^|\\s)" + filter + "(\\s|$)");
				for (i in from) if (filter.test(from[i].className)) push(filtered, from[i]);
				break;
			case "#": // id
				for (i in from) if (from[i].id == filter) push(filtered, from[i]);
				break;
			case "@": // attribute selector
				filter=attributeSelectors[filter];
				for (i in from) if (filter(from[i])) push(filtered, from[i]);
				break;
			case ":": // pseudo-class (static)
				filter=pseudoClasses[filter];
				for (i in from) if (filter(from[i])) push(filtered, from[i]);
				break;
		}
		return filtered;
	};

	var getElementsByTagNameNS=(isMSIE) ? function(from, tagName) {
		return (tagName == "*" && from.all) ? from.all : from.getElementsByTagName(tagName);
	} : function(from, tagName, namespace) {
		return (namespace) ? from.getElementsByTagNameNS("*", tagName) : from.getElementsByTagName(tagName);
	};

	function compareTagName(element, tagName, namespace) {
		if (namespace && !compareNamespace(element, namespace)) return false;
		return (tagName == "*") ? isElement(element) : (isXML) ? (element.tagName == tagName) : (element.tagName == tagName.toUpperCase());
	};

	var PREFIX=(isMSIE) ? "scopeName" : "prefix";
	function compareNamespace(element, namespace) {
		return element[PREFIX] == namespace;
	};

	// return the previous element to the supplied element
	//  previousSibling is not good enough as it might return a text or comment node
	function previousElement(element) {
		while ((element=element.previousSibling) && !isElement(element)) continue;
		return element;
	};

	// return the next element to the supplied element
	function nextElement(element) {
		while ((element=element.nextSibling) && !isElement(element)) continue;
		return element;
	};

	function isElement(node) {
		return Boolean(node.nodeType == NODE_ELEMENT && node.tagName != "!");
	};


	// use a baby push function because IE5.0 doesn't support Array.push
	function push(array, item) {
		array[array.length]=item;
	};

	// fix IE5.0 String.replace
	if ("i".replace(/i/,function(){return""})) {
		// preserve String.replace
		var string_replace=String.prototype.replace;
		// create String.replace for handling functions
		var function_replace=function(regexp, replacement) {
			var match, newString="", string=this;
			while ((match=regexp.exec(string))) {
				// five string replacement arguments is sufficent for cssQuery
				newString += string.slice(0, match.index) + replacement(match[0], match[1], match[2], match[3], match[4]);
				string=string.slice(match.lastIndex);
			}
			return newString + string;
		};
		// replace String.replace
		String.prototype.replace=function (regexp, replacement) {
			this.replace=(typeof replacement == "function") ? function_replace : string_replace;
			return this.replace(regexp, replacement);
		};
	}

	return cssQuery;
}();



window.onload = startup;
window.onresize = function(){setTimeout('fontScale()', 50);}
