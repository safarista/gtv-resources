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
 * @fileoverview Implements the Tutorial sub page for the demo site.
 * 
 */


/**
 * Tutorial page class.
 * @constructor
 */
function TutorialPage() {
}

/**
 * Setup the tutorial page, build the content for the first page, and
 * attach it to the parent container.
 * @param {jQuery.Element} topParent Parent element to hold page contents.
 */
TutorialPage.prototype.makePage = function(topParent) {
  var tutorialPage = this;
  tutorialPage.topParent = topParent;

  var zones = Main.keyController.stop();

  tutorialPage.keyController = new gtv.jq.KeyController();
  tutorialPage.keyController.start();

  tutorialPage.container = $('<div></div>').addClass('tutorial-container');
  topParent.append(tutorialPage.container);

  tutorialPage.pages = [
    new RowTutorialPage(tutorialPage.keyController),
    new FeedTutorialPage(tutorialPage.keyController),
    new ChooseTutorialPage(tutorialPage.keyController),
    new SideNavTutorialPage(tutorialPage.keyController)
  ];

  tutorialPage.addTopNav();

  tutorialPage.showPage(0);
};

/**
 * Display the specified page of the tutorial.
 * @param {number} pageNum The page number to display.
 */
TutorialPage.prototype.showPage = function(pageNum) {
  var tutorialPage = this;

  if (tutorialPage.cleanUp) {
    tutorialPage.cleanUp();
  }

  tutorialPage.container.empty();

  tutorialPage.currentPage = pageNum;
  tutorialPage.cleanUp =
      tutorialPage.pages[pageNum].makePage(tutorialPage.container);
};

/**
 * Create the top navigation bar for the tutorial pages. This bar persists
 * over all pages, allowing the user to move to the next/previous page as
 * well as exit the tutorial.
 */
