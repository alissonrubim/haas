import { Haas } from '@haas/core';
import devices from '../devices';

export interface App {  
  haas: Haas,
  devices: typeof devices
}