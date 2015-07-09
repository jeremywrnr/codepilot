// startup

Meteor.subscribe('files');
Meteor.subscribe('messages');
Session.setDefault("editorType", "ace");
Session.setDefault("editMeta", false);
