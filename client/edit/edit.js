// code editor things

const prof = GitSync.prof;
const imgcheck = GitSync.imgcheck;
const focusForm = GitSync.focusForm;

Template.editor.helpers({
  isImage() { // check if file extension is renderable
    const file = Files.findOne(Session.get("document"));
    if (file)
      return imgcheck(file.title)
  },
});

// make a fresh ace editor for a document, connected to its file
const mountEditor = (container, doc) => {
  $(container).html("<div id='editor'></div>");
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.setShowPrintMargin(false);
  const session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);

  // Filemode and suggestions
  session.setMode(GitSync.findFileMode(doc));
  const beautify = ace.require("ace/ext/beautify");
  editor.commands.addCommands(beautify.commands);
  editor.setOptions({ // more editor completion
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
  });

  const detach = FirepadAPI.attach(editor, doc, prof().login);
  return () => { detach(); editor.destroy(); };
};

// rebuild the editor whenever the active document changes
Template.aceEditor.onRendered(function () {
  this.autorun(() => {
    const doc = Session.get("document");
    Tracker.nonreactive(() => {
      if (this.unmount) this.unmount();
      this.unmount = doc && mountEditor(this.find("#editor-container"), doc);
    });
  });
});

Template.aceEditor.onDestroyed(function () {
  if (this.unmount) this.unmount();
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
