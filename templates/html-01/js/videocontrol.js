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
 * @fileoverview Classes for HTML5 Video Control
 *
 * 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * VideoControlParams class holds configuration values specific to VideoControl.
 * @constructor
 */
gtv.jq.VideoControlParams = function() {
};

/**
 * CreateParams for the VideoControl control.
 * @type {CreateParams}
 */
gtv.jq.VideoControlParams.prototype.createParams = null;

/**
 * Behaviors for the VideoControl control.
 * @type {VideoControlBehaviors}
 */
gtv.jq.VideoControlParams.prototype.behaviors = null;

/**
 * VideoControlBehaviors configures the behaviors for a VideoControl control.
 * @constructor
 */
gtv.jq.VideoControlBehaviors = function() {
};

/**
 * Tells if the VideoControl should allow switching from/to fullscreen mode.
 * @type {boolean}
 */
gtv.jq.VideoControlBehaviors.prototype.allowWindowStateChange = null;

/**
 * Tells if the VideoControl should start in fullscreen mode.
 * @type {boolean}
 */
gtv.jq.VideoControlBehaviors.prototype.startFullScreen = null;

/**
 * Tells if the VideoControl should you the html5 standard video controls.
 * @type {boolean}
 */
gtv.jq.VideoControlBehaviors.prototype.showControls = null;

/**
 * Tells if the VideoControl should exit fullscreen mode once a video ends.
 * @type {boolean}
 */
gtv.jq.VideoControlBehaviors.prototype.exitFullScreenOnEnded = null;

/**
 * Tells if the VideoControl should auto play a video immediately.
 * @type {boolean}
 */
gtv.jq.VideoControlBehaviors.prototype.autoPlay = null;

/**
 * Tells if the VideoControl should use separate sources for each video.
 * If not a single source will be used in the src tag attribute.
 * @type {boolean}
 */
gtv.jq.VideoControlBehaviors.prototype.separateSorces = null;

/**
 * VideoControl class. VideoControl control plays videos using
 * the standard html 5 video player.
 * @constructor
 */
gtv.jq.VideoControl = function()
{
  this.isFullScreen = false;
  this.loadedTime = 0;
  this.globalKeyMapping = null;
};

/**
 * Static variable to store the fullscreen mode keyController layer name.
 */
gtv.jq.VideoControl.fullScreenLayer = 'fullScreen';

/**
 * Removes the control from its container and from the key controller.
 */
gtv.jq.VideoControl.prototype.deleteControl = function() {
  if (this.control) {
    //this.keyController.removeBehaviorZone(this.behaviorZone);
    //this.keyController.removeBehaviorZone(this.fullScreenBehaviorZone);

    $(this.control).unbind();
    $(this.control).remove();
    this.control = null;
    this.container.remove();
  }
};

/**
 * Creates the VideoControl inner components.
 * @param {gtv.jq.VideoControlParams} videoControlParms
 * @return {boolean} true on success
 */
