// configuration page

Template.settings.helpers({
  currentRole: function(){
    return Meteor.user().profile.role;
  }
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
