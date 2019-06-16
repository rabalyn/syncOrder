# syncOrder

Happy cloning and forking!

## Get Started - tldr;

```
git clone https://github.com/rabalyn/syncOrder.git
cd syncOrder/backend
npm install
npm start
cd ../frontend
npm run install
npm run serve
```

## What you get

A simple express-app backend with vue/vue-bootstrap frontend to coordinate ordering in your office. The text is hard coded in german and there is the menu card of our weekly pizza delivery.

You are welcome to customize for your needs :)

The textfields and table are updated in realtime via websockets - thank you [socket.io](https://socket.io/)!

## Structure of data JSON files

The data serialized every 5 minutes to the \*.json files in the \$root/data directory

Structure of the files:

```
const metaObj = {
    "dateString":"2019-06-13",
    "caller":"foo",
    "collector":"bar",
    "collectTime":"12:22"
}
```

The data is stupidly populated.
The structure of the object is

```
const paied = [
  "15",   // first order
  0,      // second order
  null    // 'sum' row
]
```

The orders are not stored on every change, only when the user is saving / updating the order:

```
const orders = [
    {
        "name": "test",
        "meal": "Margherita",
        "mealPrice": 7,
        "extras": [
            {
                "number": 4,
                "name": "Parmaschinken",
                "ingredients": [
                    "Parmaschinken"
                ],
                "price": 2,
                "type": "add"
            },
            {
                "number": 1,
                "name": "Gorgonzola",
                "ingredients": [
                    "Gorgonzola"
                ],
                "price": 1.5,
                "type": "add"
            },
            {
                "name": "ohne Käse",
                "price": "",
                "type": "remove"
            }
        ],
        "extrasPrice": 3.5,
        "orderId": 1
    },
    {
        "name": "test2",
        "meal": "Frutti di Mare",
        "mealPrice": 9.8,
        "extras": [],
        "extrasPrice": 0,
        "orderId": 2
    }
]
```

Number of the next table row.

```
const tableId = 9
```

## Example configuration for nginx reverse proxy

```
server {
    listen        80;
    listen        [::]:80;
    server_name   $FQDN;
    access_log    $PATH_TO_ACCESSLOG main;
    rewrite       ^   https://$server_name$request_uri? permanent;
}

server {
    listen        443 ssl http2;
    listen        [::]:443 ssl http2;
    server_name   $FQDN;
    access_log    $PATH_TO_ACCESSLOG main;

    ssl                                   on;
    ssl_certificate                       $PATH_TO_SSL_KEYCHAIN;
    ssl_certificate_key                   $PATH_TO_SSL_PRIVATEKEY;

    add_header Strict-Transport-Security  "max-age=31536000; includeSubDomains;";

    etag off;
    add_header Pragma "public";
    add_header Cache-Control "public";

    brotli on;
    brotli_types text/css text/x-component application/x-javascript application/javascript text/javascript text/x-js text/richtext image/svg+xml text/plain text/xsd text/xsl text/xml image/x-icon application/octet-stream;

    gzip on;
    gzip_types text/css text/x-component application/x-javascript application/javascript text/javascript text/x-js text/richtext image/svg+xml text/plain text/xsd text/xsl text/xml image/x-icon application/octet-stream;

    expires max;

    location /panf_live/ {
      proxy_http_version        1.1;

      proxy_set_header          Upgrade                 $http_upgrade;
      proxy_set_header          Connection              "upgrade";

      proxy_pass                http://127.0.0.1:$PORT/socket.io/;
    }

    location /api/ {
      proxy_set_header          X-Real-IP               $remote_addr;
      proxy_set_header          X-Forwarded-For         $proxy_add_x_forwarded_for;
      proxy_set_header          X-Forwarded-Proto       $scheme;
      proxy_pass_header         Set-Cookie;
      proxy_set_header          Host                    $http_host;

      proxy_pass                http://127.0.0.1:$PORT/;
      proxy_buffering           off;

      proxy_redirect            off;
    }

    location / {
        alias $PATH_TO_PROJECT/syncOrder/frontend/dist;
    }

    location /panf {
        alias $PATH_TO_PROJECT/syncOrder/frontend/dist;
    }

    location /js {
        alias $PATH_TO_PROJECT/syncOrder/frontend/dist/js;
    }

    location /css {
        alias $PATH_TO_PROJECT/syncOrder/frontend/dist/css;
    }

    location /img {
        alias $PATH_TO_PROJECT/syncOrder/frontend/dist/img;
    }
}

```