gtv.jq.VideoControl.prototype.makeControl = function(videoControlParms) {

  this.params_ = jQuery.extend(videoControlParms.createParams, videoControlParms);

  if (!this.params_.containerId) {
    return false;
  }

  this.videoHolder = this.params_.topParent;
  this.containerId = this.params_.containerId;
  this.styles = this.params_.styles || {};
  this.selectors = this.params_.selectors || {};
  this.behaviors = this.params_.behaviors || {};
  this.keyController = this.params_.keyController;
  this.callbacks = this.params_.callbacks || {};

  var videoControl = this;

  if (videoControl.behaviors.allowWindowStateChange ||
      videoControl.behaviors.startFullScreen) {
    $(window).resize(function() {
      if (videoControl.isFullScreen) {
        var zoom = gtv.jq.GtvCore.getZoom();
        videoControl.container
            .css('height', window.innerHeight/zoom + 'px')
            .css('width', window.innerWidth/zoom + 'px');
      }
    });
  }

  $(document).bind('keydown mousemove mousedown', function(e) {
    if (e.keyCode == 27) {
      return;
    }
    if (e && videoControl.isMediaKey(e.keyCode)) {
      videoControl.callOnMediaKeyCallback();
    } else {
      videoControl.callOnUserActivityCallback();
    }
  });

  $(window).bind('unload', function() {
    videoControl.deleteControl();
  });

  videoControl.globalKeyMapping = {
    32: function() { // Space bar
      if (typeof videoControl.callbacks.onPlayPause == 'function') {
        videoControl.callbacks.onPlayPause();
      }
      videoControl.playPause();
      return { status: 'none' };
    },
    176: function() { // Next
      if (typeof videoControl.callbacks.onNext == 'function') {
        videoControl.callbacks.onNext();
      }
      return { status: 'none' };
    },
    177: function() { // Previous
      if (typeof videoControl.callbacks.onPrevious == 'function') {
        videoControl.callbacks.onPrevious();
      }
      return { status: 'none' };
    },
    178: function() { // Stop
      if (typeof videoControl.callbacks.onStop == 'function') {
        videoControl.callbacks.onStop();
      }
      videoControl.stop();
      return { status: 'none' };
    },
    179: function() { // Play/Pause
      if (typeof videoControl.callbacks.onPlayPause == 'function') {
        videoControl.callbacks.onPlayPause();
      }
      videoControl.playPause();
      return { status: 'none' };
    },
    227: function() { // Rewind
      if (typeof videoControl.callbacks.onRewind == 'function') {
        videoControl.callbacks.onRewind();
      }
      videoControl.rewind();
      return { status: 'none' };
    },
    228: function() { // Fast Forward
      if (typeof videoControl.callbacks.onFastForward == 'function') {
        videoControl.callbacks.onFastForward();
      }
      videoControl.fastForward();
      return { status: 'none' };
    }
  };

  videoControl.keyController.setGlobalKeyMapping(videoControl.globalKeyMapping);

  var keyMapping = {
    13: function(selectedItem, newSelected) { // Enter
      if (typeof videoControl.callbacks.onEnter == 'function') {
        videoControl.callbacks.onEnter(selectedItem);
      }
      return { status: 'none' };
    },
    37: function(selectedItem, newItem) {  // left
        var parent = $(videoControl.isFullScreen?videoControl.selectors.fullScreenVideoCommandsParent:videoControl.selectors.videoCommandsParent);
        if (parent && parent.length > 0) {
          var first = parent.find(videoControl.selectors.videoCommand).first();
          if (first && first.length > 0 && first[0] == selectedItem[0]) {
            return { status: 'selected', selected: selectedItem };
          }
        }
        return { status: 'none' };
    },
    39: function(selectedItem, newItem) {  // right
        var parent = $(videoControl.isFullScreen?videoControl.selectors.fullScreenVideoCommandsParent:videoControl.selectors.videoCommandsParent);
        if (parent && parent.length > 0) {
          var last = parent.find(videoControl.selectors.videoCommand).last();
          if (last && last.length > 0 && last[0] == selectedItem[0]) {
            return { status: 'selected', selected: selectedItem };
          }
        }
        return { status: 'none' };
    }
  };

  if (!videoControl.behaviors.showControls) {
    var navSelectors = {
      item: videoControl.selectors.videoCommand,
      itemParent: videoControl.selectors.videoCommandDiv,
      itemRow: videoControl.selectors.videoCommandsParent,
      itemPage: videoControl.selectors.videoCommandsParent
    };

    var selectionClasses = {
      basic: videoControl.styles.commandSelected
    };

    var actions = {
      scrollIntoView: function(selectedItem, newItem, getFinishCallback) {
            if (newItem && typeof videoControl.callbacks.onControlSelected == 'function') {
          videoControl.callbacks.onControlSelected(newItem);
        }
        var finishCallback = getFinishCallback();
        if (typeof finishCallback == 'function') {
          finishCallback();
        }
      },
      click: function(selectedItem, newItem) {
        if (typeof videoControl.callbacks.onControlClicked == 'function') {
          videoControl.callbacks.onControlClicked(selectedItem);
        }
      },
      leaveZone: function() {
        if (typeof videoControl.callbacks.onBlur == 'function') {
          videoControl.callbacks.onBlur();
        }
      }
    };

    var zoneParms = {
      containerSelector: videoControl.selectors.videoCommandsParent,
      keyMapping: keyMapping,
      actions: actions,
      navSelectors: navSelectors,
      selectionClasses: selectionClasses,
      navigableData: 'nav-data'
      };

    videoControl.behaviorZone = new gtv.jq.KeyBehaviorZone(zoneParms);
      videoControl.keyController.addBehaviorZone(videoControl.behaviorZone, false);

       if (videoControl.selectors.fullScreenVideoCommandsParent) {
         navSelectors = {
        item: videoControl.selectors.videoCommand,
        itemParent: videoControl.selectors.videoCommandDiv,
        itemRow: videoControl.selectors.fullScreenVideoCommandsParent,
        itemPage: videoControl.selectors.fullScreenVideoCommandsParent
      };

      zoneParms = {
        containerSelector: videoControl.selectors.fullScreenVideoCommandsParent,
        keyMapping: keyMapping,
        actions: actions,
        navSelectors: navSelectors,
        selectionClasses: selectionClasses,
        navigableData: 'nav-data'
        };

        videoControl.fullScreenBehaviorZone =
            new gtv.jq.KeyBehaviorZone(zoneParms);
        videoControl.keyController.addBehaviorZone(
            videoControl.fullScreenBehaviorZone,
            false,
            [gtv.jq.VideoControl.fullScreenLayer]);
    }
  }

  return true;
};

