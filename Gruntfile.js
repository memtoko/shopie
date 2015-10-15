var path            = require('path'),
    escapeChar      = process.platform.match(/^win/) ? '^' : '\\',
    cwd             = process.cwd().replace(/( |\(|\))/g, escapeChar + '$1'),
    tmp             = path.resolve(cwd, 'tmp'),
    buildDirectory  = path.resolve(tmp, 'build'),
    distDirectory   = path.resolve(tmp, 'dist'),
    emberPath       = path.resolve(cwd + '/shopie/assets/node_modules/.bin/ember'),
    lintFiles = {
        ember: {
            files: {
                src: [
                    'shopie/assets/app/*/**.js',
                    'shopie/assets/config/*.js'
                ]
            },
            options: {
                jshintrc: 'shopie/assets/.jshintrc'
            }
        },
        frontend: {
            files: {
                src: [
                    'shopie/assets/frontend/mod/*/**.js'
                ]
            },
            options: {
                jshintrc: 'shopie/assets/.jshintrc'
            }
        }
    };

var configureGrunt  = function(grunt) {
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    var cfg = {
        paths: {
            buildDirectory: buildDirectory,
            distDirectory: distDirectory
        },

        jshint: lintFiles,

        sass: {
            options: {
                style: 'expanded',
                sourceMap: true,
                includePaths: [
                    'shopie/assets/bower_components/foundation/scss',
                	'shopie/assets/bower_components/octicons/octicons'
              	]
            },
            dist: {
               	files: {
               		'shopie/static/css/shopie.css': 'shopie/assets/frontend/scss/app.scss'
               	}
            }
        },
        // ### grunt-shell
        // Command line tools where it's easier to run a command directly than configure a grunt plugin
        shell: {
            ember: {
                command: function (mode) {
                    switch (mode) {
                        case 'init':
                            return 'echo Installing client dependencies... && npm install';

                        case 'prod':
                            return emberPath + ' build --environment=production --silent';

                        case 'dev':
                            return emberPath + ' build';

                        case 'test':
                            return emberPath + ' test --silent';
                    }
                },
                options: {
                    execOptions: {
                        cwd: path.resolve(process.cwd() + '/shopie/assets/'),
                        stdout: false
                    }
                }
            },
            // #### Run bower install
            // Used as part of `grunt init`. See the section on [Building Assets](#building%20assets) for more
            // information.
            bower: {
                command: path.resolve('bower --allow-root install'),
                options: {
                    stdout: true,
                    stdin: false
                }
            }
        },
        transpile: {
            client: {
                type: 'amd',
                moduleName: function(path) {
                    return 'shopie/' + path;
                },
                files: [{
                    expand: true,
                    cwd: 'shopie/assets/frontend',
                    src: ['**/*.js', '!loader.js', '!config-*.js'],
                    dest: '.tmp/ember-transpiled/'
                }]
            }
        },
        // ### grunt-concat-sourcemap
        // Concatenates transpiled ember app
        concat_sourcemap: {
            frontend: {
                src: ['.tmp/ember-transpiled/**/*.js', 'shopie/assets/frontend/loader.js'],
                dest: 'shopie/static/js/shopie.js',
                options: {
                    sourcesContent: true
                }
            }
        },

        clean: {
            tmp: {
                src: ['.tmp/**']
            }
        },
        concat: {
            vendor: {
                nonull: true,
                dest: 'shopie/static/js/vendor.js',
                src: [
                    'shopie/assets/bower_components/jquery/dist/jquery.js',
                    'shopie/assets/bower_components/jquery.cookie/jquery.cookie.js',
                    'shopie/assets/bower_components/jquery-placeholder/jquery.placeholder.js',
                    'shopie/assets/bower_components/foundation/js/vendor/modernizr.js',
                    'shopie/assets/bower_components/fastclick/lib/fastclick.js',
                    'shopie/assets/bower_components/foundation/js/foundation.js',
                    'shopie/static/js/libs/webfontloader.js',
                ]
            }
        },
        uglify: {
            prod: {
                options: {
                   sourceMap: true
                },
                files: {
                	'shopie/static/js/vendor.min.js': 'shopie/static/js/vendor.js'
                }
            }
        },
        // ### Config for grunt-contrib-copy
        // Prepare files for builds / releases
        copy: {
            dev: {
                files: [{
                    cwd: 'shopie/assets/dist/assets/',
                    src: ['**'],
                    dest: 'shopie/static/js/app/',
                    expand: true
                }]
            },
            prod: {
                files: [{
                    cwd: 'shopie/assets/dist/assets/',
                    src: ['**'],
                    dest: 'shopie/static/js/app/',
                    expand: true
                }]
            }
        },
    };

    grunt.initConfig(cfg);
    grunt.registerTask('default', 'Build JS & templates for development',
            ['shell:ember:dev', 'copy:dev']);
    grunt.registerTask('lint', 'Run the code style checks and linter', ['jscs']);
    grunt.registerTask('css', 'Compile sass file', ['sass:dist']);
    grunt.registerTask('jsfront', 'Compile js for frontend', ['clean:tmp', 'transpile', 'concat_sourcemap:frontend', 'concat:vendor'])
    grunt.registerTask('prod', 'Build for production', ['jsfront', 'css', 'uglify:prod']);
};

module.exports = configureGrunt;
