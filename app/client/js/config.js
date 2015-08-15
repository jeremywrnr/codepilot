// configuration page

Template.config.helpers({

  repos: function() {
    return Repos.find({}, {sort: {'repo.owner': -1, 'repo.name': 1}} );
  },

  branches: function() { // if there are branches, return them
    var repo = Repos.findOne( Meteor.user().profile.repo );
    if (!repo) // user has yet to set a repo
      return [];
    var brs = repo.branches;
    if (brs)
      return brs;
    else // branches havent loaded || something else?
      return [];
  },

  repoSelecting: function() {
    return Session.get('repoSelecting');
  },

  branchSelecting: function() {
    return Session.get('branchSelecting');
  },


});

Template.config.events({

  'click .repoSelect': function(e) {
    e.preventDefault();
    Session.set('repoSelecting', true);
  },

  'click .branchSelect': function(e) {
    e.preventDefault();
    Session.set('branchSelecting', true);
  },

  'click .makePilot': function(e) {
    e.preventDefault();
    Meteor.call('setPilot');
  },

  'click .makeCopilot': function(e) {
    e.preventDefault();
    Meteor.call('setCopilot');
  },

  'click .loadGHData': function(e) {
    e.preventDefault();
    Meteor.call('getAllRepos');
  }

});

Template.repo.events({

  'click .repo': function(e) {
    Meteor.call('setRepo', this); // set the active project / repo
    Meteor.call('getBranches', this); // get all the possible branches
    Meteor.call('initCommits'); // pull commit history for this repo
    Meteor.call('loadHead'); // load the head of this branch into CP
    Session.set('repoSelecting', false); // hide the available repos
  }

});

Template.branch.events({

  'click .branch': function(e) {
    Meteor.call('setBranch', this.name);
    Session.set('branchSelecting', false); // hide the available branches
  }

});
