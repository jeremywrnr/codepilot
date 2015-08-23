// testing page task management

Template.tasks.helpers({

  hideCompleted: function () { // return whether to hide completed tasks
    return Session.get('hideCompleted');
  },

  tasks: function () { // sort, linkify and return tasks for this repo
    if (Session.get('hideCompleted')) {
      var chkd = Tasks.find({checked: {$ne: true}}, {sort: {time: -1}});
      return chkd.map(function(task){
        task.linkd = linkifyStr(task.text);
        return task;
      });
    } else { // dont hide completed - return all repo task items
      var unchkd = Tasks.find({}, {sort: {checked: 1, time: -1}});
      return unchkd.map(function(task){
        task.linkd = linkifyStr(task.text);
        return task;
      });
    }
  },

  taskCount: function () { // return amount of incomplete tasks
    if (Session.get('hideCompleted'))
      return Tasks.find({checked: {$ne: true}}).count();
    else
      return Tasks.find({}).count();
  },

});

Template.tasks.events({

  'submit .new-task': function(e) { // create a new task
    e.preventDefault();
    $(e.target).blur();
    var task = $('#task-name')[0].value; //check value
    if (task == null || task == '') return false;
    $('#task-name')[0].value = ''; // reset form text
    Meteor.call('addTask', task);
  },

  'change .hide-completed': function (e) { // toggle for showing completed
    Session.set('hideCompleted', e.target.checked);
  },

});



// individual task item helpers and events

Template.task.helpers({

  mine: function() { // return true for tasks this user created, used to style
    return (Meteor.user().profile.login === this.username);
  },

  current: function() {
    return Session.equals('focusPane', this._id);
  },


});

Template.task.events({

  'click .task': function() { // click to focus issue, again to reset
    if ( Session.equals('focusPane', this._id) )
      Session.set('focusPane', null);
    else
      Session.set('focusPane', this._id);
  },

  'click .toggle-checked': function () { // check or uncheck a task
    Meteor.call('setChecked', this); // server will deal with task updates
    Session.set('focusPane', null); // reset the currently selected task
  },

  'click .del': function () { // delete a task from this repo
    Meteor.call('deleteTask', this);
  }

});



// github issue event integration

Template.issues.helpers({

  issues: function () { // sort and return issues for this repo
    return Issues.find({}, {sort: {'issue.updated_at': -1}});
  },

  issueCount: function () { // return amount of open issues
    return Issues.find({}).count();
  },

});

Template.issues.events({

  'click .reload': function () { // update the issues for this repo
    Meteor.call('initIssues');
  }

});

// individual event helpers

Template.issue.helpers({

  current: function() {
    return Session.equals('focusPane', this._id);
  },

  screen: function() { // return an issue screenshot
    var screen;
    if(this.feedback)
      screen = Screens.findOne(this.feedback.imglink);
    if (screen)
      return screen.img;
  },

  labels: function () {
    if (this.issue) return this.issue.labels;
  },

});

Template.issue.events({

  'click .issue': function(e) { // click to focus issue, again to reset
    if ( Session.equals('focusPane', this._id) )
      Session.set('focusPane', null);
    else
      Session.set('focusPane', this._id);
  },

  'click .closeissue': function(e) { // click to close a given issue
    var trulyClose = confirm("Are you sure you'd like to close this issue?");
    if (trulyClose) Meteor.call('closeIssue', this);
  },

});
