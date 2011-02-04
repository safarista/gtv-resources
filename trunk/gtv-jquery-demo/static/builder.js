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
 * @fileoverview Implements the Feed Builder page for the bestpractices site.
 * 
 */

/**
 * BuilderPage class.
 * @constructor
 */
function BuilderPage() {
}

/**
 * Instance of the photo or video page once created.
 * @type {BuilderVideoPage|BuilderPhotoPage}
 * @private
 */
BuilderPage.prototype.demoPage = null;

/**
 * Creates the content for the builder page and attaches it to the parent
 * element. The builder page presents a UI for customizing a BuilderPhotoPage
 * or BuilderVideoPage class and previewing the results with an actual
 * instance of the page.
 * @param {jQuery.Element} topParent
 */
BuilderPage.prototype.makePage = function(topParent) {
  var builderPage = this;

  var buildData = {};

  builderPage.container = $('<div></div>');
  topParent.append(builderPage.container);

  builderPage.topParent = topParent;

  builderPage.makeMainPage();

  Main.setKeyHandlerForPage(topParent);
};

/**
 * Creates the page customization UI.
 */
BuilderPage.prototype.makeMainPage = function() {
  var builderPage = this;

  var coverDiv = $('<div></div>').addClass('builder-cover-div');
  builderPage.container.append(coverDiv);

  var builderDiv = $('<div></div>').addClass('builder-div');
  builderPage.container.append(builderDiv);

  var feedDiv = $('<div></div>').addClass('builder-feed-div');
  builderDiv.append(feedDiv);

  var feedElem = $('<input type="text" size="80"></input>')
    .addClass('builder-feed')
    .attr('id', 'feed')
    //.val('http://gdata.youtube.com/feeds/api/standardfeeds/top_rated?'
    //     + 'alt=json-in-script');
    .val('http://picasaweb.google.com/data/feed/base/featured?'
        + 'alt=json-in-script&kind=photo&access=public&'
        + 'slabel=featured&hl=en_US');
  feedDiv.append(feedElem);

  var seekerData = [
    {
      id: 'items',
      name: 'Feed',
      val: 'feed,entry'
    } ,
    {
      id: 'thumbs',
      name: 'Thumbnail',
      val: 'media$group,media$thumbnail,0,url'
    },
    {
      id: 'content',
      name: 'Content',
      val: 'media$group,media$content,0,url'
    }
  ];

  var seekerDiv = $('<div></div>').addClass('seeker-div');
  builderDiv.append(seekerDiv);

  function makeRow() {
    var itemRow, itemDiv;

    itemRow = $('<div></div>').addClass('builder-row');
    seekerDiv.append(itemRow);

    itemDiv = $('<div></div>').addClass('builder-item-div');
    itemRow.append(itemDiv);

    return itemDiv;
  }

  for (var i = 0; i < seekerData.length; i++) {
    var itemDiv = makeRow();

    var itemLab = $('<p></p>')
        .addClass('builder-item-label')
        .text(seekerData[i].name);
    itemDiv.append(itemLab);

    var itemElem = $('<input name="seeker" type="text"></input>')
        .addClass('builder-item')
        .val(seekerData[i].val)
        .attr('id', seekerData[i].id);
    itemDiv.append(itemElem);
  }

  var itemDiv = makeRow();
  var widthLab = $('<p></p>').text('Player Width');
  itemDiv.append(widthLab);

  var widthElem = $('<input type="text" size="4"></input>')
    .addClass('builder-item')
    .attr('id', 'width')
    .val('900');
  itemDiv.append(widthElem);


  itemDiv = makeRow();
  var heightLab = $('<p></p>').text('Player Height');
  itemDiv.append(heightLab);

  var heightElem = $('<input type="text" size="4"></input>')
    .addClass('builder-item')
    .attr('id', 'height')
    .val('560');
  itemDiv.append(heightElem);


  itemDiv = makeRow();
  var selectNavbar = $('<select name="navbar"></select>')
    .addClass('builder-item')
    .attr('id', 'navbar');
  itemDiv.append(selectNavbar);

  option = $('<option value="popUp"></option>')
    .text('Pop-up Navbar');
  selectNavbar.append(option);

  option = $('<option value="fade"></option>')
    .text('Fading Navbar');
  selectNavbar.append(option);


  itemDiv = makeRow();
  var thumbLab = $('<p></p>').text('Thumbnail size');
  itemDiv.append(thumbLab);
  thumbLab.css('margin-left', '10%');

  var thumbSize = $('<input type="text" size="4"></input>')
    .addClass('builder-item')
    .attr('id', 'thumbSize')
    .val('100');
  itemDiv.append(thumbSize);

/*  option = $('<option value="html"></option>')
    .text('HTML5 Video');
  select.append(option);*/

  var itemRow = $('<div></div>').addClass('builder-row');
  seekerDiv.append(itemRow);

  itemDiv = $('<div></div>').addClass('builder-item-div')
    .css('float', 'left');
  itemRow.append(itemDiv);
  var select = $('<select name="kind"></select>')
    .addClass('builder-item')
    .attr('id', 'kind');
  itemDiv.append(select);

  var option = $('<option value="photo"></option>')
    .text('Photo Feed');
  select.append(option);

  option = $('<option value="youtube"></option>')
    .text('YouTube Feed');
  select.append(option);


  itemDiv = makeRow();
  var slideshowLab = $('<p></p>').text('Slideshow delay');
  itemDiv.append(slideshowLab);
  slideshowLab.css('margin-left', '10%');

  var slideshow = $('<input type="text" size="2"></input>')
    .addClass('builder-item')
    .attr('id', 'slideshow')
    .val('4');
  itemDiv.append(slideshow);
  var slideshowRow = itemDiv.parent();

  select.bind('change',
              function(e) {
                if (select.val() == 'photo') {
                  slideshowRow.css('display', '');
                } else {
                  slideshowRow.css('display', 'none');
                }
              });


  itemRow = $('<div></div>').addClass('builder-row');
  seekerDiv.append(itemRow);

  itemDiv = $('<div></div>').addClass('builder-item-div')
    .css('width', 'auto')
    .css('float', 'left');
  itemRow.append(itemDiv);
  var makeElem = $('<button href="javascript:void(0);"></button>')
    .addClass('builder-make builder-item')
    .text('Build the Page')
    .click(function(e) { builderPage.clickMakeAction(); });
  itemDiv.append(makeElem);


  itemDiv = $('<div></div>').addClass('builder-item-div')
    .css('width', 'auto')
    .css('float', 'left');
  itemRow.append(itemDiv);
  var showElem = $('<button href="javascript:void(0);"></button>')
    .addClass('builder-make builder-item')
    .text('Show the Code')
    .click(function(e) { builderPage.clickShowCodeAction(); });
  itemDiv.append(showElem);

  var feedDisplayElem = $('<div></div>').addClass('builder-feed-display');
  builderDiv.append(feedDisplayElem);

  var keyMapping = {
    13: function(selectedItem, newSelected) {
      selectedItem.focus();
      return { status: 'skip' };
    }
  };
  var selectionClasses = {
    basic: 'builder-item-hover'
  };

  var navSelectors = {
    item: '.builder-feed'
  };
  builderPage.feedBehaviorZone =
      new gtv.jq.KeyBehaviorZone({
        containerSelector: '.builder-feed-div',
        keyMapping: keyMapping,
        navSelectors: navSelectors,
        selectionClasses: selectionClasses
      });

  Main.keyController.addBehaviorZone(builderPage.feedBehaviorZone, true);

  navSelectors = {
    item: '.builder-item',
    itemParent: '.builder-item-div',
    itemRow: '.builder-row'
  };
  builderPage.seekerBehaviorZone =
      new gtv.jq.KeyBehaviorZone({
        containerSelector: '.seeker-div',
        keyMapping: keyMapping,
        navSelectors: navSelectors,
        selectionClasses: selectionClasses
      });

  Main.keyController.addBehaviorZone(builderPage.seekerBehaviorZone, true);

  var lastFeed;
  builderDiv.find('[name=seeker]').bind(
      'keydown focus change',
      function(e) {
        var newFeed = feedElem.val();
        var seeker = $(this);
        if (newFeed != lastFeed) {
          var feedDisplayElem = $('.builder-feed-display');
          feedDisplayElem.empty();

          var itemElemP = $('<p></p>').text('Loading feed....');
          feedDisplayElem.append(itemElemP);

          $.ajax({ url: newFeed,
                   dataType: 'jsonp',
                   success: function(data) {
                     window.setTimeout(function() {
                                  builderPage.showFeedData(seeker);
                                }, 100);
                     builderPage.feedData = data;
                     lastFeed = newFeed;
                   }
                 });
          window.setTimeout(function() {
                       itemElemP.text('Failed to load feed.');
                     }, 8000);
        } else {
          window.setTimeout(function() {
	               builderPage.showFeedData(seeker);
	             }, 100);
        }
        var row = seekerDiv.find('.builder-row-active');
        row.removeClass('builder-row-active');

        row = seeker.parents('.builder-row');
        row.addClass('builder-row-active');
      });
};

