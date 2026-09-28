import express from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// const booksFolder = join(process.cwd(), 'public', 'books');
const booksFolder = 'E:\\publication\\public\\books';
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      mkdir(booksFolder, { recursive: true }).then(
        () => callback(null, booksFolder),
        (error) => callback(error, booksFolder),
      );
    },
    filename: (_req, _file, callback) => callback(null, `${randomUUID()}.pdf`),
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      callback(new Error('The selected file is not recognized as a PDF.'));
      return;
    }

    callback(null, true);
  },
});

const app = express();

app.post('/uploads/books', (req, res) => {
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

app.use('/books', express.static(booksFolder));

app.listen(4000, () => {
  console.log('Book upload server listening on http://localhost:4000');
});