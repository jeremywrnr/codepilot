// global client functions

focusForm = function(id) { // takes id of form, waits til exists, and focuses
  setInterval(function() {
    if ($(id).length) {
      $(id).focus();
      clearInterval(this);
    } //wait til element exists, focus
  }, 100); // check every 100ms
};

grabTagContentsToRender = function(full, tag) { // return parsed html from tag
  var doc = $('<html></html>');
  doc.html( full.content );
  return $(tag, doc)[0].innerHTML;
}

sanitizeStringQuotes = function(str) { // try to avoid breaking srcdoc
  //return str.replace(/"/g, '&quot;').replace(/'/g, '&quot;');
  return (str
          .replace(/'/g, '"')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
         );
}

labelLineNumbers = function(text) {
  var doc = $('<pre></pre>');
  var full = '<span class="line-number"></span>' + text + '<span class="cl"></span>';
  doc.html( full );
  var num = text.split(/\n/).length;
  for (var i = 0; i < num; i++) { // for all lines in the file
    var line_num = $('span', doc)[0];
    line_num.innerHTML += '<span>' + (i + 1) + '</span>';
  }
  return doc[0].innerHTML;
}