/**
 * Displays the data from feed at the specified level of hierarchy.
 * @param {jQuery.Element} seekerElem The text element on the page with the
 *     path to traverse into the feed data. E.g., 'feed,entry' seeks to
 *     Feed.Entry
 */
BuilderPage.prototype.showFeedData = function(seekerElem) {
  var builderPage = this;

  if (!builderPage.feedData || !seekerElem)
    return;

  if (builderPage.displayBehaviorZone)
    Main.keyController.removeBehaviorZone(builderPage.displayBehaviorZone, true);
  var feedDisplayElem = $('.builder-feed-display');
  feedDisplayElem.empty();

  var itemsElem = $('#items');
  var seeker = itemsElem.val().split(',');

  var dataSeeker;
  if (seekerElem.attr('id') != 'items') {
    dataSeeker = seekerElem.val().split(',');
  }

  function descend(data, seeker)
  {
    for (var i = 0; i < seeker.length; i++) {
      if (seeker[i] !== '') {
        data = data[seeker[i]];
        if (!data)
          return null;
      }
    }
    return data;
  }

  var data = builderPage.feedData;
  var entries;
  if (seeker) {
    data = descend(data, seeker);
    entries = data;
    if (data && dataSeeker != undefined) {
      if (data instanceof Array)
        dataSeeker.unshift(0);

      data = descend(data, dataSeeker);
    }
  }

  if (dataSeeker != undefined && !(entries instanceof Array)) {
    var itemElemP = $('<p></p>').text('Specify feed entries first');
    feedDisplayElem.append(itemElemP);
  } else if (dataSeeker == undefined && entries instanceof Array) {
    builderPage.addFeedDisplayItem('<- back', seekerElem);

    var itemElemP = $('<p></p>').text('Feed entries found');
    feedDisplayElem.append(itemElemP);
  } else if (typeof data != 'string') {
    builderPage.addFeedDisplayItem('<- back', seekerElem);
    $.each(data, function(key, value) {
             builderPage.addFeedDisplayItem(key, seekerElem);
           });
  } else if (data) {
    builderPage.addFeedDisplayItem('<- back', seekerElem);

    var itemElemP = $('<p></p>').text(data);
    feedDisplayElem.append(itemElemP);
  }

  var keyMapping = {
    13: function(selectedItem, newSelected) {
      selectedItem.click();
      return { status: 'skip' };
      }
  };
  var navSelectors = {
    item: '.builder-feed-item',
    itemParent: '.builder-feed-item-div',
    itemRow: '.builder-feed-row'
  };
  var selectionClasses = {
    basic: 'builder-item-hover'
  };
  builderPage.displayBehaviorZone =
      new gtv.jq.KeyBehaviorZone({
        containerSelector: '.builder-feed-display',
        keyMapping: keyMapping,
        navSelectors: navSelectors,
        selectionClasses: selectionClasses
      });

  Main.keyController.addBehaviorZone(builderPage.displayBehaviorZone, true);
};

