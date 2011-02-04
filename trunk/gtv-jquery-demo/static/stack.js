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
 * @fileoverview Implements the StackControl page for the bestpractices site.
 * 
 */

/**
 * StackPage class displays a page to demonstrate the Stack control.
 * @constructor
 */
function StackPage() {
}

/**
 * Creates the contents for the stack page and adds it to the specified
 * parent element. This page demonstrates a stack control with a set of photos
 * and provides a set of insight buttons that discuss the features being
 * demonstrated.
 * @param {jQuery.Element} topParent The parent element to hold the contents.
 */
StackPage.prototype.makePage = function(topParent) {
  var stackPage = this;
  stackPage.topParent = topParent;

  var container = $('<div></div>');
  stackPage.topParent.append(container);
  stackPage.container = container;
  stackPage.insightsItem = 11;

  var itemCount = 15;
  var itemArray = new Array(itemCount);

  for (var i = 0; i < itemCount; i++) {
    var img = $('<img></img>')
      .attr('src', 'static/images/photo' + i + '.jpg')
      .addClass('stack-photo');
    itemArray[i] = {
      'caption': 'Photo ' + i,
      'item': img
    };
  }

  var styles = {
    title: 'stack-photo-title'
  };

  var stackParams = {
    createParams: {
      containerId: 'stack-container',
      styles: styles,
      keyController: Main.keyController
    },
    height: $(window).height()
  };
  var stackControl = new gtv.jq.StackControl(stackParams);

  var showParams = {
    topParent: container,
    contents: {
      captionItems: itemArray
    }
  };
  stackControl.showControl(showParams);

  Main.setKeyHandlerForPage(
    topParent,
    'stackpage',
    function() {
      return stackPage.container
        .find('.stack-photo-title')
        .eq(stackPage.insightsItem);
    });
};

