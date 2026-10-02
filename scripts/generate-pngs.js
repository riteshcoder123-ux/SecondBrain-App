import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal uncompressed raw PNG generator in pure Node.js
function createSolidPng(width, height, r, g, b, a = 255) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Draw dark background (#090a0f) and an inner circle/glyph
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.35;

      if (dist < radius && dist > radius - width * 0.08) {
        // Ring
        rawData[pxOffset] = 245;
        rawData[pxOffset + 1] = 245;
        rawData[pxOffset + 2] = 244;
        rawData[pxOffset + 3] = 255;
      } else if (dist < width * 0.08) {
        // Center dot
        rawData[pxOffset] = 245;
        rawData[pxOffset + 1] = 245;
        rawData[pxOffset + 2] = 244;
        rawData[pxOffset + 3] = 255;
      } else {
        // Dark Obsidian base
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ -1;
}

const pubDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

// 192x192
const pwa192 = createSolidPng(192, 192, 9, 10, 15);
fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), pwa192);

// 512x512
const pwa512 = createSolidPng(512, 512, 9, 10, 15);
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), pwa512);

// Maskable 512x512
const pwaMaskable = createSolidPng(512, 512, 9, 10, 15);
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// Apple touch icon 180x180
const appleIcon = createSolidPng(180, 180, 9, 10, 15);
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), appleIcon);

console.log('PWA PNG icons generated successfully!');
