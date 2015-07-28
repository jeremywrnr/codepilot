// common methods (mostly tasks)

Meteor.methods({

  // Make sure the user is logged in before inserting a task
  addTask: function (text) {
    if (! Meteor.userId()) { throw new Meteor.Error("not-authorized"); }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().profile.login
    });
  },

  // If the task is private, make sure only the owner can delete it
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized");
    Tasks.remove(taskId);
  },

  // If the task is private, make sure only the owner can check it off
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized");
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  // Make sure only the task owner can make a task private
  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);
    if (task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized");
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }

});
