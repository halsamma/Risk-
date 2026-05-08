import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../config/database';
import { authenticate, ownsAssessment } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';
import { generateSecureId } from '../utils/crypto';
import { analyzeDocument } from '../services/claude';
import { logger } from '../utils/logger';
import { auditLog } from '../utils/audit';

const router = Router();

// POST /api/assessments/:id/documents
router.post('/:id/documents', authenticate, ownsAssessment, uploadMiddleware.array('files', 5), async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  const assessment = db.prepare('SELECT scope FROM assessments WHERE id = ?').get(req.params.id) as any;
  const savedDocs: any[] = [];

  for (const file of files) {
    const docId = generateSecureId();
    db.prepare(`
      INSERT INTO documents (id, assessment_id, user_id, filename, original_name, mime_type, size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(docId, req.params.id, req.user!.userId, file.filename, file.originalname, file.mimetype, file.size);
    savedDocs.push({ id: docId, originalName: file.originalname, size: file.size });
  }

  auditLog('document.upload', { userId: req.user!.userId, resourceType: 'assessment', resourceId: req.params.id, req, details: { count: files.length } });

  // Trigger async analysis
  Promise.all(savedDocs.map(async (doc) => {
    try {
      const file = files.find(f => f.filename === db.prepare('SELECT filename FROM documents WHERE id = ?').get(doc.id) as any);
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', (db.prepare('SELECT filename FROM documents WHERE id = ?').get(doc.id) as any).filename);
      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf-8');
      const scope = JSON.parse(assessment.scope);
      const result = await analyzeDocument(content.slice(0, 50000), scope);

      db.prepare(`UPDATE documents SET analysis_result = ?, analyzed_at = datetime('now') WHERE id = ?`)
        .run(JSON.stringify(result), doc.id);
    } catch (err) {
      logger.error(`Document analysis failed for ${doc.id}:`, err);
    }
  })).catch(() => {});

  res.status(201).json({ uploaded: savedDocs, message: 'Documents uploaded. Analysis will be available shortly.' });
});

// GET /api/assessments/:id/documents
router.get('/:id/documents', authenticate, ownsAssessment, (_req: Request, res: Response) => {
  const docs = db.prepare('SELECT id, original_name, mime_type, size, analyzed_at, created_at FROM documents WHERE assessment_id = ? ORDER BY created_at DESC').all(_req.params.id);
  res.json(docs);
});

// GET /api/assessments/:id/documents/:docId/analysis
router.get('/:id/documents/:docId/analysis', authenticate, ownsAssessment, (req: Request, res: Response) => {
  const doc = db.prepare('SELECT analysis_result, analyzed_at FROM documents WHERE id = ? AND assessment_id = ?').get(req.params.docId, req.params.id) as any;
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  if (!doc.analysis_result) {
    res.status(202).json({ message: 'Analysis in progress', analyzedAt: null });
    return;
  }
  res.json({ analysis: JSON.parse(doc.analysis_result), analyzedAt: doc.analyzed_at });
});

// DELETE /api/assessments/:id/documents/:docId
router.delete('/:id/documents/:docId', authenticate, ownsAssessment, (req: Request, res: Response) => {
  const doc = db.prepare('SELECT filename FROM documents WHERE id = ? AND assessment_id = ?').get(req.params.docId, req.params.id) as any;
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }

  // Remove file from disk
  const filePath = path.join(process.env.UPLOAD_DIR || './uploads', doc.filename);
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch {}

  db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.docId);
  auditLog('document.delete', { userId: req.user!.userId, resourceType: 'document', resourceId: req.params.docId, req });
  res.json({ message: 'Document deleted' });
});

export default router;
