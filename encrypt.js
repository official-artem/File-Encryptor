import {
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from "crypto";
import fs from "fs";
import { stdout, stdin } from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

function checkIsFileExist(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Error: file not found: ${filePath}`);

    process.exit(1);
  }
}

const params = process.argv.slice(2);
const command = params[0];
const filePath = params[1];
let algo = null;
const algmMethodIndex = params.findIndex((p) => p === "--algo");
if (algmMethodIndex !== -1) {
  algo = params[algmMethodIndex + 1];
} else {
  algo = "aes-256-cbc";
}

if (!command || !filePath) {
  console.log(
    "Usage: node encrypt.js <encrypt|decrypt> <file> [--algo aes-256]",
  );

  process.exit(1);
}

if (command !== "encrypt" && command !== "decrypt") {
  console.log(`Unknown command: ${command}`);

  process.exit(1);
}

function encrypt(filePath, algo) {
  const salt = randomBytes(16);
  const iv = randomBytes(16);

  checkIsFileExist(filePath);

  const fileContent = fs.readFileSync(filePath);

  rl.question("Enter password: \n", (password) => {
    process.stdout.write("\n");

    const key = scryptSync(password, salt, 32);

    const cipher = createCipheriv("aes-256-cbc", key, iv);

    const encrypted = Buffer.concat([
      cipher.update(fileContent),
      cipher.final(),
    ]);

    const encryptedData = Buffer.concat([salt, iv, encrypted]);

    const outPath = filePath + ".enc";

    fs.writeFileSync(outPath, encryptedData);

    console.log(`Created: ${outPath}`);

    rl.close();
  });

  rl.stdoutMuted = true;
  rl._writeToOutput = (char) => {
    if (rl.stdoutMuted) process.stdout.write("*");
    else process.stdout.write(char);
  };
}

function decrypt(filePath) {
  checkIsFileExist(filePath);

  console.log(`Decrypting ${filePath}...`);

  const fileContent = fs.readFileSync(filePath);
  const salt = fileContent.subarray(0, 16);
  const iv = fileContent.subarray(16, 32);
  const data = fileContent.subarray(32);

  rl.question("Enter the password: \n", (password) => {
    process.stdout.write("\n");

    const key = scryptSync(password, salt, 32);

    const cipher = createDecipheriv("aes-256-cbc", key, iv);

    try {
      const decryptedData = Buffer.concat([
        cipher.update(data),
        cipher.final(),
      ]);
      const outPath = filePath.replace(".enc", "");

      fs.writeFileSync(outPath, decryptedData);

      console.log(`Decrypted: ${outPath}`);
      rl.close();
    } catch (error) {
      console.log("Error: wrong password or corrupted file.");

      process.exit(1);
    }
  });

  rl.stdoutMuted = true;
  rl._writeToOutput = (char) => {
    if (rl.stdoutMuted) process.stdout.write("*");
    else process.stdout.write(char);
  };
}

if (command === "encrypt") {
  encrypt(filePath, algo);
} else {
  decrypt(filePath);
}
