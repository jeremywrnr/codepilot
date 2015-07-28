// server & github api methods

Meteor.methods({



  /////////////////////////
  // FILE & ROLE MANAGEMENT
  /////////////////////////

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
    Files.find({}).map(function(f){ Meteor.call('deleteFile', f._id)});
    var base = [{'title':'site.html'},{'title':'site.css'},{'title':'site.js'}];
    base.map(function(f){ // for each of the hard coded files
      var id = Meteor.call('createFile', f.title);
      //ShareJS.model["create"](id); // make sharejs models
    });
  },

  setPilot: function() {
    return Meteor.users.update(
      {"_id":Meteor.userId()},
      {$set : {"profile.role":"pilot"}}
    );
  },

  setCopilot: function(){
    return Meteor.users.update(
      {"_id":Meteor.userId()},
      {$set : {"profile.role":"copilot"}}
    );
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



  //////////////////////
  // GITHUB GET REQUESTS
  //////////////////////

  getAllCommits: function() {
    return github.repos.getCommits({
      user: "jeremywrnr",
      repo: "testing"
    });
  },

  getBranch: function(bn) { //branch name
    return github.repos.getBranch({
      user: "jeremywrnr",
      repo: "testing",
      branch: bn
    });
  },

  getTree: function(br) { //branch results
    return github.gitdata.getTree({
      user: "jeremywrnr",
      repo: "testing",
      sha: br.commit.commit.tree.sha
    });
  },

  getBlobs: function(tr) { //tree results
    tr.tree.forEach(function updateBlob(b){
      var oldcontent = github.gitdata.getBlob({
        headers:{"Accept":"application/vnd.github.VERSION.raw"},
        user: "jeremywrnr",
        repo: "testing",
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
    github.authenticate({
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
    github.gitdata.createBlob({
      user: "jeremywrnr",
      repo: "testing",
      content: fc,
      encoding: "utf-8"
    }, function(err, res){
      response = res;
      console.log(res)
    });
    return response.sha;
  },

  postTree: function(t){ //returns tree SHA hash id
    github.authenticate({
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
    var response = github.gitdata.createTree({
      user: "jeremywrnr",
      repo: "testing",
      tree: t.tree,
      base_tree: t.base
    });
    return response.sha;
  },

  postCommit: function(c) { //returns all commit info
    github.authenticate({
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
    return github.gitdata.createCommit({
      user: "jeremywrnr",
      repo: "testing",
      message: c.message,
      author: c.author,
      parents: c.parents,
      tree: c.tree
    });
  },

  postRef: function(cr){ // update ref to new commit, with commit results
    github.authenticate({
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
    return  github.gitdata.updateReference({
      user: "jeremywrnr",
      repo: "testing",
      ref: "heads/master",
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
      console.log(shareJSDoc)
      return {
        path: f.title,
        content: shareJSDoc.snapshot
      }
    });

    // a diff would be done here, remove unchanged files

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

    // make the new commit object
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
    var fr = Files.find({})
    return fr.map(function updateShareJS(f){
      Meteor.call('postShareJSDoc',f)
    });
  }

});
