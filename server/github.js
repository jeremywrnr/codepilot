// wrappers for github api methods
// dlog is debugger log, see server/setup.js

Meteor.methods({

  //////////////////////
  // GITHUB GET REQUESTS
  //////////////////////

  ghAuth: function() { // authenticate for secure api calls
    github.authenticate({
      type: 'token',
      token: Meteor.user().services.github.accessToken
    });
  },

  getAllRepos: function() { // put them in db, serve to user (no return)
    Meteor.call('ghAuth'); // auth for getting all pushable repos
    var uid = Meteor.userId(); // userID, used below
    github.repos.getAll({
      user: Meteor.user().profile.login,
      per_page: 100
    }).map(function attachUser(gr){ // attach user to git repo (gr)

      var repo = Repos.findOne({ id: gr.id });
      if (repo) { // repo already exists

        var attached = (repo.users.indexOf( uid ) > -1);
        if (! attached) // not attached, push user to collaborators
          Repos.update(repo._id, {$push: {users: uid }});

      } else { // brand new repo, just insert.
        Repos.insert({ id: gr.id, users: [ uid ], repo: gr });
      }

    });
  },

  getAllIssues: function(gr) { // return all issues for repo
    return github.issues.repoIssues({
      user: gr.repo.owner.login,
      repo: gr.repo.name,
      state: 'open', // or closed, etc
    });
  },

  getAllCommits: function() { // give all commits for branch
    return github.repos.getCommits({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: Meteor.user().profile.repoBranch,
      per_page: 100
      //since: (Date Timestamp (ISO 8601)): YYYY-MM-DDTHH:MM:SSZ
    });
  },

  getRepo: function(owner, repo) { // give github repo res
    return github.repos.get({
      user: owner,
      repo: repo
    });
  },

  getCommit: function(commitSHA) { // give commit res
    return github.repos.getCommit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: commitSHA
    });
  },

  getBranches: function(gr) { // update all branches for repo
    return github.repos.getBranches({
      user: gr.repo.owner.login,
      repo: gr.repo.name
    });
  },

  getBranch: function(branchName) { // give branch res
    return github.repos.getBranch({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      branch: branchName
    });
  },

  getTree: function(treeSHA) { // gives tree res
    return github.gitdata.getTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: treeSHA,
      recursive: true // handle folders
    });
  },

  getContent: function(filename) { // get encoded content of a file
    return github.repos.getContent({
      //headers: {'Accept':'application/vnd.github.VERSION.raw'},
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      path: filename,
      ref: Meteor.user().profile.repoBranch,
    });
  },

  getBlob: function(blob) { // give a blobs file contents
    return github.gitdata.getBlob({
      headers: {'Accept':'application/vnd.github.VERSION.raw'},
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: blob.sha
    });
  },







  ///////////////////////
  // GITHUB POST REQUESTS
  ///////////////////////

  postLabel: function(gr) { // used in repo initing - create GitSync issue label
    Meteor.call('ghAuth');
    if (! gr.labelCreated) {
      return github.issues.createLabel({
        user: Meteor.user().profile.repoOwner,
        repo: Meteor.user().profile.repoName,
        name: 'GitSync',
        color: '#f14e32' // set the GitSync label color black for this repo
      });
    } else { // mark label created
      gr.labelCreated = true;
    }
  },

  postIssue: function(issue) { // takes feedback issue, creates GH issue
    // custom login - iframe not given Meteor.user() scope
    var user = Meteor.users.findOne(issue.user);
    var token = user.services.github.accessToken;
    github.authenticate({ type: 'token', token: token });
    return github.issues.create({ // return githubs issue response
      user: user.profile.repoOwner,
      repo: user.profile.repoName,
      title: issue.note,
      body: issue.body,
      labels: ['bug', 'GitSync']
    });
  },

  postTree: function(t) { // takes tree, gives tree SHA hash id
    Meteor.call('ghAuth');
    return github.gitdata.createTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      tree: t.tree,
      base_tree: t.base
    }).sha; // beware!! - returns sha, not the entire post response
  },

  postBranch: function(branch, parent) { // make new branch off current
    Meteor.call('ghAuth');
    return github.gitdata.createReference({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      ref: 'refs/heads/' + branch, // new branch name
      sha: parent, // sha hash of parent
    });
  },

  postCommit: function(c) { // takes commit c, returns gh commit respns.
    Meteor.call('ghAuth');
    return github.gitdata.createCommit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      message: c.message,
      author: c.author,
      parents: c.parents,
      tree: c.tree
    });
  },

  postRef: function(cr) { // takes commit results (cr),  updates ref
    Meteor.call('ghAuth');
    return github.gitdata.updateReference({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      ref: 'heads/' + Meteor.user().profile.repoBranch,
      sha: cr.sha
    });
  },

  postRepo: function(owner, repo) { // done to fork a repo for a new user
    Meteor.call('ghAuth');
    return  github.repos.fork({
      user: owner,
      repo: repo
    });
  },

});

