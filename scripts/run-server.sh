#!/bin/bash

# download file from s3
aws s3 cp s3://kinarva/docustore.zip .

# rename the file
NAME="docustore"_`date +%Y_%m_%d_%H_%M_%S`
mv docustore.zip $NAME".zip"

# unzip it
unzip $NAME".zip" -d "$NAME"
rm $NAME".zip"

cd $NAME

# Copy pm2 ecosystem file
cp ../ecosystem.config.js .

# restart server
pm2 restart ecosystem.config.js --env production

cd ../

DEST_FILE=./folder_to_delete_on_new_deployment

# if previous deployment exists, read its name from DEST_FILE and delete folder
if [ -f "$DEST_FILE" ]
then
    PREV_DEPLOYMENT=`cat $DEST_FILE`
    rm -rf "$PREV_DEPLOYMENT"
fi

# save NAME to a file. This will be the name of folder to delete on next deployment
echo "$NAME" > "$DEST_FILE"
