// server (privileged); methods, can run sync.
// so: files, shareJS, and top-level functions
// dlog is debugger log, see server/setup.js

const ufiles = GitSync.userfiles;
const hoster = GitSync.host;

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  firebase() { // expose production host for connection
    return FirepadAPI.host; // server's version
  },

  newFile() { // create a new unnamed file
    return Meteor.call("createFile", {path: "untitled"});
  },

  createFile(file) { // create or update a file, make sjs doc
    file.content = file.content || ""; // handle null contents

    const fs = Files.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      title: file.path,
    },{ $set: {
        content: file.content,
        cache: file.content,
        mode: file.mode,
      }});

    if (fs.insertedId) { // if a new file made, create firepad
      Meteor.call("addMessage", ` created file - ${file.path}`);
      return fs.insertedId;
    }
  },

  renameFile(fileid, name) { // rename a file with id and name
    Files.update(
      fileid,
      {$set: {
        title: name
      }});
  },

  deleteFile(id) { // with id, delete a file from system
    Files.remove(id);
  },

  setFileType(file, type) { // set the type field of a file
    Files.update(
      file._id,
      {$set: {
        type
      }});
  },

  resetFile(id) { // reset file back to cached version
    const old = Files.findOne(id); // overwrite content
    if (old)
      Files.update(id, {$set: {content: old.cache}});
  },

  resetFiles() { // reset db and hard code simple website structure
    ufiles().map(function delFile(f){ Meteor.call("deleteFile", f._id)});
    const base = [{"title":"site.html"},{"title":"site.css"},{"title":"site.js"}];
    base.map(f => { Meteor.call("createFile", f) });
  },

  ///////////////////
  // ISSUE MANAGEMENT
  ///////////////////

  initIssues() { // re-populating git repo issues
    const repo = Repos.findOne(Meteor.user().profile.repo);
    if (repo) {
      Meteor.call("getAllIssues", repo).map(function load(issue) {
        Issues.upsert({
          repo: repo._id,
          ghid: issue.id // (from github)
        },{
          $set: {issue},
        });
      });
    }
  },

  addIssue(feedback) { // adds a feedback issue to github
    feedback.imglink = Async.runSync(done => { // save screens, give id
      Screens.insert({img: feedback.img}, (err, id) => {
        done(err, id);
      });
    }).result; // attach screenshot to this issue
    delete feedback.img; // delete redundant png

    // insert a dummy issue to get id, use later in GH issue body txt
    const issueId = Async.runSync(done => {
      Issues.insert({issue: null}, (err, id) => {
        done(err, id);
      });
    }).result; // get the id of the newly inserted issue

    // construct and append the text of the github issue, including links to screenshot and demo
    const imglink = `[issue screenshot](${hoster}/screenshot/${feedback.imglink})\n`;
    const livelink = `[live code here](${hoster}/render/${issueId})\n`;
    const htmllink = `html:\n\`\`\`html\n${feedback.html}\n\`\`\`\n`;
    const csslink = `css:\n\`\`\`css\n${feedback.css}\n\`\`\`\n`;
    const jslink = `js:\n\`\`\`js\n${feedback.js}\n\`\`\`\n`;
    const loglink = `console log:\n\`\`\`\n${feedback.log}\`\`\`\n`;
    feedback.body = imglink + livelink + htmllink + csslink + jslink + loglink;

    // post the issue to github, and get the GH generated content
    const issue = Meteor.call("postIssue", feedback);
    const ghIssue = { // the entire issue object
      _id: issueId,
      ghid: issue.id, // (from github)
      repo: feedback.repo, // attach repo forming data
      feedback, // attach feedback issue data
      issue // returned from github call
    };

    // insert complete issue, and add it to the feed
    Issues.update(issueId, ghIssue);
    Meteor.call(
      "addUserMessage",
      feedback.user,
      `opened issue - ${feedback.note}`
    );
  },

  closeIssue(issue) { // close an issue on github by number
    Meteor.call("ghAuth");
    Meteor.call("addMessage", `closed issue - ${issue.issue.title}`);
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

  initCommits() { // re-populating the commit log
    Meteor.call("getAllCommits").map(c => {
      Meteor.call("addCommit", c);
    });
  },

  addCommit(c) { // adds a commit, links to repo + branch
    Commits.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      sha: c.sha
    },{
      $set: { commit: c }
    });
  },

  loadHead(bname) { // load head of branch, from sha
    const sha =  Meteor.call("getBranch", bname).commit.sha;
    if (sha) Meteor.call("loadCommit", sha);
  },

  loadCommit(sha) { // takes commit sha, loads into sjs
    const commitResults = Meteor.call("getCommit", sha);
    const treeSHA = commitResults.commit.tree.sha;
    const treeResults = Meteor.call("getTree", treeSHA);

    treeResults.tree.forEach(function update(blob) {
      // only load files, not folders/trees
      const image = GitSync.imgcheck(blob.path);

      if ((!image) && blob.type === "blob")
        Meteor.call("getBlob", blob, (err, res) => {
          blob.content = res.content;
          if (blob.content.length < GitSync.maxFileLength)
            Meteor.call("createFile", blob);
        });
    });
  },


  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  newCommit(msg) { // grab cache content, commit to github

    // getting all file ids, names, and content
    const user = Meteor.user().profile;
    const bname = user.repoBranch;
    const blobs = Files.find({
      repo:  Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
    }).fetch().filter(function typeCheck(file) { // remove imgs
        return file.type === "file" && file.content != undefined;
      }).map(function makeBlob(file) { // set file cache
        Files.update(file._id, {$set: {cache: file.content}});
        return {
          content: file.content,
          path: file.title,
          mode: file.mode,
          type: "blob",
        };
      });

      // get old tree and update it with new shas, post and get that sha
      const branch = Meteor.call("getBranch", bname);
      const oldTree = Meteor.call("getTree", branch.commit.commit.tree.sha);
      const newTree = {base: oldTree.sha, tree: blobs};
      const treeSHA = Meteor.call("postTree", newTree);

      // specify author of this commit
      const commitAuthor = {
        name: user.login,
        email: user.email,
        date: new Date()
      };

      // make the new commit result object
      const commitResult = Meteor.call("postCommit", {
        message: msg, // passed in
        author: commitAuthor,
        parents: [ branch.commit.sha ],
        tree: treeSHA
      });

      // update the ref, point to new commmit
      Meteor.call("postRef", commitResult);

      // get the latest commit from the branch head
      const lastCommit = Meteor.call("getBranch", bname).commit;

      // post into commit db with repo tag
      Meteor.call("addCommit", lastCommit);

      // update the feed with new commit
      Meteor.call("addMessage", `committed - ${msg}`);
  },

});

