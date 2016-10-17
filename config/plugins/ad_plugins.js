const BASE_PLUGIN_PATH = 'ad-plugin';

module.exports = {
  dependencies: [],
  plugins: [
    {
      id: 'ad-manager-vast',
      name: 'Ad Manager Vast',
      path: BASE_PLUGIN_PATH,
      fileName: 'ad_manager_vast.min.js',
      dependencies: []
    },
    {
      id: 'freewheel',
      name: 'Free Wheel',
      path: BASE_PLUGIN_PATH,
      fileName: 'freewheel.min.js',
      dependencies: []
    },
    {
      id: 'google-ima',
      name: 'Google IMA',
      path: BASE_PLUGIN_PATH,
      fileName: 'google_ima.min.js',
      dependencies: []
    },
    {
      id: 'liverail',
      name: 'LiveRail',
      path: BASE_PLUGIN_PATH,
      fileName: 'liverail.min.js',
      dependencies: []
    },
    {
      id: 'pulse',
      name: 'Pulse',
      path: BASE_PLUGIN_PATH,
      fileName: 'pulse.min.js',
      dependencies: []
    },
    {
      id: 'ssai-pulse',
      name: 'Pulse SSAI',
      path: BASE_PLUGIN_PATH,
      fileName: 'ssai_pulse.min.js',
      dependencies: []
    }
  ]
};
