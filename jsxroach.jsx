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
		this.d += (Math.random() * 3) as int - 1;
		if (this.d >= 360) this.d = 0;
		if (this.d < 0) this.d = 359;
		var a = this.d * 2 * 3.141592 / 360.0;
		this.x += Math.cos(a);
		this.y -= Math.sin(a);
		if (this.x < 0) this.x = view.width - 1;
		if (this.y < 0) this.y = view.height - 1;
		if (this.x >= view.width) this.x = 0;
		if (this.y >= view.height) this.y = 0;
	}

	function render(view : View) : void {
		view.context.drawImage(
			view.images[((this.d * 24 / 360) as int)],
			(this.x - 12) as int,
			(this.y - 12) as int);
	}
}

final class View {
	var width : number;
	var height : number;
	var count : number;
	var context : CanvasRenderingContext2D;
	var roaches = [] : Roach[];
	var images = [] : HTMLCanvasElement[];

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
		for (var i = 0; i < 24; i++) {
			this.images[i] = null;
			var image = dom.createElement("img") as HTMLImageElement;
			var index = ("00" + (i * 15) as string).slice(-3);
			image.addEventListener("load", loaded);
			image.src = "img/roach" + index + ".gif";
			image.dataset["name"] = i as string;
		}
	}

	function start() : void {
		dom.window.setInterval(function() : void {
			this.update();
		}, 10);
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
