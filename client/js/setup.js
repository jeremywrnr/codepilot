// default session settings

Session.setDefault('feedCount', 0);
Session.setDefault('document', null);
Session.setDefault('focusPane', null);
Session.setDefault('editorType', 'ace');
Session.setDefault('hideClosedIssues', true);

// startup data subscriptions

var prof = GitSync.prof;

Meteor.subscribe('screens');
Tracker.autorun(function() { // subscribe on login
  if (Meteor.user()) {
    Meteor.subscribe('repos', Meteor.userId());
    if (prof().repo) {

      var user = prof(); // get user profile
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



// navbar config

Template.navigation.helpers({ // uses glyphicons in template
  navItems: function(){
    return [
      { iconpath:'/test', iconname:'play', name:'test'  },
      { iconpath:'/git', iconname:'list-alt', name:'git'  },
    ];
  }
});

// bring renderer to the top of the page
Template.renderer.onRendered(function() {
  window.scrollTo(0,0);
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
