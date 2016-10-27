// common (server and client) feed methods

Meteor.methods({

  //////////////////
  // FEED MANAGEMENT
  //////////////////

  addMessage(msg) { // add a generic message to the activity feed
    if (msg.length) {
      Messages.insert({
        owner: Meteor.userId(),
        repo: Meteor.user().profile.repo,
        name: Meteor.user().profile.login,
        time: Date.now(),
        message: msg,
      });

      // scroll to the bottom of the feed
      if(Meteor.isClient)
        $("#feed").stop().animate({ scrollTop: $("#feed")[0].scrollHeight }, 500);
    } else
      throw new Meteor.Error("null-message"); // passed in empty message
  },

  addUserMessage(usr, msg) { // add message, with userId() (issues)
    const poster = Meteor.users.findOne(usr);
    if (msg.value !== "") {
      if (poster) {
        Messages.insert({
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
