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
 * @fileoverview Classes for Template Page
 *
 * 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * TemplatePage class holds all the support for the page to work
 * and interact with javascript controls.
 * @constructor
 */
gtv.jq.TemplatePage = function() {
};

/**
 * Creates the top menu buttons.
 */
gtv.jq.TemplatePage.prototype.makeTopMenu = function() {
  var templatePage = this;

  function choiceCallback(selectedItem) {
    var index = selectedItem.data('index');

    if (index == 0) {
      templatePage.gotoMenu();
    } else if (index == 1) {
      templatePage.detailsBack();
    }
  }

  var keyMapping = {
    13: function(selectedItem, newSelected) { // enter
      choiceCallback(selectedItem);
      return {status: 'skip'};
    },
    37: function(selectedItem, newItem) {  // left
      if (selectedItem.data('index') == 0) {
        return { status: 'selected', selected: selectedItem };
      }
      return { status: 'none' };
    }
  };
  var actions = {
    click: function(selectedItem, newItem) {
      choiceCallback(selectedItem);
    }
  };
  var navSelectors = {
    item: '.menu-item',
    itemParent: '.menu-item-parent',
    itemRow: '.menu-item-parent'
  };
  var selectionClasses = {
    basic: 'menu-item-selected'
  };

  var zoneParms = {
    containerSelector: '#mainNav',
    keyMapping: keyMapping,
    actions: actions,
    navSelectors: navSelectors,
    selectionClasses: selectionClasses
  };

  templatePage.topMenuZone = new gtv.jq.KeyBehaviorZone(zoneParms);
  templatePage.keyController.addBehaviorZone(
      templatePage.topMenuZone,
      true,
      ['default', gtv.jq.VideoControl.fullScreenLayer]);
};

/**
 * Creates the thumbs buttons.
 */
gtv.jq.TemplatePage.prototype.makeThumbsNav = function() {
  var templatePage = this;

  var styles = {
    row: 'thumbs-nav-row',
    itemDiv: '',
    item: 'thumbs-nav-item',
    selected: 'bt-thumbs-highlighted',
    chosen: 'bt-thumbs-normal', // this buttons never stays selected
    normal: 'bt-thumbs-normal'
  };

  var navItems = [
    '<a class="navThumbUpButton" href="#"><div>Thumbs Up</div></a>',
    '<a class="navThumbDownButton" href="#"><div>Thumbs Down</div></a>'
  ];
  var behaviors = {
    orientation: 'vertical',
    selectOnInit: false
  };

  var sidenavParms = {
    createParams: {
      containerId: 'thumbsNav',
      styles: styles,
      keyController: templatePage.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      }
    },
    behaviors: behaviors
  };

  templatePage.thumbsNavControl = new gtv.jq.SideNavControl(sidenavParms);

  var showParams = {
    topParent: $('#outterThumbsNav'),
    contents: {
      items: navItems
    }
  };

  templatePage.thumbsNavControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    var index = selectedItem.data('index');

    if (index == 0) {
      // Thumbs Up
    } else if (index == 1) {
      // Thumbs Down
    }
  }
};

/**
 * Creates the Tooltip control.
 */
gtv.jq.TemplatePage.prototype.makeTooltip = function() {
  var templatePage = this;

  var styles = {
    containerClass: 'tooltip',
    leftDescClass: 'floatLeft',
    rightDescClass: 'floatRight'
  };

  var behaviors = {
    animate: false,
    hideTimeout: 2000,
    borderColor: '#02B8D9'
  };

  var tooltipParms = {
    createParams: {
      containerId: 'tooltip-control-container',
      styles: styles
    },
    topParent: $('#tooltip-container'),
    behaviors: behaviors
  };

  templatePage.tooltipControl = new gtv.jq.Tooltip(tooltipParms);
};

/**
 * Creates the Progress Bars controls.
 */
