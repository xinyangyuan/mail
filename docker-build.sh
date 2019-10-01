# Build docker images
echo 'Creating docker images..'
docker build -t xinyangyuan/mail-nginx ./nginx
docker build -t xinyangyuan/mail-frontend ./frontend
docker build -t xinyangyuan/mail-backed ./backend
echo 'Dokcer images created successfully.'

# Push images to docker hub
echo 'Push docker images to docker hub..'
docker push xinyangyuan/mail-nginx
docker push xinyangyuan/mail-frontend
docker push xinyangyuan/mail-backed
echo 'Docker images pushed successfully.'