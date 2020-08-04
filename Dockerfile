FROM node:12-alpine as buildStage
# ARG SOME_ARG
# NOTE: not sure what --virtual does below
RUN apk add --no-cache --virtual \
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
#	python \
	npm install --quiet node-gyp -g
# ENV SOME_ENV_VAR=someval
# ENV SOME_ARG=$SOME_ARG
WORKDIR /app
COPY package* ./
RUN npm install
COPY dist ./

FROM node:12-alpine
WORKDIR /app
COPY --from=buildStage /app ./
ENV PORT="3000"
EXPOSE 3000
ENTRYPOINT [ "node", "main.js" ]
