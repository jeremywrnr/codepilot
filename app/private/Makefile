# keeping passwords in source control:
# http://ejohn.org/blog/keeping-passwords-in-source-control/

.PHONY: _pwd_prompt decrypt_conf encrypt_conf
CONF_FILE1=live-login.json
CONF_FILE2=local-login.json
AUTHOR=jeremywrnr@gmail.com

_pwd_prompt: # 'private' task for echoing instructions
	@echo "Contact ${AUTHOR} for the password."

decrypt: _pwd_prompt
	openssl cast5-cbc -d -in ${CONF_FILE1}.cast5 -out ${CONF_FILE1}
	openssl cast5-cbc -d -in ${CONF_FILE2}.cast5 -out ${CONF_FILE2}
	chmod 600 ${CONF_FILE}

encrypt: _pwd_prompt
	openssl cast5-cbc -e -in ${CONF_FILE1} -out ${CONF_FILE1}.cast5
	openssl cast5-cbc -e -in ${CONF_FILE2} -out ${CONF_FILE2}.cast5

