var JSX = {};
(function () {

/**
 * copies the implementations from source interface to target
 */
function $__jsx_merge_interface(target, source) {
	for (var k in source.prototype)
		if (source.prototype.hasOwnProperty(k))
			target.prototype[k] = source.prototype[k];
}

/**
 * defers the initialization of the property
 */
function $__jsx_lazy_init(obj, prop, func) {
	function reset(obj, prop, value) {
		delete obj[prop];
		obj[prop] = value;
		return value;
	}

	Object.defineProperty(obj, prop, {
		get: function () {
			return reset(obj, prop, func());
		},
		set: function (v) {
			reset(obj, prop, v);
		},
		enumerable: true,
		configurable: true
	});
}

/*
 * global functions called by JSX as Number.* (renamed so that they do not conflict with local variable names)
 */
var $__jsx_parseInt = parseInt;
var $__jsx_parseFloat = parseFloat;
var $__jsx_isNaN = isNaN;
var $__jsx_isFinite = isFinite;

var $__jsx_ObjectToString = Object.prototype.toString;
var $__jsx_ObjectHasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * public interface to JSX code
 */
JSX.require = function (path) {
	var m = $__jsx_classMap[path];
	return m !== undefined ? m : null;
}
/**
 * class Roach extends Object
 * @constructor
 */
function Roach() {
}

Roach.prototype = new Object;
/**
 * @constructor
 * @param {!number} x
 * @param {!number} y
 * @param {!number} d
 */
function Roach$NNN(x, y, d) {
	this.x = x;
	this.y = y;
	this.d = d;
};

Roach$NNN.prototype = new Roach;

/**
 * @param {View} view
 */
Roach.prototype.move$LView$ = function (view) {
	/** @type {!number} */
	var a;
	this.d += (Math.random() * 3 | 0) - 1;
	if (this.d >= 360) {
		this.d = 0;
	}
	if (this.d < 0) {
		this.d = 359;
	}
	a = this.d * 2 * 3.141592 / 360.0;
	this.x += Math.cos(a);
	this.y -= Math.sin(a);
	if (this.x < 0) {
		this.x = view.width - 1;
	}
	if (this.y < 0) {
		this.y = view.height - 1;
	}
	if (this.x >= view.width) {
		this.x = 0;
	}
	if (this.y >= view.height) {
		this.y = 0;
	}
};

/**
 * @param {View} view
 */
Roach.prototype.render$LView$ = function (view) {
	view.context.drawImage((function (v) {
		if (! (typeof v !== "undefined")) {
			debugger;
			throw new Error("[jsxroach.jsx:29] detected misuse of 'undefined' as type 'HTMLCanvasElement'");
		}
		return v;
	}(view.images[this.d * 24 / 360 | 0])), this.x - 12 | 0, this.y - 12 | 0);
};

/**
 * class View extends Object
 * @constructor
 */
function View() {
}

View.prototype = new Object;
/**
 * @constructor
 * @param {HTMLCanvasElement} canvas
 * @param {!number} count
 */
function View$LHTMLCanvasElement$N(canvas, count) {
	this.roaches = [  ];
	this.images = [  ];
	this.context = (function (o) { return o instanceof CanvasRenderingContext2D ? o : null; })(canvas.getContext("2d"));
	this.width = canvas.width;
	this.height = canvas.height;
	this.count = count;
};

View$LHTMLCanvasElement$N.prototype = new View;

/**
 */
View.prototype.init$ = function () {
	var $this = this;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var count;
	var loaded;
	/** @type {HTMLImageElement} */
	var image;
	/** @type {!string} */
	var index;
	for (i = 0; i < this.count; i++) {
		this.roaches[i] = new Roach$NNN(Math.random() * this.width | 0, Math.random() * this.height | 0, Math.random() * 360 | 0);
	}
	count = 0;
	loaded = (function (e) {
		/** @type {HTMLImageElement} */
		var image;
		/** @type {HTMLCanvasElement} */
		var canvas;
		/** @type {CanvasRenderingContext2D} */
		var context;
		image = (function (o) { return o instanceof HTMLImageElement ? o : null; })(e.target);
		canvas = (function (o) { return o instanceof HTMLCanvasElement ? o : null; })(dom$createElement$S("canvas"));
		context = (function (o) { return o instanceof CanvasRenderingContext2D ? o : null; })(canvas.getContext("2d"));
		context.drawImage(image, 0, 0);
		$this.images[image.dataset["name"] | 0] = canvas;
		if (++ count === $this.images.length) {
			$this.start$();
		}
	});
	for (i = 0; i < 24; i++) {
		this.images[i] = null;
		image = (function (o) { return o instanceof HTMLImageElement ? o : null; })(dom$createElement$S("img"));
		index = ("00" + (i * 15 + "")).slice(- 3);
		image.addEventListener("load", loaded);
		image.src = "img/roach" + index + ".gif";
		image.dataset["name"] = i + "";
	}
};

/**
 */
View.prototype.start$ = function () {
	var $this = this;
	dom.window.setInterval((function () {
		$this.update$();
	}), 50);
};

/**
 */
View.prototype.update$ = function () {
	/** @type {!number} */
	var i;
	this.context.fillStyle = "rgb(255, 255, 255)";
	this.context.fillRect(0, 0, this.width, this.height);
	for (i = 0; i < this.roaches.length; i++) {
		this.roaches[i].move$LView$(this);
		this.roaches[i].render$LView$(this);
	}
};

/**
 * class Application extends Object
 * @constructor
 */
function Application() {
}

Application.prototype = new Object;
/**
 * @constructor
 */
function Application$() {
};

Application$.prototype = new Application;

/**
 * @param {!string} canvasId
 * @param {!number} count
 */
Application.main$SN = function (canvasId, count) {
	/** @type {HTMLCanvasElement} */
	var canvas;
	/** @type {View} */
	var view;
	canvas = (function (o) { return o instanceof HTMLCanvasElement ? o : null; })(dom$id$S(canvasId));
	view = new View$LHTMLCanvasElement$N(canvas, count);
	view.init$();
};

Application$main$SN = Application.main$SN;

/**
 * class dom extends Object
 * @constructor
 */
function dom() {
}

dom.prototype = new Object;
/**
 * @constructor
 */
function dom$() {
};

dom$.prototype = new dom;

/**
 * @param {!string} id
 * @return {HTMLElement}
 */
dom.id$S = function (id) {
	return (function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById(id));
};

dom$id$S = dom.id$S;

/**
 * @param {!string} id
 * @return {HTMLElement}
 */
dom.getElementById$S = function (id) {
	return (function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById(id));
};

dom$getElementById$S = dom.getElementById$S;

/**
 * @param {!string} tag
 * @return {HTMLElement}
 */
dom.createElement$S = function (tag) {
	return (function (v) {
		if (! (v === null || v instanceof HTMLElement)) {
			debugger;
			throw new Error("[C:/Documents and Settings/U001672/Application Data/npm/node_modules/jsx/lib/js/js/web.jsx:30] detected invalid cast, value is not an instance of the designated type or null");
		}
		return v;
	}(dom.window.document.createElement(tag)));
};

dom$createElement$S = dom.createElement$S;

/**
 * class js extends Object
 * @constructor
 */
function js() {
}

js.prototype = new Object;
/**
 * @constructor
 */
function js$() {
};

js$.prototype = new js;

$__jsx_lazy_init(dom, "window", function () {
	return js.global["window"];
});
js.global = (function () { return this; })();

var $__jsx_classMap = {
	"jsxroach.jsx": {
		Roach: Roach,
		Roach$NNN: Roach$NNN,
		View: View,
		View$LHTMLCanvasElement$N: View$LHTMLCanvasElement$N,
		Application: Application,
		Application$: Application$
	},
	"system:lib/js/js/web.jsx": {
		dom: dom,
		dom$: dom$
	},
	"system:lib/js/js.jsx": {
		js: js,
		js$: js$
	}
};


}());
