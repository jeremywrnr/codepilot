// server & github api methods

Meteor.methods({



  //////////////////
  // FILE MANAGEMENT
  //////////////////

  newFile: function() { // create a new file, unnamed, return id
    return Meteor.call('createFile', 'untitled');
  },

  createFile: function(ft) { // make new file with filetitle (ft), return id
    return Async.runSync(function(done){
      Files.insert({title:ft},function(e,id){done(e,id)})
    }).result;
  },

  deleteFile: function(id) { // with id, delete a file from system
    ShareJS.model["delete"](id);
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
        {"_id": f._id},
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
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
  },

  getAllRepos: function() { //put them in db, serve to user (rather than return)
    Meteor.call('ghAuth');
    var repos = github.repos.getAll({ user: Meteor.user().profile.login});
    repos.map(function(gr){ //attach git repo (gr) to user
      Repos.upsert(
        { user: Meteor.userId(), id: gr.id },
        { user: Meteor.userId(), id: gr.id, repo: gr }
      )});
  },

  getAllCommits: function() {
    return github.repos.getCommits({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName
    });
  },

  getBranch: function(bn) { //branch name
    return github.repos.getBranch({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      branch: bn
    });
  },

  getTree: function(br) { //branch results
    return github.gitdata.getTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      sha: br.commit.commit.tree.sha
    });
  },

  getBlobs: function(tr) { //tree results
    tr.tree.forEach(function updateBlob(b){
      var oldcontent = github.gitdata.getBlob({
        headers:{"Accept":"application/vnd.github.VERSION.raw"},
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

  postBlob: function(fc){ //returns blob SHA hash id
    var response = {};
    Meteor.call('ghAuth');
    github.gitdata.createBlob({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      content: fc,
      encoding: "utf-8"
    }, function(err, res){
      response = res;
      console.log(res)
    });
    return response.sha;
  },

  postTree: function(t){ //returns tree SHA hash id
    Meteor.call('ghAuth');
    var response = github.gitdata.createTree({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      tree: t.tree,
      base_tree: t.base
    });
    return response.sha;
  },

  postCommit: function(c) { //returns all commit info
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
      ref: "heads/master", // TODO give choice for branch
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
        mode: "100644",
        type: "blob",
        sha: Meteor.call('postBlob', f.content),
      }
    });

    // get old tree and update it with new shas, post and get that sha
    var branch = Meteor.call('getBranch', 'master');
    var oldTree = Meteor.call('getTree', branch);
    var newTree = { "base": oldTree.sha, "tree": blobs };
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
    Commits.remove({});
    function commitInsert(c){Commits.insert(c)}
    var commits = Meteor.call('getAllCommits');
    commits.map(commitInsert);

    // update the feed with new commit
    Meteor.call('addMessage', "commited '" + msg + "'");

  },


  /////////////////////////////////////////////////
  // top level function, pull files and load editor
  /////////////////////////////////////////////////

  loadCommit: function() { // update the sharejs contents based on a  commit:

    // at some point, this should be able to take different branches or commits
    // along that branch to load instead of just the head on master

    // put github repo contents in oldcontents field
    var br = Meteor.call('getBranch','master')
    var tr = Meteor.call('getTree', br)
    Meteor.call('getBlobs', tr)

    // move files old contents into sharejsdoc
    Files.find({}).map(function loadSJS(f){ Meteor.call('postShareJSDoc',f) });

  }

});
