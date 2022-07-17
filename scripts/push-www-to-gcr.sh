VERSION=$1

docker buildx build --platform linux/x86_64 -t agenda/agenda-www:$VERSION ./www

docker tag agenda/agenda-www:$VERSION gcr.io/agenda-356500/agenda-www:$VERSION

docker push gcr.io/agenda-356500/agenda-www:$VERSION
