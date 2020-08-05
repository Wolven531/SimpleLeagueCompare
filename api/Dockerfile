FROM node:12-alpine as buildStage
# ARG SOME_ARG
# NOTE: not sure what --virtual does below
RUN apk add --no-cache --virtual \
# NOTE: native-deps must come first
	native-deps \
	autoconf \
	automake \
	g++ \
	gcc \
	git \
	libgcc \
	libstdc++ \
	linux-headers \
	make \
	rsync && \
#	python \
	npm install --quiet node-gyp -g
# ENV SOME_ARG=$SOME_ARG
WORKDIR /app
COPY package* ./
RUN npm install
COPY dist ./

FROM node:12-alpine
WORKDIR /app
COPY --from=buildStage /app ./
ENV API_PORT=3050
EXPOSE 3050
ENTRYPOINT [ "node", "main.js" ]
