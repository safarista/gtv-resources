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
 * @fileoverview Implements the main page for the bestpractices site.
 * @author shines@google.com (Steven Hines)
 */

/**
 * Primary object for the page. Manages transitions between sub-pages and the
 * home menu and provides several common methods used by the pages.
 */
var Main = {};

/**
 * Key controller for the main page.
 * @type {KeyController}
 */
Main.keyController = null;

/**
 * Transitions to a sub-page from the main page.
 * @param {jQuery.Element} item The item describing the page to navigate to,
 *    with the 'url' jQuery data element holding an instance of the destination
 *    page object.
 */
Main.transitionPage = function(item) {
  var main = this;

  var itemObject = $(item).data('url');
  if (!itemObject) {
    return;
  }

  main.keyController.removeAllZones();

  var newItem = item.clone(false);
  var offset = item.offset();
  newItem.removeClass('item-hover-active item-hover item');
  newItem.addClass('item-heading');
  newItem.css({
      'position': 'absolute',
      'top': offset.top + 'px',
      'left': offset.left + 'px'
    });

  $('#wrapper').append(newItem);

  var itemRows = $('.item-row').each(
      function(index) {
        $(this).animate({
            opacity: 0
          },
          function() {
            $(this).remove();
          });
      });

  var newOffset = $("#wrapper").offset();
  newItem.animate({
      'top': newOffset.top + 'px',
      'left': newOffset.left + 'px',
      'font-size': '48pt'
    },
    function() {
      newItem.css({
          'background-color': 'transparent',
          'position': 'relative',
          'top': '0px',
          'left': '0px'
        });

      var itemPage = itemObject;
      itemPage.makePage($('#wrapper'));
    });
};

/**
 * Utility method to create a key handler for a sub-page. This common
 * handler processes the backspace key to return to the home page, and
 * the ESC key to show the Insights display for the page, if any.
 * This method sets the key mapping for the default layer.
 * @param {jQuery.Element} topParent The parent of the page content.
 * @param {string} category The insights category.
 * @param {Function} getItemSelection A function that returns a jQuery.Element
 *     that represents the item on the page to be set as the selected item
 *     for the Insights display.
 * @param {?Function} preDestroyCallback Optional function to call when
 *     backspace is pressed but before the home page is created. Allows the
 *     page to remove key mappings, cleanup, etc, before returning home.
 */
Main.setKeyHandlerForPage = function(topParent,
                                     category,
                                     getItemSelection,
                                     preDestroyCallback) {
  var main = this;

  var inInsights = false;
  var globalKeyMapping = {
    8: function(selectedItem, newSelected) {  // backspace always goes home
      if (preDestroyCallback)
        preDestroyCallback();
      main.keyController.setLayerKeyMapping();
      main.makeHome(false);
      return { status: 'skip' };
    },
    27: function(selectedItem, newSelected, getFinishCallback) {
      if (category) {
        var firstItemFirstPage = getItemSelection();

        main.keyController.setSelected(
            firstItemFirstPage,
            function() {
              main.showInsights(
                  topParent,
                  category,
                  function() {
                  });
            });
      }
      return { status: 'skip' };
    }
  };
  main.keyController.setLayerKeyMapping(globalKeyMapping);
};

/**
 * Retrieves insight data from the server and uses it to create an Insight
 * Control on the page.
 * @param {jQuery.Element} topParent The parent element to contain the Insight
 *     Control.
 * @param {string} category The insight category; used to fetch the right
 *     insight data from the server.
 * @param {Function} finishCallback The callback to make when the Insights
 *     control is dismissed by the user.
 */
Main.showInsights = function(topParent, category, finishCallback) {
  var main = this;

  $.getJSON(
    '/bestpractices/ajax/' + category,
    function(insightData) {
      var descriptionParams = {
        size: {
          width: 400,
          height: 350
        },
        style: 'insight-description-style'
      };

      var controlParams = {
        finishCallback: finishCallback,
        keyController: main.keyController,
        buttonStyle: 'insight-button-style',
        selectedStyle: 'insight-selected',
        coverStyle: 'insight-cover-style',
        descriptionParams: descriptionParams
      };

      var insightControl = new gtv.jq.InsightControl(controlParams);
      insightControl.makeControl(topParent, insightData);
    });
};

