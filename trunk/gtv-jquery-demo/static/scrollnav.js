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
 * @fileoverview Implements the ScrollNav page for the bestpractices site.
 * 
 */

/**
 * ScrollNavPage class displays a page to demonstrate use of a side nav
 * control and bottom nav control in concert to select and manipuate
 * content.
 * @constructor
 */
function ScrollNavPage() {
}

/**
 * Create the content for the page and add it to the specified parent element.
 * @param {jQuery.Element} topParent The parent element to hold the content.
 */
ScrollNavPage.prototype.makePage = function(topParent) {
  var scrollNavPage = this;

  scrollNavPage.topParent = topParent;

  scrollNavPage.addSideNav();

  scrollNavPage.makeScrollNav();

  Main.setKeyHandlerForPage(topParent);
};

/**
 * Creates the side nav bar that provides two sample operations to perform
 * on the image displayed in the center of the page.
 */
ScrollNavPage.prototype.addSideNav = function() {
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

  var sidenavParams = {
    createParams: {
      containerId: 'sideNav',
      styles: styles,
      keyController: Main.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      }
    }
  };
  scrollNavPage.sideNavControl = new gtv.jq.SideNavControl(sidenavParams);

  var showParams = {
    topParent: sideNavHolder,
    contents: {
      items: navItems
    }
  };
  scrollNavPage.sideNavControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    if (!scrollNavPage.showDiv) {
      return;
    }

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
    } else if (selectedItem.text() == 'Flip') {
      rotateXAngle += 180;
    }

    transform =
      'rotate(' + rotateAngle + 'deg) rotateX(' + rotateXAngle + 'deg)';

    show.css({
        '-webkit-transition': 'all 1s ease-in-out',
        '-webkit-transform': transform
      });

    var showOffset = scrollNavPage.showDiv.offset();

    rotateAngle %= 360;

    var shadowDirX = [1, 1, -1, -1];
    var shadowDirY = [1, -1, -1, 1];
    var shadowX = 25 * shadowDirX[(rotateAngle % 360) / 90];
    var shadowY = 25 * shadowDirY[(rotateAngle % 360) / 90];

    if (rotateAngle % 180 == 0) {
      show.css('top', '0px');
    } else {
      show.css('top', showOffset.top + 'px');
    }

    show.css('-webkit-box-shadow',
              shadowX + 'px ' + shadowY +
              'px 10px 5px #222');
  }
};

/**
 * Creates the bottom nav bar that holds the scrolling display of thumbnails.
 */
ScrollNavPage.prototype.makeScrollNav = function() {
  var scrollNavPage = this;

  var scrollnavHolder = $('<div></div>').addClass('scrollnav-holder');
  scrollNavPage.topParent.append(scrollnavHolder);
  var firstShowSrc;
  var navItemsGenerator =
    function(parent) {
      if (scrollNavPage.rowControl)
        return false;

      var scrollRowContainer =
          $('<div></div>').addClass('scrollnav-row-holder');

      var windowWidth = $(window).width();
      scrollRowContainer.width(windowWidth);
      parent.append(scrollRowContainer);

      var videos = [
        {
          thumb: 'static/images/Video0.jpg',
          sources: [
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/' +
                  'Chrome_ImF.mp4',
              type: 'video/mp4',
              codecs: "avc1.42E01E, mp4a.40.2"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/' +
                  'Chrome_ImF.ogv',
              type: 'video/ogg',
              codecs: "theora, vorbis"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/' +
                  'Chrome_ImF.webm',
              type: 'video/webm',
              codecs: "vp8, vorbis"
            }
          ]
        },
        {
          thumb: 'static/images/Video1.jpg',
          sources: [
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/'
                   + 'chromeicon.mp4',
              type: 'video/mp4',
              codecs: "avc1.42E01E, mp4a.40.2"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/'
                   + 'chromeicon.ogv',
              type: 'video/ogg',
              codecs: "theora, vorbis"
            },
            {
              src: 'http://www.html5rocks.com/tutorials/video/basics/'
                   + 'chromeicon.webm',
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

        if (!firstShowSrc) {
          firstShowSrc = showSrc;
        }
      }

      for (var j = 0; j < 18; j++) {
        showSrc = 'static/images/photo' + j + '.jpg';
        itemArray[i + j] =
          $('<img></img>')
          .attr('src', showSrc)
          .css({ height: '150px',
                 display: 'block'});

        if (!firstShowSrc) {
          firstShowSrc = showSrc;
        }
      }

      function enterCallback(item) {
        var image = item.children().first();
        var sources;
        sources = image.data('src');
        if (!sources) {
          var src = image.attr('src');
          scrollNavPage.showPhoto(src);
        } else {
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

      var createParams = {
        containerId: 'row-container',
        styles: styles,
        keyController: Main.keyController,
        choiceCallback: enterCallback
      };
      scrollNavPage.rowControl = new gtv.jq.RowControl(createParams);

      var showParams = {
        topParent: scrollRowContainer,
        contents: {
          items: itemArray
        }
      };
      scrollNavPage.rowControl.showControl(showParams);
      scrollNavPage.rowControl.enableNavigation();

      var scrollRow = scrollRowContainer.children('#row-container');
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

  var sidenavParams = {
    createParams: {
      containerId: 'scrollnav',
      styles: styles,
      keyController: Main.keyController
    },
    behaviors: behaviors
  };
  var scrollnavControl = new gtv.jq.SideNavControl(sidenavParams);

  var showParams = {
    topParent: scrollnavHolder,
    contents: {
      itemsGenerator: navItemsGenerator
    }
  };
  scrollnavControl.showControl(showParams);

  var windowHeight = $(window).height();
  scrollnavHolder.css('top', ((windowHeight * 3) / 4) + 'px');

  scrollNavPage.showVideo(firstShowSrc);
};

/**
 * Displays a larger version of a photo in the middle of the page.
 * @param {string} imgSrc URI for the photo to display.
 */
ScrollNavPage.prototype.showPhoto = function(imgSrc) {
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

/**
 * Display an HTML5 video in the middle of the page.
 * @param {Object} sources The HTML5 video sources to attach to the video
 *     element on the page.
 */
ScrollNavPage.prototype.showVideo = function(sources) {
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

