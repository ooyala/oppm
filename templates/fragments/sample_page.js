
var DEFAULT_EMBED_CODE = 'l1MzhtNTE6eOf81reieCvXoynnA7TUdp';
var DEFAULT_PLAYER_OPTIONS = {
  'pcode': '9odGgyOhmvtSyMbOojUa85Ug4if_',
  'playerBrandingId': 'e4c115a4f4e74866817e1c7fa60dfc39',
  'autoplay': false,
  'debug': true,
  'platform': 'html5',
  'skin': {
    'config': ''
  }
};

var _embedCodeInput = null;
var _playerOptionsInput = null;
var _updateSettingsBtn = null;

function initializeUI() {
  _embedCodeInput = document.getElementById('embed-code-input');
  _playerOptionsInput = document.getElementById('player-options-input');
  _updateSettingsBtn = document.getElementById('update-settings-btn');

  _updateSettingsBtn.addEventListener('click', function() {
    updatePlayerSettings();
  });
}

function getQueryParameter(variable) {
  var query = window.location.search.substring(1);
  var params = query.split('&');
  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

function updateFormWithSettings(embedCode, playerOptions) {
  _embedCodeInput.value = embedCode;
  _playerOptionsInput.value = JSON.stringify(playerOptions, null, '  ');
}

function updateQSWithSettings(embedCode, playerOptions) {
  var queryStringParams = '?ec=' + encodeURIComponent(embedCode);
  queryStringParams += '&options=' + encodeURIComponent(JSON.stringify(playerOptions));
  // update URL without refreshing page
  if (window.history && window.history.pushState) {
    window.history.pushState(window.history.state, '', queryStringParams);
  }
}

function updatePlayerSettings() {
  var embedCode = _embedCodeInput.value;
  var playerOptions = JSON.parse(_playerOptionsInput.value);
  updateQSWithSettings(embedCode, playerOptions);
  window.scrollTo(0, 0);
  location.reload();
}

window.addEventListener('load', function() {
  var embedCode = getQueryParameter('ec') || DEFAULT_EMBED_CODE;
  var playerOptions = JSON.parse(getQueryParameter('options')) || DEFAULT_PLAYER_OPTIONS;

  if (playerOptions && playerOptions.skin && !playerOptions.skin.config) {
    playerOptions.skin.config = window.ooSkinJson;
  }

  initializeUI();
  updateFormWithSettings(embedCode, playerOptions);
  updateQSWithSettings(embedCode, playerOptions);

  OO.ready(function() {
    window.pp = OO.Player.create('ooplayer', embedCode, playerOptions);
  });
});
