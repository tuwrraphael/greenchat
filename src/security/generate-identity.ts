import { uuid } from "../uuid";
import { IUserInfo } from "../models/IUserInfo";

export async function generateIdentity() {
    const encryptionKey = await crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, false, ["encrypt", "decrypt"]);
    const signingKey = await crypto.subtle.generateKey({
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, false, ["sign", "verify"]);
    return <IUserInfo>{ encryptionKey, signingKey, clientId: uuid() };
}