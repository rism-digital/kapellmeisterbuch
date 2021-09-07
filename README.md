# Kapellmeisterbuch

This repository contains *frontend* and *backend* applications codebase and the whole *dataset* for Kapellmeisterbuch project.

```bash
/src              # frontend
/json-adapter     # backend
/public           # dataset
```



## Development
Pull the repository and make sure you have the basic components installed on your machine:

```bash
sudo apt install npm gulp
git clone https://github.com/rism-digital/kapellmeisterbuch
cd kapellmeisterbuch
npm install
```

### Frontend
Frontend application is a single page application built on top of react.js, you can launch the dev server with

```bash
npm start
```

### Backend
Backend application is a simple NodeJS app which serve API endpoints to retreive dataset. 

#### Installation
You have to init the server providing those commands:

```bash
cd json-adapter
npm install
```

#### Running on local machine
When you have installed all the node modules just run:

```bash
node server.js
```

and your server will respond locally on port `5000`.


## Deployment
Deployment requires configuring the gulpfile to connect to the server. The server must be already setup ad configured to have access from the host machine via ssh with key authentication.

### Environments
The gulpfile is designed to automate _staging_ or _production_ deployment. 

In order to let this work you have to create 2 different gulp configuration files.

```bash
# Create production config file
cp DUMMYgulp.config.js gulp.config.js

# Create staging config file
cp DUMMYgulp.config.js gulp.staging.config.js
```

Next, open your config files and customize them for your needs.


The environment target is specified by the *env* parameter. 

```bash
npm run deploy -- --env=<env>
```

Consider that deploying to the _staging_ env will generate a build in _development_ mode.



### Frontend configurations
Since the data is all retrived from backend application, it is necessary to configure API endpoints and the Manifest server in `webpack.config.js`.

```js
DIVA_BASE_MANIFEST_SERVER: JSON.stringify('your-server/manifest-path'),

JSON_BASE_SERVER: environment.production
    ? JSON.stringify('production-backend-api-endpoint')
    : JSON.stringify('staging-backend-api-endpoint')
```

### Deployment tasks

To deploy frontend, backend and dataset simply run

```bash
npm run deploy -- --env=<env>
```

you can otherwise use one of the following commands to update a peculiar aspect of the application

```bash
# Deploy frontend application
npm run deploy:fronted -- --env=<env>

# Deploy backend application
npm run deploy:backend -- --env=<env>

# Upload the dataset
npm run deploy:dataset -- --env=<env>
```

### Frontend Apache configuration
Apache requires no special configuration, excepy for a Rewrite to make the paths availabe in react

```apache
VirtualHost ip:80>
    ServerName my-host.com

    # Tell Apache and Passenger where your app's code directory is
    DocumentRoot /var/www/kapellmeisterbuck/frontend

    # Relax Apache security settings
    <Directory /var/www/kapellmeisterbuck/frontend>
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

### Backend Apache configuration
The backend application is deployed using `passenger` module for Apache.

```bash
# Install passenger if not there already
sudo apt-get install libapache2-mod-passenger passenger
```

And just create the virtual host:

Create a virtual host for apache:

```apache
<VirtualHost ip:80>
    ServerName search-server-url

    # Tell Apache and Passenger where your app's code directory is
    DocumentRoot /var/www/kapellmeisterbuch/backend
    PassengerAppRoot /var/www/kapellmeisterbuch/backend

    # Tell Passenger that your app is a Node.js app
    PassengerAppType node
    PassengerStartupFile server.js

    # Relax Apache security settings
    <Directory /var/www/kapellmeisterbuch/backend>
      Allow from all
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      #Require all granted
    </Directory>

</VirtualHost>
```