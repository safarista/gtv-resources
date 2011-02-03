function TutorialPage()
{
}

TutorialPage.prototype.makePage = function(topParent)
{
  var tutorialPage = this;
  tutorialPage.topParent = topParent;

  var zones = main.keyController.stop();

  tutorialPage.keyController = new KeyController();
  tutorialPage.keyController.start();

  tutorialPage.container = $('<div></div>').addClass('tutorial-container');
  topParent.append(tutorialPage.container);

  tutorialPage.pages = [
    function() {
      tutorialPage.cleanUp = tutorialPage.page1(tutorialPage.container);
    },
    function() {
      tutorialPage.cleanUp = tutorialPage.page2(tutorialPage.container);
    },
    function() {
      tutorialPage.cleanUp = tutorialPage.page3(tutorialPage.container);
    },
    function() {
      tutorialPage.cleanUp = tutorialPage.page4(tutorialPage.container);
    }
  ];

  tutorialPage.addTopNav();

  tutorialPage.showPage(0);
};

TutorialPage.prototype.showPage = function(pageNum)
{
  var tutorialPage = this;

  if (tutorialPage.cleanUp)
    tutorialPage.cleanUp();

  tutorialPage.container.empty();

  tutorialPage.currentPage = pageNum;
  tutorialPage.pages[pageNum]();
};

TutorialPage.prototype.addTopNav = function()
{
  var tutorialPage = this;

  var topNavHolder = $('<div></div>').addClass('topnav-holder');
  tutorialPage.topParent.append(topNavHolder);

  var navItems = ['Next Part', 'Prev Part', 'Exit'];

  var styles = {
    item: 'topnav-item-style',
    itemDiv: 'topnav-item-div-style',
    row: 'topnav-row-style',
    normal: 'topnav-item-normal',
    selected: 'topnav-item-hover'
  };

  var behaviors = {
    popOut: 'top',
    orientation: 'horizontal'
  };

  var topNavControl = new SideNavControl();
  topNavControl.makeControl(
    topNavHolder,
    'topNav',
    styles,
    navItems,
    behaviors,
    tutorialPage.keyController,
    function(selectedItem) {
      choiceCallback(selectedItem);
    });

  function choiceCallback(selectedItem)
  {
    if (selectedItem.text() == 'Exit') {
      tutorialPage.keyController.stop();
      main.makeHome(false);
    }
    else if (selectedItem.text() == 'Next Part') {
      if (tutorialPage.currentPage + 1 < tutorialPage.pages.length)
        tutorialPage.showPage(tutorialPage.currentPage + 1);
    }
    else if (selectedItem.text() == 'Prev Part') {
      if (tutorialPage.currentPage > 0)
        tutorialPage.showPage(tutorialPage.currentPage - 1);
    }
  }

  var topNavContainer = topNavHolder.children('#topNav');
  var topNavWidth = topNavContainer.width();
  var windowWidth = $(window).width();
  topNavHolder.css('left', (windowWidth - topNavWidth) + 'px');
};

TutorialPage.prototype.page1 = function(topParent)
{
  var tutorialPage = this;

  var items = [];
  for (var i = 0; i < 50; i++) {
    var item = $('<p></p>').text(i.toString());
    items.push(item);
  }

  var styles = {
    row: 'scroll-row-style',
    itemsDiv: 'scroll-items-div-style',
    itemDiv: 'scroll-div-style',
    item: 'scroll-item-style',
    hover: 'item-hover'
  };

  var rowControl = new RowControl();
  rowControl.makeControl(topParent,
                         'row-container',
                         styles,
                         items);
  rowControl.enableNavigation(tutorialPage.keyController);

  return function() {
    rowControl.deleteControl();
  };
};

TutorialPage.prototype.page2 = function(topParent)
{
  var tutorialPage = this;
  var FEED_URL = 'http://picasaweb.google.com/data/feed/base/featured?alt=json-in-script&kind=photo&access=public&slabel=featured&hl=en_US&max-results=25';

  function makeItem(entry)
  {
    var thumb = entry.media$group.media$thumbnail[0].url;
    if (!thumb)
      return null;

    var item = $('<img></img>')
      .css({ height: '150px',
             display: 'block'})
      .attr('src', thumb);

    return item;
  }

  var rowControl;
  function makeRow(items)
  {
    var styles = {
      row: 'scroll-row-style',
      itemsDiv: 'scroll-items-div-style',
      itemDiv: 'scroll-div-style',
      item: 'scroll-item-style',
      hover: 'item-hover'
    };

    rowControl = new RowControl();
    rowControl.makeControl(topParent,
                           'row-container',
                           styles,
                           items);
    rowControl.enableNavigation(tutorialPage.keyController);
  }

  GtvCore.processJsonpFeed(
      FEED_URL,
      makeItem,
      makeRow,
      ['feed','entry']);

  return function() {
    rowControl.deleteControl();
  };
};