gtv.jq.TemplatePage.prototype.makeProgressBars = function() {
  var templatePage = this;

  templatePage.progressBar = new gtv.jq.VideoProgressBar();

  var styles = {
    container: 'statusbar',
    elapsedTime: 'elapsedTime',
    progressBack: 'progressbar',
    playProgress: 'progressTime',
    loadProgress: 'loadTime',
    duration: 'duration',
    tooltip: 'timeTooltip'
  };

  var callbacks = {
    onTimeSelected: function(seconds) {
      if (templatePage.videoControl) {
        templatePage.videoControl.playAt(seconds);
      }
    }
  };

  var progressParms = {
      createParams: {
        containerId: 'progressbar-control',
        styles: styles,
        callbacks: callbacks
      },
    topParent: $('#progress-container')
  };

  templatePage.progressBar.makeControl(progressParms);

  templatePage.fullScreenProgressBar = new gtv.jq.VideoProgressBar();

  styles = {
    container: 'statusbarFS',
    elapsedTime: 'elapsedTimeFS',
    progressBack: 'progressbarFS',
    playProgress: 'progressTimeFS',
    loadProgress: 'loadTimeFS',
    duration: 'durationFS',
    tooltip: 'timeTooltip'
  };

  progressParms = {
    createParams: {
      containerId: 'full-progressbar-control',
      styles: styles,
      callbacks: callbacks
    },
    topParent: $('#full-progress-container')
  };

  templatePage.fullScreenProgressBar.makeControl(progressParms);
};

/**
 * Creates the html 5 Video control.
 */
