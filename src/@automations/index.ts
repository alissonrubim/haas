import { HassApp } from '@haas/app';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new HassApp({
  host: process.env.HOME_ASSISTANT_HOST ?? "",
  port: parseInt(process.env.HOME_ASSISTANT_PORT ?? "0"),
  token: process.env.HOME_ASSISTANT_ACESS_TOKEN ?? "",
  automationsFolderPath: '../@automations/scripts'
})

app.start();