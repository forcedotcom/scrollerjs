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
    w || (w = window);

    var SCROLLER    = w.__S || (w.__S = {}), //NAMESPACE
        PLUGINS     = SCROLLER.plugins || (SCROLLER.plugins = {}),
        STYLES      = SCROLLER.styles;

    function ZoomFX() {}

    ZoomFX.prototype = {
        init: function () {
            this.on('_initialize', this._updateZoomFX);
            this.on('_update', this._updateZoomFX);
        },
        _updateZoomFX: function () {
            var self       = this,
                surfaces   = this.surfacesPositioned,
                current    = this._getPosition(),
                boundaries = this._getBoundaries(current.pos, current.size);

            surfaces.forEach(function (s) {self._applyFunctionToSurface(s, current, boundaries);});
        },
        _getNormalizedPosition: function (pos, start, size) {
            var percentage = Math.abs(1 - ((pos - start) / size * 0.7)),
                caped      = Math.max(0.1, percentage);
            return (1 - caped) * 1.1;
        },
        _applyFunctionToSurface: function (surface, current, boundaries) {
            var offset       = surface.offset,
                size         = current.size,
                pos          = -current.pos,
                top          = pos - size,
                bottom       = pos + size,
                percent      = this._getNormalizedPosition(offset, top, size),
                y            = this.scrollVertical  ? offset : 0,
                x            = !this.scrollVertical ? offset : 0,
                matrix;

            matrix = this._calculateMatrixEffect(x, y, percent);
            surface.dom.style[STYLES.transform] = matrix.toString();
        },

        _calculateMatrixEffect: function (x, y, normalizedPos) {
            var matrix    = new STYLES.matrix();

            matrix.m42 = y; // sets initial y
            matrix.m41 = x; // sets initial x
            matrix.m33 = 1; // sets a z coord so is "matrix3d"

            matrix = matrix.scale(normalizedPos);
            //matrix = matrix.rotate(0,0, (2 * (3 + normalizedPos)), 0.01);

            return matrix;
        }
    };

    PLUGINS.ZoomFX = ZoomFX;

}(window));