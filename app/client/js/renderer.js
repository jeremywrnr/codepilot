// update all file contents, refreshing the tester frame

Template.renderPanel.events({

  'click .reload': function () {
    Meteor.call('testShareJS');
  },

});

// iframe helper - load content from editor

Template.renderer.helpers({

  getHead: function () { // parse head of html file
    var full = Files.findOne({title: /.*html/i});
    if (full) return grabTagContentsToRender(full, 'head');
  },

  getBody: function () { // parse body of file
    var full = Files.findOne({title: /.*html/i});
    if (full) return grabTagContentsToRender(full, 'body');
  },

  getCSS: function () {
    var css = Files.findOne({ title: /.*css/i});
    if (css) return css.content;
  },

  getJS: function () {
    var js = Files.findOne({ title: /.*js/i});
    if (js) return js.content;
  },


});
