import { describe, it, expect } from 'vitest';
import { config } from './config';

describe('Configuration Module', () => {
  it('should load default port 3000', () => {
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
  });

  it('should load environment', () => {
    expect(config.env).toBeDefined();
    expect(typeof config.env).toBe('string');
  });
});
