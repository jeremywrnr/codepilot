// data publishing

Files = new Mongo.Collection('files'); // used with github
Docs = new Meteor.Collection('docs'); // used inside sjs

Messages = new Mongo.Collection('messages');
Commits = new Mongo.Collection('commits');
Repos = new Mongo.Collection('repos');
Tasks = new Mongo.Collection('tasks');
