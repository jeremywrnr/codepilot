// git things

Template.commitPanel.events = {

  "click .newcommit": function(e) {
    Meteor.call('makeCommit');
  },

  "click .loadgithub": function(e) {
    console.log('Coming soon...');
  }

};

Template.history.helpers({
  commits: function() { return Commits.find() }
});

