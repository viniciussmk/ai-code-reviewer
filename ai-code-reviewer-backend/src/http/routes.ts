import { Router } from 'express';
import { z } from 'zod';
import CodeReviewService from '../services/codeReviewService';
import type { ReviewRequest } from '../domain/reviewRequest';

const routes = Router();
const service = new CodeReviewService();

// GET /health
routes.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

// Schema do body já tipado como ReviewRequest
const schema: z.ZodType<ReviewRequest> = z.object({
  diffOrCode: z.string().min(10),
  stack: z.enum(['flutter', 'react', 'generic']),
  reviewFocuses: z
    .array(
      z.enum([
        'clean_architecture',
        'solid',
        'tests',
        'performance',
        'readability',
        'security',
      ]),
    )
    .min(1, { message: 'Selecione pelo menos um foco de revisão.' }),
  context: z.string().max(1000).optional(),
});

routes.post('/review', async (req, res) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid payload',
      details: parsed.error.flatten(),
    });
  }

  try {
    // aqui o parsed.data já é ReviewRequest certinho
    const result = await service.review(parsed.data);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to review code' });
  }
});

export { routes };
