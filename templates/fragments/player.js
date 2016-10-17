
var playerParams = {
  'pcode': '9odGgyOhmvtSyMbOojUa85Ug4if_', // Replace with your account's pcode
  'playerBrandingId': 'e4c115a4f4e74866817e1c7fa60dfc39', // Replace with your branding id
  'autoplay': false,
  'debug': true, // Set to false in production environment
  'platform': 'html5',
  'skin': {
    'config': window.ooSkinJson
  }
};
OO.ready(function() {
  window.pp = OO.Player.create('ooplayer', "l1MzhtNTE6eOf81reieCvXoynnA7TUdp", playerParams);
});
