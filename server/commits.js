// server (privileged) commit methods

import { ghContext, userFiles } from "/imports/server/github";

// adds a commit, links to repo + branch
const upsertCommit = (prof, c) => Commits.upsertAsync({
  repo: prof.repo,
  branch: prof.repoBranch,
  sha: c.sha
},{
  $set: { commit: c }
});

Meteor.methods({

  /////////////////////
  // COMMIT MANAGEMENT
  /////////////////////

  async initCommits() { // re-populating the commit log
    const { prof } = await ghContext();
    const commits = await Meteor.callAsync("getAllCommits");
    await Promise.all(commits.map(c => upsertCommit(prof, c)));
  },

  async addCommit(c) {
    const { prof } = await ghContext();
    await upsertCommit(prof, c);
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

    // only load small files, not images or folders/trees
    const blobs = treeResults.tree.filter(blob =>
      !GitSync.imgcheck(blob.path) && blob.type === "blob" &&
      !(blob.size >= GitSync.maxFileLength));

    // fetch in small batches - github rejects too many concurrent requests
    const BATCH = 8;
    for (let i = 0; i < blobs.length; i += BATCH)
      await Promise.all(blobs.slice(i, i + BATCH).map(async blob => {
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
    const { prof } = await ghContext();
    const bname = prof.repoBranch;
    const files = (await userFiles(prof).fetchAsync()).filter(function typeCheck(file) { // remove imgs
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

    // update the branch's tree with the new blobs, post and get that sha
    const branch = await Meteor.callAsync("getBranch", bname);
    const newTree = {base: branch.commit.commit.tree.sha, tree: blobs};
    const treeSHA = await Meteor.callAsync("postTree", newTree);

    // specify author of this commit
    const commitAuthor = {
      name: prof.login,
      email: prof.email,
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

    // post into commit db with repo tag, and update the feed
    await upsertCommit(prof, lastCommit);
    await Meteor.callAsync("addMessage", `committed - ${msg}`);
  },

});
