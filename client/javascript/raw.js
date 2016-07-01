// iframe helper - load editor content

const prof = GitSync.prof;
const clean = GitSync.sanitizeStringQuotes;
const getTag = GitSync.grabTagContentsToRender;
const findFile = GitSync.findFileFromExt;


Template.raw.helpers({

  getUser() { // return id of current user
    if (Meteor.user())
      return Meteor.userId();
  },

  getRepo() { // return id of project repo
    if (Meteor.user())
      return prof().repo;
  },

  getHead() { // parse head of html file
    const full = findFile("html");
    if (full)
      return getTag(full, "head");
  },

  getBody() { // parse body of file
    const full = findFile("html");
    if (full)
      return getTag(full, "body");
  },

  getCSS() {
    const css = findFile("css");
    if (css)
      return css.content;
  },

  getJS() {
    const js = findFile("js");
    if (js)
      return js.content;
  },

  htmlString() { // for attaching content to issue
    const full = findFile("html");
    if (full)
      return clean(full.content);
  },

  cssString() {
    const css = findFile("css");
    if (css)
      return clean(css.content);
  },

  jsString() {
    const js = findFile("js");
    if (js)
      return clean(js.content);
  },

});

