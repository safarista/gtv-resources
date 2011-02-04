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
 * @fileoverview Implements the RowControl page for the bestpractices site.
 * 
 */

/**
 * ScrollingPage class displays a page to demonstrate the Row Control.
 * @constructor
 */
function ScrollingPage() {
}

/**
 * Creates the content for the page and adds it to the specified parent
 * element. This page has a set of thumbnails displayed in a single row
 * control.
 * @param {jQuery.Element} topParent The parent element for the page contents.
 */
ScrollingPage.prototype.makePage = function(topParent) {
  var scrollingPage = this;
  scrollingPage.topParent = topParent;

  scrollingPage.container = $('<div></div>').addClass('scrolling-page');
  scrollingPage.topParent.append(scrollingPage.container);

  var numPhotos = 18;
  var itemArray = new Array(numPhotos);
  for (var i = 0; i < numPhotos; i++) {
    itemArray[i] =
          $('<img></img>')
            .attr('src', 'static/images/photo' + i + '.jpg')
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

  var createParams = {
    containerId: 'row-container',
    styles: styles,
    keyController: Main.keyController
  };
  scrollingPage.rowControl = new gtv.jq.RowControl(createParams);

  var controlParams = {
    topParent: scrollingPage.container,
    contents: {
      items: itemArray
    }
  };
  scrollingPage.rowControl.showControl(controlParams);

  Main.showHints(
    topParent,
    function() {
      scrollingPage.rowControl.enableNavigation();
    });

  Main.setKeyHandlerForPage(
    topParent,
    'scrollingpage',
    function() {
      return topParent.find('.scroll-item-style').first();
    });
};
