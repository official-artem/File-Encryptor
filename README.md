# File Encryptor

CLI utility for encrypting and decrypting files using AES-256-CBC.

## Usage

**Encrypt:**
node encrypt.js encrypt <file> [--algo aes-256-cbc]

**Decrypt:**
node encrypt.js decrypt <file.enc>

## How it works

- Password is derived using scrypt (salt + 10000 iterations)
- File format: [salt 16b][IV 16b][encrypted data]
- Original file is never modified
