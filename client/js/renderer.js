// update all file contents, refreshing the tester frame

var getAllShareJS = function() { // in server-methods
    Meteor.call('getAllShareJS', function(){
      console.log('tester reload complete!')
    });
};

Template.tester.events({

  'click .reload': function () {
    getAllShareJS();
  },

});

Template.renderPanel.events({

  'click .reload': function () {
    getAllShareJS();
  },

});
