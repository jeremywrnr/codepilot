// file things

Template.fileTitle.helpers({
  title: function() {
    var ref;
    return (ref = Files.findOne(this + "")) != null ? ref.title : void 0;
  },
  editorType: function(type) {
    return Session.equals("editorType", type);
  }
});

Template.fileList.helpers({
  files: function() {
    return Files.find();
  }
});

Template.fileList.events = {
  "click button": function() {
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
  "click a": function(e) {
    e.preventDefault();
    return Session.set("document", this._id);
  }
};
