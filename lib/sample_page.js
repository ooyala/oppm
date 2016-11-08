'use strict';

const config = require('../config/main');
const fs = require('fs-extra');
const pug = require('pug');
const path = require('path');
const buildRelativeResourcePath = require('./resource_manager').buildRelativeResourcePath;

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
const create = (destPath, fileName, resources, params) =>
  new Promise((resolve, reject) => {
    const pageConfig = {
      pretty: true,
      scripts: [],
      styleSheets: [],
      json: []
    };

    let extname = '';
    // Split resources into scripts and stylesheets in order to simplify template rendering
    (resources || []).forEach((resource) => {
      if (resource.excludeFromPage) return;
      extname = path.extname(resource.fileName);
      switch (extname) {
        case '.js':
          pageConfig.scripts.push(buildRelativeResourcePath(resource, params.isBundle));
          break;
        case '.json':
          pageConfig.json.push(buildRelativeResourcePath(resource, params.isBundle));
          break;
        case '.css':
          pageConfig.styleSheets.push(buildRelativeResourcePath(resource, params.isBundle));
          break;
        default:
          break;
      }
    });
    const templateFilePath = path.join(config.PROJECT_PATH, 'templates', 'index.pug');
    // Use pug to render template file
    const indexHtml = pug.renderFile(templateFilePath, Object.assign(pageConfig, params));

    fs.writeFile(path.join(destPath, fileName), indexHtml, (err) => {
      if (err) {
        reject(new Error(`Failed to create sample html file: ${err.message}`));
        return;
      }
      resolve();
    });
  });

exports.create = create;
