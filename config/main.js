const path = require('path');
const utils = require('../lib/utils');

module.exports = {
  RESOURCE_ROOT: 'http://player.ooyala.com/static/v4',
  PROJECT_PATH: path.join(__dirname, '..'),
  BUILD_PATH: utils.ensureTmpDir('oppm'), // On MacOS, the path returned by os.tmpdir() is a symlink
  VERSION_CHECK_ASSET: 'core.min.js',
  VERSION_FILE: 'version.txt',
  BUNDLE_FILE: 'player_bundle.js'
};
