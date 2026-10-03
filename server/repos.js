// server repo and branch loading

Meteor.methods({

  //////////////////
  // REPO MANAGEMENT
  //////////////////

  async loadRepo(gr) { // load a repo into code pilot
    await Meteor.callAsync("setRepo", gr); // set the active project / repo
    await Meteor.callAsync("initBranches", gr); // get all the possible branches
    const branch = gr.repo.default_branch;
    await Meteor.callAsync("setBranch", branch); // set branch
    await Meteor.callAsync("initCommits"); // pull commit history for gr repo

    // if has loaded files, then just set the repo
    const anyFile = await Files.findOneAsync({repo: gr._id, branch})
    if (anyFile) return true;

    await Meteor.callAsync("loadHead", branch); // load the head of gr branch into CP
    const full = `${gr.repo.owner.login}/${gr.repo.name}`;
    await Meteor.callAsync("addMessage", `started working on repo - ${full}`);
  },

  async forkRepo(user, repo) { // create a fork
    try { // if the repo exists/isForkable
      await Meteor.callAsync("getRepo", user, repo);

      // try to post a forked version on GH
      await Meteor.callAsync("postRepo", user, repo);

      // pull in the forked version
      await Meteor.callAsync("getAllRepos");
    } catch (err) { // this repo won't no fork
      console.error(err);
      throw new Meteor.Error("fork-failed", `couldn't fork repo '${repo}'`);
    }
  },



  ////////////////////
  // BRANCH MANAGEMENT
  ////////////////////

  // for the current repo, just overwrite branches with new
  async initBranches(gr) { // get all branches for this repo
    const brs = await Meteor.callAsync("getBranches", gr); // res from github
    await Repos.updateAsync(gr._id, { $set: {branches: brs }});
  },

  async addBranch(bn) { // create a new branch from branchname (bn)
    const prof = (await Meteor.userAsync()).profile;
    const repo = await Repos.findOneAsync(prof.repo);
    const parent = (await Meteor.callAsync("getBranch", prof.repoBranch)).commit.sha;
    await Meteor.callAsync("postBranch", bn, parent);
    await Meteor.callAsync("initBranches", repo);
    await Meteor.callAsync("setBranch", bn);
    await Meteor.callAsync("addMessage", `created branch - ${bn}`);
  },

  async loadBranch(bn) { // load a branch into code pilot
    await Meteor.callAsync("setBranch", bn); // set branch for current user
    await Meteor.callAsync("initCommits"); // pull commit history for this repo
    await Meteor.callAsync("loadHead", bn); // load the head of this branch into CP
    await Meteor.callAsync("addMessage", `started working on branch - ${bn}`);
  },

});
