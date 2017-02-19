b.addEventListener("click", e=> {debugger});
d = document.createElement("canvas");
e = d.getContext("2d");

debug = document.createElement("div");
b.appendChild(debug)
b.appendChild(d);

var size = a.width = a.height = 512, 
	M = Math, 
	sc = 1, 
	scaleTarget = 1, 
	beginWarp = false, 
	third = M.PI / 3, 
	parts = [], 
	dead = [],
	i;

d.width = d.height = size * 2;

var r = (v) => { return ~~(M.random() * v || 1); };

var sixit = (v) => { return (v + 6) % 6 }; // clamp v between 0 and 6


var create = (origin, x, y, dir, mod) => {
	var p;
	x = x || size;
	y = y || size;
	mod = mod || 1;
	// con.log(x, y);

	// e.fillStyle = "blue"
	// e.fillRect(x - 5, y - 5, 10, 10);//p.s, p.s);

	
	if (dead.length) {
		p = dead.splice(-1)[0];
		p.dir = dir;
		p.x = x;
		p.y = y;
		p.origin = false;
		p.pos = 0;
		p.dying = 1;
		p.alive = true;

		p.setColour();
		
	} else {

		if (parts.length > size) return ;//con.warn("too many!");

		p = {

			pos: 0,
			dying: 1,
			alive: true,
			x,
			y,

			origin,
			life: 0,
			dir: dir || r(3) * 2, // 0, 2 or 4
			mod,
			s: 2 / 1 * mod, //1 / M.pow(2, r(2)),
			v: 1 / 32 / mod, // / M.pow(2, r(4)),
			setColour: (p2) => {
				p.colour = "hsla(" + (p.life++ * 20) + ",70%," + (40 + p.s * 20) +"%,0.7)";
				// p.colour = "hsla(" + r(360) + ",70%,50%,1)";
				// con.log(p.colour)
			},
			kill: () => {
				p.x = 0;
				p.y = 0;
				p.alive = false;
				dead.push(p);
			},
			m: () => {

				if (p.alive == false) {
					e.fillStyle = p.colour;
					e.fillText(p.index, p.index * 5, 10);
					return;//con.log("returning")
				}

				p.dying *= p.origin ? 1 : 0.95;

				if (p.dying < 0.001) {
					p.kill();
					return;
				}

				p.pos += p.v;// 1 / 16; //p01!!
				if (p.pos==1) {

					if (p.x < 0 || p.y > size * 2 || p.y < 0 || p.y > size * 2) {
						p.kill();
						return;
					}


					p.pos = 0;
					// p.setColour();
					p.dir += sixit(r(2) * 2 - 1); // add -1 or 1 to new dir.

					if (p.mod > 1/2 && r(10) > 2) { // duplicate at current position
						
						// var newDir = r(2) * 4 - 2; // + -2 or 2
						// newDir = p.dir + newDir; // make sure clone has new direction
						// newDir = (newDir + 6) % 6; // clamp to positives: 0 > 5

						for (var i = 0; i < 2; i++) {
							
							
							var newDir = sixit(p.dir + r(2) * 4 - 2); // same as above 3 lines
							
							// e.fillStyle = "red"
							// e.fillRect(p.x - 10, p.y - 10, 20, 20);//p.s, p.s);

							create(false, p.x, p.y, newDir, p.mod / 2);
							// debugger;
						}
					}

				} else {

					// p.x += dirs[p.dir][0] * p.s;
					// p.y += dirs[p.dir][1] * p.s;

					// con.log("p.pos", p.pos)
					p.x += M.sin(p.dir * third) * p.s;
					p.y += M.cos(p.dir * third) * p.s;

					// p.colour = `rgba(255,255,255,1)`;//${ p.dying })`;

					// e.fillStyle = "#000"
					e.fillStyle = p.colour;
					e.fillRect(p.x, p.y, 1, 1);//p.s, p.s);
					// e.fillText(p.index, p.x, p.y + 10);
				}
				// if (p.dir < 0 || p.dir > 5) {con.log("aargh", p.dir);}

				// if (M.round(p.x * 32) != p.x * 32) con.log("unround", p.x)


			}
		}

		p.setColour();
		p.index = parts.length;
		parts.push(p);


	}

};
var render = (t) =>{

	debug.innerHTML = parts.map(p=>Math.round(p.x)); 

	if ((M.floor(t / 1000) + 1) % 3 == 0) {
		if (beginWarp == false) { // warp has just begun! fuck yeah.
			beginWarp = true;
			scaleTarget = M.random() + .7;
		}
	} else {
		beginWarp = false;
	}

	sc -= (sc - scaleTarget) / 9;

	c.save();
	c.translate(size / 2, size / 2);
	// c.scale(sc, sc);
	// c.rotate(t * 0.0001); // arbitrary divisor
	c.translate(-size, -size);

	e.fillStyle = "rgba(0,0,0,0.02)";
	e.fillRect(0, 0, size * 2, size * 2);


	// if (!warpMode)
	for(i=0;i<parts.length;i++) parts[i].m();

	c.drawImage(d, 0, 0);
	c.restore();
	requestAnimationFrame(render);
};

while(parts.length < 4) create(true);

render(0);