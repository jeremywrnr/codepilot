// wrapper github api methods
// dlog is debugger log, see server/setup.js

Meteor.methods({

  //////////////////////
  // GITHUB GET REQUESTS
  //////////////////////

  ghAuth: function(){ // authenticate for secure api calls
    github.authenticate({
      type: 'token',
      token: Meteor.user().services.github.accessToken
    });
  },

  getAllRepos: function() { // put them in db, serve to user (not return)
    Meteor.call('ghAuth');
    var repos = github.repos.getAll({ user: Meteor.user().profile.login });
    repos.map(function attachUser(gr){ // attach user to git repo (gr)
      if (Repos.find({ id: gr.id }).count() > 0) // repo already exists
      Repos.update({ id: gr.id }, {$push: {users: Meteor.userId() }});
      else
        Repos.insert({ id: gr.id, users: [ Meteor.userId() ], repo: gr });
    });
  },

  getAllCommits: function() { // give all commits
    return github.repos.getCommits({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName
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
    var brs = github.repos.getBranches({
      user: gr.repo.owner.login,
      repo: gr.repo.name
    });
    Repos.update(
      { id: gr.repo.id },
      { $set: {branches: brs}}
    );
    Meteor.call('setBranch', gr.repo.default_branch) // set default br
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

  getBlobs: function(tr) { // update files with tree results (tr)
    tr.tree.forEach(function updateBlob(b) {
      if (b.type === 'blob') { // only load files, not folders/trees
        var oldcontent = github.gitdata.getBlob({
          headers: {'Accept':'application/vnd.github.VERSION.raw'},
          user: Meteor.user().profile.repoOwner,
          repo: Meteor.user().profile.repoName,
          sha: b.sha
        });
        // $set component instead of creating a new object
        Files.upsert(
          { repo: Meteor.user().profile.repo, title: b.path},
          { $set: {content: oldcontent}}
        );
      };
    });
  },

});
