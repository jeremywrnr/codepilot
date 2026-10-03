// server files methods
// git-sync - jeremywrnr

import { ghContext, userFiles } from "/imports/server/github";

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  newFile() { // create a new unnamed file
    return Meteor.callAsync("createFile", {
      path: "untitled",
    });
  },

  async createFile(file) { // create or update a file
    // handle null cache/contents when createing a file
    const { prof } = await ghContext();
    file.branch = prof.repoBranch;
    file.repo   = prof.repo;
    file.path   = file.path || file.title || "untitled";

    // update or insert file
    const fs = await Files.upsertAsync({
      repo: prof.repo,
      branch: prof.repoBranch,
      title: file.path,
    },{ $set: {
      content: file.content || "",
      cache: file.content || "",
      mode: file.mode || "100644",
      type: file.type || "file",
    }});

    if (fs.insertedId) { // if a new file made, give its id
      return fs.insertedId;
    }
  },

  async updateAllFiles() {
    const { prof } = await ghContext();
    const files = await userFiles(prof).fetchAsync();
    await Promise.all(files.filter(file => // remove imgs
      file.type === "file" && file.content != undefined
    ).map(file => // set file cache
      Files.updateAsync(file._id, {$set: {cache: file.content}})
    ));
  },

  async renameFile(fileid, name) { // rename a file with id and name
    const file = await Files.findOneAsync(fileid);
    await Meteor.callAsync("addMessage", ` renamed file ${file.title} to ${name}`);
    await Files.updateAsync(
      fileid,
      {$set: {
        title: name
      }});
  },

  async deleteFile(id) { // with id, delete a file from system
    const file = await Files.findOneAsync(id);
    await Meteor.callAsync("addMessage", ` deleted file ${file.title}`);
    await Files.removeAsync(id);
  },

  async setFileType(file, type) { // set the type field of a file
    await Files.updateAsync(
      file._id,
      {$set: {
        type
      }});
  },

  async resetFile(id) { // reset file back to cached version
    const old = await Files.findOneAsync(id); // overwrite content
    if (old)
      await Files.updateAsync(id, {$set: {content: old.cache}});
  },

  async resetFiles() { // reset db and hard code simple website structure
    const { prof } = await ghContext();
    const files = await userFiles(prof).fetchAsync();
    for (const f of files)
      await Meteor.callAsync("deleteFile", f._id);
    const base = [{"title":"site.html"},{"title":"site.css"},{"title":"site.js"}];
    for (const f of base)
      await Meteor.callAsync("createFile", f);
  },

});
