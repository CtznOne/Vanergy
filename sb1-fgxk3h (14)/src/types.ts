import { Panel, String, MPPT, Appliance, Location } from './types';

export interface Panel {
  id: string;
  model: string;
  watts: number;
  volts: number;
  amps: number;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
}

export interface String {
  id: string;
  name: string;
  panels: Panel[];
  type: 'series' | 'parallel';
}

export interface MPPT {
  id: string;
  model: string;
  maxVolts: number;
  maxAmps: number;
  maxWatts: number;
}

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
}

export interface Location {
  peakSunHours: number;
}

export interface Inverter {
  id: string;
  model: string;
  watts: number;
  peakWatts: number;
  efficiency: number;
}