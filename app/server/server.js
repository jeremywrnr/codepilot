Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('files', function() {
  return Files.find();
});

Meteor.methods({

  deleteFile: function(id) {
    Files.remove(id);
    ShareJS.model["delete"](id);
  }

});

Meteor.startup(function () {
  //if (! Articles.findOne()){
    //var articles = [
      //{title: 'Article 1', body: 'This is article 1'},
      //{title: 'Article 2', body: 'This is article 2'},
      //{title: 'Article 3', body: 'This is article 3'}
    //];
    //articles.forEach(function (article) {
      //Articles.insert(article);
    //})
  //}
});
