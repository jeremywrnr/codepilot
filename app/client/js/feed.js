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
