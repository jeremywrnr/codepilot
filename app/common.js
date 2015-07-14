// data publishing

this.Messages = new Meteor.Collection('messages');
this.Files = new Meteor.Collection('files');

// routing

Router.configure({ layoutTemplate: 'main' });

// asks user to login before coding
Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('settings');
  } else { this.next(); }
});

Router.map(function () {
  this.route('code', { path: '/', });
  this.route('tests');
  this.route('git')
  this.route('settings');
});
