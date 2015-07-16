// server methods

(function () {
  Meteor.methods({

    deleteFile: function(id) {
      Files.remove(id);
      ShareJS.model["delete"](id);
    },

    setPilot: function(id) {
      return Users.update({"_id":id, {$set : {"role":"pilot"}} });
    },

    setCopilot: function(id) {
      return Users.update({"_id":id, {$set : {"role":"copilot"}} });
    }

  });
}());
