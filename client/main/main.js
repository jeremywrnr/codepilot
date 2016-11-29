// default session settings

Session.setDefault("feedCount", 0);
Session.setDefault("document", null);
Session.setDefault("focusPane", null);
Session.setDefault("hideClosedIssues", true);

// todo move these to repo level
Session.setDefault("testViz", true);
Session.setDefault("testWeb", false);
Session.setDefault("testFile", null);

// checking which firebase to use
Meteor.call("firebase", (err, res) => {
  if (!err) Session.set("fb", res)
});



// startup data subscriptions

const prof = GitSync.prof;

Meteor.subscribe("screens");
Tracker.autorun(() => { // subscribe on login
  if (Meteor.user()) {
    Meteor.subscribe("repos", Meteor.userId());
    if (prof().repo) {

      const user = prof(); // get user profile
      Meteor.subscribe("issues", user.repo);
      Meteor.subscribe("messages", user.repo);

      const branch = user.repoBranch; // get branch
      Meteor.subscribe("files", user.repo, branch);
      Meteor.subscribe("commits", user.repo, branch);
    }
  }
});



// global client helper(s)

Template.registerHelper("isPilot", () => { // check if currentUser is pilot
  if (!Meteor.user()) return false; // still logging in or page loading
  return prof().role === "pilot";
});

Template.registerHelper("nulldoc", () => Session.equals("document", null));

Template.registerHelper("nullrepo", () => { // check if currentDoc is null
  if (!Meteor.user()) return false; // still logging in or page loading
  return !prof().repo; // return true when repo is null
});



// navbar config

Template.navigation.helpers({ // uses glyphicons in template
  userHasRepo() { // empty string is default value for repo
    return (Meteor.user() && Meteor.user().profile.repo != "")
  },

  navItems() {
    return [
      { iconpath:"/code", iconname:"pencil",   name:"code" },
      { iconpath:"/test", iconname:"search",   name:"check" },
      { iconpath:"/save", iconname:"list-alt", name:"save" } ] }
});

// bring renderer to the top of the page
Template.renderer.onRendered(() => {
  window.scrollTo(0,0);
});

// login setup

Template.main.helpers({ // check if user has setup repo yet

  userHasRepo() { // empty string is default value for repo
    return (Meteor.user() && Meteor.user().profile.repo != "")
  },

});

Template.userLoggedout.events({
  "click .login"(e) {
    Meteor.loginWithGithub({
      requestPermissions: ["user", "repo"],
      loginStyle: "redirect",
    }, err => {
      if (err)
        Session.set("errorMessage", err.reason);
    });
  }
});

Template.userLoggedin.events({
  "click .logout"(e) {
    Meteor.logout(err => {
      if (err)
        Session.set("errorMessage", err.reason);
    });
  }
});
