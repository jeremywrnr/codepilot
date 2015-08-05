// server & github api methods

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  newFile: function() { // create a new file, unnamed, return id
    return Meteor.call('createFile', 'untitled');
  },

  createFile: function(ft) { // make new file with filetitle (ft), return id
    Meteor.call('addMessage', ' created file: ' + ft);
    return Async.runSync(function(done){
      Files.insert(
        {title: ft, repo: Meteor.user().profile.repo},
        function(e,id){done(e,id)});
    }).result;
  },

  deleteFile: function(id) { // with id, delete a file from system
    ShareJS.model['delete'](id);
    Files.remove(id);
    Docs.remove(id);
  },

  resetFiles: function() { // reset db and hard code the file structure
    Files.find({}).map(function delFile(f){ Meteor.call('deleteFile', f._id)});
    var base = [{'title':'site.html'},{'title':'site.css'},{'title':'site.js'}];
    base.map(function(f){ // for each of the hard coded files
      var id = Meteor.call('createFile', f.title);
    });
  },



  /////////////////////
  // SHAREJS MANAGEMENT
  /////////////////////

  getShareJSDoc: function(f) { // return live editor copy, v and snapshot
    return Docs.find({ _id: f._id }).fetch()[0].data
  },

  postShareJSDoc: function(f) { //files with _id
    var sjs = Meteor.call('getShareJSDoc', f) // get doc and version
    ShareJS.model.applyOp( f._id, {
      op: [
        { p:0, d:sjs.snapshot }, // delete old content
        { p:0, i:f.content } // insert new blob content
      ],
      meta:null,
      v:sjs.v // apply it to last seen version
    });
  },

  testShareJS: function() { // update contents from sjs
    Files.find({}).map(function readSJS(f){
      Files.update(
        {'_id': f._id},
        {$set:
          { content: Meteor.call('getShareJSDoc',f).snapshot }
        });
    });
  },



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
    // attach user to git repo (gr)
    repos.map(function attachUser(gr){
      if (Repos.findOne({repo: gr.id})) // repo already exists
        Repos.update({ id: gr.id }, {$push: {users: Meteor.userId() }});
      else
        Repos.insert({ id: gr.id, users: [ Meteor.userId() ], repo: gr });
    });
  },

  getAllBranches: function() { // load all branches for current repo
    var brs = github.repos.getBranches({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName
    });
    Repos.update(
      { _id: Meteor.user().profile.repo },
      { $set: {branches: brs} }
    );
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
      sha: treeSHA
    });
  },

  getBlobs: function(tr) { //tree results
    tr.tree.forEach(function updateBlob(b){
      var oldcontent = github.gitdata.getBlob({
        headers:{'Accept':'application/vnd.github.VERSION.raw'},
        user: Meteor.user().profile.repoOwner,
        repo: Meteor.user().profile.repoName,
        sha: b.sha
      });
      // $set component instead of creating a new object
      Files.upsert({'title':b.path},{$set: {'content':oldcontent} });
    });
  },



  ///////////////////////
  // GITHUB POST REQUESTS
  ///////////////////////

  postBlob: function(fc){ // take file content, returns blob SHA hash id
    Meteor.call('ghAuth');
    return Async.runSync(function(done) {
      github.gitdata.createBlob({
        user: Meteor.user().profile.repoOwner,
        repo: Meteor.user().profile.repoName,
        content: fc,
        encoding: 'utf-8'
      }, function(err, res){
        done(res);
      })
    }).sha;
  },

  postTree: function(t){ // returns tree SHA hash id
    Meteor.call('ghAuth');
    return github.gitdata.createTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      tree: t.tree,
      base_tree: t.base
    }).sha;
  },

  postCommit: function(c) { // returns all commit info
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

  postRef: function(cr){ // update ref to new commit, with commit results
    Meteor.call('ghAuth');
    return  github.gitdata.updateReference({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      ref: 'heads/master',
      sha: cr.sha
    });
  },



  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  makeCommit: function(msg) { // update the sharejs contents based on a  commit:

    // getting file ids, names, and content
    var files = Files.find({},{_id:1}).map(function(f){
      var shareJSDoc = Meteor.call('getShareJSDoc', f);
      if (debug) console.log(shareJSDoc);
      return {
        path: f.title,
        content: shareJSDoc.snapshot
      }
    });

    // a diff would be done here, remove unchanged files from list

    // push blobs, get shas
    var blobs = files.map(function (f){
      return {
        path: f.path,
        mode: '100644',
        type: 'blob',
        sha: Meteor.call('postBlob', f.content),
      }
    });

    // get old tree and update it with new shas, post and get that sha
    var bname = Meteor.user().profile.repoBranch;
    var branch = Meteor.call('getBranch', bname);
    var oldTree = Meteor.call('getTree', branch);
    var newTree = { 'base': oldTree.sha, 'tree': blobs };
    var treeSHA = Meteor.call('postTree', newTree);

    // make the new commit result (cr) object
    var cr = Meteor.call('postCommit', {
      message: msg, // passed in
      author: {
        name: Meteor.user().profile.name,
        email: Meteor.user().profile.email,
        date: new Date()
      },
      parents: [ branch.commit.sha ],
      tree: treeSHA
    });

    // update the ref, point to new commmit
    Meteor.call('postRef', cr);

    // get the latest commit from the branch head
    var lastCommit = Meteor.call('getBranch', bname).commit;

    // post into commit db with repo tag
    Meteor.call('addCommit', lastCommit);

    // update the feed with new commit
    Meteor.call('addMessage', 'commited ' + msg);

  },



  /////////////////////////////////////////////////
  // top level function, pull files and load editor
  /////////////////////////////////////////////////

  loadHead: function() { // load head of branch
    var sha =  Meteor.call('getBranch', Meteor.user().profile.repoBranch).commit.sha;
    Meteor.call('loadCommit', sha);
  },

  loadCommit: function(sha) { // takes commit sha
    // put github repo contents in oldcontents field
    var cr = Meteor.call('getCommit', sha)
    var tr = Meteor.call('getTree', br)
    Meteor.call('getBlobs', tr)

    // move files old contents into sharejsdoc
    var repoFiles = Files.find({repo: Meteor.user().profile.repo});
    repoFiles.map(function loadSJS(f){ Meteor.call('postShareJSDoc',f) });
  },

  addCommit: function(c){
    Commits.upsert({
      repo: Meteor.user().profile.repo,
      sha: c.sha
    },{
      repo: Meteor.user().profile.repo,
      sha: c.sha,
      commit: c
    });
  },

  initCommits: function(){ // re-populating the commit log
    var gc = Meteor.call('getAllCommits');
    gc.map(function(c){Meteor.call('addCommit', c)});
  }

});
