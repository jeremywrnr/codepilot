// interface for interacting with Firepad

FirepadAPI = {

  // getting whether the host is in production or development

  setup: function(dev) {
    var prodFB = "https://project-3627267568762325747.firebaseio.com/"
    var devFB = "https://gitsync-test.firebaseio.com/"
    this.host = (dev ? devFB : prodFB);
  },


  //////////////////
  // CLIENT METHODS
  /////////////////

  getText: function(id, cb) { // return the contents of firepad
    var headless = Firepad.Headless(Session.get("fb") + id);
    headless.getText(function(txt) {
      headless.dispose();
      cb(txt);
    });
  },

  getAllText: function(cb) { // update file.content from firepad (for testing)
    GitSync.userfiles().fetch().filter(function typeCheck(file) {
      return file.type === "file"; // remove imgs

    }).map(function(file) { // using document ids
      return file._id

    }).map(function(id) {
      FirepadAPI.getText(id, function(txt) {
        cb(id, txt);
      });
    });
  },

  setText: function(id, txt) { // update firebase with their ids
    var headless = Firepad.Headless(Session.get("fb") + id);
    headless.setText(txt, function() { headless.dispose() });
  },

  setAllText: function() { // update all project caches from firepad (for reset)
    GitSync.userfiles().fetch().map(function(file) {
      FirepadAPI.setText(file._id, file.cache)
    });
  },
};

