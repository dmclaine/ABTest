module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: ['public/third-party/css/bootstrap.min.css','public/third-party/css/bootstrap-flat.min.css','public/third-party/css/font-awesome.min.css','public/third-party/css/slider.css','public/css/style.css','public/css/style-responsive.css'],
                dest: 'public/css/bundle.css'
            },
            options: {
                'separator': grunt.util.linefeed,
                'banner': '',
                'footer': '',
                'stripBanners': false,
                'process': false,
                'sourceMap': false,
                'sourceMapName': undefined,
                'sourceMapStyle': 'embed'
            }
        },
        copy : {
            //dist : {
            //    files : [ {
            //        expand : true,
            //        dot    : false,
            //        cwd    : '<%= paths.app %>',
            //        dest   : '<%= paths.dist %>',
            //        src    : [ '*.{ico,png,txt}', '.htaccess', 'images/{,*/}*.webp', '{,*/}*.html', 'styles/fonts/{,*/}*.*' ]
            //    }]
            //},

            styles : {
                expand : true,
                dot    : false,
                cwd    : 'bower_components/',
                filter : 'isFile',
                flatten: true,
                dest   : 'public/third-party/css',
                src    : ['bootstrap/dist/css/bootstrap.min.css','bootstrap-flat/css/bootstrap-flat.min.css','font-awesome/css/font-awesome.min.css','bootstrap-slider/slider.css']
            },
            fonts : {
                expand : true,
                dot    : false,
                filter : 'isFile',
                flatten: true,
                cwd    : 'bower_components/',
                dest   : 'public/fonts',
                src    : ['bootstrap/dist/fonts/**','font-awesome/fonts/**']
            },
            icheckCSS : {
                expand : true,
                dot    : false,
                cwd    : 'bower_components/iCheck/skins/square',
                dest   : 'public/third-party/css/checkbox',
                src    : ['**']
            },
            scripts : {
                expand : true,
                dot    : false,
                cwd    : 'bower_components/',
                filter : 'isFile',
                flatten: true,
                dest   : 'public/third-party/js',
                src    : ['bootstrap/dist/js/bootstrap.min.js','jquery/dist/jquery.min.js', 'iCheck/icheck.min.js','bootstrap-slider/bootstrap-slider.js']
            },
            ace : {
                expand : true,
                dot    : false,
                cwd    : 'bower_components/ace/build/src',
                dest   : 'public/third-party/js/ace',
                src    : ['*']
            }
        },
        uglify: {
            task: {
                src: ['public/css/bootstrap-slate.min.css','public/css/style.css'],
                dest: 'public/css/bundle.min.css'
            },
            options: {
                'mangle': {},
                'compress': {},
                'beautify': false,
                'expression': false,
                'report': 'min',
                'sourceMap': false,
                'sourceMapName': undefined,
                'sourceMapIn': undefined,
                'sourceMapIncludeSources': false,
                'enclose': undefined,
                'wrap': undefined,
                'exportAll': false,
                'preserveComments': undefined,
                'banner': '',
                'footer': ''
            }
        },
        cssmin: {
            task: {
                src: ['source'],
                dest: 'destination'
            },
            options: {
                'banner': null,
                'keepSpecialComments': '*',
                'report': 'min'
            }
        },
        watch: {
            task: {
                src: ['source'],
                dest: 'destination'
            },
            options: {
                'spawn': true,
                'interrupt': false,
                'debounceDelay': 500,
                'interval': 100,
                'event': 'all',
                'reload': false,
                'forever': true,
                'dateFormat': null,
                'atBegin': false,
                'livereload': false,
                'cwd': process.cwd(),
                'livereloadOnError': true
            }
        },
        clean: {
            css: ['public/css/bundle.css']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

   // grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch', 'clean']);
    grunt.registerTask('default', ['clean','copy','concat']);
};