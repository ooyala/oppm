
var DEFAULT_EMBED_CODE = 'I3dXhnazoidu1V58G8iOorCCdDZwqlaZ';
var DEFAULT_PLAYER_OPTIONS = {
  'pcode': 'Z5Mm06XeZlcDlfU_1R9v_L2KwYG6',
  'playerBrandingId': 'dcb79e2098c94889a1b9f2af6280b45d',
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
var _applyingParams = false;

function initializeUI() {
  _embedCodeInput = document.getElementById('embed-code-input');
  _playerOptionsInput = document.getElementById('player-options-input');
  _applyParamsBtn = document.getElementById('apply-params-btn');
  _restoreDefaultsBtn = document.getElementById('restore-defaults-btn');
  _errorNotification = document.getElementById('error-notification');

  _applyParamsBtn.addEventListener('click', function() {
    applyFormParams(true);
  });

  _applyParamsBtn.addEventListener('mousedown', function() {
    _applyingParams = true;
  });

  _applyParamsBtn.addEventListener('mouseup', function() {
    _applyingParams = false;
  });

  _embedCodeInput.addEventListener('click', function() {
    this.setSelectionRange(0, this.value.length);
  });

  _playerOptionsInput.addEventListener('blur', function() {
    if (_applyingParams) return;
    try {
      var options = JSON.parse(_playerOptionsInput.value);
      _playerOptionsInput.value = JSON.stringify(options, null, '  ');
      updatePlayerOptionsInputHeight();
    } catch (err) {
      console.log("Failed to parse player options:", err);
    }
  });

  _restoreDefaultsBtn.addEventListener('click', function() {
    var params = {};
    params.ec = DEFAULT_EMBED_CODE;
    params.options = DEFAULT_PLAYER_OPTIONS;
    updateFormWithParams(params);
    applyFormParams(false);
  });
}

function getInitialParams() {
  var params = {};
  params.ec = getQueryStringParam('ec') || DEFAULT_EMBED_CODE;
  try {
    params.options = JSON.parse(getQueryStringParam('options')) || DEFAULT_PLAYER_OPTIONS;
  } catch (err) {
    params.options = DEFAULT_PLAYER_OPTIONS;
  }
  // Default embed code doesn't have a skin.json since this is generated dynamically.
  // window.ooSkinJson is injected by the pug template
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

function applyFormParams(scroll) {
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
  if (scroll) {
    window.scrollTo(0, 0);
  }
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

function onPlayerCreate(player) {
  player.mb.subscribe('*', 'test', function(event, params) {
    if (!event.match(/playheadTime/)) {
      OO.log("Message Bus Event: " + event + " " + JSON.stringify(arguments));
    }
  });
}

window.addEventListener('load', function() {
  var params = getInitialParams();

  initializeUI();
  updateFormWithParams(params);
  updateQSWithParams(params);

  if (!params.options.onCreate) {
    params.options.onCreate = onPlayerCreate;
  }

  OO.ready(function() {
    window.pp = OO.Player.create('ooplayer', params.ec, params.options);
  });
});
