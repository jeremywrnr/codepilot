// git things - version control, importing code

Template.commitPanel.helpers({

  branch: function() {
    return Meteor.user().profile.repoBranch;
  },

  committing: function() {
    return Session.get('committing');
  },

});

Template.commitPanel.events = {

  'click .newcommit': function(e) {
    e.preventDefault();
    Session.set('committing', true);
    focusForm('#commitMsg');
  },

  'submit .committer': function(e) {
    e.preventDefault();
    $(e.target).blur();
    var msg = $('#commitMsg')[0].value;
    if (msg == null || msg == '') return false;
    Session.set('committing', false);
    Meteor.call('makeCommit', msg);
  },

  'click .cancelCommit': function(e) {
    Session.set('committing', false);
  },

  'click .refresh': function(e) { // pull in latest commits from gh
    Meteor.call('initCommits');
  },

  'click .loadhead': function(e) { // load head of branch into SJS
    Meteor.call('loadHead', Meteor.user().profile.repoBranch);
  },

};

Template.history.helpers({ // sort the commits by time

  commits: function() {
    return Commits.find({}, {sort: {'commit.commit.committer.date': -1}} );
  },

  commitCount: function() {
    return Commits.find({}).count();
  },

});

Template.commit.helpers({
  current: function() {
    return Session.equals('commit', this._id);
  },
  mine: function() {
    return (Meteor.user().profile.login === this.commit.author.login)
  }
});

Template.commit.events = {

  'click .commit': function(e) {
    if ( Session.equals('commit', this._id) ) {
      Session.set('commit', null);
    } else {
      Session.set('commit', this._id);
    }
  },

  'click .loadcommit': function(e) {
    Meteor.call('loadCommit', this.commit.sha);
  },

};

