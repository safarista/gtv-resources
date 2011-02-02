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
 * @fileoverview Classes for Carrousel Control
 *
 * @author alevin@google.com (Andres Levin), jatucha@google.com (Jorge Atucha) 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * CarrouselParams class holds configuration values specific to Carrousel.
 * @constructor
 */
gtv.jq.CarrouselParams = function() {
};

/**
 * CreateParams for the Carrousel control.
 * @type {CreateParams}
 */
gtv.jq.CarrouselParams.prototype.createParams = null;

/**
 * Behaviors for the Carrousel control.
 * @type {CarrouselBehaviors}
 */
gtv.jq.CarrouselParams.prototype.behaviors = null;

/**
 * CarrouselBehaviors configures the behaviors for a Carrousel control.
 * @constructor
 */
gtv.jq.CarrouselBehaviors = function() {
};

/**
 * Tells the Carrousel control if an item should be selected on init.
 * @type {boolean}
 */
gtv.jq.CarrouselBehaviors.prototype.selectOnInit = null;

/**
 * Tells the Carrousel control the number of items that will be displayed (visible).
 * @type {number}
 */
gtv.jq.CarrouselBehaviors.prototype.itemsToDisplay = null;

/**
 * Tells the Carrousel control if it should do auto-scrolling.
 * @type {boolean}
 */
gtv.jq.CarrouselBehaviors.prototype.autoScroll = null;

/**
 * Tells the Carrousel control the auto-scrolling interval in milliseconds.
 * Valid only if autoScroll behavior is true.
 * @type {number}
 */
gtv.jq.CarrouselBehaviors.prototype.autoScrollInterval = null;

/**
 * Carrousel class. Carrousel control is a horizontal scrolling control
 * that can manage selection or contain other controls.
 * @param {gtv.jq.CarrouselParams} carrouselParams
 * @constructor
 */
gtv.jq.Carrousel = function(carrouselParams)
{
  this.params_ = jQuery.extend(carrouselParams.createParams, carrouselParams);
}

/**
 * Removes the control from its container and from the key controller.
 */
gtv.jq.Carrousel.prototype.deleteControl = function()
{	
  if (!this.container)
    return;
        
  this.keyController.removeBehaviorZone(this.behaviorZone);

  this.container.remove();
  this.container = null;
};

/**
 * Creates a new Carrousel with the specified items and adds it to a
 * container on the page.
 * @param {gtv.jq.ShowParams} controlParams Params for creating the control.
 * @return {boolean} true on success
 */
