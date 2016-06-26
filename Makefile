mongo:
	source .environment
	mongo ds027835.mlab.com:27835/heroku_m6rqc1mh -u ${ML_USER} -p ${ML_PASS}

test:
	spacejam test-packages ./packages/git-sync/

lines:
	find ./* -type f | grep -v jpg | grep -v gif | grep -v md | grep -v ico | xargs wc -l
