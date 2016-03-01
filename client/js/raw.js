// iframe helper - load content from editor

var prof = Codepilot.prof;
var clean = Codepilot.sanitizeStringQuotes;
var getTag = Codepilot.grabTagContentsToRender;
var findFile = Codepilot.findFileFromExt;

Template.raw.helpers({
  getUser: function () { // return id of current user
    if (Meteor.user())
      return Meteor.userId();
  },

  getRepo: function () { // return id of project repo
    if (Meteor.user())
      return prof().repo;
  },

  getHead: function () { // parse head of html file
    var full = findFile('html');
    if (full)
      return getTag(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = findFile('html');
    if (full)
      return getTag(full, 'body');
  },

  getCSS: function () {
    var css = findFile('css');
    if (css)
      return css.content;
  },

  getJS: function () {
    var js = findFile('js');
    if (js)
      return js.content;
  },

  htmlString: function () { // for attaching content to issue
    var full = findFile('html');
    if (full)
      return clean(full.content);
  },

  cssString: function () {
    var css = findFile('css');
    if (css)
      return clean(css.content);
  },

  jsString: function () {
    var js = findFile('js');
    if (js)
      return clean(js.content);
  },
});


// iframe helper - load content from an issue
// TODO: load code from issue.feedback instead!

Template.rawIssue.helpers({
  getHead: function () { // parse head of html file
    var full = findFile('html');
    if (full)
      return getTag(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = findFile('html');
    if (full)
      return getTag(full, 'body');
  },

  getCSS: function () {
    var css = findFile('css');
    if (css)
      return css.content;
  },

  getJS: function () {
    var js = findFile('js');
    if (js)
      return js.content;
  },
});

