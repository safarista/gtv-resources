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
 * @fileoverview Classes for HintsControl
 * 
 */

var gtv = gtv || {
  jq: {}
};


/**
 * Initialization parameters for the MotionText control.
 * @param {gtv.jq.MotionTextParams} opt_params Optional initial values
 * @constructor
 */
gtv.jq.MotionTextParams = function(opt_params) {
  var params = opt_params || {};

  this.text = params.text || '';
  this.offsetLeft = params.offsetLeft || 0;
  this.offsetTop = params.offsetTop || 0;
};

/**
 * The text to display in motion.
 * @type string
 */
gtv.jq.MotionTextParams.prototype.text;

/**
 * The left offset of the control on the page, in pixels. Defaults to 0.
 * @type number
 */
gtv.jq.MotionTextParams.prototype.offsetLeft;

/**
 * The top offset of the control on the page, in pixels. Defaults to 0.
 * @type number
 */
gtv.jq.MotionTextParams.prototype.offsetTop;


/**
 * MotionText class. Displays a string of text with each letter animated.
 * @param {MotionTextParams} params Initialization parameters for the control.
 * @constructor
 */
gtv.jq.MotionText = function(params) {
  this.params_ = new gtv.jq.MotionTextParams(params);
};

/**
 * Holds the parameters for the control.
 * @type MotionTextParams
 * @private
 */
gtv.jq.MotionText.prototype.params_ = null;

/**
 * The line with the text in it as individual charaters
 * @type jQuery.Element
 * @private
 */
gtv.jq.MotionText.prototype.line_ = null;

/**
 * Creates the control to display a text string. The control is positioned
 * at the the specified offset (relative to the document).
 * @return {jQuery.Element} the control's container element
 */
gtv.jq.MotionText.prototype.showControl = function() {
  this.line_ = $('<p></p>');

  for (var i = 0; i < this.params_.text.length; i++) {
    var letter = $('<span></span>').addClass('motion-letter');
    letter.text(this.params_.text.charAt(i));
    this.line_.append(letter);
  }

  return this.line_;
};

/**
 * Displays the text string and begins its animation.
 */
gtv.jq.MotionText.prototype.animate = function() {
  var motionText = this;

  var letters = motionText.line_.children('.motion-letter');
  var letterHeight = letters.first().height();

  var lettersWidth = 0;
  letters.each(function() {
    lettersWidth += $(this).outerWidth();
  });

  letters.each(function(index) {
    var letterOffset = $(this).offset();
    var lineOffset = motionText.line_.offset();
    letterOffset.left -= lineOffset.left;
    $(this).css({
      'left': letterOffset.left + motionText.params_.offsetLeft
          - lettersWidth / 2,
      'top': motionText.params_.offsetTop - letterHeight / 2,
      '-webkit-animation-delay': (index / 5.0) + 's'
    });
  });

  letters.addClass('motion-letter-animate');
};


/**
 * LoadingControlParams class holds initialization values for the
 * LoadingControl.
 * @param {gtv.jq.LoadingControlParams} opt_params Optional initial values.
 * @constructor
 */
gtv.jq.LoadingControlParams = function(opt_params) {
  var params = opt_params || {};

  this.finishedCallback = params.finishedCallback ||
    function() {
    };
  this.triggerEvent = params.triggerEvent || '';
};

/**
 * The callback to make when loading of resources has completed. Optional.
 * Note that the control is removed from topParent before this is called.
 * @type Function
 */
gtv.jq.LoadingControlParams.prototype.finishedCallback;

/**
 * A trigger event to wait for, in addition to 'load', that will trigger
 * the control to exit. Optional. Use this to provide an alternate way to signal
 * the control to terminate.
 * @type string
 */
gtv.jq.LoadingControlParams.prototype.triggerEvent;

/**
 * LoadingControl class. Displays an animated loading string while images
 * are loading on the page.
 * @param {LoadingControlParams} params The initialization values.
 * @constructor
 */
