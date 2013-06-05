module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.renameTask('bower', 'bowerTask');
  grunt.loadNpmTasks('grunt-bower');
  grunt.renameTask('bower', 'gruntBower');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
//  grunt.loadNpmTasks('grunt-contrib-concat');
//  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.renameTask('watch', 'gruntWatch');

  // Default task.
  grunt.registerTask('bower', ['bowerTask', 'gruntBower']);
  grunt.registerTask('default', ['build']);
//  grunt.registerTask('build', ['clean', 'requirejs:detourDev', 'requirejs:detourDevAmd']);
  grunt.registerTask('build', ['jshint', 'clean', 'bower', 'requirejs:detourDev', 'requirejs:detourDevAmd']);
  grunt.registerTask('rebuild', ['requirejs:detourDev', 'requirejs:detourDevAmd']);
  grunt.registerTask('release', ['build','requirejs:detourMin', 'requirejs:detourMinAmd','jshint']);
  grunt.registerTask('watch', ['build', 'gruntWatch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  // Project configuration.
  grunt.initConfig({
    dirs: {
      dist: 'dist',
      components: 'components',
      lib: 'lib',
      src: {
        js: ['src/**/*.js']
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    banner:
      '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author.name %>;\n' +
      ' *    Based on and uses software code found at https://github.com/angular-ui/ui-router which is \n' +
      ' *    Copyright (c) 2013, Karsten Sperling\n' +
      ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    header:
      '(function() {\n' +
      '\'use strict\';\n' +
      '//ECMAScript 5 rules apply.\n' +
      '//Self-invoking anonymous function keeps global scope clean.\n',
    footer:
      '//close self-invoking anonymous function\n' +
      '}());\n',
    clean: ['<%= dirs.dist %>/*', '<%= dirs.components %>/*', '<%= dirs.lib %>/*'],
    gruntBower: {
      dev: {
        dest: '<%= dirs.dist %>/dependencies'
      }
    },
    gruntWatch:{
      files:['<%= dirs.src.js %>'],
      tasks:['rebuild']
    },
    bowerTask: {
      install: {
      }
    },
    requirejs: {
      options: {
        wrap: {
          start: '<%= banner %>(function() {',
          end: '}());'
        },
        baseUrl: 'src',
        paths: {
          'couchPotato': '../lib/angular-couchPotato/angular-couchPotato.min'
        },
        include: ['angular-detour']
      },
      detourDev: {
        options: {
          almond: true,
          out: '<%= dirs.dist %>/<%= pkg.name %>.js',
          optimize: 'none',
          insertRequire: ['angular-detour']
        }
      },
      detourDevAmd: {
        options: {
          out: '<%= dirs.dist %>/<%= pkg.name %>.amd.js'
          , optimize: 'none'
        }
      },
      detourMin: {
        options: {
          almond: true,
          out: '<%= dirs.dist %>/<%= pkg.name %>.min.js',
          insertRequire: ['angular-detour']
        }
      },
      detourMinAmd: {
        options: {
          out: '<%= dirs.dist %>/<%= pkg.name %>.amd.min.js'
        }
      }
    },
    concat:{
      dist: {
        options: {
          banner: '<%= banner + header %>',
          footer: '<%= footer %>',
          stripBanners: true,
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        src: [
          'lib/angular-couchPotato/angular-CouchPotato.min.js',
          'src/common.js',
          'src/templateFactory.js',
          'src/urlMatcherFactory.js',
          'src/stateLoader.js',
          'src/stateBase.js',
          'src/detour.js',
          'src/viewDirective.js'
        ],
        dest:'<%= dirs.dist %>/<%= pkg.name %>.js'
      }
    },
    uglify:{
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        src:'<%= dirs.dist %>/<%= pkg.name %>.js',
        dest:'<%= dirs.dist %>/<%= pkg.name %>.min.js'
      }
    },
    jshint:{
      files:['Gruntfile.js', '<%= dirs.src.js %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });
};