/**
 * Calls the onMediaKey callback if defined.
 */
gtv.jq.VideoControl.prototype.callOnMediaKeyCallback = function() {
  if (typeof this.callbacks.onMediaKey == 'function') {
    this.callbacks.onMediaKey();
  }
};

/**
 * Calls the onUserActivity callback if defined.
 */
gtv.jq.VideoControl.prototype.callOnUserActivityCallback = function() {
  var videoControl = this;

  if (videoControl.onUserActivityTimeout) {
    clearTimeout(videoControl.onUserActivityTimeout);
  }

  videoControl.onUserActivityTimeout = setTimeout(function() {
    if (typeof videoControl.callbacks.onUserActivity == 'function') {
      videoControl.callbacks.onUserActivity();
    }
  }, 50);
};

/**
 * Shows a html 5 video player and plays the video.
 * @param {Object} object the information from the video to be played.
 */
gtv.jq.VideoControl.prototype.showVideo = function(videoInfo) {
  var videoControl = this;

  videoControl.deleteControl();

  if (!videoInfo || !videoInfo.sources || videoInfo.sources.length == 0) {
    return;
  }

  videoControl.container = $('<div></div>')
      .attr('id', videoControl.containerId);
  if (videoControl.styles.container) {
    videoControl.container.addClass(videoControl.styles.container);
  }
  videoControl.videoHolder.append(videoControl.container);

  var video = document.createElement('video');
  videoControl.isFullScreen = false;
  videoControl.control = video;

  $(video).addClass(videoControl.styles.video)
      .attr('width', '100%')
      .attr('height', '100%');

  if (videoControl.behaviors.startFullScreen) {
    videoControl.resizeToFullScreen();
    videoControl.isFullScreen = true;
    videoControl.keyController.setLayer(gtv.jq.VideoControl.fullScreenLayer);
    if (typeof videoControl.callbacks.windowStateChanged == 'function') {
      videoControl.callbacks.windowStateChanged();
    }
  } else {
     this.container.css('width', videoControl.styles.width + 'px')
              .css('height', videoControl.styles.height + 'px');
  }

  if (videoControl.behaviors.showControls) {
    $(video).attr('controls', 'controls');
  }

  if (videoControl.behaviors.separateSorces) {
    var sources = videoInfo.sources;
    for (var i=0; i<sources.length; i++) {
      var videoParm = sources[i];
      var source = document.createElement('source');
      $(source).attr('src', videoParm.src ? videoParm.src : videoParm);
      if (videoParm.type) {
        $(source).attr('type', videoParm.type);
      }
      if (videoParm.codecs) {
        $(source).attr('codecs', videoParm.codecs);
      }
      $(video).append(source);
    }
  } else {
    var source = videoInfo.sources[0];
    $(video).attr('src', source.src?source.src:source);
  }

  videoControl.loadedTime = 0;

  var onProgressCaller = function() {
    if (typeof videoControl.callbacks.onLoadProgress == 'function') {
      videoControl.callbacks.onLoadProgress();
    }
  };

  $(video).bind('timeupdate', function() {
    if (typeof videoControl.callbacks.timeUpdated == 'function') {
      videoControl.callbacks.timeUpdated();
    }
    if (videoControl.control.buffered &&
        videoControl.control.buffered.length > 0) {
      var end = videoControl.control.buffered.end();
      if (videoControl.loadedTime != end) {
        videoControl.loadedTime = end;
        onProgressCaller();
      }
    }
  });
  $(video).bind('progress', function() {
    if (videoControl.control.buffered &&
        videoControl.control.buffered.length > 0) {
      videoControl.loadedTime = videoControl.control.buffered.end();
    }
    onProgressCaller();
  });
  $(video).bind('durationchange', function() {
    if (typeof videoControl.callbacks.durationChanged == 'function') {
      videoControl.callbacks.durationChanged();
    }
  });
  $(video).bind('loadeddata', function() {
    if (typeof videoControl.callbacks.loaded == 'function') {
      videoControl.callbacks.loaded();
    }
  });
  $(video).bind('ended', function() {
    if (videoControl.behaviors.exitFullScreenOnEnded &&
        videoControl.isFullScreen) {
      videoControl.fullScreen();
    }
    if (typeof videoControl.callbacks.ended == 'function') {
      videoControl.callbacks.ended();
    }
  });
  $(video).bind('click', function() {
    videoControl.playPause();
    videoControl.callOnUserActivityCallback();
  });
  $(video).bind('mousemove', function() {
    videoControl.callOnUserActivityCallback();
    if (typeof videoControl.callbacks.mousemove == 'function') {
      videoControl.callbacks.mousemove();
    }
  });
  $(video).bind('keydown', function(e) {
    if (e && videoControl.isMediaKey(e.keyCode)) {
      videoControl.callOnMediaKeyCallback();
    } else {
      videoControl.callOnUserActivityCallback();
    }
  });
  if (videoControl.behaviors.allowWindowStateChange) {
    $(video).bind('dblclick', function(event) {
      videoControl.fullScreen();
    });
  }

  if (videoControl.behaviors.autoPlay) {
    videoControl.playPause();
  }

  videoControl.container.append(videoControl.control);
};

