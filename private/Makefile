# keeping passwords in source control:
# http://ejohn.org/blog/keeping-passwords-in-source-control/

CONF1=production.json
CONF2=development.json
AUTHOR=jeremywrnr@gmail.com

decrypt:
	@echo "Please contact ${AUTHOR} for the encryption password."
	openssl cast5-cbc -d -in ${CONF1}.cast5 -out ${CONF1} -pass env:GH_PASSWORD
	openssl cast5-cbc -d -in ${CONF2}.cast5 -out ${CONF2} -pass env:GH_PASSWORD
	chmod 600 ${CONF1} ${CONF2}

encrypt:
	openssl cast5-cbc -e -in ${CONF1} -out ${CONF1}.cast5
	openssl cast5-cbc -e -in ${CONF2} -out ${CONF2}.cast5

clean:
	rm -fv *.json

.PHONY: decrypt encrypt clean
