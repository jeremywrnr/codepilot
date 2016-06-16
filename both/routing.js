// routing for GitSync

Router.configure({ layoutTemplate: "main" });

Router.route("/", function() {
  this.render("code");
});

Router.map(function() {
  this.route("code");
  this.route("test");
  this.route("save");
  this.route("login");
  this.route("config");
  this.route("raw", { layoutTemplate: "null" });
  this.route("renderer", { layoutTemplate: "null" });
});

// rendering python tutor image

Router.route("pyt/:_lang/:_code", {
  layoutTemplate: "null",
  action: function() {
    this.render("pyt", { data: {
      code: encodeURIComponent(this.params._code),
      lang: this.params._lang,
    }})
  }
});

// accepting screenshots at the feedback url
// curl --data "lat=12&lon=14" http://localhost:3000/feedback

Router.route("feedback", {
  path: "/feedback/",
  where: "server",
  action: function addIssue() {
    var issue = JSON.parse( this.request.body.feedback );
    if(Meteor.users.findOne(issue.user)) // dont take junk
      Meteor.call("addIssue", issue);
    this.response.statusCode = 201;
    this.response.setHeader("Content-Type", "application/json");
    this.response.end("{status: 'added'");
  }
});

// serving feedback images and rendered pages, from id

Router.route("screenshot/:_id", { // serve feedback images
  name: "screenshot",
  layoutTemplate: "null",
  onBeforeAction: null,
  action: function viewScreen() {
    var img = Screens.findOne(this.params._id);
    this.render("screenshot", {data: img});
  }
});


// ask user to login before coding, only on client

if(Meteor.isClient) {
  Router.onBeforeAction(function preLogin() {
    if (! Meteor.userId() || Meteor.loggingIn())
      this.render("login");
    else
      this.next();
  }, { // but allow anybody to check issue imgs
    except: ["login", "screenshot", "rendered"]
  });
}

