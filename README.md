Path Animator
=============
Moves along an SVG path.

###[Demonstration page here](http://dropthebit.com/demos/pathAnimator/index.html)

## Basic use example:
```javascript
var path = "M150 0 L75 200 L225 200 Z";	// an SVG path
	pathAnimator = new PathAnimator( path ),	// initiate a new pathNimator object
	speed = 6,	 		// seconds that will take going through the whole path
	reverse = false,	// go back of forward along the path
	startOffset = 0		// between 0% to 100%
	
pathAnimator.start( speed, step, reverse, startOffset, finish);

function step( point, angle ){
	// do something every "frame" with: point.x, point.y & angle
}

function finish(){
	// do something when animation is done
}
```