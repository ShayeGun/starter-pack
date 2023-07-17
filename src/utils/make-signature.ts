import { readFile } from 'node:fs/promises'
import crypto from 'node:crypto'

const makeSignature = async (data: string, privateKeyPath: string) => {
    // encode data to UTF64LE
    const UTF16Data = Buffer.from(data, 'utf16le');

    // read private-key file
    const privateKey = await readFile(privateKeyPath);

    // Sign the encoded-data with the private key
    const sign = crypto.createSign('RSA-SHA1');
    sign.update(UTF16Data);
    sign.end();

    const signature = sign.sign(privateKey, 'base64');

    return signature

}

export { makeSignature }