FROM node:12-alpine as buildStage
# NOTE: more info on virtual here:
# https://stackoverflow.com/questions/46221063/what-is-build-deps-for-apk-add-virtual-command/46222036
RUN apk add --no-cache --virtual \
# NOTE: native-deps must come first
# 	native-deps \
# 	git \
	vim
RUN npm install --quiet node-gyp -g
WORKDIR /app
COPY package* ./
RUN npm install --silent
COPY dist ./
# RUN apk del \
# 	native-deps \
# 	git

FROM node:12-alpine
RUN apk add --no-cache --virtual vim
WORKDIR /app
COPY --from=buildStage /app ./
ENV API_PORT=3050
EXPOSE 3050
ENTRYPOINT [ "node", "main.js" ]
