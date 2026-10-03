// default session settings
Session.setDefault("feedCount", 0);
Session.setDefault("document", null);
Session.setDefault("focusPane", null);
Session.setDefault("hideClosedIssues", true);

// todo move these to repo level
Session.setDefault("testViz", true);
Session.setDefault("testInt", false);
Session.setDefault("testWeb", false);
Session.setDefault("testFile", null);

// firebase realtime db backs firepad (see settings.example.json)
// without an apiKey, files are edited straight from mongo (see FirepadAPI)
if (FirepadAPI.enabled)
  firebase.initializeApp(Meteor.settings.public.firebase);



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
      Meteor.subscribe("commits", user.repo, branch);

      // TODO get files just that are in this commit (how...)
      // probably in files include a title unique marker and then have a dict
      // with key values of commit ids and two sub fields - cached and content
      Meteor.subscribe("files", user.repo, branch);
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
      { iconpath:"/save", iconname:"list-alt", name:"commit" } ] }
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

  loadingRepo() {
    return Session.get("loadingRepo")
  },

});

Template.userLoggedout.helpers({
  devMode() { return Meteor.settings.public.devMode; },
});

Template.userLoggedout.events({
  "click .login"(e) {
    e.preventDefault();
    if (Meteor.settings.public.devMode) // see server/devmode.js
      return Accounts.callLoginMethod({ methodArguments: [{ devLogin: true }] });

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
