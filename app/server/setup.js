// data publishing

debug = true;

Meteor.publish('repos', function() { // only serve writable repos
  return Repos.find({user: this.userId});
});
Meteor.publish('commits', function(repoId) {
  return Commits.find({repo: repoId});
});
Meteor.publish('files', function(repoId) {
  return Files.find({repo: repoId});
});
Meteor.publish('messages', function(repoId) {
  return Messages.find({repo: repoId});
});
Meteor.publish('tasks', function(repoId) {
  return Tasks.find({repo: repoId});
});


// github config

var inDevelopment = function(){return process.env.NODE_ENV === 'development'}

Meteor.startup(function () { // get correct github auth key

  ServiceConfiguration.configurations.remove({service: 'github'});
  var prodAuth = JSON.parse(Assets.getText('production.json'));
  var devAuth = JSON.parse(Assets.getText('development.json'));
  var GHAuth = ( inDevelopment() ? devAuth : prodAuth );
  ServiceConfiguration.configurations.insert( GHAuth );

  // node-github setup
  github = new GitHub({
    version: '3.0.0',
    timeout: 5000,
    debug: true,
    protocol: 'https',
    headers: { 'User-Agent': 'code pilot' }
  }); // oauth for api 5000/day
  github.authenticate({
    type: 'oauth',
    key: GHAuth.clientId,
    secret: GHAuth.secret
  });

});
