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
 * @fileoverview Implements the Video Feed page for the bestpractices site.
 * 
 */

/**
 * FeedPage class displays a page to demonstrate the BuilderVideoPage.
 * @constructor
 */
function FeedPage() {
}

/**
 * Creates the builder video page and adds it to the specified parent element.
 * The page pulls videos from the top_rated YouTube feed and displays the
 * thumbnail in a pop-up navbar.
 * @param {jQuery.Element} topParent The parent element to add video page
 *     content to.
 */
FeedPage.prototype.makePage = function(topParent) {
  var feedPage = this;
  feedPage.topParent = topParent;

  var buildData = {
    keyController: Main.keyController,
    feed: 'http://gdata.youtube.com/feeds/api/standardfeeds/top_rated' +
        '?alt=json-in-script',
    feedItemsSeeker: ['feed','entry'],
    feedThumbSeeker: ['media$group','media$thumbnail','0','url'],
    feedContentSeeker: ['media$group','media$content','0','url'],
    size: {
      width: 900
    },
    thumbnailSize: 150,
    navbarType: 'popUp'
  };

  var page = new gtv.jq.BuilderVideoPage(buildData);

  page.makePage(topParent);
};

