// git things - version control, importing code

var difflib = Difflib.lib;
var diffview = Difflib.view;

var prof = GitSync.prof;
var ufiles = GitSync.userfiles;
var clean = GitSync.sanitizeDiffs;
var focusForm = GitSync.focusForm;
var labelLineNumbers = GitSync.labelLineNumbers;

Template.commitPanel.helpers({

  branch: function() {
    return prof().repoBranch;
  },

  committing: function() {
    return Session.equals('focusPane', 'committer');
  },

  changes: function() {
    return !GitSync.changes()
  },

});

Template.commitPanel.events({

  'click .newcommit': function(e) {
    e.preventDefault();
    Meteor.call('getAllShareJS');
    Session.set('focusPane', 'committer');
    focusForm('#commitMsg');
  },

  'submit .committer': function(e) {
    e.preventDefault();
    $(e.target).blur();
    var msg = $('#commitMsg')[0].value;
    if (msg == null || msg == '') return false; // dont allow empty commit msgs
    Session.set('committing', null);
    Session.set('focusPane', null);
    Meteor.call('newCommit', msg);
  },

  'click .cancelCommit': function(e) {
    Session.set('focusPane', null);
  },

  'click .refresh': function(e) { // pull in latest version of buffers
    Meteor.call('getAllShareJS');
  },

  'click .reload': function(e) { // pull in latest commits from gh
    Meteor.call('initCommits');
  },

  'click .loadhead': function(e) { // load head of branch into SJS
    var trulyLoad = confirm("This will overwrite any uncommitted changes. Proceed?");
    if (trulyLoad)
      Meteor.call('loadHead', prof().repoBranch);
  },

});

Template.history.helpers({ // sort the commits by time

  commits: function() {
    return Commits.find({}, {sort: {'commit.commit.committer.date': -1}} );
  },

  commitCount: function() {
    return Commits.find({}).count();
  },

});

Template.commit.helpers({

  current: function() {
    return Session.equals('focusPane', this._id);
  },

  mine: function() {
    return (prof().login === this.commit.author.login)
  },

});

Template.commit.events({

  'click .commit': function(e) {
    if ( Session.equals('focusPane', this._id) ) {
      Session.set('focusPane', null);
    } else {
      Session.set('focusPane', this._id);
    }
  },

  'click .loadcommit': function(e) {
    var trulyLoad = confirm("This will overwrite any uncommitted changes. Proceed?");
    if (trulyLoad) {
      Session.set('focusPane', null);
      Meteor.call('loadCommit', this.commit.sha);
    }
  },

});

Template.statusPanel.helpers({

  changes: function() { // return true if any diffs exist.
    return GitSync.changes();
  },

  diffs: function() { // using jsdiff, return a diff on each file
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

  lines: function() {
    if (this.content === this.cache) return; // nodiff

    var base = difflib.stringAsLines( this.cache );
    var newtxt = difflib.stringAsLines( this.content );
    var sm = new difflib.SequenceMatcher(base, newtxt);
    var opcodes = sm.get_opcodes();
    var context = 1; // relevant rows

    var codeview = diffview.buildView({
      opcodes: opcodes,
      baseTextLines: base,
      newTextLines: newtxt,
      baseTextName: "base",
      newTextName: "new",
      contextSize: context,
      viewType: 1, // 0 for side by side, 1 for inline diff
    });

    return codeview.map(function parse(x){

      // parsing out the old and new line numbers
      var linedata = {};
      var oldnum, newnum;
      var numinfo = x.getElementsByTagName('th');
      if (numinfo[0] == undefined || numinfo[1] == undefined)
        return; // for some reason no line numbers???

      // parsing out the table data (edit/delete)
      var allinfo, info, status, content;
      allinfo = x.getElementsByTagName('td');
      if (allinfo[0] == undefined)
        return; // empty tags???

      // building up the line data information
      linedata.oldnum = numinfo[0].innerHTML;
      linedata.newnum = numinfo[1].innerHTML;
      linedata.status = allinfo[0].getAttribute('class');
      linedata.content = clean(allinfo[0].innerHTML);
      return linedata;

    }).filter(function denull(l){ // remove any empty rows
      return l != undefined;
    });
  },

});

Template.diff.events({

  "click .reset": function(e) {
    var trulyReset = confirm("This will reset this file back to the last commit. Proceed?");
    if (trulyReset)
      Meteor.call("resetFile", this.id);
  }

});

Template.diffline.helpers({

  content: function() {
    return this.content;
  },

  skipped: function() {
    return this.status == 'skip'
  },

  equal: function() {
    return this.status == 'equal'
  },

  inserted: function() {
    return this.status == 'insert'
  },

  deleted: function() {
    return this.status == 'delete'
  },

  newnum: function() {
    var num = this.newnum;
    if (num > 0)
      return num
    else
      return '-'
  },

  oldnum: function() {
    var num = this.newnum;
    if (num > 0)
      return num
    else
      return '-'
  },

});
