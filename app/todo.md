TODOS
=====


branching functionality
    having multiple versions of files
    not loading for some reason?
    feeditems for current branch
closing an issue on github should close on codepilot
    get all issues, hide closed button
    move reload to individual item
users pane:
    only owner can add a collaborator: add option
    also show what branch the collabs are working on


## UI / UX

null feed marker
null issuer marker
on test: set session.focused var, cant have more than one open
hide feedback system after submitting
project id- show collaborators button
tester is reloading really slowly...
if label == codepilot, color black
if choosing repo, cant choose branch
if choosing branch, cant choose repo
global methods - detoggle set afterclick
canceling repo select cancels branch fork
diff the commits, before sending msg
a loading bar for the commit progress
viewing all commits link???
refactor upserts with $set


## SERVER

less aggresively reset branch to master
commit links to rendered view
refactor issue posting as well
checking upsert issues correctly?
implement system testing? velocity
refactor github.js-getblobs() plz
maybe including the log data in the rendered issue view
github api syncing
    why does it need to two calls to populate sjs docs?
    adding a content field on create new doc? perhaps
    perhaps you can use a load on click operation to fix.
load file from github only on click?? reduce api calls
    get current commit sha, then tree sha, then blob, then load into sharejs doc
increase commit history to 100 (per page, in github.js)
standardize server method names, documents
autoload repos after creating an account
deleting / renaming files with github
implementing a folder structure
possible to store versions of each file??
repo not loading for jon curtis


## PAPER

user study measurements
copilot nosiness - editing code, passivity?


## NOTES / ERRORS

video or talk embedding - collab github education?
snapshot code: save to github, notes section
load ESPECIALLY AS AN EDUCATIONAL TOOL!!!!

teacher/pilot vs student/copilot specific files for a specific group id???
look into how to write meteor tests, starting doing so please if try to edit
file contents while renaming, many errors
go back to not renaming on the

rename form losing focus. a teacher can have lecture code stored in the repo,
and then walk through bit by bit (eg commits), even if not runnable in the

browser/cloud form controls must share editor template, or will break sometimes
after longtime of unwatching: Uncaught SyntaxError: Unexpected token Y start
syntax highlighting structure of repo
make one for each user, have user
request to collaborate on another users repo, make a
Let the pair switch off
whenever they want if one person is getting tired or stuck or wants a chill
break to be hanging out more passively in the background maybe include and
automated metric on how 'in flow' the person is, and hardcode three files
suggest a change if it drops below a certain point
testing / checkin / issues
madeye.io meteor // testing manual velocity // testing solution
also case
study from Mythical Man Month of surgeon + multiple assistants model of
programming.
look into using the promise library ql. the sharejs template
creates a new doc for it when you press the new button, but you can do this
automatically, with the model.create from sharejs.
a distributed task 1 pilot, 4 copilots
idea: maybe also include option to make a PR or be a
collaborator
\_pick your data as to not bloat the database
future: create a new repo with the api
creating an issue on this repo, could be helpful to
PROF
in the future, you could create pull requests instead of linking to the
collaborators page.


### done

<!--
hardcode three files
set up iframe html
on logout, route to '/'
browse at this time
view source of old commit
adding branch options to config panel
integrate feed hooks into tasks
make a test button, load buffer
save three buffers and load into iframe
form validation: chat, rename, task, commit
add 'repo' field to user
add git options to each commit item
use repo id as project id, lots of refactoring
actual testing interface
handle null filename better
sorting files alphabetically
show which commit owner
make welcome template seperate, less wide
top item in branch select is make new branch
deliver resources based on active repo
reduce margins, make better use of space
push new commit to local db after github
writing to the contents of a sharejs document
integrate feed hooks into commits
scrape head, body of html document for testing
loading content from a repo into files, then docs
make show / hide (hide completed) button
bug - clicking on box doesnt disable it??
EDITING GITHUB PERMISSION REQUESTS:
testing out pushing to an existing repo
difference between author and committer in git?
refactor iframes, better in pane nav.
ACTUALLY design what the fields should be plz
feed notifys on issues
only give user the user things related to their repo
only add to collaborators if not on list
generating shared session links - done with unique repo ids
dont allow a feed message that is just whitespace
loading a repos content, commit history
reconfigure public only repos
better change branch handling - not loading commits
autoset default branch
don't add user to repo owner if they are already there
having sessions or groups - scaling app
linkify feed items
change template based on roles
making the task items more usable
conflict with sharejs and docs??? renaming to files
committing folders works, but can't load them - recursive trees
make a fake github account, collab with me
probably something to do with using autopublish
fixing the load commit / docs
add more labels on right side of task input (gh issues)
add null msg for feed and commit
listiing a users repos / 'collabable'
load a specific commit instead of the latest
add a snapshot feature
store commit shas locally
removing login with email (just github)
have a link to rename or edit the project files...
refactor authentication code - methods
looking at roles, changing editing profiles
screenshots not pub
on selecting a repo, load branches
make login info pop to the left | align it right
tuneup feedback renderer panes
deleting and renaming button (NOW DOES) work
make a new task also adds an item to feed
test/fix get repo production errors
chat: only show initials for briefness?
iframes custom javascript logger output
## guo meeting - time for MS visits? 11am
attach links for reference to file issue
make message box look nicer
add params to field
creating + selecting new branch
confirm on load codepilot
choose target from list of on github
pilot sees tasks and issues, can close issues.
make tasks more clickable (hover)
doesnt see the testing frame tho, git vsc
copilot sees tasks issues, can't close tho
manages version control from the site
SMASH ALL TASKS INTO ONE PANE
importing github issues
linking to a specific issue
make a nice lil favicon y doncha
ability to close issue from codepilot
ability to create issue from codepilot?
seperate renderer bar - reload and file issue
screencapture to png
make a new issue, attach png to it
attach issue to the png
confirming close issue with confirm
ask them to describe new issue
sort owned and all other editable repos
commit reset buttons actually do something
remove autopublish, p/s specific datasets
have partially curved border, lower ace
make prompt to open new file on close
color rename/delete buttons on hover
if no files yet, say clicknew in list
hard to get collab or contributor repos.
insert a better glyph for the current file
make settings panel info boex success?
top item in repo select is fork a repo
can't fork a repo you already own
can't fork a repo that doesn't exist
choose ANY public repo on github, fork it for user, then start editing that repo
add link to rendered html in issues
sort chat by positive time
tabbed user interface - elseif in meteor?
or rather how to do some routing in meteor
clicking on a file should go to edit tab
making a message with the commit
just make rename field focus a function
when make a newfile, autofocus rename
autofocus namefield on rename
checking out cloud9, project import
clean up css duplication rules
better iframe: responsive js, document.onready
squash preforked git history
make the chat list nicer
posting github issues
exact parsing needs cleaning on add issue
attach a codepilot label to issue
better iframe: serve template on route, have that be the src
remove the img field from feedback
issues link to rendered view, better issue contents
closing / linking to actual github issues
purge prod database
add github issue commenting
github integration
option to pick roles
basic roles management
color hide complete - not a label anymore?
refactor on repoName
file specific syntax highlighting
show project id
default repo string is suggestions.
fix loggedout homepage
closing github issues
link addition in tasks
-->
