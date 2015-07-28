// code editor things

Template.code.helpers({

  nulldoc: function() {
    return Session.equals("document", null);
  }

});

Template.editor.helpers({

  docid: function() {
    return Session.get("document");
  },
  configAce: function() {
    return function(ace) {
      ace.setTheme('ace/theme/monokai');
      ace.setShowPrintMargin(false);
      ace.getSession().setUseWrapMode(true);
      //different style colors based on filename
      //return filename.split('.').pop();
    };
  }

});

Template.filename.helpers({

  rename: function() {
    return Session.equals("renaming", true);
  },
  title: function() {
    var ref;
    return (ref = Files.findOne(this + "")) != null ? ref.title : void 0;
  }

});

Template.filename.events = {

  // rename the current file
  "submit .rename": function(e) {
    e.preventDefault();
    $(e.target).blur();
    var txt = $('#filetitle')[0].value;
    if (txt == null || txt == '') return false;
    var id = Session.get("document");
    Session.set("renaming", false);
    Files.update(id, {$set:{title:txt}} );
  },

  // enable changing of filename
  "click button.edit": function (e) {
    e.preventDefault();
    Session.set("renaming", true);
    focusForm('#filetitle');
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

