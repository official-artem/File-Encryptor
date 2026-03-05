# File Encryptor

CLI utility for encrypting and decrypting files using AES-256-CBC/AES-128-CBC.

## Usage

**Encrypt:**
node encrypt.js encrypt <file> [--algo aes-256-cbc/aes-128-cbc]

**Decrypt:**
node encrypt.js decrypt <file.enc>

## How it works

- Password-based key derivation via scrypt (memory-hard, resistant to brute-force);
- File format: [salt 16b][IV 16b][encrypted data]
- Original file is never modified
