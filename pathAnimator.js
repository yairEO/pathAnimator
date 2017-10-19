// Path Animator v1.5.0
// (c) 2013 Yair Even Or (https://github.com/yairEO/pathAnimator)
// MIT-style license.

function PathAnimator( path, settings ){
    if( !path ) return;

    this.len = this.updatePath( path );
    this.timer = null;

    this.settings = {
        duration     : settings.duration,
        step         : settings.step,
        reverse      : !!settings.reverse,
        startPercent : settings.startPercent || 0,
        onDone       : settings.onDone || function(){},
        easing       : settings.easing,
        fps          : 1000/60, // frames-per-second
    }
}

PathAnimator.prototype = {
    start : function( startFromPercent, stopAtPercent ){
        this.stop();
        startFromPercent = startFromPercent || this.settings.startPercent || 0;
        this.percent = startFromPercent;
        if( this.settings.duration == 0 ) return false;

        var that = this,
            startTime = new Date(),
            stopAtPercent = stopAtPercent || 100;

        (function calc(){
            var p       = [], angle,
                now     = new Date(),
                elapsed = (now-startTime)/1000,
                t       = (elapsed/that.settings.duration),
                newPercent;

            // easing functions: https://gist.github.com/gre/1650294
            if( typeof that.settings.easing == 'function' ){
                t = that.settings.easing(t);
            }

            newPercent = startFromPercent + t * (stopAtPercent - startFromPercent);

            if( that.settings.reverse ){
                newPercent = startFromPercent - t * (stopAtPercent - startFromPercent)
                if( newPercent < 0 )
                    newPercent = stopAtPercent + newPercent;
            }

            that.running = true;
            that.percent = newPercent;

            // On animation end (from '0%' to '100%' or '100%' to '0%')
            if( t > 0.999 ){
                that.stop();
                that.percent = stopAtPercent;
                return that.settings.onDone();
            }

            //  angle calculations
            p[0] = that.pointAt( that.percent - 1 );
            p[1] = that.pointAt( that.percent + 1 );
            angle = Math.atan2(p[1].y-p[0].y,p[1].x-p[0].x)*180 / Math.PI;

            // advance to the next point on the path
            that.timer = setTimeout( calc, that.settings.fps );
            // do one step ("frame")
            that.settings.step( that.pointAt(that.percent), angle );
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

    updatePath : function( path ){
        if( !this.path && path ){
            this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            this.path.setAttribute('d', path);
        }
        return this.path.getTotalLength();
    }
};