import { Panel } from '../types';

export function getRecommendedMPPT(panels: Panel[], type: 'series' | 'parallel') {
  if (panels.length < 2) return null;

  let totalVolts = 0;
  let totalAmps = 0;
  let totalWatts = 0;

  if (type === 'series') {
    totalVolts = panels.reduce((sum, p) => sum + p.volts, 0);
    totalAmps = panels[0]?.amps || 0;
    totalWatts = panels.reduce((sum, p) => sum + p.watts, 0);
  } else {
    totalVolts = panels[0]?.volts || 0;
    totalAmps = panels.reduce((sum, p) => sum + p.amps, 0);
    totalWatts = panels.reduce((sum, p) => sum + p.watts, 0);
  }

  return { totalVolts, totalAmps, totalWatts };
}