# Mail

[![Actions Status](https://github.com/xinyangyuan/mail/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/xinyangyuan/mail/actions)
[![Shockmail Website](https://img.shields.io/website?down_color=lightgrey&down_message=offline&label=Shockmail%20Website&up_color=17d151&up_message=online&url=http%3A%2F%2Fshockmail.today)](http://www.shockmail.today)
[![Shockmail Demo App](https://img.shields.io/website?down_color=lightgrey&down_message=offline&label=Shockmail%20Demo%20App&up_color=17d151&up_message=online&url=http%3A%2F%2Fmail-env.9kc4f5k7dp.ap-northeast-1.elasticbeanstalk.com%2Fsignin)](http://mail-env.9kc4f5k7dp.ap-northeast-1.elasticbeanstalk.com)

This project is build with node-js, express, and mongdb (backend), and angular framework (frontend).

## Getting Started

<pre>
Visit our website: <a href="http://www.shockmail.today" title="website">shockmail.today</a>
Visit internal testing demo app: <a href="http://mail-env.9kc4f5k7dp.ap-northeast-1.elasticbeanstalk.com" title="testing website">shockmail.test</a>
</pre>

## For Developer

### Development

#### - Start client app and server api

```bash
$ npm run start:client # port 4200
$ npm run start:server # port 3000
```

#### - Stripe webhook events

```bash
$ stripe listen --forward-to localhost:3000/api/stripe/webhook
```

#### - Serve via docker

```bash
$ docker-compose up --build
```

### Production

#### - Build production images

```bash
$ docker-compose -f docker-compose.prod.yml build
```

#### - Serve docker production container network

```bash
$ docker-compose -f docker-compose.prod.yml up --build # port 80
```

### Deployment

<pre>
Edit and update <a href="https://github.com/xinyangyuan/mail/blob/master/Dockerrun.aws.json" title="Dockerrun.aws.json File">Dockerrun.aws.json</a> file, and deploy to <a href="https://aws.amazon.com/elasticbeanstalk/" title="Dockerrun.aws.json File">aws elastic beanstalk</a>.
</pre>

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/xinyangyuan/mail/tags).
