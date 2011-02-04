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
 * @fileoverview Classes for InsightControl
 * 
 */

var gtv = gtv || {
  jq: {}
};


/**
 * InsightButtonParams class holds initialization values for InsightButton.
 * @param {gtv.jq.InsightButtonParams} opt_params Optional initial values.
 * @constructor
 */
gtv.jq.InsightButtonParams = function(opt_params) {
  var params = opt_params || {};

  this.text = params.text || '';
  this.left = params.left || 0;
  this.top = params.top || 0;
  this.title = params.title || '';
  this.style = params.style || '';
  this.description = new gtv.jq.InsightDescription(params.description);
  this.uniqueId = params.uniqueId || 0;
};

/**
 * Left offset of the middle of the button.
 * @type {number}
 */
gtv.jq.InsightButtonParams.prototype.left;

/**
 * Top offset of the middle of the button.
 * @type {number}
 */
gtv.jq.InsightButtonParams.prototype.top;

/**
 * Text to place in the button.
 * @type {string}
 */
gtv.jq.InsightButtonParams.prototype.title;

/**
 * Text to place in the description box.
 * @type {string}
 */
gtv.jq.InsightButtonParams.prototype.text;

/**
 * CSS class to use to style the button.
 * @type {string}
 */
gtv.jq.InsightButtonParams.prototype.style;

/**
 * Holds the insight description initialization for the button.
 * @type {gtv.jq.InsightDescription}
 */
gtv.jq.InsightButtonParams.prototype.description;

/**
 * Holds the insight description initialization for the button.
 * @type {number}
 */
gtv.jq.InsightButtonParams.prototype.uniqueId;


/**
 * InsightDescription class. Initialization values for the description box
 * on an InsightButton.
 * @param {gtv.jq.InsightDescription} opt_params Optional initial values.
 * @constructor
 */
gtv.jq.InsightDescription = function(opt_params) {
  var params = opt_params || {};

  this.style = params.style || '';
  params.size = params.size || {};
  this.size = new gtv.jq.Size(params.size.width, params.size.height);
};

/**
 * CSS class to use to style the description box.
 * @type {string}
 */
gtv.jq.InsightDescription.prototype.style;

/**
 * Size of the description box.
 * @type {gtv.jq.Size}
 */
gtv.jq.InsightDescription.prototype.size;


/**
 * InsightButton class. Compound button used by InsightControl.
 * @param {InsightButtonParams} buttonParams Initialiation parameters for the
 *     button control and description box.
 * @constructor
 */
gtv.jq.InsightButton = function(buttonParams) {
  this.params_ = new gtv.jq.InsightButtonParams(buttonParams);
};

/**
 * Finds the unique id from a page element and returns it
 * @param {jQuery.Element} element The element related to the button object.
 */
gtv.jq.InsightButton.getUniqueId = function(element) {
  return element.data('uniqueId');
};

/**
 * Holds the initialization parameters for the button.
 * @type {gtv.jq.InsightButtonParams}
 * @private
 */
gtv.jq.InsightButton.prototype.params_ = null;

/**
 * The container holding all the button elements.
 * @type {jQuery.Element}
 * @private
 */
gtv.jq.InsightButton.prototype.container_ = null;

/**
 * Creates an InsightButton with the specified properties and adds it to
 * the supplied container.
 * @param {jQuery.Element} parent container to add the button to.
 */
gtv.jq.InsightButton.prototype.makeButton = function(parent) {
  var insightButton = this;
  if (!parent) {
    throw new Error('parent element must be supplied');
  }

  var container = $('<div></div>').addClass('insight-button-div');
  parent.append(container);

  var buttonDiv = $('<div></div>')
      .addClass('insight-button ' + insightButton.params_.style);
  if (insightButton.params_.title) {
    buttonDiv.text(insightButton.params_.title);
  }
  if (insightButton.params_.uniqueId != undefined) {
    buttonDiv.data('uniqueId', insightButton.params_.uniqueId);
  }

  container.append(buttonDiv);

  var width = buttonDiv.outerWidth();
  var height = buttonDiv.outerHeight();

  var cx = Math.max(0, insightButton.params_.left - (width / 2));
  var cy = Math.max(0, insightButton.params_.top - (height / 2));

  buttonDiv.css({
    'top': cy + 'px',
    'left': cx + 'px'
  });

  if (insightButton.params_.text) {
    var description = $('<div></div>');
    description.addClass('insight-description insight-description-hide ' +
                        insightButton.params_.description.style);
    description.css({
      'left': insightButton.params_.left + 'px',
      'top': insightButton.params_.top + 'px'
    });
    var textSpan = $('<p></p>').text(insightButton.params_.text);
    description.append(textSpan);
    container.append(description);
  }

  insightButton.container_ = container;
};

