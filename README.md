# Mail

This project is build with node-js, express, and mongdb (backend), and angular framework (frontend).

## Getting Started

<pre>
Visit our website: <a href="https://www.shockmail.today" title="website">shockmail.today</a>
Visit internal testing site: <a href="http://mail-env.9kc4f5k7dp.ap-northeast-1.elasticbeanstalk.com" title="testing website">shockmail.test</a>
</pre>


## For Developer

### Development server

```bash
$ npm run start:client
$ npm run start:server
```

### Docker-compose [development]

```bash
$ docker-compose up --build
```

### Build production images

```bash
$ docker-compose -f docker-compose.prod.yml build
```

### Deployment

<pre>
Edit and update <a href="https://github.com/xinyangyuan/mail/blob/master/Dockerrun.aws.json" title="Dockerrun.aws.json File">Dockerrun.aws.json</a> file, and deploy to <a href="https://aws.amazon.com/elasticbeanstalk/" title="Dockerrun.aws.json File">aws elastic beanstalk</a>.
</pre>

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/xinyangyuan/mail/tags).
