// interface for interacting with Firepad

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

  getFirepad: function(id) { // give live editor copy, v and snapshot
    if (!id) return null;
    var content = "";
    var headless = Firepad.Headless(Session.get("firepadRef"));

    headless.onReady(function(){
      headless.getText(function(txt){ content = txt; });
      headless.dispose();
    });

    console.log(content)
    return content;
  },

  getAllFirepad: function() { // update file.content from firepad
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

