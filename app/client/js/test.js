// testing page management

Template.testtasks.helpers({

  tasks: function () {
    if (Session.get("hideCompleted")) {
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },

  hideCompleted: function () {
    return Session.get("hideCompleted");
  },

  incompleteCount: function () {
    return Tasks.find({checked: {$ne: true}}).count();
  }

});

Template.testtasks.events({

  // rename the current file
  "submit .new-task": function(e) {
    e.preventDefault();
    $(e.target).blur();
    var task = $('#task-name')[0].value;
    if (task == null || task == '') return false;
    Meteor.call('addTask', task);
  },

  "change .hide-completed": function (e) {
    Session.set("hideCompleted", e.target.checked);
  }

});

// task item helpers and events

Template.todotask.helpers({
  mine: function() {
    return (Meteor.user().profile.login === this.username)
  }
});

Template.todotask.events({

  "click .toggle-checked": function () {
    Meteor.call("setChecked", this._id, ! this.checked);
  },

  "click .del": function () {
    Meteor.call("deleteTask", this._id);
  }

});

// iframe helper - load content from editor

Template.iframe.helpers({

  getHTML: function () {
    return Files.findOne({title:/.*html/}).content
  },

  getCSS: function () {
    return Files.findOne({title:/.*css/}).content
  },

  getJS: function () {
    return Files.findOne({title:/.*js/}).content
  },

});

