// startup

Meteor.subscribe('files');
Meteor.subscribe('messages');
Session.setDefault("renaming", false);
Session.setDefault("editorType", "ace");
