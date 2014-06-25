/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* 
* =======================================
* CONFIGURATION DOCS
* =======================================
*/

/**
* Config object that contains all of the configuration options for
* a scroller instance.
*
* This object is supplied by the implementer when instantiating a scroller. Some
* properties have default values if they are not supplied by the implementer.
* All the properties with the exception of `enabled` and `scroll` are saved 
* inside the instance and are accessible through the `this.opts` property.
*
* You can add your own options to be used by your own plugins.
* 
* @class config
* @static
*
**/

/**
* Toggle the state of the scroller. If `enabled:false`, the scroller will not 
* respond to any gesture events.
* 
* @property {Boolean} enabled
* @default true
*
**/

/**
* Define the duration in ms of the transition when the scroller snaps out of the boundaries.
*
*
* @property {Boolean} bounceTime
* @default 600
*
**/

/**
* Use CSS transitions to perform the scrolling. By default this is set to false and
* a transition based on `requestAnimationFrame` is used instead.
*
* Given a position and duration to scroll, it applies a `matrix3d()` transform, 
* a `transition-timing-function` (by default a cubic-bezier curve),
* and a `transition-duration` to make the element scroll.
*
* Most of the libraries use this CSS technique to create a synthetic scroller.
* While this is the most simple and leanest (that is, closest to the browser) implementation 
* possible, when dealing with large ammounts of DOM or really large scroller sizes, 
* performance will start to degrade due to the massive amounts of GPU, CPU, and memory
* needed to manipulate this large and complex region.
* 
* Moreover, this technique does not allow you to have any control over
* or give you any position information while scrolling, given that the only event 
* fired by the browser is a `transitionEnd`, which is triggered once the transition is over.
*
* **It's recommended to use this configuration when:** 
* 
*    - The scrolling size is reasonably small
*    - The content of the scroller is not changing often (little DOM manipulation)
*    - You don't need position information updates while scrolling
*
*
* @property {Boolean} useCSSTransition
* @default false
*
**/

/**
* 
* Enable dual listeners (mouse and pointer events at the same time). This is useful for devices
* where they can handle both types of interactions interchangeably. 
* This is set to false by default, allowing only one type of input interaction.
*
* @property {Boolean} dualListeners
* @default false
*
**/

/**
* 
* The minimum numbers of pixels necessary to start moving the scroller. 
* This is useful when you want to make sure that the user gesture
* has well-defined direction (either horizontal or vertical).
*
* @property {integer} minThreshold
* @default 5
*
**/

/**
* 
* The minimum number of pixels neccesary to calculate 
* the direction of the gesture.
*
* Ideally this value should be less than `minThreshold` to be able to 
* control the action of the scroller based on the direction of the gesture.
* For example, you may want to lock the scroller movement if the gesture is horizontal.
*
* @property {integer} minDirectionThreshold
* @default 2
*
**/

/**
* 
* Locks the scroller if the direction of the gesture matches one provided.
* This property is meant to be used in conjunction with `minThreshold and``minDirectionThreshold`.
*
* Valid values:
*  - horizontal
*  - vertical
*
* @property {boolean} lockOnDirection
*
**/

/**
* 
* Sets the scroller with the height of the items that the scroller contains.
*
* This property is used only when
* `scroll:vertical` and `gpuOptimization: true`.
* It helps the scroller calculate the positions of the surfaces 
* attached to the DOM, which slightly improves the performance of the scroller 
* (that is, the painting of that surface can occur asyncronously and outside of the JS execution).
*
* @plugin SurfaceManager
* @property {integer} itemHeight
*
**/

/**
* 
* Sets the scroller with the width of the items that the scroller contains.
*
* This property is used only when 
* `scroll:vertical` and `gpuOptimization: true`.
* It helps the scroller calculate the positions of the surfaces 
* attached to the DOM, which slightly improves the performance of the scroller 
* (that is, the painting of that surface can occur asyncronously and outside of the JS execution).
*
* @plugin SurfaceManager
* @property {integer} itemWidth
*
**/

/**
* 
* Bind the event handlers to the scroller wrapper.
* This is useful when using nested scrollers or when adding some custom logic 
* in a parent node as the event bubbles up.
*
* If set to true once the scroller is out of the wrapper container, it will stop scrolling.
*
* @property {integer} bindToWrapper
* @default false
*
**/

/**
* 
* Set the direction of the scroll.
* By default, vertical scrolling is enabled.
*
* Valid values:
*  - horizontal
*  - vertical
*
* @property {string} scroll
* @default vertical
*
**/

/**
*
* Activates pullToRefresh functionality.
* Note that you need to include the `PullToRefresh` plugin as part of your scroller bundle,
* otherwise this option is ignored.
* 
* @plugin PullToRefresh
* @property {boolean} pullToRefresh

* @default false
**/

/**
*
* Activates pullToLoadMore functionality.
* Note that you need to include the `PullToLoadMore` plugin as part of your scroller bundle,
* otherwise this option is ignored.
* 
* @plugin PullToLoadMore
* @property {boolean} pullToLoadMore
* @default false
*
**/

/**
*
* Creates scrollbars on the direction of the scroll.
* @plugin Indicators
* @property {boolean} scrollbars
* @default false
*
**/

/**
*
* Scrollbar configuration.
* 
* @plugin Indicators
* @property {Object} scrollbarsConfig
* @default false
*
**/

/**
*
* Activates infiniteLoading.
* 
* @plugin InfiniteLoading
* @property {boolean} infiniteLoading
* @default false
*
**/

/**
*
* Sets the configuration for infiniteLoading.
* The `infiniteLoading` option must be set to true.
* 
* @property {Object} infiniteLoadingConfig
*
**/

/**
*
* TODO: Debounce
* 
* @property {boolean} debounce
*
**/

/**
*
* TODO: GPUOptimization
* @plugin SurfaceManager
* @property {boolean} gpuOptimization
*
**/