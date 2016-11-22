const BASE_PLUGIN_PATH = 'skin-plugin';

module.exports = {
  dependencies: [],
  plugins: [
    {
      id: 'html5-skin',
      name: 'Html5 Skin',
      path: BASE_PLUGIN_PATH,
      fileName: 'html5-skin.min.js',
      dependencies: []
    },
    {
      id: 'skin-json',
      name: 'Skin.json',
      path: BASE_PLUGIN_PATH,
      fileName: 'skin.json',
      v4Version: '<4.10.0',
      dependencies: [
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'html5-skin.min.css'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'en.json',
          v4Version: '<4.10.0'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'es.json',
          v4Version: '<4.10.0'
        },
        {
          path: BASE_PLUGIN_PATH,
          fileName: 'zh.json',
          v4Version: '<4.10.0'
        },
        {
          path: `${BASE_PLUGIN_PATH}/assets`,
          fileName: [
            'icons-reference-ooyala-slick.html',
            'icons-reference.html'
          ]
        },
        {
          path: `${BASE_PLUGIN_PATH}/assets/fonts`,
          fileName: []
        },
        {
          path: `${BASE_PLUGIN_PATH}/assets/images`,
          fileName: [
            'loader_svg.svg',
            'ooyala-logo.svg',
            'ooyala-watermark.png',
            'ooyala.png',
            'social-email.svg',
            'social-facebook.svg',
            'social-google.svg',
            'social-twitter.svg',
            'transparent.svg'
          ]
        },
        {
          path: `${BASE_PLUGIN_PATH}/assets/fonts`,
          fileName: [
            'OpenSans.ttf',
            'OpenSans.woff',
            'OpenSans.woff2',
            'Roboto-Bold.ttf',
            'Roboto-Bold.woff',
            'Roboto-Bold.woff2',
            'Roboto-Regular.ttf',
            'Roboto-Regular.woff',
            'Roboto-Regular.woff2',
            'RobotoCondensed-Bold.ttf',
            'RobotoCondensed-Bold.woff',
            'RobotoCondensed-Bold.woff2',
            'RobotoCondensed-Regular.ttf',
            'RobotoCondensed-Regular.woff',
            'RobotoCondensed-Regular.woff2',
            'alice.eot',
            'alice.svg',
            'alice.ttf',
            'alice.woff',
            'ooyala-slick-type.eot',
            'ooyala-slick-type.svg',
            'ooyala-slick-type.ttf',
            'ooyala-slick-type.woff'
          ]
        }
      ]
    },
    {
      id: 'html-iframe',
      name: 'Html iframe',
      path: BASE_PLUGIN_PATH,
      fileName: 'iframe.html',
      dependencies: []
    }
  ]
};
