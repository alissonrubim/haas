# Home Assistant Automation Manager
Home Assistant Automation Manager, or Haam, is a project developed to make it easier to write Javascript/Typescript code to automate your home, using Home Assistant as a base.

Compared with other solutions out there, Haam makes it possible to you to simply create a folder containing .ts/.js scripts and run it as automation for your home. As a plus, you can access and check automation data through a nice user interface.

The idea is to make it easy to write automation in your way. You just need a function that returns a configuration object and that's it.

## Getting start

The project run `NodeJs` with `Typescript`. To start your project, you don't need to do much, just run `yarn` to install the dependencies.
After running the command `yarn start` should already start up the project for you.


## Deploying to DockerHub

Haam is currently deployed at the DockerHub to be used by multiple people, easily, without too much arm. So in every release, for now, we need to deploy Haam manually to Docker Hub. These are the steps to do it so:

### 1. Build image
`docker build . --tag alissonrubim/home-assistant-automation-manager:latest`

### 2. Pushing to DockerHub
`docker push alissonrubim/home-assistant-automation-manager:latest`

