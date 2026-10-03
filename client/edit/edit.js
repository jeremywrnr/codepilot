// code editor things

const prof = GitSync.prof;
const ufids = GitSync.ufids;
const imgcheck = GitSync.imgcheck;
const focusForm = GitSync.focusForm;

let firepad = null; // the live firepad, disposed before making a new one
let renderedDoc = null; // which document the live firepad is for

const renderEditor = () => {
  const doc = Session.get("document");
  if (doc === renderedDoc && $("#editor .ace_editor, #editor.ace_editor").length) return;

  // deleting old editor
  console.log(`rendering: ${doc}`)
  if (firepad) firepad.dispose();
  firepad = null;
  renderedDoc = null;
  $("#editor-container").empty();
  $("#editor-container").append("<div id='editor'></div>");
  focusForm("#editor");

  // avoid first rendering error
  if ($("#editor").length === 0) return;

  // make fresh new editor
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.setShowPrintMargin(false);
  const session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  focusForm("#editor");

  const file = Files.findOne(doc);
  renderedDoc = doc;

  if (FirepadAPI.enabled) {
    // Create Firepad.
    const pad = firepad = Firepad.fromACE(FirepadAPI.ref(doc),
      editor, { userId: prof().login, });

    // Get cached content for when history empty
    pad.on('ready', () => {
      if (pad.isHistoryEmpty() && file && file.content)
        pad.setText(file.content);

      // Focus the editor panel
      editor.focus();
      editor.gotoLine(1);
    });
  } else {
    // no firebase: edit file.content in mongo directly (no live co-editing)
    editor.setValue((file && file.content) || "", -1);
    let saveTimer = null;
    editor.on("change", () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() =>
        Meteor.callAsync("updateFile", doc, editor.getValue()), 500);
    });
    editor.focus();
  }

  // Filemode and suggestions
  const mode = GitSync.findFileMode(doc);
  editor.getSession().setMode(mode);
  const beautify = ace.require("ace/ext/beautify");
  editor.commands.addCommands(beautify.commands);
  editor.setOptions({ // more editor completion
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
  });
};

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
  docid() { return Session.get("document"); },

  render() { renderEditor(); }, // Create ACE editor

  isImage() { // check if file extension is renderable
    const file = Files.findOne(Session.get("document"));
    if (file)
      return imgcheck(file.title)
  },
});

Template.editor.onRendered(renderEditor);
Template.editor.onDestroyed(() => { // leaving the editor, drop firepad
  if (firepad) firepad.dispose();
  firepad = null;
  renderedDoc = null;
});



Template.filename.helpers({
  rename() {
    return Session.equals("focusPane", "renamer");
  },

  title() {
    const ref = Files.findOne(Session.get("document"));
    if (ref) return ref.title;
  }
});

Template.filename.events({
  // rename the current file
  "submit .rename"(e) {
    e.preventDefault();
    $(e.target).blur();
    const txt = $("#filetitle")[0].value;
    if (txt == null || txt == "") return false;
    const id = Session.get("document");
    Session.set("focusPane", null);
    Meteor.call("renameFile", id, txt);
  },

  // if rename loses focus, stop
  "blur #filetitle"(e) {
    Session.set("focusPane", null);
  },

  // test the current file
  "click .test"(e) {
    let doc = Session.get("document")
    console.log(`testing: ${doc}`)
    Session.set("testViz", true)
    Session.set("testFile", doc)
    FirepadAPI.getText(doc, function (txt) {
      Meteor.call("updateFile", doc, txt);
    });
  },

  // enable changing of filename
  "click button.edit"(e) {
    e.preventDefault();
    Session.set("focusPane", "renamer");
    focusForm("#filetitle");
  },

  // delete the current file
  "click button.del"(e) {
    e.preventDefault();
    const trulyDelete = confirm("This will delete the file. Proceed?");

    if (trulyDelete) {
      const id = Session.get("document");
      Meteor.call("deleteFile", id);
      Session.set("focusPane", null);
      Session.set("document", null);
    }
  }
});
