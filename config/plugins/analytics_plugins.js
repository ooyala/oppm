const BASE_PLUGIN_PATH = 'analytics-plugin';

module.exports = {
  dependencies: [],
  plugins: [
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      path: BASE_PLUGIN_PATH,
      fileName: 'googleAnalytics.min.js',
      dependencies: [],
      v4Version: '>=4.7.0'
    },
    {
      id: 'nielsen-analytics',
      name: 'Nielsen Analytics',
      path: BASE_PLUGIN_PATH,
      fileName: 'Nielsen.min.js',
      dependencies: []
    },
    {
      id: 'omniture',
      name: 'Adobe Omniture',
      path: BASE_PLUGIN_PATH,
      fileName: 'omniture.min.js',
      dependencies: [
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'VideoHeartbeat.min.js'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'AppMeasurement.js'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'VisitorAPI.js'
        }
      ]
    },
    {
      id: 'conviva',
      name: 'Conviva',
      path: BASE_PLUGIN_PATH,
      fileName: 'conviva.min.js',
      dependencies: [
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'conviva-core-sdk.min.js'
        }
      ]
    }
  ]
};