gtv.jq.Carrousel.prototype.showControl = function(controlParams) {
  this.params_ = jQuery.extend(this.params_, controlParams);

  if (!gtv.jq.CreateParams.validateParams(this.params_))
    return false;
	
  this.topParent = this.params_.topParent;
  this.containerId = this.params_.containerId;
  this.parentSelector = '#' + this.topParent.attr('id');
  this.styles = this.params_.styles || {};
  this.items = this.params_.items;
  this.behaviors = this.params_.behaviors || {};
  this.keyController = this.params_.keyController;
  this.callbacks = this.params_.callbacks || {};
  this.layers = this.params_.layerNames || ['default'];
  
  var items = this.items;

  this.deleteControl();
    
  var container = $('<div></div>').attr('id', this.containerId).addClass('carrousel-control');
  if (this.styles.container) {
    container.addClass(this.styles.container);
  }

  this.topParent.append(container);
  this.container = container;

  for (var i=0; i<items.length; i++) {
    var content = items[i].content;
    var description = items[i].description;
    var navData = items[i].data;
	var addCallback = items[i].addCallback;
    
    var itemTextHolder = null;
        
    if (description) {
      itemTextHolder = $('<div></div>').addClass('carrousel-item-text-holder ' + this.styles.description);
      itemTextHolder.append(description);
    }
    
    var item = $('<div></div>').addClass('carrousel-item ' + this.styles.normal).append(content);
	
	if (typeof addCallback == 'function') {
		addCallback(item, navData);
	}
    
    if (navData) {
      item.data("nav-data", navData);
	}
    
    var itemDiv = $('<div></div>').addClass('carrousel-item-div ' + this.styles.itemDiv).append(item);
                
    if (description) {
      itemDiv.append(itemTextHolder);
    }
        
    this.container.append(itemDiv);
  }
    
  var carrousel = this;
    
  var keyMapping = {
    13: function(selectedItem, newItem) {  // enter
          carrousel.activateItem(selectedItem);
          return { status: 'none' };
    },
    37: function(selectedItem, newItem) {  // left
          if (newItem.length == 0) {
            newItem = carrousel.container.find('.carrousel-item').last();
            return { status: 'selected', selected: newItem };
          }
          return { status: 'none' };
    },
    39: function(selectedItem, newItem) {  // right
          if (newItem.length == 0) {
            newItem = carrousel.container.find('.carrousel-item').first();
            return { status: 'selected', selected: newItem };
          }
          return { status: 'none' };
    }
  };

  var actions = {
      scrollIntoView: function(selectedItem, newItem, getFinishCallback) {
      carrousel.selectItem(selectedItem, newItem, getFinishCallback);
    },
    click: function(selectedItem, newItem) {
      carrousel.activateItem(selectedItem);
    },
    enterZone: function() {
      if (typeof carrousel.callbacks.onFocus == 'function') {
        carrousel.callbacks.onFocus();
      }
    },
    leaveZone: function() {
      if (typeof carrousel.callbacks.onBlur == 'function') {
        carrousel.callbacks.onBlur();
      }
    }
  };
    
  var navSelectors = {
    item: '.carrousel-item',
    itemParent: '.carrousel-item-div',
    itemRow: '.carrousel-control',
    itemPage: '.carrousel-control'
  };
    
  var selectionClasses = {
    basic: this.styles.selected
  };
  
  var zoneParms = {
		containerSelector: this.parentSelector,
		keyMapping: keyMapping,
		actions: actions,
		navSelectors: navSelectors,
		selectionClasses: selectionClasses,
		navigableData: 'nav-data'
  };

  this.behaviorZone = new gtv.jq.KeyBehaviorZone(zoneParms);
  this.keyController.addBehaviorZone(this.behaviorZone, true, this.layers);
  
  if (this.behaviors.selectOnInit) {
    this.activateItem(this.container.find('.carrousel-item').first());
  }
  
  return true;
};

/**
 * Returns if the Carrousel is visible or not.
 * @return {boolean} true if the Carrousel is visible
 */
gtv.jq.Carrousel.prototype.isVisible = function() {
  if (this.topParent) {
    return this.topParent.is(':visible');
  }
  return false;
};

/**
 * Call the onBeforeScroll callback in case it's defined.
 */
gtv.jq.Carrousel.prototype.callOnBeforeScroll = function() {
  this.topParent.stop();
    
  if (typeof this.callbacks.onBeforeScroll == 'function') {
    this.callbacks.onBeforeScroll();
  }
};

/**
 * Switch the selectedItem css classes.
 * @param {jQuery.Element} the item to be selected.
 */
gtv.jq.Carrousel.prototype.updateSelectionClasses = function(newItem) {
	if (this.selectedItem) {
		this.selectedItem.removeClass(this.styles.selected);
	}
	newItem.addClass(this.styles.selected);
};

/**
 * Sets the item as active, calling the onActivate callback if defined.
 * @param {jQuery.Element} the item to be activated.
 */
gtv.jq.Carrousel.prototype.activateItem = function(item) {
  if (!item)
    return;
        
  if (this.activeItem) {
    this.activeItem.removeClass(this.styles.chosen);
  }

  if (typeof this.callbacks.onActivated == 'function') {
    this.callbacks.onActivated(item);
	this.selectedItem = item;
    this.activeItem = item;
    this.activeItem.addClass(this.styles.chosen);
  }
};

