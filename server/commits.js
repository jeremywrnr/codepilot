// server (privileged); methods, can run sync.
// so: files, shareJS, and top-level functions
// dlog is debugger log, see server/setup.js

const ufiles = GitSync.userfiles;
const hoster = GitSync.host;

Meteor.methods({

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
    let sha =  Meteor.call("getBranch", bname).commit.sha;
    if (sha) Meteor.call("loadCommit", sha);
  },

  loadCommit(sha) { // takes commit sha, loads into sjs
    let commitResults = Meteor.call("getCommit", sha);
    let treeSHA = commitResults.commit.tree.sha;
    let treeResults = Meteor.call("getTree", treeSHA);

    // only load files, not folders/trees
    treeResults.tree.forEach(blob => {
      if ((!GitSync.imgcheck(blob.path)) && blob.type === "blob")
        Meteor.call("getBlob", blob, (err, content) => {
          blob.content = content;
          if (content && content.length < GitSync.maxFileLength)
            Meteor.call("createFile", blob);
        });
    });
  },


  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  newCommit(msg) { // grab cache content, commit to github

    // getting all file ids, names, and content
    let user = Meteor.user().profile;
    let bname = user.repoBranch;
    let blobs = Files.find({
      repo:  Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
    }).fetch().filter(function typeCheck(file) { // remove imgs
      return (file.type === "file" || file.type === "blob") && file.content != undefined;
    }).map(function makeBlob(file) { // set file cache
      Files.update(file._id, {$set: {cache: file.content}});
      return {
        content: file.content,
        path: file.title,
        mode: file.mode,
        type: "blob",
      };
    });

    console.log("blobs are", blobs)

    // get old tree and update it with new shas, post and get that sha
    let branch = Meteor.call("getBranch", bname);
    let oldTree = Meteor.call("getTree", branch.commit.commit.tree.sha);
    if (!oldTree) oldTree = {"sha": ""} // resetting for new file
    let newTree = {base: oldTree.sha, tree: blobs};
    let treeSHA = Meteor.call("postTree", newTree);

    // specify author of this commit
    let commitAuthor = {
      name: user.login,
      email: user.email,
      date: new Date(),
    };

    // make the new commit result object
    let commitResult = Meteor.call("postCommit", {
      message: msg, // passed in
      author: commitAuthor,
      parents: [branch.commit.sha],
      tree: treeSHA,
    });

    // update the ref, point to new commmit
    Meteor.call("postRef", commitResult);

    // get the latest commit from the branch head
    let lastCommit = Meteor.call("getBranch", bname).commit;

    // post into commit db with repo tag
    Meteor.call("addCommit", lastCommit);

    // update the feed with new commit
    Meteor.call("addMessage", `committed - ${msg}`);
  },

});
