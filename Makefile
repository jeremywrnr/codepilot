mongo:
	@echo "mongo ds027835.mlab.com:27835/heroku_m6rqc1mh -u <user> -p <pass>"

test:
	spacejam test-packages ./packages/GitSync/

lines:
	find ./* -type f | grep -v jpg | grep -v gif | grep -v md | grep -v ico | xargs wc -l
