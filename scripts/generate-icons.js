import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth: 8
  ihdr.writeUInt8(6, 9); // color type: RGBA (6)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with scanline filter bytes
  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width * 0.45;
  const innerR = width * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter type 0: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient or circle
      if (dist <= innerR) {
        // Gold emblem center
        raw[pxOffset] = 245;     // R (Gold)
        raw[pxOffset + 1] = 158; // G
        raw[pxOffset + 2] = 11;  // B
        raw[pxOffset + 3] = 255; // A
      } else if (dist <= maxR) {
        // Emerald body
        const factor = (y / height);
        raw[pxOffset] = Math.round(5 * (1 - factor));      // 5 to 4
        raw[pxOffset + 1] = Math.round(150 - 40 * factor); // 150 to 110
        raw[pxOffset + 2] = Math.round(105 - 30 * factor); // 105 to 75
        raw[pxOffset + 3] = 255;
      } else {
        // Deep emerald background
        raw[pxOffset] = 4;
        raw[pxOffset + 1] = 47;
        raw[pxOffset + 2] = 46;
        raw[pxOffset + 3] = 255;
      }
    }
  }

  const deflated = zlib.deflateSync(raw);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 table & function
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
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, 5, 150, 105));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, 5, 150, 105));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, 5, 150, 105));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, 5, 150, 105));
fs.writeFileSync('public/favicon.ico', createPNG(32, 32, 5, 150, 105));
console.log('PWA PNG Icons generated successfully.');
