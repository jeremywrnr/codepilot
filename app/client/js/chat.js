// messages

Template.chatter.events = {
  'keydown input#message': function(e) {
    // 'enter' keycode recieved
    if (e.which === 13) {
      var message = $('input#message')[0];
      if (message.value !== '') {
        Messages.insert({
          name: Meteor.user().profile.name,
          message: message.value,
          time: Date.now()
        });
        // purge the old message
        message.value = '';
      }
    }
  }
};

Template.messages.helpers({
  messages: function() {
    return Messages.find({}, { sort: { time: -1 } });
  }
});
