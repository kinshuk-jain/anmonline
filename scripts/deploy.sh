#!/bin/bash -e

# build docker image. The image compiles node_modules against linux irrespective of
# current OS. It is needed by bcrypt to be compiled against running machine
docker build . -t docustore-image

# creates a container from image
docker create --name docustore docustore-image

# copy image from docker container to host machine
docker cp docustore:/usr/src/app/docustore.zip .

# remove the container
docker rm -f docustore

# LEGACY - not using lambda anymore
# aws lambda update-function-code --function-name docustore --region ap-south-1 --zip-file fileb://${PWD}/docustore.zip

# upload zip file to s3
aws s3 cp docustore.zip s3://kinarva/ --storage-class ONEZONE_IA

# remove zip file
rm docustore.zip
