// testing page management

Template.testfile.helpers({

  files: function() {
    return Files.find({}, {sort: {"title": 1}} )
  },

  current: function() {
    return Session.equals("testFile", this._id);
  },

});

Template.testfile.events({

  "click .file": function() {
    Session.set("testFile", this._id);
    Session.set("focusPane", null);
  },

});

Template.testviz.helpers({

  file: function() {
    return !Session.equals("testFile", null)
  },

  mode: function() {
    return GitSync.findFileMode(Session.get("testFile"))
  },

  lang: function() {
    var mode = GitSync.findFileMode(Session.get("testFile"))
    return GitSync.tutorMap[mode];
  },

  enabled: function() {
    return Session.get("testViz");
  },

  target: function() {
    return Session.equals("focusPane", "target");
  },

  testcode: function() {
    var file = Files.findOne(Session.get("testFile"));
    if (file)
      return encodeURIComponent(file.content);
  },

  title: function() {
    var file = Files.findOne(Session.get("testFile"));
    if (file)
      return file.title;
  },

});

Template.testviz.events({

  "load #testviz": function() {
    $(".resize").resizable({ handles: "s", helper: "ui-resizable-helper" });
  },

  "click .toggle": function(e) {
    e.preventDefault();
    Session.set("testViz", !Session.get("testViz") );
  },

  "click .target": function(e) {
    e.preventDefault();
    if ( Session.equals("focusPane", "target") )
      Session.set("focusPane", null);
    else
      Session.set("focusPane", "target");
  },

  "click .reload": function (e) {
    e.preventDefault();
    Session.set("testViz", !Session.get("testViz") );
    setTimeout(function() {
      Session.set("testViz", !Session.get("testViz") );
    }, 100);
    Meteor.call("getAllShareJS");
  },

});

Template.testweb.helpers({

  enabled: function() {
    return Session.get("testWeb");
  },

});

Template.testweb.events({

  "load #testweb": function() {
    $(".resize").resizable({ handles: "s", helper: "ui-resizable-helper" });
  },

  "click .toggle": function(e) {
    e.preventDefault();
    Session.set("testWeb", !Session.get("testWeb") );
    $(".resize").resizable({ handles: "s" });
  },

  "click .reload": function (e) {
    e.preventDefault();
    $("#testweb")[0].contentWindow.location.reload(true)
    Meteor.call("getAllShareJS");
  },

});




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

  "click .reload": function (e) { // update the issues for this repo
    e.preventDefault();
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

