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

  config: function() {
    return function(editor) { // set default theme
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

  setMode: function() {
    return function(editor) { // different style on filetype
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
    return Session.equals('renaming', true);
  },

  title: function() {
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
    Session.set('renaming', false);
    Files.update(id, {$set:{title:txt}} );
  },

  // enable changing of filename
  'click button.edit': function (e) {
    e.preventDefault();
    Session.set('renaming', true);
    focusForm('#filetitle');
  },

  // delete the current file
  'click button.del': function(e) {
    e.preventDefault();
    var id = Session.get('document');
    Meteor.call('deleteFile', id);
    Session.set('renaming', false);
    Session.set('document', null);
  }

});
