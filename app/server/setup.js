// data publishing

Meteor.publish('repos', function() { // only serve writable repos
  return Repos.find({user: this.userId});
});
Meteor.publish('branches', function() { // only serve user branches
  return Branches.find({user: this.userId});
});
Meteor.publish('commits', function() {
  return Commits.find({});
});
Meteor.publish('files', function() {
  return Files.find({});
});
Meteor.publish('messages', function(repoId) {
  return Messages.find({repo: repoId});
});
Meteor.publish('tasks', function() {
  return Tasks.find({});
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

  // re-populating the commit log
  if (Commits.find().count() === 0){
    var commits = Meteor.call('getAllCommits');
    commits.map(function(c){Commits.insert(c)});
  }

});
