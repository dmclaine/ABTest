module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        copy: {
            controller: {
                cwd: 'public/js/',  // set working folder / root to copy
                src: ['**/*'],           // copy all files and subfolders
                dest: 'app/controller/',    // destination folder
                expand: true           // required when using cwd
            }
        },
        clean: {
            dist: ["public/js/client.d.js","public/js/client.p.js"]
        },
        "string-replace": {                 
            dev: {
                files: {
                    "public/js/client.d.js": "public/js/Client.js"
                },
                options: {
                    replacements: [{
                        pattern: '$HOST_URL',
                        replacement: "http://localhost:3000/"
                    }]
                }
            },
            prod: {
                files: {
                    "public/js/client.p.js": "public/js/Client.js"
                },
                options: {
                    replacements: [{
                        pattern: '$HOST_URL',
                        replacement: "https://abclient.datastars.de/"
                    }]
                }
            }
        },
        uglify: {
            client: {
                src: 'public/js/client.p.js',
                dest: 'public/js/client.p.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true
            },
            globals: {
                exports: true,
                module: false
            }
        }
    });

    //require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-string-replace');
    // Default task.
    grunt.registerTask('default', ['clean','string-replace','uglify']);

};