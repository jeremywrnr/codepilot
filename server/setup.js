// data publishing
Meteor.publish("repos", userId => Repos.find({users: userId}));

Meteor.publish("commits", (repoId, branch) => Commits.find({repo: repoId, branch}));

Meteor.publish("files", (repoId, branch) => Files.find({repo: repoId, branch}));

Meteor.publish("messages", repoId => Messages.find({repo: repoId},
  {sort: {time: -1}, limit: 50}));

Meteor.publish("issues", repoId => Issues.find({repo: repoId}));

Meteor.publish("screens", () => Screens.find({}));


// github oauth config, from settings.json (see settings.example.json)

Meteor.startup(async () => {
  if (Meteor.settings.public.devMode) return; // see server/devmode.js
  const { github } = Meteor.settings;
  if (!github || !github.clientId || !github.secret)
    throw new Error("missing github oauth keys - run with --settings settings.json");

  await ServiceConfiguration.configurations.upsertAsync(
    { service: "github" },
    { $set: { clientId: github.clientId, secret: github.secret, loginStyle: "redirect" } }
  );
});
