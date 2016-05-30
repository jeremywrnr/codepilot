// testing page task management

var linkify = GitSync.linkify;
var prof = GitSync.prof;


// github issue event integration

Template.issues.helpers({

  issues: function () { // sort and return issues for this repo
    return Issues.find({}, {sort: {"issue.updated_at": -1}});
  },

  issueCount: function () { // return amount of open issues
    return Issues.find({}).count();
  },

});

Template.issues.events({

  "click .reload": function () { // update the issues for this repo
    Meteor.call("initIssues");
  }

});



// individual issue helpers

Template.issue.helpers({

  current: function() {
    return Session.equals("focusPane", this._id);
  },

  screen: function() { // return an issue screenshot
    var screen;
    if (this.feedback)
      screen = Screens.findOne(this.feedback.imglink);
    if (screen)
      return screen.img;
  },

  labels: function () {
    if (this.issue)
      return this.issue.labels;
  },

});

Template.issue.events({

  "click .issue": function(e) { // click to focus issue, again to reset
    if ( Session.equals("focusPane", this._id) )
      Session.set("focusPane", null);
    else
      Session.set("focusPane", this._id);
  },

  "click .closeissue": function(e) { // click to close a given issue
    //var trulyClose = confirm("Are you sure you"d like to close this issue?");
    //if (trulyClose)
      Meteor.call("closeIssue", this);
  },

});
