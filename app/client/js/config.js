// configuration page

Template.settings.helpers({

  repos: function(){
    return Repos.find({}, {sort: {"repo.owner": -1, "repo.name": -1}} );
  },

  branches: function(){
    return Branches.find({}, {sort: {"branch.name": -1}} );
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

  "click .loadGHData": function(e) {
    e.preventDefault();
    Meteor.call("getAllRepos");
    Meteor.call("getAllBranches");
  }

});

Template.repo.events({

  "click .repo": function(e) {
    Meteor.call("setRepo", this);
  }

});

Template.branch.events({

  "click .branch": function(e) {
    Meteor.call("setBranch", this.branch.name);
  }

});
