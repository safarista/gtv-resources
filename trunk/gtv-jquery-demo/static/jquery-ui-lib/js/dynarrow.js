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
 * @fileoverview Class for ArrowControl
 * 
 */

var gtv = gtv || {
  jq: {}
};


/**
 * ArrowControl class.
 * @constructor
 */
gtv.jq.ArrowControl = function() {
};

/**
 * Creates an arrow control, which is a compound control of 3 divs rotated
 * and offset to look like an arrow with a 45 deg angle tip.
 * @param {jQuery.Element} topParent The container to add the arrow to.
 * @param {string} arrowLineStyle CSS class to style the arrow.
 * @return {jQuery.Element} the container holding the arrow elements.
 */
gtv.jq.ArrowControl.prototype.makeControl = function(topParent,
                                                     arrowLineStyle) {
  var arrowControl = this;

  arrowLineStyle = arrowLineStyle || '';

  arrowControl.topParent = topParent;

  var container = $('<div></div>').addClass('dynarrow-container');

  var primary = $('<div></div>').addClass(arrowLineStyle + ' dynarrow-main');
  var tipA = $('<div></div>').addClass(arrowLineStyle + ' dynarrow-tip-a');
  var tipB = $('<div></div>').addClass(arrowLineStyle + ' dynarrow-tip-b');

  container.append(tipA);
  container.append(tipB);
  container.append(primary);

  topParent.append(container);

  var lineHeight = primary.height();
  primary.css('top', (-lineHeight / 2) + 'px');

  tipA.css('top', (-Math.floor(3 * lineHeight) / 4) + 'px');
  tipB.css('top', (-Math.ceil(lineHeight / 4)) + 'px');


  return container;
};
