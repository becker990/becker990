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
		
		this.mass = 1;
	
    this.vel_x = vel_x;
		this.vel_y = vel_y;
	
    this.x = x;
		this.y = y;			
		
		this.wid = wid; //px
		this.hei = hei;
	}	
}

class Airtrack {	
	
	constructor () {
		this.wid = 0;
		this.hei = 0;		
		this.objects = [];
		this.gravity = 0;
	}
	
	set_gravity(g = 0) {
		this.gravity = g;		
	}
	
	get_obj_count() {		
		return this.objects.length;		
	}
	
	ins_obj(obj = null) {		
		this.objects.push(obj);		

	}
		
	ins_rand_obj() {	
		var size = 20;
	
		var posx = getRandomInt(0, (this.wid - size));
		var posy = getRandomInt(0, (this.hei - size));		
		var velx = getRandomInt(-100, 100);
		var vely = getRandomInt(-100, 100);

		
		var newobj = new Square(posx, posy, velx, vely, size, size);				
		this.objects.push(newobj);
		
		return newobj;
	}
	
	remove_rand_obj() {
		if (this.get_obj_count() > 0)
			this.objects.pop();
	}

	set_size(wid = 0, hei = 0) {
		this.wid = wid;
		this.hei = hei;		
	}
		
	square_collision (obj = null, delta = 0) {
	
		if (!obj instanceof Square) {			
			throw "Wrong class";
		}

		var g = this.gravity;
				
		var dv_y = g * delta;		
		obj.vel_y = obj.vel_y + dv_y;		
		
		obj.x = obj.x + (obj.vel_x * delta);
		obj.y = obj.y + (obj.vel_y * delta);
			
		var meuDR = 0.9;
		
		if (obj.x < 0 || (obj.x + obj.wid) > this.wid) {				
			obj.vel_x = obj.vel_x * meuDR * -1.0;			
		}
		if (obj.y < 0 || (obj.y + obj.hei) > this.hei) {									
			obj.vel_y = obj.vel_y * meuDR * -1.0;			
		}

		var micra = 0.000001;
		/*	
		if (obj.vel_x <= 0)
			obj.vel_x = 0;
		
		if (obj.vel_y <= 0)
			obj.vel_y = 0;		
		*/
		obj.vel_x = obj.vel_x - (micra * delta);
		obj.vel_y = obj.vel_y - (micra * delta);
			
		// sticky fix
		if (obj.x < 0)
			obj.x = 0;
		if ((obj.x + obj.wid) > this.wid)
			obj.x = this.wid - obj.wid;
		
		if (obj.y < 0)
			obj.y = 0;
		if ((obj.y + obj.hei) > this.hei)
			obj.y = this.hei - obj.hei;
		
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
	}
	
	update() {
		
		var portwid = this.cnv.clientWidth;
		var porthei = this.cnv.clientHeight;		
		
		$('#' + this.CANVASID).css({'height' : (portwid / 2) + 'px'});
		
		this.cnv.width  = portwid;
		this.cnv.height = porthei;
			
		this.ctx = this.cnv.getContext('2d');
	}
}

class GameManager {

	constructor (canvasid = "") {
		this.system = new SystemManager(canvasid);
		
		this.RUNS = true;
		
		this.at = new Airtrack();
		
		this.gameframe(1);
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
	
	add_rand_obj (num = 1) {	
		for (var i = 0; i < num; i++) {
			this.at.ins_rand_obj();			
		}						
	}
	
	remove_rand_obj (num = 1) {	
		for (var i = 0; i < num; i++) {
			this.at.remove_rand_obj();			
		}						
	}
	
	update (delta = 0) {
		var wid = this.system.cnv.width;
		var hei = this.system.cnv.height;
		
		this.at.set_size(wid, hei);
		
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
	
	gameframe (delta = 0) {
		this.system.update();
		if (this.RUNS) {
			this.update(delta);			
		}		
		this.draw();		
	}
}

$(function() {    
    
  console.log("jquery ready!");
	
	canvasid = "maincanvas";
	    
  var game = new GameManager(canvasid);
	
	game.start_run();
		
	var size = 20;
	
	game.add_rand_obj(10);
	
	$("#runbtn").click(function() {		
			
		$(this).toggleClass("btn-primary");
		$(this).toggleClass("btn-secondary");
		game.toggle_run();

		if (game.RUNS)
			$(this).html("Pause");
		else
			$(this).html("Run");		
	});


	$("#addbtn").click(function() {

      var ballnum = $('#ballnum').val();

      if (ballnum < 1) {
        alert("Not enough!");
        return 0;
      }		
  		game.add_rand_obj(ballnum);
	});
	
	$("#removebtn").click(function() { 
	
		var ballnum = $('#ballnum').val();	
		
		if (ballnum < 1) {
			alert("Not enough!");
			return 0;
		}
		game.remove_rand_obj(ballnum);	
	});
	
	$("#gravitycontrol").change(function() {
		var val = $(this).val();
		dbg(val);
        game.at.set_gravity(val);
		$("#gravdisp").html(val);
   });

	function main(DT) {
		window.requestAnimationFrame(main);
		game.gameframe(0.05);
	}	  

	main(); // Start the cycle


}); // jquery ready






































