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

var COPYRIGHT = [
    '/*',
    ' * Copyright (C) 2013 salesforce.com, inc.',
    ' *',
    ' * Licensed under the Apache License, Version 2.0 (the "License");',
    ' * you may not use this file except in compliance with the License.',
    ' * You may obtain a copy of the License at',
    ' *',
    ' *         http://www.apache.org/licenses/LICENSE-2.0',
    ' *',
    ' * Unless required by applicable law or agreed to in writing, software',
    ' * distributed under the License is distributed on an "AS IS" BASIS,',
    ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
    ' * See the License for the specific language governing permissions and',
    ' * limitations under the License.',
    ' */',
    '',''
].join('\n');

module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    var minDependencies = [
        'src/utils/bootstrap.js',
        'src/utils/browser-support.js',
        'src/utils/browser-styles.js',
        'src/utils/helpers.js',
        'src/utils/raf.js',
        'src/utils/class-list.js',
        'src/utils/cubic-bezier.js'
    ];

    grunt.initConfig({
        clean: {
            build: {
                src: ['build']
            }
        },
        copy: {
            aura: {
                files : [
                    {src: 'src/utils/bootstrap.js',           dest: 'build/aura/scrollerLib/bootstrap.js'},
                    {src: 'src/utils/browser-support.js',     dest: 'build/aura/scrollerLib/browserSupport.js'},
                    {src: 'src/utils/browser-styles.js',      dest: 'build/aura/scrollerLib/browserStyles.js'},
                    {src: 'src/utils/helpers.js',             dest: 'build/aura/scrollerLib/helpers.js'},
                    {src: 'src/utils/raf.js',                 dest: 'build/aura/scrollerLib/polyfillRaf.js'},
                    {src: 'src/utils/class-list.js',          dest: 'build/aura/scrollerLib/polyfullClassList.js'},
                    {src: 'src/utils/cubic-bezier.js',        dest: 'build/aura/scrollerLib/CubicBezier.js'},

                    {src: 'src/scroller.js',                  dest: 'build/aura/scrollerLib/ScrollerJS.js'},

                    {src: 'src/surface-manager.js',           dest: 'build/aura/scrollerLib/SurfaceManager.js'},
                    {src: 'src/plugins/pull-to-refresh.js',   dest: 'build/aura/scrollerLib/PullToRefresh.js'},
                    {src: 'src/plugins/pull-to-load-more.js', dest: 'build/aura/scrollerLib/PullToLoadMore.js'},
                    {src: 'src/plugins/infinite-loading.js',  dest: 'build/aura/scrollerLib/InfiniteLoading.js'},
                    {src: 'src/plugins/endless-plugin.js',    dest: 'build/aura/scrollerLib/EndlessPlugin.js'},
                    {src: 'src/plugins/indicators-plugin.js', dest: 'build/aura/scrollerLib/IndicatorsPlugin.js'},
                    {src: 'src/plugins/snap-plugin.js',       dest: 'build/aura/scrollerLib/SnapPlugin.js'}
                ],
                options: {
                    process: function (content, path) {
                        var matches = content.match(/(?=\(function)\(([^]+?)( ?\(window\)\));?/),
                            body    = matches[1];

                        return COPYRIGHT + body;

                    }
                }
            }
        },
        concat: {
            options: {
                process: function(src, filepath) {
                    // Creates a header comment for each module
                    var path    = filepath.split('/'),
                        padding = '========================================',
                        name    = path[path.length - 1],
                        head    = '/*\n* ' + padding + '\n* MODULE: ' + name + '\n* ' + padding + '\n*\/\n';

                    return head + src;
                }
            },
            dependencies: {
                src: minDependencies,
                dest: 'build/dependencies.js'
            },
            minimal: {
                src: minDependencies.concat([
                    'src/scroller.js'
                ]),
                dest: 'build/scroller-minimal.js'
            },
            basic: {
                src: minDependencies.concat([
                    'src/scroller.js',
                    'src/surface-manager.js'
                ]),
                dest: 'build/scroller-basic.js'
            },
            hooks: {
                src: minDependencies.concat([
                    'src/scroller.js',
                    'src/surface-manager.js',
                    'src/plugins/pull-to-refresh.js',
                    'src/plugins/pull-to-load-more.js',
                    'src/plugins/infinite-loading.js'
                ]),
                dest: 'build/scroller-hooks.js'
            },
            complete: {
                src: minDependencies.concat([
                    'src/scroller.js',
                    'src/surface-manager.js',
                    'src/plugins/pull-to-refresh.js',
                    'src/plugins/pull-to-load-more.js',
                    'src/plugins/infinite-loading.js',
                    'src/plugins/endless-plugin.js',
                    'src/plugins/snap-plugin.js',
                    'src/plugins/indicators-plugin.js'
                ]),
                dest: 'build/scroller-complete.js'
            }
        },

        uglify: {
            options: {
                compress: {
                    dead_code: true
                }
            },
            scrollerVersions: {
                files: [
                    {
                        expand : true,      // Enable dynamic expansion.
                        cwd    : 'build/',  // Src matches are relative to this path.
                        src    : ['*.js'],  // Actual pattern(s) to match.
                        dest   : 'build/',  // Destination path prefix.
                        ext    : '.min.js', // Dest filepaths will have this extension.
                    }
                ]
            },
            plugins: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '*-plugin.js',
                            'surface-manager.js',
                            'pull-to-refresh.js',
                            'pull-to-load-more.js',
                            'infinite-loading.js'
                        ],
                        dest: 'build/plugins',
                        ext: '.min.js',
                    }
                ]
            }
        }
    });
    
    grunt.registerTask('build', [
        'clean',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('build:plugins', [
        'clean',
        'uglify:plugins'
    ]);

    grunt.registerTask('build:minimal', [
        'clean',
        'concat:minimal',
        'uglify:scrollerVersions'
    ]);

    grunt.registerTask('build:basic', [
        'clean',
        'concat:basic',
        'uglify:scrollerVersions'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
    
    grunt.registerTask('build:aura', [
        'clean',
        'copy:aura'
    ]);
};