export function applyBR001(loc: string, sev: string) {
  if (sev === 'V1') return { autoPIR: true, stopLine: loc === 'Line' };
  if (sev === 'V2') return { autoPIR: true, stopLine: false };
  return { autoPIR: false, stopLine: false };
}
