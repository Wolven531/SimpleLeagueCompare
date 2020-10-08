FROM node:12-alpine as buildStage

# NOTE: add `/app/node_modules/.bin` to $PATH
#   uses colon (':') to separate slugs - image is based on linux;
#   in Windows, semicolon (';') is used instead
ENV PATH /app/node_modules/.bin:$PATH

# NOTE: more info on virtual here:
# https://stackoverflow.com/questions/46221063/what-is-build-deps-for-apk-add-virtual-command/46222036
RUN apk add --no-cache --virtual \
# NOTE: native-deps must come first
# 	native-deps \
# 	git \
	vim

# install runtime
# RUN npm install node-gyp -g --silent

WORKDIR /app
# install app dependencies
COPY package* tsconfig* ./

RUN npm install --silent

# COPY dist ./
# add app
COPY ./ ./

RUN echo "finished build stage..."
RUN ls -la
# RUN apk del \
# 	native-deps \
# 	git

FROM node:12-alpine

RUN apk add --no-cache --virtual vim
WORKDIR /app
COPY --from=buildStage /app ./
ENV API_PORT=3050
EXPOSE 3050
# ENTRYPOINT [ "node", "main.js" ]

# NOTE: next line means this image should only execute npm CLI (via `npm run`)
ENTRYPOINT [ "npm", "run" ]
# NOTE: next line means "start" is default script to run, but can be overridden (e.g. test, install, etc)
CMD [ "start" ]
