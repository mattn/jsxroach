import "js/web.jsx";

final class Roach {
	var x : number;
	var y : number;
	var d : number;
	var s : boolean;

	function constructor(x : number, y : number, d : number) {
		this.x = x;
		this.y = y;
		this.d = d;
	}

	function move(view : View) : void {
		if (this.s) return;
		this.d += (Math.random() * 7) as int - 3;
		if (this.d >= 360) this.d = 0;
		if (this.d < 0) this.d = 359;

		var dx = view.mousePoint[0] - this.x;
		var dy = view.mousePoint[1] - this.y;
		var dr = Math.sqrt(dx * dx + dy * dy);
		if (dr < 100) {
			var er = Math.atan2(dy, dx) * 360.0 / 2 / 3.141592;
			if (er < 0) er += 180;
			this.d += er < this.d ? -7 : 7;
		}

		var a = this.d * 2 * 3.141592 / 360.0;
		this.x += Math.cos(a) * 3;
		this.y -= Math.sin(a) * 3;
		if (this.x < 0) this.x = view.width - 1;
		if (this.y < 0) this.y = view.height - 1;
		if (this.x >= view.width) this.x = 0;
		if (this.y >= view.height) this.y = 0;
	}

	function render(view : View) : void {
		if (this.s) {
			view.context.drawImage(
				view.images[24],
				(this.x - 12) as int,
				(this.y - 12) as int);
		} else {
			view.context.drawImage(
				view.images[((this.d * 24 / 360) as int)],
				(this.x - 12) as int,
				(this.y - 12) as int);
		}
	}

	function hit(point : number[]) : boolean {
		if (this.s) return false;
		var dx = point[0] - this.x;
		var dy = point[1] - this.y;
		var dr = Math.sqrt(dx * dx + dy * dy);
		if (dr < 50) {
			this.s = true;
			return true;
		}
		return false;
	}
}

final class View {
	var width : number;
	var height : number;
	var count : number;
	var context : CanvasRenderingContext2D;
	var roaches = [] : Roach[];
	var images = [] : HTMLCanvasElement[];
	var deadImage : HTMLCanvasElement;
	var mousePoint = [0, 0] : number[];

	function constructor(canvas : HTMLCanvasElement, count : number) {
		this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.width = canvas.width;
		this.height = canvas.height;
		this.count = count;
	}

	function init() : void {
		for (var i = 0; i < this.count; i++) {
			this.roaches[i] = new Roach(
				(Math.random() * this.width) as int,
				(Math.random() * this.height) as int,
				(Math.random() * 360) as int);
		}
		var count = 0;
		var loaded = function(e : Event) : void {
			var image = e.target as HTMLImageElement;
			var canvas = dom.createElement("canvas") as HTMLCanvasElement;
			var context = canvas.getContext("2d") as CanvasRenderingContext2D;
			context.drawImage(image, 0, 0);
			this.images[image.dataset["name"] as int] = canvas;
			if(++count == this.images.length) {
				this.start();
			}
		};
		for (var i = 0; i < 25; i++) {
			this.images[i] = null;
			var image = dom.createElement("img") as HTMLImageElement;
			var index = ("00" + (i * 15) as string).slice(-3);
			image.addEventListener("load", loaded);
			image.src = "img/roach" + index + ".gif";
			image.dataset["name"] = i as string;
		}

		var touchMove = function(e : Event) : void {
			e.preventDefault();
			this.mousePoint = this.getPoint(e);
		};
		var body = dom.window.document.body;
		body.addEventListener("mousemove", touchMove);
		body.addEventListener("touchmove", touchMove);

		var touchStart = function(e : Event) : void {
			e.preventDefault();
			var p = this.getPoint(e);
			for (var i = 0; i < this.roaches.length; i++) {
				if (this.roaches[i].hit(p)) {
					if (--count == 0) {
						// game over;
					}
				}
			}
		};
		body.addEventListener("mousedown",  touchStart);
		body.addEventListener("touchstart", touchStart);
	}

	function getPoint(e : Event/*UIEvent*/) : number[] {
		var px = 0;
		var py = 0;
		if(e instanceof MouseEvent) {
			var me = e as MouseEvent;
			px = me.clientX;
			py = me.clientY;
		}
		else if(e instanceof TouchEvent) {
			var te = e as TouchEvent;
			px = te.touches[0].pageX;
			py = te.touches[0].pageY;
		}
		return [ px, py ];
	}

	function start() : void {
		dom.window.setInterval(function() : void {
			this.update();
		}, 0);
	}

	function update() : void {
		this.context.fillStyle = "rgb(255, 255, 255)";
		this.context.fillRect(0, 0, this.width, this.height);
		for (var i = 0; i < this.roaches.length; i++) {
			this.roaches[i].move(this);
			this.roaches[i].render(this);
		}
	}
}

final class Application {
	static function main(canvasId : string, count : number) : void {
		var canvas = dom.id(canvasId) as HTMLCanvasElement;
		var view = new View(canvas, count);
		view.init();
	}
}
