// iframe helper - load content from editor
//var findFile = function(type) {} // helper for helpers

Template.raw.helpers({

  getUser: function () { // return id of project repo
    if (Meteor.user())
      return Meteor.user()._id;
  },

  getRepo: function () { // return id of project repo
    if (Meteor.user())
      return Meteor.user().profile.repo;
  },

  getHead: function () { // parse head of html file
    var full = Files.findOne({
      title: /.*html/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (full)
      return grabTagContentsToRender(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = Files.findOne({
      title: /.*html/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (full)
      return grabTagContentsToRender(full, 'body');
  },

  getCSS: function () {
    var css = Files.findOne({
      title: /.*css/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (css)
      return css.content;
  },

  getJS: function () {
    var js = Files.findOne({
      title: /.*js/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (js)
      return js.content;
  },

  htmlString: function () { // for attaching relevant content to issue
    var full = Files.findOne({title: /.*html/i});
    if (full) return sanitizeStringQuotes(full.content);
  },

  cssString: function () {
    var css = Files.findOne({title: /.*css/i});
    if (css) return sanitizeStringQuotes(css.content);
  },

  jsString: function () {
    var js = Files.findOne({title: /.*js/i});
    if (js) return sanitizeStringQuotes(js.content);
  },

});





// iframe helper - load content from an issue

Template.rawIssue.helpers({

  getHead: function () { // parse head of html file
    var full = Files.findOne({
      title: /.*html/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (full)
      return grabTagContentsToRender(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = Files.findOne({
      title: /.*html/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (full)
      return grabTagContentsToRender(full, 'body');
  },

  getCSS: function () {
    var css = Files.findOne({
      title: /.*css/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (css)
      return css.content;
  },

  getJS: function () {
    var js = Files.findOne({
      title: /.*js/i,
      branch: Meteor.user().profile.repoBranch,
    });
    if (js)
      return js.content;
  },

});
