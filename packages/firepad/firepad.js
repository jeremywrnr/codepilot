FirepadAPI = {

  // getting whether the host is in production or development

  setup: function(dev) {
    var prodFB = "https://project-3627267568762325747.firebaseio.com/"
    var devFB = "https://gitsync-test.firebaseio.com/"
    this.host = (dev ? devFB : prodFB);
  },

  /////////////////////
  // CLIENT METHODS - for file manipulation
  /////////////////////

  getText: function(id) {
  },

  newFirepad: function(id, content) { // create firepad document with same id
  },

  getFirepad: function(file) { // give live editor copy, v and snapshot
    //if(! file._id ) return null;
    //var sjs = Docs.findOne( file._id );
    //if (sjs)
    //return sjs.data;
    //else
    //Meteor.call("newFirepad", file._id);
    //return Meteor.call("getFirepad", file._id);
  },

  getAllFirepad: function() { // update file.content from sjs
    //Files.find({
    //repo:  Meteor.user().profile.repo,
    //branch: Meteor.user().profile.repoBranch,
    //}).fetch().filter(function typeCheck(file) { // remove imgs
    //return file.type === "file";
    //}).map(function readSJS(file) {
    //var sjs = Meteor.call("getFirepad", file);
    //Files.update(
    //file._id,
    //{$set: {
    //content: sjs.snapshot
    //}});
    //});
  },

  postFirepad: function(file) { // update files with their ids
    //var sjs = Meteor.call("getFirepad", file); // get doc and version
    //if (!sjs) return null; // if file id broke, don"t propagate error
    //Firepad.model.applyOp( file._id, {
    //op: [
    //{ p:0, d: sjs.snapshot }, // delete old content
    //{ p:0, i: file.content } // insert new blob content
    //],
    //meta: null,
    //v: sjs.v // apply it to last seen version
    //});
  },

  postAllFirepad: function(file) { // update all project sjs files
    //ufiles().map(function setSJS(file) {
    //Meteor.call("postFirepad", file);
    //});
  },

};

