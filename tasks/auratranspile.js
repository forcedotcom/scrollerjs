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

/*jslint indent: false */

module.exports = function(grunt) {
    'use strict';

    var DEPENDENCIES = 'build/dependencies.min.js',
        SCROLLER     = 'src/scroller.js',
        SURFACEM     = 'src/surface-manager.js',
        SCROLLBARS   = 'src/indicators-plugin.js',
        PTR          = 'src/pull-to-refresh.js',
        PTL          = 'src/pull-to-load-more.js',
        IL           = 'src/infinite-loading.js',
        EP           = 'src/endless-plugin.js',
        SP           = 'src/snap-plugin.js';


    grunt.registerTask('auratranspile', function () {
        var minDeps  = grunt.file.read(DEPENDENCIES),
            scroller = grunt.file.read(SCROLLER),
            sm       = grunt.file.read(SURFACEM),
            sc       = grunt.file.read(SCROLLBARS),
            ptr      = grunt.file.read(PTR),
            ptl      = grunt.file.read(PTL),
            il       = grunt.file.read(IL),
            ep       = grunt.file.read(EP),
            sp       = grunt.file.read(SP);

        var payload = [
            '_bootstrapScroller: function () {\n',
                '\tthis._initScrollerDependencies();\n',
                '\tthis._initScroller();\n',
                '\tthis._initScrollerPlugins();\n',
            '},\n',
            '_initScrollerDependencies: function () {\n',
                '\t' + minDeps + '\n',
            '},\n',
            '_initScrollerPlugins: function () {\n',
                '\tthis._initSurfaceManagerPlugin();\n',
                '\tthis._initPullToRefreshPlugin();\n',
                '\tthis._initPullToLoadMorePlugin();\n',
                '\tthis._initIndicatorsPlugin();\n',
                '\tthis._initInfiniteLoadingPlugin();\n',
                '\tthis._initEndlessPlugin();\n',
                '\tthis._initSnapPlugin();\n',
            '},\n',
            '_initScroller: function () {\n',
                '\t' + scroller + '\n',
            '},\n',
            '_initSurfaceManagerPlugin: function () {\n',
                '\t' + sm + '\n',
            '},\n',
            '_initIndicatorsPlugin: function () {\n',
                '\t' + sc + '\n',
            '},\n',
            '_initPullToRefreshPlugin: function () {\n',
                '\t' +  ptr + '\n' ,
            '},\n',
            '_initPullToLoadMorePlugin: function () {\n',
                '\t' +  ptl + '\n',
            '},\n',
            '_initInfiniteLoadingPlugin: function () {\n',
                '\t' +  il + '\n',
            '},\n',
            '_initEndlessPlugin: function () {\n',
                '\t' +  ep + '\n',
            '},\n',
            '_initSnapPlugin: function () {\n',
                '\t' +  sp + '\n',
            '}\n',
            '})',

        ].join('');

        grunt.file.write('build/aura-transpiled.js', payload);

    });
};