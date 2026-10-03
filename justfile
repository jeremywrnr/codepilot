# codepilot tasks - run `just` to list them

export PATH := env_var('HOME') + "/.meteor:" + env_var('PATH')

# list recipes
default:
    @just --list

# install npm deps (meteor's own npm/node)
install:
    meteor npm install

# create settings.json from the example (dev mode on: fake github, no firebase)
setup:
    @test -f settings.json && echo "settings.json already exists" || \
        (sed 's/"devMode": false/"devMode": true/' settings.example.json > settings.json && echo "created settings.json (devMode on)")

# run the app at http://localhost:3000
run: setup
    meteor run --settings settings.json

# wipe the local dev database (users, repos, files...)
reset:
    meteor reset

# count lines of source
lines:
    find ./* -type f | grep -v node_modules | grep -v jpg | grep -v gif | grep -v md | grep -v ico | xargs wc -l
