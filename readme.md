CodePilot
=========

[![MIT License](https://img.shields.io/npm/l/alt.svg?style=flat)](http://jeremywrnr.com/mit-license)


This is a tool meant to help people collaborate on code more seamlessly by
integrating some core programming tasks into a single web IDE. It also
encourages collaborator awareness without generating onerous distractions, and
can serve as a bridge for people learning to use version control.


## features

- project-wide synchronous editing (updates in real time)
- testing, both with PythonTutor and our website renderer
- robust GitHub interface (push, pull, checkout, fork, branch)


## development

Runs on Meteor 3 (Node 24, native on Apple Silicon). Install Meteor, then:

    git clone https://github.com/jeremywrnr/codepilot.git
    cd codepilot
    just install
    just run      # http://localhost:3000, creates settings.json in dev mode

(`just` lists all tasks.)

`settings.json` is gitignored. For the real GitHub/Firebase it needs two things:

1. **GitHub OAuth app** ([register one here][oauth]): set the homepage to
   `http://localhost:3000` and the callback URL to
   `http://localhost:3000/_oauth/github`. Put the client id and secret under
   `github`.
2. **Firebase Realtime Database** (backs the Firepad collaborative editor):
   create a Firebase project, add a Realtime Database (test-mode rules are fine
   for local dev), register a web app, and copy its `apiKey`, `authDomain`,
   `databaseURL` and `projectId` under `public.firebase`.

**No credentials yet?** Set `"devMode": true` under `public` and leave the
Firebase `apiKey` empty. Login becomes a "dev login" button, GitHub is replaced
by an in-memory fake repo (`imports/server/fake-github.js`, resets on restart),
and the editor saves straight to Mongo instead of Firepad (no live co-editing).

Toasts: https://github.com/CodeSeven/toastr


## background

This project started out as work done for my master's thesis, which can be found
[here](https://jeremywrnr.com/ms-thesis/).


[devel]:https://developer.github.com/program/
[oauth]:https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

