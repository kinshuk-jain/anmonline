# install linux
FROM amazonlinux:latest

# become root to download node
USER root

# amazonlinux does not have tar and zip installed by default
RUN yum install -y make gcc-c++ tar xz zip gzip

ENV NODE_ENV production
ENV NODE_VERSION 12.16.2

# install node/npm
# gpg keys listed at https://github.com/nodejs/node#release-keys
RUN curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" \
&& ln -s /usr/local/bin/node /usr/local/bin/nodejs

# setup a working directory
WORKDIR /usr/src/app

# copy package.json file
COPY package*.json ./

# npm install
RUN npm ci --only=production

# copy code to zip it in next step
COPY config config
COPY index.js ./
COPY app.js ./
COPY src src

# zip working directory to prepare for lambda upload
RUN zip -r docustore.zip .
