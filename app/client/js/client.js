// startup

Meteor.subscribe('files');
Meteor.subscribe("tasks");
Meteor.subscribe('messages');
Session.setDefault("document", null);
Session.setDefault("renaming", false);
Session.setDefault("editorType", "ace");

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
  "click #login": function(e, tmpl) {
    Meteor.loginWithGithub({
      requestPermissions: ['user', 'public_repo']
    }, function(err) {
      if (err){ // error handling
        Session.set('errorMessage', err.reason || 'Login problem: unknown error.');
      }
    });
  }
});

Template.userLoggedin.events({
  "click #logout": function(e, tmpl) {
    Meteor.logout(function(err) {
      if (err){
        // error handling
      } else {
        // show an alert
      }
    });
  }
});
