import * as path from 'path';
import { HassApp } from '@haam/app';
import * as dotenv from 'dotenv';

dotenv.config();

if(!process.env.HOME_ASSISTANT_HOST)
  throw new Error("HOME_ASSISTANT_HOST not defined.")
if(!process.env.HOME_ASSISTANT_PORT)
  throw new Error("HOME_ASSISTANT_PORT not defined.")
if(!process.env.HOME_ASSISTANT_ACESS_TOKEN)
  throw new Error("HOME_ASSISTANT_ACESS_TOKEN not defined.")
  
const app = new HassApp({
  host: process.env.HOME_ASSISTANT_HOST ?? "",
  port: parseInt(process.env.HOME_ASSISTANT_PORT ?? "0"),
  token: process.env.HOME_ASSISTANT_ACESS_TOKEN ?? "",
  automationsFolderPath: path.join(__dirname, "scripts")
})

app.start();