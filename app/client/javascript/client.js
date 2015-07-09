// startup

Meteor.subscribe('files');
Meteor.subscribe('messages');

Session.setDefault("document", null);
Session.setDefault("renaming", false);
Session.setDefault("editorType", "ace");