TutorialPage.prototype.addTopNav = function() {
  var tutorialPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  tutorialPage.topParent.append(topNavHolder);

  var navItems = ['Next Part', 'Prev Part', 'Exit'];

  var styles = {
    item: 'topnav-item-style',
    itemDiv: 'topnav-item-div-style',
    row: 'topnav-row-style',
    normal: 'topnav-item-normal',
    selected: 'topnav-item-hover'
  };

  var behaviors = {
    popOut: 'top',
    orientation: 'horizontal'
  };

  var sidenavParams = {
    createParams: {
      containerId: 'topNav',
      styles: styles,
      keyController: tutorialPage.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      }
    },
    behaviors: behaviors
  };
  var topNavControl = new gtv.jq.SideNavControl(sidenavParams);

  var showParams = {
    topParent: topNavHolder,
    contents: {
      items: navItems
    }
  };
  topNavControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    if (selectedItem.text() == navItems[2]) {
      tutorialPage.keyController.stop();
      Main.makeHome(false);
    } else if (selectedItem.text() == navItems[0]) {
      if (tutorialPage.currentPage + 1 < tutorialPage.pages.length) {
        tutorialPage.showPage(tutorialPage.currentPage + 1);
      }
    } else if (selectedItem.text() == navItems[1]) {
      if (tutorialPage.currentPage > 0) {
        tutorialPage.showPage(tutorialPage.currentPage - 1);
      }
    }
  }

  var topNavContainer = topNavHolder.children('#topNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};


function RowTutorialPage(keyController) {
  this.keyController = keyController;
}

/**
 * The first tutorial page. Displays a simple row control with numbered
 * elements.
 * @param {jQuery.Element} topParent The container for the page.
 */
RowTutorialPage.prototype.makePage = function(topParent) {
  var tutorialPage = this;

  var items = [];
  for (var i = 0; i < 50; i++) {
    var item = $('<p></p>').text(i.toString());
    items.push(item);
  }

  var styles = {
    row: 'scroll-row-style',
    itemsDiv: 'scroll-items-div-style',
    itemDiv: 'scroll-div-style',
    item: 'scroll-item-style',
    hover: 'item-hover'
  };

  var createParams = {
    containerId: 'row-container',
    styles: styles,
    keyController: tutorialPage.keyController
  };
  var rowControl = new gtv.jq.RowControl(createParams);

  var showParams = {
    topParent: topParent,
    contents: {
      items: items
    }
  };
  rowControl.showControl(showParams);
  rowControl.enableNavigation();

  return function() {
    rowControl.deleteControl();
  };
};


function FeedTutorialPage(keyController) {
  this.keyController = keyController;
}

/**
 * The second tutorial page. Displays a row control with thumbnails from
 * a Picasa photo feed.
 * @param {jQuery.Element} topParent The container for the page.
 */
FeedTutorialPage.prototype.makePage = function(topParent) {
  var tutorialPage = this;
  var FEED_URL = 'http://picasaweb.google.com/data/feed/base/featured?' +
      'alt=json-in-script&kind=photo&access=public&' +
      'slabel=featured&hl=en_US&max-results=25';

  function makeItem(entry) {
    var thumb = entry.media$group.media$thumbnail[0].url;
    if (!thumb) {
      return null;
    }

    var item = $('<img></img>')
      .css({ height: '150px',
             display: 'block'})
      .attr('src', thumb);

    return item;
  }

  var rowControl;
  function makeRow(items) {
    var styles = {
      row: 'scroll-row-style',
      itemsDiv: 'scroll-items-div-style',
      itemDiv: 'scroll-div-style',
      item: 'scroll-item-style',
      hover: 'item-hover'
    };

    var createParams = {
      containerId: 'row-container',
      styles: styles,
      keyController: tutorialPage.keyController
    };
    rowControl = new gtv.jq.RowControl(createParams);

    var showParams = {
      topParent: topParent,
      contents: {
        items: items
      }
    };
    rowControl.showControl(showParams);
    rowControl.enableNavigation();
  }

  gtv.jq.GtvCore.processJsonpFeed(
      FEED_URL,
      makeItem,
      makeRow,
      ['feed','entry']);

  return function() {
    rowControl.deleteControl();
  };
};


function ChooseTutorialPage(keyController) {
  this.keyController = keyController;
}

/**
 * The second tutorial page. Displays a row control with thumbnails from
 * a Picasa photo feed, and allow the user to choose a photo for display
 * on the page.
 * @param {jQuery.Element} topParent The container for the page.
 */
ChooseTutorialPage.prototype.makePage = function(topParent) {
  var tutorialPage = this;
  var FEED_URL = 'http://picasaweb.google.com/data/feed/base/featured?'
                 + 'alt=json-in-script&kind=photo&access=public&'
                 + 'slabel=featured&hl=en_US&max-results=25';

  var photoHolder = $('<div></div>');
  topParent.append(photoHolder);

  var photo = $('<img></img>').attr('height', 700);
  photoHolder.append(photo);

  function makeItem(entry) {
    var thumb = entry.media$group.media$thumbnail[0].url;
    var content = entry.media$group.media$content[0].url;
    if (!content || !thumb)
      return null;

    var item = $('<img></img>')
      .css({ height: '150px',
             display: 'block'})
      .attr('src', thumb);

    item.data('url', content);
    return item;
  }

  function showPhoto(url) {
    photo.attr('src', url);
  }

  var scrollnavControl;
  var rowControl;
  function makeRow(items) {
    var scrollnavHolder = $('<div></div>').addClass('scrollnav-holder');
    topParent.append(scrollnavHolder);

    var firstShowSrc;
    function addNavItem(parent) {
      if (rowControl) {
        return false;
      }

      var scrollRowContainer = $('<div></div>')
          .addClass('scrollnav-row-holder');

      var windowWidth = $(window).width();
      scrollRowContainer.width(windowWidth);
      parent.append(scrollRowContainer);

      function choiceCallback(item) {
        var image = item.children().first();
        var url = image.data('url');
        showPhoto(url);
      }

      var styles = {
        row: 'scroll-row-style',
        itemsDiv: 'scroll-items-div-style',
        itemDiv: 'scroll-div-style',
        item: 'scroll-item-style',
        selected: 'item-hover'
      };

      var rowCreateParams = {
        containerId: 'row-container',
        styles: styles,
        keyController: tutorialPage.keyController,
        choiceCallback: choiceCallback
      };
      rowControl = new gtv.jq.RowControl(rowCreateParams);

      var rowShowParams = {
        topParent: scrollRowContainer,
        contents: {
          items: items
        }
      };
      rowControl.showControl(rowShowParams);
      rowControl.enableNavigation();

      var scrollRow = scrollRowContainer.children('#row-container');
      scrollRowContainer.height(scrollRow.height());

      return true;
    }

    var styles = {
      item: 'scrollnav-item-style',
      itemDiv: 'scrollnav-item-div-style',
      row: 'scrollnav-row-style',
      selected: 'scrollnav-item-hover'
    };

    var behaviors = {
      popOut: 'bottom',
      orientation: 'horizontal'
    };

    var sidenavParams = {
      createParams: {
        containerId: 'scrollnav',
        styles: styles,
        keyController: tutorialPage.keyController
      },
      behaviors: behaviors
    };
    scrollnavControl = new gtv.jq.SideNavControl(sidenavParams);

    var navShowParams = {
      topParent: scrollnavHolder,
      contents: {
        itemsGenerator: addNavItem
      }
    };
    scrollnavControl.showControl(navShowParams);

    showPhoto(items[0].data('url'));
    scrollnavControl.selectControl();
  }

  gtv.jq.GtvCore.processJsonpFeed(
      FEED_URL,
      makeItem,
      makeRow,
      ['feed','entry']);

  return function() {
    rowControl.deleteControl();
    scrollnavControl.deleteControl();
  };
};


function SideNavTutorialPage(keyController) {
  this.keyController = keyController;
}

/**
 * The second tutorial page. Displays a row control with thumbnails from
 * a Picasa photo feed, and allow the user to choose a photo for display
 * on the page (this time centered), as well as a left-hand nav menu for
 * filtering the photo results (based on the age of the photo).
 * @param {jQuery.Element} topParent The container for the page.
 */
SideNavTutorialPage.prototype.makePage = function(topParent) {
  var tutorialPage = this;
  var FEED_URL = 'http://picasaweb.google.com/data/feed/base/featured?'
                 + 'alt=json-in-script&kind=photo&access=public&'
                 + 'slabel=featured&hl=en_US&max-results=50';

  var photoHolder = $('<div></div>').css('position', 'absolute');
  topParent.append(photoHolder);

  var photo = $('<img></img>').attr('height', 700);
  photoHolder.append(photo);

  function makeItem(entry) {
    var date = entry.published.$t;
    var thumb = entry.media$group.media$thumbnail[0].url;
    var content = entry.media$group.media$content[0].url;
    if (!content || !thumb) {
      return null;
    }

    var item = $('<img></img>')
      .css({ height: '150px',
             display: 'block'})
      .attr('src', thumb);

    item.data('url', content);
    item.data('date', date);
    return item;
  }

  function showPhoto(url) {
    var newPhoto = $('<img></img>')
        .attr('height', 700)
        .attr('src', url);

    newPhoto.load(function() {
        photo.remove();
        photoHolder.append(newPhoto);
        photoHolder.css(
            { left: ($(window).width() / 2) - (newPhoto.width() / 2) + 'px' });
        photo = newPhoto;
      });
  }

  var scrollnavControl;
  var rowControl;
  function makeRow(items, checkTime) {
    var scrollnavHolder = $('<div></div>').addClass('scrollnav-holder');
    topParent.append(scrollnavHolder);

    var filterItems = [];
    var navItemsGenerator =
        function(parent) {
          if (rowControl) {
            return false;
          }

          var scrollRowContainer = $('<div></div>')
              .addClass('scrollnav-row-holder');

          var windowWidth = $(window).width();
          scrollRowContainer.width(windowWidth);
          parent.append(scrollRowContainer);

          function choiceCallback(item) {
            var image = item.children().first();
            var url = image.data('url');
            showPhoto(url);
          }

          var styles = {
            row: 'scroll-row-style',
            itemsDiv: 'scroll-items-div-style',
            itemDiv: 'scroll-div-style',
            item: 'scroll-item-style',
            selected: 'item-hover'
          };

          for (var i = 0; i < items.length; i++) {
            var itemDateStr = items[i].data('date');
            var itemDate = Date.parse(itemDateStr);
            if (itemDate > checkTime)
              filterItems.push(items[i]);
          }

          if (filterItems.length == 0) {
            return false;
          }

          var rowCreateParams = {
            containerId: 'row-container',
            styles: styles,
            keyController: tutorialPage.keyController,
            choiceCallback: choiceCallback
          };
          rowControl = new gtv.jq.RowControl(rowCreateParams);

          var rowShowParams = {
            topParent: scrollRowContainer,
            contents: {
              items: filterItems
            }
          };
          rowControl.showControl(rowShowParams);
          rowControl.enableNavigation();

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
      popOut: 'bottom',
      //    fade: true,
      orientation: 'horizontal'
    };

    var sidenavParams = {
      createParams: {
        containerId: 'scrollnav',
        styles: styles,
        keyController: tutorialPage.keyController
      },
      behaviors: behaviors
    };
    scrollnavControl = new gtv.jq.SideNavControl(sidenavParams);

    var navShowParams = {
      topParent: scrollnavHolder,
      contents: {
        itemsGenerator: navItemsGenerator
      }
    };
    scrollnavControl.showControl(navShowParams);

    if (filterItems.length)
      showPhoto(filterItems[0].data('url'));

    scrollnavControl.selectControl();
  }

  var sideNavControl;
  function makeSideNav() {
    var sideNavHolder = $('<div></div>').addClass('sidenav-holder');
    topParent.append(sideNavHolder);

    var navItems = ['Last 2 Weeks', 'Last 4 Weeks', 'Last 2 Months'];

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

    var sidenavParams = {
      createParams: {
        containerId: 'sidenav',
        styles: styles,
        keyController: tutorialPage.keyController,
        choiceCallback: function(selectedItem) {
          choiceCallback(selectedItem);
        }
      },
      behaviors: behaviors
    };
    sideNavControl = new gtv.jq.SideNavControl(sidenavParams);

    var showParams = {
      topParent: sideNavHolder,
      contents: {
        items: navItems
      }
    };
    sideNavControl.showControl(showParams);

    function choiceCallback(selectedItem) {
	var filter = selectedItem.text();
      var checkTime = new Date();
      if (filter == navItems[0]) {
        checkTime.setDate(checkTime.getDate() - 14);
      } else if (filter == navItems[1]) {
        checkTime.setDate(checkTime.getDate() - 28);
      } else if (filter == navItems[2]) {
        checkTime.setMonth(checkTime.getMonth() - 2);
      }

      if (rowControl) {
        rowControl.deleteControl();
      }

      if (scrollnavControl) {
        scrollnavControl.deleteControl();
      }

      rowControl = null;

      gtv.jq.GtvCore.processJsonpFeed(
          FEED_URL,
          makeItem,
          function(items) {
            makeRow(items, checkTime.getTime());
          },
          ['feed','entry']);
    }

    sideNavControl.selectControl();
  }

  makeSideNav();

  return function() {
    rowControl.deleteControl();
    scrollnavControl.deleteControl();
    sideNavControl.deleteControl();
  };
};

