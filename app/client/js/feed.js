// messages and events feed

Template.chatter.events({

  'keydown input#message': function(e) {
    if (e.which === 13) { // 'enter' keycode recieved
      var msg = $('input#message')[0];
      Meteor.call('addMessage', $.trim(msg.value));
      msg.value = ''; // purge the old message
    }
  }

});

Template.messages.helpers({

  messageCount: function() { // count feed items
    return Messages.find({}).count();
  },

  messages: function() { // linkify and return feed items
    return Messages.find(
      {}, {sort: {time: 1}}
    ).map(function linkMessage(msg) { // return linkd
      msg.linkd = linkifyStr(msg.message);
      return msg;
    });
  },

});

Template.message.onRendered(function () { // scroll down on new messages
  var feed = $("#feed")[0];
  var newFeedCount = Messages.find({}).count();
  if (! Session.equals('feedCount', newFeedCount)) {
    if (feed) {
      $('#feed').stop().animate({ scrollTop: feed.scrollHeight }, 500);
      Session.set('feedCount', newFeedCount);
    }
  }
});

