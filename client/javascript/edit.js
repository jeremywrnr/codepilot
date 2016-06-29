// code editor things

var prof = GitSync.prof;

var focusForm = GitSync.focusForm;

var renderEditor = function() {
  // deleting old editor
  console.log("rendering...")
  console.log(Session.get("document"))
  $("#editor-container").empty();
  $("#editor-container").append("<div id='editor'></div>");
  focusForm("#editor");

  // avoid first rendering error
  if ($("#editor").length === 0) return;

  // make fresh new editor
  var editor = ace.edit("editor")
  editor.$blockScrolling = Infinity;
  editor.setTheme("ace/theme/monokai");
  editor.setShowPrintMargin(false);
  var session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  focusForm("#editor");

  // Create Firepad.
  var firepadRef = new Firebase(Session.get("firepadRef"));
  var firepad = Firepad.fromACE(firepadRef,
    editor, { userId: prof().login, });

  // Get cached content for when history empty
  var file = Files.findOne(Session.get("document"))
  firepad.on('ready', function() {
    if (firepad.isHistoryEmpty())
      firepad.setText(file.content);

    // Focus the editor panel
    editor.focus();
    editor.gotoLine(1);
  });

  // Filemode and suggestions
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

/* Odd artifact here - onRendered needs to have the render editor function fed
 * into it in order for the firepad to be loaded when returning from another
 * view, but will not trigger when the session document updates. To get around
 * this, we insert a 'render' helper in the editor template body, inside a with
 * docid statement. this handles not updating the firepad when the template is
 * the same. first tried using tracker autorun but that was running way to many
 * times and was unsure if you could configure it to reload only when the
 * active session document works. fails to style content on first load -
 * something with not being able to find the editor instance
 * */

Template.editor.helpers({
  docid: function() { return Session.get("document"); },

  render: function() { renderEditor(); }, // Create ACE editor

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

Template.editor.onRendered(renderEditor);



Template.filename.helpers({
  rename: function() {
    return Session.equals("focusPane", "renamer");
  },

  title: function() {
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

  // test the current file
  "click .test": function(e) {
    console.log("testing...")
    console.log(Session.get("document"))
    Session.set("testFile", Session.get("document"))
  },

  // save the current file
  "click button.save": function(e) {
    e.preventDefault();
    FirepadAPI.getAllText(function(id, txt){
      Meteor.call("updateFile", id, txt);
    });
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

