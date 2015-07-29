// configuration page

Template.settings.helpers({

  repos: function(){
    return Repos.find();
  }

});

Template.settings.events({

  "click .makePilot": function(e) {
    e.preventDefault();
    Meteor.call("setPilot");
  },

  "click .makeCopilot": function(e) {
    e.preventDefault();
    Meteor.call("setCopilot");
  },

  "click .loadRepos": function(e) {
    e.preventDefault();
    Meteor.call("getAllRepos");
  }

});
