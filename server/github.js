// wrappers for github api methods

import { ghContext } from "/imports/server/github";

// attach the current user to a github repo (gr), inserting it if new
const attachUser = async (uid, gr) => {
  const repo = await Repos.findOneAsync({ id: gr.id });
  if (repo) { // repo already exists
    if (! repo.users.includes(uid)) // not attached, push user to collaborators
      await Repos.updateAsync(repo._id, {$push: {users: uid }});
  } else { // brand new repo, just insert.
    await Repos.insertAsync({ id: gr.id, users: [ uid ], repo: gr });
  }
};

Meteor.methods({

  //////////////////////
  // GITHUB GET REQUESTS
  //////////////////////

  async getAllRepos() { // put them in db, serve to user (no return)
    const { gh } = await ghContext();
    const repos = await gh("GET /user/repos", { per_page: 100 });
    for (const gr of repos)
      await attachUser(this.userId, gr);
  },

  async getAllIssues(gr) { // return all issues for repo
    const { gh } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/issues", {
      owner: gr.repo.owner.login,
      repo: gr.repo.name,
      state: "open", // or closed, etc
    });
  },

  async getAllCommits() { // give all commits for branch
    const { gh, target, prof } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/commits", {
      ...target,
      sha: prof.repoBranch,
      per_page: 100
    });
  },

  async getRepo(owner, repo) { // validate access first, so private repos work
    const { gh } = await ghContext();
    const gr = await gh("GET /repos/{owner}/{repo}", { owner, repo });
    await attachUser(this.userId, gr);
  },

  async getCommit(commitSHA) { // give commit res
    const { gh, target } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/commits/{ref}", {
      ...target,
      ref: commitSHA
    });
  },

  async getBranches(gr) { // update all branches for repo
    const { gh } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/branches", {
      owner: gr.repo.owner.login,
      repo: gr.repo.name
    });
  },

  async getBranch(branchName) { // give branch res
    const { gh, target } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/branches/{branch}", {
      ...target,
      branch: branchName
    });
  },

  async getTree(treeSHA) { // gives tree res
    const { gh, target } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/git/trees/{sha}", {
      ...target,
      sha: treeSHA,
      recursive: 1 // handle folders
    });
  },

  async getBlob(blob) { // give a blobs file contents
    const { gh, target } = await ghContext();
    return await gh("GET /repos/{owner}/{repo}/git/blobs/{sha}", {
      ...target,
      sha: blob.sha
    }, { raw: true });
  },



  ///////////////////////
  // GITHUB POST REQUESTS
  ///////////////////////

  async postTree(t) { // takes tree, gives tree SHA hash id
    const { gh, target } = await ghContext();
    const tree = await gh("POST /repos/{owner}/{repo}/git/trees", {
      ...target,
      ...(t.base ? { base_tree: t.base } : {}),
      tree: t.tree,
    });
    return tree.sha; // beware!! - returns sha, not the entire post response
  },

  async postBranch(branch, parent) { // make new branch off current
    const { gh, target } = await ghContext();
    return await gh("POST /repos/{owner}/{repo}/git/refs", {
      ...target,
      ref: `refs/heads/${branch}`, // new branch name
      sha: parent, // sha hash of parent
    });
  },

  async postCommit(c) { // takes commit c, returns gh commit respns.
    const { gh, target } = await ghContext();
    return await gh("POST /repos/{owner}/{repo}/git/commits", {
      ...target,
      message: c.message,
      author: { ...c.author, date: new Date(c.author.date).toISOString() },
      parents: c.parents,
      tree: c.tree,
    });
  },

  async postRef(cr) { // takes commit results (cr),  updates ref
    const { gh, target, prof } = await ghContext();
    return await gh("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
      ...target,
      ref: `heads/${prof.repoBranch}`,
      sha: cr.sha
    });
  },

  async postRepo(owner, repo) { // done to fork a repo for a new user
    const { gh } = await ghContext();
    return await gh("POST /repos/{owner}/{repo}/forks", { owner, repo });
  },

});
