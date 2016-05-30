# keeping passwords in source control:
# http://ejohn.org/blog/keeping-passwords-in-source-control/

CONF1=production.json
CONF2=development.json
AUTHOR=jeremywrnr@gmail.com

prompt: # 'private' task for echoing instructions
	@echo "Please contact ${AUTHOR} for the encryption password password."

decrypt: prompt
	openssl cast5-cbc -d -in ${CONF1}.cast5 -out ${CONF1} -pass env:GH_PASSWORD
	openssl cast5-cbc -d -in ${CONF2}.cast5 -out ${CONF2} -pass env:GH_PASSWORD
	chmod 600 ${CONF1} ${CONF2}

encrypt: prompt
	openssl cast5-cbc -e -in ${CONF1} -out ${CONF1}.cast5
	openssl cast5-cbc -e -in ${CONF2} -out ${CONF2}.cast5

clean:
	rm -fv *.cast5

.PHONY: prompt decrypt encrypt clean
