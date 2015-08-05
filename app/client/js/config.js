// configuration page

Template.config.helpers({

  repos: function(){
    return Repos.find({}, {sort: {'repo.owner': -1, 'repo.name': 1}} );
  },

  branches: function(){ // if there are branches, give them
    if(Repos.findOne(Meteor.user().profile.repo).branches)
      return Repos.find(
        {_id: Meteor.user().profile.repo},
        {fields: {branches: 1}}
      ).fetch()[0].branches;
      else return [];
  }

});

Template.config.events({

  'click .makePilot': function(e) {
    e.preventDefault();
    Meteor.call('setPilot');
  },

  'click .makeCopilot': function(e) {
    e.preventDefault();
    Meteor.call('setCopilot');
  },

  'click .loadGHData': function(e) {
    e.preventDefault();
    Meteor.call('getAllRepos');
  }

});

Template.repo.events({

  'click .repo': function(e) {
    Meteor.call('setRepo', this); // set the active project / repo
    Meteor.call('getBranches', this); // get all the possible branches
    Meteor.call('initCommits'); // pull commit history for this repo
  }

});

Template.branch.events({

  'click .branch': function(e) {
    Meteor.call('setBranch', this.name);
  }

});
