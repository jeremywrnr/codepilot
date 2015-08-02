// meteor mongo data publishing

Files = new Mongo.Collection('files'); // used with github

/* _id - unique identifier
   repo - unique identifier of repo file belongs to
   title - name of the file
   content - content of the file
   */

Docs = new Meteor.Collection('docs'); // used inside sjs

/* _id - unique identifier, corresponds to File._id
   data.v - latest version of file in the editor
   data.snapshot - latest content of file in the editor
NOTE: some fields omitted
*/

Messages = new Mongo.Collection('messages'); // client side feed

/* _id - unique identifier of message
   repo - unique identifier of repo file belongs to
   name - login name of message creator
   message - feed item content
   time - message creation time
   */

Commits = new Mongo.Collection('commits');

/* _id - unique identifier of commit
   repo - unique identifier of repo file belongs to
   sha - git hash code for this commit
   */

// TODO: TRIM THIS DOCUMENT!!!

//commit:
//{ author:
//{ name: 'Jeremy Warner',
//email: 'jeremywrnr@gmail.com',
//date: '2015-07-23T02:40:56Z' },
//committer:
//{ name: 'Jeremy Warner',
//email: 'jeremywrnr@gmail.com',
//date: '2015-07-23T02:40:56Z' },
//message: 'hard code files',
//tree:
//{ sha: '92566d8546b91a700cf888f400f15c82a6a44288',
//url: 'https://api.github.com/repos/jeremywrnr/testing/git/trees/92566d8546b91a700cf888f400f15c82a6a44288' },
//url: 'https://api.github.com/repos/jeremywrnr/testing/git/commits/ad131a2d76818b1320d1e68eed826f3ccd3af44e',
//comment_count: 0 },
//url: 'https://api.github.com/repos/jeremywrnr/testing/commits/ad131a2d76818b1320d1e68eed826f3ccd3af44e',
//html_url: 'https://github.com/jeremywrnr/testing/commit/ad131a2d76818b1320d1e68eed826f3ccd3af44e',
//comments_url: 'https://api.github.com/repos/jeremywrnr/testing/commits/ad131a2d76818b1320d1e68eed826f3ccd3af44e/comments',
//author:
//{ login: 'jeremywrnr',
//id: 4837429,
//avatar_url: 'https://avatars.githubusercontent.com/u/4837429?v=3',
//gravatar_id: '',
//url: 'https://api.github.com/users/jeremywrnr',
//html_url: 'https://github.com/jeremywrnr',
//followers_url: 'https://api.github.com/users/jeremywrnr/followers',
//following_url: 'https://api.github.com/users/jeremywrnr/following{/other_user}',
//gists_url: 'https://api.github.com/users/jeremywrnr/gists{/gist_id}',
//starred_url: 'https://api.github.com/users/jeremywrnr/starred{/owner}{/repo}',
//subscriptions_url: 'https://api.github.com/users/jeremywrnr/subscriptions',
//organizations_url: 'https://api.github.com/users/jeremywrnr/orgs',
//repos_url: 'https://api.github.com/users/jeremywrnr/repos',
//events_url: 'https://api.github.com/users/jeremywrnr/events{/privacy}',
//received_events_url: 'https://api.github.com/users/jeremywrnr/received_events',
//type: 'User',
//site_admin: false },
//committer:
//{ login: 'jeremywrnr',
//id: 4837429,
//avatar_url: 'https://avatars.githubusercontent.com/u/4837429?v=3',
//gravatar_id: '',
//url: 'https://api.github.com/users/jeremywrnr',
//html_url: 'https://github.com/jeremywrnr',
//followers_url: 'https://api.github.com/users/jeremywrnr/followers',
//following_url: 'https://api.github.com/users/jeremywrnr/following{/other_user}',
//gists_url: 'https://api.github.com/users/jeremywrnr/gists{/gist_id}',
//starred_url: 'https://api.github.com/users/jeremywrnr/starred{/owner}{/repo}',
//subscriptions_url: 'https://api.github.com/users/jeremywrnr/subscriptions',
//organizations_url: 'https://api.github.com/users/jeremywrnr/orgs',
//repos_url: 'https://api.github.com/users/jeremywrnr/repos',
//events_url: 'https://api.github.com/users/jeremywrnr/events{/privacy}',
//received_events_url: 'https://api.github.com/users/jeremywrnr/received_events',
//type: 'User',
//site_admin: false },
//parents:
//[ { sha: 'da5d2f84577c08f22510656d9341f3deaeee5d3e',
//url: 'https://api.github.com/repos/jeremywrnr/testing/commits/da5d2f84577c08f22510656d9341f3deaeee5d3e',
//html_url: 'https://github.com/jeremywrnr/testing/commit/da5d2f84577c08f22510656d9341f3deaeee5d3e' } ] }

Repos = new Mongo.Collection('repos');
Tasks = new Mongo.Collection('tasks');
