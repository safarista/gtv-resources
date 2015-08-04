Starter guide to the HTML5 Templates for Google TV

# Introduction #

In this project, you will find 2 templates based on HTML5, JavaScript and CSS3 available for download. The goal of these templates is to provide examples of web sites optimized for a 10-foot UI experience. They are also intended to be a starting point for web developers who want to create a version of their site optimized for Google TV using those technologies.

These templates utilize the [Google TV jQuery UI Library](http://code.google.com/p/gtv-ui-lib) that provides a group of controls commonly used in web applications and also handles everything related to keyboard navigation and media keys.

## Template 1 ##
Template 1 is designed for sites with a significant amount of video content. It has a tiered navigation structure, allowing the user to choose their video category from the main page, and then navigate within that category in a fullscreen playback page. It also has a video details view that provides the user with details about the video as well as a ratings system.

## Template 2 ##
Template 2 is is for sites with less content that wish to present everything on a single page. This template places category selection and a video selection carousel on a single page, one place where the user can navigate the entire video library.

## Example Sites ##
You can see an example of each of these templates in action here:
  * [Template 1](http://gtv-resources.googlecode.com/svn/trunk/templates/html-01/index.html)
  * [Template 2](http://gtv-resources.googlecode.com/svn/trunk/templates/html-02/index.html)

# Template Structure #
Each template has the following file system structure:
```
- <root>
	- <scripts>
		- javascript files
	- <styles>
		- css files
	- <images>
		- image files
        - html files
```


# Template components #
Both templates have the same components:

## Html files ##
Html files define only the basic page layout. Most of the content is drawn at runtime using JavaScript.
```
       - Template 1: index.html and fullscreen.html
       - Template 2: index.html
```
The index.html file implements the main landing page for each template site.

In Template 1, index.html is the category selection page. The fullscreen playback and video details page are implemented in fullscreen.html.

In Template 2, since it is a single page player, index.html implements the entire site.

## JavaScript files ##
Each HTML page has it's own JavaScript file. Both templates have dataprovider file (see below).
```
       - Template 1: index.js and fullscreen.js
       - Template 2: index.js
       - Both templates: dataprovider.js
```

### Page Code Files ###
The JavaScript implementation files for each page (index.js, fullscreen.js) create the page controls at runtime and process events. Each control has its own implementation file that contains the code to create and delete the control, set up keyboard navigation and event handling.

### Data Provider File ###
The dataprovider.js file implements the DataProvider class. This class encapsulates the data used to build the template pages. It includes accessors for menu options, video playlists with thumbnails, and so on.

The implementation provided in the templates is an example using static data in code. On a production site, this file would instead implement AJAX calls to retrieve data at runtime, fed by a server-side data store.

### CSS Stylesheet files ###
Both templates have their own stylesheets, located in styles.css.

## Deploying the Templates ##

### Copy the Files ###
To deploy the templates, you'll need to first copy the files in their existing directory structure to the web server.

### Create the DataProvider ###
Next, you'll need to set up your data provider. You could use a static file to enumerate your videos, but more likely you'll implement a server-side handler for AJAX calls. Then modify dataprovider.js to call your server and retrieve the data in the correct format.

The Template code expects a data object in the following format:
```
   - categories: [category1, category2, ..., categoryN].
   - category: {name, items}.
   - items: [item1, item2, ..., itemN]
   - item: {image, title, description, videos}
   - videos: {thumb, title, subtitle, description, sources}
   - sources: [source1, source2, ..., sourceN]
   - source: string with the url | {src, type, codecs}
```

Since the Template may make multiple calls to read from the data provider while the user navigates the site, caching the results is advised.

### Ratings (Template 1) ###
The Video Details page in Template 1 includes controls for the user to rate the videos they are watching. This work is handled by the ThumbsNav control. Supporting this rating system on your site is optional. If you don't wish to have it, you can remove the ThumbsNav control from the page.

If you do want to hook in a ratings system, you'll need to fill in the stubs for the ratings event handlers. When the user presses the "thumbs-up" or "thumbs-down" buttons, you'll need to make an AJAX call to alter the rating of the video they are viewing on the server. This call might also return the new compounded rating of the video if you want to provide immediate feedback of the rating change.