module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('colors');

    // internal config
    var config = require('config.json')(),
        appConfig = {
            app: config.path.app,
            dist: config.path.dist,
        };

    grunt.initConfig({
        // project settings
        server: appConfig,
        // execute the express server
        express: {
            options: {},
            web: {
                options: {
                    script: './server.js',
                }
            },
        },

        // watch files for changes and run appropriate tasks
        watch: {
            // rebuild assets on change
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= server.app %>/**/*.js'],
                tasks: ['build-js']
            },
            css: {
                files: ['<%= server.app %>/**/*.{scss,sass}'],
                tasks: ['build-scss']
            },
            views: {
                files: ['<%= server.app %>/**/*.html'],
                tasks: ['build-html']
            },
            images: {
                files: ['<%= server.app %>/assets/images/**/*'],
                tasks: ['copy:dist:images']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['build']
            },

            // restart server on API changes
            web: {
                files: [
                    'api/**/*.js',
                    'server.js'
                ],
                tasks: [
                    'express:web'
                ],
                options: {
                    nospawn: true,
                    atBegin: true
                }
            }
        },

        // remove distribution files
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: '<%= server.dist %>/'
                }]
            },
            tmp: {
                files: [{
                    dot: true,
                    src: '.tmp'
                }]
            },
            js: {
                files: [{
                    dot: true,
                    src: '<%= server.dist %>/**/*.js'
                }]
            },
            css: {
                files: [{
                    dot: true,
                    src: '<%= server.dist %>/**/*.css'
                }]
            },
            html: {
                files: [{
                    dot: true,
                    src: '<%= server.dist %>/**/*.html'
                }]
            }
        },

        // concatenate files to reduce the number of requests
        concat: {
            js: {
                files: {
                    '<%= server.dist %>/scripts/main.js': [
                        '<%= server.app %>/core/app.js',
                        '<%= server.app %>/core/api.js,
                        '<%= server.app %>/scripts/services.js',
                        '<%= server.app %>/scripts/helpers.js',
                        '<%= server.app %>/**/*.js'
                    ]
                }
            },
            css: {
                files: {
                    '<%= server.dist %>/styles/main.css': [
                        '.tmp/**/main.css',
                        '.tmp/**/*.css'
                    ]
                }
            }
        },

        // append vendor prefixes
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    src: '<%= server.dist %>/styles/*.css'
                }]
            }
        },

        // inject third-party components into index.html
        wiredep: {
            app: {
                src: ['<%= server.app %>/core/index.html'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= server.app %>/**/*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },

        // compile css
        compass: {
            options: {
                sassDir: '.tmp/styles',
                cssDir: '.tmp/styles',
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // copy files
        copy: {
            images: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    src: '<%= server.app %>/assets/images/**/*',
                    dest: '<%= server.dist %>/images/'
                },
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    src: '<%= server.app %>/assets/images/favicon.ico',
                    dest: '<%= server.dist %>/'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    src: '<%= server.app %>/**/*.{sass, scss}',
                    dest: '.tmp/styles/'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    src: '<%= server.app %>/core/index.html',
                    dest: '<%= server.dist %>/'
                },
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    src: '<%= server.app %>/**/*.html',
                    dest: '<%= server.dist %>/views/'
                }
                ]
            }
        }
    });

    // PRIMARY TASKS
    // start the server
    grunt.registerTask('serve', 'Starting server...', function() {
        grunt.task.run([
            'watch'
        ]);
    });

    // build and run the app
    grunt.registerTask('app', 'Building and starting server...', function() {
        grunt.task.run([
            'build',
            'watch'
        ]);
    });

    // SECONDARY TASKS
    // rebuild everything
    grunt.registerTask('build', [
        'clean',
        'wiredep',
        'copy',
        'concat:js',
        'compass',
        'concat:css',
        'autoprefixer',
        'clean:tmp',
    ]);

    // rebuild js
    grunt.registerTask('build-js', [
        'clean:js',
        'concat:js'
    ]);

    // rebuild scss
    grunt.registerTask('build-scss', [
        'clean:css',
        'copy:css',
        'compass',
        'concat:css',
        'autoprefixer',
        'clean:tmp'
    ]);

    // rebuild html
    grunt.registerTask('build-html', [
        'clean:html',
        'wiredep',
        'copy:html'
    ]);
};
