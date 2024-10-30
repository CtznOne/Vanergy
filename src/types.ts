export interface Panel {
  _id: string;
  model: string;
  watts: number;
  volts: number;
  amps: number;
  width: number;
  height: number;
}

export interface String {
  id: string;
  name: string;
  panels: Panel[];
  type: 'series' | 'parallel';
}

export interface MPPT {
  _id: string;
  model: string;
  maxVolts: number;
  maxAmps: number;
  maxWatts: number;
}

export interface Inverter {
  _id: string;
  model: string;
  watts: number;
  peakWatts: number;
  efficiency: number;
}

export interface Battery {
  _id: string;
  model: string;
  amphhours: number;
  type: 'Flooded' | 'AGM' | 'Lithium';
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

export interface Charger {
  _id: string;
  model: string;
  inputVoltageRange: {
    min: number;
    max: number;
  };
  outputVoltage: number;
  maxOutputCurrent: number;
  efficiency: number;
}