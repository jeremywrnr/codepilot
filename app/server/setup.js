// data publishing

Meteor.publish('messages', function() { return Messages.find(); });
Meteor.publish('files', function() { return Files.find(); });
Meteor.publish("tasks", function () {
  return Tasks.find({ $or: [ { private: {$ne: true} },{owner: this.userId} ] });
});

// github config

var inDevelopment = function(){return process.env.NODE_ENV === "development"; };

Meteor.startup(function () { // get correct github auth key

  ServiceConfiguration.configurations.remove({service: "github"});
  var prodAuth = JSON.parse(Assets.getText('production.json'));
  var devAuth = JSON.parse(Assets.getText('development.json'));
  var GHAuth = ( inDevelopment() ? devAuth : prodAuth );
  ServiceConfiguration.configurations.insert( GHAuth );

});

