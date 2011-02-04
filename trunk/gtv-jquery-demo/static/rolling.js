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
 * @fileoverview Implements the RollerControl page for the bestpractices site.
 * 
 */

/**
 * RollingPage class displays a page to demonstrate the Roller control.
 * @constructor
 */
function RollingPage() {
}

/**
 * Creates the content to demonstrate the Roller control and attaches it to
 * the supplied parent element. The page is actually constructed in the,
 * callback from the hints page, which is made after the user dismisses the
 * hints box.
 * @param {jQuery.Element} topParent The parent element the content should
 *     be appended to.
 */
RollingPage.prototype.makePage = function(topParent) {
  var rollingPage = this;
  rollingPage.topParent = topParent;

  Main.showHints(
    topParent,
    function() {
      rollingPage.makeNavMenu();
    });

  Main.setKeyHandlerForPage(
    topParent,
    'rollingpage',
    function() {
      return topParent.find('.scroll-item-style').first();
    });
};

/**
 * Creates the top nav menu for choosing the number of rollers that the
 * Roller control should be created with. Since the SideNavControl chooses
 * the first item in the menu at creation, this leads to the Roller control
 * being created with 3 rows when the content is first loaded. This is called
 * by a callback from the Hints page.
 */
RollingPage.prototype.makeNavMenu = function() {
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

  var sidenavParams = {
    createParams: {
      containerId: 'rollNav',
      styles: styles,
      keyController: Main.keyController,
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

/**
 * Create the Roller control with the specified number of rows.
 * @param {number} numRows The number of rows in the roller control.
 */
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
    itemsArray[j] = {
      items: new Array(photosPerRow)
    };
    for (var i = 0; i < photosPerRow; i++) {
      itemsArray[j].items[i] =
          $('<img></img>')
            .attr('src', 'static/images/photo' + photoIndex + '.jpg')
            .css({ height: '30%',
                   display: 'block'});
      photoIndex++;

      if (photoIndex > 17) {
        break;
      }
    }
  }

  var styles = {
    row: 'scroll-row-style',
    itemsDiv: 'scroll-items-div-style',
    itemDiv: 'scroll-div-style',
    item: 'scroll-item-style',
    hover: 'item-hover'
  };

  var rollerParams = {
    createParams: {
      containerId: 'roller-container',
      styles: styles,
      keyController: Main.keyController
    }
  };
  rollingPage.roller = new gtv.jq.RollerControl(rollerParams);

  var showParams = {
    topParent: rollingPage.topParent,
    contents: {
      contentsArray: itemsArray
    }
  };
  var rollerContainer = rollingPage.roller.showControl(showParams);
  rollingPage.roller.enableNavigation();
};

