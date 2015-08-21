// data + startup

Session.setDefault('task', null);
Session.setDefault('issue', null);
Session.setDefault('commit', null);
Session.setDefault('feedCount', 0);
Session.setDefault('document', null);
Session.setDefault('renaming', false);
Session.setDefault('committing', false);
Session.setDefault('editorType', 'ace');

Meteor.subscribe('screens');
Tracker.autorun(function() { // subscribe on login
  if (Meteor.user()) {
    Meteor.subscribe('repos', Meteor.userId());
    if (Meteor.user().profile.repo) {
      var repoId = Meteor.user().profile.repo;
      Meteor.subscribe('tasks', repoId);
      Meteor.subscribe('issues', repoId);
      Meteor.subscribe('messages', repoId);

      var branch = Meteor.user().profile.repoBranch;
      Meteor.subscribe('files', repoId, branch);
      Meteor.subscribe('commits', repoId, branch);
    }
  }
});

// global client helper(s)

Template.registerHelper('isPilot', function() { // check if currentUser is pilot
  if (! Meteor.user()) return false; // still logging in or page loading
  return Meteor.user().profile.role === 'pilot';
});

Tracker.autorun(function() { // scroll down on new messages
  var feed = $("#feed")[0];
  var newFeedCount = Messages.find({}).count();
  if (! Session.equals('feedCount', newFeedCount)) {
    if(feed) {
      $('#feed').stop().animate({ scrollTop: feed.scrollHeight }, 500);
      Session.set('feedCount', newFeedCount);
    }
  }
});

// navbar config

Template.navigation.helpers({ // uses glyphicons in template
  navItems: function(){
    return [
      { iconpath:'/test', iconname:'play', name:'test'  },
      { iconpath:'/git', iconname:'list-alt', name:'git'  },
      { iconpath:'/config', iconname:'cog', name:'config'  }
    ];
  }
});

// login setup

Template.userLoggedout.events({
  'click .login': function(e, tmpl) {
    Meteor.loginWithGithub({
      requestPermissions: ['user', 'public_repo']
    }, function(err) {
      if (err) Session.set('errorMessage', err.reason);
    });
  }
});

Template.userLoggedin.events({
  'click .logout': function(e, tmpl) {
    Meteor.logout(function(err) {
      if (err) Session.set('errorMessage', err.reason);
    });
  }
});
