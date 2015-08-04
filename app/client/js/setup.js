// data + startup

Session.setDefault('document', null);
Session.setDefault('renaming', false);
Session.setDefault('committing', false);
Session.setDefault('editorType', 'ace');

Meteor.subscribe('repos');
Tracker.autorun(function(){
  if(Meteor.user()){
    var repoId = Meteor.user().profile.repo;
    Meteor.subscribe('files', repoId);
    Meteor.subscribe('tasks', repoId);
    Meteor.subscribe('commits', repoId);
    Meteor.subscribe('messages', repoId);
  }
});

// global client helpers/functions

Template.registerHelper('isPilot', function(){
  return Meteor.user().profile.role === 'pilot';
});

focusForm = function(id){
  setInterval(function() {
    if ($(id).length) {
      $(id).focus();
      clearInterval(this);
    } //wait til element exists, focus
  }, 100); // check every 100ms
};

// navbar options

Template.navigation.helpers({
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
