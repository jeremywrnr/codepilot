// configuration page

Template.settings.helpers({

  repos: function(){
    return Repos.find({}, {sort: {"repo.owner": -1, "repo.name": -1}} );
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

Template.repo.events = {

  "click .repo": function(e) {
    Meteor.call("setRepo", this);
  }

};

