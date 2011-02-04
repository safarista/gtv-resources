// Copyright 2010 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Implements the Pong sub page for the demo site.
 * 
 */


/**
 * ParticleManager class.
 * @constructor
 */
function ParticleManager() {
  this.particles = new Array();
  this.nextParticle = 0;
}

/**
 * Creates a new particle and adds it to the particle manager.
 * @param {Function} finishCallback Callback to make when particle has finished
 *     a movement.
 * @return {Particle} The created particle.
 */
ParticleManager.prototype.addParticle = function(finishCallback) {
  var particleManager = this;

  var newParticle = new Particle(finishCallback, particleManager.nextParticle);
  particleManager.particles[particleManager.nextParticle] = newParticle;
  particleManager.nextParticle++;

  return newParticle;
};


/**
 * BezierParams class describes several points of a bezier curve.
 */
function BezierParams() {
}

/**
 * The X coordinate the path should start at.
 * @type {number} 
 */
BezierParams.prototype.startX = null;

/**
 * The X coordinate the path should end at.
 * @type {number} 
 */
BezierParams.prototype.endX = null;

/**
 * The Y coordinate the path should start at.
 * @type {number}
 */
BezierParams.prototype.startY = null;

/**
 * The Y coordinate of the maximum point the curve should aim for.
 *     Since this is a bezier curve, it will never actually reach this point.
 * @type {number} 
 */
BezierParams.prototype.topY = null;

/**
 * The Y coordinate the path should end at.
 * @type {number}
 */
BezierParams.prototype.endY = null;


/**
 * Creates an array of path points in html5 keyframe format along a bezier
 * path and returns it. This is a horizontally-oriented curve since it's
 * meant to simulate the path of a particle subject to gravity.
 * @param {number} numPoints The number of points in the path. The path will
 *     cover keyframes from 0% to 100% in this number of points.
 * @param {BezierParams} bezier The bezier path the animation should follow.
 * @return {Array.<string>} An array of strings in keyframe format,
 *     e.g.: 15% {left: 5px; top: 10px;}
 */
function MakeBezierPath(numPoints, bezier) {
  var lengthY = Math.max(bezier.startY, bezier.endY, bezier.topY);

  var p0 = bezier.startY / lengthY;
  var p1 = bezier.topY / lengthY;
  var p2 = bezier.endY / lengthY;
  var lengthX = bezier.endX - bezier.startX;

  bezier.startY -= (p0 * lengthY);

  var path = new Array(numPoints);
  for (var i = 0; i < 101; i++) {
    var px = i / numPoints;
    var py =
        (((1 - px) * (1 - px)) * p0) +
        (2 * (1 - px) * px * p1) +
        (px * px * p2);

    var left = (px * lengthX) + bezier.startX;
    var top = (py * lengthY) + bezier.startY;

    var point = i + '% { left: ' + left + 'px; top: ' + top + 'px; }';
    path[i] = point;
  }

  return path;
}


/**
 * Particle class.
 * @param {Function} finishCallback The function to call when the particle
 *     has reached the end of its movement. If this function returns true,
 *     the particle will resume movement (presumably with a new path).
 * @param {number} id The ID of the particle in the manager.
 * @constructor
 */
function Particle(finishCallback, id) {
  this.finishCallback = finishCallback;
  this.id = id;
}

/**
 * Container element for the particle.
 * @type {jQuery.Element}
 * @private
 */
Particle.prototype.container = null;

/**
 * Element associated with the particle.
 * @type {jQuery.Element}
 * @private
 */
Particle.prototype.element = null;

/**
 * The bezier path of the particle.
 * @type {BezierParams}
 * @private
 */
Particle.prototype.bezier = null;

/**
 * Speed of the particle, in seconds to complete the animation.
 * @type {boolean}
 * @private
 */
Particle.prototype.speed = null;

/**
 * Creates a keyframe animation in the form of a bezier path to a particle and
 * adds the style to the page. The animation style must be added to the element
 * in order for the animation to start.
 * @param {BezierParams} bezier The bezier path the animation should follow.
 * @return {jQuery.Element} The style element created and added to the page.
 */
Particle.prototype.addAnimation = function(container, bezier) {
  var particle = this;

  var style = $('<style type="text/css"></style>');

  var animation_items = [
      '@-webkit-keyframes particle' + particle.id + ' {',
      'from { top: ' + bezier.startY + 'px; left: ' + bezier.startX + 'px; }',
      'to { top: ' + bezier.endY + 'px; left: ' + bezier.endX + 'px; }'
  ];
  
  var path = MakeBezierPath(101, bezier);
  animation_items.concat(path);

  animation_items.push('}');

  var animation_str = animation_items.join(' ');
  style.append(animation_str);
  container.append(style);

  return style;
};

/**
 * Create an animation for a particle and starts it in motion at the
 * specified speed.
 * @param {number} speed The speed, in seconds, the animation should take to
 *     complete.
 */
Particle.prototype.startParticle = function(speed) {
  var particle = this;

  particle.style = particle.addAnimation(particle.container,
                                         particle.bezier);
  particle.element.addClass('particle-movement');

  particle.element.css({
      '-webkit-animation-duration': particle.speed + 's',
      '-webkit-animation-name': 'particle' + particle.id
    });
};

