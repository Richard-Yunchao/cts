module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['out/', 'out-wpt/'],

    mkdir: {
      out: {
        options: {
          create: ['out'],
        },
      },
    },

    run: {
      'generate-listings': {
        cmd: 'node',
        args: ['tools/gen', 'cts', 'unittests'],
      },
      'generate-version': {
        cmd: 'node',
        args: ['tools/gen_version'],
      },
      test: {
        cmd: 'node',
        args: ['tools/run', 'unittests:'],
      },
      'build-out': {
        cmd: 'node',
        args: ['node_modules/@babel/cli/bin/babel', '--source-maps', 'true', '--extensions', '.ts', '--out-dir', 'out/', 'src/'],
      },
      'build-shaderc': {
        cmd: 'node',
        args: [
          'node_modules/@babel/cli/bin/babel',
          '--plugins',
          'babel-plugin-transform-commonjs-es2015-modules',
          'node_modules/@webgpu/shaderc/dist/index.js',
          '-o',
          'out/shaderc.js',
        ],
      },
      'gts-check': {
        cmd: 'node',
        args: ['node_modules/gts/build/src/cli', 'check'],
      },
      'gts-fix': {
        cmd: 'node',
        args: ['node_modules/gts/build/src/cli', 'fix'],
      },
    },

    copy: {
      'out-wpt': {
        files: [
          { expand: true, cwd: 'wpt', src: 'cts.html', dest: 'out-wpt/' },
          { expand: true, cwd: 'out', src: 'framework/**/*.js', dest: 'out-wpt/' },
          { expand: true, cwd: 'out', src: 'suites/cts/**/*.js', dest: 'out-wpt/' },
          { expand: true, cwd: 'out', src: 'runtime/wpt.js', dest: 'out-wpt/' },
        ],
      },
    },

    'http-server': {
      '.': {
        root: '.',
        port: 8080,
        host: '127.0.0.1',
        cache: 5,
      },
    },

    ts: {
      check: {
        tsconfig: {
          tsconfig: 'tsconfig.json',
          passThrough: true,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-ts');

  const helpMessageTasks = [];
  function registerTaskAndAddToHelp(name, desc, deps) {
    grunt.registerTask(name, deps);
    addExistingTaskToHelp(name, desc);
  }
  function addExistingTaskToHelp(name, desc) {
    helpMessageTasks.push({ name, desc });
  }

  registerTaskAndAddToHelp('check', 'Check types and styles', ['ts:check', 'run:gts-check']);
  registerTaskAndAddToHelp('fix', 'Fix lint and formatting', ['run:gts-fix']);
  registerTaskAndAddToHelp('build', 'Build out/ (without type checking)', [
    'clean',
    'mkdir:out',
    'run:build-shaderc',
    'run:build-out',
    'run:generate-version',
    'run:generate-listings',
    'copy:out-wpt',
  ]);
  registerTaskAndAddToHelp('test', 'Run unittests', ['build', 'run:test']);
  registerTaskAndAddToHelp('serve', 'Serve out/ on 127.0.0.1:8080', ['http-server:.']);
  addExistingTaskToHelp('clean', 'Clean build products');

  registerTaskAndAddToHelp('pre', 'Run all presubmit checks', [
    'ts:check',
    'build',
    'run:test',
    'run:gts-check',
  ]);

  grunt.registerTask('default', '', () => {
    console.log('Available tasks (see grunt --help for info):');
    for (const { name, desc } of helpMessageTasks) {
      console.log(`$ grunt ${name}`);
      console.log(`  ${desc}`);
    }
  });
};
