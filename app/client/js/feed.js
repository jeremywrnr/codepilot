// messages and events feed

Template.chatter.events({

  'keydown input#message': function(e) {
    if (e.which === 13) { // 'enter' keycode recieved
      var msg = $('input#message')[0];
      Meteor.call('addMessage', $.trim(msg.value));
      msg.value = ''; // purge the old message
    }
  }

});

Template.messages.helpers({

  messageCount: function() { // count feed items
    return Messages.find({}).count();
  },

  messages: function() { // linkify and return feed items
    return Messages.find(
      {}, {sort: {time: 1}}
    ).map(function linkMessage(msg) { // return linkd
      msg.linkd = linkifyStr(msg.message);
      return msg;
    });
  },

});



Template.ghang.helpers({ // not actually used.. need to make ghangouts app

  reponame: function() { // set topic of the google hangout
    var user = Meteor.user();
    if (user)
      return user.profile.repoOwner + user.profile.repoName;
  },

  collabs: function() { // return emails of all collabs
    var repo = Repos.findOne( Meteor.user().profile.repo );
    if (repo) {
      Meteor.call('getCollabs', repo, function setCollabs(err, users) {
        if (!err)
          Session.set('collabs', users); // get repo collaborators
        else
          console.error(err)
      });
    }
    // aggregate and return the collaborator user emails
    var collabs = Session.get('collabs');
    if(collabs)
      return collabs.map(function inviteHangout(user){ // profile
        return { id : user.email, invite_type : 'EMAIL' };
      }).filter(function removeSelf(user){ // don't invite self
        return user.id != Meteor.user().profile.email;
      });
  }

});

//Template.ghang.events({ 'click #g-hanger': function(e) { console.log('clicked!'); }, });
