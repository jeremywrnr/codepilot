// git things

Template.commitPanel.events = {

  "click .resetfiles": function() {
    Meteor.call('resetFiles');
  },

  "click .newcommit": function() {
    Meteor.call('makeCommit');
  },

  "click .loadcommit": function() {
    Meteor.call('loadCommit');
  }

};

Template.history.helpers({
  commits: function() {
    return Commits.find();
  }
});

Template.commit.helpers({
  current: function() {
    return Session.equals("commit", this._id);
  }
});

Template.commit.events = {
  "click .commit": function(e) {
    Session.set("commit", this._id);
  }
};

