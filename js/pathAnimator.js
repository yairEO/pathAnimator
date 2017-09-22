/*-----------------------------
    Path Animator v1.1.0
    (c) 2013 Yair Even Or <http://dropthebit.com>

    MIT-style license.
------------------------------*/
function PathAnimator(path) {
  if (path) this.updatePath(path);
  this.timer = null;
}

PathAnimator.prototype = {
  start(duration, step, reverse, startPercent, callback, easing, stopAt) {
    this.stop();
    this.percent = startPercent || 0;

    if (duration === 0) return false;

    const that = this;
    const startTime = new Date();
    const delay = 1000 / 60;
    const stopPercent = stopAt || (reverse ? 0 : 100);

    (function calc() {
      const p = [];
      const now = new Date();
      const elapsed = (now - startTime) / 1000;
      let t = (elapsed / duration);

      // easing functions: https://gist.github.com/gre/1650294
      if (typeof easing === 'function') {
        t = easing(t);
      }

      let percent = t * (stopPercent - startPercent);
      if (reverse) {
        percent *= -1;
      }

      that.running = true;

      // On animation end (from '0%' to '100%' or '100%' to '0%')
      if (t > 1) {
        that.stop();
        return callback.call(that.context);
      }

      that.percent = percent + startPercent; // save the current completed percentage value

      if (reverse) {
        that.percent = startPercent - percent;
      }

      //  angle calculations
      p[0] = that.pointAt(that.percent - 1);
      p[1] = that.pointAt(that.percent + 1);
      const angle = (Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x) * 180) / Math.PI;

      // advance to the next point on the path
      that.timer = setTimeout(calc, delay);
      // do one step ("frame")
      step.call(that.context, that.pointAt(that.percent), angle);
      return null;
    }());

    return this;
  },

  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.running = false;
  },

  pointAt(percent) {
    return this.path.getPointAtLength((this.len * percent) / 100);
  },

  updatePath(path) {
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('d', path);
    this.len = this.path.getTotalLength();
  },
};

export default PathAnimator;
