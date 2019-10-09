# Mail

This project is build with node-js, express, and mongdb (backend), and angular framework (frontend).

## Getting Started

## For Developer

### Development server

```bash
npm run start:client
npm run start:server
```

### Docker-compose [development]

```bash
docker-compose up --build
```

### Build production images

```bash
docker-compose -f docker-compose.prod.yml build
```

### Deployment

```
Edit and upload to aws [Dockerrun](https://github.com/xinyangyuan/mail/blob/master/Dockerrun.aws.json)
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/xinyangyuan/mail/tags).
