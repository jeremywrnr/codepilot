// routing for GitSync

import { FlowRouter } from "meteor/ostrio:flow-router-extra";

// pages inside the main layout (which handles login itself)
FlowRouter.route("/", {
  name: "home",
  action() { this.render("main", "code"); }
});

["code", "test", "save", "login", "config"].forEach(name => {
  FlowRouter.route(`/${name}`, {
    name,
    action() { this.render("main", name); }
  });
});

// bare pages (no layout), ask user to login first
["raw", "renderer", "interactJs", "interactPy", "interactRuby"].forEach(name => {
  FlowRouter.route(`/${name}`, {
    name,
    action() { this.render("null", "authed"); }
  });
});

// serving feedback images, open to anybody
FlowRouter.route("/screenshot/:_id", {
  name: "screenshot",
  waitOn() { return Meteor.subscribe("screens"); },
  data(params) { return Screens.findOne(params._id); },
  action(params, qs, img) { this.render("null", "screenshot", img); }
});

Template.authed.helpers({
  page() { return FlowRouter.getRouteName(); }
});
