TODOS
=====

generating visualizations of the javascript AST??? or something similar to
python tutor in some way.

on loading the git page, it should automatically load the diffs rather than
forcing the user to load them manually

notification of who is working on project, what file is open in their buffer
and what branch they are on.

when committing, get the diff working, and also give the option to just commit
specific files, instead of only being able to do a mass commit.

actually rendering an issues code?
    if not found, let user know of this
    render the default view

tell when nothing changes and trying to commit
make screenshot of code each time you commit

check if issue has feedback field (generated from codepilot), then display live
link, will also need to update the rawjs source location for that.
filter sharejs loading to type == file

collaboration idea: in the users tab, add ability to add a copilot by their
username on github, as well as the ability to revoke if you are true user
great BC they dont have to be github collab to edit it!!!
adding revokable users to a repo

when loading a new repo in, display that in the files, so user knows,
then reset session variable after successful load (or error) in cb()



## UI / UX

diffing hmtl does not work, renders
slightly smaller spacing in sidebar
adjust the js debugger depending on the screen size
add a repo and branch icon to filebar
diff not loading auto - double it
marking a release on github plz
get all issues, hide closed button
show commit panel to all users
paginate long commit histories
expose editor configuration to user
add a footer in for spacing in main
loading bar for the commit progress
icons may seem to do action - remove icon
normalize role selection (match others)
rendering .md as a link in feed
setting up different roles - junior prog
describe roles differences much better
console.error() on loadrepo??



## SERVER

parse folders off when getting file extension - for null
implement system testing? velocity
\_pick your data as to not bloat the database
autoload repos after creating an account
only request commits after current
install loglevel meteor
rendering local images in a view?
repo has label-created field, only call once
more testing with someone else
handle users that do not have any repos
rendering an arbitrary commit
deleting / renaming files with github
if owner, linking to the collaborators page
implementing a collapseable folder structure
load file from github only on click?? this will reduce api calls
get current commit sha -> tree sha -> blob -> load into sharejs doc
for handling larger projects without destroying github api:
possible to store versions of each file??


## STUDY

"what makes for the most innovative pair and multi-user coding environment"
what are interesting things that people could run in an hour
beyond study - lickert scale study questions
github vs git, able to collaborate, but not
(within subjects takes care of it)
auxiliray - coding spectator to jump in
live webcasting of them coding, people can help
codepilot for strangers (pull requests vs codepilot)
one pilot and many coding helpers



## PAPER

copilot nosiness - editing code, passivity?
user study measurements - what metrics to evaluate?
case study from Mythical Man Month of surgeon + multiple assistants
a distributed task 1 pilot, 4 copilots
video or talk embedding - collab github education?
creating an issue on this repo, could be helpful to PROF
github as an education platform, codepilot as a even *more* collaborative platform?
a teacher can have lecture code stored in the repo, and then walk through bit
by bit (eg commits), even if not runnable in the browser/cloud form controls
make note of andy, talking about debugging webapps, related to work that bryan
burg did at uw while he was a student of andys. technical hci work, good to
cite the uist work, very benficial for the apps upcoming very soon
summary of what you did, and a copy of the upd to date resume

by creating a gh-pages branch, you can actually host the content that you make
from a specific readme - this is cool, because it lets you export the code from
the renderer to an actual live webpage. some dependencies may break however.

Yep! Codepilot is very relevant nowadays since more and more people are working
remotely as software developers. Remote and distributed development teams are
more of a norm now, so people need better situational awareness and pair
programming tools for this new workflow. That's a great thing to include in an
intro for a paper and your thesis.

#### FUTURE WORK

Let the pair switch off whenever they want if one person is getting tired or
stuck or wants a chill break to be hanging out more passively in the background
maybe include an automated metric on how 'in flow' the person is, suggest a
change if it drops below a certain point



## NOTES / ERRORS

- an untitled file sometimes gets generated when switching repos/branches
- after longtime of unwatching: Uncaught SyntaxError: Unexpected token Y start
- file contents while renaming, many errors
- commits breaking down
