# keeping passwords in source control:
# http://ejohn.org/blog/keeping-passwords-in-source-control/

CONF_FILE1=development.json
CONF_FILE2=production.json
AUTHOR=jeremywrnr@gmail.com

prompt: # 'private' task for echoing instructions
	@echo "Contact ${AUTHOR} for the password."

decrypt: prompt
	@echo ${GH_PASSWORD} | openssl cast5-cbc -d -in ${CONF_FILE1}.cast5 -out ${CONF_FILE1}
	@echo ${GH_PASSWORD} | openssl cast5-cbc -d -in ${CONF_FILE2}.cast5 -out ${CONF_FILE2}
	chmod 600 ${CONF_FILE1} ${CONF_FILE2}

encrypt: prompt
	openssl cast5-cbc -e -in ${CONF_FILE1} -out ${CONF_FILE1}.cast5
	openssl cast5-cbc -e -in ${CONF_FILE2} -out ${CONF_FILE2}.cast5

clean:
	rm -fv *.cast5

.PHONY: prompt decrypt encrypt clean
