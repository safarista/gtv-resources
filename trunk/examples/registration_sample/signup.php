<?php

$name = $_REQUEST['ContactName'];
$email = $_REQUEST['email'];
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$company = $_REQUEST['Company'];
$red = $_REQUEST['redinput'];
$green = $_REQUEST['greeninput'];
$blue = $_REQUEST['blueinput'];

//echo "hello: " . $name . " : " . $email . " : " . $username . " : " . $password . " : " . $company . " : " . $red . " : " . $green . " : " . $blue;

?>

<html>
  <head>
    <meta charset="utf-8">
    <title>Google TV: Demo</title>
    <link rel="stylesheet" href="/closure/demo-theme.css">
    <link rel="stylesheet" href="/closure/container.css">
    <link rel="stylesheet" href="/closure/closure-demo.css">

  </head>
  <body>
   
    <div id="header">
      <div class="center">
        <img alt="Google TV Logo" src="/closure/spotlightgallery-logo.png">
        <h2>Google TV Closure Lib Demo</h2>
      </div>
    </div>

    <ul id="colorstrip">
      <li class="col1"></li>
      <li class="col2"></li>
      <li class="col3"></li>
      <li class="col4"></li>
    </ul>

   
<div id="main" class="tv-container-vertical center">
    <h3>The following info have been submitted.</h3>
    <div>Name: <?php echo $name; ?></div>
    <div>Email: <?php echo $email; ?></div>
    <div>Username: <?php echo $username; ?></div>
    <div>Password: <?php echo $password; ?></div>
    <div>Company: <?php echo $company; ?></div>
    <div>Color preferences:</div>
    <div>
    <ul id="colorstrip">
    <li>RED: <?php echo $red; ?></li>
    <li>GREEN: <?php echo $green; ?></li>
    <li>BLUE: <?php echo $blue; ?></li>
    </ul>
    </div>

</div>

   
  </body>

</html>

