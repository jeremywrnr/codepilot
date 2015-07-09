// file things

Template.fileList.helpers({
  files: function() {
    return Files.find();
  }
});

Template.fileList.events = {
  "click .new": function() {
    return Files.insert({
      title: "untitled"
    }, function(err, id) {
      if (!id) { return; }
      return Session.set("document", id);
    });
  }
};

Template.fileItem.helpers({
  current: function() {
    return Session.equals("document", this._id);
  }
});

Template.fileItem.events = {
  "click .file": function(e) {
    e.preventDefault();
    return Session.set("document", this._id);
  }
};
