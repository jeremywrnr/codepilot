// wrappers for github api methods
// dlog is debugger log, see server/setup.js

Meteor.methods({

  //////////////////////
  // GITHUB GET REQUESTS
  //////////////////////

  ghAuth() { // authenticate for secure api calls
    github.authenticate({
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
  },

  getAllRepos() { // put them in db, serve to user (no return)
    Meteor.call("ghAuth"); // auth for getting all pushable repos
    const uid = Meteor.userId(); // userID, used below
    github.repos.getAll({
      user: Meteor.user().profile.login,
      per_page: 100
    }).map(function attachUser(gr){ // attach user to git repo (gr)

      const repo = Repos.findOne({ id: gr.id });
      if (repo) { // repo already exists

        const attached = (repo.users.indexOf( uid ) > -1);
        if (! attached) // not attached, push user to collaborators
          Repos.update(repo._id, {$push: {users: uid }});

      } else { // brand new repo, just insert.
        Repos.insert({ id: gr.id, users: [ uid ], repo: gr });
      }

    });
  },

  getAllIssues(gr) { // return all issues for repo
    return github.issues.repoIssues({
      user: gr.repo.owner.login,
      repo: gr.repo.name,
      state: "open", // or closed, etc
    });
  },

  getAllCommits() { // give all commits for branch
    return github.repos.getCommits({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: Meteor.user().profile.repoBranch,
      per_page: 100
    });
  },

  getRepo(owner, repo) { // give github repo res (todo: check this works well)
    return github.repos.get({
      user: owner,
      repo
    });
  },

  getCommit(commitSHA) { // give commit res
    return github.repos.getCommit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: commitSHA
    });
  },

  getBranches(gr) { // update all branches for repo
    return github.repos.getBranches({
      user: gr.repo.owner.login,
      repo: gr.repo.name
    });
  },

  getBranch(branchName) { // give branch res
    return github.repos.getBranch({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      branch: branchName
    });
  },

  getTree(treeSHA) { // gives tree res
    return github.gitdata.getTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: treeSHA,
      recursive: true // handle folders
    });
  },

  getBlob(blob) { // give a blobs file contents
    return github.gitdata.getBlob({
      headers: {"Accept":"application/vnd.github.VERSION.raw"},
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: blob.sha
    });
  },



  ///////////////////////
  // GITHUB POST REQUESTS
  ///////////////////////

  postIssue(issue) { // takes feedback issue, creates GH issue
    // custom login - iframe not given Meteor.user() scope
    const user = Meteor.users.findOne(issue.user);
    const token = user.services.github.accessToken;
    github.authenticate({ type: "token", token });
    return github.issues.create({ // return githubs issue response
      user: user.profile.repoOwner,
      repo: user.profile.repoName,
      title: issue.note,
      body: issue.body,
      labels: ["bug", "GitSync"]
    });
  },

  postTree(t) { // takes tree, gives tree SHA hash id
    Meteor.call("ghAuth");
    return github.gitdata.createTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      base_tree: t.base || "",
      tree: t.tree,
    }).sha; // beware!! - returns sha, not the entire post response
  },

  postBranch(branch, parent) { // make new branch off current
    Meteor.call("ghAuth");
    return github.gitdata.createReference({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      ref: `refs/heads/${branch}`, // new branch name
      sha: parent, // sha hash of parent
    });
  },

  postCommit(c) { // takes commit c, returns gh commit respns.
    Meteor.call("ghAuth");
    return github.gitdata.createCommit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      message: c.message,
      author: c.author,
      parents: c.parents,
      tree: c.tree,
    });
  },

  postRef(cr) { // takes commit results (cr),  updates ref
    Meteor.call("ghAuth");
    return github.gitdata.updateReference({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      ref: `heads/${Meteor.user().profile.repoBranch}`,
      sha: cr.sha
    });
  },

  postRepo(owner, repo) { // done to fork a repo for a new user
    Meteor.call("ghAuth");
    return  github.repos.fork({
      user: owner,
      repo
    });
  },
});