gtv.jq.LoadingControl = function(params) {
  this.params_ = new gtv.jq.LoadingControlParams(params);
};

/**
 * Holds the parameters that define the control.
 * @type LoadingControlParams
 * @private
 */
gtv.jq.LoadingControl.prototype.params_ = null;

/**
 * The partially opaque element that covers the page while loading displayed.
 * @type jQuery.Element
 * @private
 */
gtv.jq.LoadingControl.prototype.coverDiv_ = null;

/**
 * The parent element that holds the loading control.
 * @type jQuery.Element
 * @private
 */
gtv.jq.LoadingControl.prototype.topParent_ = null;

/**
 * The container that holds the page elements of the control.
 * @type jQuery.Element
 * @private
 */
gtv.jq.LoadingControl.prototype.container_ = null;

/**
 * Creates the loading control and adds it to the specified container.
 * The control will display until all images on the page have finished loading,
 * at which point it will make a callback if supplied.
 * @param {jQuery.Element} topParent the container to which the control is to
 *     be added
 * @return {boolean} True on success.
 */
gtv.jq.LoadingControl.prototype.showControl = function(topParent) {
  var loadingControl = this;

  loadingControl.topParent_ = topParent;

  loadingControl.coverDiv_ = $('<div></div>').addClass('loading-cover-div');
  loadingControl.topParent_.append(loadingControl.coverDiv_);

  loadingControl.container_ = $('<div></div>').addClass('loading-div');
  loadingControl.topParent_.append(loadingControl.container_);

  setTimeout(showLoadingText, 500);

  loadingControl.params_.triggerEvent =
      loadingControl.params_.triggerEvent || '';

  loadingControl.container_.bind(
      'load ' + loadingControl.params_.triggerEvent,
      function(e) {
        loadingControl.topParent_ = null;
        loadingControl.container_.remove();
        loadingControl.coverDiv_.remove();
        if (loadingControl.params_.finishedCallback) {
          loadingControl.params_.finishedCallback();
        }
      });

  var images = $('img');
  gtv.jq.GtvCore.triggerOnLoad(loadingControl.container_, images);

  function showLoadingText() {
    if (!loadingControl.topParent_) {
      return;
    }
    var motionText = new gtv.jq.MotionText({
        text: 'Loading...',
        offsetLeft: $(window).width() / 2,
        offsetTop: $(window).height() / 2
      });
    var loadingBlock = motionText.showControl();

    loadingBlock.children().css('z-index', '6001');

    loadingControl.container_.append(loadingBlock);

    motionText.animate();
  }
};


/**
 * HintsParams class holds values for initializing a HintsControl.
 * @param {gtv.jq.HintsParams} opt_params Optional initial values.
 * @constructor
 */
gtv.jq.HintsParams = function(opt_params) {
  var params = opt_params || {};

  this.hintsItems = params.hintsItems || [];
  this.hintsStyles = new gtv.jq.HintsStyles(params.hintsStyles);
  this.finishCallback = params.finishCallback ||
    function() {
    };
  this.backAction = params.backAction ||
    function() {
    };
};

/**
 * CreationParams for the hints control.
 * @type {Array.<gtv.jq.HintsItem>}
 */
gtv.jq.HintsParams.prototype.hintsItems;

/**
 * CreationParams for the hints control.
 * @type {gtv.jq.HintsStyles}
 */
gtv.jq.HintsParams.prototype.hintsStyles;

/**
 * Callback to make when hints control is dismissed by the user.
 * @type {Function}
 */
gtv.jq.HintsParams.prototype.finishCallback;

/**
 * Callback to make when user presses backspace key to return to previous page.
 * @type {Function}
 */
gtv.jq.HintsParams.prototype.backAction;


/**
 * HintsStyles class holds values for setting CSS classes for a HintsControl.
 * @param {gtv.jq.HintsStyles} opt_params Optional initial values.
 * @constructor
 */
