import { Router } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const list = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(list);
});

router.post('/', authenticate, async (req, res) => {
  const data = req.body;
  const v = await prisma.vehicle.create({ data });
  res.status(201).json(v);
});

export default router;
