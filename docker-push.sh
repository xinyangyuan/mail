# Tag docker images
docker tag xinyangyuan/mail-nginx:latest docker.pkg.github.com/xinyangyuan/mail/nginx:latest
docker tag xinyangyuan/mail-frontend:latest docker.pkg.github.com/xinyangyuan/mail/frontend:latest
docker tag xinyangyuan/mail-backend:latest docker.pkg.github.com/xinyangyuan/mail/backend:latest

# Push images to github repositry
docker push docker.pkg.github.com/xinyangyuan/mail/nginx:latest
docker push docker.pkg.github.com/xinyangyuan/mail/frontend:latest
docker push docker.pkg.github.com/xinyangyuan/mail/backend:latest