/**
 * Adds a link element to the feed display div. When clicked this will cause
 * the item to be added to the specified seeker element and the feed display
 * will be regenerated from the new location.
 * @param {string} text The text of the link.
 * @param {jQuery.Element} seekerElem The seeker element of the feed display.
 */
BuilderPage.prototype.addFeedDisplayItem = function(text, seekerElem) {
  var builderPage = this;

  var feedDisplayElem = $('.builder-feed-display');

  var itemElemRow = $('<div></div>').addClass('builder-feed-row');
  feedDisplayElem.append(itemElemRow);

  var itemElemP = $('<p></p>').addClass('builder-feed-item-div');
  itemElemRow.append(itemElemP);

  var itemElem = $('<a href="javascript:void(0);"></a>')
      .addClass('builder-feed-item')
          .click(function(e) {
                   builderPage.clickItemAction($(this), seekerElem);
                 });
  itemElem.text(text);
  itemElemP.append(itemElem);
};

/**
 * Add the text of a feed link to a seeker element. Called when a feed
 * item link element is clicked on.
 * @param {jQuery.Element} item The item clicked on.
 * @param {jQuery.Element} seekerElem The feed seeker to add the item text to.
 */
BuilderPage.prototype.clickItemAction = function(item, seekerElem) {
  var itemVal = item.text();
  var currentVal = seekerElem.val();
  if (itemVal != '<- back') {
    if (currentVal)
      itemVal = currentVal + ',' + itemVal;
  } else {
    var lastComma = currentVal.lastIndexOf(',');
    if (lastComma >= 0) {
      itemVal = currentVal.substring(0, lastComma);
    } else {
      itemVal = '';
    }
  }
  seekerElem.val(itemVal);
  seekerElem.trigger('change');
};

