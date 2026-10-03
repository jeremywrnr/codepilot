// common (server and client) github methods
// see server/repos.js for the ones that talk to github

Meteor.methods({

  //////////////////
  // REPO MANAGEMENT
  //////////////////

  async updateRepo() { // update when repo was last updated
    return await Meteor.users.updateAsync(
      {"_id": Meteor.userId()},
      {$set : {
        "profile.lastUpdated": new Date(),
      }});
  },

  async setRepo(gr) { // set git repo & default branch
    return await Meteor.users.updateAsync(
      {"_id": Meteor.userId()},
      {$set : {
        "profile.repo": gr._id,
        "profile.repoName": gr.repo.name,
        "profile.repoOwner": gr.repo.owner.login,
        "profile.repoBranch": gr.repo.default_branch
      }});
  },

  async setBranch(bn) { // set branch name
    return await Meteor.users.updateAsync(
      {"_id": Meteor.userId()},
      {$set : {
        "profile.repoBranch": bn,
      }});
  },
});
