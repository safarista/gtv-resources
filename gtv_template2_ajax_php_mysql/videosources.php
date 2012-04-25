<?php
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


require_once("db.php");

require_once 'Zend/Json.php';

$category_collection = array();
$videos = array();

//$q = "SELECT * FROM videos ORDER BY category_id";
$q = "SELECT * FROM videos, categories WHERE videos.category_id = categories.id ORDER BY category_id";
$results = $db->get_results($q);

$catid = 0;
$first = 1;
foreach( $results as $r ) {
    if( $catid != $r->category_id ) {
        if( $first == 0 ) {
          $category["videos"] = $videos;
          array_push($category_collection, $category);
        }
        $category = array("name" => $r->name);
        $first = 0;
        //reset videos 
        $catid = $r->category_id;
        $videos = array();
    }
    $i = array("sources" => array($r->video_url),
      "thumb" =>  $r->thumbnail_url,
      "title" =>  $r->title,
      "subtitle" => $r->subtitle,
      "description" =>  $r->description);
    array_push($videos, $i);
}

        $category = array("name" => $r->name, "videos" => $videos);
        array_push($category_collection, $category);

$output = array("categories" => $category_collection);

if( isset($_REQUEST['debug']) ) {
  echo "<pre>" . print_r($output, true) . "</pre>";
}
else {
  echo  Zend_Json::encode($output);
}


?>
