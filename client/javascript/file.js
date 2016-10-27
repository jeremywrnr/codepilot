// file feed helpers

const newFile = e => {
  e.preventDefault();
  Meteor.call("newFile", (err, id) => {
    Session.set("document", id);
  });
};

Template.filelist.events({
  "click .new"(e) { newFile(e); }
});

Template.userfiles.helpers({
  files() {
    return Files.find({}, {sort: {"title": 1}} )
  }
});

Template.userfiles.events({
  "click .new"(e) { newFile(e); }
});



// individual files

Template.fileitem.helpers({

  current() {
    return Session.equals("document", this._id);
  }

});

Template.fileitem.events({

  "click .file"() {
    //if (!Session.equals("document", this._id))
      //Meteor.call("addMessage", "opened file " + this.title);
    Session.set("firepadRef", Session.get("fb") + this._id);
    Session.set("document", this._id);
  },

});
