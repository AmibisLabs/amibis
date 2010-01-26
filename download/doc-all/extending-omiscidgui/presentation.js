
/**
 * Constants.
 */
designWidth = 800
designHeight = 600
designBaseFontSize = 32
displayWindowName = 'da_displayer'
actionClass = 'action'

dataHolderClass = 'dataHolder'
multiViewClass = 'multiView'
singleViewClass = 'singleView'
viewHolderClass = 'viewHolder'
controlsWidgetClass = 'controlsWidget'
notesClass = 'notes'

currentSlideClass = 'currentSlide'
nextSlideClass = 'nextSlide'
nextSlideDeltaAttribute = 'delta'
controlsClass = 'controls'
slidesSelectClass = 'slidesSelect'
slideCounterClass = 'slideCounter'

preventScalingClass = 'noScale'

slideNextClass = 'slideNext'
slidePreviousClass = 'slidePrevious'
openSingleViewClass = 'openSingleView'

config = new Object();
config.title = function (title, slideNumber, slideCount) { return title + " [" + slideNumber + "/" + slideCount + "]"; }
config.slideCounterText = function (slideNumber, slideCount) { return slideNumber + "/" + slideCount; }

/**
* Context.
*/
function isMain() {return !isNotMain()}
function isNotMain() {return window.name == displayWindowName}
function isSecondary() {return window.name == displayWindowName}


function hideAllButViewHolder(doc) {
    var tags = xpath(doc, '/x:html/x:body/*')
    for (tag in tags) {	
        setVisible(tags[tag], false)
    }
    setVisible(xpathWithClass(doc, '/x:html/x:body/x:div', viewHolderClass)[0], true)
    setVisible(xpath(doc, '/x:html/x:body')[0], true)
}

/**
* Model.
*/
function Model() {
    this.currentSlide = -1;
    this.displayWindow = null;
    this.openSecond = function() {
        this.displayWindow && this.displayWindow.isNotMain() // test window has not been close (throws exception)
        if (this.displayWindow == null) {
            this.displayWindow = window.open(window.location, target=displayWindowName, toolbar='no', status='no', fullscreen='yes')
            // inject Css also there
            var csss = xpathWithClass(this.dataHolderDocument, "//x:div", "css");
            for (c in csss) {
                var o = csss[c];
                includeCss(this.displayWindow.document, o.textContent);
            }
        }
    }
    this.secondWindowLoaded = function() {
        controller.slideStep(0)
    }
    this.mainWindow = window.self;
    this.document = document;
    this.loadPresentation = function() {
        var h = xpathWithClass(this.document, "/x:html/x:body/*", dataHolderClass)[0];
        this.dataHolderDocument = h.contentDocument;
        this.presentation = xpathWithClass(this.dataHolderDocument, '/x:html/x:body/x:div', 'presentation')[0]
        this.title = xpath(this.dataHolderDocument, '/x:html/x:head/x:title')[0].textContent
        //        this.slides = xpathWithoutClass(this.presentation, './x:div', "nonSlide", this.dataHolderDocument)
        {
            var xpathResult = xpathQuery(this.presentation, './x:div', this.dataHolderDocument);
            this.slides = new Array();
            var it = xpathResult.iterateNext();
            while (it) {
                if (hasClass(it, "css")) {
                    includeCss(this.document, it.textContent);
                } else if (hasClass(it, "js")) {
                    includeJs(this.document, it.textContent);
                } else 
                if (!hasClass(it, "nonSlide")) {
                    if (!hasClass(it, "smart")) {
                        this.slides[this.slides.length] = it;
                    } else {
                        this.slides = this.slides.concat(interpretationOfSmartLanguage(it.innerHTML, this.dataHolderDocument));
                    }
                }
                it = xpathResult.iterateNext();
            }
        }
        // post processing of the real slides
        for (var i = 0; i< this.slides.length; i++) {
            if (hasClass(this.slides[i], "lastSlide")) {
                this.artificialSlideNumber = i + 1;
            }
            addClass(this.slides[i], "slide");
        }
        /*{
            var artificialLast = xpathWithClass(this.presentation, './x:div', 'lastSlide', this.dataHolderDocument)[0];
            if (artificialLast)
                this.artificialSlideNumber = 1 + xpathWithoutClass(artificialLast, './preceding-sibling::x:div', "nonSlide", this.dataHolderDocument).length;
                }*/
        //setVisible(this.presentation, false);
        hideAllButViewHolder(this.document)
        //this is causing some non-initialized problems: setSlide(0)
        controller.readURL()
    }
}
model = isMain() ? new Model() : opener.model;

