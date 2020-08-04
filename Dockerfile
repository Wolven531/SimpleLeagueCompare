FROM node:12-alpine as buildStage
# ARG SOME_ARG
RUN apk --no-cache add --virtual \
	autoconf \
	automake \
	g++ \
	gcc \
	git \
	libgcc \
	libstdc++ \
	linux-headers \
	make \
	native-deps \
	rsync && \
#	python && \
	npm install --quiet node-gyp -g
# ENV SOME_ENV_VAR=someval
# ENV SOME_ARG=$SOME_ARG
WORKDIR /app
COPY package* ./
RUN npm install
COPY dist ./
