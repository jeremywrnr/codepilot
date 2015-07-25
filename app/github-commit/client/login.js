// startup

Session.setDefault('document', null);
Session.setDefault('editorType', 'ace');

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
