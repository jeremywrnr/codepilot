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

// account info

Template.settings.helpers({
  loginInfo: function() {
    return 'Currently logged in as ' +Meteor.user().profile.name+ '.'
  }
});
