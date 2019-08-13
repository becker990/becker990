/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dbg(msg = "") {
	console.log("[DBG] : <" + msg + ">");
}

class Square {
	constructor (x = 0, y = 0, vel_x = 0, vel_y = 0, wid = 0, hei = 0) {
		this.x = x; // physics
		this.y = y;	
		
		this.vel_x = vel_x;
		this.vel_y = vel_y;
		
		this.wid = wid; //px
		this.hei = hei;
	}	
}

class Airtrack {	
	
	constructor (wid = 0, hei = 0) {
		this.wid = wid;
		this.hei = hei;
		
		this.objects = [];
	}
		
	ins_rand_obj() {	
		var size = 20;
	
		var posx = getRandomInt(0, (this.wid - size));
		var posy = getRandomInt(0, (this.hei - size));		
		var velx = getRandomInt(-10, 10);
		var vely = getRandomInt(-10, 10);
		
		var newobj = new Square(posx, posy, velx, vely, size, size);				
		this.objects.push(newobj);
		
		return newobj;
	}
		
	square_collision (obj = null, delta = 0) {
	
		if (!obj instanceof Square) {			
			throw "Wrong class";
		}
		
		obj.x = obj.x + (obj.vel_x * delta);
		obj.y = obj.y + (obj.vel_y * delta);
		
		if (obj.x < 0 || (obj.x + obj.wid) > this.wid) {				
			obj.vel_x = obj.vel_x * -1;			
		}
		if (obj.y < 0 || (obj.y + obj.hei) > this.hei) {									
			obj.vel_y = obj.vel_y * -1;			
		}
	
		return obj;
	
	}
	
	update (delta = 0) {		
		for (var obj of this.objects) {		
			if (obj instanceof Square) {
				this.square_collision(obj, delta);
			}			
		}		
	}		
}

class SystemManager {
	constructor (canvasid = "") {
		this.CANVASID = canvasid;

		this.cnv = document.getElementById(canvasid);
				
		this.cnv.width  = this.cnv.scrollWidth;
		this.cnv.height = this.cnv.scrollHeight;

		this.ctx = this.cnv.getContext('2d');		
	}
}

class GameManager {

	constructor () {
		this.system = new SystemManager("maincanvas");
		
		this.RUNS = false;
		
		this.at = new Airtrack(this.system.cnv.width, this.system.cnv.height);
	}
	
	start_run () {
		this.RUNS = true;
	}
	
	stop_run () {
		this.RUNS = false;
	}
	
	toggle_run () {						
		if(this.RUNS)
			this.stop_run();
		else
			this.start_run();			
	}
	
	add_obj (num = 1) {	
		for (var i = 0; i < num; i++) {
			this.at.ins_rand_obj();			
		}						
	}
	
	update (delta = 0) {
		this.at.update(delta);
	}
		
	draw () {	
		// clear canvas
		this.system.ctx.clearRect(0, 0, this.system.cnv.width, this.system.cnv.height);
				
		for (var obj of this.at.objects) {
			
			//ctx.fillRect(x, y, width, height);
			this.system.ctx.fillRect(obj.x, obj.y, obj.wid, obj.hei);
			
			/*
			this.system.ctx.beginPath();
			this.system.ctx.arc(b.x, b.y, (b.wid / 2), 0, 2 * Math.PI, false);
			//this.system.ctx.fillStyle = 'green';
			this.system.ctx.fill();
			*/
		}			
	}
	
	frame (delta = 0) {
		if (!this.RUNS)
			return 0;
		this.update(delta);
		this.draw();		
	}
}

$(function() {    
    
    console.log("jquery ready!");
    
    var game = new GameManager();
	
	game.add_obj(10);
	
	game.start_run();
	
	$("#runbtn").click(function(){
	
		game.toggle_run();
	
	});

	$("#addbtn").click(function() {

		var ballnum = $('#ballnum').val();

		dbg(ballnum);
		
		if (ballnum < 1) {
			alert("Not enough!");
			return 0;
		}
		
		game.add_obj(ballnum);

	});

	function main(DT) {
		window.requestAnimationFrame(main);
		game.frame(1);
	}	  

	main(); // Start the cycle


}); // jquery ready






































