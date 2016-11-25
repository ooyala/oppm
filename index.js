'use strict';

const packageJson = require('./package.json');
const config = require('./config/main');
const plugins = require('./config/plugins/plugins_index');
const wizardQuestions = require('./config/questions').wizardQuestions;
const fs = require('fs-extra');
const path = require('path');
const copyFile = require('es6-promisify')(fs.copy);
const parseArgs = require('minimist');
const versionManager = require('./lib/version_manager');
const resourceManager = require('./lib/resource_manager');
const packageManager = require('./lib/package_manager');
const pluginUtils = require('./lib/plugin_utils');
const samplePage = require('./lib/sample_page');
const inquirer = require('inquirer');
const semver = require('semver');
const Spinner = require('cli-spinner').Spinner;
const chalk = require('chalk');

const BUILD_TYPES = require('./lib/const/build_types');

/**
 * Parses all the command line arguments and assigns default values.
 * @return {object} An object with all of the sanitized arguments. Returns null when an invalid parameter is passed.
 */
const getParameters = () => {
  let unknownParamsPassed = false;
  const options = {
    default: {
      version: 'latest',
      candidate: false,
      help: false
    },
    alias: {
      version: 'v',
      candidate: 'c',
      help: 'h'
    },
    boolean: [
      'candidate',
      'help'
    ],
    unknown: () => {
      unknownParamsPassed = true;
      return false;
    }
  };
  const params = parseArgs(process.argv.slice(2), options);
  return unknownParamsPassed ? null : params;
};

/**
 * Main entry point of the application.
 */
const app = () => {
  const params = getParameters();
  // Show help if unkown parameter was received or --help was passed
  if (!params || params.help || !params.version.length) {
    displayHelp();
    return;
  }
  const buildType = params.candidate ? BUILD_TYPES.CANDIDATE : BUILD_TYPES.STABLE;

  console.log(chalk.cyan(`Ooyala Player Package Manager v${packageJson.version}`));
  const spinner = new Spinner('%s Fetching version information...');
  spinner.start();

  versionManager.resolveVersionNumber(params.version, buildType)
  .then((version) => {
    // If these are different it means that we already called the server in order
    // to get the version number, so we do not need to validate it
    if (params.version === version) {
      return versionManager.validatePlayerVersion(params.version, buildType);
    }
    params.version = version;
    return Promise.resolve();
  })
  .then(() => {
    spinner.stop(true);
    console.log(chalk.white(`Player V4 Version: ${params.version} (${buildType})`));
    return inquirer.prompt(wizardQuestions(params.version));
  })
  .then(answers => runPackageManager(params, buildType, pluginUtils.extractPackageOptions(answers)))
  .catch((error) => {
    spinner.stop(true);
    console.log(chalk.red(error.message));
  });
};

/**
 * Downloads resources and builds a package with the given options.
 * @param {object} params Command line arguments that were passed
 * @param {string} buildType Either 'candidate' or 'stable'
 * @param {object} options An object that contains all the options that were selected for the package build. Mostly the info about plugins to include
 * @returns {Promise} A promise that is resolved when the operation is completed
 */
const runPackageManager = (params, buildType, options) => {
  const mainBuildPath = path.join(config.BUILD_PATH, params.version);
  const bundleBuildPath = `${mainBuildPath}_bundle`;
  const packageSourcePath = options.bundle ? bundleBuildPath : mainBuildPath;

  return new Promise((resolve, reject) => {
    const spinner = new Spinner();
    // Determine whether skin.json was amongst the chosen options
    const skinIncluded = (options.skin || []).some(pluginId => pluginId === 'skin-json');
    // From 4.10.0 onwards, the skin.json is bundled inside the html5-skin plugin
    const skinIsBundled = semver.satisfies(params.version, '>=4.10.0');
    // Filter plugin assets and obtain a list all required files and dependencies
    const resources = resourceManager.filterPluginResources(plugins, params.version, buildType, options);

    fs.emptyDirSync(config.BUILD_PATH);

    resourceManager.downloadResources(resources, mainBuildPath, true)
    .then(() => {
      if (!skinIncluded || skinIsBundled) {
        return Promise.resolve();
      }
      const skinJson = plugins.skinPlugins.plugins.find(plugin => plugin.id === 'skin-json');
      const skinJsonFilePath = path.join(mainBuildPath, skinJson.path, skinJson.fileName);
      return pluginUtils.relativizeSkinJsonUrls(skinJsonFilePath, skinJson.dependencies);
    })
    .then(() => {
      spinner.setSpinnerTitle('%s Building package. Please wait...');
      spinner.start();

      if (!options.bundle) {
        return Promise.resolve();
      }
      const output = { path: bundleBuildPath, fileName: config.BUNDLE_FILE };
      const bundleManifest = packageManager.generateManifest(params.version, resources);
      return packageManager.bundleResources(mainBuildPath, output, bundleManifest);
    })
    .then((bundledResources) => {
      const pageOptions = {
        version: params.version,
        isBundle: options.bundle,
        skinIncluded,
        skinIsBundled,
        iframeIncluded: (options.skin || []).some(pluginId => pluginId === 'html-iframe'),
        skinFallbackUrls: {
          css: `${config.RESOURCE_ROOT}/${buildType}/${params.version}/skin-plugin/html5-skin.min.css`,
          json: `${config.RESOURCE_ROOT}/${buildType}/${params.version}/skin-plugin/skin.json`
        }
      };
      return samplePage.create(packageSourcePath, 'sample.htm', (bundledResources || resources), pageOptions);
    })
    .then(() =>
      copyFile(path.join(config.PROJECT_PATH, 'templates', 'run_sample.js'), path.join(packageSourcePath, 'run_sample.js'))
    )
    .then(() =>
      packageManager.createPackageArchive(packageSourcePath, options.outputPath, `Player_V${params.version}`)
    )
    .then((pkg) => {
      spinner.stop(true);
      console.log(chalk.green('Package', chalk.bold(pkg.fileName), 'created at', chalk.bold(pkg.path)));
      resolve(pkg);
    })
    .catch((error) => {
      spinner.stop(true);
      reject(error);
    });
  });
};

/**
 * Displays a help screen with all the available CLI options.
 */
const displayHelp = () => {
  console.log(chalk.cyan(`Ooyala Player Package Manager v${packageJson.version}\n`));
  console.log('Usage: oppm [options]\n');
  console.log('Options:\n');
  console.log('  -v, --version\t\tTarget a specific player version');
  console.log('\t\t\t(Use full version number or \'latest\')');
  console.log('  -c, --candidate\tTarget candidate releases');
  console.log('\t\t\t(For testing purposes only)');
  console.log('  -h, --help\t\tDisplays this help screen');
  console.log(chalk.white('\nDocumentation can be found at:', chalk.blue('https://github.com/ooyala/oppm')));
};

app();
