// editor things

Template.editor.helpers({

  docid: function() {
    return Session.get("document");
  },
  configAce: function() {
    return function(ace) {
      ace.setTheme('ace/theme/monokai');
      ace.setShowPrintMargin(false);
      ace.getSession().setUseWrapMode(true);
    };
  }

});

Template.editor.events = {

  // rename the current file
  "keydown input[name=title]": function(e) {
    if (e.keyCode !== 13) { return; }
    e.preventDefault();
    $(e.target).blur();
    var id = Session.get("document");
    Session.set("renaming", false);
    Files.update(id, { title: e.target.value });
  },

  // enable changing of filename
  "click button.edit": function (e) {
    e.preventDefault();
    Session.set("renaming", true);
  },

  // delete the current file
  "click button.del": function(e) {
    e.preventDefault();
    var id = Session.get("document");
    Meteor.call("deleteFile", id);
    Session.set("renaming", false);
    Session.set("document", null);
  }

};

Template.filename.helpers({
  rename: function() {
    return Session.equals("renaming", true);
  },
  title: function() {
    var ref;
    return (ref = Files.findOne(this + "")) != null ? ref.title : void 0;
  }
});

