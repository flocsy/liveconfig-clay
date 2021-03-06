var package = require('../../package');
var uuid = package.pebble.uuid;
var liveconfig = require('./liveconfig');

var Clay = require('pebble-clay');
var clayConfig = require('./config.json');
var customClay = require('./custom-clay');
var clay = new Clay(clayConfig, customClay, {autoHandleEvents: false, userData: {uuid: uuid}});

Pebble.addEventListener('showConfiguration', function(e) {
  liveconfig.connect(uuid, function(id, value) {
    var config = {};
    config[id] = value;
    console.log(JSON.stringify(config));
    Pebble.sendAppMessage(Clay.prepareSettingsForAppMessage(config));
  });

  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) { return; }

  // Send settings to Pebble watchapp
  Pebble.sendAppMessage(clay.getSettings(e.response), function(e) {
    console.log('Sent config data to Pebble');
  }, function() {
    console.log('Failed to send config data!');
    console.log(JSON.stringify(e));
  });
});