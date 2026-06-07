export type VenousAccess = 'peripheral' | 'central';
export type SEX = 'male' | 'female';

export interface Patient {
  weight: number;
  age?: number;
  sex?: SEX;
  diagnosis?: string;
  venousAccess?: VenousAccess;
}
