TODOS
=====


## SERVER

only give user the user things: tag with id
commit these changes only after testing
override the iframes logger so that it goes a box below with the javascript output
generating shared session links
walk through commits (too much like desktop apps?)
creating an issue on this repo - could be helpful to PROF
copilot is taking snapshots of the code while testing
passing the tests do a merge from mater in the testing app
save files under the test, so testing does not disrupt the editing
have a diff below each of the commits
add a snapshot feature
store commit shas locally
do a check with commit contents, if different create the blob and do a diff
against the current version with the github api, post before committing???
implementing a folder structure
maybe a loading bar for the commit progress
having sessions or groups - scaling app
listiing a users repos / 'collabable'
dropdown to select one to use in codepilot
create branching for testing
future: create a new repo with thbe api
load a specific commit instead of the latest
will involve storing the hashes in commits
ability to fork code from parent repo
parse the head out of the html source file


## UI / UX

make a test button, load buffer
adding branch options to config panel
save three buffers and load into iframe
gutter indicators: copilot comments, recent edits
add more labels on right side of task input
click on task user label shouldnt complete
make a new task also adds an item to feed
attach links for reference to file issue
add git options to each commit item
copilot doesnt edit code
copilot - write view of tests
pilot - read view of tests


## NOTES / ERRORS

video or talk embedding - collab github education? - snapshot code: save to
github, notes section - load ESPECIALLY AS AN EDUCATIONAL TOOL!!!! -
teacher/pilot vs student/copilot specific files for a specific group id??? -
look into how to write meteor tests, starting doing so please if try to edit
file contents while renaming, many errors - go back to not renaming on the
rename form losing focus. a teacher can have lecture code stored in the repo,
and then walk through bit by bit (eg commits), even if not runnable in the
browser/cloud form controls must share editor template, or will break sometimes
after longtime of unwatching: Uncaught SyntaxError: Unexpected token Y start
syntax highlighting structure of repo - make one for each user, have user
request to collaborate on another users repo, make a - Let the pair switch off
whenever they want if one person is getting tired or stuck or wants a chill
break to be hanging out more passively in the background maybe include and
automated metric on how 'in flow' the person is, and hardcode three files
suggest a change if it drops below a certain point - testing / checkin / issues
madeye.io meteor // testing manual velocity // testing solution - also case
study from Mythical Man Month of surgeon + multiple assistants model of
programming. - look into using the promise library ql. the sharejs template
creates a new doc for it when you press the new button, but you can do this
automatically, with the model.create from sharejs. - a distributed task - 1
pilot, 4 copilots


### done

<!--
hardcode three files
set up iframe html
form validation: chat, rename, task, commit
add 'repo' field to user
actual testing interface
handle null filename better
sorting files alphabetically
show which commit owner
make welcome template seperate, less wide
writing to the contents of a sharejs document
loading content from a repo into files, then docs
make show / hide (hide completed) button
bug - clicking on box doesnt disable it??
EDITING GITHUB PERMISSION REQUESTS:
testing out pushing to an existing repo
loading a repos content, commit history
reconfigure public only repos
change template based on roles
making the task items more usable
conflict with sharejs and docs??? renaming to files
make a fake github account, collab with me
probably something to do with using autopublish
removing login with email (just github)
have a link to rename or edit the project files...
refactor authentication code - methods
looking at roles, changing editing profiles
make login info pop to the left | align it right
deleting and renaming button (NOW DOES) work
chat: only show initials for briefness?
github integration
make message box look nicer
remove autopublish, p/s specific datasets
have partially curved border, lower ace
make prompt to open new file on close
color rename/delete buttons on hover
if no files yet, say clicknew in list
squash preforked git history
make the chat list nicer
hard to get collab or contributor repos.
insert a better glyph for the current file
make settings panel info boex success?
tabbed user interface - elseif in meteor?
or rather how to do some routing in meteor
clicking on a file should go to edit tab
making a message with the commit
just make rename field focus a function
when make a newfile, autofocus rename
autofocus namefield on rename
clean up css duplication rules
option to pick roles
basic roles management
refactor on repoName
choose target from list of on github
sort owned and all other editable repos
-->
