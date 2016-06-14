# http://ejohn.org/blog/keeping-passwords-in-source-control/

AUTHOR=jeremywrnr@gmail.com
CONF1=development.json
CONF2=production.json

decrypt:
	@echo "Please contact ${AUTHOR} for the encryption password."
	openssl cast5-cbc -d -in ${CONF1}.cast5 -out ${CONF1} -pass env:GH_PASSWORD
	openssl cast5-cbc -d -in ${CONF2}.cast5 -out ${CONF2} -pass env:GH_PASSWORD
	chmod 600 ${CONF1} ${CONF2}

encrypt:
	openssl cast5-cbc -e -in ${CONF1} -out ${CONF1}.cast5 -pass env:GH_PASSWORD
	openssl cast5-cbc -e -in ${CONF2} -out ${CONF2}.cast5 -pass env:GH_PASSWORD

.PHONY: decrypt encrypt
