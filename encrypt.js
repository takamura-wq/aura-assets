const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ==========================================
// PENGATURAN: GANTI BAGIAN INI SAJA
// ==========================================
const password = 'kunci-rahasia-satu'; // Password khusus untuk file ini
const inputFile = 'foto1.jpg';         // Nama file asli (bisa .jpg, .png, .mp4)
// ==========================================

// 1. Ambil ekstensi file (.jpg, .mp4, dll) untuk disimpan di dalam enkripsi
const ext = path.extname(inputFile).toLowerCase();
const extBuffer = Buffer.from(ext);
const extLength = Buffer.from([extBuffer.length]);

// 2. Baca file asli
const fileData = fs.readFileSync(inputFile);

// 3. Gabungkan informasi ekstensi dengan data file
const payload = Buffer.concat([extLength, extBuffer, fileData]);

// 4. Buat kunci dari password
const key = crypto.createHash('sha256').update(password).digest();
const iv = crypto.randomBytes(12);

// 5. Enkripsi data
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
const authTag = cipher.getAuthTag();

// 6. Buat nama file berdasarkan Hash SHA-256 dari password (Format Hex)
const fileNameHash = crypto.createHash('sha256').update(password).digest('hex');
const outputFile = `${fileNameHash}.enc`;

// 7. Simpan file
const finalBuffer = Buffer.concat([iv, encrypted, authTag]);
fs.writeFileSync(outputFile, finalBuffer);

console.log(`\n✅ BERHASIL ENKRIPSI!`);
console.log(`File asli       : ${inputFile}`);
console.log(`Password        : ${password}`);
console.log(`File Rahasia    : ${outputFile}`);
console.log(`\n-> Upload file '${outputFile}' ke GitHub-mu.`);