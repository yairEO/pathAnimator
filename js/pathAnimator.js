
function PathAnimator (path, target, duration, loop, reverse, easingFn) {
					
	// scope vars
	var self = this;
	self.d = (typeof target === 'string') ? document.getElementById(target) : target;
	self.duration = null;
	if (typeof duration == 'number') {
		self.duration = duration * 1000 || 2000;
	} else if (duration == 'auto') {
		self.autoDuration = true;
	}
	self.loop = loop || false;
	self.reverse = reverse || false;
	self.easingFn = easingFn;
	self.startTime = null;
    self.autoDurationMultiplier = 1000 // time per 10th of a percent

	this.updatePath = function(path){
		self.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		self.path.setAttribute('d', path);
		self.len = self.path.getTotalLength();
	}

    self.updatePath(path);

	this.start = function(startPercent, endPercent, callback) {
		// defaults
		self.startPercent = startPercent || 0;
		self.endPercent = endPercent || 1;
		if (self.startPercent > self.endPercent) self.reverse = true;
		if (self.startPercent == self.endPercent) return false;
		if (callback) self.callback = callback;
		self.stop();
		// auto duration
		if (self.autoDuration) {
			self.duration = (Math.abs(endPercent - startPercent) / .1) * self.autoDurationMultiplier;
			if (self.duration < self.autoDurationMultiplier) self.duration = self.autoDurationMultiplier; // min duration
			if (self.duration > self.autoDurationMultiplier * 10) self.duration = self.autoDurationMultiplier * 10; // max duration
		}
		// begin
		self.rAF = requestAnimationFrame(self.step);
	}

	this.pauseResume = function(){
		if (!self.paused) {
            self.paused = true;
            cancelAnimationFrame(self.rAF);
        } else {
            self.paused = false;
            // resume
            requestAnimationFrame(function(timestamp) {
	            self.startTime = timestamp - self.elapsed;
		        self.rAF = requestAnimationFrame(self.step);
            });
        }
	}
	this.step = function(timestamp) {

		if (self.startTime === null) self.startTime = timestamp;

        self.elapsed = timestamp - self.startTime;
        self.percent = self.elapsed/self.duration;
			
		// easing functions: https://gist.github.com/gre/1650294
		if (self.easingFn && typeof self.easingFn == 'function') {
			self.percent = self.easingFn(self.percent);
			if (self.percent > 1) self.percent = 1;
			if (self.percent < 0) self.percent = 0;
		}

		if (self.reverse)
			self.percent = Math.abs(1 - self.percent);
		else
			self.percent += self.startPercent;

		// whether to continue
        if (self.elapsed < self.duration) {

			// angle calculations
			var p = [
				self.pointAt(self.percent - .01),
				self.pointAt(self.percent + .01)
			];
			
			var angle = Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180 / Math.PI;
			
			var point = self.pointAt(self.percent);

			self.d.style.cssText = "top:" + point.y + "px;" + 
									"left:" + point.x + "px;" + 
									"transform:rotate(" + angle + "deg);" +
									"-ms-transform:rotate(" + angle + "deg);" +
									"-webkit-transform:rotate(" +  angle + "deg);";

            self.rAF = requestAnimationFrame(self.step);
        } else {
            if (self.callback != null) self.callback();
            if (self.loop) {
            	self.startTime = null;
            	self.rAF = requestAnimationFrame(self.step);
            }
        }
	}
	
	this.stop = function() {
		if (self.rAF) cancelAnimationFrame(self.rAF);
		self.startTime = null;
	}

	this.pointAt = function(decimalPercent){
		return self.path.getPointAtLength( self.len * decimalPercent );
	}

	/*	make sure requestAnimationFrame and cancelAnimationFrame are defined -
    	polyfill for browsers without native support. For this particular project,
    	only IE9 needs this bc it supports SVG but does not have rAF. <= IE8 not supported.
    	by Opera engineer Erik Möller
    */
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        }
    }
}