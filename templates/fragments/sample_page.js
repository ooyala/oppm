
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
var _applyParamsBtn = null;
var _errorNotification = null;
var _errorNotificationTimeout = null;

function initializeUI() {
  _embedCodeInput = document.getElementById('embed-code-input');
  _playerOptionsInput = document.getElementById('player-options-input');
  _applyParamsBtn = document.getElementById('apply-params-btn');
  _errorNotification = document.getElementById('error-notification');

  _applyParamsBtn.addEventListener('click', function() {
    applyFormParams();
  });
  _playerOptionsInput.addEventListener('blur', function() {
    try {
      var options = JSON.parse(_playerOptionsInput.value);
      _playerOptionsInput.value = JSON.stringify(options, null, '  ');
      updatePlayerOptionsInputHeight();
    } catch (err) {
      console.log("Failed to parse player options:", err);
    }
  });
}

function getInitialParams() {
  var params = {};
  params.ec = getQueryStringParam('ec') || DEFAULT_EMBED_CODE;
  params.options = JSON.parse(getQueryStringParam('options')) || DEFAULT_PLAYER_OPTIONS;
  // Default embed code doesn't have a skin.json since this is generated dynamically
  if (params.options && params.options.skin && !params.options.skin.config) {
    params.options.skin.config = window.ooSkinJson;
  }
  return params;
}

function getQueryStringParam(variable) {
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

function buildQueryString(parameters) {
  var qs = '';
  for (var key in parameters) {
    var value = parameters[key];
    // Value is an object literal, stringify
    if (Object.prototype.toString.call(value) === '[object Object]') {
      value = JSON.stringify(value);
    }
    qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
  }
  if (qs) {
    qs = '?' + qs;
  }
  return qs;
}

function updateFormWithParams(params) {
  _embedCodeInput.value = params.ec || '';
  _playerOptionsInput.value = JSON.stringify(params.options || '', null, '  ');
  updatePlayerOptionsInputHeight();
}

function updateQSWithParams(params) {
  var queryString = buildQueryString(params);
  // Update URL without refreshing page
  if (queryString && window.history && window.history.pushState) {
    window.history.pushState(window.history.state, '', queryString);
  }
}

function applyFormParams() {
  var params = {
    ec: null,
    options: null
  };
  // Embed code must be present
  params.ec = _embedCodeInput.value;
  if (!params.ec) {
    _embedCodeInput.focus();
    showNotification('Embed code is required');
    return;
  }
  // Player options must be parseable
  try {
    params.options = JSON.parse(_playerOptionsInput.value);
  } catch (err) {
    _playerOptionsInput.focus();
    showNotification('Player options should be valid JSON');
    return;
  }
  updateQSWithParams(params);
  window.scrollTo(0, 0);
  location.reload();
}

function updatePlayerOptionsInputHeight() {
  _playerOptionsInput.style.height = _playerOptionsInput.scrollHeight + 'px';
}

function showNotification(message) {
  _errorNotification.innerHTML = message;
  _errorNotification.classList.add('active');

  clearTimeout(_errorNotificationTimeout);
  _errorNotificationTimeout = setTimeout(function() {
    _errorNotification.classList.remove('active');
  }, 4000);
}

window.addEventListener('load', function() {
  var params = getInitialParams();

  initializeUI();
  updateFormWithParams(params);
  updateQSWithParams(params);

  OO.ready(function() {
    window.pp = OO.Player.create('ooplayer', params.ec, params.options);
  });
});