/**
* Controller.
*/
function Controller() {
    this.slideStep = function (step) {
        model.currentSlide += step;
        model.currentSlide = model.currentSlide < 0 ? 0 : model.currentSlide
        model.currentSlide = model.currentSlide > model.slides.length-1 ? model.slides.length-1 : model.currentSlide
        setSlide(model.currentSlide);
    }
    this.slideSet = function (index) {
        model.currentSlide = index;
        setSlide(model.currentSlide);
    }
    this.lasthash = null;
    this.inPhase = false;
    this.readURL = function () {
        if (window.location.hash == "") window.location.hash = "#slide1";
        try {
            if (this.lasthash != window.location.hash) {
                this.lasthash = window.location.hash
            } else if (this.inPhase) {
            if (model.displayWindow && model.displayWindow.location && window.location.hash != model.displayWindow.location.hash) {
                window.location.hash = model.displayWindow.location.hash
                this.lasthash = window.location.hash
                this.inPhase = (window.location.hash == model.displayWindow.location.hash)
            }
        } else if (model.displayWindow) {
        model.displayWindow.location.hash = window.location.hash
        this.inPhase = (window.location.hash == model.displayWindow.location.hash)
    }
} catch(err){// possible when displayWindow has been closed by user
model.displayWindow = null;
}
if (window.location.hash == "") {
    setSlide(model.currentSlide)
    this.lasthash = window.location.hash
    return
}
var sregex = /^#slide(\d+)$/
var matches = sregex.exec(window.location.hash)
if (matches != null) {
    var newSlide = parseInt(matches[1])-1
    if (newSlide != model.currentSlide) {
        model.currentSlide = newSlide
        setSlide(model.currentSlide)
    }
}
var sregex = /^#slideStep(-?\d+)$/
var matches = sregex.exec(window.location.hash)
if (matches != null) {
    var newSlide = model.currentSlide + parseInt(matches[1])
    if (newSlide != model.currentSlide) {
        model.currentSlide = newSlide
        setSlide(model.currentSlide)
    }
}
}
this.checkLocation = function () { this.readURL() }
}
controller = isMain() ? new Controller() : opener.controller;
window.controller = controller;

function getChildsWithClass(from, classs) {
    var allElements = from.childNodes;
    var res = new Array();
    for (var i = 0; i< allElements.length; i++) {
        if (hasClass(allElements[i], classs)) {
            res[res.length] = allElements[i];
        }
    }
    return res;
}


function nsResolver(prefix) {
    var ns = {
        'xhtml' : 'http://www.w3.org/1999/xhtml',
        'x' : 'http://www.w3.org/1999/xhtml',
        'mathml': 'http://www.w3.org/1998/Math/MathML',
        'm': 'http://www.w3.org/1998/Math/MathML'
    };
    return ns[prefix] || null;
}

// #################################################################################################### //
String.prototype.startsWith = function(str) {return this.substr(0, str.length) == str;}

