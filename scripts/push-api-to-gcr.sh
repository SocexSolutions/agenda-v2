
VERSION=$1

docker buildx build --platform linux/x86_64 -t agenda/agenda-api:$VERSION ./www

docker tag agenda/agenda-api:$VERSION gcr.io/agenda-356500/agenda-api:$VERSION

docker push gcr.io/agenda-356500/agenda-api:$VERSION
