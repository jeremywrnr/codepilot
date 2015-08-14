// data + startup

Session.setDefault('document', null);
Session.setDefault('renaming', false);
Session.setDefault('committing', false);
Session.setDefault('editorType', 'ace');

Tracker.autorun(function() {
  if (Meteor.user()) {
    Meteor.subscribe('repos', Meteor.userId());
    if (Meteor.user().profile.repo) {
      var repoId = Meteor.user().profile.repo;
      Meteor.subscribe('files', repoId);
      Meteor.subscribe('tasks', repoId);
      Meteor.subscribe('issues', repoId);
      Meteor.subscribe('screens');
      Meteor.subscribe('commits', repoId);
      Meteor.subscribe('messages', repoId);
    }
  }
});

// global client helpers/functions

Template.registerHelper('isPilot', function() { // check if currentUser is pilot
  return Meteor.user().profile.role === 'pilot';
});

focusForm = function(id) { // takes id of form, waits til exists, and focuses
  setInterval(function() {
    if ($(id).length) {
      $(id).focus();
      clearInterval(this);
    } //wait til element exists, focus
  }, 100); // check every 100ms
};

grabTagContentsToRender = function(full, tag) { // return parsed html from tag
  var doc = $('<html></html>');
  doc.html( full.content );
  return $(tag, doc)[0].innerHTML;
}

// navbar config

Template.navigation.helpers({ // uses glyphicons in template
  navItems: function(){
    return [
      { iconpath:'/', iconname:'pencil' },
      { iconpath:'/test', iconname:'play' },
      { iconpath:'/git', iconname:'list-alt' },
      { iconpath:'/config', iconname:'cog' }
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