/**
 * Tells if the keyCode is a media key or not.
 * @param {number} object containing the information from the video to be played.
 * @return {boolean} true if the keyCode is a media key.
 */
gtv.jq.VideoControl.prototype.isMediaKey = function(keyCode) {
  if (keyCode) {
    if (keyCode == 32) {
      return true;
    }
    if (keyCode >= 176 && keyCode <= 179) {
      return true;
    }
    if (keyCode == 227 || keyCode == 228) {
      return true;
    }
  }
  return false;
};

/**
 * Tells if the video is playing or not.
 * @return {boolean} true if the video is in playing state.
 */
gtv.jq.VideoControl.prototype.isPlaying = function() {
  var video = this.control;
  if (video) {
    return !(video.paused || video.ended || video.stoped);
  }
  return false;
};

/**
 * Seeks the video and starts playing it at the correspondent position.
 * @param {number} seconds from where the video should continue playing.
 */
gtv.jq.VideoControl.prototype.playAt = function(seconds) {
  var video = this.control;
  if (video) {
    video.currentTime = seconds;
    if (!this.isPlaying()) {
      this.playPause();
    }
  }
};

/**
 * Starts playing the video if it is not in playing state or pauses it
 * if it is in playing state.
 */
gtv.jq.VideoControl.prototype.playPause = function() {
  var video = this.control;
  if (video) {
    if (this.isPlaying()) {
      video.pause();
    } else {
      video.play();
    }
    if (typeof this.callbacks.stateChanged == 'function') {
      this.callbacks.stateChanged();
    }
  }
};

