'use strict';

const videoPlugins = require('./video_plugins');
const otherPlugins = require('./other_plugins');
const skinPlugins = require('./skin_plugins');
const adPlugins = require('./ad_plugins');
const analyticsPlugins = require('./analytics_plugins');

module.exports = {
  corePlugins: {
    dependencies: [],
    plugins: [
      {
        id: 'core',
        name: 'Core',
        path: '',
        fileName: 'core.min.js',
        dependencies: []
      }
    ]
  },
  videoPlugins,
  otherPlugins,
  skinPlugins,
  adPlugins,
  analyticsPlugins
};
