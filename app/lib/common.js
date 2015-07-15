// data publishing

Messages = new Mongo.Collection('messages');
Files = new Mongo.Collection('files');
Tasks = new Mongo.Collection("tasks");

//Accounts.ui.config({ passwordSignupFields: "USERNAME_ONLY" });

// routing

Router.configure({ layoutTemplate: 'main' });

// asks user to login before coding
Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('config');
  } else { this.next(); }
});

Router.map(function () {
  this.route('code', { path: '/', });
  this.route('test');
  this.route('git')
  this.route('config');
});

// common methods

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});
