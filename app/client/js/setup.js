// data + startup

Session.setDefault('task', null);
Session.setDefault('issue', null);
Session.setDefault('commit', null);
Session.setDefault('document', null);
Session.setDefault('renaming', false);
Session.setDefault('committing', false);
Session.setDefault('editorType', 'ace');

Meteor.subscribe('screens');
Tracker.autorun(function() {
  if (Meteor.user()) {
    Meteor.subscribe('repos', Meteor.userId());
    if (Meteor.user().profile.repo) {
      var repoId = Meteor.user().profile.repo;
      var branch = Meteor.user().profile.repoBranch;
      Meteor.subscribe('files', repoId);
      Meteor.subscribe('tasks', repoId);
      Meteor.subscribe('issues', repoId);
      Meteor.subscribe('commits', repoId, branch);
      Meteor.subscribe('messages', repoId);
    }
  }
});

// global client helper(s)

Template.registerHelper('isPilot', function() { // check if currentUser is pilot
  if (! Meteor.user() ) return false; // still logging in or page loading
  return Meteor.user().profile.role === 'pilot';
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
