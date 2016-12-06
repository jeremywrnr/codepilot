// code editor things

const prof = GitSync.prof;
const ufids = GitSync.ufids;
const imgcheck = GitSync.imgcheck;
const focusForm = GitSync.focusForm;

const renderEditor = () => {
  // deleting old editor
  console.log(`rendering: ${Session.get("document")}`)
  $("#editor-container").empty();
  $("#editor-container").append("<div id='editor'></div>");
  focusForm("#editor");

  // avoid first rendering error
  if ($("#editor").length === 0) return;

  // make fresh new editor
  const editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.setTheme("ace/theme/monokai");
  editor.setShowPrintMargin(false);
  const session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  focusForm("#editor");

  // Create Firepad.
  const firepadRef = new Firebase(Session.get("firepadRef"));
  const firepad = Firepad.fromACE(firepadRef,
    editor, { userId: prof().login, });

  // Get cached content for when history empty
  const file = Files.findOne(Session.get("document"));
  firepad.on('ready', () => {
    if (firepad.isHistoryEmpty() && file.content)
      firepad.setText(file.content);

    // Focus the editor panel
    editor.focus();
    editor.gotoLine(1);
  });

  // Filemode and suggestions
  const mode = GitSync.findFileMode(Session.get("document"));
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
    Session.set("testVis", true)
    console.log(`testing: ${Session.get("document")}`)
    Session.set("testFile", Session.get("document"))
  },

  // save the current file
  "click button.save"(e) {
    e.preventDefault();
    FirepadAPI.getAllText(ufids(), (id, txt) => {
      Meteor.call("updateFile", id, txt);
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

