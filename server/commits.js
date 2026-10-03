// server (privileged) commit methods

Meteor.methods({

  /////////////////////
  // COMMIT MANAGEMENT
  /////////////////////

  async initCommits() { // re-populating the commit log
    const commits = await Meteor.callAsync("getAllCommits");
    for (const c of commits)
      await Meteor.callAsync("addCommit", c);
  },

  async addCommit(c) { // adds a commit, links to repo + branch
    const prof = (await Meteor.userAsync()).profile;
    await Commits.upsertAsync({
      repo: prof.repo,
      branch: prof.repoBranch,
      sha: c.sha
    },{
      $set: { commit: c }
    });
  },

  async loadHead(bname) { // load head of branch, from sha
    const sha = (await Meteor.callAsync("getBranch", bname)).commit.sha;
    console.log(`loading ${bname} @ ${sha}`)
    if (sha) await Meteor.callAsync("loadCommit", sha);
  },

  async loadCommit(sha) { // takes commit sha, loads into mongo
    const commitResults = await Meteor.callAsync("getCommit", sha);
    const treeSHA = commitResults.commit.tree.sha;
    const treeResults = await Meteor.callAsync("getTree", treeSHA);

    // only load files, not folders/trees
    const blobs = treeResults.tree.filter(blob =>
      !GitSync.imgcheck(blob.path) && blob.type === "blob");

    await Promise.all(blobs.map(async blob => {
      try {
        const content = await Meteor.callAsync("getBlob", blob);
        blob.content = content;
        if (content && content.length < GitSync.maxFileLength)
          await Meteor.callAsync("createFile", blob);
      } catch (err) {
        console.error(err);
      }
    }));
  },


  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  async newCommit(msg) { // grab cache content, commit to github

    // getting all file ids, names, and content
    const user = (await Meteor.userAsync()).profile;
    const bname = user.repoBranch;
    const files = (await Files.find({
      repo: user.repo,
      branch: user.repoBranch,
    }).fetchAsync()).filter(function typeCheck(file) { // remove imgs
      return (file.type === "file" || file.type === "blob") && file.content != undefined;
    });

    const blobs = await Promise.all(files.map(async function makeBlob(file) { // set file cache
      await Files.updateAsync(file._id, {$set: {cache: file.content}});
      return {
        content: file.content,
        path: file.title,
        mode: file.mode,
        type: "blob",
      };
    }));

    // get old tree and update it with new shas, post and get that sha
    const branch = await Meteor.callAsync("getBranch", bname);
    let oldTree = await Meteor.callAsync("getTree", branch.commit.commit.tree.sha);
    if (!oldTree) oldTree = {"sha": ""} // resetting for new file
    const newTree = {base: oldTree.sha, tree: blobs};
    const treeSHA = await Meteor.callAsync("postTree", newTree);

    // specify author of this commit
    const commitAuthor = {
      name: user.login,
      email: user.email,
      date: new Date(),
    };

    // make the new commit result object
    const commitResult = await Meteor.callAsync("postCommit", {
      message: msg, // passed in
      author: commitAuthor,
      parents: [branch.commit.sha],
      tree: treeSHA,
    });

    // update the ref, point to new commmit
    await Meteor.callAsync("postRef", commitResult);

    // get the latest commit from the branch head
    const lastCommit = (await Meteor.callAsync("getBranch", bname)).commit;

    // post into commit db with repo tag
    await Meteor.callAsync("addCommit", lastCommit);

    // update the feed with new commit
    await Meteor.callAsync("addMessage", `committed - ${msg}`);
  },

});