gtv.jq.TemplatePage.prototype.makeVideoControl = function() {
  var templatePage = this;

  function executeVideoCommand(selectedItem) {
    if (selectedItem) {
      var index = selectedItem.data('index');

      switch (index) {
        case 0:
          if (templatePage.videoControl.isFullScreen) {
            templatePage.previousVideo(true);
          } else {
            templatePage.videoControl.playPause();
          }
          break;
        case 1:
          if (templatePage.videoControl.isFullScreen) {
            templatePage.videoControl.rewind();
          } else {
            templatePage.videoControl.fullScreen();
          }
          break;
        case 2:
          templatePage.videoControl.playPause();
          break;
        case 3:
          templatePage.videoControl.fastForward();
          break;
        case 4:
          templatePage.nextVideo(true);
          break;
      }
    }
  };

  function highlightControl(item) {
    if (item) {
      var selected = item.hasClass('video-command-selected');
      if (selected) {
        item.removeClass('video-command-selected');
      }
      item.addClass('video-command-highlighted');
      setTimeout(function(){
        if (selected) {
          item.addClass('video-command-selected');
        }
        item.removeClass('video-command-highlighted');
      }, 100);
    }
  };

  var styles = {
    video: 'video-control',
    container: 'video-control-container',
    commandSelected: 'video-command-selected',
    width: '665',
    height: '460'
  };

  var behaviors = {
    showControls: false,
    startFullScreen: true,
    allowWindowStateChange: true,
    exitFullScreenOnEnded: false,
    autoPlay: true
  };

  var callbacks = {
    windowStateChanged: function() {
      var navBtnClass = 'navDetailsButton';
      var navBtnText = 'Details';
      var detailsBorderAddClass = 'details-border-div';
      var detailsBorderRemClass = 'fullscreen-border-div';
      if (templatePage.videoControl.isFullScreen) {
        $('#content').css('visibility', 'hidden');
        $('#controlsFS').css('visibility', 'visible');
        $('#controls').css('visibility', 'hidden');
        $('#header').addClass('headerFullscreen');
        $('#carouselFS').addClass('carouselFSOpac');
        templatePage.startFadeTimeout();
      } else {
        navBtnClass = 'navBackButton';
        navBtnText = 'Fullscreen';
        detailsBorderAddClass = 'fullscreen-border-div';
        detailsBorderRemClass = 'details-border-div';
        $('#content').css('visibility', 'visible');
        $('#controlsFS').css('visibility', 'hidden');
        $('#controls').css('visibility', 'visible');
        $('#header').removeClass('headerFullscreen');
        $('#carouselFS').removeClass('carouselFSOpac');
        templatePage.stopFadeTimeout();
        templatePage.fadeControlsIn(true);
      }
      $('#navBackDetailsButton').attr('class', navBtnClass);
      $('#navBackDetailsText').html(navBtnText);
      $('#navBackDetailsBorder').addClass(detailsBorderAddClass);
      $('#navBackDetailsBorder').removeClass(detailsBorderRemClass);
      if (templatePage.topMenuZone) {
        templatePage.keyController.setZone(templatePage.topMenuZone, true);
      }
    },
    onUserActivity: function() {
      if (templatePage.videoControl.isFullScreen) {
        templatePage.fadeControlsIn();
      }
    },
    onMediaKey: function() {
      templatePage.fadeControlsIn(false, true);
    },
    timeUpdated: function() {
      templatePage.progressBar.setElapsedTime(
          templatePage.videoControl.getElapsedTime());
      templatePage.fullScreenProgressBar.setElapsedTime(
          templatePage.videoControl.getElapsedTime());
    },
    loaded: function() {
      templatePage.progressBar.setDuration(
          templatePage.videoControl.getDuration());
      templatePage.fullScreenProgressBar.setDuration(
          templatePage.videoControl.getDuration());
    },
    ended: function() {
      var playPauseItemFS = $('#playPauseFS');
      playPauseItemFS.removeClass('video-command-paused');
      var playPauseItem = $('#playPause');
      playPauseItem.removeClass('video-command-paused');
      templatePage.progressBar.resetElapsedTime();
      templatePage.fullScreenProgressBar.resetElapsedTime();
      templatePage.nextVideo(true);
    },
    stateChanged: function() {
      var playPauseItemFS = $('#playPauseFS');
      var playPauseItem = $('#playPause');
      if (templatePage.videoControl.getPaused()) {
        playPauseItemFS.removeClass('video-command-paused');
        playPauseItem.removeClass('video-command-paused');
      } else {
        playPauseItemFS.addClass('video-command-paused');
        playPauseItem.addClass('video-command-paused');
      }
      highlightControl(playPauseItemFS);
      highlightControl(playPauseItem);
    },
    onControlClicked: function(selectedItem) {
      executeVideoCommand(selectedItem);
      highlightControl(selectedItem);
    },
    onEnter: function(selectedItem) {
      executeVideoCommand(selectedItem);
      highlightControl(selectedItem);
    },
    onPrevious: function() {
      highlightControl($('#previousFS'));
      templatePage.previousVideo(true);
    },
    onRewind: function() {
      highlightControl($('#rewindFS'));
    },
    onFastForward: function() {
      highlightControl($('#fastForwardFS'));
    },
    onNext: function() {
      highlightControl($('#next'));
      templatePage.nextVideo(true);
    },
    onDurationChanged: function() {
      templatePage.progressBar.setDuration(
          templatePage.videoControl.getDuration());
      templatePage.fullScreenProgressBar.setDuration(
          templatePage.videoControl.getDuration());
    },
    onLoadProgress: function() {
      templatePage.progressBar.setLoadedTime(
          templatePage.videoControl.getLoadedTime());
      templatePage.fullScreenProgressBar.setLoadedTime(
          templatePage.videoControl.getLoadedTime());
    }
  };

  var selectors = {
    videoCommand: '.video-command',
    videoCommandDiv: '.video-command-div',
    videoCommandsParent: '#video',
    fullScreenVideoCommandsParent: '#controlsFS'
  };

  var videoParms = {
    createParams: {
      containerId: 'video-container-div',
      styles: styles,
      selectors: selectors,
      keyController: templatePage.keyController,
      callbacks: callbacks
    },
    topParent: $('#video-container'),
    behaviors: behaviors
  };

  templatePage.videoControl = new gtv.jq.VideoControl();
  templatePage.videoControl.makeControl(videoParms);

  templatePage.keyController.globalKeyMapping_[27] = function() {
    templatePage.videoControl.fullScreen();
    return { status: 'none' };
  };
};

/**
 * Selects next video
 * @parm {boolean} true if the video should start playing.
 */
gtv.jq.TemplatePage.prototype.nextVideo = function(play) {
  var templatePage = this;

  templatePage.carouselControl.selectNext(play);
};

/**
 * Selects previous video
 * @parm {boolean} true if the video should start playing.
 */
gtv.jq.TemplatePage.prototype.previousVideo = function(play) {
  var templatePage = this;

  templatePage.carouselControl.selectPrevious(play);
};

/**
 * Creates the Carousel control.
 */
