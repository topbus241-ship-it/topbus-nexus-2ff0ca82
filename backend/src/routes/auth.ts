import { Router } from 'express';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const MASTER_EMAIL = (process.env.MASTER_EMAIL || 'master@local').trim().toLowerCase();
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || '';

const VALID_ROLES: UserRole[] = [
  'master',
  'manutencao',
  'portaria',
  'operacao',
  'financeiro',
  'rh',
  'abastecimento',
  'frota',
];

function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}

function signUser(user: {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  sectorId?: string | null;
}) {
  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sectorId: user.sectorId ?? null,
    },
    JWT_SECRET,
    { expiresIn: '8h' },
  );

  return { token, user };
}

router.post('/login', async (req, res) => {
  const { name, role, email, password } = req.body;

  if (!role || !name) {
    return res.status(400).json({ error: 'name and role required' });
  }

  const roleValue = String(role).trim();

  if (!isValidRole(roleValue)) {
    return res.status(400).json({ error: 'invalid role' });
  }

  const normalizedRole = roleValue as UserRole;
  const userEmail =
    normalizedRole === 'master'
      ? (email ? String(email).trim().toLowerCase() : MASTER_EMAIL)
      : (email ? String(email).trim().toLowerCase() : `${normalizedRole}@local`);

  if (normalizedRole === 'master') {
    if (!MASTER_PASSWORD) {
      return res.status(503).json({ error: 'master access not configured' });
    }

    const receivedPassword = password ? String(password) : '';

    if (userEmail !== MASTER_EMAIL || receivedPassword !== MASTER_PASSWORD) {
      return res.status(403).json({ error: 'invalid master credentials' });
    }

    return res.json(
      signUser({
        id: 'master-executive',
        name: name || 'Administrador Master',
        email: MASTER_EMAIL,
        role: 'master',
        sectorId: null,
      }),
    );
  }

  try {
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email: userEmail,
          role: normalizedRole,
        },
      });
    }

    return res.json(
      signUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sectorId: user.sectorId,
      }),
    );
  } catch {
    return res.json(
      signUser({
        id: `${normalizedRole}-local`,
        name,
        email: userEmail,
        role: normalizedRole,
        sectorId: null,
      }),
    );
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    if (payload.sub === 'master-executive') {
      return res.json({
        id: payload.sub,
        name: payload.name || 'Administrador Master',
        email: payload.email || MASTER_EMAIL,
        role: 'master',
        sectorId: null,
      });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });

      if (user) {
        return res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          sectorId: user.sectorId,
        });
      }
    } catch {
      // fallback sem banco
    }

    return res.json({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      sectorId: payload.sectorId ?? null,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
