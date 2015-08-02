// messages and events feed

Template.chatter.events = {

  'keydown input#message': function(e) {
    if (e.which === 13) { // 'enter' keycode recieved
      var msg = $('input#message')[0];
      Meteor.call('addMessage', msg.value);
      msg.value = ''; // purge the old message
    }
  }

};

Template.messages.helpers({

  messages: function() {
    return Messages.find({}, { sort: { time: -1 } });
  }

});
