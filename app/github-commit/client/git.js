// git things

Template.git.helpers({
  commits: function() { return Commits.find() }
});

Template.git.events = {

  "click .newcommit": function(e) {
    Meteor.call('makeCommit');
  },

  "click .loadgithub": function(e) {
    console.log('Coming soon...');
  }

};
