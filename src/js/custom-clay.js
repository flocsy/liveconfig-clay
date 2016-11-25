module.exports = function(minified) {
  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;

  clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
    var connection = new WebSocket("wss://liveconfig.fletchto99.com/forward/" + clayConfig.meta.userData.uuid + "/" + clayConfig.meta.watchToken);
    connection.onopen = function() {
      clayConfig.getAllItems().map( function(item) {
        item.on('change', function() {
          connection.send(JSON.stringify({id: this.messageKey, value: this.get()}));
        });
      });
    };
  });
};