// common (server and client) file and role methods

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  async updateFile(id, txt) { // updating files from firepad snapshot
    await Files.updateAsync(id, {$set: { content: txt }});
  },

  async setPilot() { // change the current users profile.role to pilot
    return await Meteor.users.updateAsync(
      {"_id": Meteor.userId()},
      {$set : {"profile.role":"pilot"}}
    );
  },

  async setCopilot() { // change the current users profile.role to pilot
    return await Meteor.users.updateAsync(
      {"_id": Meteor.userId()},
      {$set : {"profile.role":"copilot"}}
    );
  },

});
