// startup

Meteor.subscribe('files');
Meteor.subscribe('messages');

Session.setDefault("document", null);
Session.setDefault("renaming", false);
Session.setDefault("editorType", "ace");

Template.navigation.helpers({

  navItems: function(){
    return [
      {
        iconpath:'/',
        iconname:'pencil',
      },
      {
        iconpath:'/tests',
        iconname:'play'
      },
      {
        iconpath:'/git',
        iconname:'list-alt'
      },
      {
        iconpath:'/settings',
        iconname:'cog'
      }
    ]
  }

});
