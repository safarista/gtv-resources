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
 * @fileoverview Implements the menu navigation page for the bestpractices site.
 * 
 */

/**
 * NavigationPage class displays a page to demonstrate the SideNav control.
 * @constructor
 */
function NavigationPage()
{
}

/**
 * Creates the contents of the page and adds it to the specified parent
 * element. This page consists of two SideNav controls, one that slides down
 * from the top and one that slides in from either the left or right. The
 * controls are created in a cascade: the top nav is created, which in turn
 * creates the left/right nav control, which in turn displays a set of
 * photos in a Slider control (filtered by the choice in the left/right nav).
 * @param {jQuery.Element} topParent The parent element to hold the page
 *     content.
 */
NavigationPage.prototype.makePage = function(topParent) {
  var navigationPage = this;

  navigationPage.topParent = topParent;

  // Top nav bar adds side nav in its choice callback. Side nav bar adds
  // slider control in its choice callback.
  navigationPage.addTopNav();

  Main.setKeyHandlerForPage(
    topParent,
    'navpage',
    function() {
      return navigationPage.slider.find('.slider-item-style').first();
    });
};

/**
 * Creates the left/right SideNav control. This control contains a set of
 * items that represent filters for a set of photo content. The control
 * creates a Slider control in the middle of the page to display the photos.
 */
NavigationPage.prototype.addSideNav = function() {
  var navigationPage = this;

  var sideNavHolder = $('<div></div>').addClass('sidenav-holder');
  navigationPage.topParent.append(sideNavHolder);

  var navItems = [
    'All',
    'US',
    'Europe',
    'Asia',
    'Africa'
  ];

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
      containerId: 'sideNav',
      styles: styles,
      keyController: Main.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      }
    },
    behaviors: behaviors
  };
  navigationPage.sideNavControl = new gtv.jq.SideNavControl(sidenavParams);

  var showParams = {
    topParent: sideNavHolder,
    contents: {
      items: navItems
    }
  };
  navigationPage.sideNavControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    var tag = selectedItem.text().toLowerCase();
    navigationPage.makeSlider(tag);
  }

  navigationPage.sideNavControl.selectControl();
};

/**
 * Creates the top nav menu control. This control allows the user to select
 * which side the left/right nav control should appear on, to demo a feature
 * of the SideNav control.
 */
NavigationPage.prototype.addTopNav = function() {
  var navigationPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  navigationPage.topParent.append(topNavHolder);

  var navItems = [
    'Left Nav',
    'Right Nav'
  ];

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

  var sidenavParams = {
    createParams: {
      containerId: 'topNav',
      styles: styles,
      keyController: Main.keyController,
      choiceCallback: function(selectedItem) {
        handleChoiceCallback(selectedItem);
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

  function handleChoiceCallback(selectedItem) {
    var popOut = selectedItem.text().toLowerCase().split(' ');
    var sideBehaviors = {
      popOut: popOut[0],
      orientation: 'vertical'
    };

    if (!navigationPage.sideNavControl) {
      navigationPage.addSideNav(sideBehaviors);
    } else {
      navigationPage.sideNavControl.setBehaviors(sideBehaviors);
    }
  }

  var topNavContainer = topNavHolder.children('#topNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};

/**
 * Creates a slider control containing a set of photos, filtered by an
 * optional tag.
 * @param {string} tag The filter to use to select which photos to display.
 */
NavigationPage.prototype.makeSlider = function(tag) {
  var navigationPage = this;

  if (!navigationPage.slider) {
    var slider = $('<div></div>').addClass('slider-holder');
    navigationPage.topParent.append(slider);

    navigationPage.slider = slider;
  } else {
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
    { file: 'photo0.jpg', tag: 'europe', desc: 'Salzburg'},
    { file: 'photo1.jpg', tag: 'europe', desc: 'Budapest'},
    { file: 'photo2.jpg', tag: 'europe', desc: 'Czech Republic'},
    { file: 'photo3.jpg', tag: 'europe', desc: 'Prague' },
    { file: 'photo4.jpg', tag: 'africa', desc: 'Marrakesh' },
    { file: 'photo5.jpg', tag: 'us' , desc: 'Napa'},
    { file: 'photo6.jpg', tag: 'asia', desc: 'Kovalum'},
    { file: 'photo7.jpg', tag: 'europe', desc: 'Paris'},
    { file: 'photo8.jpg', tag: 'africa', desc: 'Marrakesh' },
    { file: 'photo9.jpg', tag: 'africa', desc: 'Marrakesh' },
    { file: 'photo10.jpg', tag: 'africa', desc: 'Atlas Mountains'},
    { file: 'photo11.jpg', tag: 'us', desc: 'Pt. Loma' },
    { file: 'photo12.jpg', tag: 'us', desc: 'Philadelpha' },
    { file: 'photo13.jpg', tag: 'us', desc: 'Maine' },
    { file: 'photo14.jpg', tag: 'europe', desc: 'Spain' },
    { file: 'photo15.jpg', tag: 'asia', desc: 'Singapore' },
    { file: 'photo16.jpg', tag: 'us', desc: 'Santa Ynez' },
    { file: 'photo17.jpg', tag: 'asia', desc: 'Agra' }
  ];

  var photoCount = photos.length;

  var pageItems = [];
  for (var i = 0; i < photoCount; i++) {
    if (photos[i].tag != tag && tag != 'all') {
      continue;
    }

    var img = $('<img></img>')
        .attr('src', 'static/images/' + photos[i].file)
        .addClass('slider-photo');

    var description = $('<p></p>').append(photos[i].desc)
      .addClass('slider-text-title');
    var descDiv = $('<div></div>').addClass('slider-text-desc');

    descDiv.append(description);

    pageItems.push({
      item: img,
      caption: descDiv
    });
  }

  var createParams = {
    containerId: 'sliding-control',
    styles: styleClasses,
    keyController: Main.keyController
  };
  navigationPage.slidingControl = new gtv.jq.SlidingControl(createParams);

  var showParams = {
    topParent: navigationPage.slider,
    contents: {
      captionItems: pageItems
    }
  };
  navigationPage.slidingControl.showControl(showParams);
};