/**
 * Displays the description associated with the button.
 * @param {jQuery.Element} buttonContainer the button container to show.
 */
gtv.jq.InsightButton.prototype.showDescription = function() {
  var insightButton = this;

  var description = insightButton.container_.find('.insight-description');
  description.addClass('insight-description-show');

  var descWidth = insightButton.params_.description.size.width;
  var descHeight = insightButton.params_.description.size.height;

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  var button = insightButton.container_.children('.insight-button');
  var itemOffset = button.offset();
  var descTop = itemOffset.top + button.height();
  if (descTop + descHeight > windowHeight) {
    if (itemOffset.left > windowWidth / 2) {
      itemOffset.left -= descWidth;
    } else {
      itemOffset.left += button.outerWidth();
    }
    descTop = windowHeight - descHeight;
  }

  var descLeft = itemOffset.left;
  if (descLeft + descWidth > windowWidth) {
    descLeft = windowWidth - descWidth;
  }
  button.css('z-index', '5003');

  description.css({
    'width': 0 + 'px',
    'height': 0 + 'px',
    'padding': '10px',
    'visibility': 'visible',
    'z-index': '5003'
  });

  var zeroWidth = description.outerWidth();
  var zeroHeight = description.outerHeight();

  description.css({
    '-webkit-transition': 'all 1s ease-in-out',
    'width': (descWidth - zeroWidth) + 'px',
    'height': (descHeight - zeroHeight) + 'px',
    'top': descTop + 'px',
    'left': descLeft + 'px'
  });
};

/**
 * Hides the description for a button.
 * @param {jQuery.Element} buttonContainer button container whose description
 *     is to be hidden.
 */
gtv.jq.InsightButton.prototype.hideDescription = function() {
  var insightButton = this;

  var button = insightButton.container_.children('.insight-button');
  var width = button.outerWidth();
  var height = button.outerHeight();

  button.css('z-index', '5002');
  var buttonOffset = button.offset();

  var description = insightButton.container_.find('.insight-description');
  description.removeClass('insight-description-show');
  description.css({
    '-webkit-transition': 'all 1s ease-in-out',
    'top': (buttonOffset.top + (height / 2)) + 'px',
    'left': (buttonOffset.left + (width / 2)) + 'px',
    'width': 0 + 'px',
    'height': 0 + 'px',
    'visibility': 'hidden',
    'z-index': '5002'
  });
};


/**
 * InsightControlParams class holds initialization values for the Insight
 * control.
 * @constructor
 */
gtv.jq.InsightControlParams = function() {
};

/**
 * The callback to make after the insights control is dismissed by the user.
 * @type Function
 */
gtv.jq.InsightControlParams.prototype.finishCallback = null;

/**
 * The key controller the insight control should use.
 * @type gtv.jq.KeyController
 */
gtv.jq.InsightControlParams.prototype.keyController = null;

/**
 * Style of the insight buttons the control creates. CSS class.
 * @type string
 */
gtv.jq.InsightControlParams.prototype.buttonStyle = null;

/**
 * Style of the button when it is selected by the user. CSS class.
 * @type string
 */
gtv.jq.InsightControlParams.prototype.selectedStyle = null;

/**
 * Style of the div that covers the background while the insight control
 * is displayed. CSS class.
 * @type string
 */
gtv.jq.InsightControlParams.prototype.coverStyle = null;

/**
 * Initialization data for the insight descriptions for the insight buttons.
 * @type InsightDescription
 */
gtv.jq.InsightControlParams.prototype.descriptionParams = null;


/**
 * InsightData class holds data for an individual insight button, with
 * postion, title and description data.
 * @constructor
 */
gtv.jq.InsightData = function() {
};