gtv.jq.TemplatePage.prototype.makeSlider = function() {
  var templatePage = this;

  if (!templatePage.item ||
      !templatePage.item.videos ||
      templatePage.item.videos.length == 0)
    return;

  var behaviors = {
    itemsToDisplay: 9,
    selectOnInit: true
  };

  var styleClasses = {
    itemDiv: 'thumbnails-item-div',
    item: '',
    normal: 'thumbnails-item',
    chosen: 'thumbnails-item-active',
    selected: 'thumbnails-item-highlighted'
  };

  var videos = templatePage.item.videos;

  var items = [];
  for (var i=0; i<videos.length; i++) {
    var video = videos[i];

    var div = $('<div></div>')
        .addClass('carousel-photo')
        .css('background', 'url(' + video.thumb + ')');

    var nowPlaying = $('<div></div>')
        .addClass('now-playing-layer')
        .html('Now playing');

    div.append(nowPlaying);

    items.push({
      content: div,
      data: video
    });
  }

  var callbacks = {
    onActivated: function(selectedItem) {
      choiceCallback(selectedItem);
    },
    onSelected: function(selectedItem) {
      if (templatePage.carouselControl.isVisible()) {
        var videoInfo = selectedItem.data('nav-data');
        templatePage.showTooltip(videoInfo, selectedItem);
      }
    },
    onBlur: function() {
      templatePage.tooltipControl.hide();
    },
    onBeforeScroll: function() {
      templatePage.tooltipControl.hide();
    }
  };

  var carouselParms = {
    createParams: {
      containerId: 'carousel-container',
      styles: styleClasses,
      keyController: templatePage.keyController,
      callbacks: callbacks,
      layerNames: ['default', gtv.jq.VideoControl.fullScreenLayer]
    },
    behaviors: behaviors
  };

  templatePage.carouselControl = new gtv.jq.Carousel(carouselParms);

  var showParams = {
    topParent: $('#thumbnails'),
    items: items
  };

  templatePage.carouselControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    if (!selectedItem) {
      return;
    }

    var videoInfo = selectedItem.data('nav-data');
    templatePage.progressBar.resetAll();
    templatePage.fullScreenProgressBar.resetAll();
    templatePage.videoControl.showVideo(videoInfo);
    templatePage.updateHeader(videoInfo);
  }
};

/**
 * Shows the tooltip control for the selected video and shows it
 * relatively to the selected element.
 * @parm {Object} object holding the selected video information.
 * @parm {jQuery.Element} selected element
 */
gtv.jq.TemplatePage.prototype.showTooltip = function(videoInfo, selectedItem) {
  if (templatePage.tooltipControl) {
    templatePage.tooltipControl.show({
      title: videoInfo.title,
      subTitle: videoInfo.subtitle,
      descriptionLeft: videoInfo.description[0],
      descriptionRight: videoInfo.description[1]
    }, selectedItem);
  }
};

/**
 * Updates header with the selected video information.
 * @parm {Object} object holding the selected video information.
 */
gtv.jq.TemplatePage.prototype.updateHeader = function(videoInfo) {
  $('#videoTitle').html(videoInfo.title);
  $('#videoSubtitle').html(videoInfo.subtitle);
};

/**
 * Loads the template home page (main menu).
 */
gtv.jq.TemplatePage.prototype.gotoMenu = function() {
  var templatePage = this;

  templatePage.videoControl.stop();

  location.assign('index.html');
};

/**
 * Changes video state from/to fullscreen.
 */
gtv.jq.TemplatePage.prototype.detailsBack = function() {
  templatePage.videoControl.fullScreen();
};

/**
 * Starts controls fade timeout.
 */
gtv.jq.TemplatePage.prototype.startFadeTimeout = function() {
  var templatePage = this;

  templatePage.stopFadeTimeout();

  templatePage.fadeTimeout = window.setTimeout(function() {
    templatePage.fadeControlsOut();
  }, 4000);
};

/**
 * Stops controls fade timeout.
 */
gtv.jq.TemplatePage.prototype.stopFadeTimeout = function() {
  var templatePage = this;

  if (templatePage.fadeTimeout) {
    window.clearTimeout(templatePage.fadeTimeout);
  }
};

/**
 * Fades controls into the screen.
 * @parm {boolean} true if the fade timeout should not be started.
 * @parm {boolean} true if only media media controls should be shown.
 */
