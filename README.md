# Discord authentication

Authentication service for nginx auth_request. When authenticating users, username is used to lookup a text channel in a Discord server matching the username. If found, a one time password will be sent to that text channel.

Frontend used for authentication can be found [here](https://github.com/finnure/discord-auth-fe)

## Requirements

NodeJs 16.6+

Create a BOT and add it to your server [https://discord.com/developers/applications](https://discord.com/developers/applications)

Create a text channel for each user you want to authenticate. Channel name needs to be in all lowercase.
When logging in, users need to put in the name of the text channel they want their password sent to. If a user tries to login using general an Invalid input error will be shown.

## Settings

Environment variables used:

```bash
DISCORD_TOKEN
NODE_PORT default 8080
COOKIE_DOMAIN default localhost
COOKIE_MAX_AGE default 8 * 60 * 60 * 1000 (8 hours)
PASSWORD_LENGTH default 6
```

Cookies are secure by default and signed with DISCORD_TOKEN.

## Install and run

The following folder structure is needed for the docker container.

```bash
.
├─ docker-compose.yaml
├─ .env
├─ certs
│  ├─ cert.crt
│  ├─ dhparams.pem
│  └─ privkey.key
├─ nginx-conf
│  ├─ nginx.conf
│  ├─ proxy.conf
│  └─ ssl.conf
└─ ...
```

You can create the dhparams.pem file using this command

```bash
openssl dhparam -out certs/dhparams.pem 4096
```

cert.crt and privkey.key are the certificate files used for https

You can use the nginx.conf.example file to configure your secure endpoints. Example contains one secure endpoint
on http://192.168.0.11:1880 that can be accessed using https://red.example.com

.env file should hold the environment variables mentioned in [Settings](#settings)

Start the container using the following command

```bash
docker compose up -d
```

## Developement

- Clone the project
- Run npm install

To start a dev server

```bash
npm start
```

To build the project

```bash
npm build
```

To run the project in production

```bash
npm run prod
```

To rebuild the container, bump the version in docker-compose.yaml line 20 and run following command

```bash
docker compose build
```

I forgot to write tests, PR welcome :)
