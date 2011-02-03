function InsightPage()
{
}

/**
 * Creates the insights demo page and adds it to the parent element specified.
 * @param {jQuery.Element} topParent Element to which the content is attached.
 */
InsightPage.prototype.makePage = function(topParent, finishCallback)
{
  var insightPage = this;
  insightPage.topParent = topParent;

  insightPage.coverDiv = $('<div></div>').addClass('hints-cover-div');
  insightPage.topParent.append(insightPage.coverDiv);

  insightPage.container = $('<div></div>').css({
      'overflow': 'auto',
      'z-index': '5001'
    });
  topParent.append(insightPage.container);

  var insightButton = new gtv.jq.InsightButton();

  var windowHeight = $(window).height();
  var radius = (windowHeight / 2) - 100;
  var center = $(window).width() / 2;

  var insightData = [
    'This site is designed to provide demos for Google TV. Best practices, design ideas, and demos of Chrome\'s HTML 5 and CSS 3 capabilities.',
    'The pop-up insight buttons on this site point out parts of the design you might consider integrating into your site to improve a Google TV user\'s experience.'
                     ];


  for (var index = 0; index < 360 / 30; index++)
  {
    var degree = index * 30;

    var buttonContainer = insightButton.makeButton(center, 100, '?');
    if (index < insightData.length && insightData[index]) {
      buttonContainer.data('text', insightData[index]);
    }

    var buttonDiv = $(buttonContainer).children('.insight-button');
    buttonDiv.css({ '-webkit-animation-name': 'insight' + degree,
                    '-webkit-transform-origin': '0 ' + radius + 'px',
                    '-webkit-transform': 'rotate(' + degree + 'deg)'
                  });
    buttonContainer.bind('mouseenter.insight', function() {
        insightPage.handleMouseEnter($(this));
      });

    var style = $('<style type="text/css"></style>');

    var animation = '@-webkit-keyframes insight' + degree + ' {';
    animation += 'from { -webkit-transform: rotate(0deg); }';
    animation += 'to { -webkit-transform: rotate(' +
      degree + 'deg); -webkit-transform-origin: 0 ' + radius + 'px; }';

    animation += '}';

    style.append(animation);
    $('#wrapper').append(style);

    insightPage.container.append(buttonContainer);
  }

  var middlePadding = radius / 4;

  insightPage.middleButtonContainer =
    insightButton.makeButton(center - (radius / 2) - 40, radius - (radius / 2) + 80);
  var middleButton = $(insightPage.middleButtonContainer).children('.insight-button');

  var description = $('<p></p>').addClass('insight-middle-description');
  description.css({ 'width': radius,
                    'height': radius + 40,
                    'top': (radius / 4) + 'px'
                  });
  middleButton.append(description);

  insightPage.container.append(insightPage.middleButtonContainer);


  insightPage.handleMouseEnter(
    insightPage.container.children().first('.insight-button-div'));

  $(document).bind(
    'keydown.insight',
    function(e) {
      var newSelected;

      switch(e.keyCode) {
      case 8:  // backspace
      case 220:  // backslash
        e.preventDefault();
        makeHome();
        break;
      case 13:  // enter
        break;
      case 27:
        if (finishCallback) {
          insightPage.coverDiv.remove();
          insightPage.container.remove();
          $(document).unbind('.insight');
          finishCallback();
        }
        break;
      case 37:  // left
        newSelected = insightPage.selectedItem.prev('.insight-button-div');
        if (newSelected.length == 0) {
          newSelected = insightPage.container
            .children()
            .last('.insight-button-div');
        }
        break;
      case 39:  // right
        newSelected = insightPage.selectedItem.next('.insight-button-div');
        if (newSelected.length == 0) {
          newSelected = insightPage.container
            .children()
            .first('.insight-button-div');
        }
        break;
      }

      if (newSelected)
        newSelected.mouseenter();
    });
};

InsightPage.prototype.handleMouseEnter = function(newSelected)
{
  var insightPage = this;

  if (insightPage.selectedItem) {
    insightPage.selectedItem
      .children('.insight-button')
      .removeClass('insight-selected');
  }

  insightPage.selectedItem = newSelected;
  insightPage.selectedItem.children('.insight-button').addClass('insight-selected');

  var insightText = insightPage.selectedItem.data('text');
  if (insightText) {
    var description = insightPage.middleButtonContainer.find('.insight-button > p');
    if (description.length) {
      description.text(insightText);
    }
  }
};


function ColorsPage()
{
  this.initialAngle = 0;
}

