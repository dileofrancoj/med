import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
      });

      req.body = parsed.body;
      // @ts-expect-error ignore query
      req.query = parsed.query;

      return next();
    } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación en la petición',
        // Change error.errors to error.issues 🌟
        errors: error.issues.map((err) => ({
          field: err.path.slice(1).join('.'),
          message: err.message,
        })),
      });
    }

      return res.status(500).json({ error: 'Error interno en la validación' });
    }
  };
};
