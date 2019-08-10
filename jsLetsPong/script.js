
$(function() {
    
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

    
    console.log( " jquery ready!" );


	var RUNS = false;

	const CANVASID = "maincanvas";

	var cnv = document.getElementById(CANVASID);
	cnv.width  = cnv.scrollWidth;
	cnv.height = cnv.scrollHeight;

	var ctx = cnv.getContext('2d');
	
	$( "#runbtn" ).click(function() {
    	
    	dbg("click");
    	
    	var msg = "";	
		
		if(RUNS) {
			msg = "Run";
			RUNS = false;
		} else {
			msg = "Stop";
			RUNS = true;
		}

		document.getElementById("runbtn").innerHTML = msg;
	});
	
	$( "#addbtn" ).click(function() {
	
		var ballnum = $('#ballnum').val();

		dbg(ballnum);

		for (var i = 0; i < ballnum; i++) {
			at.ins_rand_ball();
		}
	});

	function Ball (x = 0, y = 0, vel_x = 0, vel_y = 0, wid = 0, hei = 0) {
		
		this.x = x; // physics
		this.y = y;	
		
		this.vel_x = vel_x;
		this.vel_y = vel_y;
		
		this.wid = wid; //px
		this.hei = hei;
		
	};

	function Airtrack (wid = 0, hei = 0) {	
		
		this.wid = wid;
		this.hei = hei;
		
		this.balls = [];
		
		this.ins_rand_ball = function () {
			
			newb = new Ball();
			
			newb.wid = 20;
			newb.hei = 20;
			
			newb.x = getRandomInt(0, (this.wid - newb.wid));
			newb.y = getRandomInt(0, (this.hei - newb.hei));
			
			newb.vel_x = getRandomInt(-10, 10);
			newb.vel_y = getRandomInt(-10, 10);
			
			this.balls.push(newb);
			
		};
		
		this.update = function (delta = 0) {
			
			
			for (var b of this.balls) {
			
				b.x = b.x + (b.vel_x * delta);
				b.y = b.y + (b.vel_y * delta);
					
				
				if (b.x < 0 || (b.x + b.wid) > this.wid) {
						
					b.vel_x = b.vel_x * -1;
					
				}
				
				if (b.y < 0 || (b.y + b.hei) > this.hei) {
											
					b.vel_y = b.vel_y * -1;
					
				}
				
			}
			
			
		};
		
		this.draw = function (ctx) {
			
			for (var b of this.balls) {		
				
				ctx.fillRect(b.x, b.y, b.wid, b.hei);
				
			}
			
		};
	};


	var at = new Airtrack(cnv.width, cnv.height);
	

	(function () {
	  function main( DT ) {
		
		window.requestAnimationFrame( main );
		
		//dbg("loop");
		
		if (!RUNS)
			return 0;
		
		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0, 0, cnv.width, cnv.height); // clear canvas

		at.update(1);
		
		at.draw(ctx);
		
	  }
	  
	  main(); // Start the cycle
	})();


}); // jquery ready






































