// server & github api methods

Meteor.methods({



  //////////////////
  // FILE MANAGEMENT
  //////////////////

  deleteFile: function(id) {
    Files.remove(id);
    ShareJS.model["delete"](id);
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
    var response = [];
    function updateBlob(b){
      var oldcontent = github.gitdata.getBlob({
        headers:{"Accept":"application/vnd.github.VERSION.raw"},
        user: "jeremywrnr",
        repo: "testing",
        sha: b.sha
      });
      // $set component instead of creating a new object
      Files.upsert({'title':b.path},{$set: {'oldcontent':oldcontent} });
      response.push( {title:b.path, content:oldcontent} );
    }
    tr.tree.forEach(updateBlob)
    return response;
  },

  getShareJSDoc: function(doc) { //document id
    var content = '';
    ShareJS.model.getSnapshot(doc, function(err, res){
      content=res.snapshot
    });
    return content;
  },

  // update the contents of the buffer based on a certain commit:
  // store the current file status in a temp-state - can be returned to
  // clock the commit to select it, then load the buffer with these calls:
  // var br = Meteor.call('getBranch','master')
  // var tr = Meteor.call('getTree', br)
  // var bb = Meteor.call('getBlobs', tr)
  // bb will then have title and content fields, which you can use to update
  // the share js doc

  // method for updating the content of the share js doc:
  // get current doc string with above method
  // get the current version number as well
  // delete in an applyOp call, and insert new content:
  // ShareJS.model.applyOp(id, {op:[{p:0, d:oldcontent, i:newcontent}],
  // v:version, meta:null}, // function(e,r){})

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
    var response = github.gitdata.createCommit({
      user: "jeremywrnr",
      repo: "testing",
      message: c.message,
      author: c.author,
      parents: c.parents,
      tree: c.tree
    });
    return response;
  },

  postRef: function(cr){ // update ref to new commit, with commit results
    github.authenticate({
      type: "token",
      token: Meteor.user().services.github.accessToken
    });
    var response = github.gitdata.updateReference({
      user: "jeremywrnr",
      repo: "testing",
      ref: "heads/master",
      sha: cr.sha
    });
    return response;
  },



  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  makeCommit: function() {

    // getting file ids, names, and content
    var files = Files.find({},{_id:1}).map(function(f){
      return {
        path: f.title,
        content: Meteor.call('getShareJSDoc', f._id)
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
      message: "made with the API",
      author: {
        name: "codepilot",
        email: "codepilot@gmail.com",
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

  }

});
