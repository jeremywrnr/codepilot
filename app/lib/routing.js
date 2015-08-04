// routing

Router.configure({ layoutTemplate: 'main' });

Router.map(function () {
  this.route('login');
  this.route('code', { path: '/', });
  this.route('test');
  this.route('git');
  this.route('config');
});

// ask user to login before coding

Router.onBeforeAction(function preLogin() {
  if (! Meteor.userId() || Meteor.loggingIn())
    this.render('login');
  else
    this.render();
}, {except: ['login']});

// redirect user to code after login

Router.onBeforeAction(function postLogin() {
  if (Meteor.userId())
    this.render('code');
  else
    this.render();
}, {only: ['login']});
