export const parseDoseMEqKg = (value: unknown): 0.5 | 1.0 => {
  return (typeof value === 'string' ? parseFloat(value) : value) as 0.5 | 1.0;
};

export const parseInfusionTimeHours = (value: unknown): 2 | 3 => {
  return (typeof value === 'string' ? parseInt(value, 10) : value) as 2 | 3;
};

export const parseOptionalNumber = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === 'string' ? parseFloat(value) : (value as number);
};

export const parseSelectedConcentrationMEqL = (value: unknown): number => {
  if (value === undefined) {
    return 0;
  }

  return typeof value === 'string' ? parseFloat(value) : (value as number);
};
