import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const bookImagesFolder = join(process.cwd(), 'public', 'books');
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      mkdir(bookImagesFolder, { recursive: true }).then(
        () => callback(null, bookImagesFolder),
        (error: Error) => callback(error, bookImagesFolder),
      );
    },
    filename: (_req, _file, callback) => {
      callback(null, `${randomUUID()}.pdf`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      callback(new Error('Upload a PDF file.'));
      return;
    }

    callback(null, true);
  },
});

const app = express();
const angularApp = new AngularNodeAppEngine();

app.post('/public/books', (req, res) => {
  upload.single('book')(req, res, (error) => {
    if (error) {
      const status = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      res.status(status).json({ message: error.message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'Choose a PDF to upload.' });
      return;
    }

    res.status(201).json({ pdfUrl: `/books/${req.file.filename}` });
  });
});

app.use('/books', express.static(bookImagesFolder));

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
