const os = require('os');
const path = require('path');

module.exports = {
  RESOURCE_ROOT: 'http://player.ooyala.com/static/v4',
  PROJECT_PATH: path.join(__dirname, '..'),
  BUILD_PATH: path.join(os.tmpdir(), 'oppm'),
  VERSION_CHECK_ASSET: 'core.min.js',
  VERSION_FILE: 'version.txt',
  MANIFEST_FILE: 'manifest.js',
  BUNDLE_FILE: 'player_bundle.js'
};
