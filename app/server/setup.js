// debugging tools

debug = true;
dlog = function(msg){ if (debug) console.log(msg) }
asrt = function(a,b){ if (debug && a !== b)
  throw('Error: ' + a + ' != ' + b) }



// data publishing

Meteor.publish('repos', function(userId) { // only serve writable repos
  return Repos.find({users: userId});
});
Meteor.publish('commits', function(repoId, branch) { // serve b+r commits
  return Commits.find({repo: repoId, branch: branch});
});
Meteor.publish('files', function(repoId, branch) { // only serve b+r files
  return Files.find({repo: repoId, branch: branch});
});
Meteor.publish('messages', function(repoId) { // only serve repo msgs
  return Messages.find({repo: repoId});
});
Meteor.publish('tasks', function(repoId) { // only serve repo tasks
  return Tasks.find({repo: repoId});
});
Meteor.publish('issues', function(repoId) { // only serve repo issues
  return Issues.find({repo: repoId});
});
Meteor.publish('screens', function() { // serve all issue screenshots
  return Screens.find({});
});



// github auth & config

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
    debug: debug, // boolean variable declared above
    protocol: 'https',
    headers: { 'User-Agent': 'code pilot' }
  });

  // oauth for api 5000/hour
  github.authenticate({
    type: 'oauth',
    key: GHAuth.clientId,
    secret: GHAuth.secret
  });

});
