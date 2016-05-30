# bring config vars into environment
export_env_dir() {
  env_dir=$3
  blacklist=${3:-'^(PATH|GIT_DIR|CPATH|CPPATH|LD_PRELOAD|LIBRARY_PATH)$'}
  if [ -d "$env_dir" ]; then
    for e in $(ls $env_dir); do
      echo "$e" | grep -qvE "$blacklist_regex" &&
      export "$e=$(cat $env_dir/$e)"
      :
    done
  fi
}

# call environemnt export
export_env_dir $1 $2 $3

# decrypting API keys
cd private/ && make decrypt
