// file things

var newFile = function() {
  Meteor.call('newFile', function(err, id){
    Session.set('document', id);
  });
};

Template.filelist.events({
  'click .new': function() { newFile(); }
});

Template.userfiles.helpers({

  files: function() {
    return Files.find({}, {sort: {'title': 1}} )
  }

});

Template.userfiles.events({
  'click .new': function() { newFile(); }
});



// individual files

Template.fileitem.helpers({

  current: function() {
    return Session.equals('document', this._id);
  }

});

Template.fileitem.events({

  'click .file': function() {
    var self = this;
    Meteor.call('postShareJS', self, function(err, res){
      if (! err)
        Session.set('document', self._id);
    });
  }

});
