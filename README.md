# OnStage Frontend Application

This is a react.js application that connects to the solr backend of onstage, to retreive documents from the index and the images. To run OnStage these elements are necessary:

* IIIF image server serving the images
* TEI files formatted with metagata for each program and pointers to the images and OCR data
* Solr Installation (see https://github.com/rism-ch/onstage-backend)
* Solr _aadapter_ ([see this paragraph](#solr-adapter))
* Manifest server (https://github.com/rism-ch/onstage-backend) to retreive IIIF documents from the TEI documents
* Optional static pages

## Basic installation and configuration

OnStage is made to be compiled on a host machine and deployed to the target server via gulp, so no installation of components on the server is necessary. The first step is setting up the local dev environment, secondly the apache server on the target.

### OnStage Development installation

#### Installation

pull the repo (remember! this is on a _local_ machine) and make sure you have the basic components installed:

```bash
sudo apt install npm gulp
git clone https://github.com/rism-ch/onstage-frontend
cd onstage-frontend
npm install
```

The static pages can be in `static/` in the `onstage-frontend` root directory. These will be static pages that are accessible in onstage-host/page/xxx (for example, a page called about.en.md in `static/` will be accessibe at `example.com/page/about`). Note that the pages are localized, so the name is in the format `name.code.md`, such as `about.en.md` or `about.de.md`. Missing language translations will show a "missing page" error.
The static pages can be on a different repo, for example

```bash
git clone https://github.com/rism-ch/onstage-texts static
```

Static pages are built atuomatically.

#### Build

Simply run in the onstage-frontend root:

```bash
npm run build
```

This will create `build/index.bundle.js` and `build/index.html` which can be copied to the server. It is best to deploy as described later.

#### Run in development

To run locally, it is necessary to change the connector server. Install `onstage-backend` and then set the `useRemoteServer` const to `false` on top of your `webpack.config.js` file. Remember to start solr with a complete index!

```js
const useRemoteServer = false;
```

Then start the `solr-adaptor` server running ```node solr-adaptor/server.js```

And finally ```npm start```

`npm start`

#### Deployment

Deployment requires configuring the gulpfile to connect to the server. The server must be already setup and installed (see later) and configured to have access from the host machine via ssh with key authentication. First copy the example file to the real one:

```bash
cp DUMMYgulp.config.js gulp.config.js
```

Next, customize it to the settings used. Since the ssh key password is inserted in clreartext, it is desirable to have a dedicated ssh key.

Some items to configure:

```
WEB_SERVER_BASE_PATH -> Installation top level path, /var/www
host -> target host
username -> user to log in as
passphrase -> ssh key passphrase
privateKey -> your local private key (unlocked by the passphrase), complete path!
```

The key must be in PEM format or it will not work.

```bash
ssh-keygen -m PEM -t rsa -b 4096 ...
````

Once gulp is configured, it should be possible to deploy to the target machine:

```bash
npm run deploy
```

The various components can be deployed separately:

```bash
npm run deploy # deploy all
npm run deploy:adapter # guess it, only adapter
npm run deploy:frontend # only frontend
```

### Application configuration

Since the TEI documents are all retrived from Solr, it is only necessary to configure the SOLR adaptor connector and the Manifest server in `webpack.config.js`

```js
DIVA_BASE_MANIFEST_SERVER: JSON.stringify('yourserver/manifest-path'),

SOLR_BASE_SERVER: environment.production || useRemoteServer
                ? JSON.stringify('your-search-adapter-url')
                : JSON.stringify(''),
```

### Apache configuration on server

Apache requires no special configuration, excepy for a Rewrite to make the paths availabe in react

```apache
VirtualHost ip:80>
    ServerName my-host.com

    # Tell Apache and Passenger where your app's code directory is
    DocumentRoot /var/www/onstage-frontend

    # Relax Apache security settings
    <Directory /var/www/onstage-frontend>
      Allow from all
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      #Require all granted

<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews
    </IfModule>

    RewriteEngine On

    # Serve Client Application
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_URI} ^(.).
    RewriteRule ^(.*)$ index.html [L]
</IfModule>

    </Directory>

    Header set Access-Control-Allow-Origin "*"


</VirtualHost>
```

### Clean up installation
Sometimes it is necessary to clean the installed modules, for example when updating:

```bash
rm -rf node_modules
npm install
```

## Solr Adapter
In order *_not_* to expose solr directly on the internet, a small adapter that filters the onstage queries and translates them to solr requests was created. The `solr-adapter` application is a small application that runs on the same machine as solr and connects to it throgh localhost (*note*: solr should always be bound to localhost and _never_ exposed to the internet!). The `solr-adapter` listens for incoming API calls and proxies them to solr. It will run as an apache wirtual host.
`solr-adapter` is deployed using `passenger`, which is handy if there are also rails applications.

```bash
# Install passenger if not there already
sudo apt-get install libapache2-mod-passenger passenger
```
From your host:

```bash
npm run deploy:adapter
```

it will copy the adapter to the configured directory in `gulp.config.js` (defaults to `/var/www/solr-adapter`)


Create a virtual host for apache:

```apache
<VirtualHost ip:80>
    ServerName search-server-url

    # Tell Apache and Passenger where your app's code directory is
    DocumentRoot /var/www/solr-adapter/
    PassengerAppRoot /var/www/solr-adapter

    # Tell Passenger that your app is a Node.js app
    PassengerAppType node
    PassengerStartupFile server.js

    # Relax Apache security settings
    <Directory /var/www/solr-adapter>
      Allow from all
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      #Require all granted
    </Directory>

</VirtualHost>
```

No configuration is really necessary, but make sure `server.js` point to the correct solr installation:

```js
const SOLR_URL_PRFIX = 'http://localhost:8984';
```



