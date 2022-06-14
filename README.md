# Home Assistant Automation Manager
 Home Assistant Automation Manager, or Haam, is a project developed to make it easier to write Javascript/Typescript code to automate your home.

 Comparing with other solutions out there, Haam makes it possible to you to simply create a folder containing .ts/.js scripts and run it as automation for your home.

  The idea is to make it easy to write automations on your own way. You just need a function that returns a configuration object and that's it.

## Getting start
  `yarn`

## Deploying to DockerHub

### Build image
`docker build . --tag alissonrubim/home-assistant-automation-manager:latest`

### Pushing to DockerHub
 `docker push alissonrubim/home-assistant-automation-manager:latest`