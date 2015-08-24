// meteor mongo data publishing

Docs = new Meteor.Collection('docs'); // used inside sharejs (sjs)

/*  _id - unique identifier, corresponds to File._id
    data.v - latest version of file in the editor
    data.snapshot - latest content of file in the editor
    NOTE - some fields omitted
    */

Files = new Mongo.Collection('files'); // used with github

/*  _id - unique identifier, same as Doc._id
    repo - unique identifier of repo file belongs to
    branch - name of the branch it is from
    title - name of the file
    cache - latest version of commit, for diff
    content - live content of the file
    raw - link to raw file content (github)
    src - link to file page on github
    */

Messages = new Mongo.Collection('messages'); // client side feed

/*  _id - unique identifier of message
    repo - unique identifier of repo file belongs to
    name - login name of message creator
    message - feed item content
    time - message creation time
    */

Tasks = new Mongo.Collection('tasks');

/*  _id - unique identifier of task
    text - name of the task, displayed
    repo - unique identifier of repo task belongs to
    time - time of creation of task
    owner - userid of creator
    username - profile.login of creator
    checked - boolean whether done or not
    */

Issues = new Mongo.Collection('issues');

/*  _id - unique identifier of task
    repo - unique identifier of issue ask belongs to
    id - github assigned id issue, also unique
    issue - response from server
    screen - id of the screenshot
    */

Screens = new Mongo.Collection('screens');

/*  _id - unique identifier of commit
    img - img data of screen, base64 encoded
    */

Commits = new Mongo.Collection('commits');

/*  _id - unique identifier of commit
    repo - unique identifier of repo file belongs to
    commit - blob from git// TODO: TRIM THIS DOCUMENT!!!
    */

Repos = new Mongo.Collection('repos'); // PROJECT ID

/*  _id - unique identifier of commit
    sha - git hash code for this commit
    users - array of user ids that can push
    branches - array of branches (see below)
    repo - unique identifier of repo file belongs to
    */

// Branch (inside)
/*  _id - unique identifier of commit
    repo - unique identifier of repo file belongs to
    sha - git hash code for this commit
    */

// repo.repo: TODO TRIM THIS DOCUMENT!!!

