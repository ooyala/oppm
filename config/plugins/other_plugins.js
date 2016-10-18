const BASE_PLUGIN_PATH = 'other-plugin';

module.exports = {
  dependencies: [],
  plugins: [
    {
      id: 'discovery',
      name: 'Discovery Plugin',
      path: BASE_PLUGIN_PATH,
      fileName: 'discovery_api.min.js',
      dependencies: []
    }
  ]
};
