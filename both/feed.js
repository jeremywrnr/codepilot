// common (server and client) feed methods

Meteor.methods({

  //////////////////
  // FEED MANAGEMENT
  //////////////////

  async addMessage(msg) { // add a generic message to the activity feed
    if (msg.length) {
      const user = await Meteor.userAsync();
      await Messages.insertAsync({
        owner: user._id,
        repo: user.profile.repo,
        name: user.profile.login,
        time: Date.now(),
        message: msg,
      });

      // scroll to the bottom of the feed
      if(Meteor.isClient && $("#feed").length)
        $("#feed").stop().animate({ scrollTop: $("#feed")[0].scrollHeight }, 500);
    } else
      throw new Meteor.Error("null-message"); // passed in empty message
  },

  async addUserMessage(usr, msg) { // add message, with userId() (issues)
    const poster = await Meteor.users.findOneAsync(usr);
    if (msg.value !== "") {
      if (poster) {
        await Messages.insertAsync({
          owner: poster._id,
          repo: poster.profile.repo,
          name: poster.profile.login,
          time: Date.now(),
          message: msg,
        });
      } else
        throw new Meteor.Error("null-poster"); // user account is not in mongo
    } else
      throw new Meteor.Error("null-message"); // they passed in empty message
  },

});
