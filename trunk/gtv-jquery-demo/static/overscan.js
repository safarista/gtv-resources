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
 * @fileoverview Implements the Overscan sub page of the bestpractices site.
 * 
 */

/**
 * OverscanPage class displays a page to demonstrate overscan issues on GTV.
 * @constructor
 */
function OverscanPage() {
}

/**
 * Creates the overscan page demo content and attaches it to the supplied
 * element. This page displays two DIV containers, one sized to a fixed
 * resolution and the other set to the GTV window size. A measurement
 * arrow is drawn in each, showing that the top, absolutely sized DIV clips
 * content on some TVs. Insight buttons discuss the significance of various
 * parts of the page.
 * @param {jQuery.Element} topParent The element to attach the demo content to.
 */
OverscanPage.prototype.makePage = function(topParent) {
  var overscanPage = this;

  overscanPage.topParent = topParent;

  var container = $('<div></div>').addClass('overscan-container');
  overscanPage.topParent.append(container);
  overscanPage.measTextSpaceFactor = 1.2;

  var screenWidth = screen.width;
  var screenHeight = screen.height;
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var windowSize = $('<p></p>').addClass('overscan-size');

  container.append(windowSize);

  windowSize.text('Window dimensions: ' + windowWidth + 'x' + windowHeight);

  overscanPage.makeRow(container, 'abs');
  overscanPage.makeRow(container, 'pct');

  Main.showHints(
    topParent,
    function() {
      var navSelectors = {
        item: '.overscan-row'
      };
      overscanPage.behaviorZone =
          new gtv.jq.KeyBehaviorZone({
            containerSelector: '.overscan-container',
            navSelectors: navSelectors
          });

      Main.keyController.addBehaviorZone(overscanPage.behaviorZone, true);

      Main.setKeyHandlerForPage(
        topParent,
        'overscanpage',
        function() {
          return null;
        });

      window.setTimeout(function() {
          overscanPage.animatePage(container);
        },
        500);
    });
};

/**
 * Creates a row across the page with arrows placed at the left and right ends.
 * @param {jQuery.Element} container Container to which the row will be added.
 * @param {string} classType The type of row being created, used as a segment
 *     in the CSS class name for the row.
 * @private
 */
OverscanPage.prototype.makeRow = function(container, classType) {
  var overscanPage = this;

  var row =
      $('<div></div').addClass('overscan-row overscan-' + classType + '-row');
  for (var i = 0; i < 3; i++) {
    var div = $('<div></div>').addClass('overscan-' + classType + '-div');
    row.append(div);
  }
  container.append(row);
  var rowOffset = $(row).offset();
  row.css({
      left: '0px'
    });

  var rowWidth = $(row).width();
  var arrowWidth = (rowWidth / 2) / overscanPage.measTextSpaceFactor;

  var arrow = new gtv.jq.ArrowControl();
  var arrowDiv = arrow.makeControl(row, 'overscan-arrow-line');
  arrowDiv.addClass('arrow-left');
  arrowDiv.css({
      top: '50%',
      left: arrowWidth + 'px'
    });

  arrow = new gtv.jq.ArrowControl();
  arrowDiv = arrow.makeControl(row, 'overscan-arrow-line');
  arrowDiv.addClass('arrow-right');
  arrowDiv.css({
      top: '50%',
      left: rowWidth - arrowWidth + 'px'
    });

  var measurement = $('<p></p>').addClass('overscan-arrow-text');
  row.append(measurement);
}

/**
 * Animates the contents of the overscan page. Starts the absolute and
 * relative arrows in motion, and starts calling a callback to update
 * the arrow size text display for each arrow. Called as a callback from
 * a timer started in makePage.
 * @param {Element} container The container holding the page contents.
 */
OverscanPage.prototype.animatePage = function(container) {
  var overscanPage = this;

  var rows = $(container).find('.overscan-row');

  for (var i = 0; i < rows.length; i++) {
    var row = $(rows).eq(i);
    var arrowDiv;

    var rowWidth = $(row).width();
    var arrowWidth =
        Math.ceil((rowWidth / 2) / overscanPage.measTextSpaceFactor);

    arrowDiv = $(row).children('.arrow-left');
    arrowDiv.css({
        '-webkit-transition': 'all 3s ease-in-out',
        'left': '0px',
        'width': arrowWidth + 'px'
      });

    arrowDiv = $(row).children('.arrow-right');
    arrowDiv.css({
        '-webkit-transition': 'all 3s ease-in-out',
        'width': arrowWidth + 'px'
      });

    window.setTimeout((function(updateRow) {
        overscanPage.updateSize(updateRow);
      })(row),
      10);
  }
};

/**
 * Measures the distance between two arrow tips and displays the number between
 *     the arrow tails. Called as a timeout callback.
 * @param {jQuery.Element} updateRow The row to update with the new size.
 */
OverscanPage.prototype.updateSize = function(updateRow) {
  var overscanPage = this;

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
  measurement.css({
      left: rowWidth / 2 - measWidth / 2,
      top: rowHeight / 2 - measHeight / 2
    });

  if (size < rowWidth) {
    window.setTimeout(function() {
        overscanPage.updateSize(updateRow);
      },
      10);
  }
}
