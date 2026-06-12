export type VenousAccess = 'peripheral' | 'central';

export interface Patient {
  weight: number;
  diagnosis?: string;
  venousAccess?: VenousAccess;
}
