FROM node:14.17.0-alpine

WORKDIR /usr/src/app

COPY . /

RUN yarn --silent

VOLUME /automations/scripts

# Step - When start the image, run the yarn start
CMD ["yarn", "workspace", "automations", "start"]
