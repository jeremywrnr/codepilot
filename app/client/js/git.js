// git things

Template.commitPanel.events = {

  "click .resetfiles": function(e) {
    Meteor.call('resetFiles');
  },

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

