// git things - version control, importing code

var prof = Meteor.g.prof;
var ufiles = Meteor.g.userfiles;
var focusForm = Meteor.g.focusForm;
var labelLineNumbers = Meteor.g.labelLineNumbers;

// do a javascript diff
var diffUsingJS = function(file) {
  if (file.content === file.cache) return; // nodiff
  var byId = function (id) { return document.getElementById(id); },
    base = difflib.stringAsLines( file.cache ),
    newtxt = difflib.stringAsLines( file.content ),
    sm = new difflib.SequenceMatcher(base, newtxt),
    opcodes = sm.get_opcodes(),
    diffoutputdiv = byId(file._id),
    contextSize = 10;

  diffoutputdiv.innerHTML = "";

  diffoutputdiv.appendChild(diffview.buildView({
    baseTextLines: base,
    newTextLines: newtxt,
    opcodes: opcodes,
    baseTextName: "base",
    newTextName: "new",
    contextSize: contextSize,
    // 0 for side by side
    // 1 for inline diff
    viewType: 0,
  }));
};


Template.commitPanel.helpers({

  branch: function() {
    return prof().repoBranch;
  },

  committing: function() {
    return Session.equals('focusPane', 'committer');
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
    if (msg == null || msg == '') return false;
    Session.set('committing', null);
    Meteor.call('newCommit', msg);
  },

  'click .cancelCommit': function(e) {
    Session.set('focusPane', null);
  },

  'click .refresh': function(e) { // pull in latest commits from gh
    Meteor.call('initCommits');
  },

  'click .loadhead': function(e) { // load head of branch into SJS
    var trulyLoad = confirm("This will overwrite any uncommited changes. Proceed?");
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
    var trulyLoad = confirm("This will overwrite any uncommited changes. Proceed?");
    if (trulyLoad)
      Meteor.call('loadCommit', this.commit.sha);
  },

});

Template.diff.helpers({

  renderDiff: function() {
    if (this.content === this.cache)
      return; // nodiff

    //var byid = function (id) { return this.$('#'+id); },
      //base = difflib.stringaslines( this.cache ),
      //newtxt = difflib.stringaslines( this.content ),
      //sm = new difflib.sequencematcher(base, newtxt),
      //opcodes = sm.get_opcodes(),
      //diffoutputdiv = byid(this.id),
      //contextsize = 10;

    //console.log(diffoutputdiv);
    //diffoutputdiv.innerhtml = "";

    //diffoutputdiv[0].appendchild(diffview.buildview({
      //basetextlines: base,
      //newtextlines: newtxt,
      //opcodes: opcodes,
      //basetextname: "base",
      //newtextname: "new",
      //contextsize: contextsize,
      //// 0 for side by side
      //// 1 for inline diff
      //viewtype: 0,
    //}));
  },

});

Template.diff.events({

  'click .reset': function(e) {
    var trulyReset = confirm("This will reset this file back to the last commit. Proceed?");
    if (trulyReset)
      Meteor.call('resetFile', this.id);
  }

});
