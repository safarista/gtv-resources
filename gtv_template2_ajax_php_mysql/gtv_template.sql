-- CREATE DATABASE gtv;
-- GRANT ALL ON gtv.* TO 'my_user'@'localhost' IDENTIFIED BY 'my_password';

-- DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL default '',
  `name` varchar(50) default NULL,
  `ts` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- DROP TABLE IF EXISTS `videos`;
CREATE TABLE `videos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` varchar(50) NOT NULL default '',
  `title` varchar(50) default NULL,
  `subtitle` varchar(50) default NULL,
  `description` varchar(200) default NULL,
  `thumbnail_url` varchar(100) default NULL,
  `video_url` varchar(200) default NULL,
  `ts` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- Add categories:
--    'Dev Events',
--    'Technology',
--    'Conferences',
--    'Keynotes',
--    'Talks',
--    'Events'

INSERT INTO `categories` (`id`, `name`) VALUES ('1','Dev Events');
INSERT INTO `categories` (`id`, `name`) VALUES ('2','Technology');
INSERT INTO `categories` (`id`, `name`) VALUES ('3','Conferences');
INSERT INTO `categories` (`id`, `name`) VALUES ('4','Keynotes');
INSERT INTO `categories` (`id`, `name`) VALUES ('5','Talks');
INSERT INTO `categories` (`id`, `name`) VALUES ('6','Events');


-- Add videos:

