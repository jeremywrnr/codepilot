// server (called) methods

(function () {
  Meteor.methods({

    deleteFile: function(id) {
      Files.remove(id);
      ShareJS.model["delete"](id);
    },

    setPilot: function() {
      return Meteor.users.update(
        {"_id":Meteor.userId()},
        {$set : {"profile.role":"pilot"}}
      );
    },

    setCopilot: function(){
      return Meteor.users.update(
        {"_id":Meteor.userId()},
        {$set : {"profile.role":"copilot"}}
      );
    }

  });
}());
