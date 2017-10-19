Path Animator
=============
Moves a DOM element along an SVG path (or do whatever along a path...)

# [DEMO PAGE](http://yaireo.github.io/pathAnimator/)

## Basic use example:
```javascript

var path             = "M150 0 L75 200 L225 200 Z";    // an SVG path
    pathAnimator,
    startFromPercent = 10,  // start from 10% of the path
    stopAtPercent    = 70;  // stop at 70% of the path (which will then call the onDone function callback)


// initiate a new pathAnimator object
pathAnimator = new PathAnimator( path, {
    duration : 4, // seconds that will take going through the whole path
    step     : step,
    easing   : function(t){ return t*(2-t) },
    onDone   : finish(this)
});

pathAnimator.start( startFromPercent, stopAtPercent  );

function step( point, angle ){
    // do something every "frame" with: point.x, point.y & angle
}

function finish(){
    // do something when animation is done
}
```

## Settings

Name                | Type       | Default     | Info
------------------- | ---------- | ----------- | --------------------------------------------------------------------------
duration            | Number     | undefined   | (in seconds) the duration of going through the path
step                | Function   | undefined   | a callback function which is called on every frame
onDone              | Function   | undefined   | (optional) a callback function which will be called at the end
reverse             | Boolean    | false       | go back or forward along the path
startPercent        | Number     | 0           | Where to start on the path, between 0% to 100%
easing              | Function   | 1000/60     | (optional) mathematical function for easing
fps                 | Number     | undefined   | (optional) frames per second

