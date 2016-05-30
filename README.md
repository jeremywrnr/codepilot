[code pilot](http://codepilot.xyz)
==================================

[![MIT License](https://img.shields.io/npm/l/alt.svg?style=flat)](http://jeremywrnr.com/mit-license)
[![Build Status](https://travis-ci.org/jeremywrnr/git-sync.svg?branch=dev)](https://travis-ci.org/jeremywrnr/git-sync)
[![bitHound Score](https://www.bithound.io/github/jeremywrnr/git-sync/badges/score.svg)](https://www.bithound.io/github/jeremywrnr/git-sync)

This is a tool meant to help people collaborate on code more seamlessly. The
model is based on that of a pilot and a co-pilot, where the pilot does most of
the actual programming, and the co-pilot performs background coding tasks. This
can include version control management, system testing, online reference
lookup, and commenting/documenting source code.


## features

- supports simultaneous file editing
- import a any github repo into GitSync
- edit, test, and commit back to github
- supports live branching, testing
- import, create, and close issues (GH)
- includes screenshot, live code


## cloning + running

    git clone https://github.com/jeremywrnr/git-sync.git
    cd git-sync/app/private && make

You will need to register an application key with github in order to login with
their oauth system, more information on how you can do that [here][oauth]. A
related note is the [github developer program][devel], which I think you (may?)
need to join if you want to register an app - this is free. The application
will look for deployment keys in the `app/private` folder, in production.json
and development.json, respectively. This is what the insides should resemble:

    {
        "service": "github",
        "clientId": "gooddaygoodsir",
        "secret": "meaningoflife"
    }

Once this is setup, do the following to start running it locally:

    cd ../
    meteor

Then, you can check out [localhost:3000](http://localhost:3000), and play
around with things. I tried running `meteor update`, and the editor started
breaking, so I'd recommend against doing that.


[devel]:https://developer.github.com/program/
[oauth]:https://developer.github.com/v3/oauth/
