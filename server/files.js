// server files methods
// git-sync - jeremywrnr

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
    return Meteor.call("createFile", {
      path: "untitled",
    });
  },

  createFile(file) { // create or update a file, make sjs doc
    // handle null cache/contents when createing a file
    file.branch =  Meteor.user().profile.repoBranch;
    file.repo   = Meteor.user().profile.repo;
    file.path   = file.path || "untitled";

    // update or insert file
    let fs = Files.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      title: file.path,
    },{ $set: {
      content: file.content || "",
      cache: file.content || "",
      mode: file.mode || "100644",
      type: file.type || "file",
    }});

    if (fs.insertedId) { // if a new file made, create firepad
      Meteor.call("addMessage", ` created new file ${file.path}`);
      return fs.insertedId;
    }
  },

  updateAllFiles() {
    Files.find({
      repo:  Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
    }).fetch().filter(file => // remove imgs
      file.type === "file" && file.content != undefined
    ).map(file => // set file cache
      Files.update(file._id, {$set: {cache: file.content}})
    );
  },

  renameFile(fileid, name) { // rename a file with id and name
    let file = Files.findOne(fileid);
    Meteor.call("addMessage", ` renamed file ${file.title} to ${name}`);
    Files.update(
      fileid,
      {$set: {
        title: name
      }});
  },

  deleteFile(id) { // with id, delete a file from system
    let file = Files.findOne(id);
    Meteor.call("addMessage", ` deleted file ${file.title}`);
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
    let old = Files.findOne(id); // overwrite content
    if (old)
      Files.update(id, {$set: {content: old.cache}});
  },

  resetFiles() { // reset db and hard code simple website structure
    ufiles().map(function delFile(f){ Meteor.call("deleteFile", f._id)});
    let base = [{"title":"site.html"},{"title":"site.css"},{"title":"site.js"}];
    base.map(f => { Meteor.call("createFile", f) });
  },

});

