const ufiles = GitSync.userfiles;
const hoster = GitSync.host;

Meteor.methods({

  ///////////////////
  // ISSUE MANAGEMENT
  ///////////////////

  initIssues() { // re-populating git repo issues
    let repo = Repos.findOne(Meteor.user().profile.repo);
    if (repo) {
      Meteor.call("getAllIssues", repo).map(function load(issue) {
        Issues.upsert({
          repo: repo._id,
          ghid: issue.id // (from github)
        },{
          $set: {issue},
        });
      });
    }
  },

  addIssue(feedback) { // adds a feedback issue to github
    feedback.imglink = Async.runSync(done => { // save screens, give id
      Screens.insert({img: feedback.img}, (err, id) => {
        done(err, id);
      });
    }).result; // attach screenshot to this issue
    delete feedback.img; // delete redundant png

    // insert a dummy issue to get id, use later in GH issue body txt
    let issueId = Async.runSync(done => {
      Issues.insert({issue: null}, (err, id) => {
        done(err, id);
      });
    }).result; // get the id of the newly inserted issue

    // letruct and append the text of the github issue, including links to screenshot and demo
    let imglink = `[issue screenshot](${hoster}screenshot/${feedback.imglink})\n`;
    let livelink = `[live code here](${hoster}render/${issueId})\n`;
    let htmllink = `html:\n\`\`\`html\n${feedback.html}\n\`\`\`\n`;
    let csslink = `css:\n\`\`\`css\n${feedback.css}\n\`\`\`\n`;
    let jslink = `js:\n\`\`\`js\n${feedback.js}\n\`\`\`\n`;
    let loglink = `console log:\n\`\`\`\n${feedback.log}\`\`\`\n`;
    feedback.body = imglink + livelink + htmllink + csslink + jslink + loglink;

    // post the issue to github, and get the GH generated content
    let issue = Meteor.call("postIssue", feedback);
    let ghIssue = { // the entire issue object
      _id: issueId,
      ghid: issue.id, // (from github)
      repo: feedback.repo, // attach repo forming data
      feedback, // attach feedback issue data
      issue // returned from github call
    };

    // insert complete issue, and add it to the feed
    Issues.update(issueId, ghIssue);
    Meteor.call(
      "addUserMessage",
      feedback.user,
      `opened issue - ${feedback.note}`
    );
  },

  closeIssue(issue) { // close an issue on github by number
    Meteor.call("ghAuth");
    Meteor.call("addMessage", `closed issue - ${issue.issue.title}`);
    github.issues.edit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      number: issue.issue.number,
      state: "closed"
    });

    Issues.remove(issue._id); // remove from the local database
  },

});
