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

//curl --data "lat=12&lon=14" http://127.0.0.1:3000/receive

Router.route('feedback', {
  path: '/feedback/',
  where: 'server',
  action: function addIssue() {
    var issue = JSON.parse( this.request.body.feedback );
    Meteor.call('addFeedbackIssue', issue);
  }
});

// ask user to login before coding, only on client

if (Meteor.isClient) {

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

}
