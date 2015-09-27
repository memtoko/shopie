var configureGrunt = function(grunt) {
    var cfg = {
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourceMap: true,
                    includePaths: [
                        'bower_components/foundation/scss',
                        'bower_components/octicons/octicons'
                    ]
                },
                files: {
                    'shopie/static/css/app.css' : 'shopie/static/scss/app.scss'
                }
            }
        },
        watch: {
            css: {
                files: 'shopie/static/scss/*/*.scss',
                tasks: ['sass']
            }
        },
        concat: {
            vendor: {
                nonull: true,
                dest: 'shopie/static/js/vendor.js',
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/foundation/js/vendor/modernizr.js',
                    'bower_components/foundation/js/vendor/fastclick.js',
                    'bower_components/foundation/js/foundation.js'
                ]
            }
        }
    };

    grunt.initConfig(cfg);
    // load task
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default',['watch']);
};


module.exports = configureGrunt;
