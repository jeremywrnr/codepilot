[code pilot](http://codepilot.meteor.com)
=========================================

This is a tool meant to help people collaborate on code more seamlessly. The
model is based on that of a pilot and a co-pilot, where the pilot does most of
the actual programming, and the co-pilot performs background coding tasks. This
can include version control management, system testing, online reference
lookup, and commenting/documenting source code.



## features

- soon it will feature things



## cloning + running

    git clone https://github.com/jeremywrnr/codepilot.git
    cd codepilot/app/private

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
    meteor update && meteor

Then, you can check out [localhost:3000](http://localhost:3000), and play
around with things.

This commit was made with code pilot #meta



[devel]:https://developer.github.com/program/
[oauth]:https://developer.github.com/v3/oauth/
