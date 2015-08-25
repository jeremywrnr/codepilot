TODOS
=====


marking a release on github plz
diffing hmtl does not work, renders
actually rendering an issues code?
    if not found, let user know of this
    render the default view
diff not loading auto - double it


## UI / UX

get all issues, hide closed button
show commit panel to all users
paginate long commit histories
add a footer in for spacing in main
loading bar for the commit progress
icons may seem to do action - remove icon
normalize role selection (match others)
rendering .md as a link in feed
setting up different roles - junior prog
describe roles differences much better
console.error() on loadrepo??


## SERVER

rendering local images in a view
repo has label-created field, only call once
more testing with someone else
handle users that do not have any repos
implement system testing? velocity
only request commits after current
rendering an arbitrary commit
\_pick your data as to not bloat the database
autoload repos after creating an account
deleting / renaming files with github
if owner, linking to the collaborators page
implementing a collapseable folder structure
for handling larger projects without destroying github api:
possible to store versions of each file??
load file from github only on click?? this will reduce api calls
get current commit sha then tree sha then blob then load into sharejs doc


## PAPER

user study measurements
copilot nosiness - editing code, passivity?
case study from Mythical Man Month of surgeon + multiple assistants
a distributed task 1 pilot, 4 copilots
video or talk embedding - collab github education?
creating an issue on this repo, could be helpful to PROF
github as an education platform, codepilot as a even *more* collaborative platform?
a teacher can have lecture code stored in the repo, and then walk through bit
by bit (eg commits), even if not runnable in the browser/cloud form controls

#### FUTURE

Let the pair switch off whenever they want if one person is getting tired or
stuck or wants a chill break to be hanging out more passively in the background
maybe include an automated metric on how 'in flow' the person is, suggest a
change if it drops below a certain point


## NOTES / ERRORS

an untitled file sometimes gets generated when switching repos/branches

after longtime of unwatching: Uncaught SyntaxError: Unexpected token Y start

file contents while renaming, many errors


#### done

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
creating an issue on this repo, could be helpful to PROF
actual testing interface
handle null filename better
install stringDiff lib
collapse menu nav on shorten wideness
sorting files alphabetically
show which commit owner
make welcome template seperate, less wide
top item in branch select is make new branch
tester is reloading really slowly...
deliver resources based on active repo
reduce margins, make better use of space
push new commit to local db after github
writing to the contents of a sharejs document
integrate feed hooks into commits
scrape head, body of html document for testing
loading content from a repo into files, then docs
make show / hide (hide completed) button
bug - clicking on box doesnt disable it??
scrolling doesn't update for other's messages
EDITING GITHUB PERMISSION REQUESTS:
testing out pushing to an existing repo
difference between author and committer in git?
refactor iframes, better in pane nav.
ACTUALLY design what the fields should be plz
feed notifys on issues
add a commit updates cached version
only give user the user things related to their repo
only add to collaborators if not on list
future: create a new repo with the api
generating shared session links - done with unique repo ids
dont allow a feed message that is just whitespace
global methods - detoggle set afterclick
canceling repo select cancels branch fork
loading a repos content, commit history
hide feedback system after submitting
reconfigure public only repos
better change branch handling - not loading commits
doing a diff match path before commit, locally
add a presentation format
view while writing commit msg
autoset default branch
don't add user to repo owner if they are already there
closing an issue on github should close on codepilot
check if a user was last collaborating before showing them
having sessions or groups - scaling app
linkify feed items
change template based on roles
making the task items more usable
project id - show collaborators button
make the reset file button work
conflict with sharejs and docs??? renaming to files
committing folders works, but can't load them - recursive trees
if label == codepilot, color black
if choosing repo, cant choose branch
if choosing branch, cant choose repo
make a fake github account, collab with me
probably something to do with using autopublish
fixing the load commit / docs
add more labels on right side of task input (gh issues)
refactor issue fields.. again - issue vs issue.issue?
add null msg for feed and commit
listiing a users repos / 'collabable'
load a specific commit instead of the latest
including the log data in the issue
add a snapshot feature
store commit shas locally
removing login with email (just github)
have a link to rename or edit the project files...
refactor authentication code - methods
looking at roles, changing editing profiles
screenshots not pub
on selecting a repo, load branches
make login info pop to the left | align it right
have a reset button next to file - remove unwanted changes
tuneup feedback renderer panes
confirm resetting the project
deleting and renaming button (NOW DOES) work
make a new task also adds an item to feed
test/fix get repo production errors
null feed marker
chat: only show initials for briefness?
iframes custom javascript logger output
## guo meeting - time for MS visits? 11am
attach links for reference to file issue
make message box look nicer
add params to field
creating + selecting new branch
confirm on load codepilot
commit links to rendered view
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
file rename - close on lose focus
ability to close issue from codepilot
ability to create issue from codepilot?
seperate renderer bar - reload and file issue
less aggresively reset branch to master
refactor upserts with $set
checking upsert issues correctly?
screencapture to png
cache content for diff
make a new issue, attach png to it
only refresh repos, if there are none
issues being duplicated
increase commit history to 100 (per page, in github.js)
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
refactor issue posting as well
insert a better glyph for the current file
make settings panel info boex success?
top item in repo select is fork a repo
can't fork a repo you already own
refactor github.js-getblobs() plz
can't fork a repo that doesn't exist
sort /public by media types and rereference
choose ANY public repo on github, fork it for user, then start editing that repo
test: set session.focused var, cant have more than one open
add link to rendered html in issues
sort chat by positive time
tabbed user interface - elseif in meteor?
or rather how to do some routing in meteor
branching functionality
managing file fields better
don't download image content into cp
snapshot code: save to github, notes section
load ESPECIALLY AS AN EDUCATIONAL TOOL!!!!
load files on branch select
white list filetypes to load into sjs
or not do this?? overwrites last
rendering a branch screenshot
clicking on a file should go to edit tab
making a message with the commit
just make rename field focus a function
when make a newfile, autofocus rename
autofocus namefield on rename
checking out cloud9, project import
clean up css duplication rules
better iframe: responsive js, document.onready
feed items for switching branches
squash preforked git history
make the chat list nicer
having multiple versions of files
not loading for some reason?
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
null issuer marker
link addition in tasks
users pane:
only owner can add a collaborator: add option
also show what branch the collabs are working on
move renaming to focusPane scope
click on file closes rename option
on file rename form lose focus, stop renaming
guo updates
branching works
make new branch, from current, write name
creates new fileIds for current branch
different commit history
activity is in logger
REFACTOR server/methods
make different rendered views for each
normalize event style
github api syncing
why does it need to two calls to populate sjs docs?
adding a content field on create new doc? perhaps
differentiate dropdowns on config
syntax highlighting structure of repo
-->