INSERT INTO `videos` VALUES (
NULL,
'1',
'2010 Day 1 Keynote',
'Dev Events',
'IO2010 Keynote',
'images/thumbs/thumb01.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'2010 Day 2 Keynote',
'Dev Events',
'IO2010 Keynote Android',
'images/thumbs/thumb02.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day2-android.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'2009 Day 1 Keynote',
'Dev Events',
'IO2009 Keynote',
'images/thumbs/thumb03.jpg',
'Moscone Center'
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2009-Keynote-day1.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'1',
'2010 Highlights',
'Dev Events',
'Google Developer Day',
'images/thumbs/thumb04.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-Highlights.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'1',
'2010 Keynote',
'Dev Events',
'Brazil',
'images/thumbs/thumb05.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-BR-Keynote.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'1',
'Using Google Chrome Frame',
'Dev Events',
'Alex Russell',
'images/thumbs/thumb06.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/ChromeFrame.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'1',
'Uploading your App',
'Dev Events',
'CWS HowTo',
'images/thumbs/thumb07.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-HowTo.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'1',
'Getting Started with Apps for the Chrome Web Store',
'Dev Events',
'Arne Roomann-Kurrik',
'images/thumbs/thumb08.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-GettingStarted.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'Campfire Part 1',
'Dev Events',
'CF1 AppsMarketplace Part1',
'images/thumbs/thumb09.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'Campfire Part 2',
'Dev Events',
'CF1 AppsMarketplace Part2',
'images/thumbs/thumb10.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part2.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'Campfire Part 3',
'Dev Events',
'CF1 AppsMarketplace Part3',
'images/thumbs/thumb11.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part3.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'Campfire Part 4',
'Dev Events',
'CF1 AppsMarketplace Part4',
'images/thumbs/thumb12.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part4.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'Campfire Part 5',
'Dev Events',
'CF1 AppsMarketplace Part5',
'images/thumbs/thumb13.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part5.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'1',
'Campfire Part 6',
'Dev Events',
'CF1 AppsMarketplace Part6',
'images/thumbs/thumb14.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part6.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Google Chrome Extensions and Accessibility',
'Technology',
'Rachel Shearer',
'images/thumbs/thumb01.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/Chrome-Accessibility.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'2010 Day 2 Keynote',
'Technology',
'IO2010 Keynote Android',
'images/thumbs/thumb02.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day2-android.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'2009 Day 1 Keynote',
'Technology',
'IO2009 Keynote',
'images/thumbs/thumb03.jpg',
'Moscone Center'
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2009-Keynote-day1.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'2',
'2010 Highlights',
'Technology',
'Google Developer Day',
'images/thumbs/thumb04.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-Highlights.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'2',
'2010 Keynote',
'Technology',
'Brazil',
'images/thumbs/thumb05.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-BR-Keynote.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'2',
'Using Google Chrome Frame',
'Technology',
'Alex Russell',
'images/thumbs/thumb06.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/ChromeFrame.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'2',
'Uploading your App',
'Technology',
'CWS HowTo',
'images/thumbs/thumb07.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-HowTo.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'2',
'Getting Started with Apps for the Chrome Web Store',
'Technology',
'Arne Roomann-Kurrik',
'images/thumbs/thumb08.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-GettingStarted.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Campfire Part 1',
'Technology',
'CF1 AppsMarketplace Part1',
'images/thumbs/thumb09.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Campfire Part 2',
'Technology',
'CF1 AppsMarketplace Part2',
'images/thumbs/thumb10.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part2.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Campfire Part 3',
'Technology',
'CF1 AppsMarketplace Part3',
'images/thumbs/thumb11.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part3.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Campfire Part 4',
'Technology',
'CF1 AppsMarketplace Part4',
'images/thumbs/thumb12.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part4.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Campfire Part 5',
'Technology',
'CF1 AppsMarketplace Part5',
'images/thumbs/thumb13.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part5.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'2',
'Campfire Part 6',
'Technology',
'CF1 AppsMarketplace Part6',
'images/thumbs/thumb14.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part6.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'3',
'2010 Day 1 Keynote',
'Conferences',
'IO2010 Keynote',
'images/thumbs/thumb01.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'3',
'2010 Day 2 Keynote',
'Conferences',
'IO2010 Keynote Android',
'images/thumbs/thumb02.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day2-android.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'3',
'2009 Day 1 Keynote',
'Conferences',
'IO2009 Keynote',
'images/thumbs/thumb03.jpg',
'Moscone Center'
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2009-Keynote-day1.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'3',
'2010 Highlights',
'Conferences',
'Google Developer Day',
'images/thumbs/thumb04.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-Highlights.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'3',
'2010 Keynote',
'Conferences',
'Brazil',
'images/thumbs/thumb05.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-BR-Keynote.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'4',
'Using Google Chrome Frame',
'Keynotes',
'Alex Russell',
'images/thumbs/thumb06.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/ChromeFrame.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'4',
'Uploading your App',
'Keynotes',
'CWS HowTo',
'images/thumbs/thumb07.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-HowTo.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'4',
'Getting Started with Apps for the Chrome Web Store',
'Keynotes',
'Arne Roomann-Kurrik',
'images/thumbs/thumb08.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-GettingStarted.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'4',
'Campfire Part 1',
'Keynotes',
'CF1 AppsMarketplace Part1',
'images/thumbs/thumb09.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'4',
'Campfire Part 2',
'Keynotes',
'CF1 AppsMarketplace Part2',
'images/thumbs/thumb10.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part2.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'4',
'Campfire Part 3',
'Keynotes',
'CF1 AppsMarketplace Part3',
'images/thumbs/thumb11.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part3.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'4',
'Campfire Part 4',
'Keynotes',
'CF1 AppsMarketplace Part4',
'images/thumbs/thumb12.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part4.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'4',
'Campfire Part 5',
'Keynotes',
'CF1 AppsMarketplace Part5',
'images/thumbs/thumb13.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part5.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'4',
'Campfire Part 6',
'Keynotes',
'CF1 AppsMarketplace Part6',
'images/thumbs/thumb14.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part6.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'5',
'2010 Day 1 Keynote',
'Talks',
'IO2010 Keynote',
'images/thumbs/thumb01.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'5',
'2010 Day 2 Keynote',
'Talks',
'IO2010 Keynote Android',
'images/thumbs/thumb02.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2010-Keynote-day2-android.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'5',
'2009 Day 1 Keynote',
'Talks',
'IO2009 Keynote',
'images/thumbs/thumb03.jpg',
'Moscone Center'
'http://commondatastorage.googleapis.com/gtv_template_assets/IO2009-Keynote-day1.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'5',
'2010 Highlights',
'Talks',
'Google Developer Day',
'images/thumbs/thumb04.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-Highlights.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'5',
'2010 Keynote',
'Talks',
'Brazil',
'images/thumbs/thumb05.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/GDD2010-BR-Keynote.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'5',
'Using Google Chrome Frame',
'Talks',
'Alex Russell',
'images/thumbs/thumb06.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/ChromeFrame.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'5',
'Uploading your App',
'Talks',
'CWS HowTo',
'images/thumbs/thumb07.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-HowTo.mp4',
now()
);


INSERT INTO `videos` VALUES (
NULL,
'5',
'Getting Started with Apps for the Chrome Web Store',
'Talks',
'Arne Roomann-Kurrik',
'images/thumbs/thumb08.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CWS-GettingStarted.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'6',
'Campfire Part 1',
'Events',
'CF1 AppsMarketplace Part1',
'images/thumbs/thumb09.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part1.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'6',
'Campfire Part 2',
'Events',
'CF1 AppsMarketplace Part2',
'images/thumbs/thumb10.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part2.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'6',
'Campfire Part 3',
'Events',
'CF1 AppsMarketplace Part3',
'images/thumbs/thumb11.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part3.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'6',
'Campfire Part 4',
'Events',
'CF1 AppsMarketplace Part4',
'images/thumbs/thumb12.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part4.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'6',
'Campfire Part 5',
'Events',
'CF1 AppsMarketplace Part5',
'images/thumbs/thumb13.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part5.mp4',
now()
);

INSERT INTO `videos` VALUES (
NULL,
'6',
'Campfire Part 6',
'Events',
'CF1 AppsMarketplace Part6',
'images/thumbs/thumb14.jpg',
'http://commondatastorage.googleapis.com/gtv_template_assets/CF1-AppsMarketplace-Part6.mp4',
now()
);