/**
 * Stops the video.
 */
gtv.jq.VideoControl.prototype.stop = function() {
  var video = this.control;
  if (video) {
    if (typeof video.stop == 'function') {
      video.stop();
    } else {
      video.currentTime = 0;
      this.playPause();
      video.stoped = true;
    }
  }
};

/**
 * Rewinds the video.
 */
gtv.jq.VideoControl.prototype.rewind = function() {
  var video = this.control;
  if (video) {
    video.currentTime = video.currentTime - 10;
  }
};

/**
 * Fast forwards the video.
 */
gtv.jq.VideoControl.prototype.fastForward = function() {
  var video = this.control;
  if (video) {
    video.currentTime = video.currentTime + 10;
  }
};

/**
 * Tells if the video is paused or not.
 * @return {boolean} true if the video is paused.
 */
gtv.jq.VideoControl.prototype.getPaused = function() {
  if (this.control) {
    return this.control.paused;
  }

  return false;
};

/**
 * Tells if the video loaded time.
 * @return {number} seconds loaded from the video stream.
 */
gtv.jq.VideoControl.prototype.getLoadedTime = function() {
  if (this.control) {
    return this.loadedTime;
  }

  return 0;
};

/**
 * Tells if the video elapsed time.
 * @return {number} seconds elapsed.
 */
gtv.jq.VideoControl.prototype.getElapsedTime = function() {
  if (this.control) {
    return this.control.currentTime;
  }

  return 0;
};

/**
 * Tells if the video duration.
 * @return {number} duration of the video in seconds.
 */
gtv.jq.VideoControl.prototype.getDuration = function() {
  if (this.control) {
    return this.control.duration;
  }

  return 0;
};

/**
 * Sets the video fullscreen dimensions.
 */
gtv.jq.VideoControl.prototype.resizeToFullScreen = function() {
  var video = this.control;
  if (video) {
    var zoom = gtv.jq.GtvCore.getZoom();
    this.container.css('position', 'fixed')
        .css('top', 0)
        .css('left', 0)
        .css('backgroundColor', 'rgba(0, 0, 0, 0.9)')
        .css('width', window.innerWidth/zoom + 'px')
        .css('height', window.innerHeight/zoom + 'px');
  }
};

/**
 * Switches the video window state from/to fullscreen mode.
 */
gtv.jq.VideoControl.prototype.fullScreen = function() {
  if (!this.behaviors.allowWindowStateChange) {
    return;
  }

  var video = this.control;
  if (video) {
    if (!this.isFullScreen) {
      this.resizeToFullScreen();
    } else {
      this.container.css('position', 'static')
          .css('width', this.styles.width + 'px')
          .css('height', this.styles.height + 'px');
    }

    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      this.keyController.setLayer(gtv.jq.VideoControl.fullScreenLayer);
    } else {
      this.keyController.setLayer('default');
    }

    if (typeof this.callbacks.windowStateChanged == 'function') {
      this.callbacks.windowStateChanged();
    }
  }
};
