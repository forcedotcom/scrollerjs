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
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadTasks('tasks');

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
                    'src/pull-to-refresh.js',
                    'src/pull-to-load-more.js',
                    'src/infinite-loading.js'
                ]),
                dest: 'build/scroller-hooks.js'
            },
            complete: {
                src: minDependencies.concat([
                    'src/scroller.js',
                    'src/surface-manager.js',
                    'src/pull-to-refresh.js',
                    'src/pull-to-load-more.js',
                    'src/infinite-loading.js',
                    'src/endless-plugin.js',
                    'src/snap-plugin.js',
                    'src/indicators-plugin.js'
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
        'build',
        'auratranspile'
    ]);
};