function PathAnimator (path, target, durationSecs, reverse, easingFn) {
					
	// scope vars
	var self = this;
	self.d = (typeof target === 'string') ? document.getElementById(target) : target;
	self.duration = durationSecs * 1000 || 2000;
	self.reverse = reverse;
	self.startTime = null;
    self.timestamp = null;
    self.remaining = null;

	this.updatePath = function(path){
		self.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		self.path.setAttribute('d', path);
		self.len = self.path.getTotalLength();
	}

    self.updatePath(path);

	this.start = function(startPercent, endPercent, callback){
		self.startTime = null;
		self.startPercent = startPercent || 0;
		self.endPercent = endPercent || 1;
		if (callback) self.callback = callback;
		self.stop();

		self.rAF = requestAnimationFrame(self.step);
	}
	// Robert Penner's easeOutExpo
	// progress, self.startVal, self.endVal - self.startVal, self.duration
	this.easeOutExpo = function(t, b, c, d) {
	    return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
	}
	this.step = function(timestamp) {

		if (self.startTime === null) self.startTime = timestamp;
        self.timestamp = timestamp;
        var progress = timestamp - self.startTime;
        self.remaining = self.duration - progress;
        var decimalPercent = progress/self.duration;
			
		// easing functions: https://gist.github.com/gre/1650294

		if( typeof easingFn == 'function' )
			decimalPercent = easingFn(decimalPercent);

		if( self.reverse )
			decimalPercent = self.startPercent - decimalPercent;
		else
			decimalPercent += self.startPercent;
		

		// whether to continue
        if (decimalPercent < self.endPercent) {

			// angle calculations
			var p = [
				self.pointAt(decimalPercent - .01),
				self.pointAt(decimalPercent + .01)
			];
			
			var angle = Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180 / Math.PI;
			
			var point = self.pointAt(decimalPercent);

			self.d.style.cssText = "top:" + point.y + "px;" + 
									"left:" + point.x + "px;" + 
									"transform:rotate(" + angle + "deg);" +
									"-webkit-transform:rotate(" +  angle + "deg);";

            self.rAF = requestAnimationFrame(self.step);
        } else {
            if (self.callback != null) self.callback();
        }
	}
	
	this.stop = function(){
		if (self.rAF) cancelAnimationFrame(self.rAF);
	}
	
	this.pointAt = function(decimalPercent){
		return self.path.getPointAtLength( self.len * decimalPercent );
	}

	// make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
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