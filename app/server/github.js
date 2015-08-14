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
      var dbHasRepo = Repos.findOne({ id: gr.id });
      var userAttached = Repos.find({ $and: [{ id: gr.id },{users: Meteor.userId() }]});
      if (! userAttached && dbHasRepo) { // repo already exists, not attached
        Repos.update({ id: gr.id }, {$push: {users: Meteor.userId() }});
      } else // brand new repo
        Repos.insert({ id: gr.id, users: [ Meteor.userId() ], repo: gr });
    });
  },

  getAllIssues: function(gr) { // return all issues for repo
    return github.issues.repoIssues({
      user: gr.repo.owner.login,
      repo: gr.repo.name,
      state: 'open', // or closed, etc
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
    // for the current repo, overwrite branches
    Repos.update({ id: gr.repo.id },{ $set: {branches: brs }});
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



  ///////////////////////
  // GITHUB POST REQUESTS
  ///////////////////////

  postIssue: function(issue){ // takes title and body, creates GH issue
    var user = Meteor.users.findOne(issue.user);
    var token = user.services.github.accessToken;
    github.authenticate({ type: 'token', token: token }); // custom login
    return github.issues.create({
      user: user.profile.repoOwner,
      repo: user.profile.repoName,
      title: issue.note,
      body: "screenshot: <img alt='screenshot' src='" + issue.img + "'>",
      label: 'bug' // enhancement, etc
    });
  },

  postTree: function(t){ // takes tree, gives tree SHA hash id
    Meteor.call('ghAuth');
    return github.gitdata.createTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      tree: t.tree,
      base_tree: t.base
    }).sha;
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

  postRef: function(cr){ // takes commit results (cr),  updates ref
    Meteor.call('ghAuth');
    return  github.gitdata.updateReference({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      ref: 'heads/' + Meteor.user().profile.repoBranch,
      sha: cr.sha
    });
  },

});
