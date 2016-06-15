// server (privileged); methods, can run sync.
// so: files, shareJS, and top-level functions
// dlog is debugger log, see server/setup.js

var ufiles = GitSync.userfiles;
var hoster = GitSync.host;

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  firebase: function() { // expose production host for connection
    return FirepadAPI.host; // server's version
  },

  newFile: function() { // create a new unnamed file
    return Meteor.call("createFile", {path: "untitled"});
  },

  createFile: function(file) { // create or update a file, make sjs doc
    file.content = file.content || ""; // handle null contents

    var fs = Files.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      title: file.path,
    },{ $set: {
        content: file.content,
        cache: file.content,
      }});

    if (fs.insertedId) { // if a new file made, create firepad
      Meteor.call("addMessage", " created file - " + file.path);
      return fs.insertedId;
    }
  },

  renameFile: function(fileid, name) { // rename a file with id and name
    Files.update(
      fileid,
      {$set: {
        title: name
      }});
  },

  deleteFile: function(id) { // with id, delete a file from system
    Files.remove(id);
  },

  setFileType: function(file, type) { // set the type field of a file
    Files.update(
      file._id,
      {$set: {
        type: type
      }});
  },

  resetFile: function(id) { // reset file back to cached version
    var old = Files.findOne(id); // overwrite content
    if (old)
      Files.update(id, {$set: {content: old.cache}});
  },

  resetFiles: function() { // reset db and hard code simple website structure
    ufiles().map(function delFile(f){ Meteor.call("deleteFile", f._id)});
    var base = [{"title":"site.html"},{"title":"site.css"},{"title":"site.js"}];
    base.map(function(f){ Meteor.call("createFile", f) });
  },

  ///////////////////
  // ISSUE MANAGEMENT
  ///////////////////
  initIssues: function() { // re-populating git repo issues
    var repo = Repos.findOne(Meteor.user().profile.repo);
    if (repo) {
      Meteor.call("getAllIssues", repo).map(function load(issue) {
        Issues.upsert({
          repo: repo._id,
          ghid: issue.id // (from github)
        },{
          $set: {issue: issue},
        });
      });
    }
  },

  addIssue: function(feedback){ // adds a feedback issue to github
    feedback.imglink = Async.runSync(function(done) { // save screens, give id
      Screens.insert({img: feedback.img}, function(err, id){
        done(err, id);
      });
    }).result; // attach screenshot to this issue
    delete feedback.img; // delete redundant png

    // insert a dummy issue to get id, use later in GH issue body txt
    var issueId = Async.runSync(function(done){
      Issues.insert({issue: null}, function(err, id){
        done(err, id);
      });
    }).result; // get the id of the newly inserted issue

    // construct and append the text of the github issue, including links to screenshot and demo
    var imglink = "[issue screenshot](" + hoster + "/screenshot/" + feedback.imglink + ")\n";
    var livelink = "[live code here](" + hoster + "/render/" + issueId + ")\n";
    var htmllink = "html:\n```html\n" + feedback.html + "\n```\n";
    var csslink = "css:\n```css\n" + feedback.css + "\n```\n";
    var jslink = "js:\n```js\n" + feedback.js + "\n```\n";
    var loglink = "console log:\n```\n" + feedback.log + "```\n";
    feedback.body = imglink + livelink + htmllink + csslink + jslink + loglink;

    // post the issue to github, and get the GH generated content
    var issue = Meteor.call("postIssue", feedback);
    var ghIssue = { // the entire issue object
      _id: issueId,
      ghid: issue.id, // (from github)
      repo: feedback.repo, // attach repo forming data
      feedback: feedback, // attach feedback issue data
      issue: issue // returned from github call
    };

    // insert complete issue, and add it to the feed
    Issues.update(issueId, ghIssue);
    Meteor.call(
      "addUserMessage",
      feedback.user,
      "opened issue - " + feedback.note
    );
  },

  closeIssue: function(issue){ // close an issue on github by number
    Meteor.call("ghAuth");
    Meteor.call("addMessage", "closed issue - " + issue.issue.title);
    github.issues.edit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      number: issue.issue.number,
      state: "closed"
    });

    Issues.remove(issue._id); // remove from the local database
  },



  /////////////////////
  // COMMIT MANAGEMENT
  /////////////////////

  initCommits: function() { // re-populating the commit log
    Meteor.call("getAllCommits").map(function(c){
      Meteor.call("addCommit", c);
    });
  },

  addCommit: function(c) { // adds a commit, links to repo + branch
    Commits.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      sha: c.sha
    },{
      $set: { commit: c }
    });
  },

  loadHead: function(bname) { // load head of branch, from sha
    var sha =  Meteor.call("getBranch", bname).commit.sha;
    if (sha) Meteor.call("loadCommit", sha);
  },

  loadCommit: function(sha) { // takes commit sha, loads into sjs
    var commitResults = Meteor.call("getCommit", sha);
    var treeSHA = commitResults.commit.tree.sha;
    var treeResults = Meteor.call("getTree", treeSHA);

    treeResults.tree.forEach(function updateBlob(blob) {
      if (blob.type === "blob") { // only load files, not folders/trees
        var content = Async.runSync(function(done) { // wait on github response
          var content = Meteor.call("getBlob", blob);
          done(content, content);
        }).result;

        blob.content = content;
        blob.type = "file";

        Meteor.call("createFile", blob);
      }
    });
  },


  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  newCommit: function(msg) { // grab sjs contents, commit to github

    // getting all file ids, names, and content
    var user = Meteor.user().profile;
    var bname = user.repoBranch;
    var blobs = Files.find({
      repo:  Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
    }).fetch().filter(function typeCheck(file) { // remove imgs
        return file.type === "file" && file.content != undefined;
      }).map(function makeBlob(file) { // set file cache
        Files.update(file._id, {$set: {cache: file.content}});
        return {
          path: file.title,
          mode: "100644",
          type: "blob",
          content: file.content
        };
      });

      // get old tree and update it with new shas, post and get that sha
      var branch = Meteor.call("getBranch", bname);
      var oldTree = Meteor.call("getTree", branch.commit.commit.tree.sha);
      var newTree = {base: oldTree.sha, tree: blobs};
      var treeSHA = Meteor.call("postTree", newTree);

      // specify author of this commit
      var commitAuthor = {
        name: user.login,
        email: user.email,
        date: new Date()
      };

      // make the new commit result object
      var commitResult = Meteor.call("postCommit", {
        message: msg, // passed in
        author: commitAuthor,
        parents: [ branch.commit.sha ],
        tree: treeSHA
      });

      // update the ref, point to new commmit
      Meteor.call("postRef", commitResult);

      // get the latest commit from the branch head
      var lastCommit = Meteor.call("getBranch", bname).commit;

      // post into commit db with repo tag
      Meteor.call("addCommit", lastCommit);

      // update the feed with new commit
      Meteor.call("addMessage", "committed - " + msg);
  },

});

