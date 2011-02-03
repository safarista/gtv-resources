function FontsPage()
{
}

FontsPage.prototype.makePage = function(topParent)
{
  var fontsPage = this;
  fontsPage.topParent = topParent;

  var cssFontFace;

  var items = new Array();

  cssFontFace = $('<p>Reenie Beanie</p>').addClass('font-item font-page-reenie');
  items.push(cssFontFace);

  cssFontFace = $('<p>Molengo</p>').addClass('font-item font-page-molengo');
  items.push(cssFontFace);

  cssFontFace = $('<p>Philosopher</p>').addClass('font-item font-page-philosopher');
  items.push(cssFontFace);

  cssFontFace = $('<p>Lobster</p>').addClass('font-item font-page-lobster');
  items.push(cssFontFace);

  cssFontFace = $('<p>Neucha</p>').addClass('font-item font-page-neucha');
  items.push(cssFontFace);

  cssFontFace = $('<p>Bonzai</p>').addClass('font-item font-page-font-face');
  items.push(cssFontFace);

  fontsPage.items = items;

  fontsPage.demoDivContainer = $('<div></div>').addClass('font-demo-div-container');
  fontsPage.demoDiv = $('<div></div>').addClass('font-demo-div');

  var rotatorControl = new RotatorControl();
  rotatorControl.makeControl(
    topParent,
    'rotator-container',
    items,
    null,
    main.keyController,
    function(item) {
      fontsPage.itemSelected(item);
    });

  topParent.append(fontsPage.demoDivContainer);
  fontsPage.demoDivContainer.append(fontsPage.demoDiv);

  var windowHeight = $(window).height();
  var containerOffset = fontsPage.demoDivContainer.offset();
  var borderWidth = fontsPage.demoDivContainer.outerWidth() -
      fontsPage.demoDivContainer.width();
  fontsPage.demoDivContainer.css('height',
                                 windowHeight - containerOffset.top -
                                     borderWidth + 'px');


  main.setKeyHandlerForPage(
    topParent,
    'fontspage',
    function() {
      return topParent.find('.font-item').first();
    });
};

FontsPage.prototype.itemSelected = function(item)
{
  var fontsPage = this;

  fontsPage.demoDiv.empty();

  var fontFamily = item.css('font-family');

  var fontSizes = [80, 64, 56, 48, 36, 24, 20, 18, 16, 14, 12, 10, 8];
  var demoText = 'The quick brown fox jumped over the lazy dog';

  for (var i = 0; i < fontSizes.length; i++) {
    var demoItem;
    var fontSize = fontSizes[i];

    demoItem = $('<p></p>')
      .addClass('font-demo-item')
      .css({ 'font-size': fontSize + 'pt',
             'font-family': fontFamily })
      .text(fontSize + 'pt: ' + demoText);

    fontsPage.demoDiv.append(demoItem);
  }

};


function InsightPage()
{
}

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

  var insightButton = new InsightButton();

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


function OverscanPage()
{
}

OverscanPage.prototype.makePage = function(topParent)
{
  var overscanPage = this;

  overscanPage.topParent = topParent;

  var container = $('<div></div>').addClass('overscan-container');
  overscanPage.topParent.append(container);
  overscanPage.measTextSpaceFactor = 1.2;

  var screenWidth = screen.width;
  var screenHeight = screen.height;
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var screenSize = $('<p></p>').addClass('overscan-size');
  var windowSize = $('<p></p>').addClass('overscan-size');

//  container.append(screenSize);
  container.append(windowSize);

  screenSize.text('Screen dimensions: ' + screenWidth + 'x' + screenHeight);
  screenSize.css({ 'left': (windowWidth / 2) - (screenSize.width() / 2),
                   'top': (windowHeight / 2) - (screenSize.height()) });
  windowSize.text('Window dimensions: ' + windowWidth + 'x' + windowHeight);

  function makeRow(classType, rightExtent)
  {
    var row = $('<div></div').addClass('overscan-row overscan-' + classType + '-row');
    for (var i = 0; i < 3; i++) {
      var div = $('<div></div>').addClass('overscan-' + classType + '-div');
      row.append(div);
    }
    container.append(row);
    var rowOffset = $(row).offset();
    row.css({ left: '0px'});

    var rowWidth = $(row).width();
    var arrowWidth = (rowWidth / 2) / overscanPage.measTextSpaceFactor;

    var arrow = new ArrowControl();
    var arrowDiv = arrow.makeControl(row, 'overscan-arrow-line');
    arrowDiv.addClass('arrow-left');
    arrowDiv.css( { top: '50%', left: arrowWidth + 'px'});

    arrow = new ArrowControl();
    arrowDiv = arrow.makeControl(row, 'overscan-arrow-line');
    arrowDiv.addClass('arrow-right');
    arrowDiv.css( { top: '50%', left: rowWidth - arrowWidth + 'px'});

    var measurement = $('<p></p>').addClass('overscan-arrow-text');
    row.append(measurement);
  }


  makeRow('abs', 1920);
  makeRow('pct', windowWidth);

  main.showHints(
    topParent,
    function() {
      var navSelectors = {
        item: '.overscan-row'
      };
      overscanPage.behaviorZone = new KeyBehaviorZone('.overscan-container',
                                                      null,
                                                      null,
                                                      navSelectors);

      main.keyController.addBehaviorZone(overscanPage.behaviorZone, true);

      main.setKeyHandlerForPage(
        topParent,
        'overscanpage',
        function() {
          return null;
        });
      window.setTimeout(function() { overscanPage.animatePage(container); }, 500);
    });
};


