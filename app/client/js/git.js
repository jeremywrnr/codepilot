// git things

Template.commitPanel.events = {

  "click .newcommit": function(e) {
    Meteor.call('makeCommit');
  },

  "click .loadcommit": function(e) {
    Meteor.call('loadCommit');
  }

};

Template.history.helpers({
  commits: function() { return Commits.find() }
});

