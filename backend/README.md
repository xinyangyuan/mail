# Mail Backend

This backend service of mail application is a nodejs express application, and

- database: MongoDB hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- filesystem: [AWS S3](https://aws.amazon.com/s3/)
- email: [Ethereal](https://ethereal.email/) for development environment, and [Sendgrid](https://sendgrid.com/) for production.
- payment: [Stripe](https://stripe.com/)

## Main Architecture

The service mainly consists model, controller, and service layers; middlewares are placed as general wrapper on top of controller layer.

TODO: controller and service layers need further functional separation and model layer needs to refactor to remove over dependency on ORM

## Development Server

```bash
$ npm run dev # port 3000
```
