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

  "submit .new-task": function (e) {
    var text = e.target.text.value;
    if (text !== null && text !== ''){
      Meteor.call("addTask", text);
      e.target.text.value = ''; // Clear form
    } // Prevent default form submit
    return false;
  },

  "change .hide-completed": function (e) {
    Session.set("hideCompleted", e.target.checked);
  }

});

// task item helpers and events

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

Template.todotask.events({

  "click .toggle-checked": function () {
    Meteor.call("setChecked", this._id, ! this.checked);
  },

  "click .del": function () {
    Meteor.call("deleteTask", this._id);
  }

});
