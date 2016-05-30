# bring config vars into environment
env_dir=$1
echo $env_dir
if [ -d "$env_dir" ]; then
    for e in $(ls $env_dir); do
        echo "$e"
        export "$e=$(cat $env_dir/$e)"
    done
fi

# now decrypting API keys
cd private && make decrypt
