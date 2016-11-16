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

.PHONY: mongo check test testci lines
