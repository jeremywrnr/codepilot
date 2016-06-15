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

  getText: function(id, cb) {
    var headless = Firepad.Headless(Session.get("fb") + id);
    headless.getText(function(txt) {
      headless.dispose();
      cb(txt);
    });
  },

  getAllText: function(cb) { // update file.content from firepad
    Files.find({
      repo:  Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
    })

    .fetch().filter(function typeCheck(file) { // remove imgs
      return file.type === "file";
    }).map(function(file) { // using document ids
      return file._id

    }).map(function(id) {

      this.getText(id, function(txt){
        console.log(id, txt);
        Files.update( id, {$set: { content: txt }});
      });
    });
  },

  setText: function(file) { // update files with their ids
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

  setAllText: function() { // update all project sjs files
    ufiles().map(function(file) {
      this.setText(file)
    });
  },

};

