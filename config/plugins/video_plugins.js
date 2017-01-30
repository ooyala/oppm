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
        // --- Bitmovin 5 files --- //
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'bitdashplayer.min.js',
          v4Version: '<=4.11.5'
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitdashplayer.min.css',
          v4Version: '<=4.11.5',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitdash-controls.min.js',
          v4Version: '>=4.6.3 <=4.11.5',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitdash-controls.min.css',
          v4Version: '>=4.6.3 <=4.11.5',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitdashplayer.swf',
          v4Version: '<=4.11.5'
        },
        // --- Bitmovin 6 files --- //
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitmovinplayer-core.min.js',
          v4Version: '>=4.11.6',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitmovinplayer-core.min.css',
          v4Version: '>=4.11.6',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitmovinplayer-controls.min.js',
          v4Version: '>=4.11.6',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitmovinplayer-controls.min.css',
          v4Version: '>=4.11.6',
          bundleableV4Version: 'none',
          excludeFromPage: true
        },
        {
          path: BASE_PLUGIN_PATH,
          bundlePath: '',
          fileName: 'bitmovinplayer.swf',
          v4Version: '>=4.11.6'
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
    },
    {
      id: 'youtube',
      name: 'YouTube',
      path: BASE_PLUGIN_PATH,
      fileName: 'youtube.min.js',
      v4Version: '>=4.10.2',
      dependencies: []
    }
  ]
};