/**
 * Builds a Photo or Video page based on the settings from the builder UI.
 * Called when the user clicks on the Build the Page button.
 */
BuilderPage.prototype.clickMakeAction = function() {
  var builderPage = this;

  if (builderPage.demoPage) {
    builderPage.demoPage.deletePage();
  }

  var buildData = new gtv.jq.BuildParams();

  buildData.keyController = Main.keyController;
  buildData.layerNames = ['demo'];

  buildData.feed = $('#feed').val();
  buildData.feedItemsSeeker = $('#items').val().split(',');
  buildData.feedThumbSeeker = $('#thumbs').val().split(',');
  buildData.feedContentSeeker = $('#content').val().split(',');

  buildData.size =
      new gtv.jq.Size(parseInt($('#width').val()),
                      parseInt($('#height').val()));

  buildData.slideshowSpeed = parseInt($('#slideshow').val());

  buildData.thumbnailSize = parseInt($('#thumbSize').val());

  buildData.navbarType = $('#navbar').val();

  var kind = $('#kind').val();
  if (kind == 'youtube' || kind == 'html5') {
    builderPage.demoPage = new gtv.jq.BuilderVideoPage(buildData);
  } else {
    builderPage.demoPage = new gtv.jq.BuilderPhotoPage(buildData);
  }

  builderPage.demoPage.makePage(builderPage.topParent);

  builderPage.container.css('display', 'none');

  builderPage.addTopNav();
};

/**
 * Display a block of text representing the JS code necessary to create
 * the page created in the preview/Build the Page display.
 */
BuilderPage.prototype.clickShowCodeAction = function() {
  var builderPage = this;

  var coverDiv = $('<div></div>').addClass('builder-code-cover-div');
  builderPage.container.append(coverDiv);

  var builderDiv = $('<div></div>').addClass('builder-code-div');
  builderPage.container.append(builderDiv);

  var buildData = {};
  buildData.feed = $('#feed').val();
  buildData.feedItemsSeeker = $('#items').val().split(',');
  buildData.feedThumbSeeker = $('#thumbs').val().split(',');
  buildData.feedContentSeeker = $('#content').val().split(',');

  buildData.playerWidth = parseInt($('#width').val());
  buildData.playerHeight = parseInt($('#height').val());

  buildData.slideshowSpeed = parseInt($('#slideshow').val());

  buildData.thumbnailSize = parseInt($('#thumbSize').val());

  buildData.navbarType = $('#navbar').val();

  $.ajax({
    url: 'static/builder_code.html',
    success: function(srcCode) {
      for (var key in buildData) {
        srcCode = srcCode.replace('%' + key + '%', buildData[key]);
      }

      var type;
      if (kind == 'youtube' || kind == 'html5') {
        type = 'Video';
      } else {
        type = 'Photo';
      }
      srcCode = srcCode.replace('%type%', type);
      builderDiv.html(srcCode);

      var codeArea = builderDiv.children('textarea');
      codeArea.keydown(function(e) {
        switch (e.keyCode) {
        case 8:  // backspace
        case 13:  // enter
        case 27:  // ESC
          coverDiv.remove();
          builderDiv.remove();
          e.stopPropagation();
        }
      });
      codeArea.focus();
    }
  });
};

/**
 * Creates a top nav menu that overlays over the Builder page preview. The
 * menu allows the user to exit the preview and return to the builder UI.
 */
BuilderPage.prototype.addTopNav = function() {
  var builderPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  builderPage.topParent.append(topNavHolder);

  var navItems = [
    'Make a new page'
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
        choiceCallback(selectedItem);
      },
      layerNames: ['demo']
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
    if (!builderPage.topNavActive) {
      builderPage.topNavActive = true;
      return;
    }

    builderPage.demoPage.deletePage();
    topNavControl.deleteControl();
    builderPage.container.css('display', 'block');
    builderPage.topNavActive = false;

    Main.keyController.setLayer();
  }

  var topNavContainer = topNavHolder.children('#topNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};

