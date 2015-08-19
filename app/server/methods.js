// server (priveleged) methods, can run sync.
// so: files, shareks, and top-level functions
// dlog is debugger log, see server/setup.js

Meteor.methods({

  //////////////////
  // FILE MANAGEMENT
  //////////////////

  newFile: function() { // create a new file, unnamed, return id
    return Meteor.call('createFile', 'untitled');
  },

  createFile: function(ft) { // make new file with filetitle (ft), return id
    Meteor.call('addMessage', ' created file - ' + ft);
    Files.insert(
      {
        title: ft,
        repo: Meteor.user().profile.repo
      },
      function(err, id) { // create sharejs document with same id
        if(!err)
          newShareJSDoc(id);
        else
          dlog(err);
      }
    );
  },

  deleteFile: function(id) { // with id, delete a file from system
    ShareJS.model.delete(id);
    Files.remove(id);
    Docs.remove(id);
  },

  resetFiles: function() { // reset db and hard code simple website structure
    Files.find({}).map(function delFile(f){ Meteor.call('deleteFile', f._id)});
    var base = [{'title':'site.html'},{'title':'site.css'},{'title':'site.js'}];
    base.map(function(f){ Meteor.call('createFile', f.title) });
  },



  /////////////////////
  // SHAREJS MANAGEMENT
  /////////////////////

  newShareJSDoc: function(id) { // create sharejs document with same id
    return Async.runSync(function(done) {
      var time = Math.round( new Date() / 1000 );
      ShareJS.model.create(
        id, 'text', { mtime: time, ctime: time },
        function(error, doc){ done(error, doc); }
      );
    });
  },

  getShareJSDoc: function(file) { // give live editor copy, v and snapshot
    if(! file._id ) return null;
    var sjs = Docs.find( file._id );
    if (sjs.count())
      return sjs.fetch()[0].data;
    else
      Meteor.call('newShareJSDoc', file._id);
    return Meteor.call('getShareJSDoc', file._id);
  },

  postShareJSDoc: function(file) { // update files with their ids
    var sjs = Meteor.call('getShareJSDoc', file) // get doc and version
    if( !sjs ) return null; // if file id broke, don't propagate error
    ShareJS.model.applyOp( file._id, {
      op: [
        { p:0, d: sjs.snapshot }, // delete old content
        { p:0, i: file.content } // insert new blob content
      ],
      meta: null,
      v: sjs.v // apply it to last seen version
    });
  },

  testShareJS: function() { // update contents from sjs
    var repoId = Meteor.user().profile.repo;
    Files.find({repo: repoId}).map(
      function renderSJS(f){ // render the project's sharejs buffers
        var updated = Meteor.call('getShareJSDoc',f).snapshot;
        Files.update(
          {'_id': f._id},
          {$set: { content: updated} }
        );
      }
    );
  },



  ///////////////////
  // ISSUE MANAGEMENT
  ///////////////////

  addIssue: function(feedback){ // adds a feedback issue to github

    feedback.imglink = Async.runSync(function(done){ // save screenshot, give id
      Screens.insert({img: feedback.img}, function(err, id){
        done(err, id);
      });
    }).result; // attach screenshot to this issue
    delete feedback.img; // delete redundant png

    // insert a dummy issue to get id, use later in GH issue body txt
    var issueId = Async.runSync(function(done){
      Issues.insert({issue: null}, function(err, id){
        done(err, id);
      });
    }).result; // get the id of the newly inserted issue

    // construct and append the text of the github issue, including links to screenshot and demo
    var imglink = '[issue screenshot](http://codepilot.meteor.com/screenshot/' + feedback.imglink + ')\n';
    var livelink = '[live code here](http://codepilot.meteor.com/render/' + issueId + ')\n';
    var htmllink = 'html:\n```html\n' + feedback.html + '\n```\n';
    var csslink = 'css:\n```css\n' + feedback.css + '\n```\n';
    var jslink = 'js:\n```js\n' + feedback.js + '\n```\n';
    feedback.body = imglink + livelink + htmllink + csslink + jslink;


    var ghIssue = {_idissue: Meteor.call('postIssue', feedback)};
    ghIssue.feedback = feedback; // attach feedback issue data
    ghIssue.repo = feedback.repo; // attach repo forming data
    ghIssue.ghid = ghIssue.id; // attach github issue id

    // insert complete issue, and add it to the feed
    Issues.update(issueId, ghIssue);
    Meteor.call('addUserMessage', feedback.user,
                'opened issue - ' + feedback.note);
  },

  closeIssue: function(issue){ // close an issue on github by number
    Issues.remove(issue._id); // remove from the local database
    Meteor.call('ghAuth');
    Meteor.call('addMessage', 'closed issue - ' + issue.feedback.note);
    return github.issues.edit({
      user: Meteor.user().profile.repoOwner,
      repo: Meteor.user().profile.repoName,
      number: issue.issue.number,
      state: 'closed'
    });
  },

  initIssues: function() { // re-populating git repo issues
    var repo = Repos.findOne( Meteor.user().profile.repo );
    var issues = Meteor.call('getAllIssues', repo);
    issues.map(function(issue){
      Issues.update({
        repo: repo._id,
        ghid: issue.id // (from github)
      },{
        $set: {issue: issue},
      },{
        upsert: true
      });
    });
  },



  ////////////////////////////////////////////////////////
  // top level function, grab files and commit to github
  ////////////////////////////////////////////////////////

  makeCommit: function(msg) { // grab sjs contents, commit to github

    // getting file ids, names, and content
    var files = Files.find({repo: Meteor.user().profile.repo}).map(
      function getFile(f){
        var shareJSDoc = Meteor.call('getShareJSDoc', f);
        return {
          path: f.title,
          content: shareJSDoc.snapshot
        }
      }
    );

    // a diff would be done here, remove unchanged files from list
    // or add new files, that were not in the previous commit

    // construct commit tree content
    var blobs = files.map(function(f){
      return {
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.content
      }
    });

    dlog( blobs );

    // get old tree and update it with new shas, post and get that sha
    var bname = Meteor.user().profile.repoBranch;
    var branch = Meteor.call('getBranch', bname);
    var oldTree = Meteor.call('getTree', branch.commit.commit.tree.sha);
    var newTree = { 'base': oldTree.sha, 'tree': blobs };
    var treeSHA = Meteor.call('postTree', newTree);

    // specify author of this commit
    var commitAuthor = {
      name: Meteor.user().profile.name,
      email: Meteor.user().profile.email,
      date: new Date()
    };

    // make the new commit result object
    var commitResult = Meteor.call('postCommit', {
      message: msg, // passed in
      author: commitAuthor,
      parents: [ branch.commit.sha ],
      tree: treeSHA
    });

    // update the ref, point to new commmit
    Meteor.call('postRef', commitResult);

    // get the latest commit from the branch head
    var lastCommit = Meteor.call('getBranch', bname).commit;

    // post into commit db with repo tag
    Meteor.call('addCommit', lastCommit);

    // update the feed with new commit
    Meteor.call('addMessage', 'commited - ' + msg);

  },



  /////////////////////////////////////////////////////////////
  // other helper functions - TODO: better docs for deezzzzzzz
  /////////////////////////////////////////////////////////////

  initBranches: function(gr) { // get all branches for this repo
    // for the current repo, just overwrite branches with new
    var brs = Meteor.call('getBranches', gr); // res from github
    Repos.update({ id: gr.repo.id },{ $set: {branches: brs }});
    Meteor.call('setBranch', gr.repo.default_branch) // set default br
  },

  initCommits: function() { // re-populating the commit log
    var gc = Meteor.call('getAllCommits');
    gc.map(function(c){ Meteor.call('addCommit', c) });
  },

  forkRepo: function(user, repo) { // create a fork of a repo for user
    try { // that is, if the repo exists/isForkable
      Meteor.call('getRepo', user, repo);
      Meteor.call('postRepo', user, repo);
      Meteor.call('getAllRepos');
    } catch (err) {
      throw new Meteor.Error('null-repo'); // this repo no fork :O
      dlog(err);
    }
  },

  loadHead: function(bname) { // load head of branch, from sha
    // check if branch name is a valid branchname of this repo
    var sha =  Meteor.call('getBranch', bname).commit.sha;
    Meteor.call('loadCommit', sha);
  },

  loadCommit: function(sha) { // takes commit sha, loads into sjs
    var commitResults = Meteor.call('getCommit', sha);
    var treeSHA = commitResults.commit.tree.sha;
    var treeResults = Meteor.call('getTree', treeSHA);
    var br = Meteor.call('getBlobs', treeResults);
    dlog( treeResults );

    // move files old contents into sharejsdoc
    var repoFiles = Files.find({ repo: Meteor.user().profile.repo });
    repoFiles.map(function loadSJS(f){ Meteor.call('postShareJSDoc', f) });
    dlog( repoFiles.fetch() );
  },

  addCommit: function(c) { // adds a commit, links to repo + branch
    Commits.upsert({
      repo: Meteor.user().profile.repo,
      branch: Meteor.user().profile.repoBranch,
      sha: c.sha
    },{
      $set: { commit: c }
    });
  },



  ///////////////////////////
  // helper & testing methods
  ///////////////////////////

  resetAllData: function() { // detroy everything
    Messages.remove({});
    Commits.remove({});
    Screens.remove({});
    Issues.remove({});
    Repos.remove({});
    Tasks.remove({});
    Files.remove({});
    Docs.remove({});
  },

});
