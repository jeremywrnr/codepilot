// configuration page

//Template.settings.helpers({});

Template.settings.events({

  "click .makePilot": function(e) {
    e.preventDefault();
    Meteor.call("setPilot");
  },

  "click .makeCopilot": function(e) {
    e.preventDefault();
    Meteor.call("setCopilot");
  }

});