//{ _id: 'cRwN6pXzev5wN6B7t',
//user: 'ZGW8J85xAeWLYprXZ',
//repo:
//{ id: 18892802,
//name: 'ECE222Final',
//full_name: 'edsammy/ECE222Final',
//owner:
//{ login: 'edsammy',
//id: 1179387,
//avatar_url: 'https://avatars.githubusercontent.com/u/1179387?v=3',
//gravatar_id: '',
//url: 'https://api.github.com/users/edsammy',
//html_url: 'https://github.com/edsammy',
//followers_url: 'https://api.github.com/users/edsammy/followers',
//following_url: 'https://api.github.com/users/edsammy/following{/other_user}',
//gists_url: 'https://api.github.com/users/edsammy/gists{/gist_id}',
//starred_url: 'https://api.github.com/users/edsammy/starred{/owner}{/repo}',
//subscriptions_url: 'https://api.github.com/users/edsammy/subscriptions',
//organizations_url: 'https://api.github.com/users/edsammy/orgs',
//repos_url: 'https://api.github.com/users/edsammy/repos',
//events_url: 'https://api.github.com/users/edsammy/events{/privacy}',
//received_events_url: 'https://api.github.com/users/edsammy/received_events',
//type: 'User',
//site_admin: false },
//private: false,
//html_url: 'https://github.com/edsammy/ECE222Final',
//description: 'Final project for ECE 222 at the University of Rochester. Checkout pdf for parameters.',
//fork: false,
//url: 'https://api.github.com/repos/edsammy/ECE222Final',
//forks_url: 'https://api.github.com/repos/edsammy/ECE222Final/forks',
//keys_url: 'https://api.github.com/repos/edsammy/ECE222Final/keys{/key_id}',
//collaborators_url: 'https://api.github.com/repos/edsammy/ECE222Final/collaborators{/collaborator}',
//teams_url: 'https://api.github.com/repos/edsammy/ECE222Final/teams',
//hooks_url: 'https://api.github.com/repos/edsammy/ECE222Final/hooks',
//issue_events_url: 'https://api.github.com/repos/edsammy/ECE222Final/issues/events{/number}',
//events_url: 'https://api.github.com/repos/edsammy/ECE222Final/events',
//assignees_url: 'https://api.github.com/repos/edsammy/ECE222Final/assignees{/user}',
//branches_url: 'https://api.github.com/repos/edsammy/ECE222Final/branches{/branch}',
//tags_url: 'https://api.github.com/repos/edsammy/ECE222Final/tags',
//blobs_url: 'https://api.github.com/repos/edsammy/ECE222Final/git/blobs{/sha}',
//git_tags_url: 'https://api.github.com/repos/edsammy/ECE222Final/git/tags{/sha}',
//git_refs_url: 'https://api.github.com/repos/edsammy/ECE222Final/git/refs{/sha}',
//trees_url: 'https://api.github.com/repos/edsammy/ECE222Final/git/trees{/sha}',
//statuses_url: 'https://api.github.com/repos/edsammy/ECE222Final/statuses/{sha}',
//languages_url: 'https://api.github.com/repos/edsammy/ECE222Final/languages',
//stargazers_url: 'https://api.github.com/repos/edsammy/ECE222Final/stargazers',
//contributors_url: 'https://api.github.com/repos/edsammy/ECE222Final/contributors',
//subscribers_url: 'https://api.github.com/repos/edsammy/ECE222Final/subscribers',
//subscription_url: 'https://api.github.com/repos/edsammy/ECE222Final/subscription',
//commits_url: 'https://api.github.com/repos/edsammy/ECE222Final/commits{/sha}',
//git_commits_url: 'https://api.github.com/repos/edsammy/ECE222Final/git/commits{/sha}',
//comments_url: 'https://api.github.com/repos/edsammy/ECE222Final/comments{/number}',
//issue_comment_url: 'https://api.github.com/repos/edsammy/ECE222Final/issues/comments{/number}',
//contents_url: 'https://api.github.com/repos/edsammy/ECE222Final/contents/{+path}',
//compare_url: 'https://api.github.com/repos/edsammy/ECE222Final/compare/{base}...{head}',
//merges_url: 'https://api.github.com/repos/edsammy/ECE222Final/merges',
//archive_url: 'https://api.github.com/repos/edsammy/ECE222Final/{archive_format}{/ref}',
//downloads_url: 'https://api.github.com/repos/edsammy/ECE222Final/downloads',
//issues_url: 'https://api.github.com/repos/edsammy/ECE222Final/issues{/number}',
//pulls_url: 'https://api.github.com/repos/edsammy/ECE222Final/pulls{/number}',
//milestones_url: 'https://api.github.com/repos/edsammy/ECE222Final/milestones{/number}',
//notifications_url: 'https://api.github.com/repos/edsammy/ECE222Final/notifications{?since,all,participating}',
//labels_url: 'https://api.github.com/repos/edsammy/ECE222Final/labels{/name}',
//releases_url: 'https://api.github.com/repos/edsammy/ECE222Final/releases{/id}',
//created_at: '2014-04-17T20:39:41Z',
//updated_at: '2014-05-28T09:19:56Z',
//pushed_at: '2014-05-28T09:19:57Z',
//git_url: 'git://github.com/edsammy/ECE222Final.git',
//ssh_url: 'git@github.com:edsammy/ECE222Final.git',
//clone_url: 'https://github.com/edsammy/ECE222Final.git',
//svn_url: 'https://github.com/edsammy/ECE222Final',
//homepage: null,
//size: 6652,
//stargazers_count: 0,
//watchers_count: 0,
//language: 'SourcePawn',
//has_issues: true,
//has_downloads: true,
//has_wiki: true,
//has_pages: false,
//forks_count: 0,
//mirror_url: null,
//open_issues_count: 0,
//forks: 0,
//open_issues: 0,
//watchers: 0,
//default_branch: 'master',
//permissions:
//{ admin: false,
//push: true,
//pull: true } } }

