FROM node:14.17.0-alpine

WORKDIR /usr/src/app

COPY . /

RUN yarn --silent

RUN ls

# Step - When start the image, run the yarn start
CMD ["yarn", "workspace", "automations", "start"]