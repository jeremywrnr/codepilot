// configuration page

Template.config.helpers({

  users: function() { // give all CP project collaborators
    var repo = Repos.findOne(Meteor.user().profile.repo);
    if (repo) { // a repo has been selected so far
      return repo.users.map(function(uid){ // user id
        var user = Meteor.users.findOne(uid);
        if (user) return user.profile;
      });
    }
  },

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

  userShowing: function() {
    return Session.equals('focusPane', 'users');
  },

  repoSelecting: function() {
    return Session.equals('focusPane', 'repo');
  },

  branchSelecting: function() {
    return Session.equals('focusPane', 'branch');
  },

});

Template.config.events({

  'click .showUsers': function(e) { // show the repos registered users
    e.preventDefault();
    Session.set('focusPane', 'users');
  },

  'click .repoSelect': function(e) { // show the available repos
    e.preventDefault();
    Session.set('focusPane', 'repo');
  },

  'click .branchSelect': function(e) { // show the available branches
    e.preventDefault();
    Session.set('focusPane', 'branch');
  },

  'click .unfocus': function(e) { // hide the available repos
    e.preventDefault();
    Session.set('focusPane', null);
    Session.set('branching', false);
    Session.set('forking', false);
  },

  'click .makePilot': function(e) {
    e.preventDefault();
    Meteor.call('setPilot');
  },

  'click .makeCopilot': function(e) {
    e.preventDefault();
    Meteor.call('setCopilot');
  },

  'click .loadGHData': function(e) { // load in repos from github
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
    //const [user, repo] = $('#repoForker')[0].value.split('/'); // ES6 not working???
    //https://babeljs.io/docs/learn-es2015/#destructuring - sadness :(((((((((
    var split = $('#repoForker')[0].value.split('/');
    var user = split[0];
    var repo = split[1];
    var selfFork = (Meteor.user().profile.login === user); // cant fork self
    if (split.length !== 2 || !user || !repo || selfFork) return false;
    Meteor.call('forkRepo', user, repo);
    Session.set('forking', false);
  },

  'click .cancelFork': function(e) {
    Session.set('forking', false);
  },

});



// make branch forking work as well

Template.newBranch.helpers({

  branching: function() {
    return Session.get('branching');
  },

  currentBranch: function() {
    return Meteor.user().profile.repoBranch;
  },

});

Template.newBranch.events({

  'click .newBranch': function(e) { // display the branching code box
    e.preventDefault();
    Session.set('branching', true);
    focusForm('#brancher');
  },

  'submit .brancher': function(e) { // fork and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur(); // parse string arg for user, repo
    var branchName = $.trim( $('#branchNamer')[0].value );
    // TODO: check if existing branch, deny
    // TODO: check for illegal branchnames
    // http://stackoverflow.com/questions/3651860/which-characters-are-illegal-within-a-branch-name
    if (branchName.length == 0) return false;
    Meteor.call('newBranch', branchName);
    Session.set('branching', false);
  },

  'click .cancelBranch': function(e) {
    Session.set('branching', false);
  },

});



// existing git repo and branch handling

Template.repo.events({

  'click .repo': function(e) {
    Meteor.call('setRepo', this); // set the active project / repo
    Meteor.call('initBranches', this); // get all the possible branches
    Meteor.call('initCommits'); // pull commit history for this repo
    Meteor.call('loadHead'); // load the head of this branch into CP
    Meteor.call('postLabel'); // register codepilot label for new repo
    Session.set('repoSelecting', false); // hide the available repos
  }

});

Template.branch.events({

  'click .branch': function(e) {
    Meteor.call('setBranch', this.name);
    Session.set('focusPane', null); // hide the available branches
  }

});

Template.extras.events({

  'click .resetfiles': function(e) { // reset to most basic website...
    Meteor.call('resetFiles');
  },

});