/**
 * Selects next Carrousel item.
 * @param {boolean} true if the item should be activated after selection.
 */
gtv.jq.Carrousel.prototype.selectNext = function(activate) {
  var carrousel = this;
	
  if (this.selectedItem) {
    var newItem = this.selectedItem.parent().nextAll('.carrousel-item-div').eq(0).find('.carrousel-item');
    if (newItem && newItem.length == 0) {
      newItem = this.container.find('.carrousel-item').first();
    }
	this.selectItem(this.selectedItem, newItem, function() {
		carrousel.updateSelectionClasses(newItem);
		if (activate) {
    		carrousel.activateItem(newItem);
    	}
	});
  }
};

/**
 * Selects previous Carrousel item.
 * @param {boolean} true if the item should be activated after selection.
 */
gtv.jq.Carrousel.prototype.selectPrevious = function(activate) {
  var carrousel = this;

  if (this.selectedItem) {
    var newItem = this.selectedItem.parent().prevAll('.carrousel-item-div').eq(0).find('.carrousel-item');
    if (newItem && newItem.length == 0) {
      newItem = this.container.find('.carrousel-item').last();
    }
    this.selectItem(this.selectedItem, newItem, function() {
		carrousel.updateSelectionClasses(newItem);
		if (activate) {
    		carrousel.activateItem(newItem);
    	}
	});
  }
};

/**
 * Selects a Carrousel item, scrolling if necesary.
 * @param {jQuery.Element} current selected item.
 * @param {jQuery.Element} new selected item.
 * @param {SynchronizedCallback.acquireCallback} callback to be called once the Carrousel
 * 		scrolling ends.
 */
gtv.jq.Carrousel.prototype.selectItem = function(selectedItem, newItem, getFinishCallback) {
  if (!newItem)
    return;

  if (!selectedItem)
    selectedItem = this.container.find('.carrousel-item').first();
    
  var selectedIndex = selectedItem.data('index');
  var newIndex = newItem.data('index');
    
  var carrousel = this;
    
  var onFinishScroll = function() {
    if (typeof carrousel.callbacks.onSelected == 'function') {
      carrousel.callbacks.onSelected(newItem);
    }
    var finishCallback = getFinishCallback();
    if (typeof finishCallback == 'function') {
      finishCallback();
    }
	carrousel.selectedItem = newItem;
  };
    
  if (this.behaviors.itemsToDisplay < this.items.length) { // May need to scroll
    if (newIndex == 0) { // Scrolling to first
      this.callOnBeforeScroll();
      this.topParent.animate({ scrollLeft: 0 }, onFinishScroll);
    }
    else {
      var newItemLeft = newItem.position().left - parseInt(newItem.parent().css("padding-left")) - parseInt(newItem.parent().css("margin-left"));
      var newItemRight = newItem.position().left + newItem.width() + parseInt(newItem.parent().css("padding-right")) + parseInt(newItem.parent().css("margin-right"));
      var parentLeft = this.topParent.position().left + parseInt(this.topParent.css("margin-left").replace("px", "")) + parseInt(this.topParent.css("padding-left").replace("px", ""));
      var parentRight = parentLeft + this.topParent.width() - parseInt(this.topParent.css("margin-right").replace("px", "")) - parseInt(this.topParent.css("padding-right").replace("px", ""));
      if (newItemLeft < parentLeft || newItemRight > parentRight) { // Need to scroll left or right
        this.callOnBeforeScroll();
        var scrollDelta = newIndex > selectedIndex ? (newItemRight - parentRight) : (newItemLeft - parentLeft);
        this.topParent.animate({ scrollLeft: this.topParent.scrollLeft() + scrollDelta }, onFinishScroll);
      }
      else { // No need to scroll
        onFinishScroll();
      }
    }
  }
  else { // No need to scroll
    onFinishScroll();
  }
};