// configuration page

var prof = GitSync.prof;

Template.config.helpers({
  repos: function() {
    return Repos.find({}, {sort: {"repo.owner": -1, "repo.name": 1}} );
  },

  branches: function() { // if there are branches, return them
    var repo = Repos.findOne( prof().repo );
    if (!repo) // user has yet to set a repo
      return [];
    var brs = repo.branches;
    if (brs)
      return brs;
    else // branches havent loaded || something else?
      return [];
  },

  repoSelecting: function() {
    return Session.equals("focusPane", "repo");
  },

  branchSelecting: function() {
    return Session.equals("focusPane", "branch");
  },
});


Template.config.events({
  "click .repoSelect": function(e) { // show the available repos
    e.preventDefault();
    Session.set("focusPane", "repo");
    if (Repos.find({}).count() === 0) { // if no repos, load them in
      Meteor.call("getAllRepos");
    }
  },

  "click .branchSelect": function(e) { // show the available branches
    e.preventDefault();
    var repo = Repos.findOne(prof().repo);
    if (repo) Meteor.call("initBranches", repo); // get all possible branches
    Session.set("focusPane", "branch");
  },

  "click .unfocus": function(e) { // hide the available repos
    e.preventDefault();
    Session.set("focusPane", null);
    Session.set("branching", false);
    Session.set("forking", false);
  },

  "click .loadGHData": function(e) { // load in repos from github
    e.preventDefault();
    Meteor.call("getAllRepos");
  }
});


// repo forking may improve life

Template.forkRepo.helpers({

  forking: function() {
    return Session.equals("forking", true);
  },

});


Template.forkRepo.events({

  "click .forkrepo": function(e) { // display the forking code box
    e.preventDefault();
    Session.set("forking", true);
    focusForm("#repoForker");
  },

  "submit .forker": function(e) { // fork and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur(); // parse string arg for user, repo
    //const [user, repo] = $("#repoForker")[0].value.split("/"); // ES6 not working???
    //https://babeljs.io/docs/learn-es2015/#destructuring - sadness :(((((((((
    var split = $("#repoForker")[0].value.split("/");
    var user = split[0];
    var repo = split[1];
    var selfFork = (prof().login === user); // cant fork self
    if (split.length !== 2 || !user || !repo || selfFork) return false;
    Meteor.call("forkRepo", user, repo);
    Session.set("forking", false);
  },

  "click .cancelFork": function(e) {
    Session.set("forking", false);
  },
});



// make branch forking work as well

Template.newBranch.helpers({
  branching: function() {
    return Session.get("branching");
  },

  currentBranch: function() {
    return prof().repoBranch;
  },
});


Template.newBranch.events({
  "click .newBranch": function(e) { // display the branching code box
    e.preventDefault();
    Session.set("branching", true);
    focusForm("#brancher");
  },

  "submit .brancher": function(e) { // fork and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur(); // parse string arg for user, repo
    var branchName = $.trim( $("#branchNamer")[0].value );
    // TODO: check if existing branch, deny
    // TODO: check for illegal branchnames
    // http://stackoverflow.com/questions/3651860/which-characters-are-illegal-within-a-branch-name
    if (branchName.length == 0) return false;
    Meteor.call("addBranch", branchName);
    Session.set("branching", false);
    Session.set("focusPane", null);
  },

  "click .cancelBranch": function(e) {
    Session.set("branching", false);
  },
});



// existing git repo and branch handling

Template.repo.events({

  "click .repo": function(e) { // load a different repo into GitSync
    if (prof().repo !== this._id)
      Meteor.call("loadRepo", this);
    Session.set("focusPane", null);
    Session.set("testFile", null);
  }

});

Template.branch.events({

  "click .branch": function(e) { // load a different branch into GitSync
    if (prof().repoBranch !== this.name)
      Meteor.call("loadBranch", this.name);
    Session.set("focusPane", null);
  }

});

Template.extras.events({

  "click .resetfiles": function(e) { // reset to most basic website...
    var trulyReset = confirm("This will overwrite any uncommitted changes. Proceed?");
    if (trulyReset) Meteor.call("resetFiles");
  },

});

