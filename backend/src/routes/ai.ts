import { Router } from 'express';
import { generateFromOllama } from '../services/ai';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/insights', authenticate, async (req, res) => {
  const { prompt, title, category } = req.body;
  try {
    const out = await generateFromOllama(prompt);
    const description = typeof out === 'string' ? out : JSON.stringify(out);
    const insight = await prisma.insight.create({ data: { title: title ?? 'AI Insight', description, severity: 'info', category: category ?? 'ai' } });
    res.json({ insight, raw: out });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'ai_error' });
  }
});

export default router;
