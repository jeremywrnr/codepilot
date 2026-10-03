import { contextFor, ghContext } from "/imports/server/github";

const hoster = Meteor.absoluteUrl();

// takes feedback issue, creates GH issue as the user who sent the feedback
// (not a method - the feedback iframe has no Meteor.user() scope)
const postIssue = async issue => {
  const { gh, target } = contextFor(await Meteor.users.findOneAsync(issue.user));
  return gh("POST /repos/{owner}/{repo}/issues", {
    ...target,
    title: issue.note,
    body: issue.body,
    labels: ["bug", "GitSync"]
  }); // githubs issue response
};

// adds a feedback issue to github (called from the /feedback/ route)
export const addIssue = async feedback => {
  // save screen, attach screenshot id to this issue
  feedback.imglink = await Screens.insertAsync({img: feedback.img});
  delete feedback.img; // delete redundant png

  // insert a dummy issue to get id, use later in GH issue body txt
  const issueId = await Issues.insertAsync({issue: null});

  // construct and append the text of the github issue, including links to screenshot and demo
  const imglink = `[issue screenshot](${hoster}screenshot/${feedback.imglink})\n`;
  const livelink = `[live code here](${hoster}render/${issueId})\n`;
  const htmllink = `html:\n\`\`\`html\n${feedback.html}\n\`\`\`\n`;
  const csslink = `css:\n\`\`\`css\n${feedback.css}\n\`\`\`\n`;
  const jslink = `js:\n\`\`\`js\n${feedback.js}\n\`\`\`\n`;
  const loglink = `console log:\n\`\`\`\n${feedback.log}\`\`\`\n`;
  feedback.body = imglink + livelink + htmllink + csslink + jslink + loglink;

  // post the issue to github, and get the GH generated content
  const issue = await postIssue(feedback);

  // replace the dummy with the complete issue, and add it to the feed
  await Issues.updateAsync(issueId, { // no modifier, so this replaces
    ghid: issue.id, // (from github)
    repo: feedback.repo, // attach repo forming data
    feedback, // attach feedback issue data
    issue // returned from github call
  });
  await Meteor.callAsync(
    "addUserMessage",
    feedback.user,
    `opened issue - ${feedback.note}`
  );
};

Meteor.methods({

  ///////////////////
  // ISSUE MANAGEMENT
  ///////////////////

  async initIssues() { // re-populating git repo issues
    const { prof } = await ghContext();
    const repo = await Repos.findOneAsync(prof.repo);
    if (repo) {
      const issues = await Meteor.callAsync("getAllIssues", repo);
      await Promise.all(issues.map(issue => Issues.upsertAsync({
        repo: repo._id,
        ghid: issue.id // (from github)
      },{
        $set: {issue},
      })));
    }
  },

  async closeIssue(issue) { // close an issue on github by number
    const { gh, target } = await ghContext();
    await Meteor.callAsync("addMessage", `closed issue - ${issue.issue.title}`);
    await gh("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      ...target,
      issue_number: issue.issue.number,
      state: "closed"
    });

    await Issues.removeAsync(issue._id); // remove from the local database
  },

});
