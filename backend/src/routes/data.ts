import { Router } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// Map simple resource names to prisma queries
const resourceMap: Record<string, any> = {
  vehicles: {
    findMany: () => prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) => prisma.vehicle.create({ data }),
    update: (id: string, data: any) => prisma.vehicle.update({ where: { id }, data }),
  },
  damageRecords: {
    findMany: () => prisma.damageRecord.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) => prisma.damageRecord.create({ data }),
    update: (id: string, data: any) => prisma.damageRecord.update({ where: { id }, data }),
  },
  insights: {
    findMany: () => prisma.insight.findMany({ orderBy: { createdAt: 'desc' } }),
    create: (data: any) => prisma.insight.create({ data }),
    update: (id: string, data: any) => prisma.insight.update({ where: { id }, data }),
  },
  uploadedDocuments: {
    findMany: () => prisma.uploadedDocument.findMany({ orderBy: { uploadedAt: 'desc' } }),
    create: (data: any) => prisma.uploadedDocument.create({ data }),
    update: (id: string, data: any) => prisma.uploadedDocument.update({ where: { id }, data }),
  },
};

router.get('/:resource', authenticate, async (req, res) => {
  const { resource } = req.params;
  const resourceKey = Array.isArray(resource) ? String(resource[0] ?? '') : String(resource ?? '');
  const entry = (resourceMap as Record<string, any>)[resourceKey];
  if (!entry) return res.json([]);
  const list = await entry.findMany();
  res.json(list);
});

router.post('/:resource', authenticate, async (req, res) => {
  const { resource } = req.params;
  const resourceKey = Array.isArray(resource) ? String(resource[0] ?? '') : String(resource ?? '');
  const entry = (resourceMap as Record<string, any>)[resourceKey];
  if (!entry) return res.status(404).json({ error: 'resource_not_found' });
  const created = await entry.create(req.body);
  res.status(201).json(created);
});

router.put('/:resource/:id', authenticate, async (req, res) => {
  const { resource, id } = req.params;
  const resourceKey = Array.isArray(resource) ? String(resource[0] ?? '') : String(resource ?? '');
  const entry = (resourceMap as Record<string, any>)[resourceKey];
  if (!entry || !entry.update) return res.status(404).json({ error: 'update_not_supported' });
  const updated = await entry.update(id, req.body);
  res.json(updated);
});

export default router;
