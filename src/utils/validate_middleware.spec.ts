import { describe, it, expect, vi } from 'vitest';
import { validate } from './validate_middleware';
import { z } from 'zod';
import { Request, Response } from 'express';

describe('Validation Middleware', () => {
  it('should call next if validation passes', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
      }),
    });

    const middleware = validate(schema);

    const req = {
      body: { name: 'Test' },
      query: {},
      params: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with formatted errors if validation fails', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string({ error: 'Name is required' }),
        age: z.number({ error: 'Age is required' }),
      }),
    });

    const middleware = validate(schema);

    const req = {
      body: { name: 123 }, // invalid name type, missing age
      query: {},
      params: {},
    } as unknown as Request;

    const jsonMock = vi.fn();
    const res = {
      status: vi.fn().mockReturnThis(),
      json: jsonMock,
    } as unknown as Response;

    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Error de validación en la petición',
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'name' }),
          expect.objectContaining({ field: 'age' }),
        ]),
      }),
    );
  });
});