/**
 * Initialize a particle, setting its initial values and associating it with
 * an element on the page. This attaches the particle's element to its
 * specified container.
 * @param {jQuery.Element} container The container where the particle is held.
 * @param {jQuery.Element} element The element that the particle is motivating.
 * @param {BezierParams} initialValues The initial bezier path for the particle.
 * @param {number} speed Speed of the particle, in seconds to complete path.
 */
Particle.prototype.initialize = function(container, 
                                         element,
                                         initialValues,
                                         speed) {
  var particle = this;

  particle.container = container;

  particle.element = element;
  particle.element.addClass('particle particle-movement');

  particle.bezier = initialValues;
  particle.speed = speed;

  particle.startParticle();

  particle.element.get(0).addEventListener(
      'webkitAnimationEnd',
      function(event) {
        particle.element.css({
            'left': particle.bezier.endX + 'px',
            'top': particle.bezier.endY + 'px'
          });
        particle.element.removeClass('particle-movement');
        particle.element.css({
            '-webkit-animation-duration': '',
            '-webkit-animation-name': ''
          });
        particle.style.remove();

        if (particle.finishCallback && particle.finishCallback(particle)) {
          particle.startParticle();
        }
      },
      false);

  particle.container.append(particle.element);
};


/**
 * Cinder class, represents a particle remnant from the ball hitting the right
 * side of the window.
 * @constructor
 */
function Cinder() {
}

/**
 * Holds the jQuery element representing the spark image.
 * @type {jQuery.Element}
 * @private
 */
Cinder.prototype.element = null;

/**
 * Holds the particle associated with the Cinder
 * @type {Particle}
 * @private
 */
Cinder.prototype.particle = null;

/**
 * Initializes a Cinder instance at a point on the page, giving it a random
 * moment.
 * @param {jQuery.Element} container The container element for the cinder.
 * @param {ParticleManager} particleManager Instance of a particle manager.
 * @param {number} startX The starting X coordinate for the cinder.
 * @param {number} startY The starting Y coordinate for the cinder.
 */
Cinder.prototype.initialize = function(container,
                                       particleManager,
                                       startX,
                                       startY) {
  var cinder = this;

  cinder.container = container;
  cinder.element = $('<img src="static/images/spark.png"></img>');

  cinder.particle = particleManager.addParticle();

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var moveX = Math.random() * 400;
  var moveY = (Math.random() * 400) - 200;
  var speed = (Math.random() * 5) + 0.5;

  var bezier = new BezierParams();
  bezier.startX = startX;
  bezier.endX = startX - moveX;
  bezier.startY = startY;
  bezier.topY = startY - moveY;
  bezier.endY = windowHeight;

  cinder.particle.initialize(cinder.container, cinder.element, bezier, speed);
};


/**
 * Ball class represents the game ball that bounces in the window.
 * @constructor
 */
function Ball() {
}

/**
 * Callback to make when the ball hits the left or right edge of the page.
 * @type {Function}
 * @private
 */
Ball.prototype.finishCallback = null;

/**
 * Container element of the ball.
 * @type {jQuery.Element}
 * @private
 */
Ball.prototype.container = null;

/**
 * Element representing the ball image on the page.
 * @type {jQuery.Element}
 * @private
 */
Ball.prototype.element = null;

/**
 * Particle associated with the ball.
 * @type {Particle}
 * @private
 */
Ball.prototype.particle = null;

/**
 * Initializes a Ball instance.
 * @param {jQuery.Element} container The container for the ball.
 * @param {ParticleManager} particleManager Instance of a particle manager.
 * @param {Function} finishCallback Callback function to call at the end of
 *     one movement of the ball (i.e., at the left or right edge of the page).
 *     If this function returns a value >= 0, the ball will rebound using
 *     that value as a speed factor.
 */
Ball.prototype.initialize = function(container,
                                     particleManager,
                                     finishCallback) {

  var ball = this;

  ball.finishCallback = finishCallback;
  ball.container = container;
  ball.element = $('<img src="static/images/yellowball.png"></img>');

  ball.particle = particleManager.addParticle(function(particle) {
      return ball.bounceBall(particle);
    });

  var windowWidth = $(window).width();
  var bezier = new BezierParams();
  bezier.startX = 0;
  bezier.endX = windowWidth;
  bezier.startY = 0;
  bezier.topY = 0;
  bezier.endY = 100;

  ball.particle.initialize(ball.container, ball.element, bezier, 3);
};

/**
 * End-of-animation callback for a ball. Calls the ball's callback, and if
 * it tells the ball to rebound, calculates a new path for the ball going
 * the other direction based on the ball's speed and direction of movement.
 * @param {Particle} particle Ball's particle passed in by the ParticleManager.
 * @return {boolean} returns true if the animation should continue.
 */
