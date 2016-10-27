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
    return Meteor.call("createFile", {path: "untitled"});
  },

  createFile(file) { // create or update a file, make sjs doc
    // handle null cache/contents when createing a file
    file.branch  =  Meteor.user().profile.repoBranch;
    file.repo    = Meteor.user().profile.repo;
    file.content = file.content || "";
    file.mode    = file.mode   || "100644";
    file.cache   = file.cache || "";

    // update or insert file
    let fs = Files.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      title: file.path,
    },{ $set: {
      content: file.content,
      cache: file.content,
      mode: file.mode,
    }});

    if (fs.insertedId) { // if a new file made, create firepad
      Meteor.call("addMessage", ` created new file ${file.path}`);
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

