// messages and events feed

Template.chatter.events = {

  'keydown input#message': function(e) {
    if (e.which === 13) { // 'enter' keycode recieved
      var msg = $('input#message')[0];
      Meteor.call('addMessage', jQuery.trim(msg.value));
      msg.value = ''; // purge the old message
      // scroll to the bottom of the feed
      $('#feed').stop().animate({ scrollTop: $("#feed")[0].scrollHeight }, 500);
    }
  }

};

Template.messages.helpers({

  messageCount: function() { // linkify and return feed items
    return Messages.find({}).count();
  },

  messages: function() { // linkify and return feed items
    var feed = Messages.find({}, {sort: {time: 1}});
    return feed.map(function(msg){
      msg.linkd = linkifyStr(msg.message);
      return msg;
    });
  },

});
