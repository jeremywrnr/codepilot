// interface for interacting with Firepad through meteor
// most methods have to be called from client since jsdom cant run on the
// server, which means that firepad cant run on the meteor backend.

FirepadAPI = {}

// firebase realtime db ref for a file id; firebase is initialized from
// Meteor.settings.public.firebase in client/main/main.js

var ref = function (id) {
  return firebase.database().ref(id);
}

// without a firebase apiKey (local dev), there is no firepad: the editor
// reads and writes file.content in mongo directly, with no live co-editing
var fbconf = Meteor.settings.public && Meteor.settings.public.firebase;
var enabled = !!(fbconf && fbconf.apiKey);

// return the current branch/repo files

var userfiles = function () {
  var user = Meteor.user(),
    prof = undefined;
  if (user)
    prof = user.profile;
  if (prof) return Files.find({
    repo: prof.repo,
    branch: prof.repoBranch
  });
}


  /***
   * |GET|
   *
   * FIREPAD -> file.CONTENT methods
   * - update files meteor content based on the firepad buffer
   * - also used when updating the tester vision
   * - this methods are called on the client to have access to firepad from the
   *   header scripts, and then use a meteor method callback to gain access to
   *   updating the files once the content has been retrieved from the firepad
   *   backend. i am actually largely impressed with how robust and fast
   *   firepad seems to work since transitioning over from the internal sharejs
   *   editor. maybe it is the snapshot feature, which limits how many
   *   transformations have to be performed to the get the current state of the
   *   document.
   ***/

var getText = function (id, cb) { // return the contents of firepad
  if (!enabled) {
    var file = Files.findOne(id);
    return cb(file ? file.content : "");
  }
  var headless = Firepad.Headless(ref(id));
  headless.getText(function(txt) {
    headless.dispose();
    cb(txt);
  });
}

var getAllText = function(files, cb) { // apply callmback to all files
  files.map(function(id) {
    FirepadAPI.getText(id, function(txt) {
      cb(id, txt);
    });
  });
}


  /***
   * |SET|
   *
   * file.CACHE -> FIREPAD methods
   * - update firepad buffer from last committed version of file
   * - gets content based on the cached version from last commit
   * - dispose removes the connection to the firepad instance.
   ***/

var setText = function (id, cb) { // update firebase with their ids
  if (!enabled) { // the server already reset file.content to the cache
    if (cb) cb();
    return;
  }
  var headless = Firepad.Headless(ref(id));
  headless.setText(
    Files.findOne(id).cache,
    function() {
      headless.dispose()
      if (cb) cb(); // callback once done
    }
  );
}

var setAllText = function (cb) { // update all project caches from firepad (for reset)
  var files = FirepadAPI.userfiles().fetch();
  var left = files.length;
  if (!left && cb) return cb();
  files.forEach(function(file) {
    FirepadAPI.setText(file._id, function() {
      if (--left === 0 && cb) cb(); // callback once all are done
    });
  });
}


// exporting to package
FirepadAPI.ref = ref;
FirepadAPI.enabled = enabled;
FirepadAPI.getText = getText;
FirepadAPI.setText = setText;
FirepadAPI.userfiles = userfiles;
FirepadAPI.getAllText = getAllText;
FirepadAPI.setAllText = setAllText;

