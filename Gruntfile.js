module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.renameTask('bower', 'bowerInstall');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('doBower', ['bowerInstall', 'bower']);
  grunt.registerTask('default', ['jshint','build']);
  grunt.registerTask('build', ['clean', 'doBower', 'concat']);
  grunt.registerTask('release', ['build','uglify:dist','jshint']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  // Project configuration.
  grunt.initConfig({
    dirs: {
      dist: 'dist',
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
    clean: ['<%= dirs.dist %>/*'],
    bower: {
      dev: {
        dest: '<%= dirs.dist %>/dependencies'
      }
    },
    bowerInstall: {
      install: {
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
