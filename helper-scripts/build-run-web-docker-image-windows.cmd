REM CD ..
REM docker build -t slc-web:1 -f .\web\Dockerfile .

CD ..\

docker build -f .\web\Dockerfile -t sample:dev .

docker run -it --rm -v %CD%:\app -v \app\node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true sample:dev
