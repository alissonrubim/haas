# Home Assistant Automation Manager
Home Assistant Automation Manager, or Haam, is a project developed to make it easier to write Javascript/Typescript code to automate your home.

Compared with other solutions out there, Haam makes it possible to you to simply create a folder containing .ts/.js scripts and run it as automation for your home.

The idea is to make it easy to write automation in your own way. You just need a function that returns a configuration object and that's it.

## Getting start

The project run `NodeJs` with `Typescript`. To start your own project, you don't need to do much, just run `yarn` to install the dependencies.


## Deploying to DockerHub

### 1. Build image
`docker build . --tag alissonrubim/home-assistant-automation-manager:latest`

### 2. Pushing to DockerHub
`docker push alissonrubim/home-assistant-automation-manager:latest`

