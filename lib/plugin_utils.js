'use strict';

const fs = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');
const uniq = require('lodash.uniq');
const flatten = require('lodash.flatten');
const union = require('lodash.union');

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

/**
 * Performs some additional processing on the answers object returned by inquirer.
 * The object returned by this function can be used as an options parameter for the main package manager process.
 * @param {object} inquirerAnswers The answers object returned by the inquirer prompt
 * @return {object} An options object that has the format required by <tt>runPackageManager</tt> on the main process
 */
const extractPackageOptions = (inquirerAnswers) => {
  const packageOptionsDefaults = { video: [], other: [], skin: [], ad: [], analytics: [], iframe: [] };
  const packageOptions = Object.assign(packageOptionsDefaults, inquirerAnswers);
  // There's a special case in which we need to include main_html5 along with bit_wrapper when
  // HLS is chosen (in order to support mobile). We achieve this by having answers that return multiple
  // values, but Inquirer doesn't support this out of the box
  packageOptions.video = uniq(flatten(packageOptions.video));
  // Determine whether main_html5 is already present in our options
  const mainHtml5Included = packageOptions.video.some(pluginId => pluginId === 'main-html5');
  // main_html5 is also required when either freewheel or ad manager vast are selected
  const mainHtml5Required = packageOptions.ad.some(pluginId =>
    pluginId === 'freewheel' || pluginId === 'ad-manager-vast'
  );
  // This will add main_html5 or ensure that it's the first on the list if it exists already
  const baseVideoArray = (mainHtml5Included || mainHtml5Required) ? ['main-html5'] : [];
  packageOptions.video = union(baseVideoArray, packageOptions.video);
  // Skin and iframe belong to the same plugin group, but depend on different questions.
  // We need to merge both answers into a single skin group
  packageOptions.skin = union(packageOptions.skin, packageOptions.iframe);
  delete packageOptions.iframe;
  return packageOptions;
};

exports.relativizeSkinJsonUrls = relativizeSkinJsonUrls;
exports.extractPackageOptions = extractPackageOptions;
