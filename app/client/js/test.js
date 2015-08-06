// testing page management

Template.testtasks.helpers({

  tasks: function () {
    if (Session.get('hideCompleted')) {
      return Tasks.find({checked: {$ne: true}}, {sort: {time: -1}});
    } else {
      return Tasks.find({}, {sort: {checked: 1, time: -1}});
    }
  },

  hideCompleted: function () {
    return Session.get('hideCompleted');
  },

  incompleteCount: function () {
    return Tasks.find({checked: {$ne: true}}).count();
  }

});

Template.testtasks.events({

  // rename the current file
  'submit .new-task': function(e) {
    e.preventDefault();
    $(e.target).blur();
    var task = $('#task-name')[0].value;
    if (task == null || task == '') return false;
    Meteor.call('addTask', task);
    $('#task-name')[0].value = ''; // reset txt
  },

  'change .hide-completed': function (e) {
    Session.set('hideCompleted', e.target.checked);
  }

});

// task item helpers and events

Template.todotask.helpers({
  mine: function() {
    return (Meteor.user().profile.login === this.username)
  }
});

Template.todotask.events({

  'click .toggle-checked': function () {
    Meteor.call('setChecked', this._id, ! this.checked);
    Meteor.call('addMessage', ' checked task: ' + this.text);
  },

  'click .del': function () {
    Meteor.call('deleteTask', this._id);
    Meteor.call('addMessage', ' deleted task: ' + this.text);
  }

});

// update all file contents, resfresing the tester frame

Template.tester.events({

  'click .reload': function () {
    Meteor.call('testShareJS');
  },

});

// iframe helper - load content from editor

Template.renderer.helpers({

  getHead: function () { // parse head of html file
  var full = Files.findOne({title: /.*html/}).content;
    var doc = $( '<html></html>' );
    doc.html( full );
    return $('head', doc)[0].innerHTML;
  },

  getBody: function () {
    var full = Files.findOne({title: /.*html/}).content;
    var doc = $( '<html></html>' );
    doc.html( full );
    return $('body', doc)[0].innerHTML;
  },

  getCSS: function () {
    return Files.findOne({title: /.*css/}).content;
  },

  getJS: function () {
    return Files.findOne({title: /.*js/}).content;
  },

});