/**
 * Selector for the insight data. An insight button will appear over every
 * element on the page that matches this selector.
 * @type string
 */
gtv.jq.InsightData.prototype.selector = null;

/**
 * Specifies a relative position for the button over a seleected element.
 * Defaults to top-left. Specify 'right' to have it appear over the top-right,
 * and 'center' to have it appear over the center.
 * @type string
 */
gtv.jq.InsightData.prototype.position = null;

/**
 * The text for the inside of the button. Defaults to '?'.
 * @type string
 */
gtv.jq.InsightData.prototype.title = null;

/**
 * The descriptive text to show in an expanding box when the insight is
 * chosen by the user (with the enter key). If not supplied, no description
 * box will open.
 * @type string
 */
gtv.jq.InsightData.prototype.text = null;


/**
 * InsightControl class. Displays a set of insights over a page of content.
 * @param {InsightControlParams} params Initialization params for the control.
 */
gtv.jq.InsightControl = function(params) {
  params.buttonStyle = params.buttonStyle || '';
  params.selectedStyle = params.selectedStyle || '';
  params.coverStyle = params.coverStyle || '';

  params.descriptionParams.style = params.descriptionParams.style || '';

  this.params_ = params;
};

/**
 * The parent of element of this control on the page.
 * @type jQuery.Element
 * @private
 */
gtv.jq.InsightControl.prototype.topParent_ = null;

/**
 * The semi-opaque DIV created to cover the background while the control
 * is active.
 * @type jQuery.Element
 * @private
 */
gtv.jq.InsightControl.prototype.coverDiv_ = null;

/**
 * The container for the control and its buttons on the page.
 * @type jQuery.Element
 * @private
 */
gtv.jq.InsightControl.prototype.container_ = null;

/**
 * Array of InsightButton objects created by the control.
 * @type Array.<gtv.jq.InsightButton>
 * @private
 */
gtv.jq.InsightControl.prototype.buttons_ = null;

/**
 * Creates an insight control, displaying insight buttons for the data
 * provided.
 * @param {jQuery.Element} topParent container element for the control
 * @param {Array.<InsightData>} insightData array of insights to display.
 */
gtv.jq.InsightControl.prototype.makeControl = function(topParent,
                                                       insightData) {
  var insightControl = this;
  if (!topParent || !insightData) {
    throw new Error('topParent and insightData must be supplied');
  }

  insightControl.topParent_ = topParent;

  insightControl.coverDiv_ = $('<div></div>')
    .addClass('insight-cover-div ' + insightControl.params_.coverStyle);
  insightControl.topParent_.append(insightControl.coverDiv_);

  insightControl.container_ = $('<div></div>')
    .addClass('insight-container');
  topParent.append(insightControl.container_);

  var firstButton = false;
  var buttonWidth = 0;
  var buttonHeight = 0;

  insightControl.buttons_ = [];
  for (var i = 0; i < insightData.length; i++) {
    var controls = insightControl.topParent_.find(insightData[i].selector);
    // A selector may select more than one control, we want an InsightButton
    // to appear over each of them, so create a copy of the button for every
    // control and place it on the page.
    for (var j = 0; j < controls.length; j++) {
      var offset = $(controls[j]).offset();
      if (insightData[i].position) {
        if (insightData[i].position == 'center') {
          offset.left += ($(controls[j]).outerWidth() / 2);
          offset.top += ($(controls[j]).outerHeight() / 2);
        } else if (insightData[i].position == 'right') {
          offset.left += $(controls[j]).outerWidth();
        }
      }

      var buttonTitle = insightData[i].title || '?';

      var buttonParams = {
        description: insightControl.params_.descriptionParams,
        left: offset.left,
        top: offset.top,
        title: buttonTitle,
        text: insightData[i].text,
        style: insightControl.params_.buttonStyle,
        uniqueId: insightControl.buttons_.length
      };
      var insightButton = new gtv.jq.InsightButton(buttonParams);

      insightButton.makeButton(insightControl.container_);
      insightControl.buttons_.push(insightButton);
    }
  }

  var keyMapping = {
    // enter key opens/closes the insight description text.
    13: function(selectedItem, newSelected) {
      insightControl.enterAction_(selectedItem, newSelected);
      return { status: 'none' };
    },
    // ESC key closes the insights display
    27: function(selectedItem, newSelected) {
      insightControl.params_.keyController.removeBehaviorZone(
          insightControl.behaviorZone_);
      insightControl.params_.keyController.deleteLayer('insight');
      insightControl.coverDiv_.remove();
      insightControl.container_.remove();
      if (insightControl.params_.finishCallback) {
        insightControl.params_.finishCallback();
      }
      return { status: 'skip' };
    },
    // Left arrow moves to the previous insight (also wraps around to end).
    37: function(selectedItem, newItem) {
      return insightControl.leftArrowAction_(selectedItem, newItem);
    },
    // Right arrow moves to the next insight (also wraps around to start).
    39: function(selectedItem, newItem) {
      return insightControl.rightArrowAction_(selectedItem, newItem);
    }
  };

  var navSelectors = {
    item: '.insight-button',
    itemParent: '.insight-button-div'
  };

  var selectionClasses = {
    basic: insightControl.params_.selectedStyle
  };

  insightControl.behaviorZone_ =
      new gtv.jq.KeyBehaviorZone({
        containerSelector: '.insight-container',
        keyMapping: keyMapping,
        navSelectors: navSelectors,
        selectionClasses: selectionClasses
      });

  insightControl.zoneLayer_ =
      insightControl.params_.keyController.createLayer('insight', 1);

  insightControl.params_.keyController.addBehaviorZone(
      insightControl.behaviorZone_, true, ['insight']);
};

