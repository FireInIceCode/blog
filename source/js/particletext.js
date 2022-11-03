const size = 6;
const count = 500;
const text_scale = 3;
const text_size = 70;
const space=7;

var world = new cp.World((ctx, canvas) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function newParticle(emitter, canvas) {
	var particle = emitter.emit();
	world.addParticle(particle);
	var action = new cp.Action(cp.getReBoundFunc(100, canvas.height - size, 0.8));
	particle.addAction(action, false);
	action.type = 'rebound';
	action.start();
	action.doing = false;
	setTimeout(() => {
		cp.scaleInOut(particle, 1, 1.5, 0.5, cp.easeFunctions['easeInOut']);
	}, parseInt(Math.random() * 1000));
	particle.enableShade = true;
	particle.minShadeDis = 15;
	particle.getShadeStep = cp.getBasicShadeStepGetter((obj, t) => {
		obj.alpha -= t / 2;
		obj.scale -= t;
		return true;
	}, 0.6);
	return particle;
}

function show() {
	var header = document.querySelector('header');
	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.className = 'particle-canvas';
	header.appendChild(canvas);

	var emitter = new cp.PointCircleEmitter(canvas.width / 2, canvas.height / 2, 100, new cp.BallPaintFunc(size, null, true));
	world.addForce(cp.forces.getMouseAwayForce(canvas, 10000, 100));
	for (var i = 0; i < count; i++) {
		newParticle(emitter, canvas);
	};
	world.init(canvas, 60);

	var pos_gener = new cp.PosGenerator();
	var title=(document.querySelector('#site-title') || document.querySelector('#post-title'));
	title.parentElement.removeChild(title);
	var str = title.innerText;
	var poses = pos_gener.getPosFromTextEx(str, text_size + 'px 微软雅黑', true, text_scale, canvas.width, canvas.height);

	// var dfunc=cp.distributes.getLineDistribute(cp.easeFunctions['easeInOutBack']);
	// var dfunc = cp.distributes.getCircleDistribute(cp.easeFunctions['easeInOutBack']);
	var dfunc=cp.distributes.distributeAndFix(cp.easeFunctions['easeInOutBack'],1);
	var tdfunc = (particle, pos, time) => {
		particle.enableForce = false;
		for (var a of particle.actions) {
			if (a.type == 'rebound') {
				a.doing = false;
			}
		}
		dfunc(particle, pos, time);
	}

	var spfunc = (particle, t) => {
		particle.vy = 0;
		for (var a of particle.actions) {
			if (a.type == 'rebound') {
				a.start();
			}
		}
	}

	var nfunc = (pos, time) => {
		var p = newParticle(emitter, canvas);
		tdfunc(p, pos, time);
		return p;
	};

	setTimeout(() => {
		world.distributePosByDistance(poses, 2, tdfunc, spfunc, nfunc, space);
	}, 1000);
}

window.addEventListener('load', show);