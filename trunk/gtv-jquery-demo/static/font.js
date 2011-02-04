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
 * @fileoverview Implements all subpages of the bestpractices demo site except
 *     Pong and Tutorial.
 * 
 */

/**
 * FontsPage class displays a page to demonstrate font sizing at 10 feet.
 * @constructor
 */
function FontsPage() {
}

/**
 * Creates the font demo page and adds it to the parent element specified.
 * This page displays a Rotator control with several different font names as
 * elements, each name in its respective font. When the user chooses a font
 * on the control, a demo div is shown with a text string in various sizes
 * of the font to demonstrate the visibility of the font in a 10-foot UI.
 * Insight buttons explain the various elements of the page and the
 * significance.
 * @param {jQuery.Element} topParent Element to which the content is attached.
 */
FontsPage.prototype.makePage = function(topParent) {
  var fontsPage = this;
  fontsPage.topParent = topParent;

  var cssFontFace;

  var items = new Array();

  cssFontFace =
      $('<p>Reenie Beanie</p>').addClass('font-item font-page-reenie');
  items.push(cssFontFace);

  cssFontFace =
      $('<p>Molengo</p>').addClass('font-item font-page-molengo');
  items.push(cssFontFace);

  cssFontFace =
      $('<p>Philosopher</p>').addClass('font-item font-page-philosopher');
  items.push(cssFontFace);

  cssFontFace = $('<p>Lobster</p>').addClass('font-item font-page-lobster');
  items.push(cssFontFace);

  cssFontFace = $('<p>Neucha</p>').addClass('font-item font-page-neucha');
  items.push(cssFontFace);

  cssFontFace = $('<p>Bonzai</p>').addClass('font-item font-page-font-face');
  items.push(cssFontFace);

  fontsPage.items = items;

  fontsPage.demoDivContainer =
      $('<div></div>').addClass('font-demo-div-container');
  fontsPage.demoDiv = $('<div></div>').addClass('font-demo-div');

  var createParams = {
    containerId: 'rotator-container',
    items: items,
    keyController: Main.keyController,
    choiceCallback: function(item) {
      fontsPage.itemSelected(item);
    }
  };
  var rotatorControl = new gtv.jq.RotatorControl(createParams);

  var showParams = {
    topParent: topParent,
    contents: {
      items: items
    }
  };
  rotatorControl.showControl(showParams);

  topParent.append(fontsPage.demoDivContainer);
  fontsPage.demoDivContainer.append(fontsPage.demoDiv);

  var windowHeight = $(window).height();
  var containerOffset = fontsPage.demoDivContainer.offset();
  var borderWidth = fontsPage.demoDivContainer.outerWidth() -
      fontsPage.demoDivContainer.width();
  fontsPage.demoDivContainer.css('height',
                                 windowHeight - containerOffset.top -
                                 borderWidth + 'px');


  Main.setKeyHandlerForPage(
      topParent,
      'fontspage',
      function() {
        return topParent.find('.font-item').first();
      });
};

/**
 * Displays a demo div of a block of text at various sizes in the font
 * of the item passed in. This is called as a callback from the RotatorControl.
 * @param {jQuery.Element} item The item whose font should be demo'ed.
 */
FontsPage.prototype.itemSelected = function(item) {
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
