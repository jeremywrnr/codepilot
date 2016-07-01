// testing page management

Template.testfile.helpers({

  files() {
    return Files.find({}, {sort: {"title": 1}} )
  },

  current() {
    return Session.equals("testFile", this._id);
  },

});

Template.testfile.events({

  "click .file"() {
    Session.set("testFile", this._id);
    Session.set("focusPane", null);
  },

});

Template.testviz.helpers({

  enabled() {
    return Session.get("testViz");
  },

  file() {
    return !Session.equals("testFile", null)
  },

  mode() {
    return GitSync.findFileMode(Session.get("testFile"))
  },

  lang() {
    const mode = GitSync.findFileMode(Session.get("testFile"));
    return GitSync.tutorMap[mode];
  },

  target() {
    return Session.equals("focusPane", "target");
  },

  testcode() {
    const file = Files.findOne(Session.get("testFile"));
    if (file)
      return encodeURIComponent(file.content);
  },

  title() {
    const file = Files.findOne(Session.get("testFile"));
    if (file)
      return file.title;
  },

});

Template.testviz.events({

  "load #testviz"() {
    $(".resize").resizable({ handles: "s", helper: "ui-resizable-helper" });
  },

  "click .toggle"(e) {
    e.preventDefault();
    Session.set("testViz", !Session.get("testViz") );
  },

  "click .target"(e) {
    e.preventDefault();
    if ( Session.equals("focusPane", "target") )
      Session.set("focusPane", null);
    else
      Session.set("focusPane", "target");
  },

  "click .reload"(e) {
    e.preventDefault();
    FirepadAPI.getAllText((id, txt) => {
      Meteor.call("updateFile", id, txt); });
    Session.set("testViz", !Session.get("testViz") );
    setTimeout(() => {
      Session.set("testViz", !Session.get("testViz") );
    }, 100);
  },

});

Template.testweb.helpers({

  enabled() {
    return Session.get("testWeb");
  },

});

Template.testweb.events({

  "load #testweb"() {
    $(".resize").resizable({ handles: "s", helper: "ui-resizable-helper" });
  },

  "click .toggle"(e) {
    e.preventDefault();
    Session.set("testWeb", !Session.get("testWeb") );
    $(".resize").resizable({ handles: "s" });
  },

  "click .reload"(e) {
    e.preventDefault();
    FirepadAPI.getAllText((id, txt) => {
      Meteor.call("updateFile", id, txt); });
    $("#testweb")[0].contentWindow.location.reload(true)
  },

});



// github issue event integration

Template.issues.helpers({

  issues() { // sort and return issues for this repo
    return Issues.find({}, {sort: {"issue.updated_at": -1}});
  },

  issueCount() { // return amount of open issues
    return Issues.find({}).count();
  },

});

Template.issues.events({

  "click .reload"(e) { // update the issues for this repo
    e.preventDefault();
    Meteor.call("initIssues");
  }

});



// individual issue helpers

Template.issue.helpers({

  current() {
    return Session.equals("focusPane", this._id);
  },

  screen() { // return an issue screenshot
    let screen;
    if (this.feedback)
      screen = Screens.findOne(this.feedback.imglink);
    if (screen)
      return screen.img;
  },

  labels() {
    if (this.issue)
      return this.issue.labels;
  },

});

Template.issue.events({

  "click .issue"(e) { // click to focus issue, again to reset
    if ( Session.equals("focusPane", this._id) )
      Session.set("focusPane", null);
    else
      Session.set("focusPane", this._id);
  },

  "click .closeissue"(e) { // click to close a given issue
    Meteor.call("closeIssue", this);
  },

});

