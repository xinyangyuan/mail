# Build docker images
echo 'Creating docker images..'
docker build -t xinyangyuan/mail-nginx ./nginx
docker build -t xinyangyuan/mail-frontend ./frontend
docker build -t xinyangyuan/mail-backend ./backend
echo 'Dokcer images created successfully.'
