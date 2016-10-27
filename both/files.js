// common (server and client) file and role methods

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  updateFile(id, txt) { // updating files from firepad snapshot
    Files.update(id, {$set: { content: txt }});
  },

  setPilot() { // change the current users profile.role to pilot
    return Meteor.users.update(
      {"_id": Meteor.userId()},
      {$set : {"profile.role":"pilot"}}
    );
  },

  setCopilot() { // change the current users profile.role to pilot
    return Meteor.users.update(
      {"_id": Meteor.userId()},
      {$set : {"profile.role":"copilot"}}
    );
  },

});
