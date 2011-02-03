function ParticleManager()
{
  this.particles = new Array();
  this.nextParticle = 0;

  //  window.setTimeout(this.manage, 20);
// v(t) = -g*t + v0
// y(t) = -0.5*g*t*t + v0 * t + y0

}

ParticleManager.prototype.addParticle = function(finishCallback)
{
  var particleManager = this;

  var newParticle = new Particle(finishCallback, particleManager.nextParticle);
  particleManager.particles[particleManager.nextParticle] = newParticle;
  particleManager.nextParticle++;

  return newParticle;
};
/*
ParticleManager.prototype.manage()
{
  var particleManager = this;

  var particleCount = particleManager.particles.length;
  for (int i = 0; i < particleCount; i++) {
    if (!particleManager.particles[i].finished()) {
      particleManager.particles[i].checkCollision();
    }
  }

  window.setTimeout(particleManager.manage, 20);
}
*/

function MakeBezierPath(numPoints, startX, endX, startY, topY, endY)
{
  var lengthY = Math.max(startY, endY, topY);

  var p0 = startY / lengthY;
  var p1 = topY / lengthY;
  var p2 = endY / lengthY;
  var lengthX = endX - startX;

  startY -= (p0 * lengthY);

  path = new Array(numPoints);
  for (var i = 0; i < 101; i++) {
    var px = i / numPoints;
    var py =
        (((1 - px) * (1 - px)) * p0) +
        (2 * (1 - px) * px * p1) +
        (px * px * p2);

    var left = (px * lengthX) + startX;
    var top = (py * lengthY) + startY;

    var point = i + '% { left: ' + left + 'px; top: ' + top + 'px; }';
    path[i] = point;
  }

  return path;
}

function Particle(finishCallback, id)
{
  this.finishCallback = finishCallback;
  this.id = id;
}

Particle.prototype.addAnimation = function(container,
                                           startX,
                                           endX,
                                           startY,
                                           height,
                                           endY)
{
  var particle = this;

  var style = $('<style type="text/css"></style>');

  var animation = '@-webkit-keyframes particle' + particle.id + ' {';
  animation += 'from { top: ' + startY + 'px; left: ' + startX + 'px; }';
  animation += 'to { top: ' + endY + 'px; left: ' + endX + 'px; }';

  var path = MakeBezierPath(101, startX, endX, startY, height, endY);
  for (var i = 0; i < 100; i++) {
    animation += path[i];
  }
  animation += '}';

  style.append(animation);
  container.append(style);

  return style;
};

Particle.prototype.startParticle = function(speed)
{
  var particle = this;

  particle.style = particle.addAnimation(particle.container,
                                         particle.startX,
                                         particle.endX,
                                         particle.startY,
                                         particle.topY,
                                         particle.endY);

  particle.element.addClass('particle-movement');

  particle.element.css({
      '-webkit-animation-duration': particle.speed + 's',
          '-webkit-animation-name': 'particle' + particle.id
          });
};

  Particle.prototype.initialize = function(container, element, initialValues)
{
  var particle = this;

  particle.container = container;

  particle.element = element;
  particle.element.addClass('particle particle-movement');

  particle.startX = initialValues['startX'];
  particle.endX = initialValues['endX'];
  particle.startY = initialValues['startY'];
  particle.topY = initialValues['topY'];
  particle.endY = initialValues['endY'];
  particle.speed = initialValues['speed'];

  particle.startParticle();

  particle.element.get(0).addEventListener(
      'webkitAnimationEnd',
      function(event) {
        particle.element.css({'left': particle.endX + 'px', 'top': particle.endY + 'px'});
        particle.element.removeClass('particle-movement');
        particle.element.css({
            '-webkit-animation-duration': '',
                '-webkit-animation-name': ''
                });
        particle.style.remove();

        if (particle.finishCallback && particle.finishCallback(particle))
          particle.startParticle();
      }, false);

  particle.container.append(particle.element);
};


function Cinder()
{
}

