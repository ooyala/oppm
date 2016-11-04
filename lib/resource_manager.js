'use strict';

const config = require('../config/main');
const download = require('download');
const inquirer = require('inquirer');
const path = require('path');
const semver = require('semver');
const downloadFailedQuestions = require('../config/questions').downloadFailedQuestions;
const Spinner = require('cli-spinner').Spinner;
const chalk = require('chalk');

/**
 * Obtains a list of all of the resources associated with the plugins specified on <tt>filters</tt>.
 * Assets that are not available on the selected version will be filtered out automatically.
 * @param {object} plugins A plugin configuration object that lists all the available plugins and resources
 * @param {string} version The V4 version of the resources to filter
 * @param {string} buildType Either 'candidate' or 'stable'
 * @param {object} filters An object containing the ids of the selected plugins, grouped by plugin type
 * @returns {array} An array with all the resources that match the filters
 */
const filterPluginResources = (plugins, version, buildType, filters) => {
  const resources = [].concat.apply([], [
    filterPluginGroupResources(plugins.corePlugins, version, buildType),
    filterPluginGroupResources(plugins.videoPlugins, version, buildType, filters.video),
    filterPluginGroupResources(plugins.otherPlugins, version, buildType, filters.other),
    filterPluginGroupResources(plugins.skinPlugins, version, buildType, filters.skin),
    filterPluginGroupResources(plugins.adPlugins, version, buildType, filters.ad),
    filterPluginGroupResources(plugins.analyticsPlugins, version, buildType, filters.analytics)
  ]);
  return resources;
};

/**
 * Obtains a list of all of the resources associated with the plugins that match the ids on <tt>filterIds</tt> for the
 * specified plugin group. Dependencies are added first, resources are also filtered by availability on the specified version.
 * @param {object} pluginGroup A plugin configuration object that lists all the available resources for a specific plugin group
 * @param {string} version The V4 version of the resources to filter
 * @param {string} buildType Either 'candidate' or 'stable'
 * @param {array} filterIds An object containing the ids of the selected plugins for the given plugin group
 * @returns {array} An array with all the resources that match the filters
 */
const filterPluginGroupResources = (pluginGroup, version, buildType, filterIds) => {
  const pluginGroupResources = [];
  const baseUrl = `${config.RESOURCE_ROOT}/${buildType}/${version}`;

  const addResource = (resources, pluginResource, fileName) => {
    if (pluginResource.v4Version && !semver.satisfies(version, pluginResource.v4Version)) {
      return;
    }
    const pathString = pluginResource.path ? `${pluginResource.path}/` : '';
    resources.push({
      path: pluginResource.path,
      fileName: fileName || pluginResource.fileName,
      url: `${baseUrl}/${pathString}${fileName || pluginResource.fileName}`,
      bundleableV4Version: pluginResource.bundleableV4Version
    });
  };

  const selectedPlugins = pluginGroup.plugins.filter(plugin =>
    !filterIds || filterIds.some(filterId => filterId === plugin.id)
  );

  if (!selectedPlugins.length) {
    return pluginGroupResources;
  }

  // Some plugin groups have dependencies that are common for all the members
  // of the group, we add these first
  pluginGroup.dependencies.forEach((groupDependency) => {
    addResource(pluginGroupResources, groupDependency);
  });

  selectedPlugins.forEach((plugin) => {
    // Add plugin dependencies first
    plugin.dependencies.forEach((pluginDependency) => {
      // Dependency can provide an array of files as well as a single one
      if (Array.isArray(pluginDependency.fileName)) {
        pluginDependency.fileName.forEach((fileName) => {
          addResource(pluginGroupResources, pluginDependency, fileName);
        });
      } else {
        addResource(pluginGroupResources, pluginDependency);
      }
    });
    // Add resource for the plugin itself
    addResource(pluginGroupResources, plugin);
  });
  return pluginGroupResources;
};

/**
 * Recursively downloads all of the resources in the list. Uses the <tt>path</tt> property of
 * each resource in order to generate the directory structure inside the main download folder.
 * @param {array} resources An array of resource objects that contain download url, filename, relative path, etc.
 * @param {string} destPath The directory where resources will be downloaded to
 * @param {string} interactive Determines whether to display console output and interactive prompts when download fails
 * @returns {Promise} A promise that is resolved when the operation is completed
 */
const downloadResources = (resources, destPath, interactive) => {
  const log = interactive ? console.log : () => {};
  log(chalk.white('Downloading files:'));

  return new Promise((resolve, reject) => {
    downloadResourcesRecursive(resources.slice(0), destPath, interactive, log, { resolve, reject });
  });
};

/**
 * Recursively goes through the list of resources until all of them have been downloaded.
 * Resources are downloaded sequentially in order to allow the user to retry in case a file fails.
 * @param {array} resources An array of resource objects that contain download url, filename, relative path, etc.
 * @param {string} destPath The directory where resources will be downloaded to
 * @param {string} interactive Determines whether to display console output and interactive prompts when download fails
 * @param {function} log Function that should be called when logging output
 * @param {object} deferred An object that contains the resolve() and reject() callbacks to be on called success/error
 */
const downloadResourcesRecursive = (resources, destPath, interactive, log, deferred) => {
  const nextResource = resources.shift();
  const spinner = interactive ? new Spinner() : { start: () => {}, stop: () => {} };

  if (!nextResource) {
    deferred.resolve();
    return;
  }

  log(chalk.white('Downloading:', chalk.inverse(nextResource.url)));
  spinner.start();

  download(nextResource.url, path.join(destPath, nextResource.path))
  .then(() => {
    spinner.stop(true);
    log(chalk.cyan('Done.'));
    downloadResourcesRecursive(resources, destPath, interactive, log, deferred);
  })
  .catch((err) => {
    spinner.stop(true);

    const handleError = (resource, message) => {
      deferred.reject(new Error(`Failed to download '${resource.url}': ${message}`));
    };

    if (!interactive) {
      handleError(nextResource, err.message);
      return;
    }

    // When running on interactive mode, show a prompt that allows the user to retry
    inquirer.prompt(downloadFailedQuestions(nextResource.url))
    .then((answers) => {
      switch (answers['download-failed']) {
        case 'abort':
          handleError(nextResource, err.message);
          break;
        case 'retry':
          resources.unshift(nextResource);
          downloadResourcesRecursive(resources, destPath, interactive, log, deferred);
          break;
        case 'skip':
          downloadResourcesRecursive(resources, destPath, interactive, log, deferred);
          break;
        default:
          handleError(nextResource, err.message);
          break;
      }
    });
  });
};

/**
 * Simply combines the resources path and fileName and returns the relative path to it.
 * @param {object} resource A resource object whose relative path we want to build
 * @returns {string} The relative path to the resource
 */
const buildRelativeResourcePath = (resource) => {
  if (!resource) {
    return '';
  }
  return `${resource.path ? `${resource.path}/` : ''}${resource.fileName}`;
};

exports.filterPluginResources = filterPluginResources;
exports.downloadResources = downloadResources;
exports.buildRelativeResourcePath = buildRelativeResourcePath;
