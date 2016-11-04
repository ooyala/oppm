const BASE_PLUGIN_PATH = 'video-plugin';

module.exports = {
  dependencies: [],
  plugins: [
    {
      id: 'main-html5',
      name: 'Main Html5',
      path: BASE_PLUGIN_PATH,
      fileName: 'main_html5.min.js',
      dependencies: []
    },
    {
      id: 'bit-wrapper',
      name: 'BitWrapper',
      path: BASE_PLUGIN_PATH,
      fileName: 'bit_wrapper.min.js',
      dependencies: [
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'bitdashplayer.min.js'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'bitdashplayer.min.css'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'bitdash-controls.min.js',
          v4Version: '>=4.6.3'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'bitdash-controls.min.css',
          v4Version: '>=4.6.3'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'bitdashplayer.swf'
        }
      ]
    },
    {
      id: 'akamai-hd-flash',
      name: 'Akamai HD Flash',
      path: BASE_PLUGIN_PATH,
      fileName: 'akamaiHD_flash.min.js',
      bundleableV4Version: 'none',
      dependencies: [
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'akamaiHD_flash.swf'
        }
      ]
    },
    {
      id: 'osmf-flash',
      name: 'OSMF Flash',
      path: BASE_PLUGIN_PATH,
      fileName: 'osmf_flash.min.js',
      bundleableV4Version: 'none',
      dependencies: [
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'osmf_flash.swf'
        }
      ]
    }
  ]
};