Ball.prototype.bounceBall = function(particle) {
  var ball = this;

  var rebound = ball.finishCallback(particle);
  if (rebound >= 0) {
    var temp = particle.bezier.startX;
    particle.bezier.startX = particle.bezier.endX;
    particle.bezier.endX = temp;

    var powerY = ((100 - rebound) / 100.0) * 100;
    var aimY = ((Math.random() - .5) * rebound) * 4;

    particle.bezier.startY = particle.bezier.endY;
    particle.bezier.endY = Math.max(0, particle.bezier.endY + powerY + aimY);

    particle.bezier.topY = Math.max(0, particle.bezier.startY - 100);

    particle.speed = ((200 - rebound) / 100.0) * 1.5;

    return true;
  }

  return false;
};


/**
 * ParticlePage class. This class manages the Pong game.
 * @constructor
 */
function ParticlePage() {
}

/**
 * Creates the Pong page and keyboard handler for the game. Attaches the
 * page content to the supplied parent element.
 * @param {jQuery.Element} topParent The parent element for the pong content.
 */
ParticlePage.prototype.makePage = function(topParent) {
  var particlePage = this;

  particlePage.container = topParent;

  var windowHeight = $(window).height();

  var powerDiv = $('<div>Power: 0%</div>').addClass('paddle-power');

  particlePage.paddle = $('<div></div>').addClass('pong-paddle');
  particlePage.paddle.css({
      'top': (windowHeight / 2) + 'px',
      'left': '0px'
    });

  var topOffset = 0;
  particlePage.power = 0;
  particlePage.hitPower = 0;
  $(document).keydown(function(e) {
    switch(e.keyCode) {
      case 8:  // backspace
      case 220:  // backslash
        e.preventDefault();
        makeHome();
        break;
      case 38:  // up
        topOffset -= 75;
        if (topOffset < -(windowHeight / 2)) {
          topOffset = -(windowHeight / 2);
        }
        break;
      case 40:  // down
        topOffset += 75;
        if (topOffset > windowHeight / 2) {
          topOffset = windowHeight / 2;
        }
        break;
      case 37:  // left
        particlePage.power -= 5;
        if (particlePage.power < 0) {
          particlePage.power = 0;
        }
        break;
      case 39:  // right
        particlePage.power += 5;
        if (particlePage.power > 100) {
          particlePage.power = 100;
        }
        break;
    }

    particlePage.paddle.css({
        '-webkit-transition': 'all 0.25s linear',
        '-webkit-transform': 'translate(0px, ' + topOffset + 'px)'
      });

    powerDiv.text('Power: ' + particlePage.power + '%');

  });
  topParent.append(powerDiv);
  topParent.append(particlePage.paddle);

  particlePage.particleManager = new ParticleManager();

  particlePage.ball = new Ball();

  particlePage.ball.initialize(topParent,
                               particlePage.particleManager,
                               function(particle) {
      return particlePage.checkPaddle(particle);
    });
};

/**
 * Adds a number of cinders starting at a specied coordinate on the page.
 * @param {number} numCinders The number of cinders to create.
 * @param {number} startX The starting X position of all the cinders.
 * @param {number} startY The starting Y position of all the cinders.
 */
ParticlePage.prototype.addExplosion = function(numCinders, startX, startY) {
  var particlePage = this;

  for (var i = 0; i < numCinders; i++) {
    var cinder = new Cinder();
    cinder.initialize(particlePage.container,
                      particlePage.particleManager,
                      startX,
                      startY);
  }
};

/**
 * Called by the ball at the end of an animation (that is, edge of the page).
 * Checks to see if the ball is at the paddle end, and if so, if it is within
 * the extents of the paddle. If so, tells the ball to rebound, otherwise
 * ends the game.
 * @param {Particle} The ball particle.
 * @return {number} A speed factor based on the hit power or wall rebound,
 *     or -1 if the ball missed the paddle.
 */
ParticlePage.prototype.checkPaddle = function(particle) {
  var particlePage = this;

  var particleOffset = particle.element.offset();
  var particleWidth = particle.element.outerWidth();
  var particleHeight = particle.element.outerHeight();

  if (particleOffset.left > 0) {
    var numCinders = (particlePage.hitPower / 10) + 3;

    window.setTimeout(function() {
        particlePage.addExplosion(numCinders,
                                  particleOffset.left,
                                  particleOffset.top);
      }, 1);

    return particlePage.hitPower * .75;
  }

  var paddleOffset = particlePage.paddle.offset();
  var paddleWidth = particlePage.paddle.outerWidth();
  var paddleHeight = particlePage.paddle.outerHeight();

  if (paddleOffset.top < particleOffset.top + particleHeight &&
      paddleOffset.top + paddleHeight > particleOffset.top) {
    particlePage.hitPower = particlePage.power;
    return particlePage.power;
  }

  var missed = $('<p></p>').addClass('particle-missed');
  missed.text('Game Over!');
  particlePage.container.append(missed);

  missed.css('left', ($(window).width() / 2) - (missed.width() / 2));
  var middleY = $(window).height() / 2 - (missed.height() / 2);

  missed.css({
      '-webkit-transform': 'translate(0px, ' + middleY + 'px)',
      '-webkit-transition': 'all 2s ease-in-out'
    });
  return -1;
};
