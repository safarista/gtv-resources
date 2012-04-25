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
 * @fileoverview Classes for DataProvider
 *
 * 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * DataProvider class. Defines a provider for all data (Categories, Images & Videos) shown in the template.
 */
gtv.jq.DataProvider = function() {
};

/**
 * AJAX call needs to return a JSON
 * {object} with the following structure:
 *    - categories -> [category1, category2, ..., categoryN].
 *    - category -> {name, videos}.
 *    - videos -> {thumb, title, subtitle, description, sources}
 *    - sources -> [source1, source2, ..., sourceN]
 *    - source -> string with the url | {src, type, codecs}
 */
gtv.jq.DataProvider.prototype.getData = function(processVideos) {


  function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

  function getThumbId(small) {
    var num = getRandom(15);
    if (num == 0) {
      num = 1;
    }
    if (num < 10) {
      num = '0' + num;
    }
    return num.toString();
  }

/**
 * AJAX calling to fetch json data for videos
*/

  $.getJSON('/gtv/videosources.php', function(data) {
    processVideos(data);
  });
};