gtv.jq.TemplatePage.prototype.fadeControlsIn = function(avoidStart,
                                                        onlyControls) {
  var templatePage = this;

  if (!onlyControls) {
    $('#header').fadeIn(200, avoidStart?function() {}:function() {
      templatePage.startFadeTimeout();
    });
  }
  $('#carouselFS').fadeIn(200, avoidStart ? function() {
    } : function() {
      templatePage.startFadeTimeout();
    });
};

/**
 * Fades controls out from the screen.
 */
gtv.jq.TemplatePage.prototype.fadeControlsOut = function() {
  var templatePage = this;

  if (!templatePage.videoControl.isFullScreen) {
    templatePage.stopFadeTimeout();
    return;
  }

  $('#header').fadeOut(2000, function() {});
  $('#carouselFS').fadeOut(2000, function() {});
  $(templatePage.tooltipControl.holder).fadeOut(2000, function() {});
  templatePage.progressBar.hideTimeTooltip();
  templatePage.fullScreenProgressBar.hideTimeTooltip();
};

/**
 * Instanciates data from the data provider.
 */
gtv.jq.TemplatePage.prototype.instanciateData = function() {
  templatePage.dataProvider = new gtv.jq.DataProvider();
  templatePage.data = templatePage.dataProvider.getData();

  var queryString = location.search;

  if (queryString.length < 1) {
    return;
  }

  var parms = queryString.substring(1).split('&');

  if (parms.length != 2) {
    return;
  }

  var categoryIndex = parseInt(parms[0].substring(9));
  var itemIndex = parseInt(parms[1].substring(5));

  templatePage.category = templatePage.data.categories[categoryIndex];

  if (!templatePage.category) {
    return;
  }

  templatePage.item = templatePage.category.items[itemIndex];
};

/**
 * Zooms the page to fit the screen.
 */
gtv.jq.TemplatePage.prototype.doPageZoom = function() {
  var templatePage = this;

  $(document.body).css('zoom', $(window).width()/1230);
};

/**
 * Preloads images.
 */
gtv.jq.TemplatePage.prototype.preloadImages = function() {
  var images = [
    'images/tooltipTime-big.png',
    'images/ico-menu.png',
    'images/ico-menu-over.png',
    'images/ico-fullscreenTop.png',
    'images/ico-fullscreenTop-over.png',
    'images/ico-details.png',
    'images/ico-details-over.png',
    'images/bt-ffFS.png',
    'images/bt-ffFS-over.png',
    'images/bt-ffFS-active.png',
    'images/bt-fullscreen.png',
    'images/bt-fullscreen-over.png',
    'images/bt-fullscreen-active.png',
    'images/bt-pause.png',
    'images/bt-pause-over.png',
    'images/bt-pause-active.png',
    'images/bt-pauseFS.png',
    'images/bt-pauseFS-over.png',
    'images/bt-pauseFS-active.png',
    'images/bt-play.png',
    'images/bt-play-over.png',
    'images/bt-play-active.png',
    'images/bt-playFS.png',
    'images/bt-playFS-over.png',
    'images/bt-playFS-active.png',
    'images/bt-rewFS.png',
    'images/bt-rewFS-over.png',
    'images/bt-rewFS-active.png',
    'images/bt-nextFS.png',
    'images/bt-nextFS-over.png',
    'images/bt-nextFS-active.png',
    'images/bt-previousFS.png',
    'images/bt-previousFS-over.png',
    'images/bt-previousFS-active.png',
    'images/thumbs-up.png',
    'images/thumbs-up-over.png',
    'images/thumbs-down.png',
    'images/thumbs-down-over.png'];
  gtv.jq.GtvCore.preloadImages(images);
};

/**
 * Starts the template page.
 */
gtv.jq.TemplatePage.prototype.start = function() {
  var templatePage = this;

  templatePage.keyController = new gtv.jq.KeyController();

  templatePage.preloadImages();

  templatePage.doPageZoom();

  templatePage.instanciateData();
  templatePage.makeTooltip();
  templatePage.makeProgressBars();
  templatePage.makeVideoControl();
  templatePage.makeSlider();
  templatePage.makeTopMenu();
  templatePage.makeThumbsNav();

  templatePage.startFadeTimeout();

  $(document.body).css('visibility', '');

  templatePage.keyController.start(null,
                                   true,
                                   gtv.jq.VideoControl.fullScreenLayer);
};

var templatePage = new gtv.jq.TemplatePage();
templatePage.start();
