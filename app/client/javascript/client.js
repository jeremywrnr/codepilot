// startup

Meteor.subscribe('files');
Meteor.subscribe('messages');
Session.setDefault("document", null);
Session.setDefault("renaming", false);
Session.setDefault("editorType", "ace");

// navbar options

Template.navigation.helpers({
  navItems: function(){
    return [
      { iconpath:'/', iconname:'pencil' },
      { iconpath:'/tests', iconname:'play' },
      { iconpath:'/git', iconname:'list-alt' },
      { iconpath:'/settings', iconname:'cog' }
    ];
  }
});

// account info

Template.loginInfo.helpers({
  loginInfo: function() {
    if (Meteor.user()) {
      var name = Meteor.user().profile.name;
      return 'Currently logged in as ' + name + '.'
    } else {
      return 'ERROR: Not currently logged in.'
    }
  }
});

