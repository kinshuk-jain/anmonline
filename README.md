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
- Run command to install dependencies:

```
RUN yum install -y make gcc-c++ tar xz gzip
```

- [Install nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)
- Setup nginx to forward traffic from port 80 to 3000

```
server {
  listen 80;
  server_name tutorial;
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

- Configure ssl with nginx. Need to get a trusted CA as self-signed certificates generate warning on browsers

```
sudo mkdir /etc/ssl/private
sudo chmod 700 /etc/ssl/private
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```

When prompted for common name, enter the domain name for the certificate. Then run:

```
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

Next add this to nginx configureation. For more details, [click here](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-on-centos-7)

```
server {
    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;

    server_name server_IP_address;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
}
```

- start node server by executing the run-server script
