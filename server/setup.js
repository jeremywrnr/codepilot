// global helper functions
prof = () => { // return the current users profile
  const user = Meteor.user();
  if (user) return user.profile;
}

files = () => { // return the current b/r files
  const user = Meteor.user();
  if (user) return Files.find({
    repo: user.repo,
    branch: user.repoBranch
  });
}


// debugging tools
debug = true;
dlog = msg => { if (debug) console.log(msg) }
asrt = (a, b) => { if (debug && a !== b)
  throw(`Error: ${a} != ${b}`) }


// data publishing
Meteor.publish("repos", userId => Repos.find({users: userId}));

Meteor.publish("commits", (repoId, branch) => Commits.find({repo: repoId, branch}));

Meteor.publish("files", (repoId, branch) => Files.find({repo: repoId, branch}));

Meteor.publish("messages", repoId => Messages.find({repo: repoId},
  {sort: {time: -1}, limit: 50}));

Meteor.publish("issues", repoId => Issues.find({repo: repoId}));

Meteor.publish("screens", () => Screens.find({}));


// github auth & config

const inDevelopment = process.env.NODE_ENV === "development";

FirepadAPI.setup(inDevelopment); // setup firebase link

Meteor.startup(() => { // get correct github auth key
  ServiceConfiguration.configurations.remove({service: "github"});
  const prodAuth = JSON.parse(Assets.getText("production.json"));
  const devAuth = JSON.parse(Assets.getText("development.json"));
  const GHAuth = (inDevelopment ? devAuth : prodAuth);
  ServiceConfiguration.configurations.insert(GHAuth);

  // node-github setup
  github = new GitHub({
    timeout: 5000,
    version: "3.0.0",
    protocol: "https",
    debug, // boolean declared above
    headers: { "User-Agent": "code pilot" }
  });

  // oauth for api 5000/hour
  github.authenticate({
    type: "oauth",
    key: GHAuth.clientId,
    secret: GHAuth.secret
  });
});

