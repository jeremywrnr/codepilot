// routing

Router.configure({ layoutTemplate: 'main' });

// asks user to login before coding
/*
 *Router.onBeforeAction(function() {
 *  if (! Meteor.userId()) {
 *    this.render('config');
 *  } else { this.next(); }
 *});
 */

Router.map(function () {
  this.route('code', { path: '/', });
  this.route('test');
  this.route('git')
  this.route('config');
});
