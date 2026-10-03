// dev mode: log in without github oauth, as a local fake user
// (github api calls go to imports/server/fake-github.js instead)

if (Meteor.settings.public.devMode) {
  console.log("=> dev mode: fake github login + fake github api");

  Accounts.registerLoginHandler("devLogin", async options => {
    if (!options.devLogin) return undefined; // not ours, let others try

    const existing = await Meteor.users.findOneAsync({ "services.github.id": "dev" });
    if (existing) return { userId: existing._id };

    // goes through Accounts.onCreateUser, which fills in the profile
    const userId = await Accounts.insertUserDoc({}, {
      services: { github: { id: "dev", username: "dev", accessToken: "dev-token" } },
    });
    return { userId };
  });
}