OverscanPage.prototype.animatePage = function(container)
{
  var overscanPage = this;

  var rows = $(container).find('.overscan-row');

  function updateSize(updateRow)
  {
    var leftArrow = updateRow.children('.arrow-left');
    var rightArrow = updateRow.children('.arrow-right');

    var size =
      Math.floor((leftArrow.width() + rightArrow.width()) *
                 overscanPage.measTextSpaceFactor);

    var measurement = updateRow.children('.overscan-arrow-text');
    measurement.text(size);

    var rowWidth = $(updateRow).width();
    var measWidth = $(measurement).width();
    var rowHeight = $(updateRow).height();
    var measHeight = $(measurement).height();
    measurement.css({left: rowWidth / 2 - measWidth / 2,
                     top: rowHeight / 2 - measHeight / 2});

    if (size < rowWidth)
      window.setTimeout(function() { updateSize(updateRow); }, 10);
  }

  for (var i = 0; i < rows.length; i++) {
    var row = $(rows).eq(i);
    var arrowDiv;

    var rowWidth = $(row).width();
    var arrowWidth = Math.ceil((rowWidth / 2) / overscanPage.measTextSpaceFactor);

    arrowDiv = $(row).children('.arrow-left');
    arrowDiv.css({ '-webkit-transition': 'all 3s ease-in-out',
                   'left': '0px',
                   'width': arrowWidth + 'px' });

    arrowDiv = $(row).children('.arrow-right');
    arrowDiv.css({ '-webkit-transition': 'all 3s ease-in-out',
                   'width': arrowWidth + 'px' });

    window.setTimeout((function(updateRow) { updateSize(updateRow); })(row), 10);
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

  main.showHints(topParent);
};


function SlidingPage()
{
}

SlidingPage.prototype.makePage = function(topParent)
{
  var slidingPage = this;
  slidingPage.topParent = topParent;

  var container = $('<div></div>').addClass('sliding-container');
  slidingPage.topParent.append(container);

  slidingPage.container = container;

  var styleClasses = {
    page: 'slider-item-page-style',
    row: 'slider-item-row-style',
    itemDiv: 'slider-item-div-style',
    item: 'slider-item-style'
  };

  var photoCount = 15;


  var pageItems = [];
  for (var i = 0; i < photoCount; i++) {
    var img = $('<img></img>')
        .attr('src', 'static/images/Photo' + i + '.jpg')
        .addClass('slider-photo');

    var description = $('<p></p>').append('Photo ' + i)
      .addClass('slider-text-title');
    var descDiv = $('<div></div>').addClass('slider-text-desc');

    descDiv.append(description);

    pageItems.push({ content: img, description: descDiv});
  }

  slidingPage.slidingControl = new SlidingControl();
  slidingPage.slidingControl.makeControl(slidingPage.container,
                                         'slider-container',
                                         styleClasses,
                                         pageItems,
                                         main.keyController,
                                         function(item) {
                                           slidingPage.transitionPage(item);
                                         });

  main.setKeyHandlerForPage(
    topParent,
    'slidingpage',
    function() {
      return container.find('.slider-item-style').first();
    });
};

SlidingPage.prototype.transitionPage = function(selectedItem)
{
  var itemObject = $(selectedItem).data('nav-data');
  if (!itemObject)
    return;

  location.href = itemObject;
};


function RollingPage()
{
}

RollingPage.prototype.makePage = function(topParent)
{
  var rollingPage = this;
  rollingPage.topParent = topParent;


  main.showHints(
    topParent,
    function() {
      rollingPage.makeNavMenu();
    });

  main.setKeyHandlerForPage(
    topParent,
    'rollingpage',
    function() {
      return topParent.find('.scroll-item-style').first();
    });
};

RollingPage.prototype.makeNavMenu = function()
{
  var rollingPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  rollingPage.topParent.append(topNavHolder);

  var navItems = [];
  for (var i = 3; i < 19; i++)
    navItems.push(i.toString());

  var styles = {
    item: 'rollnav-item-style',
    itemDiv: 'rollnav-item-div-style',
    row: 'rollnav-row-style',
    chosen: 'rollnav-item-chosen',
    normal: 'rollnav-item-normal',
    selected: 'rollnav-item-hover'
  };

  var behaviors = {
    orientation: 'horizontal',
    selectOnInit: true
  };

  var topNavControl = new SideNavControl();
  topNavControl.makeControl(
    topNavHolder,
    'rollNav',
    styles,
    navItems,
    behaviors,
    main.keyController,
    function(selectedItem) {
      choiceCallback(selectedItem);
    });

  function choiceCallback(selectedItem)
  {
    var numRows = parseInt(selectedItem.text());

    if (rollingPage.roller)
      rollingPage.roller.deleteControl();

    rollingPage.makeRoller(numRows);
  }

  var topNavContainer = topNavHolder.children('#rollNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};

RollingPage.prototype.makeRoller = function(numRows)
{
  var rollingPage = this;

  var photosPerRow = Math.floor(18 / numRows);
  if (photosPerRow > 1) {
    photosPerRow = Math.round(18 / numRows);
    if (photosPerRow * numRows > 18)
      photosPerRow--;
  }

  var itemsArray = new Array(numRows);
  var photoIndex = 0;
  for (var j = 0; j < numRows; j++) {
    itemsArray[j] = new Array(photosPerRow);
    for (var i = 0; i < photosPerRow; i++) {
      itemsArray[j][i] =
          $('<img></img>')
            .attr('src', 'static/images/Photo' + photoIndex + '.jpg')
            .css({ height: '30%',
                   display: 'block'});
      photoIndex++;

      if (photoIndex > 17)
        break;
    }
  }

  var styles = {
    row: 'scroll-row-style',
    itemsDiv: 'scroll-items-div-style',
    itemDiv: 'scroll-div-style',
    item: 'scroll-item-style',
    hover: 'item-hover'
  };

  rollingPage.roller = new RollerControl();
  var rollerContainer =
      rollingPage.roller.makeControl(rollingPage.topParent,
                                     'roller-container',
                                     styles,
                                     itemsArray);
  rollingPage.roller.enableNavigation(main.keyController);
};

function ScrollingPage()
{
}

ScrollingPage.prototype.makePage = function(topParent)
{
  var scrollingPage = this;
  scrollingPage.topParent = topParent;

  scrollingPage.container = $('<div></div>').addClass('scrolling-page');
  scrollingPage.topParent.append(scrollingPage.container);

  var numPhotos = 18;
  var itemArray = new Array(numPhotos);
  for (var i = 0; i < numPhotos; i++) {
    itemArray[i] =
          $('<img></img>')
            .attr('src', 'static/images/Photo' + i + '.jpg')
            .addClass('loadable')
            .css({ height: '200px',
                   display: 'block'});
  }

  var styles = {
    row: 'scroll-row-style',
    itemsDiv: 'scroll-items-div-style',
    itemDiv: 'scroll-div-style',
    item: 'scroll-item-style',
    hover: 'item-hover'
  };

  scrollingPage.rowControl = new RowControl();
  scrollingPage.rowControl.makeControl(scrollingPage.container,
                                       'row-container',
                                       styles,
                                       itemArray);

  main.showHints(
    topParent,
    function() {
      scrollingPage.rowControl.enableNavigation(main.keyController);
    });

  main.setKeyHandlerForPage(
    topParent,
    'scrollingpage',
    function() {
      return topParent.find('.scroll-item-style').first();
    });
};



function FeedPage()
{
}

FeedPage.prototype.makePage = function(topParent)
{
  var feedPage = this;
  feedPage.topParent = topParent;

  var buildData = {
    feed: 'http://gdata.youtube.com/feeds/api/standardfeeds/top_rated?alt=json-in-script',
    feedItemsSeeker: 'feed,entry',
    feedThumbSeeker: 'media$group,media$thumbnail,0,url',
    feedContentSeeker: 'media$group,media$content,0,url',
    playerWidth: 900,
    thumbnailSize: 150,
    navbarType: 'popUp'
  };

  var page = new BuilderVideoPage();

  page.makePage(topParent, buildData, main.keyController);
};


function StackPage()
{
}

StackPage.prototype.makePage = function(topParent)
{
  var stackPage = this;
  stackPage.topParent = topParent;

  var container = $('<div></div>');
  stackPage.topParent.append(container);
  stackPage.container = container;
  stackPage.insightsItem = 11;

  var itemCount = 15;
  var itemArray = new Array(itemCount);

  for (var i = 0; i < itemCount; i++) {
    var img = $('<img></img>')
      .attr('src', 'static/images/Photo' + i + '.jpg')
      .addClass('stack-photo');
    itemArray[i] = {
      'title': 'Photo ' + i,
      'dataItem': img
    };
  }

  var stackControl = new StackControl();
  stackControl.makeControl(
    container,
    main.keyController,
    itemArray,
    $(window).height(),
    'stack-photo-title');

  main.setKeyHandlerForPage(
    topParent,
    'stackpage',
    function() {
      return stackPage.container
        .find('.stack-photo-title')
        .eq(stackPage.insightsItem);
    });
};


function NavigationPage()
{
}

NavigationPage.prototype.makePage = function(topParent)
{
  var navigationPage = this;

  navigationPage.topParent = topParent;

  // Top nav bar adds side nav in its choice callback. Side nav bar adds
  // slider control in its choice callback.
  navigationPage.addTopNav();

  main.setKeyHandlerForPage(
    topParent,
    'navpage',
    function() {
      return navigationPage.slider.find('.slider-item-style').first();
    });
};

NavigationPage.prototype.addSideNav = function()
{
  var navigationPage = this;

  var sideNavHolder = $('<div></div>').addClass('sidenav-holder');
  navigationPage.topParent.append(sideNavHolder);

  var navItems = ['All', 'US', 'Europe', 'Asia', 'Africa'];

  var styles = {
    item: 'sidenav-item-style',
    itemDiv: 'sidenav-item-div-style',
    row: 'sidenav-row-style',
    chosen: 'sidenav-item-chosen',
    normal: 'sidenav-item-normal',
    selected: 'sidenav-item-hover'
  };

  var behaviors = {
    popOut: 'left',
    orientation: 'vertical',
    selectOnInit: true
  };

  navigationPage.sideNavControl = new SideNavControl();
  navigationPage.sideNavControl.makeControl(
    sideNavHolder,
    'sideNav',
    styles,
    navItems,
    behaviors,
    main.keyController,
    function(selectedItem) {
      choiceCallback(selectedItem);
    });

  function choiceCallback(selectedItem)
  {
    var tag = selectedItem.text().toLowerCase();
    navigationPage.makeSlider(tag);
  }

  navigationPage.sideNavControl.selectControl();
};

NavigationPage.prototype.addTopNav = function()
{
  var navigationPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  navigationPage.topParent.append(topNavHolder);

  var navItems = ['Left Nav', 'Right Nav'];

  var styles = {
    item: 'topnav-item-style',
    itemDiv: 'topnav-item-div-style',
    row: 'topnav-row-style',
    chosen: 'topnav-item-chosen',
    normal: 'topnav-item-normal',
    selected: 'topnav-item-hover'
  };

  var behaviors = {
    popOut: 'top',
    orientation: 'horizontal',
    selectOnInit: true
  };

  var topNavControl = new SideNavControl();
  topNavControl.makeControl(
    topNavHolder,
    'topNav',
    styles,
    navItems,
    behaviors,
    main.keyController,
    function(selectedItem) {
      choiceCallback(selectedItem);
    });

  function choiceCallback(selectedItem)
  {
    var popOut = selectedItem.text().toLowerCase().split(' ');
    var sideBehaviors = {
      popOut: popOut[0],
      orientation: 'vertical'
    };

    if (!navigationPage.sideNavControl) {
      navigationPage.addSideNav(sideBehaviors);
    }
    else {
      navigationPage.sideNavControl.setBehaviors(sideBehaviors);
    }
  }

  var topNavContainer = topNavHolder.children('#topNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};

NavigationPage.prototype.makeSlider = function(tag)
{
  var navigationPage = this;

  if (!navigationPage.slider){
    var slider = $('<div></div>').addClass('slider-holder');
    navigationPage.topParent.append(slider);

    navigationPage.slider = slider;
  }
  else {
    if (navigationPage.slidingControl)
      navigationPage.slidingControl.deleteControl();
  }

  var styleClasses = {
    page: 'slider-item-page-style',
    row: 'slider-item-row-style',
    itemDiv: 'slider-item-div-style',
    item: 'slider-item-style'
  };

  var photos = [
    { file: 'Photo0.jpg', tag: 'europe', desc: 'Salzburg'},
    { file: 'Photo1.jpg', tag: 'europe', desc: 'Budapest'},
    { file: 'Photo2.jpg', tag: 'europe', desc: 'Czech Republic'},
    { file: 'Photo3.jpg', tag: 'europe', desc: 'Prague' },
    { file: 'Photo4.jpg', tag: 'africa', desc: 'Marrakesh' },
    { file: 'Photo5.jpg', tag: 'us' , desc: 'Napa'},
    { file: 'Photo6.jpg', tag: 'asia', desc: 'Kovalum'},
    { file: 'Photo7.jpg', tag: 'europe', desc: 'Paris'},
    { file: 'Photo8.jpg', tag: 'africa', desc: 'Marrakesh' },
    { file: 'Photo9.jpg', tag: 'africa', desc: 'Marrakesh' },
    { file: 'Photo10.jpg', tag: 'africa', desc: 'Atlas Mountains'},
    { file: 'Photo11.jpg', tag: 'us', desc: 'Pt. Loma' },
    { file: 'Photo12.jpg', tag: 'us', desc: 'Philadelpha' },
    { file: 'Photo13.jpg', tag: 'us', desc: 'Maine' },
    { file: 'Photo14.jpg', tag: 'europe', desc: 'Spain' },
    { file: 'Photo15.jpg', tag: 'asia', desc: 'Singapore' },
    { file: 'Photo16.jpg', tag: 'us', desc: 'Santa Ynez' },
    { file: 'Photo17.jpg', tag: 'asia', desc: 'Agra' }
  ];

  var photoCount = photos.length;

  var pageItems = [];
  for (var i = 0; i < photoCount; i++) {
    if (photos[i].tag != tag && tag != 'all')
      continue;

    var img = $('<img></img>')
        .attr('src', 'static/images/' + photos[i].file)
        .addClass('slider-photo');

    var description = $('<p></p>').append(photos[i].desc)
      .addClass('slider-text-title');
    var descDiv = $('<div></div>').addClass('slider-text-desc');

    descDiv.append(description);

    pageItems.push({ content: img, description: descDiv});
  }

  navigationPage.slidingControl = new SlidingControl();
  navigationPage.slidingControl.makeControl(navigationPage.slider,
                                            'sliding-control',
                                            styleClasses,
                                            pageItems,
                                            main.keyController);
};


function ScrollNavPage()
{

}

ScrollNavPage.prototype.makePage = function(topParent)
{
  var scrollNavPage = this;

  scrollNavPage.topParent = topParent;

  scrollNavPage.addSideNav();

  scrollNavPage.makeScrollNav();

  main.setKeyHandlerForPage(topParent);
};

ScrollNavPage.prototype.addSideNav = function()
{
  var scrollNavPage = this;

  var sideNavHolder = $('<div></div>').addClass('sidenav-holder');
  scrollNavPage.topParent.append(sideNavHolder);

  var navItems = ['Rotate', 'Flip'];

  var styles = {
    item: 'scrollnav-sidenav-item-style',
    itemDiv: 'scrollnav-sidenav-item-div-style',
    row: 'scrollnav-sidenav-row-style',
    normal: 'scrollnav-sidenav-item-normal',
    selected: 'scrollnav-sidenav-item-hover'
  };

  scrollNavPage.sideNavControl = new SideNavControl();
  scrollNavPage.sideNavControl.makeControl(
    sideNavHolder,
    'sideNav',
    styles,
    navItems,
    null,
    main.keyController,
    function(selectedItem) {
      choiceCallback(selectedItem);
    });

  function choiceCallback(selectedItem)
  {
    if (!scrollNavPage.showDiv)
      return;

    var show = scrollNavPage.showDiv.find('#show');

    var transform = show.css('-webkit-transform');
    var rotate = transform.indexOf('rotate(');
    var rotateX = transform.indexOf('rotateX(');

    var rotateAngle = 0;
    if (rotate >= 0) {
      var angleStr = transform.substring(rotate + 7);
      rotateAngle = parseInt(angleStr);
    }

    var rotateXAngle = 0;
    if (rotateX >= 0) {
      var angleStr = transform.substring(rotateX + 8);
      rotateXAngle = parseInt(angleStr);
    }

    if (selectedItem.text() == 'Rotate') {
      rotateAngle += 90;
    }
    else if (selectedItem.text() == 'Flip') {
      rotateXAngle += 180;
    }

    transform =
      'rotate(' + rotateAngle + 'deg) rotateX(' + rotateXAngle + 'deg)';

    show.css({ '-webkit-transition': 'all 1s ease-in-out',
                '-webkit-transform': transform });

    var showOffset = scrollNavPage.showDiv.offset();

    rotateAngle %= 360;

    var shadowDirX = [1, 1, -1, -1];
    var shadowDirY = [1, -1, -1, 1];
    var shadowX = 25 * shadowDirX[(rotateAngle % 360) / 90];
    var shadowY = 25 * shadowDirY[(rotateAngle % 360) / 90];

    if (rotateAngle % 180 == 0)
      show.css('top', '0px');
    else
      show.css('top', showOffset.top + 'px');

    show.css('-webkit-box-shadow',
              shadowX + 'px ' + shadowY +
              'px 10px 5px #222');
  }
};

ScrollNavPage.prototype.makeScrollNav = function()
{
  var scrollNavPage = this;

  var scrollnavHolder = $('<div></div>').addClass('scrollnav-holder');
  scrollNavPage.topParent.append(scrollnavHolder);
  var firstShowSrc;
  var navItems =
    function(parent) {
      if (scrollNavPage.rowControl)
        return false;

      var scrollRowContainer = $('<div></div>').addClass('scrollnav-row-holder');

      var windowWidth = $(window).width();
      scrollRowContainer.width(windowWidth);
      parent.append(scrollRowContainer);

      var videos = [
        {
          thumb: 'static/images/Video0.jpg',
          sources: [
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/Chrome_ImF.mp4',
              type: 'video/mp4',
              codecs: "avc1.42E01E, mp4a.40.2"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/Chrome_ImF.ogv',
              type: 'video/ogg',
              codecs: "theora, vorbis"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/Chrome_ImF.webm',
              type: 'video/webm',
              codecs: "vp8, vorbis"
            }
          ]
        },
        {
          thumb: 'static/images/Video1.jpg',
          sources: [
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/chromeicon.mp4',
              type: 'video/mp4',
              codecs: "avc1.42E01E, mp4a.40.2"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/chromeicon.ogv',
              type: 'video/ogg',
              codecs: "theora, vorbis"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/chromeicon.webm',
              type: 'video/webm',
              codecs: "vp8, vorbis"
            }
          ]

        }
      ];

      var numShows = videos.length + 18;
      var itemArray = new Array(numShows);
      var showSrc;
      for (var i = 0; i < videos.length; i++) {
        showSrc = videos[i].sources;
        itemArray[i] =
          $('<img></img>')
          .attr('src', videos[i].thumb)
          .css({ height: '150px',
                 display: 'block'})
          .data('src', videos[i].sources);

        if (!firstShowSrc)
          firstShowSrc = showSrc;
      }


      //var numShows = 18;
      //var itemArray = new Array(numShows);
      //var showSrc;
      for (var j = 0; j < 18; j++) {
        showSrc = 'static/images/Photo' + j + '.jpg';
        itemArray[i + j] =
          $('<img></img>')
          .attr('src', showSrc)
          .css({ height: '150px',
                 display: 'block'});

        if (!firstShowSrc)
          firstShowSrc = showSrc;
      }

      function enterCallback(item)
      {
        var image = item.children().first();
        var sources;
        sources = image.data('src');
        if (!sources) {
          var src = image.attr('src');
          scrollNavPage.showPhoto(src);
        }
        else {
          scrollNavPage.showVideo(sources);
        }
      }

      var styles = {
        row: 'scrollnav-nav-row-style',
        itemsDiv: 'scrollnav-nav-items-div-style',
        itemDiv: 'scrollnav-nav-div-style',
        item: 'scrollnav-nav-item-style',
        selected: 'scrollnav-nav-item-hover'
      };

      scrollNavPage.rowControl = new RowControl();
      var scrollRow = scrollNavPage.rowControl.makeControl(
        scrollRowContainer,
        'row-container',
        styles,
        itemArray);
      scrollNavPage.rowControl.enableNavigation(main.keyController,
                                                enterCallback);

      scrollRowContainer.height(scrollRow.height());

      return true;
    };

  var styles = {
    item: 'scrollnav-item-style',
    itemDiv: 'scrollnav-item-div-style',
    row: 'scrollnav-row-style',
    chosen: 'scrollnav-item-chosen',
    normal: 'scrollnav-item-normal',
    selected: 'scrollnav-item-hover'
  };

  var behaviors = {
    fade: true,
    orientation: 'horizontal',
    selectOnInit: true
  };

  var scrollnavControl = new SideNavControl();
  scrollnavControl.makeControl(
    scrollnavHolder,
    'scrollnav',
    styles,
    navItems,
    behaviors,
    main.keyController);

  var windowHeight = $(window).height();
  scrollnavHolder.css('top', ((windowHeight * 3) / 4) + 'px');

  scrollNavPage.showVideo(firstShowSrc);
};

ScrollNavPage.prototype.showPhoto = function(imgSrc)
{
  var scrollNavPage = this;

  if (scrollNavPage.showDiv) {
    scrollNavPage.showDiv.remove();
  }

  scrollNavPage.showDiv = $('<div></div>').addClass('scrollnav-show-div');
  scrollNavPage.topParent.append(scrollNavPage.showDiv);

  var spaceWidth = scrollNavPage.showDiv.width();
  var offset = scrollNavPage.showDiv.offset();

  var photo = $('<img></img>');
  photo.attr('src', imgSrc);
  photo.css({ '-webkit-transform': 'rotate(0deg)' })
    .attr('id', 'show')
    .addClass('scrollnav-show-item');

  scrollNavPage.showDiv.append(photo);
};

ScrollNavPage.prototype.showVideo = function(sources)
{
  var scrollNavPage = this;

  if (scrollNavPage.showDiv) {
    scrollNavPage.showDiv.remove();
  }

  scrollNavPage.showDiv = $('<div></div>').addClass('scrollnav-show-div');
  scrollNavPage.topParent.append(scrollNavPage.showDiv);

  var spaceWidth = scrollNavPage.showDiv.width();
  var offset = scrollNavPage.showDiv.offset();

  var video = document.createElement('video');
  for (var i = 0; i < sources.length; i++) {
    var source = document.createElement('source');
    $(source).attr(sources[i]);
    $(video).append(source);
  }

  $(video).attr('id', 'show')
    .attr('controls', 'controls')
    .addClass('scrollnav-show-item');

  video.play();

  scrollNavPage.showDiv.append(video);
};


function BuilderPage()
{
}

BuilderPage.prototype.makePage = function(topParent)
{
  var builderPage = this;

  var buildData = {};

  builderPage.container = $('<div></div>');
  topParent.append(builderPage.container);

  builderPage.topParent = topParent;

  builderPage.makeMainPage();

  main.setKeyHandlerForPage(topParent);
};

BuilderPage.prototype.makeMainPage = function()
{
  var builderPage = this;

  var coverDiv = $('<div></div>').addClass('builder-cover-div');
  builderPage.container.append(coverDiv);

  var builderDiv = $('<div></div>').addClass('builder-div');
  builderPage.container.append(builderDiv);

  var feedDiv = $('<div></div>').addClass('builder-feed-div');
  builderDiv.append(feedDiv);

  var feedElem = $('<input type="text" size="80"></input>')
    .addClass('builder-feed')
    .attr('id', 'feed')
    //.val('http://gdata.youtube.com/feeds/api/standardfeeds/top_rated?alt=json-in-script');
    .val('http://picasaweb.google.com/data/feed/base/featured?alt=json-in-script&kind=photo&access=public&slabel=featured&hl=en_US');
  feedDiv.append(feedElem);

  var seekerData = [ { id: 'items', name: 'Feed', val: 'feed,entry'} ,
                     { id: 'thumbs', name: 'Thumbnail', val: 'media$group,media$thumbnail,0,url'} ,
                     { id: 'content', name: 'Content', val: 'media$group,media$content,0,url'} ];

  var seekerDiv = $('<div></div>').addClass('seeker-div');
  builderDiv.append(seekerDiv);

  function makeRow()
  {
    var itemRow, itemDiv;

    itemRow = $('<div></div>').addClass('builder-row');
    seekerDiv.append(itemRow);

    itemDiv = $('<div></div>').addClass('builder-item-div');
    itemRow.append(itemDiv);

    return itemDiv;
  }

  for (var i = 0; i < seekerData.length; i++) {
    var itemDiv = makeRow();

    var itemLab = $('<p></p>')
        .addClass('builder-item-label')
        .text(seekerData[i].name);
    itemDiv.append(itemLab);

    var itemElem = $('<input name="seeker" type="text"></input>')
        .addClass('builder-item')
        .val(seekerData[i].val)
        .attr('id', seekerData[i].id);
    itemDiv.append(itemElem);
  }

  var itemDiv = makeRow();
  var widthLab = $('<p></p>').text('Player Width');
  itemDiv.append(widthLab);

  var widthElem = $('<input type="text" size="4"></input>')
    .addClass('builder-item')
    .attr('id', 'width')
    .val('900');
  itemDiv.append(widthElem);


  itemDiv = makeRow();
  var heightLab = $('<p></p>').text('Player Height');
  itemDiv.append(heightLab);

  var heightElem = $('<input type="text" size="4"></input>')
    .addClass('builder-item')
    .attr('id', 'height')
    .val('560');
  itemDiv.append(heightElem);


  itemDiv = makeRow();
  var selectNavbar = $('<select name="navbar"></select>')
    .addClass('builder-item')
    .attr('id', 'navbar');
  itemDiv.append(selectNavbar);

  option = $('<option value="popUp"></option>')
    .text('Pop-up Navbar');
  selectNavbar.append(option);

  option = $('<option value="fade"></option>')
    .text('Fading Navbar');
  selectNavbar.append(option);


  itemDiv = makeRow();
  var thumbLab = $('<p></p>').text('Thumbnail size');
  itemDiv.append(thumbLab);
  thumbLab.css('margin-left', '10%');

  var thumbSize = $('<input type="text" size="4"></input>')
    .addClass('builder-item')
    .attr('id', 'thumbSize')
    .val('100');
  itemDiv.append(thumbSize);

/*  option = $('<option value="html"></option>')
    .text('HTML5 Video');
  select.append(option);*/

  var itemRow = $('<div></div>').addClass('builder-row');
  seekerDiv.append(itemRow);

  itemDiv = $('<div></div>').addClass('builder-item-div')
    .css('float', 'left');
  itemRow.append(itemDiv);
  var select = $('<select name="kind"></select>')
    .addClass('builder-item')
    .attr('id', 'kind');
  itemDiv.append(select);

  var option = $('<option value="photo"></option>')
    .text('Photo Feed');
  select.append(option);

  option = $('<option value="youtube"></option>')
    .text('YouTube Feed');
  select.append(option);


  itemDiv = makeRow();
  var slideshowLab = $('<p></p>').text('Slideshow delay');
  itemDiv.append(slideshowLab);
  slideshowLab.css('margin-left', '10%');

  var slideshow = $('<input type="text" size="2"></input>')
    .addClass('builder-item')
    .attr('id', 'slideshow')
    .val('4');
  itemDiv.append(slideshow);
  var slideshowRow = itemDiv.parent();

  select.bind('change',
              function(e) {
                if (select.val() == 'photo')
                  slideshowRow.css('display', '');
                else
                  slideshowRow.css('display', 'none');
              });


  itemRow = $('<div></div>').addClass('builder-row');
  seekerDiv.append(itemRow);

  itemDiv = $('<div></div>').addClass('builder-item-div')
    .css('width', 'auto')
    .css('float', 'left');
  itemRow.append(itemDiv);
  var makeElem = $('<button href="javascript:void(0);"></button>')
    .addClass('builder-make builder-item')
    .text('Build the Page')
    .click(function(e) { builderPage.clickMakeAction(); });
  itemDiv.append(makeElem);


  itemDiv = $('<div></div>').addClass('builder-item-div')
    .css('width', 'auto')
    .css('float', 'left');
  itemRow.append(itemDiv);
  var showElem = $('<button href="javascript:void(0);"></button>')
    .addClass('builder-make builder-item')
    .text('Show the Code')
    .click(function(e) { builderPage.clickShowCodeAction(); });
  itemDiv.append(showElem);

  var feedDisplayElem = $('<div></div>').addClass('builder-feed-display');
  builderDiv.append(feedDisplayElem);

  var keyMapping = {
    13: function(selectedItem, newSelected) {
      selectedItem.focus();
      return { status: 'skip' };
    }
  };
  var selectionClasses = {
    basic: 'builder-item-hover'
  };

  var navSelectors = {
    item: '.builder-feed'
  };
  builderPage.feedBehaviorZone = new KeyBehaviorZone('.builder-feed-div',
                                                 keyMapping,
                                                 null,
                                                 navSelectors,
                                                 selectionClasses);

  main.keyController.addBehaviorZone(builderPage.feedBehaviorZone, true);

  navSelectors = {
    item: '.builder-item',
    itemParent: '.builder-item-div',
    itemRow: '.builder-row'
  };
  builderPage.seekerBehaviorZone = new KeyBehaviorZone('.seeker-div',
                                                 keyMapping,
                                                 null,
                                                 navSelectors,
                                                 selectionClasses);

  main.keyController.addBehaviorZone(builderPage.seekerBehaviorZone, true);

  var lastFeed;
  builderDiv.find('[name=seeker]').bind(
      'keydown focus change',
      function(e) {
        var newFeed = feedElem.val();
        var seeker = $(this);
        if (newFeed != lastFeed) {
          var feedDisplayElem = $('.builder-feed-display');
          feedDisplayElem.empty();

          var itemElemP = $('<p></p>').text('Loading feed....');
          feedDisplayElem.append(itemElemP);

          $.ajax({ url: newFeed,
                   dataType: 'jsonp',
                   success: function(data) {
                     setTimeout(function() {
                                  builderPage.showFeedData(seeker);
                                }, 100);
                     builderPage.feedData = data;
                     lastFeed = newFeed;
                   }
                 });
          setTimeout(function() {
                       itemElemP.text('Failed to load feed.');
                     }, 8000);
        }
        else {
          setTimeout(function() { builderPage.showFeedData(seeker); }, 100);
        }
        var row = seekerDiv.find('.builder-row-active');
        row.removeClass('builder-row-active');

        row = seeker.parents('.builder-row');
        row.addClass('builder-row-active');
      });
};

BuilderPage.prototype.showFeedData = function(seekerElem)
{
  var builderPage = this;

  if (!builderPage.feedData)
    return;

  if (!seekerElem)
    return;

  if (builderPage.displayBehaviorZone)
    main.keyController.removeBehaviorZone(builderPage.displayBehaviorZone, true);
  var feedDisplayElem = $('.builder-feed-display');
  feedDisplayElem.empty();

  var itemsElem = $('#items');
  var seeker = itemsElem.val().split(',');

  var dataSeeker;
  if (seekerElem.attr('id') != 'items') {
    dataSeeker = seekerElem.val().split(',');
  }

  function descend(data, seeker)
  {
    for (var i = 0; i < seeker.length; i++) {
      if (seeker[i] !== '') {
        data = data[seeker[i]];
        if (!data)
          return null;
      }
    }
    return data;
  }

  var data = builderPage.feedData;
  var entries;
  if (seeker) {
    data = descend(data, seeker);
    entries = data;
    if (data && dataSeeker != undefined) {
      if (data instanceof Array)
        dataSeeker.unshift(0);

      data = descend(data, dataSeeker);
    }
  }

  if (dataSeeker != undefined && !(entries instanceof Array)) {
    var itemElemP = $('<p></p>').text('Specify feed entries first');
    feedDisplayElem.append(itemElemP);
  }
  else if (dataSeeker == undefined && entries instanceof Array) {
    builderPage.addFeedDisplayItem('<- back', seekerElem);

    var itemElemP = $('<p></p>').text('Feed entries found');
    feedDisplayElem.append(itemElemP);
  }
  else if (typeof data != 'string') {
    builderPage.addFeedDisplayItem('<- back', seekerElem);
    $.each(data, function(key, value) {
             builderPage.addFeedDisplayItem(key, seekerElem);
           });
  }
  else if (data) {
    builderPage.addFeedDisplayItem('<- back', seekerElem);

    var itemElemP = $('<p></p>').text(data);
    feedDisplayElem.append(itemElemP);
  }

  var keyMapping = {
    13: function(selectedItem, newSelected) {
      selectedItem.click();
      return { status: 'skip' };
      }
  };
  var navSelectors = {
    item: '.builder-feed-item',
    itemParent: '.builder-feed-item-div',
    itemRow: '.builder-feed-row'
  };
  var selectionClasses = {
    basic: 'builder-item-hover'
  };
  builderPage.displayBehaviorZone = new KeyBehaviorZone('.builder-feed-display',
                                                        keyMapping,
                                                        null,
                                                        navSelectors,
                                                        selectionClasses);

  main.keyController.addBehaviorZone(builderPage.displayBehaviorZone, true);
};

BuilderPage.prototype.addFeedDisplayItem = function(text, seekerElem)
{
  var builderPage = this;

  var feedDisplayElem = $('.builder-feed-display');

  var itemElemRow = $('<div></div>').addClass('builder-feed-row');
  feedDisplayElem.append(itemElemRow);

  var itemElemP = $('<p></p>').addClass('builder-feed-item-div');
  itemElemRow.append(itemElemP);

  var itemElem = $('<a href="javascript:void(0);"></a>')
      .addClass('builder-feed-item')
          .click(function(e) {
                   builderPage.clickItemAction($(this), seekerElem);
                 });
  itemElem.text(text);
  itemElemP.append(itemElem);
};

BuilderPage.prototype.clickItemAction = function(item, seekerElem)
{
  var itemVal = item.text();
  var currentVal = seekerElem.val();
  if (itemVal != '<- back') {
    if (currentVal)
      itemVal = currentVal + ',' + itemVal;
  }
  else {
    var lastComma = currentVal.lastIndexOf(',');
    if (lastComma >= 0)
      itemVal = currentVal.substring(0, lastComma);
    else
      itemVal = '';
  }
  seekerElem.val(itemVal);
  seekerElem.trigger('change');
};

BuilderPage.prototype.clickMakeAction = function()
{
  var builderPage = this;

  if (builderPage.demoPage)
    builderPage.demoPage.deletePage();

  var buildData = {};
  buildData.feed = $('#feed').val();
  buildData.feedItemsSeeker = $('#items').val().split(',');
  buildData.feedThumbSeeker = $('#thumbs').val().split(',');
  buildData.feedContentSeeker = $('#content').val().split(',');

  buildData.playerWidth = parseInt($('#width').val());
  buildData.playerHeight = parseInt($('#height').val());

  buildData.slideshowSpeed = parseInt($('#slideshow').val());

  buildData.thumbnailSize = parseInt($('#thumbSize').val());

  buildData.navbarType = $('#navbar').val();

  var kind = $('#kind').val();
  if (kind == 'youtube' || kind == 'html5') {
    builderPage.demoPage = new BuilderVideoPage();
  }
  else {
    builderPage.demoPage = new BuilderPhotoPage();
  }

  builderPage.demoPage.makePage(builderPage.topParent,
                                buildData,
                                main.keyController,
                                'demo');

  builderPage.container.css('display', 'none');

  builderPage.addTopNav();
};

BuilderPage.prototype.clickShowCodeAction = function()
{
  var builderPage = this;

  var codeArea = $('<textarea readonly="readonly" rows="20" cols="80"></textarea>');

  var buildData = {};
  buildData.feed = $('#feed').val();
  buildData.feedItemsSeeker = $('#items').val().split(',');
  buildData.feedThumbSeeker = $('#thumbs').val().split(',');
  buildData.feedContentSeeker = $('#content').val().split(',');

  buildData.playerWidth = parseInt($('#width').val());
  buildData.playerHeight = parseInt($('#height').val());

  buildData.slideshowSpeed = parseInt($('#slideshow').val());

  buildData.thumbnailSize = parseInt($('#thumbSize').val());

  buildData.navbarType = $('#navbar').val();

  var code =
      'var buildData = {\n'
    + '  feed: \'' + buildData.feed + '\',\n'
    + '  feedItemsSeeker: \'' + buildData.feedItemsSeeker + '\',\n'
    + '  feedThumbSeeker: \'' + buildData.feedThumbSeeker + '\',\n'
    + '  feedContentSeeker: \'' + buildData.feedContentSeeker + '\',\n'
    + '  playerWidth: \'' + buildData.playerWidth + '\',\n'
    + '  playerHeight: \'' + buildData.playerHeight + '\',\n'
    + '  thumbnailSize: \'' + buildData.thumbnailSize + '\',\n'
    + '  navbarType: \'' + buildData.navbarType + '\'';

  var kind = $('#kind').val();
  if (kind == 'youtube' || kind == 'html5') {
    code += '\n};\n\n';
    code += 'var page = new BuilderVideoPage();\n\n';
  }
  else {
    code += ',\n'
          + '  slideshowSpeed: \'' + buildData.slideshowSpeed + '\'\n'
          + '};\n\n';
    code += 'var page = new BuilderPhotoPage();\n\n';
  }
  code += 'page.makePage(parent, buildData);\n';

  codeArea.val(code);

  var coverDiv = $('<div></div>').addClass('builder-code-cover-div');
  builderPage.container.append(coverDiv);

  var builderDiv = $('<div></div>').addClass('builder-code-div');
  builderPage.container.append(builderDiv);

  builderDiv.append(codeArea);

  codeArea.keydown(
                function(e) {
                  switch (e.keyCode) {
                    case 8:
                    case 13:
                    case 27:
                      coverDiv.remove();
                      builderDiv.remove();
                    e.stopPropagation();
                  }
                });
  codeArea.focus();
};

BuilderPage.prototype.addTopNav = function()
{
  var builderPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  builderPage.topParent.append(topNavHolder);

  var navItems = ['Make a new page'];

  var styles = {
    item: 'topnav-item-style',
    itemDiv: 'topnav-item-div-style',
    row: 'topnav-row-style',
    chosen: 'topnav-item-chosen',
    normal: 'topnav-item-normal',
    selected: 'topnav-item-hover'
  };

  var behaviors = {
    popOut: 'top',
    orientation: 'horizontal',
    selectOnInit: true
  };

  var topNavControl = new SideNavControl();
  topNavControl.makeControl(
    topNavHolder,
    'topNav',
    styles,
    navItems,
    behaviors,
    main.keyController,
    function(selectedItem) {
      choiceCallback(selectedItem);
    },
    'demo');

  function choiceCallback(selectedItem)
  {
    if (!builderPage.topNavActive) {
      builderPage.topNavActive = true;
      return;
    }

    builderPage.demoPage.deletePage();
    topNavControl.deleteControl();
    builderPage.container.css('display', 'block');
    builderPage.topNavActive = false;

    main.keyController.setLayer();
  }

  var topNavContainer = topNavHolder.children('#topNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};



function Main()
{
}

Main.prototype.transitionPage = function(item)
{
  var main = this;

  var itemObject = $(item).data('url');
  if (!itemObject)
    return;

  main.keyController.removeAllZones();

  var newItem = item.clone(false);
  var offset = item.offset();
  newItem.removeClass('item-hover-active item-hover item');
  newItem.addClass('item-heading');
  newItem.css({'position': 'absolute',
               'top': offset.top + 'px',
               'left': offset.left + 'px'});

  $('#wrapper').append(newItem);

  var itemRows = $('.item-row').each(
      function(index) {
        $(this).animate({ opacity: 0 },
                        function() {
                          $(this).remove();
                        });
      });

  var newOffset = $("#wrapper").offset();
  newItem.animate(
    { 'top': newOffset.top + 'px',
      'left': newOffset.left + 'px',
      'font-size': '48pt'},
    function() {
      newItem.css({'background-color': 'transparent',
                   'position': 'relative',
                   'top': '0px',
                   'left': '0px'});

      var itemPage = itemObject;
      itemPage.makePage($('#wrapper'));
    });
};

Main.prototype.setKeyHandlerForPage = function(topParent,
                                               category,
                                               getItemSelection,
                                               preDestroyCallback)
{
  var main = this;

  var inInsights = false;
  var globalKeyMapping = {
    8: function(selectedItem, newSelected) {  // backspace always goes home
      if (preDestroyCallback)
        preDestroyCallback();
      main.keyController.setLayerKeyMapping();
      main.makeHome(false);
      return { status: 'skip' };
    },
    27: function(selectedItem, newSelected, getFinishCallback) {
      if (category) {
        var firstItemFirstPage = getItemSelection();

        main.keyController.setSelected(
            firstItemFirstPage,
            function() {
              main.showInsights(
                  topParent,
                  category,
                  function() {
                  });
            });
      }
      return { status: 'skip' };
    }
  };
  main.keyController.setLayerKeyMapping(globalKeyMapping);
};

Main.prototype.showInsights = function(topParent, category, finishCallback)
{
  var main = this;

  var styles = {
    button: 'insight-button-style',
    description: 'insight-description-style',
    selected: 'insight-selected',
    cover: 'insight-cover-style'
  };

  $.getJSON(
    '/bestpractices/ajax/' + category,
    function(data) {
      var insightControl = new InsightControl();
      insightControl.makeControl(topParent,
                                 data,
                                 styles,
                                 400, 350,
                                 finishCallback,
                                 main.keyController);
    });
};

Main.prototype.showHints = function(topParent, finishCallback)
{
  var hintsControl = new HintsControl();

  var hintsItems = [
    { img: 'static/images/arrows.png',
      text: 'Arrow keys move the selection around the page' },
    { img: 'static/images/backspace.png',
      text: 'Backspace returns to the previous page' },
    { img: 'static/images/enter.png',
      text: 'Enter browses to the current selection' },
    { img: 'static/images/esc.png',
      text: 'Esc displays help buttons for design features' }
  ];

  var hintsStyles = {
    cover: 'hints-cover-style',
    hints: 'hints-style',
    title: 'hints-title-style',
    img: 'hints-img-style',
    text: 'hints-text-style'
  };

  hintsControl.makeControl(
    topParent,
    hintsItems,
    hintsStyles,
    finishCallback,
    function() {
      main.makeHome(false);
    });
};

Main.prototype.makeHome = function(showHints)
{
  var main = this;

  $('#wrapper').children().remove();

  var container = $('<div></div>').addClass('home-container');
  $('#wrapper').append(container);

  var itemData = [
      ['Row Control', new ScrollingPage()],
      ['Roller Control', new RollingPage()],
      ['Stack Control', new StackPage()],
      ['Slider Control', new SlidingPage()],
      ['Overscan', new OverscanPage() ],
      ['Fonts', new FontsPage() ],
      ['Page Builder', new BuilderPage()],
      ['SideNav Control', new NavigationPage() ],
      ['Playback Navigation', new ScrollNavPage() ],
      ['Video Feeds', new FeedPage() ],
      ['Tutorial', new TutorialPage() ],
      ['Pong', new ParticlePage() ]
  ];

  var length = itemData.length;
  var rowCount = 0;
  var itemRow;
  for (var i = 0; i < length; i++) {
    if (i % 4 == 0) {
      itemRow = $('<div></div>').addClass('item-row');
      container.append(itemRow);
    }

    var item = $('<p></p>')
      .addClass('item')
      .append(itemData[i][0])
      .data("url", itemData[i][1]);

    var itemDiv = $('<div></div>')
      .addClass('item-div')
      .append(item);

    itemRow.append(itemDiv);
  }

  function keyControlCallback()
  {
    if (!main.keyController)
      main.keyController = new KeyController();
    else
      main.keyController.removeAllZones();

    var keyMapping = {
      13: function(selectedItem, newSelected) {
        main.transitionPage(selectedItem);
        return { status: 'skip' };
      },
      27: function(selectedItem, newSelected) {
        main.homeShowInsights();
        return { status: 'skip' };
      }
    };
    var navSelectors = {
      item: '.item'
    };
    var selectionClasses = {
      basic: 'item-hover',
      hasData: 'item-hover-active'
    };
    var actions = {
      click: function(selectedItem, newItem) {
        main.transitionPage(selectedItem);
      }
    };
    main.homeBehaviorZone = new KeyBehaviorZone('.home-container',
                                                keyMapping,
                                                actions,
                                                navSelectors,
                                                selectionClasses,
                                                'url',
                                                false,
                                                true);

    main.keyController.addBehaviorZone(main.homeBehaviorZone, true);
    main.keyController.start(main.homeBehaviorZone, true);
  }

  if (showHints) {
    main.showHints(container, keyControlCallback);
  }
  else {
    keyControlCallback();
  }
};

Main.prototype.homeShowInsights = function()
{
  var insightPage = new InsightPage();
  insightPage.makePage($('#wrapper'));
};

var main;

$(document).ready(
  function() {
    main = new Main();
    main.makeHome(true);
  });