TutorialPage.prototype.page3 = function(topParent)
{
  var tutorialPage = this;
  var FEED_URL = 'http://picasaweb.google.com/data/feed/base/featured?alt=json-in-script&kind=photo&access=public&slabel=featured&hl=en_US&max-results=25';

  var photoHolder = $('<div></div>');
  topParent.append(photoHolder);

  var photo = $('<img></img>').attr('height', 700);
  photoHolder.append(photo);

  function makeItem(entry)
  {
    var thumb = entry.media$group.media$thumbnail[0].url;
    var content = entry.media$group.media$content[0].url;
    if (!content || !thumb)
      return null;

    var item = $('<img></img>')
      .css({ height: '150px',
             display: 'block'})
      .attr('src', thumb);

    item.data('url', content);
    return item;
  }

  function showPhoto(url)
  {
    photo.attr('src', url);
  }

  var scrollnavControl;
  var rowControl;
  function makeRow(items)
  {
    var scrollnavHolder = $('<div></div>').addClass('scrollnav-holder');
    topParent.append(scrollnavHolder);

    var firstShowSrc;
    function addNavItem(parent)
    {
      if (rowControl)
        return false;

      var scrollRowContainer = $('<div></div>')
          .addClass('scrollnav-row-holder');

      var windowWidth = $(window).width();
      scrollRowContainer.width(windowWidth);
      parent.append(scrollRowContainer);

      function choiceCallback(item)
      {
        var image = item.children().first();
        var url = image.data('url');
        showPhoto(url);
      }

      var styles = {
        row: 'scroll-row-style',
        itemsDiv: 'scroll-items-div-style',
        itemDiv: 'scroll-div-style',
        item: 'scroll-item-style',
        selected: 'item-hover'
      };

      rowControl = new RowControl();
      var scrollRow =
          rowControl.makeControl(scrollRowContainer,
                                 'row-container',
                                 styles,
                                 items);
      rowControl.enableNavigation(
          tutorialPage.keyController,
          choiceCallback);

      scrollRowContainer.height(scrollRow.height());
      return true;
    }

    var styles = {
      item: 'scrollnav-item-style',
      itemDiv: 'scrollnav-item-div-style',
      row: 'scrollnav-row-style',
      selected: 'scrollnav-item-hover'
    };

    var behaviors = {
      popOut: 'bottom',
      orientation: 'horizontal'
    };

    scrollnavControl = new SideNavControl();
    scrollnavControl.makeControl(
        scrollnavHolder,
        'scrollnav',
        styles,
        addNavItem,
        behaviors,
        tutorialPage.keyController,
        null);

    showPhoto(items[0].data('url'));
    scrollnavControl.selectControl();
  }

  GtvCore.processJsonpFeed(
      FEED_URL,
      makeItem,
      makeRow,
      ['feed','entry']);

  return function() {
    rowControl.deleteControl();
    scrollnavControl.deleteControl();
  };
};

