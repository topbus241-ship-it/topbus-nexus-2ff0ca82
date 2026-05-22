import { Router } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: path.join(process.cwd(), 'uploads') });

// webhook endpoint (unauthenticated by Typebot secret in header or can be protected)
router.post('/webhook', async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const conv = await prisma.typebotConversation.create({ data: {} });
    await prisma.typebotMessage.create({ data: { conversationId: conv.id, sender: 'external', content: JSON.stringify(message) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

// Public init: collaborator submits ID (chapa or email). Returns sector and chat buttons.
router.post('/init-public', async (req, res) => {
  const { collaboratorId } = req.body;
  if (!collaboratorId) return res.status(400).json({ error: 'missing_id' });

  // Try find driver by chapa
  let sectorId: string | null = null;
  const driver = await prisma.driver.findFirst({ where: { chapa: collaboratorId } });
  if (driver) {
    sectorId = 'operacao';
  } else {
    // try find user by email or id
    const user = await prisma.user.findFirst({ where: { OR: [{ email: collaboratorId }, { id: collaboratorId }] } });
    if (user) sectorId = user.sectorId ?? null;
  }

  // fallback to portaria
  if (!sectorId) sectorId = 'portaria';

  // Load chat config for sector
  const cfg = await prisma.chatConfig.findFirst({ where: { sectorId } });
  const buttons = cfg ? cfg.buttons : [{ label: 'Registrar avaria', next: 'avaria' }, { label: 'Enviar documento', next: 'doc' }];

  const conv = await prisma.typebotConversation.create({ data: { sectorId } });

  res.json({ conversationId: conv.id, sectorId, buttons });
});

// Public message (no auth) — minimal: persist and return a bot confirmation
router.post('/public-message', async (req, res) => {
  const { conversationId, content, option } = req.body;
  if (!conversationId || !content) return res.status(400).json({ error: 'missing' });
  try {
    const msg = await prisma.typebotMessage.create({ data: { conversationId, sender: 'user', content } });
    // Simple bot reply: confirmation
    const bot = await prisma.typebotMessage.create({ data: { conversationId, sender: 'bot', content: 'Registro recebido e encaminhado ao setor responsável.' } });
    res.json({ user: msg, bot });
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

// Authenticated message (existing)
router.post('/message', authenticate, async (req, res) => {
  const { conversationId, content } = req.body;
  const convId = conversationId ?? (await prisma.typebotConversation.create({ data: { userId: req.auth?.sub, sectorId: req.auth?.sectorId ?? undefined } })).id;
  const msg = await prisma.typebotMessage.create({ data: { conversationId: convId, sender: 'user', content } });
  res.json({ conversationId: convId, message: msg });
});

// upload file for a conversation (multipart)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no_file' });
    const { originalname, filename, path: fp } = req.file as any;
    const destDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, originalname);
    fs.renameSync(fp, dest);

    const { conversationId, sector, uploadedBy } = req.body;
    const doc = await prisma.uploadedDocument.create({ data: { sector: sector ?? 'unknown', documentType: 'typebot-upload', fileName: originalname, uploadedBy: uploadedBy ?? 'public', uploadedAt: new Date().toISOString() } });

    // Optionally: queue OCR job — placeholder
    res.json({ ok: true, document: doc });
  } catch (err) {
    res.status(500).json({ error: 'upload_failed' });
  }
});

// Admin: create/update chat config for a sector (requires auth)
router.post('/config', authenticate, async (req, res) => {
  const { sectorId, label, buttons } = req.body;
  // allow only master to change
  if (req.auth?.role !== 'master') return res.status(403).json({ error: 'forbidden' });
  if (!sectorId) return res.status(400).json({ error: 'missing_sector' });
  const existing = await prisma.chatConfig.findFirst({ where: { sectorId } });
  if (existing) {
    const updated = await prisma.chatConfig.update({ where: { id: existing.id }, data: { label: label ?? existing.label, buttons } });
    return res.json(updated);
  }
  const created = await prisma.chatConfig.create({ data: { sectorId, label: label ?? `Config ${sectorId}`, buttons } });
  res.json(created);
});

export default router;
