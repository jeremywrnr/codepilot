// iframe helper - load content from editor

Template.renderer.helpers({

  getHead: function () { // parse head of html file
    var full = Files.findOne({title: /.*html/}).content;
    var doc = $( '<html></html>' );
    doc.html( full );
    return $('head', doc)[0].innerHTML;
  },

  getBody: function () {
    var full = Files.findOne({title: /.*html/}).content;
    var doc = $( '<html></html>' );
    doc.html( full );
    return $('body', doc)[0].innerHTML;
  },

  getCSS: function () {
    return Files.findOne({title: /.*css/}).content;
  },

  getJS: function () {
    return Files.findOne({title: /.*js/}).content;
  },

});

