// global helper functions

prof = function() { // return the current users profile
  var user = Meteor.user();
  if (user) return user.profile;
}

files = function() { // return the current b/r files
  var user = prof();
  if (user) return Files.find({
    repo: user.repo,
    branch: user.repoBranch
  });
}



// default session settings

Session.setDefault('feedCount', 0);
Session.setDefault('document', null);
Session.setDefault('focusPane', null);
Session.setDefault('editorType', 'ace');
Session.setDefault('hideDoneTasks', true);
Session.setDefault('hideClosedIssues', true);

// startup data subscriptions

Meteor.subscribe('screens');
Tracker.autorun(function() { // subscribe on login
  if (Meteor.user()) {
    Meteor.subscribe('repos', Meteor.userId());
    if (prof().repo) {

      var user = prof(); // get user profile
      Meteor.subscribe('tasks', user.repo);
      Meteor.subscribe('issues', user.repo);
      Meteor.subscribe('messages', user.repo);

      var branch = user.repoBranch; // get branch
      Meteor.subscribe('files', user.repo, branch);
      Meteor.subscribe('commits', user.repo, branch);

    }
  }
});



// global client helper(s)

Template.registerHelper('isPilot', function() { // check if currentUser is pilot
  if (! Meteor.user()) return false; // still logging in or page loading
  return prof().role === 'pilot';
});

Tracker.autorun(function() { // scroll down on new messages
  var feed = $("#feed")[0];
  var newFeedCount = Messages.find({}).count();
  if (! Session.equals('feedCount', newFeedCount)) {
    if (feed) {
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
  'click .login': function(e) {
    Meteor.loginWithGithub({
      requestPermissions: ['user', 'public_repo'],
      loginStyle: 'redirect',
    }, function(err) {
      if (err)
        Session.set('errorMessage', err.reason);
    });
  }
});

Template.userLoggedin.events({
  'click .logout': function(e) {
    Meteor.logout(function(err) {
      if (err)
        Session.set('errorMessage', err.reason);
    });
  }
});
