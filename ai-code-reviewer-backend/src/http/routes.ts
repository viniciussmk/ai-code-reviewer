import { Router } from 'express';
import { z } from 'zod';
import CodeReviewService from '../services/codeReviewService';
import { REVIEW_STACKS, REVIEW_FOCUSES } from '../domain/reviewRequest';

const routes = Router();
const service = new CodeReviewService();

const reviewSchema = z.object({
  diffOrCode: z.string().min(10),
  stack: z.enum(REVIEW_STACKS),
  reviewFocuses: z
    .array(z.enum(REVIEW_FOCUSES))
    .min(1, { message: 'Selecione pelo menos um foco de revisão.' }),
  context: z.string().max(1000).optional(),
});

routes.get('/health', (_req, res) => {
  return res.json({ status: 'ok' });
});

routes.post('/review', async (req, res) => {
  const parseResult = reviewSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid payload',
      details: parseResult.error.flatten(),
    });
  }

  try {
    const result = await service.review(parseResult.data);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to review code' });
  }
});

export { routes };
