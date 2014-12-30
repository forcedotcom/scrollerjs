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
(function (w) {
    'use strict';

    var SCROLLER = w.__S || (w.__S = {}), //NAMESPACE
        PLUGINS  = SCROLLER.plugins || (SCROLLER.plugins = {}),
        STYLES   = SCROLLER.styles,
        HELPERS  = SCROLLER.helpers,
        RAF      = w.requestAnimationFrame,
        INITIAL_SURFACES = 10;
    
    function SurfaceManager() {}

    SurfaceManager.prototype = {
        /* Bootstrap function */
        init: function () {
            this.surfacesPositioned = [];
            this.surfacesPool       = [];
            this.items              = [];

            this.on('_initialize', this._initializeSurfaceManager);
            this.on('_update', this._updateSurfaceManager);
            this.on('destroy', this._destroySurfaceManager);
        },
        _initializeSurfaceManager: function () {
            this._bootstrapItems();
            this._initializeSurfaces();
            this._setActiveOffset();
            this._initializePositions();
            this._setInfiniteScrollerSize();
        },
        _destroySurfaceManager: function () {
            var docfrag = w.document.createDocumentFragment();

            this.items.forEach(function (i) {docfrag.appendChild(i.dom);});
            this.scroller.innerHTML = '';
            this.scroller.appendChild(docfrag);

            this.items              = [];
            this.surfacesPool       = [];
            this.surfacesPositioned = [];
        },
        _bootstrapItems: function () {
            var skipPtr  = this.opts.pullToRefresh ? 1 : 0,
                domItems = Array.prototype.slice.call(this.scroller.children, skipPtr),
                size     = domItems.length,
                items    = [],
                item, itemStyle, i;

            var offset = 0;
            if (size) {
                for (i = 0; i < size; i++) {
                    item = domItems[i];
                    items[i] = {dom : item, offset:offset, width: this.scroller.children[0].offsetWidth};
                    offset += items[i].width;
                    this.scroller.removeChild(item);
                }
            }

            this.items = items;
        },
        _setActiveOffset: function () {
            this.activeOffset = 0.9 * (this.scrollVertical ? this.wrapperHeight: this.wrapperWidth);
        },
        _initializePositions: function () {
            var items         = this.items,
                windowSize    = this.scrollVertical ? this.wrapperHeight : this.wrapperWidth,
                positioned    = this.surfacesPositioned,
                itemsSize     = items.length,
                sizeNotCover  = true,
                sizeNeeded    = windowSize + 2 * this.activeOffset,
                heightSum     = 0,
                i = 0,
                item, surface, height;

            for (; i < itemsSize && sizeNotCover; i++) {
                item          = items[i];
                surface       = this._getAvailableSurface();
                heightSum     += this._attachItemInSurface(item, surface, {index: i, offset: heightSum});
                sizeNotCover  = heightSum < sizeNeeded;
                positioned[i] = surface;
            }
        },
        
        _createSurfaceDOM: function (options, domContent) {
            options || (options = {});

            var rawSurface   = w.document.createElement('div'),
                surfaceStyle = rawSurface.style;

            rawSurface.className = options['class'] ? 'surface ' + options['class'] : 'surface';
            surfaceStyle.height  = options.height && options.height + 'px';
            surfaceStyle.width   = options.width && options.width + 'px';
            surfaceStyle[STYLES.transform] = 'scale3d(0.0001, 0.0001, 1)';

            if (domContent) {
                rawSurface.appendChild(domContent);
            }

            return rawSurface;
        },
        
        _createSurface: function (options, domContent) {
            options || (options = {});

            var surfaceDOM = this._createSurfaceDOM(options, domContent);

            return {
                dom          : surfaceDOM,
                contentIndex : options.index,
                content      : domContent,
                state        : 0,
                offset       : 0,
                width        : 0,
                height       : 0
            };
        },
        _createSurfaces : function (size, options) {
            options || (options = {});

            var surfaces = [], i;

            for ( i = 0; i < size; i++) {
                surfaces.push(this._createSurface(options));
            }

            return surfaces;
        },
        _getSurfaceTotalOffset: function (surface) {
            if (!surface)
                return 0;
            return surface.offset + (this.scrollVertical ? surface.height : surface.width);
        },
        _attachItemInSurface: function (item, surface, config) {
            var offset = config.offset,
                index  = config.index,
                width, height, offsetX = 0, offsetY = 0;

            // recalc styles
            surface.dom.appendChild(item.dom);

            // this will force a layout
            height = surface.dom.offsetHeight;
            width  = surface.dom.offsetWidth;

            if (this.scrollVertical) {
                offsetY = config.preCalculateSize ?  offset - height : offset;
            } else {
                offsetX = config.preCalculateSize ?  offset - width : offset;
            }
            
            surface.dom.style[STYLES.transform] = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + offsetX +',' + offsetY + ', 0, 1)';

            surface.state       = 1;
            surface.contentIndex = index;
            surface.content      = item;
            surface.height       = height;
            surface.width        = width;
            surface.offset       = offsetY || offsetX;

            return this.scrollVertical ? height : width;
        },
        _dettachItemInSurface: function (surface) {
            surface.state        = 0;
            surface.contentIndex = null;
            surface.content      = null;
            surface.height       = null;
            surface.width        = null;
            surface.offset       = null;
            
            surface.dom.removeChild(surface.dom.firstChild);
            
        },
        _attachSurfaces: function (surfaces) {
            var docfrag = w.document.createDocumentFragment(),
                surface, i;

            for (i = 0 ; i < surfaces.length; i++) {
                surface = surfaces[i];
                docfrag.appendChild(surface.dom);
                this.surfacesPool.push(surface);
            }

            this.scroller.appendChild(docfrag);
        },
        _getAvailableSurface: function () {
            var pool = this.surfacesPool,
                surfaces, surface;

            for (var i = 0; i < pool.length; i++) {
                surface = pool[i];
                if (!surface.state) {
                    return surface;
                }
            }

            // if we arrive here no surface available
            surfaces = this._createSurfaces(1);
            this._attachSurfaces(surfaces);

            // call again with the new surfaces
            return this._getAvailableSurface();

        },
        _emptyScroller: function () {
            return !(this.opts.pullToLoadMore ? this.items.length - 1 : this.items.length);
        },
        _initializeSurfaces: function () {
            var items       = this.items,
                numSurfaces = Math.min(INITIAL_SURFACES, items.length),
                surfaces    = this._createSurfaces(numSurfaces);

            this._attachSurfaces(surfaces);
        },
        _resetSurfaces: function () {
            var surfaces      = this.surfacesPositioned,
                surfacesCount = surfaces.length,
                surface;

            for (var i = 0; i < surfacesCount; i++) {
                surface = surfaces.shift();
                this._dettachItemInSurface(surface);
            }
        },
        _mod: function (index) {
            return index;
        },
        _positionBeingUsed: function (index) {
            var topSurface       = this._positionedSurfacesFirst(),
                bottomSurface    = this._positionedSurfacesLast();

            return index === topSurface.contentIndex || index === bottomSurface.contentIndex;
        },
        _positionedSurfacesFirst: function () {
            return this.surfacesPositioned[0];
        },
        _positionedSurfacesLast: function () {
            var p = this.surfacesPositioned;
            return p[p.length - 1];
        },
        _positionedSurfacesPush: function (boundaries) {
            var bottomSurface    = this._positionedSurfacesLast(), surface;
            if (!bottomSurface)
            {
                var index = 0;
                for (var i=0; i<this.items.length-1; i++)
                {
                    if (this.items[i].offset > boundaries.top)
                    {
                        index = i;
                        break;
                    }
                }
                        
                var  payload    = 
                        {index: index, offset: this.items[index].offset};
            }
            else
            {
                var index            = this._mod(bottomSurface.contentIndex + 1),
                    payload          = {index: index, offset: this._getSurfaceTotalOffset(bottomSurface)};
            }

            if (!bottomSurface || !this._positionBeingUsed(index)) {
                surface = this._getAvailableSurface();
                this._attachItemInSurface(this.items[index], surface, payload);
                this.surfacesPositioned.push(surface);
                w.DEBUG.log('PUSH   ', Date.now());
                return surface;

            } else {
                return bottomSurface;
            }
        },
        _positionedSurfacesPop: function () {
            w.DEBUG.log('POP    ', Date.now());
            var surface = this.surfacesPositioned.pop();
            this._dettachItemInSurface(surface);
            return this._positionedSurfacesLast();
        },
        _positionedSurfacesUnshift: function (boundaries) {
            // Si no hay topSurface, hay que traerse de this.items el item
            // que esté en el offset dentro del boundaries
            // los items deberían tener almacenados en el array el offset
            var topSurface = this._positionedSurfacesFirst(), surface;
            if (!topSurface)
            {
                var index = 0;
                for (var i=0; i<this.items.length-1; i++)
                    if (this.items[i].offset > boundaries.bottom)
                    {
                        index = i;
                        break;
                    }
                        
                var  payload    = 
                        {index: index, offset: this.items[index].offset, preCalculateSize: true};
            }
            else
            {
                var  index      = this._mod(topSurface.contentIndex - 1),
                    payload    = 
                        {index: index, offset: topSurface.offset, preCalculateSize: true};
            }

            if (!topSurface || !this._positionBeingUsed(index)) {
                surface = this._getAvailableSurface();
                this._attachItemInSurface(this.items[index], surface, payload);
                this.surfacesPositioned.unshift(surface);
                w.DEBUG.log('UNSHIFT', Date.now());
                return surface;
            } else {
                return topSurface;
            }
        },
        _positionedSurfacesShift: function () {
            w.DEBUG.log('SHIFT  ', Date.now());
            var surface = this.surfacesPositioned.shift();
            this._dettachItemInSurface(surface);
            return this._positionedSurfacesFirst();
        },
        _itemsLeft: function (end) {
            if (this.surfacesPositioned.length == 0)
                return 0;
            var firstIndex = this._positionedSurfacesFirst().contentIndex,
                lastIndex  = this._positionedSurfacesLast().contentIndex,
                count      = this.items.length - 1,
                left;

            left = end === 'top' ? firstIndex > 0
                 : end === 'bottom' ? lastIndex < count
                 : firstIndex > 0 || lastIndex < count;

            //DEBUG.log(firstIndex, lastIndex, this.items.length, end ,'>>>' , left);

            return left;
        },
        _getBoundaries: function (coord, size) {
            var offsetSize       = this.activeOffset,
                abs             = Math.abs(coord.pos),
                absMax          = Math.abs(coord.maxScroll);

            if (abs>absMax)
                abs = absMax;

            return {
                top    : abs - offsetSize > 0 ? abs - offsetSize : 0,
                bottom : abs + size + offsetSize
            };
        },
        _updateAllowed: function (current) {
            return current.pos < 0 && ((this._isScrolling || Math.abs(current.dist) > 10));
        },
        _recycleSurface: function (side) {
            return true;
        },
        _getPosition: function (vertical) {
            if (this.scrollVertical) {
                return {
                    pos  : this.y,
                    dist : this.distY,
                    size : this.wrapperHeight,
                    maxScroll : this.maxScrollY
                };
            } else {
                return {
                    pos  : this.x,
                    dist : this.distX,
                    size : this.wrapperWidth,
                    maxScroll : this.maxScrollX
                };
            }
        },
        _updateSurfaceManager: function () {
            if (this._emptyScroller()) {
                return;
            }

            var self             = this,
                current          = this._getPosition(),
                boundaries       = this._getBoundaries(current, current.size),
                itemsLeft        = this._itemsLeft('bottom'),
                // surfaces
                topSurface       = this._positionedSurfacesFirst(),
                topSurfaceEnd    = this._getSurfaceTotalOffset(topSurface),
                bottomSurface    = this._positionedSurfacesLast(),
                bottomSurfaceEnd = bottomSurface.offset,
                // vars
                yieldTask        = false,
                inUse            = false,
                surface, index, payload;

            // Don't update anything is the move gesture is not large enough and we are not scrolling
            if (!this._updateAllowed(current)) {
                return;
            }

            // IF we are in the middle of an animation (_isScrolling: true), 
            // AND there is no more items to swap
            // AND the scroll position is beyond the scrollable area (+ 1/4 of the size)
            // THEN: RESET POSITION
            if (this._isScrolling && !itemsLeft && current.pos < (current.maxScroll - (current.size / 4))) {
                this._isAnimating  = false;
                this._isScrolling  = false;
                this._stopMomentum();
                RAF(function () {
                    self._resetPosition(self.opts.bounceTime);
                });
            }
            // Scrolling down/right
            if (current.dist < 0) {
                // SHIFT | Remove elements from the top that are out of the upperBound region.
                while (topSurface && boundaries.top > topSurfaceEnd && this._recycleSurface('top')) {
                    topSurface    = this._positionedSurfacesShift();
                    if (topSurface)
                        topSurfaceEnd = this._getSurfaceTotalOffset(topSurface);
                    yieldTask     = true;
                }
                bottomSurface    = this._positionedSurfacesLast();

                // PUSH | Add elements to the end when the last surface is inside the lowerBound limit.
                while (!bottomSurface || (this._itemsLeft('bottom') && 
                            bottomSurfaceEnd < boundaries.bottom && 
                            !inUse)) {
                    surface = this._positionedSurfacesPush(boundaries);
                    if (surface === bottomSurface) {
                        inUse = true;
                    } else {
                        bottomSurface    = surface;
                        bottomSurfaceEnd = bottomSurface.offset;
                        yieldTask        = true;
                    }
                }
                
                if (yieldTask) {
                    return this._setInfiniteScrollerSize();
                }


            // User is Scrolling up/left
            } else {
                // POP | Remove from the end
                while (bottomSurfaceEnd && bottomSurfaceEnd > boundaries.bottom && this._itemsLeft('top') && this._recycleSurface('bottom')) {
                    bottomSurface = this._positionedSurfacesPop();
                    if (bottomSurface)
                        bottomSurfaceEnd = bottomSurface.offset;
                    yieldTask        = true;
                }
                topSurface       = this._positionedSurfacesFirst();

                // UNSHIFT | Add elements on the beggining of the list
                while (!topSurface || (topSurface.offset > boundaries.top && !inUse)) {
                    surface = this._positionedSurfacesUnshift(boundaries);
                    if (surface === topSurface) {
                        inUse = true;
                    } else {
                        topSurface    = surface;
                        topSurfaceEnd = this._getSurfaceTotalOffset(topSurface);
                        yieldTask     = true;
                    }
                }
                
                if (yieldTask) {
                    return this._setInfiniteScrollerSize();
                }

            }

            if (yieldTask) {
                return this._setInfiniteScrollerSize();
            }
        },
        _setInfiniteScrollerSize: function () {
            var positioned = this.surfacesPositioned,
                items      = this.items,
                size       = this.scrollVertical ? this.wrapperHeight : this.wrapperWidth,
                ptlEnabled = this.opts.pullToLoadMore && this._ptlIsEnabled(),
                lastPos    = ptlEnabled ? positioned.length - 3 : positioned.length - 1,
                last       = positioned[lastPos],
                itemsSize  = this.opts.pullToLoadMore ? items.length - 1 : items.length,
                itemsLeft, offset, ptrSize;

            if (positioned.length <= 0) {
                return;
            }

            itemsLeft = last.contentIndex < itemsSize - (ptlEnabled ? 2 : 1);
            offset    = last.offset + (this.scrollVertical ? last.height : last.width);

            if (this.scrollVertical) {
                this.maxScrollY = itemsLeft ? Number.NEGATIVE_INFINITY : size - offset;
                this.maxScrollY = this.maxScrollY > 0 ? 0 : this.maxScrollY;
            } else {
                this.maxScrollX = itemsLeft ? Number.NEGATIVE_INFINITY : size - offset;
                this.maxScrollX = this.maxScrollX > 0 ? 0 : this.maxScrollX;
            }

            this.hasScrollY = this.maxScrollY < 0;
            this.hasScrollX = this.maxScrollX < 0;

            if (ptlEnabled) {
                this._setInfinitePullToShowMoreSpacer(offset);
            }
        },
         _setInfinitePullToShowMoreSpacer: function (bottomOffset) {
            if (this.ptlSpacerSize <= 0) {
                return;
            }
            var diff        = this.wrapperHeight - bottomOffset,
                spaceBottom = diff > 0,
                positioned  = this.surfacesPositioned,
                last        = positioned[positioned.length -1],
                surface     = last && last.dom;

            this.ptlSpacerSize = spaceBottom ? diff : 0;
            this.ptlSpacer.style.height = this.ptlSpacerSize + 'px';

            if (surface) {
                diff = spaceBottom ? this.wrapperHeight : bottomOffset;
                surface.style[STYLES.transform] = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,' + diff + ', 0, 1)';
            }
        },
        _appendPullToLoad: function () {
            var ptr_container = this._createPullToLoadMarkup();
            this.items.push({ptl: true, dom: ptr_container});

            this.ptlDOM  = ptr_container;
            this.ptlIcon = ptr_container.firstChild;

            this._ptlSnapTime = 200; 
            this._ptlEnabled  = true;

            if (this.maxScrollY >= 0) {
                this._ptlToggle('disable');
            }
        },
        resize: function () {
            var self = this;
            this._stopMomentum();
            RAF(function (t) {
                self._setWrapperSize();
                self.refresh();
                self._scrollTo(0, 0);
            });
        },
        refresh: function () {
            this._resetSurfaces();
            this._initializePositions();
            this._setInfiniteScrollerSize();
        },
        _prependData: function (data) {
            var item, i;
            for (i = 0; i < data.length; i++) {
                item = {dom: data[i]};
                this.items.unshift(item);
            }
        },
        _appendData: function (data) {
            var ptl, item, i, spacer;

            //remove pulltoLoadMoreSurface
            if (this.opts.pullToLoadMore) {
                ptl    = this.items.pop();
                this._positionedSurfacesPop();
                spacer = this.items.pop();
                this._positionedSurfacesPop();
            }

            // Calculate offset per item
            var offset = this.items[this.items.length-1].offset+
                this.items[this.items.length-1].width;

            var w = document.createElement("div");
            w.style.visibility = "hidden";
            w.style.position = "absolute";
            w.style.display = "inline-block";
            document.lastChild.appendChild(w);

            for (i = 0; i < data.length; i++) {
                w.appendChild(data[i]);
                item = {dom: data[i], offset:offset, width:w.offsetWidth};
                offset += w.offsetWidth;
                w.removeChild(item.dom);
                this.items.push(item);
            }
            w.remove();

            if (this.opts.pullToLoadMore) {
                //add the back as the last item again
                this.items.push(spacer);
                this.items.push(ptl);
            }
        },
        prependItems: function (items) {
            var parsedData = HELPERS.parseDOM(items);
            if (parsedData) {
                this._prependData(parsedData);
                this.refresh();    
            }
        },
        appendItems: function (items) {
            var parsedData = HELPERS.parseDOM(items);
            if (parsedData) {
                this._appendData(parsedData);
                this._updateSurfaceManager();
            }
        }
    };   

    SCROLLER.SurfaceManager = PLUGINS.SurfaceManager = SurfaceManager;
    
}(window));