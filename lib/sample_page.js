'use strict';

const fs = require('fs-extra');
const pug = require('pug');
const path = require('path');

/**
 * Generates a sample html file with a test player that references the assets that were
 * generated while running the package manager. The page will automatically adjust to the
 * plugins that were selected and will include scripts and assets accordingly.
 * @param {string} destPath The destination folder where the sample page will be created
 * @param {string} fileName The filename and extension of the sample page to be created
 * @param {array} resources An array of all the resource objects included with the current package
 * @param {object} options An object with flags and information about the current build
 * @returns {Promise} A promise that is resolved when the operation is completed
 */
const create = (destPath, fileName, resources, params) => {
  const buildRelativeResourcePath = (resource) => {
    if (!resource) {
      return '';
    }
    return `${resource.path ? `${resource.path}/` : ''}${resource.fileName}`;
  };

  return new Promise((resolve, reject) => {
    const config = {
      pretty: true,
      scripts: [],
      styleSheets: [],
      json: []
    };

    let extname = '';
    // Split resources into scripts and stylesheets in order to simplify template rendering
    (resources || []).forEach((resource) => {
      extname = path.extname(resource.fileName);
      switch (extname) {
        case '.js':
          config.scripts.push(buildRelativeResourcePath(resource));
          break;
        case '.json':
          config.json.push(buildRelativeResourcePath(resource));
          break;
        case '.css':
          config.styleSheets.push(buildRelativeResourcePath(resource));
          break;
        default:
          break;
      }
    });
    // Use pug to render template file
    const indexHtml = pug.renderFile('templates/index.pug', Object.assign(config, params));

    fs.writeFile(path.join(destPath, fileName), indexHtml, (err) => {
      if (err) {
        reject(new Error(`Failed to create sample html file: ${err.message}`));
        return;
      }
      resolve();
    });
  });
};

exports.create = create;
