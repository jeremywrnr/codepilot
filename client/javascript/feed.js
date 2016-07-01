// messages and events feed

const linkify = GitSync.linkify;

Template.chatter.events({

  "keydown input#message"(e) {
    if (e.which === 13) { // "enter" keycode recieved
      const msg = $("input#message")[0];
      Meteor.call("addMessage", $.trim(msg.value));
      msg.value = ""; // purge the old message
    }
  }

});


Template.messages.helpers({
  messageCount() { // count feed items
    return Messages.find({}).count();
  },

  messages() { // linkify and return feed items
    return Messages.find({}, {sort: {time: 1}});
  },
});


// scroll down on new messages
Template.message.onRendered(() => {
  const newFeedCount = Messages.find({}).count();
  const feed = $("#feed")[0];

  if ((! Session.equals("feedCount", newFeedCount)) && feed) {
    $("#feed").stop().animate({ scrollTop: feed.scrollHeight }, 500);
    Session.set("feedCount", newFeedCount);
  }

  // auto enable bootstrap tooltips
  $('[data-toggle="tooltip"]').tooltip()
});

Template.message.helpers({
  linked() { // return local message time
    return linkify(this.message);
  },

  timestamp() { // return local message time
    const msgdate = new Date(this.time);
    return msgdate.toLocaleTimeString().toLowerCase();
  },

  datestamp() { // return local message date
    const msgdate = new Date(this.time);
    return msgdate.toLocaleDateString();
  }
});