TutorialPage.prototype.page4 = function(topParent)
{
  var tutorialPage = this;
  var FEED_URL = 'http://picasaweb.google.com/data/feed/base/featured?alt=json-in-script&kind=photo&access=public&slabel=featured&hl=en_US&max-results=50';

  var photoHolder = $('<div></div>').css('position', 'absolute');
  topParent.append(photoHolder);

  var photo = $('<img></img>').attr('height', 700);
  photoHolder.append(photo);

  function makeItem(entry)
  {
    var date = entry.published.$t;
    var thumb = entry.media$group.media$thumbnail[0].url;
    var content = entry.media$group.media$content[0].url;
    if (!content || !thumb)
      return null;

    var item = $('<img></img>')
      .css({ height: '150px',
             display: 'block'})
      .attr('src', thumb);

    item.data('url', content);
    item.data('date', date);
    return item;
  }

  function showPhoto(url)
  {
    var newPhoto = $('<img></img>')
        .attr('height', 700)
        .attr('src', url);

    newPhoto.load(function() {
        photo.remove();
        photoHolder.append(newPhoto);
        photoHolder.css(
            { left: ($(window).width() / 2) - (newPhoto.width() / 2) + 'px' });
        photo = newPhoto;
      });
  }

  var scrollnavControl;
  var rowControl;
  function makeRow(items, checkTime)
  {
    var scrollnavHolder = $('<div></div>').addClass('scrollnav-holder');
    topParent.append(scrollnavHolder);

    var filterItems = [];
    var navItems =
        function(parent) {
          if (rowControl)
            return false;

          var scrollRowContainer = $('<div></div>')
              .addClass('scrollnav-row-holder');

          var windowWidth = $(window).width();
          scrollRowContainer.width(windowWidth);
          parent.append(scrollRowContainer);

          function choiceCallback(item)
          {
            var image = item.children().first();
            var url = image.data('url');
            showPhoto(url);
          }

          var styles = {
            row: 'scroll-row-style',
            itemsDiv: 'scroll-items-div-style',
            itemDiv: 'scroll-div-style',
            item: 'scroll-item-style',
            selected: 'item-hover'
          };

          for (var i = 0; i < items.length; i++) {
            var itemDateStr = items[i].data('date');
            var itemDate = Date.parse(itemDateStr);
            if (itemDate > checkTime)
              filterItems.push(items[i]);
          }

          if (filterItems.length == 0)
            return false;

          rowControl = new RowControl();
          var scrollRow =
              rowControl.makeControl(scrollRowContainer,
                                     'row-container',
                                     styles,
                                     filterItems);
          rowControl.enableNavigation(
              tutorialPage.keyController,
              choiceCallback);

          scrollRowContainer.height(scrollRow.height());
          return true;
        };

    var styles = {
      item: 'scrollnav-item-style',
      itemDiv: 'scrollnav-item-div-style',
      row: 'scrollnav-row-style',
      chosen: 'scrollnav-item-chosen',
      normal: 'scrollnav-item-normal',
      selected: 'scrollnav-item-hover'
    };

    var behaviors = {
      popOut: 'bottom',
      //    fade: true,
      orientation: 'horizontal'
    };

    scrollnavControl = new SideNavControl();
    scrollnavControl.makeControl(
        scrollnavHolder,
        'scrollnav',
        styles,
        navItems,
        behaviors,
        tutorialPage.keyController,
        null);

    if (filterItems.length)
      showPhoto(filterItems[0].data('url'));

    scrollnavControl.selectControl();
  }

  var sideNavControl;
  function makeSideNav()
  {
    var sideNavHolder = $('<div></div>').addClass('sidenav-holder');
    topParent.append(sideNavHolder);

    var navItems = ['Last 2 Weeks', 'Last 4 Weeks', 'Last 2 Months'];

    var styles = {
      item: 'sidenav-item-style',
      itemDiv: 'sidenav-item-div-style',
      row: 'sidenav-row-style',
      chosen: 'sidenav-item-chosen',
      normal: 'sidenav-item-normal',
      selected: 'sidenav-item-hover'
    };

    var behaviors = {
      popOut: 'left',
      orientation: 'vertical',
      selectOnInit: true
    };

    sideNavControl = new SideNavControl();
    sideNavControl.makeControl(
        sideNavHolder,
        'sideNav',
        styles,
        navItems,
        behaviors,
        tutorialPage.keyController,
        function(selectedItem) {
          choiceCallback(selectedItem);
        });

    function choiceCallback(selectedItem)
    {
      var filter = selectedItem.text().toLowerCase();
      var checkTime = new Date();
      if (filter == 'last 2 weeks')
        checkTime.setDate(checkTime.getDate() - 14);
      else if (filter == 'last 4 weeks')
        checkTime.setDate(checkTime.getDate() - 28);
      else if (filter == 'last 2 months')
        checkTime.setMonth(checkTime.getMonth() - 2);

      if (rowControl)
        rowControl.deleteControl();

      if (scrollnavControl)
        scrollnavControl.deleteControl();

      rowControl = null;

      GtvCore.processJsonpFeed(
          FEED_URL,
          makeItem,
          function(items) { makeRow(items, checkTime.getTime()); },
          ['feed','entry']);
    }

    sideNavControl.selectControl();
  }

  makeSideNav();

  return function() {
    rowControl.deleteControl();
    scrollnavControl.deleteControl();
    sideNavControl.deleteControl();
  };
};

