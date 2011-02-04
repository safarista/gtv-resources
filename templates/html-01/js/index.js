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
 * @fileoverview Classes for Template Page
 *
 * 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * TemplatePage class holds all the support for the page to work
 * and interact with javascript controls.
 * @constructor
 */
gtv.jq.TemplatePage = function() {
};

/**
 * Creates the main menu control.
 */
gtv.jq.TemplatePage.prototype.makeSideNav = function() {
  var templatePage = this;

  var styles = {
    item: 'menu-option',
    itemDiv: 'menu-option',
    row: 'menu-row',
    chosen: 'menu-option-active',
    normal: 'menu-option-off',
    selected: 'menu-option-highlighted'
  };
  var navItems = [];

  if (!templatePage.data.categories) {
    return;
  }

  for (var i=0; i<templatePage.data.categories.length; i++) {
    navItems.push(templatePage.data.categories[i].name);
  }

  var behaviors = {
    orientation: 'vertical',
    selectOnInit: true
  };

  var sidenavParms = {
    createParams: {
      containerId: 'side-nav-container',
      styles: styles,
      keyController: templatePage.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      }
    },
    behaviors: behaviors
  };

  templatePage.sideNavControl = new gtv.jq.SideNavControl(sidenavParms);

  var showParams = {
    topParent: $('#mainMenu'),
    contents: {
      items: navItems
    }
  };

  templatePage.sideNavControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    templatePage.makeGrid(selectedItem.data('index'));
  }
};

/**
 * Creates the grid control for the selected menu option.
 * @parm {number} selected menu option index.
 */
gtv.jq.TemplatePage.prototype.makeGrid = function( index) {
  var templatePage = this;

  var gridHolder = templatePage.gridHolder;
  if (!gridHolder) {
    gridHolder = $('#grid');
    templatePage.gridHolder = gridHolder;
  } else {
    if (templatePage.gridControl) {
      templatePage.gridControl.deleteControl();
    }
  }

  var styleClasses = {
    page: 'grid-page',
    row: 'grid-row-style',
    itemDiv: 'grid-div',
    item: '',
    description: 'grid-item-description',
    chosen: 'grid-item-active',
    normal: 'grid-item-off',
    selected: 'grid-item-highlighted'
  };

  var category = templatePage.data.categories[index];

  if (!category.items || category.items.length == 0) {
    return;
  }

  var pageItems = [];

  for (var i=0; i<category.items.length; i++) {
    var catItem = category.items[i];

    var img = $('<img></img>')
        .attr('src', catItem.image)
        .addClass('slider-photo');

    var descDiv = $('<div></div>').addClass('slider-text-desc');
    descDiv.append($('<h1></h1>').append(catItem.title));

    if (catItem.description && catItem.description.length > 0) {
      for (var j=0; j<catItem.description.length; j++) {
        descDiv.append($('<p></p>').append(catItem.description[j]));
      }
    }

    pageItems.push({ content: img, description: descDiv, data:[index, i]});
  }

  var behaviors = {
    itemsPerRow: 3,
    rowsPerPage: 3
  };

  var gridParms = {
    createParams: {
      containerId: 'grid-control-container',
      styles: styleClasses,
      keyController: templatePage.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      }
    },
    behaviors: behaviors
  };

  templatePage.gridControl = new gtv.jq.GridControl(gridParms);

  var showParams = {
    topParent: templatePage.gridHolder,
    items: pageItems
  };

  templatePage.gridControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    var data = selectedItem.data('nav-data');
    location.assign('fullscreen.html?category=' + data[0] + '&item=' + data[1]);
  }
};

/**
 * Zooms the page to fit the screen.
 */
gtv.jq.TemplatePage.prototype.doPageZoom = function() {
  var templatePage = this;

  $(document.body).css('zoom', $(window).width()/1205);
};

/**
 * Starts the template page.
 */
gtv.jq.TemplatePage.prototype.start = function() {
  var templatePage = this;

  templatePage.keyController = new gtv.jq.KeyController();

  templatePage.doPageZoom();

  templatePage.dataProvider = new gtv.jq.DataProvider();
  templatePage.data = templatePage.dataProvider.getData();

  templatePage.makeSideNav();

  $(document.body).css('visibility', '');

  templatePage.keyController.start(null, true);
};

new gtv.jq.TemplatePage().start();
