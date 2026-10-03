// routing for GitSync

import { FlowRouter } from "meteor/ostrio:flow-router-extra";

// pages inside the main layout (which handles login itself), and bare pages
// (no layout) that ask the user to login first via the authed template
const pages = {
  code: ["main", "code"], test: ["main", "test"], save: ["main", "save"],
  login: ["main", "login"], config: ["main", "config"],
  raw: ["null", "authed"], renderer: ["null", "authed"],
  interactJs: ["null", "authed"], interactPy: ["null", "authed"],
  interactRuby: ["null", "authed"],
};

FlowRouter.route("/", { name: "home", action() { this.render("main", "code"); } });

Object.entries(pages).forEach(([name, [layout, template]]) => {
  FlowRouter.route(`/${name}`, { name, action() { this.render(layout, template); } });
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
