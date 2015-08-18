// routing

Router.configure({ layoutTemplate: 'main' });

Router.map(function () {
  this.route('login');
  this.route('code', { path: '/', });
  this.route('test');
  this.route('git');
  this.route('config');
  this.route('renderer', {layoutTemplate: 'null' });
  this.route('raw', {layoutTemplate: 'null' });
});



// accepting screenshots at the feedback url
// curl --data "lat=12&lon=14" http://localhost:3000/feedback

Router.route('feedback', {
  path: '/feedback/',
  where: 'server',
  action: function addIssue() {
    var issue = JSON.parse( this.request.body.feedback );
    if(Meteor.users.findOne(issue.user)) // dont take junk
      Meteor.call('addIssue', issue);
  }
});

// serving feedback images, from id

Router.route('screenshot/:_id', {
  name: 'screenshot',
  layoutTemplate: 'null',
  onBeforeAction: null,
  action: function viewScreen() {
    var img = Screens.findOne(this.params._id);
    this.render('screenshot', {data: img});
  }
});



// ask user to login before coding, only on client

Router.onBeforeAction(function preLogin() {
  if (! Meteor.userId() || Meteor.loggingIn()){
    this.layout('login');
    this.render('login');
  }else
    this.next();
}, {except: ['login', 'screenshot']}); // but allow anybody to check issue imgs