/**
 * Utility method to display the hints control for a page.
 * @param {jQuery.Element} topParent The parent element to contain the Hints
 *     Control.
 * @param {Function} finishCallback Callback to make after the hints control
 *     is dismissed.
 */
Main.showHints = function(topParent, finishCallback) {
  var hintsItems = [
    {
      img: 'static/images/arrows.png',
      text: 'Arrow keys move the selection around the page'
    }, {
      img: 'static/images/backspace.png',
      text: 'Backspace returns to the previous page'
    }, {
      img: 'static/images/enter.png',
      text: 'Enter browses to the current selection'
    }, {
      img: 'static/images/esc.png',
      text: 'Esc displays help buttons for design features'
    }
  ];

  var hintsStyles = {
    cover: 'hints-cover-style',
    hints: 'hints-style',
    title: 'hints-title-style',
    img: 'hints-img-style',
    text: 'hints-text-style'
  };

  var hintsParams = {
    hintsItems: hintsItems,
    hintsStyles: hintsStyles,
    finishCallback: finishCallback,
    backAction: function() {
      Main.makeHome(false);
    }
  };
  var hintsControl = new gtv.jq.HintsControl(hintsParams);

  hintsControl.showControl(topParent);
};

/**
 * Displays the home page.
 * @param {boolean} showHints If true, the hints page will be displayed
 *     over the home page.
 */
Main.makeHome = function(showHints) {
  var main = this;

  $('#wrapper').children().remove();

  var container = $('<div></div>').addClass('home-container');
  $('#wrapper').append(container);

  var itemData = [
      ['Row Control', new ScrollingPage()],
      ['Roller Control', new RollingPage()],
      ['Stack Control', new StackPage()],
      ['Slider Control', new SlidingPage()],
      ['Overscan', new OverscanPage() ],
      ['Fonts', new FontsPage() ],
      ['Page Builder', new BuilderPage()],
      ['SideNav Control', new NavigationPage() ],
      ['Playback Navigation', new ScrollNavPage() ],
      ['Video Feeds', new FeedPage() ],
      ['Tutorial', new TutorialPage() ],
      ['Pong', new ParticlePage() ]
  ];

  var length = itemData.length;
  var rowCount = 0;
  var itemRow;
  for (var i = 0; i < length; i++) {
    if (i % 4 == 0) {
      itemRow = $('<div></div>').addClass('item-row');
      container.append(itemRow);
    }

    var item = $('<p></p>')
      .addClass('item')
      .append(itemData[i][0])
      .data("url", itemData[i][1]);

    var itemDiv = $('<div></div>')
      .addClass('item-div')
      .append(item);

    itemRow.append(itemDiv);
  }

  if (showHints) {
    main.showHints(container, function() {
        main.keyControlCallback_();
      });
  } else {
    main.keyControlCallback_();
  }
};

/**
 * Establishes the key controller for the site's main page.
 * @private
 */
Main.keyControlCallback_ = function() {
  var main = this;

  if (!main.keyController) {
    main.keyController = new gtv.jq.KeyController();
  } else {
    main.keyController.removeAllZones();
  }

  var keyMapping = {
    13: function(selectedItem, newSelected) {
      main.transitionPage(selectedItem);
      return { status: 'skip' };
    },
    27: function(selectedItem, newSelected) {
      return { status: 'skip' };
    }
  };
  var navSelectors = {
    item: '.item'
  };
  var selectionClasses = {
    basic: 'item-hover',
    hasData: 'item-hover-active'
  };
  var actions = {
    click: function(selectedItem, newItem) {
      main.transitionPage(selectedItem);
    }
  };
  main.homeBehaviorZone =
      new gtv.jq.KeyBehaviorZone({
        containerSelector: '.home-container',
        keyMapping: keyMapping,
        actions: actions,
        navSelectors: navSelectors,
        selectionClasses: selectionClasses,
        navigableData: 'url',
        useGeometry: true
      });

  main.keyController.addBehaviorZone(main.homeBehaviorZone, true);
  main.keyController.start(main.homeBehaviorZone, true);
}

/**
 * jQuery callback made when the page has been loaded and is ready. This
 * will create an instance of the Main class and build the home page.
 */
$(document).ready(function() {
    Main.makeHome(true);
  });

