// git things - version control, importing code

const difflib = Difflib.lib;
const diffview = Difflib.view;

const prof = GitSync.prof;
const ufiles = GitSync.userfiles;
const clean = GitSync.sanitizeDiffs;
const focusForm = GitSync.focusForm;
const labelLineNumbers = GitSync.labelLineNumbers;

Template.commitPanel.helpers({

  branch() {
    return prof().repoBranch;
  },

  committing() {
    return Session.equals("focusPane", "committer");
  },

  changes() {
    return !GitSync.changes()
  },

});

Template.commitPanel.events({

  "click .newcommit"(e) {
    e.preventDefault();
    FirepadAPI.getAllText((id, txt) => {
      Meteor.call("updateFile", id, txt); });
    Session.set("focusPane", "committer");
    focusForm("#commitMsg");
  },

  "submit .committer"(e) {
    e.preventDefault();
    $(e.target).blur();
    const msg = $("#commitMsg")[0].value;
    if (msg == null || msg == "") return false; // dont allow empty commit msgs
    Session.set("committing", null);
    Session.set("focusPane", null);
    Meteor.call("newCommit", msg);
  },

  "click .cancelCommit"(e) {
    e.preventDefault();
    Session.set("focusPane", null);
  },

  "click .reload"(e) { // pull in latest version of buffers
    e.preventDefault();
    FirepadAPI.getAllText((id, txt) => {
      Meteor.call("updateFile", id, txt); });
  },

  "click .loadhead"(e) { // load head of branch into SJS
    e.preventDefault();
    const trulyLoad = confirm("This will overwrite any uncommitted changes. Proceed?");
    if (trulyLoad) {
      Meteor.call("loadHead", prof().repoBranch);
      FirepadAPI.setAllText();
    }
  },

});

Template.history.helpers({ // sort the commits by time

  commits() {
    return Commits.find({}, {sort: {"commit.commit.committer.date": -1}} );
  },

  commitCount() {
    return Commits.find({}).count();
  },

});

Template.history.events({

  "click .reload"(e) { // pull in latest commits from gh
    e.preventDefault();
    Meteor.call("initCommits");
  },

});

Template.commit.helpers({

  current() {
    return Session.equals("focusPane", this._id);
  },

  mine() {
    const myprof = prof();
    if (myprof && this.commit && this.commit.author)
      return (myprof.login === this.commit.author.login)
  },

});

Template.commit.events({

  "click .commit"(e) {
    if (Session.equals("focusPane", this._id))
      Session.set("focusPane", null);
    else
      Session.set("focusPane", this._id);
  },

  "click .loadcommit"(e) {
    const trulyLoad = confirm("This will overwrite any uncommitted changes. Proceed?");
    if (trulyLoad) {
      Session.set("focusPane", null);
      Meteor.call("loadCommit", this.commit.sha);
      FirepadAPI.setAllText();
    }
  },

});




// RENDERING DIFFS

Template.statusPanel.helpers({

  changes() { // return true if any diffs exist.
    return GitSync.changes();
  },

  diffs() { // using jsdiff, return a diff on each file
    return ufiles().map(function checkDiff(file){ // content v cache
      if(file.content !== file.cache) // return the different file
        return {
          id: file._id,
          title: file.title,
          content: file.content,
          cache: file.cache
        };
    }).filter(function removeNull(diff){
      return diff != undefined;
    });
  },

});

Template.diff.helpers({

  lines() {
    if (this.content === this.cache) return; // nodiff

    const base = difflib.stringAsLines( this.cache );
    const newtxt = difflib.stringAsLines( this.content );
    const sm = new difflib.SequenceMatcher(base, newtxt);
    const opcodes = sm.get_opcodes();
    const context = 1; // relevant rows

    const codeview = diffview.buildView({
      opcodes,
      baseTextLines: base,
      newTextLines: newtxt,
      baseTextName: "base",
      newTextName: "new",
      contextSize: context,
      viewType: 1, // 0 for side by side, 1 for inline diff
    });

    return codeview.map(function parse(x){

      // parsing out the old and new line numbers
      const linedata = {};
      let oldnum, newnum;
      const numinfo = x.getElementsByTagName("th");
      if (numinfo[0] == undefined || numinfo[1] == undefined)
        return; // for some reason no line numbers???

      // parsing out the table data (edit/delete)
      let allinfo, info, status, content;
      allinfo = x.getElementsByTagName("td");
      if (allinfo[0] == undefined)
        return; // empty tags???

      // building up the line data information
      linedata.oldnum = numinfo[0].innerHTML;
      linedata.newnum = numinfo[1].innerHTML;
      linedata.status = allinfo[0].getAttribute("class");
      linedata.content = clean(allinfo[0].innerHTML);
      return linedata;

    }).filter(function denull(l){ // remove any empty rows
      return l != undefined;
    });
  },

});

Template.diff.events({

  "click .reset"(e) {
    console.log(this.id)
    const trulyReset = confirm("This will reset this file back to the last commit. Proceed?");
    if (trulyReset) Meteor.call("resetFile", this.id);
    FirepadAPI.setText(this.id)
  }

});

Template.diffline.helpers({

  content() { return this.content; },
  skipped() { return this.status == "skip" },
  equal() { return this.status == "equal" },
  inserted() { return this.status == "insert" },
  deleted() { return this.status == "delete" },

  newnum() {
    const num = this.newnum;
    if (num > 0)
      return num
    else
      return "-"
  },

  oldnum() {
    const num = this.newnum;
    if (num > 0)
      return num
    else
      return "-"
  },

});

