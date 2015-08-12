// testing page management

Template.tasks.helpers({

  hideCompleted: function () { // return whether to hide completed tasks
    return Session.get('hideCompleted');
  },

  tasks: function () { // sort and return tasks for this repo
    if (Session.get('hideCompleted')) {
      return Tasks.find({checked: {$ne: true}}, {sort: {time: -1}});
    } else {
      return Tasks.find({}, {sort: {checked: 1, time: -1}});
    }
  },

  taskCount: function () { // return amount of incomplete tasks
    return Tasks.find({checked: {$ne: true}}).count();
  },

  issues: function () { // sort and return tasks for this repo
    return Issues.find({}, {sort: {time: -1}});
  },

  issueCount: function () { // return amount of open issues
    return Issues.find({}).count();
  },

});

Template.tasks.events({

  'submit .new-task': function(e) { // create a new task
    e.preventDefault();
    $(e.target).blur();
    var task = $('#task-name')[0].value;
    if (task == null || task == '') return false;
    Meteor.call('addTask', task);
    Meteor.call('addMessage', 'created task \'' + task + '\'');
    $('#task-name')[0].value = ''; // reset form text
  },

  'change .hide-completed': function (e) { // toggle for showing completed
    Session.set('hideCompleted', e.target.checked);
  },

  'click .reload': function () { // update the issues for this repo
    Meteor.call('loadIssues');
  }

});



// task item helpers and events

Template.task.helpers({

  mine: function() { // return true for tasks this user created, used to style
    return (Meteor.user().profile.login === this.username)
  }

});

Template.task.events({

  'click .toggle-checked': function () { // check or uncheck a task
    var action = (this.checked ? 'checked' : 'unchecked');
    Meteor.call('setChecked', this._id, ! this.checked);
    Meteor.call('addMessage', action + ' task \'' + this.text + '\'');
  },

  'click .del': function () { // delete a task from this repo
    Meteor.call('deleteTask', this._id);
    Meteor.call('addMessage', 'deleted task \'' + this.text + '\'');
  }

});



// github issue event integration

Template.issue.helpers({

  current: function() {
    return Session.equals('issue', this._id);
  },

});

Template.issue.events({

  'click .issue': function(e) { // click to focus issue, again to reset
    if ( Session.equals('issue', this._id) ) {
      Session.set('issue', null);
    } else {
      Session.set('issue', this._id);
    }
  },

  'click .closeissue': function(e) { // click to close a given issue
  },

});
