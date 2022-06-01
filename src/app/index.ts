import * as fs from 'fs';
import * as path from 'path';
import { Haas } from '@haas/core';
import { AppSubscription } from './types/AppSubscription';

export interface HassAppConfig {
  host: string,
  port: number,
  token: string,
  automationsFolderPath: string
}

export class HassApp {
  #config: HassAppConfig;

  constructor(config: HassAppConfig){
    this.#config = config;
  }

  public async start(){
    const haas = new Haas(this.#config.host, this.#config.port, this.#config.token);

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
    getFilesRecursively(this.#config.automationsFolderPath)

    //Run each script
    files.forEach(async (file) => {
      const id = path.basename(file).split('_')[0];

      const fileImport = await import(`./${file}`);
      const subscription = await fileImport.default({
        haas
      }) as AppSubscription;

      haas.subscribe({
        id: id,
        name: path.basename(file),
        config: subscription.subscription,
        handler: subscription.handler,
        condition: subscription.condition
      })
    })

    await haas.start();
  }
}