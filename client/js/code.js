// code editor things

focusForm = Codepilot.focusForm;

Template.code.helpers({

  nulldoc: function() {
    return Session.equals('document', null);
  }

});


Template.editor.helpers({
  docid: function() {
    return Session.get('document');
  },

  isImage: function() { // check if file extension is renderable
    var file = Files.findOne(Session.get('document'));
    if (file) {
      var image = /\.(gif|jpg|jpeg|tiff|png|bmp)$/i;
      if (image.test(file.title)) {
        if (file.type !== 'image')
          Meteor.call('setFileType', file, 'image');
        return true;
      } else {
        if (file.type !== 'file')
          Meteor.call('setFileType', file, 'file');
        return false;
      }
    }
  },

  config: function() { // set default theme and autocomplete
    return function(editor) {
      editor.setTheme('ace/theme/monokai');
      editor.setShowPrintMargin(false);
      editor.getSession().setUseWrapMode(true);
      var beautify = ace.require('ace/ext/beautify');
      editor.commands.addCommands(beautify.commands);
      editor.setOptions({
        enableBasicAutocompletion: true,

        // more advanced editor completion
        enableLiveAutocompletion: true,
        enableSnippets: true
      });
    };
  },

  setMode: function() { // different style on filetype
    return function(editor) {
      var file = Files.findOne(Session.get('document'));
      var modelist = ace.require('ace/ext/modelist');
      if (file) {
        var mode = modelist.getModeForPath(file.title);
        editor.getSession().setMode(mode.mode);
      }
    }
  },
});


Template.filename.helpers({
  rename: function() {
    return Session.equals('focusPane', 'renamer');
  },

  title: function() { // strange artifact.
    var ref;
    return (ref = Files.findOne(this + '')) != null ? ref.title : void 0;
  }
});


Template.filename.events({
  // rename the current file
  'submit .rename': function(e) {
    e.preventDefault();
    $(e.target).blur();
    var txt = $('#filetitle')[0].value;
    if (txt == null || txt == '') return false;
    var id = Session.get('document');
    Session.set('focusPane', null);
    Files.update(id, {$set:{title:txt}} );
  },

  // if rename loses focus, stop
  'blur #filetitle': function(e) {
    Session.set('focusPane', null);
  },

  // enable changing of filename
  'click button.edit': function (e) {
    e.preventDefault();
    Session.set('focusPane', 'renamer');
    focusForm('#filetitle');
  },

  // delete the current file
  'click button.del': function(e) {
    e.preventDefault();
    var id = Session.get('document');
    Meteor.call('deleteFile', id);
    Session.set('focusPane', null);
    Session.set('document', null);
  }
});


Template.renderImage.helpers({
  html: function() { // return link to file on github
    var file = Files.findOne(Session.get('document'));
    if (file)
      return file.html;
  },

  raw: function() { // return link to github image
    var file = Files.findOne(Session.get('document'));
    if (file)
      return file.raw;
  },
});

