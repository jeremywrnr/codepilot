// global js functions, preloaded into meteor from lib

var domain = /^http.*\.(io|com|web|net|org|gov|edu)(\/.*)?/g

Codepilot = {
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
    var user = Codepilot.prof();
    if (user) return Files.find({
      repo: user.repo,
      branch: user.repoBranch
    });
  },

  changes: function() { // content v cache, check if any files changed
    return Codepilot.any(
      Codepilot.userfiles().fetch(),
      function(file) { return file.content !== file.cache }
    )
  },

  findFileFromExt: function(ext) {
    return Files.findOne({
      title: new RegExp(".*\." + ext, 'i'),
      branch: Codepilot.prof().repoBranch,
    });
  },

  focusForm: function(id) { // takes id of form, waits til exists, and focuses
    setInterval(function() {
      if ($(id).length) {
        $(id).focus();
        clearInterval(this);
      } //wait til element exists, focus
    }, 100); // check every 100ms
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
    for (var i = 0; i < num; i++) { // for all lines in the file
      var line_num = $('span', doc)[0];
      line_num.innerHTML += '<span>' + (i + 1) + '</span>';
    }
    return doc[0].innerHTML;
  },

  linkify: function(str) { // take in string, parse and wrap any links inside
    return str.split(' ').map(function linker(s) { // open in new tab, too
      if (s.match(domain))
        return '<a target="_blank" href="' + s + '">' + s + '</a>'
      else
        return s
    }).join(' ');
  },
};

