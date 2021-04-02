# GITHUB ACTION
      # - name: Create .env File
      #   env:
      #     GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
      #   run: |
      #     sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0
      #     sudo apt-add-repository https://cli.github.com/packages
      #     sudo apt update
      #     sudo apt install gh
          
      #     chmod +x ./.ci/scripts/create-env.sh
      #     ./.ci/scripts/create-env.sh dev

# create-env.sh
#!/usr/bin/env bash
ENV=$1
ENV_UPPER="$(echo ${ENV} | tr 'a-z' 'A-Z')"
ENV_LOWER="$(echo ${ENV} | tr 'A-Z' 'a-z')"

ENV_FILE="./.ci/env.${ENV_LOWER}"
REGEX=^[0-9]
SECRETS=$(gh secret list) # This needs to use my new -e flag

rm -rf .env

for SECRET in $SECRETS
do
    # Once I can pull the environment secrets, this will change
    # by removing the prefix and postfix
    FIRST_CHAR=$(echo ${SECRET:0:1})
    if [[ $FIRST_CHAR =~ $REGEX || ${SECRET:0:3} != 'ENV'  ]]
    then
        break
    fi
    
    ENV_LINE="${SECRET}=\${{ secrets.${SECRET}_${ENV_UPPER} }}"
    echo "${ENV_LINE}"
    echo "${ENV_LINE}" >> .env
    
done 

cat $ENV_FILE >> .env
