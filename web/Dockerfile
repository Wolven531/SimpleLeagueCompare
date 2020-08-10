FROM node:12-alpine as buildStage

# MORE INFO: https://mherman.org/blog/dockerizing-a-react-app/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install runtime
RUN npm install react-scripts@3.4.1 -g --silent

WORKDIR /app
# install app dependencies
COPY package* tsconfig* ./

RUN npm install --silent

# add app
COPY ./ ./

# start app
CMD ["npm", "start"]

# FROM node:12-alpine as buildStage
# # NOTE: more info on virtual here:
# # https://stackoverflow.com/questions/46221063/what-is-build-deps-for-apk-add-virtual-command/46222036
# RUN apk add --no-cache --virtual \
# # NOTE: native-deps must come first
# 	native-deps \
# 	git \
# 	vim
# RUN npm install --quiet node-gyp -g
# WORKDIR /
# COPY tsconfig* ./
# WORKDIR /app
# COPY web/package* web/tsconfig* web/public/ web/src/ ./
# RUN npm install
# # Note: the build is a separate step to take advantage of Docker layer caching
# RUN npm run build
# COPY dist ./
# RUN apk del \
# 	native-deps \
# 	git

# FROM node:12-alpine
# RUN apk add --no-cache --virtual vim
# WORKDIR /app
# COPY --from=buildStage /app ./
# ENV PORT=3001
# ENV REACT_APP_API_URL=http://localhost:3050
# EXPOSE 3001
# ENTRYPOINT [ "node", "main.js" ]
