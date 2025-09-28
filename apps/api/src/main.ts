/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { CreateTrackDto, Track } from './models/track.dto';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import { env } from 'process';

const assetsLocation = env['ASSETS_DIR'] || __dirname + '../../../assets';

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
const upload = multer({
  dest: path.join(assetsLocation, 'tmp'),
});

app.use('/assets', express.static(path.join(assetsLocation)));

app.get('/stream/:id', (req, res) => {
  return res.sendFile(path.join(assetsLocation, 'songs', `${req.params.id}`));
});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.get('/track/:id', (req, res) => {
  const songId = req.params.id;
  const dbPath = path.join(assetsLocation, 'songs', 'db.json');
  if (!fs.existsSync(dbPath)) {
    return res.status(404).send({ message: 'Track database not found' });
  }
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const track = db[songId];
  if (!track) {
    return res.status(404).send({ message: 'Track not found' });
  }
  res.send(track);
});

// Accepts audio file upload and track metadata
app.post('/track', upload.single('audio'), (req, res) => {
  try {
    const data = req.body as CreateTrackDto;
    const songId = randomUUID();
    const tmpPath = req['file']?.path;
    if (!tmpPath) {
      return res.status(400).send({ message: 'No audio file uploaded' });
    }

    // Convert to mp3 and save
    const songsDir = path.join(assetsLocation, 'songs');
    fs.mkdirSync(songsDir, { recursive: true });
    const outPath = path.join(songsDir, `${songId}.mp3`);

    ffmpeg(tmpPath)
      .toFormat('mp3')
      .on('end', () => {
        fs.unlinkSync(tmpPath); // Remove temp file

        // Save song info to db.json
        const dbPath = path.join(songsDir, 'db.json');
        let db: Record<string, Track> = {};
        if (fs.existsSync(dbPath)) {
          db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        }
        db[songId] = { ...data, id: songId };
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        res.send({ message: 'File uploaded!', id: songId });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send({ message: 'Audio conversion error' });
      })
      .save(outPath);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
