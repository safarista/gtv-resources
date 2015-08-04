Starter guide to the Flash templates for Google TV

# Introduction #

In this project, you will find 2 templates based on Flash available for download. These templates are provided as a starting point for Flash developers who wants to create an optimized site for Google TV. A library of controls (referred as GTVLib in this document) is included as part of the templates. All the graphics components in the templates are defined in a swf, and content is loaded from XML files. We also provide some controls in the templates, like an scrollable grid, as an example of how to make complex graphic controls.

Template 1 design is suitable for sites with a lot of video content broken into multiple categories.
Template 2 design is suitable for sites with less video content.

Here are live URLs of each template for your perusal. To view them on your desktop browser, you need to have the Flash Player 10.2 plugin installed on your browser:

  * [Template 1](http://gtv-resources.googlecode.com/svn/trunk/templates/as3-01/AS3_Template_01.html)
  * [Template 2](http://gtv-resources.googlecode.com/svn/trunk/templates/as3-02/AS3_Template_02.html)

## Development Environment Pre-requisites ##

For the template source code, download Template 1 or our Template 2 here. Both templates have a library of controls (GTVLib) included.

As part of your development environment, you will need the
  * [latest Java JRE installed](http://www.java.com/en/download/index.jsp)
  * [Flex 4.5 SDK (codename “Hero”)](http://opensource.adobe.com/wiki/display/flexsdk/Download+Flex+Hero)
  * [Flash Player 10.2 Release Candidate](http://labs.adobe.com/downloads/flashplayer10.html) installed in your desktop browser.

We also provided ant build scripts so you can easily build the example applications. To use the ant build script, you would need to install [Apache Ant](http://ant.apache.org/).

For instructions on how to build the sources, please look for the README.txt files inside the packages.

## What is GTVLib? ##

GTVLib is meant to help Flash developers building sites specially designed for GoogleTV.
Before continuing read further, we highly recommend you to go over [Designing For TV](http://code.google.com/tv/web/docs/design_for_tv.html) and familiarize yourself with best practices on the general design of TV applications.

GTVLib is NOT an API that allows you to access unique hardware features of Google TV device. The embeded Flash Player in Google TV devices already allows you to do some of that (like identifying the Media Keys), and if something cannot be accessed through the Flash Player library, the general rule is that you won’t be able to access it within your flash application.

So, what is GTVLib then? Well the library we provide is a simple framework that should help you develop content specially designed for TV. For example, you can group your main functional areas in each of your applications pages in different **Navigation Zones**. The **Controls** within a **Navigation Zone** will be navigable using the Google TV keyboard DPad keys, and when you reach the end of a **Navigation Zone**, you will automatically move to the next closest **Navigation Zone**.

![http://gtv-resources.googlecode.com/svn/wiki/images/GTVFlashLib.png](http://gtv-resources.googlecode.com/svn/wiki/images/GTVFlashLib.png)

The GTVLib provides some classes that already handles this navigation behaviours, with lot of customization options.

### Do I need anything special to work with GTVLib? ###

You should know that the Flash Player that comes installed in the Google TV devices is a special build versioned 10.1 GTV. This particular build has all the features of Flash Player 10.1, plus support for the new StageVideo component introduced in Flash Player 10.2 (in desktop versions).

So in order to develop for Google TV, you will have to use Flash Player 10.2, and the Flex 4.5 SDK (both of them haven’t been released yet, but they are very stable now).

But be careful, some of the features from FP 10.2 are not supported in FP 10.1 GTV, like the new StageVideoEvent.STAGE\_VIDEO\_AVAILABILITY event type.

### How do I use GTVLib? ###

The most important concepts inside GTVLib are **Navigation Zones** and **Controls**. A navigation zone can contain controls and/or other navigation zones.

An **INavigationObject** is an element that can be placed inside a navigation zone and be reached by the user with the keyboard or mouse.
The **IControl** interface extends **INavigationObject** and provides the element with a graphical representation (a display object), and allows it to be selected with the keyboard or mouse (hitting enter or clicking).

The **INavigationObjectContainer** is an **INavigationObject** that can contain other **INavigationObjects**.
You can think of **INavigationObject** as Flash **DisplayObject**, and **INavigationObjectContainer** as Flash **DisplayObjectContainer**.

The **NavigationZone** class is the most basic (and abstract) implementation of **INavigationObjectContainer**.
It contains all the logic to handle children, but the method _getNextItem()_ needs to be overridden by a sub-class. This method defines how the navigation inside this navigation zone should behave based on the direction key pressed in the Google TV keyboard.

Two basic navigation zones are **SequenceNavigationZone**, that navigates its items based on the order they were added, and **PositionBasedNavigationZone**, that navigates its items based on graphical proximity.

Each of your application's pages and complex controls should either extend or contain a navigation zone.

The **Control** class is a basic implementation of the **IControl** interface. All your navigation elements (buttons, tabs, icons, etc) should extend from this class.

The **InputController** is a singleton class that handles all the user interaction with the application. Its main purpose is to handle the navigation between zones, and keep track of the current active control and zone.

**UserActivityListener** and **ActivityTimer** are helper listeners that will help you detect when the user is either pressing a particular key or moving the mouse, or when the user has gone idle (not interacted after a period of time).

Finally, the **VideoPlayer** class is a player that contains all the logic to play a video given an URL and control its playback. It uses the new **StageVideo** flash component to handle the video rendering.

Take a look at the templates source code for examples on how to use these classes.

## How do I modify the templates? ##

Each template comes with a resource folder that contains a Flash File (.fla) that has all the **Template Art Assets**. If you want to modify any of them just modify the .fla file within the **resource/fla folder**.

Each template .fla file contains everything related with the UI of the templates, grouping each different screen in a movie clip and arranging it per layer.

If you want to modify any specific art you may want to verify the **Movie Clip Instance Names** are the sames as the ones used in the template classes.

Also make sure you are exporting the right symbols in your Flash Library as the ones used within the **Embed labels** in the ActionScript Code.

On the other hand, if you want to modify the template content, each template comes with a configurable set of xml files that you can edit to do so. These content is shown either as a **Category** or a **Playlist** and visually displayed either in a **Menu, Grid or Carousel** within the Template.

The location for these files is **html-template/xml/demo**.

## Can I use my own library with the template instead of using GTV UI Library? ##

Of course you can; remember that the GTV UI Lib is just a framework to help you “design” your applications for TV, but feel free to use your own framework if you like. Just remember to pay attention [Designing For TV](http://code.google.com/tv/web/docs/design_for_tv.html) guidelines for an improved user experience result.