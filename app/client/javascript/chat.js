// messages

Template.messages.helpers({
  messages: function() {
    return Messages.find({}, { sort: { time: -1 } });
  }
});

Template.input.events = {
  'keydown input#message': function(event) {
    var name;
    var message;
    if (event.which === 13) {
      if (Meteor.user()) {
        name = Meteor.user().profile.name;
      } else {
        name = 'Anon';
      }
      message = document.getElementById('message');
      if (message.value !== '') {
        Messages.insert({
          name: name,
          message: message.value,
          time: Date.now()
        });
        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  }
};