/**
 * Callback from key controller when user presses the enter key on a button.
 * Use this action to show the description text of the selected button.
 * @param {jQuery.Element} selectedItem currently selected item.
 * @param {jQuery.Element} newSelected unset in this callback.
 * @private
 */
gtv.jq.InsightControl.prototype.enterAction_ = function(selectedItem,
                                                        newSelected) {
  var insightControl = this;

  var uniqueId = gtv.jq.InsightButton.getUniqueId(selectedItem);

  var description =
      insightControl.container_.find('.insight-description-show');

  if (description.length) {
    insightControl.buttons_[uniqueId].hideDescription();
  } else {
    if (selectedItem) {
      insightControl.buttons_[uniqueId].showDescription();
    }
  }
};

/**
 * Callback from key controller when user presses left arrow. Use this to
 * allow insight buttons to "wrap" around from first to last.
 * @param {jQuery.Element} selectedItem currently selected item.
 * @param {jQuery.Element} newSelected newly selected item; if null, wrap.
 * @return {gtv.jq.Selection} The new item to have the selection.
 * @private
 */
gtv.jq.InsightControl.prototype.leftArrowAction_ = function(selectedItem,
                                                            newSelected) {
  var insightControl = this;

  var description = insightControl.container_.find('.insight-description-show');
  if (description.length) {
    var uniqueId = gtv.jq.InsightButton.getUniqueId(selectedItem);
    insightControl.buttons_[uniqueId].hideDescription();
  }

  if (!newSelected || newSelected.length == 0) {
    var lastButtonDiv =
      insightControl.container_.children('.insight-button-div').last();
    newSelected = lastButtonDiv.children('.insight-button');
  }

  return new gtv.jq.Selection('selected', newSelected);
};

/**
 * Callback from key controller when user presses right arrow. Use this to
 * allow insight buttons to "wrap" around from last to first.
 * @param {jQuery.Element} selectedItem currently selected item.
 * @param {jQuery.Element} newSelected newly selected item; if null, wrap.
 * @return {gtv.jq.Selection} The new item to have the selection.
 * @private
 */
gtv.jq.InsightControl.prototype.rightArrowAction_ = function(selectedItem,
                                                            newSelected) {
  var insightControl = this;

  var description = insightControl.container_.find('.insight-description-show');
  if (description.length) {
    var uniqueId = gtv.jq.InsightButton.getUniqueId(selectedItem);
    insightControl.buttons_[uniqueId].hideDescription();
  }

  if (!newSelected || newSelected.length == 0) {
    var firstButtonDiv =
      insightControl.container_.children('.insight-button-div').first();
    newSelected = firstButtonDiv.children('.insight-button');
  }

  return new gtv.jq.Selection('selected', newSelected);
};
