import "js/web.jsx";

final class Roach {
	var x : number;
	var y : number;
	var d : number;

	function constructor(x : number, y : number, d : number) {
		this.x = x;
		this.y = y;
		this.d = d;
	}

	function move(view : View) : void {
		this.d += Math.floor(3*Math.random()) - 1;
		if (this.d > 23) this.d = 0;
		if (this.d < 0) this.d = 23;
		var a : number = this.d * 24 * 2 * 3.141592 / 360.0;
		this.x += Math.cos(this.d);
		this.y += Math.sin(this.d);
	}

	function render(view : View) : void {
		view.canvas.drawImage(view.images[this.d], this.x, this.y);
	}
}

final class View {
	var width : number;
	var height : number;
	var count : number;
	var canvas : CanvasRenderingContext2D;
	var roaches = [] : Roach[];
	var images = [] : HTMLCanvasElement[];

	function constructor(canvas : HTMLCanvasElement, count : number) {
		this.canvas = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.width = canvas.width;
		this.height = canvas.height;
		this.count = count;
	}

	function init() : void {
		for (var n = 0; n < this.count; n++) {
			this.roaches[n] = new Roach(
				Math.floor(Math.random() * this.width),
				Math.floor(Math.random() * this.height),
				Math.floor(Math.random() * 24));
		}
		var count = 0;
		var loaded = function(e : Event) : void {
			var image = e.target as HTMLImageElement;
			var canvas = dom.createElement("canvas") as HTMLCanvasElement;
			var cx = canvas.getContext("2d") as CanvasRenderingContext2D;
			cx.drawImage(image, 0, 0);
			this.images[image.dataset["name"] as int] = canvas;
			if(++count == this.images.length) {
				this.start();
			}
		};
		for (var n = 0; n < 24; n++) {
			var image = dom.createElement("img") as HTMLImageElement;
			var index = ("00" + (n * 15) as string).slice(-3);
			image.addEventListener("load", loaded);
			image.src = "roach" + index + ".gif";
			image.dataset["name"] = n as string;
		}
	}

	function start() : void {
		dom.window.setInterval(function() : void {
			this.update();
		}, 0);
	}

	function update() : void {
		for (var n : number = 0; n < this.roaches.length; n++) {
			this.roaches[n].move(this);
			this.roaches[n].render(this);
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
