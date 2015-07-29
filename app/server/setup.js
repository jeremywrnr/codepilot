// data publishing

Meteor.publish('files', function() { return Files.find(); });
Meteor.publish('tasks', function() { return Tasks.find(); });
Meteor.publish('messages', function() { return Messages.find(); });
  // only serve writable repos
Meteor.publish('repos', function() { return Repos.find({}); });
  //return Repos.find({ user: this.userId })
Meteor.publish('commits', function() { // serve commits in time order
  return Commits.find({}, {sort: {"commit.committer.date":-1}} );
});

// github config

var inDevelopment = function(){return process.env.NODE_ENV === "development"}

Meteor.startup(function () { // get correct github auth key

  ServiceConfiguration.configurations.remove({service: "github"});
  var prodAuth = JSON.parse(Assets.getText('production.json'));
  var devAuth = JSON.parse(Assets.getText('development.json'));
  var GHAuth = ( inDevelopment() ? devAuth : prodAuth );
  ServiceConfiguration.configurations.insert( GHAuth );

  // node-github setup
  github = new GitHub({
    version: "3.0.0",
    timeout: 5000,
    debug: true,
    protocol: "https",
    headers: { "User-Agent": "code pilot" }
  }); // oauth for api 5000/day
  github.authenticate({
    type: "oauth",
    key: GHAuth.clientId,
    secret: GHAuth.secret
  });

  // populating the commit log
  if (Commits.find().count() === 0){
    var commits = Meteor.call('getAllCommits');
    commits.map(function commitInsert(c){Commits.insert(c)});
  }

});
