// iframe helper - load content from editor

var findFile = function(ext) { // get file from ext
  return Files.findOne({
    title: new RegExp(".*\." + ext, 'i'),
    branch: prof().repoBranch,
  });
}

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
      return grabTagContentsToRender(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = findFile('html');
    if (full)
      return grabTagContentsToRender(full, 'body');
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
      return sanitizeStringQuotes(full.content);
  },

  cssString: function () {
    var css = findFile('css');
    if (css)
      return sanitizeStringQuotes(css.content);
  },

  jsString: function () {
    var js = findFile('js');
    if (js)
      return sanitizeStringQuotes(js.content);
  },

});





// iframe helper - load content from an issue

Template.rawIssue.helpers({

  getHead: function () { // parse head of html file
    var full = findFile('html');
    if (full)
      return grabTagContentsToRender(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = findFile('html');
    if (full)
      return grabTagContentsToRender(full, 'body');
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
