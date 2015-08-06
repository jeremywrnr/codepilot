// routing

Router.configure({ layoutTemplate: 'main' });

Router.map(function () {
  this.route('login');
  this.route('code', { path: '/', });
  this.route('test');
  this.route('git');
  this.route('config');
  this.route('renderer', {layoutTemplate: 'null' });
});

// ask user to login before coding

Router.onBeforeAction(function preLogin() {
  if (! Meteor.userId() || Meteor.loggingIn()){
    this.render('login');
    Router.go('code');
  } else
    this.next();
}, {except: ['renderer']});

// redirect user to code after login

Router.onBeforeAction(function postLogin() {
  if (Meteor.userId())
    this.render('code');
}, {only: ['login']});
