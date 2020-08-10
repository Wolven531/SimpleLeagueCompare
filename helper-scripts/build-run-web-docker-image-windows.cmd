CD ..\web\

docker build -f .\Dockerfile -t slc-web:1 .

docker run -it --rm -v %CD%:\app -v \app\node_modules -p 3001:3001 -e CHOKIDAR_USEPOLLING=true slc-web:1
