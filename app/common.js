// data publishing

this.Messages = new Meteor.Collection("messages");
this.Files = new Meteor.Collection("files");

// routing

Router.configure({
  layoutTemplate: 'main'
});

Router.map(function () {

  this.route('main', {
    path: '/',
  });

  this.route('about');

  this.route('articles', {
    // articles now under `articleList` instead of `this`
    data: {
      articleList: function () {return Articles.find()},
      selectedArticle: {}
    }
  });

  this.route('article', {
    path: '/article/:_id',
    // provide data for both `articleList` and `selectedArticle`
    data: function () {
      return {
        articleList: Articles.find(),
        selectedArticle: Articles.findOne({_id: this.params._id})
      }
    },
    template: 'articles'  //change template target
  });

});
