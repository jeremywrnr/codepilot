// git things

Template.commitPanel.events = {

  // rename the current file
  "keydown input[name=title]": function(e) {
    var txt = e.target.value;
    if (e.keyCode !== 13 || txt == null || txt == '')
      return;
    e.preventDefault();
    Session.set("commit", false);
    Files.update(id, { title: e.target.value });
  },

  "click .resetfiles": function() {
    Meteor.call('resetFiles');
  },

  "click .newcommit": function() {
    Session.set('committing', true)
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