function interpretationOfSmartLanguage(smart, doc) {
    var res = new Array();
    var inSlide = null;
    var indent = "";
    var deepestList = null;
    var remain = smart;

    var setEnrichedContent = function(what, content) {return what.innerHTML = content;}
    var endSlide = function() {
        inSlide = null;
        indent = new Array();
        indent = "";
        deepestList = null;
    }

    while (true) {
        var nl = remain.indexOf("\n");
        var line = remain.substring(0, nl).replace(/^ */, "");
        // we iterate over the lines
        // treat trailing classes before anything
        var addClasses = "";
        {
            while (line.match(/^(.*)\[([^\] ]*)\]$/)) {
                addClasses = RegExp.$2 + " " + addClasses;
                line = RegExp.$1;
            }
        }
        if (line == "") {
        } else if (line.match(/^=(.*)=$/)) {
            var title = RegExp.$1;
            if (inSlide) endSlide();
            inSlide = doc.createElement("div");
            if (addClasses != "") inSlide.className = addClasses;
            var h = doc.createElement("h3");
            setEnrichedContent(h, title);
            inSlide.appendChild(h);
            deepestList = inSlide;
            res[res.length] = inSlide;
        } else if (line.match(/^([*#]+)(.*)$/)) {
            var pref = RegExp.$1;
            var content = RegExp.$2;
            if (indent == "" && pref == "") {
                // do not create the li
            } else if (pref == indent) {
                var li = doc.createElement("li");
                setEnrichedContent(li, content);
                deepestList.appendChild(li);
            } else {
                // un-push as needed
                while (! pref.startsWith(indent)) {
                    deepestList = deepestList.parentNode;
                    indent = indent.substr(0, indent.length - 1);
                }
                // re-push as needed
                while (pref.length > indent.length) {
                    var asso = {"*": "ul", "#": "ol"};
                    var toPush = pref.substr(indent.length, 1);
                    indent = indent.concat(toPush);
                    var list = doc.createElement(asso[toPush]);
                    deepestList.appendChild(list);
                    deepestList = list;
                }
                var li = doc.createElement("li");
                setEnrichedContent(li, content);
                deepestList.appendChild(li);
            }
        } else {
            while (true) {
                try {
                    deepestList.innerHTML = deepestList.innerHTML + line;
                    break;
                } catch (e) {
                    remain = remain.substring(nl + 1);
                    nl = remain.indexOf("\n");
                    var line2 = remain.substring(0, nl).replace(/^ */, "");
                    line = line + "\n" + line2;
                }
            }
        }
        if (nl != -1) remain = remain.substring(nl + 1);
        else break;
    }
    return res;
}

function includeCss(ctx, file, onLoad, ns) {
    ns = ns || "http://www.w3.org/1999/xhtml";
    var root = ctx.documentElement;
    $.ajaxSetup({'beforeSend': function(xhr){
                if (xhr.overrideMimeType)
                    xhr.overrideMimeType("text/plain");
            }
        });
    $.get(file, function(data) {
            var css = ctx.createElementNS(ns, 'style');
            var content = ctx.createTextNode(data);
            css.appendChild(content);
            root.insertBefore(css, $("svg>style", ctx).size() > 0 ? root.firstChild.nextSibling : root.firstChild);
            if (onLoad) onLoad();
        }, "text");
}

function includeJs(ctx, file, onLoad, ns) {
    ns = ns || "http://www.w3.org/1999/xhtml";
    // Handle multiple include attempts
    //            if($("script[src='" + file + "']", ctx).size() == 0) {
    {
        var root = ctx.documentElement;
        $.ajaxSetup({'beforeSend': function(xhr){
                    if (xhr.overrideMimeType)
                        xhr.overrideMimeType("text/plain");
                }
            });
        $.get(file, function(data) {
                var js = ctx.createElementNS(ns, 'script');
                var content = ctx.createTextNode(data);
                js.appendChild(content);
                root.insertBefore(js, $("svg>script", ctx).size() > 0 ? root.firstChild.nextSibling : root.firstChild);
                if (onLoad) onLoad();
            }, "text");
    }
}

// #################################################################################################### //


function xpathQuery(context, path, doc) {
    if (!doc) doc = context;
    return doc.evaluate( path, context, nsResolver, XPathResult.ANY_TYPE, null );
}

function xpathWithClass(context, path, classs, doc, negate) {
    if (!doc) doc = context;
    if (!negate) negate = false;
    var xpathResult = xpathQuery(context, path, doc);
    var res = new Array();
    var it = xpathResult.iterateNext();
    while (it) {
        if (hasClass(it,classs) ^ negate) {
            res[res.length] = it;
        }
        it = xpathResult.iterateNext();
    }
    return res;
}
function xpathWithoutClass(context, path, classs, doc) {
    return xpathWithClass(context, path, classs, doc, true);
}

function xpath(context, path, doc) {
    if (!doc) doc = context;
    var xpathResult = xpathQuery(context, path, doc);
    var res = new Array();
    var it = xpathResult.iterateNext();
    while (it) {
        res[res.length] = it;
        it = xpathResult.iterateNext();
    }
    return res;
}

function values(array)
{
    var res = new Array();
    for (i in array) {
        res[array[i]] = '';
    }
    return res;
}

function hasClass(object, className) {
    if ($) {return $(object).hasClass(className);}
    var test = object.className;
    try {
        if (!test) return false;
        if (!object.className.split) alert(test = object.getAttribute("class"));
    } catch(err) {return false}
    return className in values(test.split(" "));
}
function addClass(object, className) {
    if (hasClass(object,className)) return;	
    if (!object.className) object.className = className;
    else object.className += " "+className;
}


function setVisible(element, visible) {
    var valueToSet = visible ? 'visible' : 'hidden';
    if (element.style.visibility != valueToSet) {
        element.style.visibility = valueToSet; 
    }
}

function setContent(parent, content) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
    parent.appendChild(content)
}

function processScaling(w, h) {
    return Math.min(w / designWidth, h / designHeight);
}

function adaptSizeToWidth(toAdapt, availableWidth, doc) {
    var child = toAdapt.firstChild
    if (!hasClass(child, "tagaddedtag")) {
        var container = doc.createElement("div")
        container.className = "tagaddedtag"
        setContent(toAdapt, container)
        setContent(container, child)
    }
    //var scaling = processScaling(availableWidth, availableHeight);
    var scaling = availableWidth / designWidth;
    toAdapt.style.fontSize = (designBaseFontSize * scaling)+"px";
    toAdapt.firstChild.style.fontSize = "100%";
}

function adaptSizeWithScaling(toFill, fillWith, doc, scaling) {
    //var availableWidth = toFill.clientWidth
    toFill.style.fontSize = (designBaseFontSize * scaling)+"px";
    fillWith.style.fontSize = "100%";
    var images = xpath(fillWith, './/x:img', doc)
    for (i in images) {
        if (!hasClass(images[i], preventScalingClass))
            images[i].style.width = (images[i].width * scaling)+"px";
    }
    images = xpath(fillWith, './/x:object', doc)
    for (i in images) {
        if (images[i].width != '*') images[i].style.width = (images[i].width * scaling)+"px";
        if (images[i].height != '*') images[i].style.height = (images[i].height * scaling)+"px";
    }
}
function adaptSize(toFill, fillWith, doc) {
    var scaling = toFill.clientWidth / designWidth;
    adaptSizeWithScaling(toFill, fillWith, doc, scaling);
}

function showSlide(slideNumber, toFill, doc) {
    var slides = model.slides;
    var slide = slides[slideNumber];
    if (slide) {
        //slide = slide.cloneNode(true)
        //doc.adoptNode(slide)
        slide = doc.importNode(slide, true)
        adaptSize(toFill, slide, doc)
        setContent(toFill, slide)
    }
}

function showSlideInFullscreen(slideNumber, toFill, doc) {
    var slides = model.slides;
    var slide = slides[slideNumber];
    if (slide) {
        //slide = slide.cloneNode(true)
        //doc.adoptNode(slide)
        slide = doc.importNode(slide, true);
        adaptSizeWithScaling(toFill, slide, doc, processScaling(document.documentElement.clientWidth, document.documentElement.clientHeight))
        setContent(toFill, slide)
    }
}

function showNotes(slideNumber, toFill, doc) {
    var slides = model.slides;
    var notes = xpathWithClass(slides[slideNumber], './/x:div', notesClass, model.dataHolderDocument);
    if (notes.length == 0) {
        toFill.textContent = ""
    } else for (n in notes) {
    n = doc.importNode(notes[n], true)
    //    adaptSize(toFill, n, doc)
    setContent(toFill, n)
}
}

function showSlideCounter(doc, toFill) {
    var current = model.currentSlide+1;
    var realTotal = model.slides.length;
    var artificialTotal = model.artificialSlideNumber;
    var displayedTotal = artificialTotal ? artificialTotal : realTotal;
    var counter = config.slideCounterText( current, displayedTotal);
    if (artificialTotal && current>artificialTotal) counter = config.slideCounterText(counter, realTotal);
    toFill.textContent = counter
}

function showControls(doc, toFill) {
    var controls = xpathWithClass(doc, '/x:html/x:body/x:div', controlsWidgetClass)[0].cloneNode(true)
    setVisible(controls, true)
    var selects = xpathWithClass(controls, './/x:select', slidesSelectClass, doc);
    for (s in selects) {
        var o = selects[s]
        addClass(o, actionClass)
        o.onchange = function() {controller.slideSet(parseInt(this.options[this.selectedIndex].value))}
        o.options[o.length] = new Option("...")
        for (i in model.slides) {
            var txt = "Slide "+(1+parseInt(i))
            var titleTag = xpath(model.slides[i], './/x:h3', model.dataHolderDocument)[0]
            if (titleTag) {
                txt += " : "+titleTag.textContent;
            }
            if (model.currentSlide == parseInt(i)) {
                txt = "* " + txt
            }
            var opt = new Option(txt, i)
            addClass(opt, actionClass)
            o.options[o.length] = opt
        }
    }
    var os = xpathWithClass(controls, './/*', slideNextClass, doc);
    for (s in os) {
        var o = os[s]
        addClass(o,actionClass)
        o.onclick = function(){controller.slideStep(1);}
    }
    var os = xpathWithClass(controls, './/*', slidePreviousClass, doc);
    for (s in os) {
        var o = os[s]
        addClass(o,actionClass)
        o.onclick = function(){controller.slideStep(-1);}
    }
    var os = xpathWithClass(controls, './/*', openSingleViewClass, doc);
    for (s in os) {
        var o = os[s]
        addClass(o,actionClass)
        o.onclick = function(){model.openSecond();}
    }
    adaptSize(toFill, controls, doc)
    setContent(toFill, controls)
}

function setSlide(slideNumber) {
    window.location.hash = "#slide"+(slideNumber+1)
    document.title = config.title( model.title, slideNumber+1, model.slides.length)
    var doReplacement = function(doc, viewClass) {
        var holder = xpathWithClass(doc, '/x:html/x:body/x:div', viewHolderClass)[0]
        var res = holder.firstChild
        if (!res || !hasClass(res, viewClass)) {
            res = xpathWithClass(doc, '/x:html/x:body/x:div', viewClass)[0].cloneNode(true)
            //doc.adoptNode(res)
            //res = doc.importNode(xpathWithClass(doc, '/x:html/x:body/x:div', viewClass)[0], true)
            setVisible(res, true)
            setContent(holder, res)
        }
        var adapted = xpathWithClass(res, './/x:div', "adapt", doc);
        for (s in adapted) {
            adaptSizeToWidth(adapted[s], res.clientWidth, doc);
        }
        var currents = xpathWithClass(res, './/x:div', currentSlideClass, doc);
        for (s in currents) {
            //if (hasClass(currents[s].parentNode, singleViewClass)) {
            if (xpathWithClass(currents[s], 'ancestor::*', singleViewClass, doc).length > 0) {
                showSlideInFullscreen(slideNumber, currents[s], doc);
            } else {
                showSlide(slideNumber, currents[s], doc);
            }
        }
        var nexts = xpathWithClass(res, './/x:div', nextSlideClass, doc);
        for (s in nexts) {
            var n = 1;
            if (nexts[s].getAttribute(nextSlideDeltaAttribute)) {
                n = parseInt(nexts[s].getAttribute(nextSlideDeltaAttribute));
            }
            showSlide( n+slideNumber, nexts[s], doc);
        }
        var notes = xpathWithClass(res, './/x:div', notesClass, doc);
        for (s in notes) {
            showNotes( slideNumber, notes[s], doc);
        }
        var controls = xpathWithClass(res, './/x:div', controlsClass, doc);
        for (s in controls) {
            showControls(doc, controls[s]);
        }
        var slideCounter = xpathWithClass(res, './/x:div', slideCounterClass, doc);
        for (s in slideCounter) {
            showSlideCounter(doc, slideCounter[s]);
        }
    }
    if (isMain()) {
        // Fill in the main window
        var mainDoc = model.mainWindow.document
        doReplacement(mainDoc, multiViewClass)
        // Fill the second window by delegation to the owner
        try {
            model.displayWindow.setSlide(slideNumber)
        } catch(err) {// possible when displayWindow has been closed by user
            model.displayWindow = null;
        }
    } else {
        if (model.displayWindow && model.displayWindow.document) {
            // Fill in the display window
            doReplacement(model.displayWindow.document, singleViewClass)
        }
    }
}

function secondaryClickHandler(e) {
    clickHandler(e)
}

function clickHandler(e) {
    //number = undef;
    //model.currentSlide++;
    //setSlide(model.currentSlide);
    var target;
    if (window.event) {
        target = window.event.srcElement;
        e = window.event;
    } else target = e.target;
    if (target.getAttribute('href') != null || hasClass(target, actionClass)
        /*|| hasValue(target.rel, 'external') || isParentOrSelf(target, 'controls') || isParentOrSelf(target,'embed') || isParentOrSelf(target,'object')*/
    ) return true;
    //controller.slideStep(1);//REM !!! disabled click to next
    /*if (!e.which || e.which == 1) {
    if (!incrementals[snum] || incpos >= incrementals[snum].length) {
    go(1);
    } else {
    subgo(1);
    }
    }*/
}
// 'keys' code adapted from MozPoint (http://mozpoint.mozdev.org/)
function keysHandler(key) {
    if (!key) {
        key = event;
        key.which = key.keyCode;
    }
    //	if (key.which == 84) {
    //		toggle();
    //		return;
    //	}
    if (true) {
        switch (key.which) {
            //			case 10: // return
            //			case 13: // enter
            //				if (window.event && isParentOrSelf(window.event.srcElement, 'controls')) return;
            //				if (key.target && isParentOrSelf(key.target, 'controls')) return;
            //				if(number != undef) {
            //					goTo(number);
            //					break;
            //				}
            case 32: // spacebar
            case 34: // page down
            case 39: // rightkey
            case 40: // downkey
            controller.slideStep(1)
            //				if(number != undef) {
            //					go(number);
            //				} else if (!incrementals[snum] || incpos >= incrementals[snum].length) {
            //					go(1);
            //				} else {
            //					subgo(1);
            //				}
            break;
            case 33: // page up
            case 37: // leftkey
            case 38: // upkey
            controller.slideStep(-1)
            //				if(number != undef) {
            //					go(-1 * number);
            //				} else if (!incrementals[snum] || incpos <= 0) {
            //					go(-1);
            //				} else {
            //					subgo(-1);
            //				}
            break;
            case 36: // home
            controller.slideSet(0);
            break;
            case 35: // end
            goTo(smax-1);
            break;
            case 67: // c
            model.openSecond();
            break;
        default:return true;
        }
        //		if (key.which < 48 || key.which > 57) {
        //			number = undef;
        //		} else {
        //			if (window.event && isParentOrSelf(window.event.srcElement, 'controls')) return;
        //			if (key.target && isParentOrSelf(key.target, 'controls')) return;
        //			number = (((number != undef) ? number : 0) * 10) + (key.which - 48);
        //		}
    }
    return false;
}
function trap(e) {
    var contains = function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
    if (!e) {
        e = event;
    }
    var which = e.which;
    if (!e.which) {
        which = e.keyCode;
    }
    try {
        modifierKey = e.ctrlKey || e.altKey || e.metaKey;
    }
    catch(e) {
        modifierKey = false;
    }
    //    return modifierKey || which == 0;
    var usedKeys = [32, 33, 34,35, 36, 37, 38, 39, 40, 67];
    return modifierKey || !contains(usedKeys, which);
}
function presentationLoaded() {
    if (isMain()) {
        var h = xpathWithClass(document, "/x:html/x:body/*", dataHolderClass)[0];
        {
            var base = (""+window.location).replace(/(.*\/([^/]*)\/)[^/]*(#.*)?$/, "$2");
            var prefix = (""+window.location).replace(/(.*\/([^/]*)\/)[^/]*(#.*)?$/, "$1");
            h.src = base+".xhtml";
        }
        var onload = function() {
            document.onclick = clickHandler
            document.onkeypress = trap
            document.onkeyup = keysHandler
            model.loadPresentation()
            var locationHandler = function () {controller.checkLocation()}
            setInterval(locationHandler, 333)
        };
        h.onload = onload;
    } else {
    document.onclick = secondaryClickHandler
    document.onkeypress = trap
    document.onkeyup = keysHandler
    hideAllButViewHolder(document)
    model.secondWindowLoaded();
}
}

window.onload = presentationLoaded;
