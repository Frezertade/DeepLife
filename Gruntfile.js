module.exports = function(grunt) {

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),
    concat: {},
    rename: {
      css: {
        files: [
          {src: ['.tmp/concat/dist/css/min.css'], dest: ['public/dist/css/min.css']},
          {src: ['.tmp/concat/dist/css/print.css'], dest: ['public/dist/css/print.css']},
        ]
      },
      js: {
        files: [
          {src: ['.tmp/concat/dist/js/min.js'], dest: ['public/dist/js/min.js']},
        ]
      }
    },
    uglify: {
      options: {
        mangle: true,
        report: 'gzip',
        compress: {
          drop_console: true
        }
      },
    },
    cssmin: {
      dist: {
        options: {
          check: 'gzip'
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'public/sass',
          cssDir: 'public/css',
          config: 'public/config.rb',
        }
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'public/img/', src: ['**'], dest: 'public/dist/img/'},
          {expand: true, cwd: 'public/fonts/', src: ['**'], dest: 'public/dist/fonts/'},
          {expand: true, cwd: 'public/js/', src: ['**'], dest: 'public/dist/js/'},
          {expand: true, cwd: 'public/css/', src: ['**'], dest: 'public/dist/css/'},
          {expand: true, cwd: 'module/Application/view/layout', src: 'layout.phtml.template', dest: 'module/Application/view/layout', rename: function(path, name) { name = 'layout.phtml'; return path+'/'+name; }},
          {expand: true, cwd: 'module/SamUser/view/layout', src: 'layout-login.phtml.template', dest: 'module/SamUser/view/layout', rename: function(path, name) { name = 'layout-login.phtml'; return path+'/'+name; }},
        ]
      },
      vendor: {
        files: [
          {expand: true, cwd: 'public/js/vendor/', src: ['<%= vendor_files.copy.js %>'], dest: 'public/dist/js/'},
        ]
      }
    },
    clean: {
      build: {
        src: ['public/dist', 'module/Application/view/layout/*.phtml', 'module/SamUser/view/layout/*.phtml', '.tmp']
      }
    },
    delta: {
      js: {
         files: ['public/js/**/*.js', '!public/js/min.js'],
         tasks: ['clean', 'copy:main', 'useminPrepare', 'concat', 'rename', 'filerev', 'usemin']
      },
      sass: {
       files: ['public/sass/**/*.scss'],
       tasks: ['clean', 'compass', 'copy:main', 'useminPrepare', 'concat', 'rename', 'filerev', 'usemin']
      }
    },
    useminPrepare: {
      options: {
        dest: 'public'
      },
      html: 'module/Application/view/layout/layout.phtml'
    },
    usemin: {
      options: {
        assetsDirs: 'public',
        root: 'public',
        dest: 'public/dist'
      },
      html: ['module/Application/view/layout/layout.phtml', 'module/SamUser/view/layout/layout-login.phtml'],
      css: ['public/dist/css/**/*.css']
    },
    filerev: {
      options: {
        length: 4
      },
      dist: {
        files: [{
          src: [
            'public/dist/js/**/*.js',
            'public/dist/css/**/*.css',
            'public/dist/fonts/**/*.{eot*,otf,svg,ttf,woff}'
          ]
        }]
      }
    },
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');

  // Rename watch task so we can name our watch task watch and build things before launching watch
  grunt.renameTask('watch', 'delta');

  grunt.registerTask('default', ['clean', 'compass', 'copy:main', 'useminPrepare', 'concat', 'rename', 'filerev', 'usemin', 'copy:vendor']);
  grunt.registerTask('prod', ['clean', 'copy:main', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'filerev', 'usemin', 'copy:vendor']);
  grunt.registerTask('watch', ['default', 'delta']);
};

