// Automatically transpile .ts imports
require('ts-node/register/transpile-only');

// Redirect imports of .js files to .ts files
const Module = require('module');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = (request, parentModule, isMain) => {
  if (request.startsWith('.') && parentModule.filename.endsWith('.ts')) {
    // Required for browser (because it needs the actual correct file path and
    // can't do any kind of file resolution).
    if (!request.endsWith('.js')) {
      throw new Error('All relative imports must end in .js: ' + request);
    }
    request = request.substring(0, request.length - '.ts'.length) + '.ts';
  }
  return resolveFilename.call(this, request, parentModule, isMain);
};