Cinder.prototype.initialize = function(container, particleManager, startX, startY)
{
  var cinder = this;

  cinder.container = container;
  cinder.element = $('<img src="static/images/spark.png"></img>');

  cinder.particle = particleManager.addParticle();

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var moveX = Math.random() * 400;
  var moveY = (Math.random() * 400) - 200;
  var speed = (Math.random() * 5) + 0.5;

  var initialValues = { 'startX': startX,
                        'endX': startX - moveX,
                        'startY': startY,
                        'topY': startY - moveY,
                        'endY': windowHeight,
                        'speed': speed };

  cinder.particle.initialize(cinder.container, cinder.element, initialValues);
};


function Ball()
{
}

Ball.prototype.initialize = function(container, particleManager, finishCallback)
{
  var ball = this;

  ball.finishCallback = finishCallback;
  ball.container = container;
  ball.element = $('<img src="static/images/yellowball.png"></img>');

  ball.particle = particleManager.addParticle(function(particle) {
      return ball.bounceBall(particle);
    });

  var windowWidth = $(window).width();
  var initialValues = { 'startX': 0,
                        'endX': windowWidth,
                        'startY': 0,
                        'topY': 0,
                        'endY': 100,
                        'speed': 3 };

  ball.particle.initialize(ball.container, ball.element, initialValues);
};

Ball.prototype.bounceBall = function(particle)
{
  var ball = this;

  var rebound = ball.finishCallback(particle);
  if (rebound >= 0) {
    var temp = particle.startX;
    particle.startX = particle.endX;
    particle.endX = temp;

    var powerY = ((100 - rebound) / 100.0) * 100;
    var aimY = ((Math.random() - .5) * rebound) * 4;

    particle.startY = particle.endY;
    particle.endY = Math.max(0, particle.endY + powerY + aimY);

    particle.topY = Math.max(0, particle.startY - 100);

    particle.speed = ((200 - rebound) / 100.0) * 1.5;

    return true;
  }

  return false;
};


function ParticlePage()
{
}

ParticlePage.prototype.makePage = function(topParent)
{
  var particlePage = this;

  particlePage.container = topParent;

  var windowHeight = $(window).height();

  var powerDiv = $('<div>Power: 0%</div>').addClass('paddle-power');

  particlePage.paddle = $('<div></div>').addClass('pong-paddle');
  particlePage.paddle.css({
        'top': (windowHeight / 2) + 'px',
        'left': '0px' });

  var topOffset = 0;
  particlePage.power = 0;
  particlePage.hitPower = 0;
  $(document).keydown(
      function(e) {
        switch(e.keyCode) {
          case 8:  // backspace
          case 220:  // backslash
            e.preventDefault();
            makeHome();
            break;
          case 38:  // up
            topOffset -= 75;
            if (topOffset < -(windowHeight / 2))
              topOffset = -(windowHeight / 2);
            break;
          case 40:  // down
            topOffset += 75;
            if (topOffset > windowHeight / 2)
              topOffset = windowHeight / 2;
            break;
          case 37:  // left
            particlePage.power -= 5;
            if (particlePage.power < 0)
              particlePage.power = 0;
            break;
          case 39:  // right
            particlePage.power += 5;
            if (particlePage.power > 100)
              particlePage.power = 100;
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

  particlePage.ball.initialize(topParent, particlePage.particleManager, function(particle) {
      return particlePage.checkPaddle(particle);
    });
};

ParticlePage.prototype.addExplosion = function(numCinders, startX, startY)
{
  var particlePage = this;

  for (var i = 0; i < numCinders; i++) {
    var cinder = new Cinder();
    cinder.initialize(particlePage.container,
                      particlePage.particleManager,
                      startX,
                      startY);
  }
};

ParticlePage.prototype.checkPaddle = function(particle)
{
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
      paddleOffset.top + paddleHeight > particleOffset.top)
  {
    particlePage.hitPower = particlePage.power;
    return particlePage.power;
  }

  var missed = $('<p></p>').addClass('particle-missed');
  missed.text('Game Over!');
  particlePage.container.append(missed);

  missed.css('left', ($(window).width() / 2) - (missed.width() / 2));
  var middleY = $(window).height() / 2 - (missed.height() / 2);

  missed.css({ '-webkit-transform': 'translate(0px, ' + middleY + 'px)',
               '-webkit-transition': 'all 2s ease-in-out' });
  return -1;
};


