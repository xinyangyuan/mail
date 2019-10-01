# Build docker images
docker build -t xinyangyuan/mail-nginx ./nginx
docker build -t xinyangyuan/mail-frontend ./frontend
docker build -t xinyangyuan/mail-backed ./backend

