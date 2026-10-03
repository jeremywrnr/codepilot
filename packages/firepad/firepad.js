// interface for interacting with Firepad through meteor
// most methods have to be called from client since jsdom cant run on the
// server, which means that firepad cant run on the meteor backend.

FirepadAPI = {}

// firebase realtime db backs firepad, configured by settings.public.firebase.
// without a firebase apiKey (local dev), there is no firepad: files are read
// and written straight from mongo, with no live co-editing

var fbconf = Meteor.settings.public && Meteor.settings.public.firebase;
var enabled = !!(fbconf && fbconf.apiKey);
if (enabled) firebase.initializeApp(fbconf);

var ref = function (id) { // firebase realtime db ref for a file id
  return firebase.database().ref(id);
}


  /***
   * |ATTACH|
   *
   * connect an ace editor to a file, returns a function that disconnects it
   ***/

var attach = function (editor, id, userId) {
  var file = Files.findOne(id);
  var initial = (file && file.content) || "";

  if (enabled) {
    var pad = Firepad.fromACE(ref(id), editor, { userId: userId });
    pad.on("ready", function () { // use cached content when history empty
      if (pad.isHistoryEmpty() && initial) pad.setText(initial);
      editor.focus();
      editor.gotoLine(1);
    });
    return function () { pad.dispose(); };
  }

  // no firebase: save edits to mongo shortly after typing stops
  var timer = null;
  var save = function () {
    timer = null;
    Meteor.callAsync("updateFile", id, editor.getValue())
      .catch(function (err) { console.error("couldn't save file", err); });
  };
  editor.setValue(initial, -1);
  editor.on("change", function () {
    clearTimeout(timer);
    timer = setTimeout(save, 500);
  });
  editor.focus();
  return function () { // flush any pending save
    if (timer) { clearTimeout(timer); save(); }
  };
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
  cb = cb || function () {};
  if (!enabled) return cb(); // the server already reset file.content to the cache
  var headless = Firepad.Headless(ref(id));
  headless.setText(
    Files.findOne(id).cache,
    function() {
      headless.dispose()
      cb(); // callback once done
    }
  );
}

var setAllText = function (cb) { // update all project caches from firepad (for reset)
  var files = GitSync.userfiles().fetch();
  var left = files.length;
  if (!left && cb) return cb();
  files.forEach(function(file) {
    FirepadAPI.setText(file._id, function() {
      if (--left === 0 && cb) cb(); // callback once all are done
    });
  });
}


// exporting to package
FirepadAPI.attach = attach;
FirepadAPI.getText = getText;
FirepadAPI.setText = setText;
FirepadAPI.getAllText = getAllText;
FirepadAPI.setAllText = setAllText;

