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
    this.response.statusCode = 201;
    this.response.setHeader("Content-Type", "application/json");
    this.response.end('{status: "added"');
  }
});

// serving feedback images and rendered pages, from id

Router.route('screenshot/:_id', { // serve feedback images
  name: 'screenshot',
  layoutTemplate: 'null',
  onBeforeAction: null,
  action: function viewScreen() {
    var img = Screens.findOne(this.params._id);
    this.render('screenshot', {data: img});
  }
});

Router.route('render/:_id', { // serve live version of site
  name: 'render',
  layoutTemplate: 'null',
  onBeforeAction: null,
  action: function viewIssue() {
    var issue = Issues.findOne(this.params._id);
    this.render('render', {data: issue});
  }
});



// ask user to login before coding, only on client

if(Meteor.isClient){
  Router.onBeforeAction(function preLogin() {
    if (! Meteor.userId() || Meteor.loggingIn()){
      this.render('login');
    }else
      this.next();
  }, { // but allow anybody to check issue imgs
    except: ['login', 'screenshot', 'rendered']
  });
}
