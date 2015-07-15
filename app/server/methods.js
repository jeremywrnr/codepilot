(function () {
  Meteor.methods({

    deleteFile: function(id) {
      Files.remove(id);
      ShareJS.model["delete"](id);
    }

  });
}());
