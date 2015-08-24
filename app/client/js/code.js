// code editor things

Template.code.helpers({

  nulldoc: function() {
    return Session.equals('document', null);
  }

});

Template.editor.helpers({

  docid: function() {
    return Session.get('document');
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
        enableLiveAutocompletion: true,
        enableSnippets: true
      });
    };
  },

  nullMode: function() { // check if file list in whitelist of types
    var file = Files.findOne(Session.get('document'));
    var modelist = ace.require('ace/ext/modelist');
    if (file) {
      var mode = modelist.getModeForPath(file.title);
      var extn = file.title.split('.').pop();
      if (extn !== file.title) // check if file actually has extension
        if (mode.mode === 'ace/mode/text') // text is default mode type
          if (! mode.extRe.test(file.title)) // but doesnt match regex
            return true;
    }
  },

  isImage: function() { // if
  },

  setMode: function() { // different style on filetype
    return function(editor) {
      var fileId = Session.get('document');
      var fileName = Files.findOne( fileId ).title;
      var modelist = ace.require('ace/ext/modelist');
      var filemode = modelist.getModeForPath( fileName ).mode;
      editor.getSession().setMode( filemode );
    }
  }

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
