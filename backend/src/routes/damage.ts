import { Router } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const list = await prisma.damageRecord.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(list);
});

router.post('/', authenticate, async (req, res) => {
  const data = req.body;
  const rec = await prisma.damageRecord.create({ data });
  res.status(201).json(rec);
});

export default router;
