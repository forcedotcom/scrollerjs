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
        STYLES      = SCROLLER.styles,
        RAF         = w.requestAnimationFrame,
        CAF         = w.cancelAnimationFrame,

        //STATIC
        THRESOLD_DEGREES  = 10,
        DECELERATION_RATE = 1.5,
        THRESOLD_STOP     = 0.5;

    function Gyroscope() {}

    Gyroscope.prototype = {
        init: function () {
            this.on('_initialize', this._initGyroscope);
        },
        _initGyroscope: function () {
            var self = this;
            this._handleGirscope = window.addEventListener('deviceorientation', function () {
                self._gyroMove.apply(self, arguments);
            }, false);
        },
        _gyroMove: function (e) {
            if (!this._initDegree) {
                this._initDegree = {beta: e.beta, gamma: e.gamma};
                this._lastDegree = this.scrollVertical ? e.beta : e.gamma;
            }

            var self         = this,
                initBeta     = this._initDegree.beta,
                initGamma    = this._initDegree.gamma,
                currentBeta  = e.beta,
                currentGamma = e.gamma,
                deltaBeta    = Math.abs(initBeta - currentBeta),
                deltaGamma   = Math.abs(initGamma - currentGamma),
                newX         = 0,
                newY         = 0,
                delta, current, dist;

            if (this.scrollVertical) {
                dist    = 'distY';
                delta   = deltaBeta;
                current = currentBeta;
            } else {
                dist    = 'distX';
                delta   = deltaGamma;
                current = currentGamma;
            }

            if (delta > THRESOLD_DEGREES || this._rafGyro) {
                this._lastDegree = (this._lastDegree + current) / DECELERATION_RATE;
                this[dist] = this._lastDegree;

                if (Math.abs(this._lastDegree) < THRESOLD_STOP) {
                    CAF(this._rafGyro);
                    this._rafGyro = null;
                    this._isScrolling = false;
                    this[dist] = 0;
                } else if (!this._rafGyro) {
                    this._isScrolling = true;
                    this._rafGyro = RAF(function () {
                        self._gyroRaf();
                    });
                }
            }
            
        },
        _gyroRaf: function () {
            var self  = this,
                newX  = !this.scrollVertical ? this.x + this._lastDegree : 0,
                newY  = this.scrollVertical ? this.y + this._lastDegree : 0;

            if (!this.endless) {
                if (newX > 0) {
                    newX = 0;
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                }

                if (newY > 0) {
                    newY = 0;
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                }
            }

            this.x = newX;
            this.y = newY;

            this._translate(this.x, this.y);
            this._update();

            if (this._rafGyro) {
                this._rafGyro = RAF(function () {self._gyroRaf();});
            }
        }
    };

    PLUGINS.Gyroscope = Gyroscope;

}(window));