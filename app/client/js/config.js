// configuration page

Template.settings.helpers({

  isPilot: function() {
    return Meteor.user().profile.role == "pilot";
  },

});

Template.settings.events({

  "click #makePilot": function(e) {
    e.preventDefault();
    Meteor.call("setPilot");
  },

  "click #makeCopilot": function(e) {
    e.preventDefault();
    Meteor.call("setCopilot");
  }

});