ColorsPage.prototype.hsvToRGB = function(h, s, v)
{
  var r, g, b;
  var i;
  var f, p, q, t;

  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  s /= 100;
  v /= 100;

  if(s == 0) {
    // Saturation of zero means gray
    r = g = b = v;
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  h /= 60;
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  if (i == 0) {
      r = v;
      g = t;
      b = p;
  }
  else if (i == 1) {
    r = q;
    g = v;
    b = p;
  }
  else if (i == 2) {
    r = p;
    g = v;
    b = t;
  }
  else if (i == 3) {
    r = p;
    g = q;
    b = v;
  }
  else if (i == 4) {
    r = t;
    g = p;
    b = v;
  }
  else {
    r = v;
    g = p;
    b = q;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

ColorsPage.prototype.rgbToHSV = function(rgb)
{
  var red = rgb[0] / 255.0;
  var grn = rgb[1] / 255.0;
  var blu = rgb[2] / 255.0;

  var min = Math.min(red, grn, blu);
  var max = Math.max(red, grn, blu);

  var val = max;
  var sat = 0;
  var hue = 0;

  var delta = max - min;
  if (delta == 0)
  {
    return [0, 0, val];
  }

  if (max != 0) {
    sat = delta / max;
  }
  else {
    return [0, 0, 0];
  }

  if (red == max) {
    hue = (grn - blu) / delta;
  }
  else if (grn == max) {
    hue = 2 + (blu - red) / delta;
  }
  else {
    hue = 4 + (red - grn) / delta;
  }

  hue *= 60;
  if (hue < 0)
    hue += 360;

  return [hue, sat * 100, val * 100];
};

ColorsPage.prototype.drawColorWheel = function(canvas, colors, percent, radius)
{
  var timeout = 10;
  if (percent > 100) {
    return;
  }

  var angle = (Math.PI * 2) * (percent / 100.0);
  var ctx = canvas.get(0).getContext('2d');
  var numColors = colors.length;

  var sweepAngle = angle / numColors;
  var startAngle = this.initialAngle;
  for (var color = 0; color < numColors; color++)
  {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.fillStyle = this.rgbString(colors[color]);
    ctx.strokeStyle = this.rgbString(colors[color]);
    ctx.arc(radius, radius, radius,
            startAngle - (Math.PI / 360),
            startAngle + sweepAngle,
            false);
    startAngle += sweepAngle;
    ctx.closePath();
    ctx.fill();
  }

  var colorsPage = this;
  window.setTimeout(
    function() {
      colorsPage.drawColorWheel(canvas, colors, percent + 5, radius);
    }, timeout);
};

ColorsPage.prototype.makePage = function(topParent)
{
  var colorsPage = this;
  colorsPage.topParent = topParent;

  var canvas = $('<canvas width="600" height="600"></canvas>');
  colorsPage.topParent.append(canvas);

  var brightColors = new Array(360);
  for (var j = 0; j < brightColors.length; j++) {
    brightColors[j] = this.hsvToRGB(j, 100, 100);
  }

  window.setTimeout(
    function() {
      colorsPage.drawColorWheel(canvas, brightColors, 5, 300);
    }, 0);

  var canvasMuted = $('<canvas width="600" height="600"></canvas>');
  colorsPage.topParent.append(canvasMuted);

  var mutedColors = new Array(360);
  for (var j = 0; j < mutedColors.length; j++) {
    var hue = j;
    var boundary = hue % 60;
    if (boundary > 50)
      hue -= boundary - 50;
    else if (boundary < 10)
      hue += 10 - boundary;

    mutedColors[j] = this.hsvToRGB(hue, 85, 60);
  }

  window.setTimeout(
    function() {
      colorsPage.drawColorWheel(canvasMuted, mutedColors, 5, 300);
    }, 500);

  var brightDiv = $('<div id="bright"></div>').addClass('color-div');
  var mutedDiv = $('<div id="muted"></div>').addClass('color-div');

  for (var i = 0; i < 6; i++) {
    var block = $('<div></div>').addClass('color-block');
    brightDiv.append(block);
  }

  for (var i = 0; i < 6; i++) {
    var block = $('<div></div>').addClass('color-block');
    mutedDiv.append(block);
  }

  var color = $('<div id="color"></div>').css('overflow', 'auto');
  colorsPage.topParent.append(color);
  color.append(brightDiv);
  color.append(mutedDiv);

  window.setTimeout(
    function() {
      colorsPage.displaySamples(brightColors, mutedColors);
    } , 1000);
};

ColorsPage.prototype.rgbString = function(rgb)
{
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

ColorsPage.prototype.displaySamples = function(brightColors, mutedColors)
{
  var colorsPage = this;

  var color = $('#color');
  color.animate({opacity: 0}, function() {

      var brightBlocks = $('#bright').children();
      var mutedBlocks = $('#muted').children();

      var numColors = brightColors.length;
      var quadrant = 0;
      var colorIndices = new Array(6);
      for (var i = 0; i < 6; i++) {
        colorIndices[i] = Math.floor((Math.random() + i) * 60);
      }

      brightBlocks.each(
        function(index) {
          $(this).css('background-color',
                      colorsPage.rgbString(brightColors[colorIndices[index]]));
        });

      mutedBlocks.each(
        function(index) {
          $(this).css('background-color',
                      colorsPage.rgbString(mutedColors[colorIndices[index]]));
        });

      color.animate(
        {opacity: 1},
        function() {
          window.setTimeout(
            function() {
              colorsPage.displaySamples(brightColors, mutedColors);
            } , 2000);
        });
    });
};


function HintsPage()
{
}

HintsPage.prototype.makePage = function(topParent)
{
  var hintsPage = this;
  hintsPage.topParent = topParent;

  Main.showHints(topParent);
};


