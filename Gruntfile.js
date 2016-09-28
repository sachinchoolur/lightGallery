'use strict';
module.exports = function(grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-banner');

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed Apache 2.0 */\n',

        // Task configuration.
        clean: {
            files: ['dist']
        },

        /* jshint ignore:start */
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            basic_and_extras: {
                files: {
                    'dist/css/<%= pkg.name %>.css': ['src/css/<%= pkg.name %>.css'],
                    'dist/css/lg-fb-comment-box.css': ['src/css/lg-fb-comment-box.css'],
                    'dist/css/lg-transitions.css': ['src/css/lg-transitions.css']/*,
                    'dist/js/<%= pkg.name %>.js': ['src/js/<%= pkg.name %>.js'],
                    'dist/js/<%= pkg.name %>-all.js': ['src/js/<%= pkg.name %>.js', 'src/js/lg-autoplay.js', 'src/js/lg-fullscreen.js', 'src/js/lg-pager.js', 'src/js/lg-thumbnail.js', 'src/js/lg-video.js', 'src/js/lg-zoom.js', 'src/js/lg-hash.js'],
                    'dist/js/lg-autoplay.js': ['src/js/lg-autoplay.js'],
                    'dist/js/lg-fullscreen.js': ['src/js/lg-fullscreen.js'],
                    'dist/js/lg-pager.js': ['src/js/lg-pager.js'],
                    'dist/js/lg-thumbnail.js': ['src/js/lg-thumbnail.js'],
                    'dist/js/lg-video.js': ['src/js/lg-video.js'],
                    'dist/js/lg-zoom.js': ['src/js/lg-zoom.js'],
                    'dist/js/lg-hash.js': ['src/js/lg-hash.js']*/
                }
            }
        },
        /* jshint ignore:end */
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: [{
                    src: 'dist/js/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.min.js'
                }/*, {
                    src: ['src/js/<%= pkg.name %>.js', 'src/js/lg-autoplay.js', 'src/js/lg-fullscreen.js', 'src/js/lg-pager.js', 'src/js/lg-thumbnail.js', 'src/js/lg-video.js', 'src/js/lg-zoom.js', 'src/js/lg-hash.js'],
                    dest: 'dist/js/<%= pkg.name %>-all.min.js'
                }, {
                    src: 'src/js/lg-autoplay.js',
                    dest: 'dist/js/lg-autoplay.min.js'
                }, {
                    src: 'src/js/lg-fullscreen.js',
                    dest: 'dist/js/lg-fullscreen.min.js'
                }, {
                    src: 'src/js/lg-pager.js',
                    dest: 'dist/js/lg-pager.min.js'
                }, {
                    src: 'src/js/lg-thumbnail.js',
                    dest: 'dist/js/lg-thumbnail.min.js'
                }, {
                    src: 'src/js/lg-video.js',
                    dest: 'dist/js/lg-video.min.js'
                }, {
                    src: 'src/js/lg-zoom.js',
                    dest: 'dist/js/lg-zoom.min.js'
                }, {
                    src: 'src/js/lg-hash.js',
                    dest: 'dist/js/lg-hash.min.js'
                }*/]
            }
        },
        umd: {
            all: {
                options: {
                    src: 'src/js/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.js',
                    deps: {
                        args : ['$'],
                        'default': ['$'],
                        amd: {
                            indent: 6,
                            items: ['jquery'],
                            prefix: '\'',
                            separator: ',\n',
                            suffix: '\''
                        },
                        cjs: {
                            indent: 6,
                            items: ['jquery'],
                            prefix: 'require(\'',
                            separator: ',\n',
                            suffix: '\')'
                        },
                        global: {
                            items: ['jQuery'],
                        },
                        pipeline: {
                            indent: 0,
                            items : ['jquery'],
                            prefix: '//= require ',
                            separator: '\n',
                        }
                    }
                }
            }
        },

        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['dist/js/<%= pkg.name %>.js']
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    'dist/css/<%= pkg.name %>.min.css': ['src/css/<%= pkg.name %>.css']
                }, {
                    'dist/css/lg-fb-comment-box.min.css': ['src/css/lg-fb-comment-box.css']
                },{
                    'dist/css/lg-transitions.min.css': ['src/css/lg-transitions.css']
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**'],
                    dest: 'dist/img/'
                }, {
                    expand: true,
                    cwd: 'src/fonts/',
                    src: ['**'],
                    dest: 'dist/fonts/'
                }]
            }
        },
        qunit: {
            all: {
                options: {
                    urls: ['http://localhost:9000/test/<%= pkg.name %>.html']
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/js/.jshintrc'
                },
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
        },
        sass: {
            dist: {
                options: { // Target options
                    style: 'expanded'
                },
                files: {
                    'src/css/lightgallery.css': 'src/sass/lightgallery.scss'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            },
            css: {
                files: 'src/**/*.scss',
                tasks: ['sass']
            }
        },
        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 9000
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['clean', 'jshint', 'connect', 'qunit', 'concat', 'umd:all', 'uglify', 'sass', 'cssmin', 'copy', 'usebanner'/*, 'watch'*/]);
    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
