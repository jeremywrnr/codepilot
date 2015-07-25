// file things

Template.files.helpers({
  files: function() { return Files.find() }
});

Template.fileitem.helpers({
  current: function() {
    return Session.equals("document", this._id);
  }
});

Template.fileitem.events = {
  "click .file": function(e) {
    Session.set("document", this._id);
  }
};
