// update all file contents, refreshing the tester frame

Template.tester.events({

  'click .reload': function () {
    Meteor.call('testShareJS'); // in server-methods
  },

});

Template.renderPanel.events({

  'click .reload': function () {
    Meteor.call('testShareJS'); // in server-methods
  },

});
