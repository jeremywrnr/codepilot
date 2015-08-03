// common (server and client) methods

Meteor.methods({

  //////////////////
  // FEED MANAGEMENT
  //////////////////

  // Make sure the user is logged in before inserting a task
  addMessage: function (msg) {
    if (! Meteor.userId())
      throw new Meteor.Error('not-authorized');
    if (msg.value !== '') {
      Messages.insert({
        owner: Meteor.userId(),
        name: Meteor.user().profile.login,
        message: msg,
        time: Date.now()
      });
    } else
      throw new Meteor.Error('null-message');
  },



  //////////////////
  // TASK MANAGEMENT
  //////////////////

  // Make sure the user is logged in before inserting a task
  addTask: function (text) {
    if (! Meteor.userId())
      throw new Meteor.Error('not-authorized');
    Tasks.insert({
      text: text,
      time: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().profile.login
    }, function addToFeed(err, id){
      if (! err) Meter.call('addMessage', 'added '+text+' to tasks');
    });
  },

  // If the task is private, make sure only the owner can delete it
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId())
      throw new Meteor.Error('not-authorized');
    Tasks.remove(taskId);
  },

  // If the task is private, make sure only the owner can check it off
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId())
      throw new Meteor.Error('not-authorized');
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },



  //////////////////
  // ROLE MANAGEMENT
  //////////////////

  setPilot: function() {
    return Meteor.users.update(
      {'_id': Meteor.userId()},
      {$set : {'profile.role':'pilot'}}
    );
  },

  setCopilot: function() {
    return Meteor.users.update(
      {'_id': Meteor.userId()},
      {$set : {'profile.role':'copilot'}}
    );
  },



  //////////////////
  // REPO MANAGEMENT
  //////////////////

  setRepo: function(gr) { //set git repo
    return Meteor.users.update(
      {'_id': Meteor.userId()},
      {$set : {
        'profile.repo': gr._id,
        'profile.repoName': gr.repo.name,
        'profile.repoOwner': gr.repo.owner.login
      }});
  },

  setBranch: function(bn) { //set branch name
    return Meteor.users.update(
      {'_id': Meteor.userId()},
      {$set : {
        'profile.repoBranch': bn,
      }});
  }

});
