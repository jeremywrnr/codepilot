// code editor things

var focusForm = GitSync.focusForm;
var prof = GitSync.prof;

Template.code.helpers({

  nulldoc: function() { return Session.equals("document", null); }

});

Template.editor.helpers({
  docid: function() { return Session.get("document"); },

  isImage: function() { // check if file extension is renderable
    var file = Files.findOne(Session.get("document"));
    if (file) {
      var image = /\.(gif|jpg|jpeg|tiff|png|bmp)$/i;
      if (image.test(file.title)) {
        if (file.type !== "image")
          Meteor.call("setFileType", file, "image");
        return true;
      } else {
        if (file.type !== "file")
          Meteor.call("setFileType", file, "file");
        return false;
      }
    }
  },
});

Template.firepad.onRendered(function() { // Create ACE editor
  Tracker.autorun(function () { //// Initialize Firebase.
    if (! Session.equals("document", Session.get("editing"))) {
      Session.set("editing", Session.get("document")); // trigger

      // Destroy old gear
      $("#editor").remove();

      // make fresh new editor
      $("#editor-container").append("<div id='editor'></div>");
      var editor = ace.edit("editor")
      editor.$blockScrolling = Infinity;
      editor.setTheme("ace/theme/monokai");
      editor.setShowPrintMargin(false);

      var session = editor.getSession();
      session.setUseWrapMode(true);
      session.setUseWorker(false);


      //// Create Firepad.
      var docRef = Session.get("fb") + Session.get("document");
      var firepadRef = new Firebase(docRef);
      var firepad = Firepad.fromACE(firepadRef,
        editor, { userId: prof().login, });

      //// Filemode and autosuggestions
      var mode = GitSync.findFileMode(Session.get("document"));
      editor.getSession().setMode(mode);
      var beautify = ace.require("ace/ext/beautify");
      editor.commands.addCommands(beautify.commands);
      editor.setOptions({ // more editor completion
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
      });
    }
  }); // tracker
});



Template.filename.helpers({
  rename: function() {
    return Session.equals("focusPane", "renamer");
  },

  title: function() { // strange artifact.
    var ref = Files.findOne(Session.get("document"));
    if (ref) return ref.title;
  }
});

Template.filename.events({
  // rename the current file
  "submit .rename": function(e) {
    e.preventDefault();
    $(e.target).blur();
    var txt = $("#filetitle")[0].value;
    if (txt == null || txt == "") return false;
    var id = Session.get("document");
    Session.set("focusPane", null);
    Meteor.call("renameFile", id, txt);
  },

  // if rename loses focus, stop
  "blur #filetitle": function(e) {
    Session.set("focusPane", null);
  },

  // delete the current file
  "click button.save": function(e) {
    e.preventDefault();
    Meteor.call("getAllShareJS");
  },

  // enable changing of filename
  "click button.edit": function (e) {
    e.preventDefault();
    Session.set("focusPane", "renamer");
    focusForm("#filetitle");
  },

  // delete the current file
  "click button.del": function(e) {
    e.preventDefault();
    var id = Session.get("document");
    Meteor.call("deleteFile", id);
    Session.set("focusPane", null);
    Session.set("document", null);
  }
});

