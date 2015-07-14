Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('files', function() {
  return Files.find();
});

Meteor.methods({

  deleteFile: function(id) {
    Files.remove(id);
    ShareJS.model["delete"](id);
  }

});

Meteor.startup(function () {
  // potentially do things here
});
