// common (server and client) github methods

Meteor.methods({

  //////////////////
  // REPO MANAGEMENT
  //////////////////

  updateRepo() { // update when repo was last updated
    return Meteor.users.update(
      {"_id": Meteor.userId()},
      {$set : {
        "profile.lastUpdated": new Date(),
      }});
  },

  loadRepo(gr) { // load a repo into code pilot
    Meteor.call("setRepo", gr); // set the active project / repo
    Meteor.call("initBranches", gr); // get all the possible branches
    const branch = gr.repo.default_branch;
    Meteor.call("setBranch", branch); // set branch
    Meteor.call("initCommits"); // pull commit history for gr repo

    // if has loaded files, then just set the repo
    var anyFile = Files.findOne({repo: gr._id})
    if (anyFile) return true;

    Meteor.call("loadHead", branch); // load the head of gr branch into CP
    const full = `${gr.repo.owner.login}/${gr.repo.name}`;
    Meteor.call("addMessage", `started working on repo - ${full}`);
  },

  setRepo(gr) { // set git repo & default branch
    return Meteor.users.update(
      {"_id": Meteor.userId()},
      {$set : {
        "profile.repo": gr._id,
        "profile.repoName": gr.repo.name,
        "profile.repoOwner": gr.repo.owner.login,
        "profile.repoBranch": gr.repo.owner.default_branch
      }});
  },

  forkRepo(user, repo) { // create a fork
    try { // if the repo exists/isForkable
      console.log(Meteor.call("getRepo", user, repo));

      // try to post a forked version on GH
      console.log(Meteor.call("postRepo", user, repo));

      // pull in the forked version
      Meteor.call("getAllRepos");

    } catch (err) { // this repo won't no fork
      dlog(err);
    }
  },



  ////////////////////
  // BRANCH MANAGEMENT
  ////////////////////

  // for the current repo, just overwrite branches with new
  initBranches(gr) { // get all branches for this repo
    const brs = Meteor.call("getBranches", gr); // res from github
    Repos.update(gr._id, { $set: {branches: brs }});
  },

  addBranch(bn) { // create a new branch from branchname (bn)
    const repo = Repos.findOne(Meteor.user().profile.repo);
    const branch = Meteor.user().profile.repoBranch;
    const parent = Meteor.call("getBranch", branch).commit.sha;
    const newBranch = Meteor.call("postBranch", bn, parent);
    Meteor.call("initBranches", repo);
    Meteor.call("setBranch", bn);
    Meteor.call("addMessage", `created branch - ${bn}`);
  },

  loadBranch(bn) { // load a repo into code pilot
    Meteor.call("setBranch", bn); // set branch for current user
    Meteor.call("initCommits"); // pull commit history for this repo
    Meteor.call("loadHead", bn); // load the head of this branch into CP
    Meteor.call("addMessage", `started working on branch - ${bn}`);
  },

  setBranch(bn) { // set branch name
    return Meteor.users.update(
      {"_id": Meteor.userId()},
      {$set : {
        "profile.repoBranch": bn,
      }});
  },
});
