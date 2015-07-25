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
    };
  }

});

Template.filename.helpers({
  title: function() {
    var ref;
    return (ref = Files.findOne(this + "")) != null ? ref.title : void 0;
  }
});

