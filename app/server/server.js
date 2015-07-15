Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish("tasks", function () {
  return Tasks.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
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
