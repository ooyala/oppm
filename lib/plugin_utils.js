'use strict';

const fs = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');

/**
 * A temporary workaround for the absolute path to assets that are included in the defualt
 * skin.json file. This function will replace all absolute urls with relative ones in order to
 * allow self-hosting of these files.
 * @param {string} filePath The path to the skin.json file
 * @param {string} skinDependencies A list of resource objects that are dependencies of skin.json
 * @returns {Promise} A promise that is resolved when the operation is completed
 */
const relativizeSkinJsonUrls = (filePath, skinDependencies) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(new Error('Failed to read skin.json'));
        return;
      }
      let skinJson = data;

      skinDependencies.forEach((dependency) => {
        if (Array.isArray(dependency.fileName)) {
          dependency.fileName.forEach((fileName) => {
            skinJson = relativizeAssetUrl(skinJson, dependency.path, fileName);
          });
        } else {
          skinJson = relativizeAssetUrl(skinJson, dependency.path, dependency.fileName);
        }
      });

      fs.writeFile(filePath, skinJson, (writeErr) => {
        if (writeErr) {
          reject(new Error('Failed to update skin.json'));
          return;
        }
        resolve();
      });
    });
  });


/**
 * Will replace an absolute url in a json file such as
 * "http://player.ooyala.com/static/v4/stable/4.8.5/skin-plugin/assets/fonts/ooyala-slick-type.woff"
 * with a relative url like
 * "skin-plugin/assets/fonts/ooyala-slick-type.woff"
 * The base of the relative url will be determined by <tt>path</tt>, which will also be used to match the
 * absolute urls.
 * @param {string} jsonBuffer The string contents of a .json file
 * @param {string} path The path to use as base for the relative urls
 * @param {string} fileName The filename of the asset whose url we want to replace
 * @return {string} The modifed contents of the .json file with all matches replaced
 */
const relativizeAssetUrl = (jsonBuffer, path, fileName) => {
  const filePath = `${path}/${fileName}`;
  const escapedFilePath = escapeStringRegexp(filePath);
  const regexp = new RegExp(`"[^"]+${escapedFilePath}"`, 'gmi');

  return jsonBuffer.replace(regexp, `"${filePath}"`);
};

exports.relativizeSkinJsonUrls = relativizeSkinJsonUrls;
