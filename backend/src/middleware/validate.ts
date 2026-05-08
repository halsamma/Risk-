import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ZodSchema } from 'zod';

// express-validator middleware runner
export function validate(chains: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(chains.map(chain => chain.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ error: 'Validation failed', details: errors.array().map(e => ({ field: e.type === 'field' ? e.path : 'general', message: e.msg })) });
      return;
    }
    next();
  };
}

// Zod schema validation middleware
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
      res.status(422).json({ error: 'Validation failed', details });
      return;
    }
    req.body = result.data;
    next();
  };
}
