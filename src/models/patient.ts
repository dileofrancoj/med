export type VenousAccess = 'peripheral' | 'central';
export type Sex = 'male' | 'female';

export interface Patient {
  weight: number;
  age?: number;
  sex?: Sex;
  diagnosis?: string;
  venousAccess?: VenousAccess;
}
