// global js functions, preloaded into meteor from lib


GitSync = {
  host: "http://www.git-sync.com/",

  maxFileLength: 15000,

  firebaseSetup: function(dev) {
    var prodFB = "https://project-3627267568762325747.firebaseio.com/"
    var devFB = "https://gitsync-test.firebaseio.com/"
    this.firebase = (dev ? devFB : prodFB)
  },

  any: function(ary, fn) {
    return ary.reduce(function(o, n){
      return o || fn(n)
    }, false);
  },

  all: function(ary, fn) {
    return ary.reduce(function(o, n){
      return o && fn(n)
    }, true);
  },

  prof: function() { // return the current users profile
    var user = Meteor.user();
    if (user) return user.profile;
  },

  userfiles: function() { // return the current b/r files
    var user = GitSync.prof();
    if (user) return Files.find({
      repo: user.repo,
      branch: user.repoBranch
    });
  },

  ufids: function() { // return an array of ids of users files
    return GitSync.userfiles().fetch().map((f) => f._id);
  },

  changes: function() { // content v cache, check if any files changed
    return GitSync.any(
      GitSync.userfiles().fetch(),
      function(file) { return file.content !== file.cache }
    )
  },

  findFileFromExt: function(ext) {
    return Files.findOne({
      title: new RegExp(".*\." + ext, 'i'),
      branch: GitSync.prof().repoBranch,
    });
  },

  focusForm: function(id) { // takes id of form, waits til exists, and focuses
    setInterval(function() {
      if ($(id).length) {
        $(id).focus();
        clearInterval(this);
      } //wait til element exists, focus
    }, 10); // check every 100ms
  },

  grabTagContentsToRender: function(full, tag) { // return parsed html from tag
    var doc = $('<html></html>');
    doc.html( full.content );
    if ($(tag, doc).length > 0)
      return $(tag, doc)[0].innerHTML;
    else
      return "";
  },

  sanitizeStringQuotes: function(str) { // try to avoid breaking srcdoc
    return (str
      .replace(/'/g, '"')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
    );
  },

  sanitizeDiffs: function(str) { // make lts / gts into actual spacing
    return (str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    );
  },

  labelLineNumbers: function(text) { // label a chunk of text with line numbers
    var doc = $('<pre></pre>');
    var full = '<span class="line-number"></span>' + text + '<span class="cl"></span>';
    doc.html( full );
    var num = text.split(/\n/).length;

    for (var i = 0; i < num; i++) // for all lines in the file
      $('span', doc)[0].innerHTML += '<span>' + (i + 1) + '</span>';
    return doc[0].innerHTML;
  },

  linkify: function(str) { // take in string, parse and wrap any links inside
    var domain = /^http.*\.(io|com|web|net|org|gov|edu)(\/.*)?/g

    return str.split(' ').map(function linker(s) { // open in new tab, too
      if (s.match(domain))
        return '<a target="_blank" href="' + s + '">' + s + '</a>'
      else
        return s
    }).join(' ');
  },

  imgcheck: function(title) {
    var image = /\.(gif|jpg|jpeg|tiff|png|bmp|svg|pdf|zip|tar|gz2|rar|bz2|dmg|xz)$/i;

    return title.match(image);
  },

  tutorMap: {
    "ace/mode/javascript": "js",
    "ace/mode/typescript": "ts",
    "ace/mode/ruby": "ruby",
    "ace/mode/java": "java",
    "ace/mode/c_cpp": "cpp",
    "ace/mode/python": "3",
  },

  findFileMode: function(doc) {
      var modelist = ace.require("ace/ext/modelist");
      var file = Files.findOne(doc);
      if (file && modelist)
        return modelist.getModeForPath(file.title).mode;
    },

};

