const os = require('os');
const fs = require('fs-extra');
const path = require('path');

/**
 * Ensures that the specified sub-directory exists inside the OS's tmp folder. A new
 * directory is created if it didn't already exist. Returns the real path of the folder
 * after following symlinks.
 * @param {string} dirName The name of the directory that we want to ensure exists
 * @returns {string} The real, absolute path to the temp directory that was specified
 */
const ensureTmpDir = (dirName) => {
  const dir = path.join(os.tmpdir(), dirName);
  fs.mkdirsSync(dir);
  return fs.realpathSync(dir);
};

exports.ensureTmpDir = ensureTmpDir;
