const os = require('os');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  RESOURCE_ROOT: 'http://player.ooyala.com/static/v4',
  PROJECT_PATH: path.join(__dirname, '..'),
  BUILD_PATH: fs.realpathSync(path.join(os.tmpdir(), 'oppm')),
  VERSION_CHECK_ASSET: 'core.min.js',
  VERSION_FILE: 'version.txt',
  BUNDLE_FILE: 'player_bundle.js'
};
