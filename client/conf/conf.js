// configuration page

const prof = GitSync.prof;
const focusForm = GitSync.focusForm;

Template.account.helpers({
  repos() {
    return Repos.find({}, {sort: {"repo.owner": -1, "repo.name": 1}} );
  },

  branches() { // if there are branches, return them
    const repo = Repos.findOne( prof().repo );
    if (!repo) // user has yet to set a repo
      return [];
    const brs = repo.branches;
    if (brs)
      return brs;
    else // branches havent loaded || something else?
      return [];
  },

  userHasRepo() { // empty string is default value for repo // selecting different repo
    return (Meteor.user() && Meteor.user().profile.repo != "")
  },

  repoSelecting() {
    return Session.equals("focusPane", "repo");
  },

  branchSelecting() {
    return Session.equals("focusPane", "branch");
  },

  lastUpdated() {
    return prof().lastUpdated.toLocaleString();
  },
});


Template.account.events({
  "click .repoSelect"(e) { // show the available repos
    e.preventDefault();
    Session.set("focusPane", "repo");
    if (Repos.find({}).count() === 0) { // if no repos, load them in
      Meteor.call("getAllRepos");
      Meteor.call("updateRepo");
    }
  },

  "click .branchSelect"(e) { // show the available branches
    e.preventDefault();
    const repo = Repos.findOne(prof().repo);
    if (repo) Meteor.call("initBranches", repo); // get all possible branches
    Session.set("focusPane", "branch");
  },

  "click .unfocus"(e) { // hide the available repos
    e.preventDefault();
    Session.set("focusPane", null);
    Session.set("branching", false);
    Session.set("forking", false);
  },

  "click .loadGHData"(e) { // load in repos from github
    e.preventDefault();
    Meteor.call("getAllRepos");
    Meteor.call("updateRepo");
  }
});


// repo forking may improve life

Template.forkRepo.helpers({

  forking() {
    return Session.equals("forking", true);
  },

});


Template.forkRepo.events({

  "click .forkrepo"(e) { // display the forking code box
    e.preventDefault();
    Session.set("forking", true);
    focusForm("#repoForker");
  },

  "submit .forker"(e) { // fork and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur(); // parse string arg for user, repo
    //https://babeljs.io/docs/learn-es2015/#destructuring - sadness :(((((((((
    //const [user, repo] = $("#repoForker")[0].value.split("/"); // ES6 not working???
    const split = $("#repoForker")[0].value.split("/");
    const user = split[0], repo = split[1];
    const selfFork = (prof().login === user); // cant fork self

    if (split.length !== 2 || !user || !repo || selfFork)
      return false;

    Session.set("loadingRepo", true);
    Meteor.call("forkRepo", user, repo, function (err, res) {

      // finding repo which was just forked
      let fName = prof().login + '/' + repo
      let fRepo = Repos.findOne({ "repo.full_name": fName })
      Session.set("forking", false);
      console.log(fName)
      console.log(fRepo)
      if (!fRepo || err) {
        Session.set("loadingRepo", false);
        return console.error(err)
      }

      // set repo to current, stop if error
      Meteor.call("setRepo", fRepo, function (e, r) {
        if (e) Session.set("loadingRepo", false)
      });

      // load the repo's contents
      Meteor.call("loadRepo", fRepo, function () {
        Session.set("loadingRepo", false)
      });
    });
  },

  "click .cancelFork"(e) {
    Session.set("forking", false);
  },
});



Template.typeRepo.helpers({

  typing() {
    return Session.equals("typing", true);
  },

});


Template.typeRepo.events({

  "click .typerepo"(e) { // display the typing code box
    e.preventDefault();
    Session.set("typing", true);
    focusForm("#repoTyper");
  },

  "submit .typer"(e) { // type and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur();

    // parse string arg for user, repo
    const full = $("#repoTyper")[0].value,
      split = full.split("/"),
      user = split[0],
      repo = split[1];

    if (split.length !== 2 || !user || !repo)
      return toastr.error("enter repo in the form 'user/repo'");

    Session.set("loadingRepo", true);
    Meteor.call("getRepo", user, repo, function (err, res) {

      // finding repo which was just typed
      let fRepo = Repos.findOne({ "repo.full_name": full })
      console.log(full);
      console.log(fRepo);
      Session.set("typing", false);
      if (!fRepo || err) {
        Session.set("loadingRepo", false);
        toastr.error(`couldn't select repo '${full}'`);
        return false;
      }

      // set repo to current, stop if error
      Meteor.call("setRepo", fRepo, function (e, r) {
        if (e) Session.set("loadingRepo", false)
      });

      // load the repo's contents
      Meteor.call("loadRepo", fRepo, function () {
        Session.set("loadingRepo", false)
      });
    });
  },

  "click .cancelType"(e) {
    Session.set("typing", false);
  },
});



// make branch forking work as well

Template.newBranch.helpers({
  branching() {
    return Session.get("branching");
  },

  currentBranch() {
    return prof().repoBranch;
  },
});


Template.newBranch.events({
  "click .newBranch"(e) { // display the branching code box
    e.preventDefault();
    Session.set("branching", true);
    focusForm("#brancher");
  },

  "submit .brancher"(e) { // fork and load a repo into code pilot
    e.preventDefault();
    $(e.target).blur(); // parse string arg for user, repo
    const branchName = $.trim( $("#branchNamer")[0].value );
    // TODO: check if existing branch, deny
    // TODO: check for illegal branchnames
    // http://stackoverflow.com/questions/3651860/which-characters-are-illegal-within-a-branch-name
    if (branchName.length == 0) return false;
    Meteor.call("addBranch", branchName);
    Session.set("branching", false);
    Session.set("focusPane", null);
  },

  "click .cancelBranch"(e) {
    Session.set("branching", false);
  },
});



// existing git repo and branch handling

Template.repo.events({

  "click .repo"(e) { // load a different repo into GitSync
    if (prof().repo !== this._id) { // selecting different repo
      Session.set("loadingRepo", true)
      Meteor.call("loadRepo", this, function () {
        Session.set("loadingRepo", false)
      });
    }

    Session.set("focusPane", null);
    Session.set("testFile", null);
  }

});

Template.branch.events({

  "click .branch"(e) { // load a different branch into GitSync
    if (prof().repoBranch !== this.name)
      Meteor.call("loadBranch", this.name);
    Session.set("focusPane", null);
  }

});

Template.extras.events({

  "click .resetfiles"(e) { // reset to most basic website...
    const trulyReset = confirm("This will overwrite any uncommitted changes. Proceed?");
    if (trulyReset) Meteor.call("resetFiles");
  },

});

