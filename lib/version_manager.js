'use strict';

const config = require('../config/main');
const request = require('request');
const semverRegex = require('semver-regex');

/**
 * Performs a HEAD request against a known player asset in order to validate that the
 * specified version is available on the CDN. The url of the known asset is built using the
 * specified build type and version, so a 404 or 401 means the version does not exist
 * @param {string} version The version of the player that we want to validate
 * @param {string} buildType Either 'candidate' or 'stable'
 * @returns {Promise} A promise that is resolved when the operation is completed
 */
const validatePlayerVersion = (version, buildType) =>
  new Promise((resolve, reject) => {
    request.head(`${config.RESOURCE_ROOT}/${buildType}/${version}/${config.VERSION_CHECK_ASSET}`, (error, response) => {
      if (!error && response.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Could not find ${buildType} player with version ${version}`));
      }
    });
  });

/**
 * When passing 'latest' as a version, the function obtains the latest version number that matches
 * the specified build type. When passing a version number the function resolves automatically.
 * The version is obtained by parsing the version.txt from the corresponding build.
 * @param {string} version Either a version number or 'latest'
 * @param {string} buildType Either 'candidate' or 'stable'
 * @returns {Promise} A promise that is resolved with the version number when the operation is completed
 */
const resolveVersionNumber = (version, buildType) =>
  new Promise((resolve, reject) => {
    if (semverRegex().test(version)) {
      resolve(version);
      return;
    }

    const handleError = (message) => {
      reject(new Error(`Error while attempting to resolve version number: ${message}`));
    };

    request.get(`${config.RESOURCE_ROOT}/${buildType}/${version}/${config.VERSION_FILE}`, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const matches = (body || '').match(/Version:.+\n/i) || [];
        const versionNumber = (matches[0] || '').replace(/(Version:|\s|\n)*/gi, '');

        if (semverRegex().test(versionNumber)) {
          resolve(versionNumber);
        } else {
          handleError('Failed to parse version info.');
        }
      } else {
        handleError('Could not obtain version info from server. Please make sure your entering a valid version number.');
      }
    });
  });

exports.validatePlayerVersion = validatePlayerVersion;
exports.resolveVersionNumber = resolveVersionNumber;
