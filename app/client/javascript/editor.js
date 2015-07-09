// editor things

Template.editor.helpers({
  docid: function() {
    return Session.get("document");
  },
  ace: function() {
    return Session.equals("editorType", "ace");
  },
  editMeta: function () {
    return Session.get("editMeta");
  },
  configAce: function() {
    return function(ace) {
      ace.setTheme('ace/theme/monokai');
      ace.setShowPrintMargin(false);
      return ace.getSession().setUseWrapMode(true);
    };
  }
});

Template.editor.events = {

  // enable changing of filename
  "click button.edit": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  },

  // rename the current file
  "keydown input[name=title]": function(e) {
    var id;
    if (e.keyCode !== 13) {
      return;
    }
    e.preventDefault();
    $(e.target).blur();
    id = Session.get("document");
    Session.set("editMeta", false);
    return Files.update(id, {
      title: e.target.value
    });
  },

  // delete the current file
  "click button#del": function(e) {
    var id;
    e.preventDefault();
    id = Session.get("document");
    Meteor.call("deleteFile", id);
    Session.set("document", null);
    Session.set("editMeta", false);
  },
  "change input[name=editor]": function(e) {
    Session.set("editorType", e.target.value);
  }

};
