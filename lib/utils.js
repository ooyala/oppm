'use strict';

const os = require('os');
const fs = require('fs-extra');
const copyFile = require('es6-promisify')(fs.copy);
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

/**
 *
 */
const concatFiles = (filePath, files) =>
  new Promise((resolve, reject) => {
    // Recursively concatenates the files on the queue to the write stream
    const concatFilesInternal = (writeStream, fileQueue, errorCallback) => {
      const nextFile = fileQueue.shift();

      if (!nextFile) {
        writeStream.end();
        return;
      }

      const readStream = fs.createReadStream(nextFile);

      readStream.pipe(writeStream, { end: false });
      readStream.on('end', () => {
        writeStream.write('\r\n');
        concatFilesInternal(writeStream, fileQueue, errorCallback);
      });
      readStream.on('error', errorCallback);
    };

    let handleErrorCalled = false;
    // Both the readStream and the writeStream can trigger the same error,
    // so we need to make sure we only handle this once
    const handleError = (err) => {
      if (!handleErrorCalled) {
        handleErrorCalled = true;
        reject(err);
      }
    };

    const concatStream = fs.createWriteStream(filePath);
    concatStream.on('error', handleError);
    concatStream.on('finish', () => resolve());

    concatFilesInternal(concatStream, files.slice(0), handleError);
  });

/**
 *
 */
const copyFiles = (files) => {
  // Recursively copy each file in the queue until none are left
  const copyFilesInternal = (fileQueue, deferred) => {
    const nextFile = fileQueue.shift();

    if (!nextFile) {
      deferred.resolve();
      return;
    }

    copyFile(nextFile.source, nextFile.dest)
    .then(() => copyFilesInternal(fileQueue, deferred))
    .catch(err => deferred.reject(err));
  };
  return new Promise((resolve, reject) => {
    copyFilesInternal(files.slice(0), { resolve, reject });
  });
};

exports.ensureTmpDir = ensureTmpDir;
exports.concatFiles = concatFiles;
exports.copyFiles = copyFiles;
