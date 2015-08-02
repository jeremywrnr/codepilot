// git things

Template.commitPanel.helpers({
  committing: function() {
    return Session.get('committing');
  }
});

Template.commitPanel.events = {

  // rename the current file
  "submit .committer": function(e) {
    e.preventDefault();
    $(e.target).blur();
    var msg = $('#commitMsg')[0].value;
    if (msg == null || msg == '') return false;
    Session.set("committing", false);
    Meteor.call('makeCommit', msg);
  },

  "click .resetfiles": function(e) {
    Meteor.call('resetFiles');
  },

  "click .newcommit": function(e) {
    e.preventDefault();
    Session.set('committing', true);
    focusForm('#commitMsg');
  },

  "click .cancelCommit": function(e) {
    Session.set('committing', false);
  },

  "click .loadcommit": function(e) {
    Meteor.call('loadCommit');
  }

};

Template.history.helpers({
  commits: function() {
    return Commits.find({}, {sort: {"commit.committer.date": -1}} );
  }
});

Template.commit.helpers({
  current: function() {
    return Session.equals("commit", this._id);
  },
  mine: function() {
    return (Meteor.user().profile.login === this.author.login)
  }
});

Template.commit.events = {
  "click .commit": function(e) {
    Session.set("commit", this._id);
  }
};

