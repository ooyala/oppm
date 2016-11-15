# Ooyala Player Package Manager (Beta)

**Ooyala Player Package Manager** is a command-line interface geared towards Ooyala customers that are interested in self-hosting the V4 Player. The utility allows you to easily download all the necessary plugins and assets that will be needed for your particular V4 Player use case.

#### Beta Disclaimer

Please note that this is a beta version of the **Ooyala Player Package Manager** which is
still undergoing final testing before its official release. The website, its software and all content found on it are provided on an "as is" and "as available" basis.

Ooyala does not give any warranties, whether express or implied, as to the suitability or usability of the website, its software or any of its content.

## Important

**You'll need Node v4.0 or higher to run this program.**

We recommend running with the latest version of [Node.js](https://nodejs.org). You can easily switch to and from newer Node versions with [n (Node version manager)](https://github.com/tj/n).

## Installation

The **Ooyala Player Package Manager** can be easily installed with **npm**:
```
npm install -g oppm
```

## Basic Usage

To run the package wizard, simply fire up a terminal window and run:
```
oppm
```
The above will display a prompt with several simple questions that will help the wizard determine which files you'll need. After the wizard is completed, you will be prompted to type the name of a folder where you want your .zip package to be created. This package will contain all the necessary files required for hosting, as well as a sample page with guidelines that will help you set up your own V4 Player page.

#### Targeting specific versions
By default the package manager will target the latest stable version of the player. We recommend that you try to always host the latest version, however, if you need to generate a new package for a previous version, you can do so by using the `version` parameter, like so:
```
oppm --version 4.8.5
```

#### Running the sample page
The packages that you generate with **oppm** will contain a `sample.htm` file with examples that will help you set up the V4 Player on your own website.

You'll need to host the page on an HTTP server in order to be able to see the player in action. The player package will also contain a script file that will run a simple test server for you. Once you unzip your package, you can launch the test server by running the following on a terminal window:
```
cd path_to_unzipped_package_contents
```
```
node run_sample.js
```

#### Bundling scripts
**oppm** can automatically concatenate some of the package's scripts into a single `player_bundle.js` file. To concatenate scripts, simply choose the `YES` option when prompted by the wizard.

Bundling script files together can be useful if you want to reduce the number of requests to your server. If your package size is not too large (i.e. you don't require too many plugins), then bundling might provide a performance increase during page load. Bundling scripts on packages with a large number of plugins is not recommended.

## Installation Troubleshooting

#### npm issues with Homebrew on OS X
Installing Node.js through Homebrew can cause problems with npm for globally installed packages such as **oppm**. Please refer to [this link](https://gist.github.com/DanHerbert/9520689) for a possible solution.

#### Getting a **EACCES** error when installing
This usually means that you do not have permission to write to the folders where npm installs packages. You can fix this issue by following [these steps](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

## For Developers
For initial project setup, simply run this inside the main project folder:
```
npm install
```

Unit tests for **oppm** can be run using:
```
npm test
```

The project also uses **ESLint**, which is executed automatically after running the unit tests. You can also run the linter separately by using:
```
npm run linter
```
