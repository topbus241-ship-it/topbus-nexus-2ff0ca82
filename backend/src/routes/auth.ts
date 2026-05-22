import { Router } from 'express';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/login', async (req, res) => {
  const { name, role, email } = req.body;
  if (!role || !name) return res.status(400).json({ error: 'name and role required' });

  const userEmail = email ?? `${role}@local`;

  let user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    user = await prisma.user.create({ data: { name, email: userEmail, role } });
  }

  const token = jwt.sign({ sub: user.id, role: user.role, sectorId: user.sectorId ?? null }, JWT_SECRET, { expiresIn: '8h' });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, sectorId: user.sectorId } });
});

router.get('/me', async (req, res) => {
  const authHeader = req.header('authorization');
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, sectorId: user.sectorId });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
