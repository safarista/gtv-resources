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
 * @fileoverview Implements the SlidingControl page for the bestpractices site.
 * 
 */

/**
 * SlidingPage class displays a page to demonstrate the SlidingControl
 * @constructor
 */
function SlidingPage() {
}

/**
 * Creates a page to demo the sliding control and adds the content to the
 * supplied topParent. This page demos the sliding control by adding a
 * set of photo elements to the control with description titles.
 * @param {jQuery.Element} topParent The container to which the page content
 *     should be added.
 */
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
        .attr('src', 'static/images/photo' + i + '.jpg')
        .addClass('slider-photo');

    var description = $('<p></p>').append('photo ' + i)
      .addClass('slider-text-title');
    var descDiv = $('<div></div>').addClass('slider-text-desc');

    descDiv.append(description);

    pageItems.push({
        item: img,
        caption: descDiv
      });
  }

  var createParams = {
    containerId: 'slider-container',
    styles: styleClasses,
    keyController: Main.keyController,
    choiceCallback: function(item) {
      slidingPage.transitionPage(item);
    }
  };
  slidingPage.slidingControl = new gtv.jq.SlidingControl(createParams);

  var showParams = {
    topParent: slidingPage.container,
    contents: {
      captionItems: pageItems
    }
  };
  slidingPage.slidingControl.showControl(showParams);

  Main.setKeyHandlerForPage(
    topParent,
    'slidingpage',
    function() {
      return container.find('.slider-item-style').first();
    });
};

/**
 * Transitions the browser to a URL provided in the nav-data data element
 * of the supplied element, if any. Called as a callback by the Sliding
 * Control when the users chooses an item (clicks on it or presses Enter
 * when it is selected).
 * @param {jQuery.Element} selectedItem The item chosen by the user.
 */
SlidingPage.prototype.transitionPage = function(selectedItem) {
  var itemObject = $(selectedItem).data('nav-data');
  if (!itemObject)
    return;

  location.href = itemObject;
};

