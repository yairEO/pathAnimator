/*-----------------------------
    Path Animator v1.2.0
    (c) 2013 Yair Even Or <http://dropthebit.com>

    MIT-style license.
------------------------------*/

function PathAnimator( path, settings ){
    if( path ) this.updatePath(path);
    this.timer = null;

    this.settings = {
        duration     : settings.duration,
        step         : settings.step,
        reverse      : !!settings.reverse,
        startPercent : settings.startPercent || 0,
        onDone       : settings.onDone,
        easing       : settings.easing
    }
}

PathAnimator.prototype = {
    start : function(){
        this.stop();
        this.percent = this.settings.startPercent || 0;
        if( this.settings.duration == 0 ) return false;

        var that = this,
            startTime = new Date(),
            delay = 1000/60;

        (function calc(){
            var p       = [], angle,
                now     = new Date(),
                elapsed = (now-startTime)/1000,
                t       = (elapsed/that.settings.duration),
                percent = t * 100;

            // easing functions: https://gist.github.com/gre/1650294
            if( typeof that.settings.easing == 'function' )
                percent = that.settings.easing(t) * 100;

            if( that.reverse )  percent = that.settings.startPercent - percent;
            else                percent += that.settings.startPercent;

            that.running = true;

            // On animation end (from '0%' to '100%' or '100%' to '0%')
            if( percent > 100 || percent < 0 ){
                that.stop();
                return that.settings.onDone();
            }

            that.percent = percent; // save the current completed percentage value

            //  angle calculations
            p[0] = that.pointAt( percent - 1 );
            p[1] = that.pointAt( percent + 1 );
            angle = Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180 / Math.PI;

            // advance to the next point on the path
            that.timer = setTimeout( calc, delay );
            // do one step ("frame")
            that.settings.step( that.pointAt(percent), angle );
        })();
    },

    stop : function(){
        clearTimeout( this.timer );
        this.timer = null;
        this.running = false;
    },

    stopAt : function(percent){

    },

    pointAt : function(percent){
        return this.path.getPointAtLength( this.len * percent/100 );
    },

    updatePath : function(path){
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('d', path);
        this.len = this.path.getTotalLength();
    }
};