gtv.jq.HintsStyles = function(opt_params) {
  var params = opt_params || {};

  this.title = params.title || '';
  this.cover = params.cover || '';
  this.hints = params.hints || '';
  this.img = params.img || '';
  this.text = params.text || '';
};

/**
 * The CSS class to style the title text
 * @type {string}
 */
gtv.jq.HintsStyles.prototype.title;

/**
 * The CSS class to style the div covering the background
 * @type {string}
 */
gtv.jq.HintsStyles.prototype.cover;

/**
 * The CSS class to style the hints DIV
 * @type {string}
 */
gtv.jq.HintsStyles.prototype.hints;

/**
 * The CSS class to style the key images
 * @type {string}
 */
gtv.jq.HintsStyles.prototype.img;

/**
 * The CSS class to style the key descriptive text
 * @type {string}
 */
gtv.jq.HintsStyles.prototype.text;


/**
 * HintsItem class that holds hint images and descriptions for each key hint.
 * @constructor
 */
gtv.jq.HintsItem = function() {
};

/**
 * The src URL to an image of a keyboard key for a hint.
 * @type {string}
 */
gtv.jq.HintsItem.prototype.img = null;

/**
 * The text to describe the usage of a key/keys placed next to a key image.
 * @type {string}
 */
gtv.jq.HintsItem.prototype.text = null;


/**
 * HintsControl class. Displays a semi-opaque box on the page showing key
 * navigation hints for the page.
 * @param {gtv.jq.HintsParams} hintsParams
 * @constructor
 */
gtv.jq.HintsControl = function(hintsParams) {
  this.params_ = hintsParams;
};

/**
 * Creates the hints control and adds it to the specified container.
 * @param {jQuery.Element} container the container to add the hints control to.
 */
gtv.jq.HintsControl.prototype.showControl = function(container) {
  var hintsControl = this;

  var coverDiv = $('<div></div>')
    .addClass('hints-cover-div ' + hintsControl.params_.hintsStyles.cover);
  var hintsDiv = $('<div></div>')
    .addClass('hints-div ' + hintsControl.params_.hintsStyles.hints);

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  container.append(coverDiv);
  container.append(hintsDiv);

  var hints = $('<p></p>')
    .addClass('hints-title ' + hintsControl.params_.hintsStyles.title);
  hints.text('Navigation Hints');
  hintsDiv.append(hints);

  for (var i = 0; i < hintsControl.params_.hintsItems.length; i++) {
    var itemDiv = $('<div></div');
    var itemImg = $('<img></img>')
      .addClass('hints-img ' + hintsControl.params_.hintsStyles.img)
      .attr('src', hintsControl.params_.hintsItems[i].img);
    var itemHint = $('<span></span>')
      .addClass('hints-text ' + hintsControl.params_.hintsStyles.text)
      .text(hintsControl.params_.hintsItems[i].text);
    itemDiv.append(itemImg);
    itemDiv.append(itemHint);
    hintsDiv.append(itemDiv);
  }

  function positionHints() {
    var hintsHeight = hintsDiv.height();
    hintsDiv.css({
      'visibility': 'visible'
    });
    hintsDiv.css({
      'left': (windowWidth / 2) - (hintsDiv.width() / 2),
      'top': (windowHeight / 4 )
    });
  }

  var loadingControl = new gtv.jq.LoadingControl({
    finishedCallback: positionHints
  });

  loadingControl.showControl(container);

  $(document).bind('keydown.hints',
      function(e) {
        switch(e.keyCode) {
          case 8:  // backspace
          case 220:  // backslash
            e.preventDefault();
            coverDiv.remove();
            hintsDiv.remove();
            $(document).unbind('.hints');
            if (hintsControl.params_.backAction)
              hintsControl.params_.backAction();
            break;
          case 13:  // enter
            coverDiv.remove();
            hintsDiv.remove();
            $(document).unbind('.hints');
            if (hintsControl.params_.finishCallback)
              hintsControl.params_.finishCallback();
            break;
        }
      });
};

