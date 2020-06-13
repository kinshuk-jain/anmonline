Test admin user - 
userid: 12345

Normal test user - 
userid: test-user

### Deploying

Follow the following steps to deploy code
- npm run deploy
- give ssh permission to ec2 by adding security group
- ssh into ec2
- execute run-server script
- run `pm2 list` to confirm server is running
- thats it

### Setting up server

- It is an ec2 t2.micro
- It is running nginx forwarding port 80 to 3000
- It uses pm2 to manage the node server
- It uses pm2-logrotate to manage logs
- Run command to install dependencies:

```
RUN yum install -y make gcc-c++ tar xz gzip
```

- [Install nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)
- Setup nginx to forward traffic from port 80 to 3000

```
server {
  listen 80;
  server_name api.kinarva.com;
  location / {
    proxy_set_header  X-Real-IP  $remote_addr;
    proxy_set_header  Host       $http_host;
    proxy_pass        http://127.0.0.1:3000;
  }
}
```

- Turn off logging on nginx

```
access_log off
error_log /dev/null
```

- Increase `client_body_buffer_size` size to allow file uploads upto 25mb. Default value for this is 1mb.
Any uploads greater than this value will be blocked by nginx

- Install node

```
curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz"
tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 --no-same-owner
```

- Install pm2

```
npm install pm2 -g
```

Setup a pm2 ecosystem file with NODE_ENV set for production

- Setup SSL with nginx. The project uses Let's Encrypt to obtain SSL certificate. Their certificates are valid
for only 90 days and must be renewed after that. There is a cron job running to renew certificates automatically.
To see how to setup SSL with Let's encrypt and how to setup the cron job, see the [tutorial](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html#letsencrypt)


- start node server by executing the run-server script

### Usage guidelines

- Do not have same name for two companies. It makes uploading files for them harder
- Always select a company name from results shown in name search fields. Only typing the name without selection will not work
