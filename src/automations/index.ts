import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Haas } from '@haas/core';
import devices from './devices';
import { AppSubscription } from './types/AppSubscription';

const main = async () => {
  dotenv.config({
    path: ".env"
  });
  const haHost = process.env.HOME_ASSISTANT_HOST ?? ""
  const haPort = parseInt(process.env.HOME_ASSISTANT_PORT ?? "0")
  const haAccessToken = process.env.HOME_ASSISTANT_ACESS_TOKEN ?? ""

  const haas = new Haas(haHost, haPort, haAccessToken);

  const files: string[] = [];
  const getFilesRecursively = (directory: string) => {
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory()) {
        getFilesRecursively(absolute);
      } else {
        files.push(absolute);
      }
    }
  };
  getFilesRecursively("./scripts")

  //Run each script
  files.forEach(async (file) => {
    const fileImport = await import(`./${file}`);
    const subscription = await fileImport.default({
      haas,
      devices
    }) as AppSubscription;

    haas.subscribe({
      id: path.basename(file).split('_')[0],
      name: path.basename(file),
      config: subscription.subscription,
      handler: subscription.handler,
      condition: subscription.condition
    })
  })

  await haas.start();

  if(process.argv.indexOf("--run") > 0){
    const subscriptionId = process.argv[process.argv.indexOf("--run") + 1];
    haas.triggerSubscriptionById(subscriptionId)
  }
}

main();