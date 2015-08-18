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

  'click .repoSelect': function(e) { // show the available repos
    e.preventDefault();
    Session.set('repoSelecting', true);
  },

  'click .repoCancel': function(e) { // hide the available repos
    e.preventDefault();
    Session.set('repoSelecting', false);
  },

  'click .branchSelect': function(e) { // show the available branches
    e.preventDefault();
    Session.set('branchSelecting', true);
  },

  'click .branchCancel': function(e) { // hide the available branches
    e.preventDefault();
    Session.set('branchSelecting', false);
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



// repo forking may improve life

Template.forkRepo.helpers({

  forking: function() {
    return Session.get('forking');
  },

});

Template.forkRepo.events({

  'click .forkrepo': function(e) { // display the forking code box
    e.preventDefault();
    Session.set('forking', true);
    focusForm('#repoForker');
  },

  'submit .forker': function(e) { // fork and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur(); // parse string arg for user, repo
    var [user, repo] = $('#repoForker')[0].value.split('/');
    var selfFork = (Meteor.user().profile.login === user); // cant fork self
    if (!user || !repo || selfFork) return false;
    Meteor.call('forkRepo', user, repo);
    Session.set('forking', false);
  },

  'click .cancelFork': function(e) {
    Session.set('forking', false);
  },

});



// existing git repo and branch handling

Template.repo.events({

  'click .repo': function(e) {
    Meteor.call('setRepo', this); // set the active project / repo
    Meteor.call('initBranches', this); // get all the possible branches
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

Template.extras.events({

  'click .resetfiles': function(e) { // reset to most basic website...
    Meteor.call('resetFiles');
  },

});
