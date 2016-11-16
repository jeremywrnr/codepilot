mongo: check
	mongo ds027835.mlab.com:27835/heroku_m6rqc1mh -u ${ML_USER} -p ${ML_PASS}

check:
	source .environment || true

test:
	spacejam test-packages ./packages/git-sync
	spacejam test-packages ./packages/difflib
	spacejam test-packages ./packages/firepad

lines:
	find ./* -type f | grep -v jpg | grep -v gif | grep -v md | grep -v ico | xargs wc -l

# automatically decrypt based on environment variable
# http://ejohn.org/blog/keeping-passwords-in-source-control/

AUTHOR=jeremywrnr@gmail.com
CONF1=private/development.json
CONF2=private/production.json

decrypt:
	@echo "Please contact ${AUTHOR} for the encryption password."
	openssl cast5-cbc -d -in ${CONF1}.cast5 -out ${CONF1} -pass env:GH_PASSWORD
	openssl cast5-cbc -d -in ${CONF2}.cast5 -out ${CONF2} -pass env:GH_PASSWORD
	chmod 600 ${CONF1} ${CONF2}

encrypt:
	openssl cast5-cbc -e -in ${CONF1} -out ${CONF1}.cast5 -pass env:GH_PASSWORD
	openssl cast5-cbc -e -in ${CONF2} -out ${CONF2}.cast5 -pass env:GH_PASSWORD

.PHONY: mongo check test lines decrypt encrypt
